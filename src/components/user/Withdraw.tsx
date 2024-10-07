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
  type: 'deposit' | 'withdraw' | 'buy' | 'sell';
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
  const [withdrawRequests, setWithdrawRequests] = useState<WithdrawRequest[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { handleSubmit, control, watch, formState: { errors }, reset } = useForm();

  useEffect(() => {
    if (user) {
      fetchTransactions();
      fetchWithdrawRequests();
    }
  }, [user]);

  const fetchTransactions = async () => {
    try {
      const transactionsRef = collection(db, 'transactions');
      const q = query(
        transactionsRef,
        where('userId', '==', user?.uid),
        orderBy('date', 'desc'),
        limit(5)
      );
      const querySnapshot = await getDocs(q);
      const fetchedTransactions = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          amount: Number(data.amount) || 0,
          date: data.date.toDate()
        } as Transaction;
      });
      calculateBalance(fetchedTransactions);
    } catch (error) {
      console.error('Error fetching transactions:', error);
      toast.error('Failed to fetch transactions');
    }
  };

  const calculateBalance = (transactions: Transaction[]) => {
    const completedTransactions = transactions.filter(t => t.status.toLowerCase() === 'complete');
    const calculatedBalance = completedTransactions.reduce((acc, transaction) => {
      if (transaction.type === 'deposit' || transaction.type === 'sell') {
        return acc + transaction.amount;
      } else if (transaction.type === 'withdraw' || transaction.type === 'buy') {
        return acc - transaction.amount;
      }
      return acc;
    }, 0);
    setBalance(calculatedBalance);
  };

  const fetchWithdrawRequests = async () => {
    setError(null);
    try {
      if (!user) {
        throw new Error('User not authenticated');
      }

      const withdrawRequestsRef = collection(db, 'withdrawRequests');
      const q = query(
        withdrawRequestsRef,
        where('userId', '==', user.uid),
        orderBy('date', 'desc'),
        limit(5)
      );
      
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        setWithdrawRequests([]);
        return;
      }

      const requests = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          date: data.date.toDate()
        } as WithdrawRequest;
      });

      setWithdrawRequests(requests);
    } catch (error: any) {
      console.error('Error fetching withdraw requests:', error);
      if (error.code === 'failed-precondition' && error.message.includes('index')) {
        setError('The system is currently updating. Please try again in a few minutes.');
      } else {
        setError(`Failed to fetch withdraw requests: ${error.message}`);
      }
    }
  };

  const onSubmit = async (data: any) => {
    setLoading(true);
    try {
      if (!user) throw new Error('User not authenticated');
      if (data.amount > balance) throw new Error('Insufficient balance');

     const encryptedData = encryptSensitiveData({
        accountNumber: data.accountNumber,
        routingNumber: data.routingNumber,
        cardNumber: data.cardNumber,
        bankAddress: data.bankAddress,
        swiftCode: data.swiftCode,
        accountName: data.accountName,
        expirationDate: data.expirationDate,
        cvv: data.cvv,
        pin: data.pin // Include PIN for credit card withdrawals
      });

      const withdrawRequest = {
        userId: user.uid,
        amount: parseFloat(data.amount),
        withdrawMethod: data.withdrawMethod,
        status: 'pending',
        date: new Date(),
        encryptedData: encryptedData
      };

      await addDoc(collection(db, 'withdrawRequests'), withdrawRequest);
      toast.success('Withdraw request submitted successfully');
      reset();
      fetchWithdrawRequests();
      fetchTransactions(); // Refresh the balance after submitting a withdraw request
    } catch (error: any) {
      console.error('Error submitting withdraw request:', error);
      toast.error(error.message || 'Failed to submit withdraw request');
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
      <RecentWithdrawRequests withdrawRequests={withdrawRequests} error={error} />
    </div>
  );
};

export default Withdraw;