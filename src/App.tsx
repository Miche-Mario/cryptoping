import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LandingPage from "./components/LandingPage";
import UserDashboard from "./components/user/UserDashboard";
import AdminDashboard from "./components/admin/AdminDashboard";
import Login from "./components/auth/Login";
import Signup from "./components/auth/Signup";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";
import ErrorBoundary from "./components/ErrorBoundary";
// Importez les nouveaux composants
import TermsOfService from "./components/legal/TermsOfService";
import PrivacyPolicy from "./components/legal/PrivacyPolicy";
import Disclaimer from "./components/legal/Disclaimer";

const DashboardRouter: React.FC = () => {
  const { userRole } = useAuth();

  if (userRole === "admin") {
    return <Navigate to="/admin" replace />;
  } else {
    return <Navigate to="/user" replace />;
  }
};

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardRouter />
                </ProtectedRoute>
              }
            />
            <Route
              path="/user/*"
              element={
                <ProtectedRoute>
                  <UserDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/*"
              element={
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
            {/* Ajoutez les nouvelles routes ici */}
            <Route path="/terms-of-service" element={<TermsOfService />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/disclaimer" element={<Disclaimer />} />
          </Routes>
        </Router>
        <ToastContainer position="bottom-right" />
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
