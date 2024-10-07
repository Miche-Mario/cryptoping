import React, { useState, useEffect } from 'react'
import { collection, query, getDocs, updateDoc, doc, orderBy } from 'firebase/firestore'
import { db } from '../../firebase'
import { useAuth } from '../../contexts/AuthContext'
import { toast } from 'react-toastify'
import CryptoJS from 'crypto-js'
import { Eye, EyeOff, CheckCircle, XCircle, AlertTriangle, Loader } from 'lucide-react'

interface WithdrawRequest {
  id: string
  userId: string
  amount: number
  withdrawMethod: 'bank' | 'card'
  status: 'pending' | 'approved' | 'rejected'
  date: Date
  encryptedData: string
}

interface DecryptedData {
  [key: string]: string | number
}

const decryptData = (encryptedData: string): DecryptedData | null => {
  try {
    if (!encryptedData) {
      throw new Error('No encrypted data provided')
    }

    const parts = encryptedData.split('.')
    if (parts.length !== 3) {
      throw new Error('Invalid encrypted data format')
    }

    const [ivHex, encryptedMessage, keyHex] = parts
    const iv = CryptoJS.enc.Hex.parse(ivHex)
    const key = CryptoJS.enc.Hex.parse(keyHex)

    const decrypted = CryptoJS.AES.decrypt(encryptedMessage, key, {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    })

    const decryptedString = decrypted.toString(CryptoJS.enc.Utf8)
    if (!decryptedString) {
      throw new Error('Decryption resulted in empty string')
    }

    return JSON.parse(decryptedString)
  } catch (error) {
    console.error('Error in decrypt function:', error)
    return null
  }
}

const WithdrawRequests: React.FC = () => {
  const [withdrawRequests, setWithdrawRequests] = useState<WithdrawRequest[]>([])
  const [loading, setLoading] = useState(true)
  const { user, isAdmin } = useAuth()

  useEffect(() => {
    if (!user || !isAdmin()) {
      setLoading(false)
      return
    }

    const fetchWithdrawRequests = async () => {
      try {
        const withdrawRequestsRef = collection(db, 'withdrawRequests')
        const q = query(withdrawRequestsRef, orderBy('date', 'desc'))
        const querySnapshot = await getDocs(q)
        const requests = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          date: doc.data().date.toDate(),
          amount: parseFloat(doc.data().amount) // Ensure amount is a number
        } as WithdrawRequest))
        setWithdrawRequests(requests)
      } catch (error) {
        console.error('Error fetching withdraw requests:', error)
        toast.error('Failed to fetch withdraw requests')
      } finally {
        setLoading(false)
      }
    }

    fetchWithdrawRequests()
  }, [user, isAdmin])

  const handleStatusChange = async (requestId: string, newStatus: 'approved' | 'rejected') => {
    try {
      const requestRef = doc(db, 'withdrawRequests', requestId)
      await updateDoc(requestRef, { status: newStatus })
      setWithdrawRequests(prevRequests =>
        prevRequests.map(request =>
          request.id === requestId ? { ...request, status: newStatus } : request
        )
      )
      toast.success(`Withdraw request ${newStatus}`)
    } catch (error) {
      console.error('Error updating withdraw request status:', error)
      toast.error('Failed to update withdraw request status')
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader className="animate-spin text-blue-500" size={48} />
      </div>
    )
  }

  if (!user || !isAdmin()) {
    return <div>You do not have permission to view this page.</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-4">Withdraw Requests</h2>
      {withdrawRequests.length === 0 ? (
        <p>No withdraw requests found.</p>
      ) : (
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">Date</th>
              <th className="py-2 px-4 border-b">User ID</th>
              <th className="py-2 px-4 border-b">Amount</th>
              <th className="py-2 px-4 border-b">Method</th>
              <th className="py-2 px-4 border-b">Status</th>
              <th className="py-2 px-4 border-b">Details</th>
              <th className="py-2 px-4 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {withdrawRequests.map((request) => (
              <tr key={request.id}>
                <td className="py-2 px-4 border-b">{request.date.toLocaleString()}</td>
                <td className="py-2 px-4 border-b">{request.userId}</td>
                <td className="py-2 px-4 border-b">${request.amount.toFixed(2)}</td>
                <td className="py-2 px-4 border-b">{request.withdrawMethod}</td>
                <td className="py-2 px-4 border-b">{request.status}</td>
                <td className="py-2 px-4 border-b">
                  <DecryptedData encryptedData={request.encryptedData} />
                </td>
                <td className="py-2 px-4 border-b">
                  {request.status === 'pending' && (
                    <>
                      <button
                        onClick={() => handleStatusChange(request.id, 'approved')}
                        className="bg-green-500 text-white px-2 py-1 rounded mr-2"
                      >
                        <CheckCircle size={16} className="inline mr-1" />
                        Approve
                      </button>
                      <button
                        onClick={() => handleStatusChange(request.id, 'rejected')}
                        className="bg-red-500 text-white px-2 py-1 rounded"
                      >
                        <XCircle size={16} className="inline mr-1" />
                        Reject
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

const DecryptedData: React.FC<{ encryptedData: string }> = ({ encryptedData }) => {
  const [decryptedData, setDecryptedData] = useState<DecryptedData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [showDetails, setShowDetails] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const decrypt = async () => {
      setIsLoading(true)
      if (!encryptedData) {
        setError('No encrypted data available')
        setDecryptedData(null)
      } else {
        const data = decryptData(encryptedData)
        if (data) {
          setDecryptedData(data)
          setError(null)
        } else {
          setError('Unable to decrypt data')
          setDecryptedData(null)
        }
      }
      setIsLoading(false)
    }
    decrypt()
  }, [encryptedData])

  const toggleDetails = () => {
    setShowDetails(!showDetails)
  }

  if (isLoading) {
    return <div>Decrypting data...</div>
  }

  if (error) {
    return (
      <div className="flex items-center text-yellow-500">
        <AlertTriangle size={16} className="mr-1" />
        <span>{error}</span>
      </div>
    )
  }

  return (
    <div>
      <button
        onClick={toggleDetails}
        className="flex items-center text-blue-500 hover:text-blue-700"
      >
        {showDetails ? <EyeOff size={16} /> : <Eye size={16} />}
        <span className="ml-1">{showDetails ? 'Hide' : 'Show'} Details</span>
      </button>
      {showDetails && decryptedData && (
        <div className="mt-2 text-sm">
          {Object.entries(decryptedData).map(([key, value]) => (
            <p key={key}><strong>{key}:</strong> {value.toString()}</p>
          ))}
        </div>
      )}
    </div>
  )
}

export default WithdrawRequests