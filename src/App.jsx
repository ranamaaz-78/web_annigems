import { Route, Routes } from 'react-router-dom';
import AuthLayout from './components/auth/AuthLayout';
import B2BRoute from './components/account/B2BRoute';
import ProtectedRoute from './components/account/ProtectedRoute';
import Layout from './components/layout/Layout';
import B2BLayout from './pages/B2B/B2BLayout';
import B2BLoginPage from './pages/B2B/B2BLoginPage';
import B2BOrderDetailPage from './pages/B2B/B2BOrderDetailPage';
import B2BOrdersPage from './pages/B2B/B2BOrdersPage';
import CompanyPage from './pages/B2B/CompanyPage';
import CreditPage from './pages/B2B/CreditPage';
import DashboardPage from './pages/B2B/DashboardPage';
import PayPage from './pages/B2B/PayPage';
import WholesalePage from './pages/B2B/WholesalePage';
import ServicesPage from './pages/Services/ServicesPage';
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
        <Route path="b2b/login" element={<B2BLoginPage />} />
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

        <Route element={<B2BRoute />}>
          <Route path="b2b" element={<B2BLayout />}>
            <Route index element={<DashboardPage />} />
            <Route path="orders" element={<B2BOrdersPage />} />
            <Route path="orders/:id" element={<B2BOrderDetailPage />} />
            <Route path="credit" element={<CreditPage />} />
            <Route path="company" element={<CompanyPage />} />
            <Route path="addresses" element={<AddressesPage />} />
            <Route path="password" element={<PasswordPage />} />
          </Route>
          <Route path="b2b/pay/:id" element={<PayPage />} />
        </Route>

        <Route path="wholesale" element={<WholesalePage />} />
        <Route path="services" element={<ServicesPage />} />
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
