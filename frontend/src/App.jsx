import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { BuyerLayout } from './layouts/BuyerLayout';
import { SellerLayout } from './layouts/SellerLayout';
import { AdminLayout } from './layouts/AdminLayout';

import { Home } from './pages/buyer/Home';
import { Cart } from './pages/buyer/Cart';

import { Dashboard as SellerDashboard } from './pages/seller/Dashboard';
import { SellerProducts } from './pages/seller/Products';
import { SellerOrders } from './pages/seller/Orders';

import { AdminDashboard } from './pages/admin/Dashboard';
import { Login } from './pages/Login';

import { useEffect } from 'react';
import { useAuthStore } from './store/useAuthStore';

import { Checkout } from './pages/buyer/Checkout';
import { OrderHistory } from './pages/buyer/Orders';

function App() {
  const { initialize } = useAuthStore();

  useEffect(() => {
    initialize();
  }, [initialize]);

  return (
    <Router>
      <Routes>
        {/* Buyer Routes */}
        <Route path="/" element={<BuyerLayout />}>
          <Route index element={<Home />} />
          <Route path="cart" element={<Cart />} />
          <Route path="checkout" element={<Checkout />} />
          <Route path="orders" element={<OrderHistory />} />
        </Route>

        <Route path="/login" element={<Login />} />

        {/* Seller Routes */}
        <Route path="/seller" element={<SellerLayout />}>
          <Route index element={<SellerDashboard />} />
          <Route path="products" element={<SellerProducts />} />
          <Route path="orders" element={<SellerOrders />} />
        </Route>

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
