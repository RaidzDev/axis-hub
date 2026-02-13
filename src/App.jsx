import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import ProductDetails from './pages/ProductDetails';
import Checkout from './pages/Checkout';

import { CartProvider } from './context/CartContext';

import Payment from './pages/Payment';
import Success from './pages/Success';

function App() {
  return (
    <CartProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/produto/:id" element={<ProductDetails />} />
          <Route path="/cart" element={<Checkout />} /> {/* Alias if needed */}
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/pix/:orderId" element={<Payment />} />
          <Route path="/success/:orderId" element={<Success />} />
        </Routes>
      </Router>
    </CartProvider>
  );
}

export default App;
