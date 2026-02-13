import React from 'react';
// Final Production Build
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import ProductDetails from './pages/ProductDetails';
import Checkout from './pages/Checkout';

import { CartProvider } from './context/CartContext';

import Payment from './pages/Payment';
import Success from './pages/Success';

// Admin Pages
import AdminLogin from './pages/admin/Login';
import AdminDashboard from './pages/admin/Dashboard';
import ProductForm from './pages/admin/ProductForm';

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('adminToken');
  return token ? children : <Navigate to="/admin" />;
};

function App() {
  return (
    <CartProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/produto/:id" element={<ProductDetails />} />
          <Route path="/cart" element={<Checkout />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/pix/:orderId" element={<Payment />} />
          <Route path="/success/:orderId" element={<Success />} />

          {/* Admin Routes */}
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={
            <PrivateRoute><AdminDashboard /></PrivateRoute>
          } />
          <Route path="/admin/product/new" element={
            <PrivateRoute><ProductForm /></PrivateRoute>
          } />
          <Route path="/admin/product/:id" element={
            <PrivateRoute><ProductForm /></PrivateRoute>
          } />
        </Routes>
      </Router>
    </CartProvider>
  );
}

export default App;
