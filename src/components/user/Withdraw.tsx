import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useAuth } from "../../contexts/AuthContext";
import { db } from "../../firebase";
import {
  addDoc,
  collection,
  getDocs,
  query,
  where,
  orderBy,
  limit,
} from "firebase/firestore";
import { encryptSensitiveData } from "../../utils/encryption";
import BalanceDisplay from "./withdraw/BalanceDisplay";
import WithdrawForm from "./withdraw/WithdrawForm";
import RecentWithdrawRequests from "./withdraw/RecentWithdrawRequests";

interface Transaction {
  id: string;
  userId: string;
  type: "deposit" | "withdraw" | "buy" | "sell";
  amount: number;
  status: string;
  date: Date;
}

interface WithdrawRequest {
  id: string;
  userId: string;
  amount: number;
  withdrawMethod: string;
  status: string;
  date: Date;
}

const Withdraw: React.FC = () => {
  const { user } = useAuth();
  const [balance, setBalance] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [withdrawRequests, setWithdrawRequests] = useState<WithdrawRequest[]>(
    []
  );
  const [error, setError] = useState<string | null>(null);
  const {
    handleSubmit,
    control,
    watch,
    formState: { errors },
    reset,
  } = useForm();

  useEffect(() => {
    if (user) {
      fetchTransactions();
      fetchWithdrawRequests();
    }
  }, [user]);

  const fetchTransactions = async () => {
    try {
      // 1. Récupérer toutes les transactions complétées
      const transactionsRef = collection(db, "transactions");
      const transactionsQuery = query(
        transactionsRef,
        where("userId", "==", user?.uid)
      );
      const transactionsSnapshot = await getDocs(transactionsQuery);

      // Calculer le solde des transactions complétées
      const transactionBalance = transactionsSnapshot.docs.reduce(
        (acc, doc) => {
          const transaction = doc.data();
          const amount = Number(transaction.amount) || 0;
          if (transaction.type === "deposit" || transaction.type === "sell") {
            return acc + amount;
          } else if (
            transaction.type === "withdraw" ||
            transaction.type === "buy"
          ) {
            return acc - amount;
          }
          return acc;
        },
        0
      );

      // 2. Récupérer TOUTES les demandes de retrait
      const withdrawRequestsRef = collection(db, "withdrawRequests");
      const withdrawRequestsQuery = query(
        withdrawRequestsRef,
        where("userId", "==", user?.uid)
      );
      const withdrawRequestsSnapshot = await getDocs(withdrawRequestsQuery);

      // Calculer le total de TOUTES les demandes de retrait
      const totalWithdraws = withdrawRequestsSnapshot.docs.reduce(
        (acc, doc) => {
          const withdrawRequest = doc.data();
          return acc + (Number(withdrawRequest.amount) || 0);
        },
        0
      );

      // 3. Calculer le solde final
      const finalBalance = transactionBalance - totalWithdraws;
      setBalance(finalBalance);
    } catch (error) {
      console.error("Error fetching transactions:", error);
      toast.error("Failed to fetch transactions");
    }
  };

  const fetchWithdrawRequests = async () => {
    setError(null);
    try {
      if (!user) {
        throw new Error("User not authenticated");
      }

      const withdrawRequestsRef = collection(db, "withdrawRequests");
      const q = query(
        withdrawRequestsRef,
        where("userId", "==", user.uid),
        orderBy("date", "desc"),
        limit(5)
      );

      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        setWithdrawRequests([]);
        return;
      }

      const requests = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          date: data.date.toDate(),
        } as WithdrawRequest;
      });

      setWithdrawRequests(requests);
    } catch (error: any) {
      console.error("Error fetching withdraw requests:", error);
      if (
        error.code === "failed-precondition" &&
        error.message.includes("index")
      ) {
        setError(
          "The system is currently updating. Please try again in a few minutes."
        );
      } else {
        setError(`Failed to fetch withdraw requests: ${error.message}`);
      }
    }
  };

  const calculateAvailableBalance = async (userId: string): Promise<number> => {
    try {
      // Récupérer toutes les transactions
      const transactionsRef = collection(db, "transactions");
      const transactionsQuery = query(
        transactionsRef,
        where("userId", "==", userId),
        where("status", "==", "complete")
      );
      const transactionsSnapshot = await getDocs(transactionsQuery);

      // Calculer le solde des transactions
      const transactionBalance = transactionsSnapshot.docs.reduce(
        (acc, doc) => {
          const transaction = doc.data();
          if (transaction.type === "deposit" || transaction.type === "sell") {
            return acc + transaction.amount;
          } else if (
            transaction.type === "withdraw" ||
            transaction.type === "buy"
          ) {
            return acc - transaction.amount;
          }
          return acc;
        },
        0
      );

      // Récupérer les retraits en attente
      const withdrawRequestsRef = collection(db, "withdrawRequests");
      const withdrawRequestsQuery = query(
        withdrawRequestsRef,
        where("userId", "==", userId),
        where("status", "==", "pending")
      );
      const withdrawRequestsSnapshot = await getDocs(withdrawRequestsQuery);

      // Calculer le total des retraits en attente
      const pendingWithdrawsTotal = withdrawRequestsSnapshot.docs.reduce(
        (acc, doc) => acc + doc.data().amount,
        0
      );

      // Retourner le solde disponible
      return transactionBalance - pendingWithdrawsTotal;
    } catch (error) {
      console.error("Error calculating available balance:", error);
      throw new Error("Failed to calculate available balance");
    }
  };

  const onSubmit = async (data: any) => {
    setLoading(true);
    try {
      if (!user) throw new Error("User not authenticated");

      // Vérifier si le retrait est possible avec le solde actuel
      if (data.amount > balance) {
        throw new Error(
          "Insufficient balance (including all withdraw requests)"
        );
      }

      const encryptedData = encryptSensitiveData({
        accountNumber: data.accountNumber,
        routingNumber: data.routingNumber,
        cardNumber: data.cardNumber,
        bankAddress: data.bankAddress,
        swiftCode: data.swiftCode,
        accountName: data.accountName,
        expirationDate: data.expirationDate,
        walletAddress: data.walletAddress,
        cryptoType: data.cryptoType,
        cvv: data.cvv,
        pin: data.pin,
      });

      const withdrawRequest = {
        userId: user.uid,
        amount: parseFloat(data.amount),
        withdrawMethod: data.withdrawMethod,
        status: "pending",
        date: new Date(),
        encryptedData: encryptedData,
      };

      await addDoc(collection(db, "withdrawRequests"), withdrawRequest);
      toast.success("Withdraw request submitted successfully");
      reset();
      fetchWithdrawRequests();
      fetchTransactions();
    } catch (error: any) {
      console.error("Error submitting withdraw request:", error);
      toast.error(error.message || "Failed to submit withdraw request");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Withdraw Funds</h2>
      <BalanceDisplay balance={balance} />
      <WithdrawForm
        onSubmit={handleSubmit(onSubmit)}
        control={control}
        errors={errors}
        watch={watch}
        loading={loading}
        balance={balance}
      />
      <RecentWithdrawRequests
        withdrawRequests={withdrawRequests}
        error={error}
      />
    </div>
  );
};

export default Withdraw;
