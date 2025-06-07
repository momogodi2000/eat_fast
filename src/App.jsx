import { Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
// Public router link

import HomePage from './pages/LandingPage/homepage';
import AboutPage from './pages/LandingPage/about_us';
import ContactPage from './pages/LandingPage/contact_us';
import RestaurantsPage from './pages/LandingPage/Restaurants';
import Login from './pages/Authentication/login';
import Register from './pages/Authentication/register';
import ForgotPassword from './pages/Authentication/forgot_password';

// Admin router link 

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
import PromotionManagement from './pages/Dashboards/Admin/Promotion/promotion.jsx';
import BecomeAPartner from './pages/LandingPage/BecomeAPartner.jsx';
import MenuPage from './pages/LandingPage/menus.jsx';


// resturant dashboard link

import RestaurantDashboard from './pages/Dashboards/Restaurants/restaurant_dashboard.jsx';
import RestaurantCommand from './pages/Dashboards/Restaurants/command/restaurant_command.jsx';
import MenuPlatsPage from './pages/Dashboards/Restaurants/manager_menu/restuarantMenu.jsx';
import RestaurantStatsPage from './pages/Dashboards/Restaurants/statistic/RestaurantStats.jsx';
import RestaurantReviews from './pages/Dashboards/Restaurants/Review/restaurantreview.jsx';

// delivery dashboard link

import DeliveryDashboard from './pages/Dashboards/Delivery/delivery_dashboad.jsx';
import MissionsPage from './pages/Dashboards/Delivery/mission/delivey_mission.jsx';
//import CameroonDeliveryMap from './pages/Dashboards/Delivery/map_deliveries/delivery_live_map.jsx';
import RestaurantDeliverCommand from './pages/Dashboards/Delivery/map_deliveries/restaurant_command.jsx';
import DeliveryEarningsPage from './pages/Dashboards/Delivery/earnings/delivery_earnings.jsx';
import DeliveryHistoryPage from './pages/Dashboards/Delivery/History/delivery_history.jsx';
import DeliverySupport from './pages/Dashboards/Delivery/support/delivery_support.jsx';


// Agents support link
import SupportTicketsPage from "@/pages/Dashboards/Agent/Tickets/ticketsPage.jsx";
import SupportDisputesPage from "@/pages/Dashboards/Agent/Disputes/DisputesPage.jsx";

// Clients dashabord link
import ClientDashboard from './pages/Dashboards/Clients/clients_dashboards.jsx';
import ClientMenus from './pages/Dashboards/Clients/Restaurants/clients_restaurants.jsx';



// Common share component for testing
import DashboardRedirect from './components/CommonShare/test';
import ClientsLayout from './layouts/clients_layout.jsx';

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
          {/* <Route path="/admin/promotion" element={<PromotionManagement />} /> */}

  {/* Agents Support Router */}

          <Route path="/agent/tickets" element={<SupportTicketsPage />} />
          <Route path="/agent/disputes" element={<SupportDisputesPage />} />


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

  {/* Clients Router */}
          <Route path="/clients" element={<ClientDashboard />} />
          <Route path="/clients/restaurant" element={<ClientMenus />} />

          
         



        </Routes>
      </div>
    </QueryClientProvider>
  );
}

export default App;