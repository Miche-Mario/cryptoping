import React, { useState, useEffect } from 'react'
import { db } from '../../firebase'
import { collection, getDocs, query, orderBy, updateDoc, doc } from 'firebase/firestore'
import { toast } from 'react-toastify'

interface Transaction {
  id: string
  userId: string
  type: 'buy' | 'sell' | 'withdraw' | 'deposit'
  amount: number
  cryptocurrency?: string
  status: string
  date: Date
}

const TransactionStatus: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [statusTypes, setStatusTypes] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const transactionsRef = collection(db, 'transactions')
        const q = query(transactionsRef, orderBy('date', 'desc'))
        const querySnapshot = await getDocs(q)
        const fetchedTransactions = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          date: doc.data().date.toDate(),
          amount: parseFloat(doc.data().amount) // Ensure amount is a number
        } as Transaction))
        console.log('Fetched transactions in admin:', fetchedTransactions)
        setTransactions(fetchedTransactions)

        const statusTypesRef = collection(db, 'statusTypes')
        const statusTypesSnapshot = await getDocs(statusTypesRef)
        const fetchedStatusTypes = statusTypesSnapshot.docs.map(doc => doc.data().name)
        setStatusTypes(['Pending', 'Complete', ...fetchedStatusTypes])
      } catch (error) {
        console.error('Error fetching data:', error)
        toast.error('Failed to fetch transactions and status types')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleStatusChange = async (transactionId: string, newStatus: string) => {
    try {
      await updateDoc(doc(db, 'transactions', transactionId), { status: newStatus })
      setTransactions(transactions.map(transaction => 
        transaction.id === transactionId ? { ...transaction, status: newStatus } : transaction
      ))
      console.log(`Transaction ${transactionId} status updated to ${newStatus}`)
      toast.success(`Transaction status updated to ${newStatus}`)
    } catch (error) {
      console.error('Error updating transaction status:', error)
      toast.error('Failed to update transaction status')
    }
  }

  if (loading) {
    return <div>Loading transactions...</div>
  }

  return (
    <div className="container mx-auto px-4">
      <h2 className="text-2xl font-bold mb-4">Transaction Status</h2>
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">ID</th>
            <th className="py-2 px-4 border-b">User</th>
            <th className="py-2 px-4 border-b">Type</th>
            <th className="py-2 px-4 border-b">Amount</th>
            <th className="py-2 px-4 border-b">Status</th>
            <th className="py-2 px-4 border-b">Date</th>
            <th className="py-2 px-4 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction) => (
            <tr key={transaction.id}>
              <td className="py-2 px-4 border-b">{transaction.id}</td>
              <td className="py-2 px-4 border-b">{transaction.userId}</td>
              <td className="py-2 px-4 border-b">{transaction.type}</td>
              <td className="py-2 px-4 border-b">${transaction.amount.toFixed(2)}</td>
              <td className="py-2 px-4 border-b">{transaction.status}</td>
              <td className="py-2 px-4 border-b">{transaction.date.toLocaleString()}</td>
              <td className="py-2 px-4 border-b">
                <select
                  value={transaction.status}
                  onChange={(e) => handleStatusChange(transaction.id, e.target.value)}
                  className="border rounded px-2 py-1"
                >
                  {statusTypes.map((status) => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default TransactionStatus