import React, { useState, useEffect } from 'react'
import { collection, query, orderBy, onSnapshot, doc, updateDoc, addDoc, getDocs, where, limit, runTransaction } from 'firebase/firestore'
import { db } from '../../firebase'
import { toast } from 'react-toastify'
import { useAuth } from '../../contexts/AuthContext'
import { Navigate } from 'react-router-dom'

interface BuyRequest {
  id: string
  userId: string
  cryptocurrency: string
  amount: number
  date: Date
  status: 'pending' | 'approved' | 'rejected'
}

const BuyRequests: React.FC = () => {
  const [buyRequests, setBuyRequests] = useState<BuyRequest[]>([])
  const [loading, setLoading] = useState(true)
  const { user, isAdmin } = useAuth()

  useEffect(() => {
    if (!user || !isAdmin()) {
      setLoading(false)
      return
    }

    const buyRequestsRef = collection(db, 'buyRequests')
    const q = query(buyRequestsRef, orderBy('date', 'desc'))

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const requests = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        date: doc.data().date.toDate()
      } as BuyRequest))
      setBuyRequests(requests)
      setLoading(false)
    }, (error) => {
      console.error("Error fetching buy requests: ", error)
      toast.error("Error fetching buy requests. Please try again.")
      setLoading(false)
    })

    return () => unsubscribe()
  }, [user, isAdmin])

  const handleStatusChange = async (requestId: string, newStatus: 'approved' | 'rejected') => {
    try {
      const requestRef = doc(db, 'buyRequests', requestId)
      await updateDoc(requestRef, { status: newStatus })

      if (newStatus === 'approved') {
        await processApprovedBuyRequest(requestId)
      }

      toast.success(`Buy request ${newStatus}`)
    } catch (error) {
      console.error("Error updating request status:", error)
      toast.error("Failed to update request status. Please try again.")
    }
  }

  const processApprovedBuyRequest = async (requestId: string) => {
    try {
      await runTransaction(db, async (transaction) => {
        const requestRef = doc(db, 'buyRequests', requestId)
        const requestDoc = await transaction.get(requestRef)
        
        if (!requestDoc.exists()) {
          throw new Error("Buy request does not exist!")
        }

        const requestData = requestDoc.data() as BuyRequest
        const userRef = doc(db, 'users', requestData.userId)
        const userDoc = await transaction.get(userRef)

        if (!userDoc.exists()) {
          throw new Error("User does not exist!")
        }

        const userData = userDoc.data()
        const currentBalance = userData.balance || 0
        const newBalance = currentBalance - requestData.amount

        if (newBalance < 0) {
          throw new Error("Insufficient balance")
        }

        transaction.update(userRef, { balance: newBalance })

        const transactionRef = await addDoc(collection(db, 'transactions'), {
          userId: requestData.userId,
          type: 'buy',
          amount: requestData.amount,
          cryptocurrency: requestData.cryptocurrency,
          date: new Date(),
          status: 'complete'
        })

        console.log("Transaction created with ID: ", transactionRef.id)
      })

      toast.success("Buy request processed successfully")
    } catch (error) {
      console.error("Error processing approved buy request:", error)
      toast.error("Failed to process buy request. Please try again.")
    }
  }

  if (loading) {
    return <div>Loading buy requests...</div>
  }

  if (!user || !isAdmin()) {
    return <Navigate to="/login" replace />
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-4">Buy Requests</h2>
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">Date</th>
            <th className="py-2 px-4 border-b">User ID</th>
            <th className="py-2 px-4 border-b">Cryptocurrency</th>
            <th className="py-2 px-4 border-b">Amount</th>
            <th className="py-2 px-4 border-b">Status</th>
            <th className="py-2 px-4 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {buyRequests.map((request) => (
            <tr key={request.id}>
              <td className="py-2 px-4 border-b">{request.date.toLocaleString()}</td>
              <td className="py-2 px-4 border-b">{request.userId}</td>
              <td className="py-2 px-4 border-b">{request.cryptocurrency}</td>
              <td className="py-2 px-4 border-b">${request.amount.toFixed(2)}</td>
              <td className="py-2 px-4 border-b">{request.status}</td>
              <td className="py-2 px-4 border-b">
                {request.status === 'pending' && (
                  <>
                    <button
                      onClick={() => handleStatusChange(request.id, 'approved')}
                      className="bg-green-500 text-white px-2 py-1 rounded mr-2"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleStatusChange(request.id, 'rejected')}
                      className="bg-red-500 text-white px-2 py-1 rounded"
                    >
                      Reject
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default BuyRequests