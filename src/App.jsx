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
<<<<<<< HEAD
//import PromotionManagement from './pages/Dashboards/Admin/Promotion/promotion.jsx';
=======
import PromotionManagement from './pages/Dashboards/Admin/Promotion/promotion.jsx';


>>>>>>> origin/feat/ui-ux-improvements
import BecomeAPartner from './pages/LandingPage/BecomeAPartner.jsx';
import MenuPage from './pages/LandingPage/menus.jsx';


// resturant dashboard
import RestaurantDashboard from './pages/Dashboards/Restaurants/restaurant_dashboard.jsx';
import RestaurantCommand from './pages/Dashboards/Restaurants/command/restaurant_command.jsx';
import MenuPlatsPage from './pages/Dashboards/Restaurants/manager_menu/restuarantMenu.jsx';
import RestaurantStatsPage from './pages/Dashboards/Restaurants/statistic/RestaurantStats.jsx';
import RestaurantReviews from './pages/Dashboards/Restaurants/Review/restaurantreview.jsx';

// delivery dashboard
import DeliveryDashboard from './pages/Dashboards/Delivery/delivery_dashboad.jsx';
import MissionsPage from './pages/Dashboards/Delivery/mission/delivey_mission.jsx';
//import CameroonDeliveryMap from './pages/Dashboards/Delivery/map_deliveries/delivery_live_map.jsx';

import RestaurantDeliverCommand from './pages/Dashboards/Delivery/map_deliveries/restaurant_command.jsx';




import DeliveryEarningsPage from './pages/Dashboards/Delivery/earnings/delivery_earnings.jsx';
import DeliveryHistoryPage from './pages/Dashboards/Delivery/History/delivery_history.jsx';
import DeliverySupport from './pages/Dashboards/Delivery/support/delivery_support.jsx';



import DashboardRedirect from './components/CommonShare/test';

// Create a client
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="app">
        <Routes>
          {/* Public Routes */}
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

          {/* Admin Router */}

          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/user" element={<UserListPage />} />
          <Route path="/admin/restaurants" element={<RestaurantManagement />} />
          <Route path="/admin/contact-messages" element={<ContactMessagesAdmin />} />
          <Route path="/admin/orders" element={<AdminOrdersPage />} />
          <Route path="/admin/statistics" element={<StatisticsPage />} />
          <Route path="/admin/support-services" element={<AdminSupportPage />} />
          <Route path="/admin/settings" element={<AdminSettingsPage />} />
          <Route path="/admin/delivery" element={<AdminDeliveryManagement />} />
          <Route path="/admin/promotion" element={<PromotionManagement />} />



<<<<<<< HEAD
          {/* Restaurant Router */}
          
          <Route path="/restaurants_manager" element={<RestaurantDashboard />} />
          <Route path="/restaurant/orders" element={<RestaurantCommand />} />
          <Route path="/restaurant/menu" element={<MenuPlatsPage />} />
          <Route path="/restaurant/stats" element={<RestaurantStatsPage />} />
          <Route path="/restaurant/reviews" element={<RestaurantReviews />} />

        {/* Delivery Router */}

         <Route path="/delivery" element={<DeliveryDashboard />} />
         <Route path="/missions" element={<MissionsPage />} />
         {/*<Route path="/live-map" element={<CameroonDeliveryMap />} />*/}

         <Route path="/live-map" element={<RestaurantDeliverCommand />} />

         <Route path="/earnings" element={<DeliveryEarningsPage />} />
         <Route path="/history" element={<DeliveryHistoryPage />} />
         <Route path="/support" element={<DeliverySupport />} />





=======
>>>>>>> origin/feat/ui-ux-improvements




        </Routes>
      </div>
    </QueryClientProvider>
  );
}

export default App;