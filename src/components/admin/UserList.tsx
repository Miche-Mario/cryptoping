import React, { useState, useEffect } from "react";
import { db } from "../../firebase";
import {
  collection,
  getDocs,
  doc,
  deleteDoc,
  query,
  where,
  writeBatch,
} from "firebase/firestore";
import { toast } from "react-toastify";
import { Trash2 } from "lucide-react";

interface User {
  id: string;
  email: string;
  walletCode: string;
  fullName: string;
  registrationDate?: Date;
}

const UserList: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingUserId, setDeletingUserId] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const usersRef = collection(db, "users");
      const querySnapshot = await getDocs(usersRef);
      const fetchedUsers = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          fullName: data.fullName,
          email: data.email,
          walletCode: data.walletCode,
          registrationDate: data.registrationDate
            ? new Date(data.registrationDate.seconds * 1000)
            : undefined,
        } as User;
      });
      setUsers(fetchedUsers);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    setDeletingUserId(userId);

    // Demander confirmation
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this user? This action cannot be undone and will delete all associated data."
    );

    if (!isConfirmed) {
      setDeletingUserId(null);
      return;
    }

    try {
      const batch = writeBatch(db);

      // 1. Supprimer les transactions
      const transactionsRef = collection(db, "transactions");
      const transactionsQuery = query(
        transactionsRef,
        where("userId", "==", userId)
      );
      const transactionsSnapshot = await getDocs(transactionsQuery);
      transactionsSnapshot.docs.forEach((doc) => {
        batch.delete(doc.ref);
      });

      // 2. Supprimer les demandes de retrait
      const withdrawRequestsRef = collection(db, "withdrawRequests");
      const withdrawRequestsQuery = query(
        withdrawRequestsRef,
        where("userId", "==", userId)
      );
      const withdrawRequestsSnapshot = await getDocs(withdrawRequestsQuery);
      withdrawRequestsSnapshot.docs.forEach((doc) => {
        batch.delete(doc.ref);
      });

      // 3. Supprimer les demandes d'achat
      const buyRequestsRef = collection(db, "buyRequests");
      const buyRequestsQuery = query(
        buyRequestsRef,
        where("userId", "==", userId)
      );
      const buyRequestsSnapshot = await getDocs(buyRequestsQuery);
      buyRequestsSnapshot.docs.forEach((doc) => {
        batch.delete(doc.ref);
      });

      // 4. Supprimer le document utilisateur
      const userRef = doc(db, "users", userId);
      batch.delete(userRef);

      // Exécuter toutes les opérations de suppression
      await batch.commit();

      // Mettre à jour la liste des utilisateurs
      setUsers(users.filter((user) => user.id !== userId));
      toast.success("User and all associated data deleted successfully");
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("Failed to delete user and associated data");
    } finally {
      setDeletingUserId(null);
    }
  };

  if (loading) {
    return <div>Loading users...</div>;
  }

  return (
    <div className="container mx-auto px-4">
      <h2 className="text-2xl font-bold mb-4">User List</h2>
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">User</th>
            <th className="py-2 px-4 border-b">Email</th>
            <th className="py-2 px-4 border-b">Wallet Code</th>
            <th className="py-2 px-4 border-b">Registration Date</th>
            <th className="py-2 px-4 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td className="py-2 px-4 border-b">{user.fullName}</td>
              <td className="py-2 px-4 border-b">{user.email}</td>
              <td className="py-2 px-4 border-b">{user.walletCode}</td>
              <td className="py-2 px-4 border-b">
                {user.registrationDate
                  ? user.registrationDate.toLocaleString()
                  : "N/A"}
              </td>
              <td className="py-2 px-4 border-b">
                <button
                  onClick={() => handleDeleteUser(user.id)}
                  disabled={deletingUserId === user.id}
                  className={`flex items-center justify-center p-2 rounded-full ${
                    deletingUserId === user.id
                      ? "bg-gray-200 cursor-not-allowed"
                      : "bg-red-100 hover:bg-red-200 text-red-600"
                  }`}
                  title="Delete user"
                >
                  {deletingUserId === user.id ? (
                    <div className="w-5 h-5 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <Trash2 size={20} />
                  )}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserList;
