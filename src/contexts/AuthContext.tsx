import React, { createContext, useState, useContext, useEffect } from 'react'
import { auth, db } from '../firebase'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, User } from 'firebase/auth'
import { doc, setDoc, getDoc } from 'firebase/firestore'
import { toast } from 'react-toastify'

interface AuthContextType {
  user: User | null
  userRole: string | null
  login: (email: string, password: string) => Promise<void>
  signup: (email: string, password: string, fullName: string) => Promise<void>
  logout: () => Promise<void>
  isAdmin: () => boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [userRole, setUserRole] = useState<string | null>(null)

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      setUser(user)
      if (user) {
        const userDoc = await getDoc(doc(db, 'users', user.uid))
        const userData = userDoc.data()
        setUserRole(userData?.role || null)
      } else {
        setUserRole(null)
      }
    })
    return unsubscribe
  }, [])

  const login = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password)
      const userDoc = await getDoc(doc(db, 'users', auth.currentUser!.uid))
      const userData = userDoc.data()
      setUserRole(userData?.role || 'user')
      toast.success('Login successful')
    } catch (error) {
      console.error('Login error:', error)
      toast.error('Login failed. Please check your credentials.')
      throw error
    }
  }

  const generateWalletCode = (): string => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    let result = ''
    for (let i = 0; i < 32; i++) {
      if (i > 0 && i % 8 === 0) {
        result += '-'
      }
      result += characters.charAt(Math.floor(Math.random() * characters.length))
    }
    return result
  }

  const signup = async (email: string, password: string, fullName: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      const user = userCredential.user
      const walletCode = generateWalletCode()
      await setDoc(doc(db, 'users', user.uid), {
        email: user.email,
        fullName: fullName,
        role: 'user',
        balance: 0,
        transactions: [],
        walletCode: walletCode,
        registrationDate: new Date()
      })
      setUserRole('user')
      toast.success(`Signup successful! Your wallet code is: ${walletCode}`)
    } catch (error) {
      console.error('Signup error:', error)
      toast.error('Signup failed. Please try again.')
      throw error
    }
  }

  const logout = async () => {
    try {
      await signOut(auth)
      setUserRole(null)
      toast.success('Logged out successfully')
    } catch (error) {
      console.error('Logout error:', error)
      toast.error('Logout failed. Please try again.')
      throw error
    }
  }

  const isAdmin = () => {
    return userRole === 'admin'
  }

  const value = {
    user,
    userRole,
    login,
    signup,
    logout,
    isAdmin
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export default AuthProvider