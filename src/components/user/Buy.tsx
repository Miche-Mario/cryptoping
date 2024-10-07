import React, { useState, useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { useAuth } from '../../contexts/AuthContext'
import { getTopCryptos, CoinData } from '../../services/cryptoService'
import { toast } from 'react-toastify'
import { ArrowRight, Loader } from 'lucide-react'
import { addDoc, collection, query, where, getDocs, orderBy } from 'firebase/firestore'
import { db } from '../../firebase'

interface BuyRequest {
  id: string
  userId: string
  cryptocurrency: string
  amount: number
  date: Date
  status: 'pending' | 'approved' | 'rejected'
}

const Buy: React.FC = () => {
  const { user } = useAuth()
  const [cryptoList, setCryptoList] = useState<CoinData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [buyRequests, setBuyRequests] = useState<BuyRequest[]>([])
  const { register, handleSubmit, watch, control, formState: { errors } } = useForm()

  const selectedCrypto = watch('cryptocurrency')
  const amount = watch('amount')

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return

      try {
        const cryptos = await getTopCryptos(10)
        console.log('Fetched cryptos:', cryptos) // Add this line for debugging
        setCryptoList(cryptos)
        await fetchBuyRequests()
        setError(null)
      } catch (error) {
        console.error('Error fetching data:', error)
        setError('Failed to fetch cryptocurrency data. Please try again later.')
        toast.error('Failed to fetch data. Please try again later.')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [user])

  const fetchBuyRequests = async () => {
    if (!user) return

    try {
      const buyRequestsRef = collection(db, 'buyRequests')
      const q = query(
        buyRequestsRef,
        where('userId', '==', user.uid),
        orderBy('date', 'desc')
      )
      const querySnapshot = await getDocs(q)
      const requests = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        date: doc.data().date.toDate()
      } as BuyRequest))
      setBuyRequests(requests)
    } catch (error) {
      console.error('Error fetching buy requests:', error)
      toast.error('Failed to fetch buy requests. Please try again later.')
    }
  }

  const onSubmit = async (data: any) => {
    if (!user) {
      toast.error('You must be logged in to make a purchase')
      return
    }

    try {
      const buyRequestRef = await addDoc(collection(db, 'buyRequests'), {
        userId: user.uid,
        cryptocurrency: data.cryptocurrency,
        amount: parseFloat(data.amount),
        date: new Date(),
        status: 'pending'
      })

      toast.success('Buy request submitted successfully')
      
      const newRequest: BuyRequest = {
        id: buyRequestRef.id,
        userId: user.uid,
        cryptocurrency: data.cryptocurrency,
        amount: parseFloat(data.amount),
        date: new Date(),
        status: 'pending'
      }
      setBuyRequests(prevRequests => [newRequest, ...prevRequests])
    } catch (error) {
      console.error('Error submitting buy request:', error)
      toast.error('Failed to submit buy request. Please try again.')
    }
  }

  const LoadingSkeleton = () => (
    <div className="animate-pulse space-y-4">
      <div className="h-8 bg-gray-200 rounded w-1/2"></div>
      <div className="h-10 bg-gray-200 rounded"></div>
      <div className="h-10 bg-gray-200 rounded"></div>
      <div className="h-10 bg-gray-200 rounded w-1/2"></div>
    </div>
  )

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6">Buy Cryptocurrency</h2>
        <LoadingSkeleton />
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6">Buy Cryptocurrency</h2>
        <p className="text-red-500">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Retry
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Buy Cryptocurrency</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label htmlFor="cryptocurrency" className="block text-sm font-medium text-gray-700">Select Cryptocurrency</label>
          <Controller
            name="cryptocurrency"
            control={control}
            rules={{ required: 'Please select a cryptocurrency' }}
            render={({ field }) => (
              <select
                {...field}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md border-2 shadow-sm"
              >
                <option value="">Select a cryptocurrency</option>
                {cryptoList.map((crypto) => (
                  <option key={crypto.id} value={crypto.id}>{crypto.name}</option>
                ))}
              </select>
            )}
          />
          {errors.cryptocurrency && <p className="mt-1 text-sm text-red-600">{errors.cryptocurrency.message as string}</p>}
        </div>
        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700">Amount (USD)</label>
          <input
            type="number"
            step="0.01"
            {...register('amount', { 
              required: 'Amount is required',
              min: { value: 0.01, message: 'Minimum amount is 0.01 USD' }
            })}
            className="mt-1 block w-full pl-3 pr-3 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md border-2 shadow-sm"
          />
          {errors.amount && <p className="mt-1 text-sm text-red-600">{errors.amount.message as string}</p>}
        </div>
        {selectedCrypto && amount && cryptoList.length > 0 && (
          <div className="text-sm text-gray-600">
            You will receive approximately {(parseFloat(amount) / cryptoList.find(c => c.id === selectedCrypto)!.current_price).toFixed(8)} {selectedCrypto.toUpperCase()}
          </div>
        )}
        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Buy <ArrowRight className="ml-2" size={16} />
        </button>
      </form>

      <h3 className="text-xl font-bold mt-8 mb-4">Your Buy Requests</h3>
      {buyRequests.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cryptocurrency</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount (USD)</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {buyRequests.map((request) => (
                <tr key={request.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{request.date.toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{request.cryptocurrency}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${request.amount.toFixed(2)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      request.status === 'approved' ? 'bg-green-100 text-green-800' : 
                      request.status === 'rejected' ? 'bg-red-100 text-red-800' : 
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {request.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-gray-600">You have no buy requests at the moment.</p>
      )}
    </div>
  )
}

export default Buy