import React, { useState, useEffect } from 'react'
import { db } from '../../firebase'
import { collection, getDocs, doc } from 'firebase/firestore'
import { toast } from 'react-toastify'

interface User {
  id: string
  email: string
  walletCode: string
  registrationDate?: Date
}

const UserList: React.FC = () => {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersRef = collection(db, 'users')
        const querySnapshot = await getDocs(usersRef)
        const fetchedUsers = querySnapshot.docs.map(doc => {
          const data = doc.data()
          return {
            id: doc.id,
            fullName: data.fullName,
            email: data.email,
            walletCode: data.walletCode,
            registrationDate: data.registrationDate ? new Date(data.registrationDate.seconds * 1000) : undefined
          } as User
        })
        setUsers(fetchedUsers)
      } catch (error) {
        console.error('Error fetching users:', error)
        toast.error('Failed to fetch users')
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [])

  if (loading) {
    return <div>Loading users...</div>
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
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td className="py-2 px-4 border-b">{user.fullName}</td>
              <td className="py-2 px-4 border-b">{user.email}</td>
              <td className="py-2 px-4 border-b">{user.walletCode}</td>
              <td className="py-2 px-4 border-b">
                {user.registrationDate ? user.registrationDate.toLocaleString() : 'N/A'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default UserList