import { Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import HomePage from './pages/LandingPage/homepage';
import AboutPage from './pages/LandingPage/about_us';
import ContactPage from './pages/LandingPage/contact_us';
import RestaurantsPage from './pages/LandingPage/Restaurants';
import Login from './pages/Authentication/login';
import Register from './pages/Authentication/register';
import ForgotPassword from './pages/Authentication/forgot_password';


import AdminDashboard from './pages/Dashboards/Admin/admin_dashboard';
import UserListPage from './pages/Dashboards/Admin/Utilisateurs/UserList';
import RestaurantManagement from './pages/Dashboards/Admin/Restaurants/RestaurantsList';
import ContactMessagesAdmin from './pages/Dashboards/Admin/ContactMessages/Contact';
import AdminOrdersPage from './pages/Dashboards/Admin/Orders/orders';
import StatisticsPage from './pages/Dashboards/Admin/Statistics/StatisticsPage';
import AdminSupportPage from './pages/Dashboards/Admin/AdminSupport/AdminSupportPage.js';
import AdminSettingsPage from './pages/Dashboards/Admin/Settings/AdminSettingsPage.jsx';
import AdminDeliveryManagement from './pages/Dashboards/Admin/Delivery/delivery_managemnet.jsx';
//import PromotionManagement from './pages/Dashboards/Admin/Promotion/promotion.jsx';


import BecomeAPartner from './pages/LandingPage/BecomeAPartner.jsx';
import MenuPage from './pages/LandingPage/menus.jsx';



import DashboardRedirect from './components/CommonShare/test';

// Create a client
const queryClient = new QueryClient();

function App() {
  console.log('App component is rendering');
  return (
    <QueryClientProvider client={queryClient}>
      <div className="app">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/restaurants" element={<RestaurantsPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/become" element={<BecomeAPartner />} />
          <Route path="/menu" element={<MenuPage />} />




        <Route path="/test" element={<DashboardRedirect />} />

          
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/user" element={<UserListPage />} />
          <Route path="/admin/restaurants" element={<RestaurantManagement />} />
          <Route path="/admin/contact-messages" element={<ContactMessagesAdmin />} />
          <Route path="/admin/orders" element={<AdminOrdersPage />} />
          <Route path="/admin/statistics" element={<StatisticsPage />} />
          <Route path="/admin/support-services" element={<AdminSupportPage />} />
          <Route path="/admin/settings" element={<AdminSettingsPage />} />
          <Route path="/admin/delivery" element={<AdminDeliveryManagement />} />







          



        </Routes>
      </div>
    </QueryClientProvider>
  );
}

export default App;