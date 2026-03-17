import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { BuyerLayout } from './layouts/BuyerLayout';
import { SellerLayout } from './layouts/SellerLayout';
import { AdminLayout } from './layouts/AdminLayout';

import { Home } from './pages/buyer/Home';
import { ProductDetails } from './pages/buyer/ProductDetails';
import { Cart } from './pages/buyer/Cart';
import { Category } from './pages/buyer/Category';

import { Dashboard as SellerDashboard } from './pages/seller/Dashboard';
import { SellerProducts } from './pages/seller/Products';
import { SellerOrders } from './pages/seller/Orders';
import { SellerSettings } from './pages/seller/Settings';

import { AdminDashboard } from './pages/admin/Dashboard';
import { AdminUsers } from './pages/admin/Users';
import { AdminSellers } from './pages/admin/Sellers';
import { AdminSettings } from './pages/admin/Settings';
import { AdminCategories } from './pages/admin/Categories';
import { ProtectedRoute } from './components/ProtectedRoute';
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
      <Toaster position="top-center" />
      <Routes>
        {/* Buyer Routes */}
        <Route path="/" element={<BuyerLayout />}>
          <Route index element={<Home />} />
          <Route path="product/:id" element={<ProductDetails />} />
          <Route path="cart" element={<Cart />} />
          <Route path="category/:categoryName" element={<Category />} />
          <Route path="checkout" element={<Checkout />} />
          <Route path="orders" element={<OrderHistory />} />
        </Route>

        <Route path="/login" element={<Login />} />

        {/* Seller Routes */}
        <Route path="/seller" element={
          <ProtectedRoute allowedRoles={['seller']}>
            <SellerLayout />
          </ProtectedRoute>
        }>
          <Route index element={<SellerDashboard />} />
          <Route path="products" element={<SellerProducts />} />
          <Route path="orders" element={<SellerOrders />} />
          <Route path="settings" element={<SellerSettings />} />
        </Route>

        {/* Admin Routes */}
        <Route path="/admin" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminLayout />
          </ProtectedRoute>
        }>
          <Route index element={<AdminDashboard />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="sellers" element={<AdminSellers />} />
          <Route path="categories" element={<AdminCategories />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
