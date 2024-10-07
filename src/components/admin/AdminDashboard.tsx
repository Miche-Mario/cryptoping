import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import DashboardLayout from '../layout/DashboardLayout'
import UserList from './UserList'
import TransactionStatus from './TransactionStatus'
import Deposit from './Deposit'
import ManageStatusTypes from './ManageStatusTypes'
import BuyRequests from './BuyRequests'
import WithdrawRequests from './WithdrawRequests'

const adminSidebarItems = [
  { label: 'User List', route: '/admin/users' },
  { label: 'Transaction Status', route: '/admin/transactions' },
  { label: 'Deposit', route: '/admin/deposit' },
  { label: 'Manage Status Types', route: '/admin/status-types' },
  { label: 'Buy Requests', route: '/admin/buy-requests' },
  { label: 'Withdraw Requests', route: '/admin/withdraw-requests' },
]

const AdminDashboard: React.FC = () => {
  return (
    <DashboardLayout sidebarItems={adminSidebarItems}>
      <Routes>
        <Route path="/" element={<Navigate to="users" replace />} />
        <Route path="users" element={<UserList />} />
        <Route path="transactions" element={<TransactionStatus />} />
        <Route path="deposit" element={<Deposit />} />
        <Route path="status-types" element={<ManageStatusTypes />} />
        <Route path="buy-requests" element={<BuyRequests />} />
        <Route path="withdraw-requests" element={<WithdrawRequests />} />
      </Routes>
    </DashboardLayout>
  )
}

export default AdminDashboard