// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css'; 
import { AuthProvider, AuthContext } from './context/AuthContext';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { ThemeProvider } from '@mui/material/styles';
import theme from './theme';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import WorkerDashboard from './pages/WorkerDashboard';
import ClientDashboard from './pages/ClientDashboard';
import AdminDashboard from './pages/AdminDashboard';
import Login from './components/Login';
import RegisterWorker from './components/RegisterWorker';
import RequestService from './components/RequestService';
import ResetPassword from './components/ResetPassword';
import Chat from './components/Chat';
import Payment from './components/Payment';
import NotFound from './pages/NotFound';

// Load Stripe with the publishable key from environment variables
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <AuthProvider>
        <Router>
          <Navbar />
          <Elements stripe={stripePromise}>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register-worker" element={<RegisterWorker />} />
              <Route path="/reset-password" element={<ResetPassword />} />

              {/* Protected Routes */}
              <Route
                path="/request-service"
                element={
                  <ProtectedRoute role="client">
                    <RequestService />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/worker-dashboard"
                element={
                  <ProtectedRoute role="worker">
                    <WorkerDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/client-dashboard"
                element={
                  <ProtectedRoute role="client">
                    <ClientDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin-dashboard"
                element={
                  <ProtectedRoute role="admin">
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/chat/:chatId"
                element={
                  <ProtectedRoute>
                    <Chat />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/payment/:requestId"
                element={
                  <ProtectedRoute role="client">
                    <PaymentWrapper />
                  </ProtectedRoute>
                }
              />

              {/* Fallback Route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Elements>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
};

// ProtectedRoute component to handle role-based access
const ProtectedRoute = ({ role, children }) => {
  const { user, loading } = React.useContext(AuthContext);

  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  if (role && user.role !== role) return <Navigate to="/" />;
  return children;
};

// PaymentWrapper to pass requestId and amount to Payment component
const PaymentWrapper = () => {
  const { requestId } = React.useParams();
  const amount = 50; // Example amount, you can make this dynamic by fetching from the backend
  return <Payment requestId={requestId} amount={amount} />;
};

export default App;