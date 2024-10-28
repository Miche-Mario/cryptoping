import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { db } from "../../firebase";
import {
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
  orderBy,
  limit,
} from "firebase/firestore";
import { toast } from "react-toastify";
import { getTopCryptos, CoinData } from "../../services/cryptoService";
import { QRCodeSVG } from "qrcode.react";
import {
  Eye,
  EyeOff,
  TrendingUp,
  TrendingDown,
  ChevronDown,
  ChevronUp,
  ArrowUpRight,
  ArrowDownLeft,
} from "lucide-react";

interface Transaction {
  id: string;
  type: "buy" | "sell" | "withdraw" | "deposit";
  amount: number;
  cryptocurrency?: string;
  status: string;
  date: Date;
}

// Ajouter cette interface
interface PendingWithdraw {
  id: string;
  userId: string;
  amount: number;
  withdrawMethod: string;
  status: string;
  date: Date;
  encryptedData?: string;
}

const Wallet: React.FC = () => {
  const { user } = useAuth();
  const [balance, setBalance] = useState<number>(0);
  const [showBalance, setShowBalance] = useState<boolean>(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [cryptoPrices, setCryptoPrices] = useState<CoinData[]>([]);
  const [walletCode, setWalletCode] = useState<string>("");
  const [showFullWalletCode, setShowFullWalletCode] = useState<boolean>(false);

  useEffect(() => {
    if (user) {
      fetchUserData();
      fetchCryptoPrices();
    }
  }, [user]);

  const fetchUserData = async () => {
    if (!user) return;
    try {
      // Récupérer le wallet code
      const userDocRef = doc(db, "users", user.uid);
      const userDocSnap = await getDoc(userDocRef);
      if (userDocSnap.exists()) {
        const userData = userDocSnap.data();
        setWalletCode(userData.walletCode || "");
      }

      // 1. Récupérer toutes les transactions complétées
      const transactionsRef = collection(db, "transactions");
      const transactionsQuery = query(
        transactionsRef,
        where("userId", "==", user.uid),
        orderBy("date", "desc")
      );
      const transactionsSnapshot = await getDocs(transactionsQuery);
      const fetchedTransactions = transactionsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        amount:
          typeof doc.data().amount === "string"
            ? parseFloat(doc.data().amount)
            : Number(doc.data().amount) || 0,
        date: doc.data().date.toDate(),
      })) as Transaction[];

      // 2. Calculer le solde des transactions complétées
      const transactionBalance = fetchedTransactions.reduce(
        (acc, transaction) => {
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

      // 3. Récupérer TOUTES les demandes de retrait (tous statuts confondus)
      const withdrawRequestsRef = collection(db, "withdrawRequests");
      const withdrawRequestsQuery = query(
        withdrawRequestsRef,
        where("userId", "==", user.uid)
      );
      const withdrawRequestsSnapshot = await getDocs(withdrawRequestsQuery);

      // 4. Calculer le total de TOUTES les demandes de retrait
      const totalWithdraws = withdrawRequestsSnapshot.docs.reduce(
        (acc, doc) => {
          const withdrawRequest = doc.data();
          return acc + (Number(withdrawRequest.amount) || 0);
        },
        0
      );

      // 5. Calculer le solde final
      const finalBalance = transactionBalance - totalWithdraws;

      setBalance(finalBalance);
      setTransactions(fetchedTransactions);
    } catch (error) {
      console.error("Error fetching user data:", error);
      toast.error("Failed to fetch user data");
    }
  };

  const fetchCryptoPrices = async () => {
    try {
      const prices = await getTopCryptos(10);
      setCryptoPrices(prices);
    } catch (error) {
      console.error("Error fetching crypto prices:", error);
      toast.error("Failed to fetch cryptocurrency prices");
    }
  };

  const toggleShowBalance = () => {
    setShowBalance(!showBalance);
  };

  const toggleShowFullWalletCode = () => {
    setShowFullWalletCode(!showFullWalletCode);
  };

  const displayWalletCode = () => {
    if (showFullWalletCode) {
      return walletCode;
    }
    return walletCode.slice(0, 12) + "...";
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case "deposit":
      case "sell":
        return <ArrowDownLeft className="text-green-500" />;
      case "withdraw":
      case "buy":
        return <ArrowUpRight className="text-red-500" />;
      default:
        return null;
    }
  };

  const getTransactionColor = (type: string) => {
    switch (type) {
      case "deposit":
      case "sell":
        return "text-green-600";
      case "withdraw":
      case "buy":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Your Wallet</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Balance</h2>
          <div className="flex items-center">
            <p className="text-3xl font-bold mr-2 ">
              {showBalance ? `$${balance.toFixed(2)}` : "••••••"}
            </p>
            <button
              onClick={toggleShowBalance}
              className="text-blue-600 hover:text-blue-800"
            >
              {showBalance ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>

        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Wallet Code</h2>
          <div className="flex flex-col items-center">
            <QRCodeSVG value={walletCode} size={120} />
            <div className="mt-4 text-lg font-medium break-all">
              <p className="lowercase">{displayWalletCode()}</p>
              <button
                onClick={toggleShowFullWalletCode}
                className="mt-2 flex items-center text-blue-600 hover:text-blue-800"
              >
                {showFullWalletCode ? (
                  <>
                    <ChevronUp size={20} className="mr-1" />
                    Hide
                  </>
                ) : (
                  <>
                    <ChevronDown size={20} className="mr-1" />
                    Show More
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Recent Transactions</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Type
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Amount
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Status
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {transactions.map((transaction) => (
                <tr key={transaction.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {getTransactionIcon(transaction.type)}
                      <span
                        className={`ml-2 ${getTransactionColor(
                          transaction.type
                        )} capitalize`}
                      >
                        {transaction.type}
                      </span>
                    </div>
                  </td>
                  <td
                    className={`px-6 py-4 whitespace-nowrap ${getTransactionColor(
                      transaction.type
                    )}`}
                  >
                    {transaction.type === "withdraw" ||
                    transaction.type === "buy"
                      ? "-"
                      : "+"}
                    $
                    {typeof transaction.amount === "number"
                      ? transaction.amount.toFixed(2)
                      : "0.00"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        transaction.status.toLowerCase() === "complete"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {transaction.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {transaction.date.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-8 bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Cryptocurrency Prices</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Rank
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Name
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Price
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  24h Change
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {cryptoPrices.map((crypto) => (
                <tr key={crypto.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {crypto.market_cap_rank}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <img
                        src={crypto.image}
                        alt={crypto.name}
                        className="w-6 h-6 mr-2"
                      />
                      <span className="font-medium">{crypto.name}</span>
                      <span className="ml-2 text-gray-500">
                        {crypto.symbol.toUpperCase()}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    ${crypto.current_price.toFixed(2)}
                  </td>
                  <td
                    className={`px-6 py-4 whitespace-nowrap text-right text-sm font-medium ${
                      crypto.price_change_percentage_24h >= 0
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    <span className="flex items-center justify-end">
                      {crypto.price_change_percentage_24h >= 0 ? (
                        <TrendingUp size={16} className="mr-1" />
                      ) : (
                        <TrendingDown size={16} className="mr-1" />
                      )}
                      {crypto.price_change_percentage_24h.toFixed(2)}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Wallet;
