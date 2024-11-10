import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import DashboardLayout from "../layout/DashboardLayout";
import Wallet from "./Wallet";
import Buy from "./Buy";
import Withdraw from "./Withdraw";
import Account from "./Account";

const userSidebarItems = [
  { label: "Wallet", route: "/user/wallet" },
  { label: "Buy", route: "/user/buy" },
  { label: "Withdraw", route: "/user/withdraw" },
  { label: "Account", route: "/user/account" },
];

const UserDashboard: React.FC = () => {
  return (
    <DashboardLayout sidebarItems={userSidebarItems}>
      <Routes>
        <Route path="/" element={<Navigate to="wallet" replace />} />
        <Route path="wallet" element={<Wallet />} />
        <Route path="buy" element={<Buy />} />
        <Route path="withdraw" element={<Withdraw />} />
        <Route path="account" element={<Account />} />
      </Routes>
    </DashboardLayout>
  );
};

export default UserDashboard;
