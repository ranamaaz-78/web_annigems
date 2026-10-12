import { Route, Routes } from 'react-router-dom';
import AuthLayout from './components/auth/AuthLayout';
import ProtectedRoute from './components/account/ProtectedRoute';
import Layout from './components/layout/Layout';
import AboutPage from './pages/About/AboutPage';
import AccountLayout from './pages/Account/AccountLayout';
import AddressesPage from './pages/Account/AddressesPage';
import OrderDetailPage from './pages/Account/OrderDetailPage';
import OrdersPage from './pages/Account/OrdersPage';
import PasswordPage from './pages/Account/PasswordPage';
import ProfilePage from './pages/Account/ProfilePage';
import ForgotPasswordPage from './pages/Auth/ForgotPasswordPage';
import LoginPage from './pages/Auth/LoginPage';
import RegisterPage from './pages/Auth/RegisterPage';
import ResetPasswordPage from './pages/Auth/ResetPasswordPage';
import CartPage from './pages/Cart/CartPage';
import CheckoutPage from './pages/Checkout/CheckoutPage';
import ConfiguratorPage from './pages/Configurator/ConfiguratorPage';
import ContactPage from './pages/Contact/ContactPage';
import HomePage from './pages/Home/HomePage';
import NotFoundPage from './pages/NotFound/NotFoundPage';
import OrderSuccessPage from './pages/Orders/OrderSuccessPage';
import TrackOrderPage from './pages/Orders/TrackOrderPage';
import FaqPage from './pages/Policies/FaqPage';
import PolicyPage from './pages/Policies/PolicyPage';
import ProductPage from './pages/Product/ProductPage';
import ShopPage from './pages/Shop/ShopPage';
import WishlistPage from './pages/Wishlist/WishlistPage';

export default function App() {
  return (
    <Routes>
      {/* Auth pages: full-screen, no navbar or footer */}
      <Route element={<AuthLayout />}>
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route path="forgot-password" element={<ForgotPasswordPage />} />
        <Route path="reset-password" element={<ResetPasswordPage />} />
      </Route>

      <Route element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="shop" element={<ShopPage />} />
        <Route path="product/:id" element={<ProductPage />} />
        <Route path="design-your-ring" element={<ConfiguratorPage />} />
        <Route path="wishlist" element={<WishlistPage />} />
        <Route path="cart" element={<CartPage />} />
        <Route path="checkout" element={<CheckoutPage />} />
        <Route path="order-success/:id" element={<OrderSuccessPage />} />
        <Route path="track-order" element={<TrackOrderPage />} />

        <Route element={<ProtectedRoute />}>
          <Route path="account" element={<AccountLayout />}>
            <Route index element={<ProfilePage />} />
            <Route path="orders" element={<OrdersPage />} />
            <Route path="orders/:id" element={<OrderDetailPage />} />
            <Route path="addresses" element={<AddressesPage />} />
            <Route path="password" element={<PasswordPage />} />
          </Route>
        </Route>

        <Route path="about" element={<AboutPage />} />
        <Route path="contact" element={<ContactPage />} />
        <Route path="faq" element={<FaqPage />} />
        <Route path="shipping-policy" element={<PolicyPage />} />
        <Route path="returns" element={<PolicyPage />} />
        <Route path="privacy-policy" element={<PolicyPage />} />
        <Route path="terms" element={<PolicyPage />} />
        <Route path="warranty" element={<PolicyPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
