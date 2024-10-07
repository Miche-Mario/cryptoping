import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { db } from '../../firebase'
import { collection, addDoc, getDocs } from 'firebase/firestore'
import { toast } from 'react-toastify'

interface DepositForm {
  userId: string
  amount: number
}

const Deposit: React.FC = () => {
  const [users, setUsers] = useState<Array<{ id: string; email: string }>>([])
  const { register, handleSubmit, reset, formState: { errors } } = useForm<DepositForm>()

  useEffect(() => {
    const fetchUsers = async () => {
      const usersSnapshot = await getDocs(collection(db, 'users'))
      const usersData = usersSnapshot.docs.map(doc => ({ id: doc.id, email: doc.data().email }))
      setUsers(usersData)
    }
    fetchUsers()
  }, [])

  const onSubmit = async (data: DepositForm) => {
    try {
      // Create a new transaction document
      await addDoc(collection(db, 'transactions'), {
        userId: data.userId,
        amount: data.amount,
        type: 'deposit',
        status: 'pending',
        date: new Date()
      })

      toast.success('Deposit transaction created successfully')
      reset()
    } catch (error) {
      console.error('Error creating deposit:', error)
      toast.error('Failed to create deposit transaction')
    }
  }

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Create Deposit</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label htmlFor="userId" className="block text-sm font-medium text-gray-700 mb-1">User</label>
          <select
            id="userId"
            {...register('userId', { required: 'User is required' })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 py-2 px-3 border"
          >
            <option value="">Select a user</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>{user.email}</option>
            ))}
          </select>
          {errors.userId && <p className="mt-1 text-sm text-red-600">{errors.userId.message}</p>}
        </div>
        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
          <input
            type="number"
            id="amount"
            step="0.01"
            {...register('amount', { 
              required: 'Amount is required',
              min: { value: 0.01, message: 'Amount must be greater than 0' }
            })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 py-2 px-3 border"
          />
          {errors.amount && <p className="mt-1 text-sm text-red-600">{errors.amount.message}</p>}
        </div>
        <button
          type="submit"
          className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Create Deposit
        </button>
      </form>
    </div>
  )
}

export default Deposit