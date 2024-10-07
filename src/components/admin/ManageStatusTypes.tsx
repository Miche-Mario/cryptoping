import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { db } from "../../firebase";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { toast } from "react-toastify";

interface StatusTypeForm {
  name: string;
}

const ManageStatusTypes: React.FC = () => {
  const [statusTypes, setStatusTypes] = useState<
    Array<{ id: string; name: string }>
  >([]);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<StatusTypeForm>();

  useEffect(() => {
    fetchStatusTypes();
  }, []);

  const fetchStatusTypes = async () => {
    const statusTypesSnapshot = await getDocs(collection(db, "statusTypes"));
    const statusTypesData = statusTypesSnapshot.docs.map((doc) => ({
      id: doc.id,
      name: doc.data().name,
    }));
    setStatusTypes(statusTypesData);
  };

  const onSubmit = async (data: StatusTypeForm) => {
    try {
      await addDoc(collection(db, "statusTypes"), {
        name: data.name,
      });
      toast.success("Status type created successfully");
      reset();
      fetchStatusTypes();
    } catch (error) {
      console.error("Error creating status type:", error);
      toast.error("Failed to create status type");
    }
  };

  const deleteStatusType = async (id: string) => {
    try {
      await deleteDoc(doc(db, "statusTypes", id));
      toast.success("Status type deleted successfully");
      fetchStatusTypes();
    } catch (error) {
      console.error("Error deleting status type:", error);
      toast.error("Failed to delete status type");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-4">Manage Status Types</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mb-8">
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700"
          >
            New Status Type
          </label>
          <input
            type="text"
            id="name"
            placeholder="Enter status  name"
            {...register("name", { required: "Status type name is required" })}
            className="mt-1 block w-full rounded-md border-gray-600 border-2 p-2 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
          )}
        </div>
        <button
          type="submit"
          className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Create Status Type
        </button>
      </form>

      <h3 className="text-xl font-bold mb-2">Existing Status Types</h3>
      <ul className="space-y-2">
        {statusTypes.map((statusType) => (
          <li key={statusType.id} className="flex justify-between items-center">
            <span>{statusType.name}</span>
            <button
              onClick={() => deleteStatusType(statusType.id)}
              className="py-1 px-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ManageStatusTypes;
