import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { LoadingScreen } from '@/components/LoadingScreen';
import { AuthProvider } from '@/admin/AuthContext';
import { AdminGuard } from '@/admin/AdminGuard';
import { AdminLogin } from '@/admin/AdminLogin';
import { AdminProducts } from '@/admin/AdminProducts';
import { AdminAdmins } from '@/admin/AdminAdmins';
import { AdminActivity } from '@/admin/AdminActivity';
import { HomePage } from '@/pages/HomePage';
import { ShopPage } from '@/pages/ShopPage';
import { ProductPage } from '@/pages/ProductPage';
import { AboutPage } from '@/pages/AboutPage';
import { ContactPage } from '@/pages/ContactPage';
import { NotFoundPage } from '@/pages/NotFoundPage';
import { useNoindex } from '@/hooks/useNoindex';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function AdminLoginRoute() {
  useNoindex();
  return <AdminLogin />;
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <LoadingScreen />
        <ScrollToTop />
        <Routes>
          <Route path="/admin" element={<AdminLoginRoute />} />
          <Route element={<AdminGuard />}>
            <Route path="/admin/products" element={<AdminProducts />} />
          </Route>
          <Route element={<AdminGuard ownerOnly />}>
            <Route path="/admin/admins" element={<AdminAdmins />} />
            <Route path="/admin/activity" element={<AdminActivity />} />
          </Route>

          <Route
            path="/*"
            element={
              <>
                <Header />
                <main className="min-h-screen">
                  <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/shop" element={<ShopPage />} />
                    <Route path="/product/:id" element={<ProductPage />} />
                    <Route path="/about" element={<AboutPage />} />
                    <Route path="/contact" element={<ContactPage />} />
                    <Route path="*" element={<NotFoundPage />} />
                  </Routes>
                </main>
                <Footer />
              </>
            }
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
