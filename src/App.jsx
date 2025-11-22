import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { CartProvider, useCart } from './context/CartContext';
import { AuthProvider, useAuth } from './context/AuthContext';

import NavBar from "./components/NavBar";
import Footer from "./sections/Footer";
import ShoppingCart from './components/ShoppingCart';
import FloatingWhatsAppButton from './components/FloatingWhatsAppButton';
import BlackFridayModal from './components/BlackFridayModal';

import HomePage from './pages/HomePage';
import StorePage from './pages/StorePage';
import ProductDetailPage from './pages/ProductDetailPage';
import InformationPage from './pages/InformationPage';
import PaymentSuccessPage from './pages/PaymentSuccesPage';
import PaymentFailurePage from './pages/PaymentFailurePage';
import PaymentPendingPage from './pages/PaymentPendingPage';
import DispatcherLoginPage from './pages/DispatcherLoginPage';
import DispatcherDashboardPage from './pages/DispatcherDashboardPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import UserDashboardPage from './pages/UserDashboardPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';

const ProtectedDispatcherRoute = ({ children }) => {
    const { dispatcher } = useCart();
    return dispatcher ? children : <Navigate to="/dispatcher-login" replace />;
};

const ProtectedUserRoute = ({ children }) => {
    const { user, isLoadingUser } = useAuth();
    if (isLoadingUser) return <div className="bg-black text-white h-screen flex items-center justify-center">Cargando...</div>;
    return user ? children : <Navigate to="/login" replace />;
};

function AppContent() {
  const { isCartOpen, setIsCartOpen } = useCart();
  const location = useLocation(); 
  const { pathname } = location;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
      if (location.state?.openCart && !['/login', '/registro'].includes(pathname)) {
          setIsCartOpen(true);
          window.history.replaceState({}, document.title); 
      }
      if (['/login', '/registro'].includes(pathname)) {
          setIsCartOpen(false);
      }
  }, [location, setIsCartOpen, pathname]);

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const refCode = queryParams.get('ref');
    if (refCode) localStorage.setItem('referralCode', refCode);
  }, []);

  return (
    <>
      <NavBar />
      <main>
        <Routes>
          <Route path="/" element={<StorePage />} />
          <Route path="/inicio" element={<HomePage />} />
          <Route path="/tienda" element={<Navigate to="/" replace />} />
          
          <Route path="/informacion" element={<InformationPage />} />
          <Route path="/producto/:productIdOrName" element={<ProductDetailPage />} />
          
          <Route path="/login" element={<LoginPage />} />
          <Route path="/registro" element={<RegisterPage />} />
          <Route path="/recuperar-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/mi-perfil" element={<ProtectedUserRoute><UserDashboardPage /></ProtectedUserRoute>} />

          <Route path="/payment-success" element={<PaymentSuccessPage />} />
          <Route path="/payment-failure" element={<PaymentFailurePage />} />
          <Route path="/payment-pending" element={<PaymentPendingPage />} />
          
          <Route path="/dispatcher-login" element={<DispatcherLoginPage />} />
          <Route path="/dispatcher/dashboard" element={<ProtectedDispatcherRoute><DispatcherDashboardPage /></ProtectedDispatcherRoute>} />
        </Routes>
      </main>
      <Footer />
      {isCartOpen && <ShoppingCart />}
      <FloatingWhatsAppButton />
      <BlackFridayModal />
    </>
  );
}

const App = () => (
  <BrowserRouter>
    <AuthProvider>
      <CartProvider>
        <AppContent />
      </CartProvider>
    </AuthProvider>
  </BrowserRouter>
);

export default App;