import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { CartProvider, useCart } from './context/CartContext';

import Testimonials from "./sections/Testimonials";
import Footer from "./sections/Footer";
import Contact from "./sections/Contact";
import TechStack from "./sections/TechStack";
import Experience from "./sections/Experience";
import Hero from "./sections/Hero";
import ShowcaseSection from "./sections/ShowcaseSection";
import NavBar from "./components/NavBar";
import AnimatedCounter from "./components/AnimatedCounter";
import ShoppingCart from './components/ShoppingCart';
import PaymentSuccessPage from './pages/PaymentSuccesPage';
import PaymentFailurePage from './pages/PaymentFailurePage';
import PaymentPendingPage from './pages/PaymentPendingPage';
import DispatcherLoginPage from './pages/DispatcherLoginPage';
import DispatcherOrdersPage from './pages/DispatcherOrdersPage';
import ProductDetailPage from './pages/ProductDetailPage';

const MainPageLayout = () => (
    <>
      <Hero />
      <ShowcaseSection />
      <Experience /> 
      <TechStack />
      <Testimonials />
      <AnimatedCounter />
      <Contact />
    </>
);

const ProtectedDispatcherRoute = ({ children }) => {
    const { dispatcher } = useCart();
    if (!dispatcher) {
        return <Navigate to="/dispatcher-login" replace />;
    }
    return children;
};

function AppContent() {
  const { isCartOpen } = useCart();

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const refCode = queryParams.get('ref');
    if (refCode) {
      localStorage.setItem('referralCode', refCode);
    }
  }, []);

  return (
    <>
      <NavBar />
      <main className="pt-20 md:pt-24">
        <Routes>
          <Route path="/" element={<MainPageLayout />} />
          <Route path="/producto/:productName" element={<ProductDetailPage />} />
          <Route path="/payment-success" element={<PaymentSuccessPage />} />
          <Route path="/payment-failure" element={<PaymentFailurePage />} />
          <Route path="/payment-pending" element={<PaymentPendingPage />} />
          <Route path="/dispatcher-login" element={<DispatcherLoginPage />} />
          <Route 
            path="/dispatcher/orders" 
            element={
              <ProtectedDispatcherRoute>
                <DispatcherOrdersPage />
              </ProtectedDispatcherRoute>
            } 
          />
        </Routes>
      </main>
      <Footer />
      {isCartOpen && <ShoppingCart />}
    </>
  );
}

const App = () => (
  <BrowserRouter>
    <CartProvider>
      <AppContent />
    </CartProvider>
  </BrowserRouter>
);

export default App;