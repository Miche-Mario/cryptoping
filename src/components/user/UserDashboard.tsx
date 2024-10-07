import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import DashboardLayout from '../layout/DashboardLayout'
import Wallet from './Wallet'
import Buy from './Buy'
import Withdraw from './Withdraw'

const userSidebarItems = [
  { label: 'Wallet', route: '/user/wallet' },
  { label: 'Buy', route: '/user/buy' },
  { label: 'Withdraw', route: '/user/withdraw' },
]

const UserDashboard: React.FC = () => {
  return (
    <DashboardLayout sidebarItems={userSidebarItems}>
      <Routes>
        <Route path="/" element={<Navigate to="wallet" replace />} />
        <Route path="wallet" element={<Wallet />} />
        <Route path="buy" element={<Buy />} />
        <Route path="withdraw" element={<Withdraw />} />
      </Routes>
    </DashboardLayout>
  )
}

export default UserDashboard