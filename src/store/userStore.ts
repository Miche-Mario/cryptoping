import create from 'zustand'
import { db } from '../firebase'
import { doc, updateDoc, getDoc, collection, query, where, getDocs } from 'firebase/firestore'

interface UserState {
  balance: number
  transactions: Transaction[]
  updateBalance: (userId: string, newBalance: number) => Promise<void>
  addTransaction: (userId: string, transaction: Transaction) => Promise<void>
  fetchUserData: (userId: string) => Promise<void>
}

interface Transaction {
  id: string
  type: 'buy' | 'sell' | 'withdraw' | 'deposit'
  amount: number
  cryptocurrency?: string
  date: Date
  status: string
}

export const useUserStore = create<UserState>((set) => ({
  balance: 0,
  transactions: [],
  updateBalance: async (userId, newBalance) => {
    await updateDoc(doc(db, 'users', userId), { balance: newBalance })
    set({ balance: newBalance })
  },
  addTransaction: async (userId, transaction) => {
    const userRef = doc(db, 'users', userId)
    const userDoc = await getDoc(userRef)
    const userData = userDoc.data()
    const updatedTransactions = [...(userData?.transactions || []), transaction]
    await updateDoc(userRef, { transactions: updatedTransactions })
    set((state) => ({ transactions: [...state.transactions, transaction] }))
  },
  fetchUserData: async (userId) => {
    const userDoc = await getDoc(doc(db, 'users', userId))
    const userData = userDoc.data()
    
    // Fetch all completed deposit transactions
    const transactionsRef = collection(db, 'transactions')
    const q = query(
      transactionsRef,
      where('userId', '==', userId),
      where('type', '==', 'deposit'),
      where('status', '==', 'complete')
    )
    const querySnapshot = await getDocs(q)
    
    // Calculate balance from completed deposits
    let calculatedBalance = 0
    const transactions: Transaction[] = []
    querySnapshot.forEach((doc) => {
      const transaction = doc.data() as Transaction
      calculatedBalance += transaction.amount
      transactions.push({
        ...transaction,
        id: doc.id,
        date: transaction.date.toDate()
      })
    })

    set({ 
      balance: calculatedBalance,
      transactions: transactions
    })
  },
}))