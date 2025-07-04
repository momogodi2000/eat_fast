import { Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ErrorBoundary from "./components/ErrorBoundary";

// Public pages
import HomePage from "./pages/LandingPage/homepage";
import AboutPage from "./pages/LandingPage/about_us";
import ContactPage from "./pages/LandingPage/contact_us";
import RestaurantPublicityPage from "./pages/LandingPage/Restaurants";
import Login from "./pages/Authentication/login";
import Register from "./pages/Authentication/register";
import ForgotPassword from "./pages/Authentication/forgot_password";
import BecomeAPartner from "./pages/LandingPage/BecomeAPartner.jsx";
import MenuPage from "./pages/LandingPage/menus.jsx";


// Privacy and policy pages
import PrivacyPolicy from "./components/CommonShare/privacy.jsx";
import RefundPolicy from "./components/CommonShare/refund.jsx";
import TermsAndConditions from "./components/CommonShare/term.jsx";
import FoodSafety from "./components/CommonShare/safety.jsx";

// Admin pages
import AdminDashboard from "./pages/Dashboards/Admin/admin_dashboard";
import UserListPage from "./pages/Dashboards/Admin/Utilisateurs/UserList";
import RestaurantManagement, {
  AdminRestaurantProvider,
} from "./pages/Dashboards/Admin/Restaurants/RestaurantsList";
import AdminContactMessages from "./pages/Dashboards/Admin/ContactMessages/Contact";
import AdminOrdersPage from "./pages/Dashboards/Admin/Orders/orders";
import StatisticsPage from "./pages/Dashboards/Admin/Statistics/StatisticsPage";
import AdminDeliveryManagement from "./pages/Dashboards/Admin/Delivery/delivery_managemnet.jsx";
import PromotionManagement from "./pages/Dashboards/Admin/Promotion/promotion.jsx";

// Restaurant pages
import RestaurantDashboard from "./pages/Dashboards/Restaurants/restaurant_dashboard.jsx";
import RestaurantCommand from "./pages/Dashboards/Restaurants/command/restaurant_command.jsx";
import MenuPlatsPage from "./pages/Dashboards/Restaurants/manager_menu/restuarantMenu.jsx";
import RestaurantStatsPage from "./pages/Dashboards/Restaurants/statistic/RestaurantStats.jsx";
import RestaurantReviews from "./pages/Dashboards/Restaurants/Review/restaurantreview.jsx";

// Delivery pages
import DeliveryDashboard from "./pages/Dashboards/Delivery/delivery_dashboad.jsx";
import MissionsPage from "./pages/Dashboards/Delivery/mission/delivey_mission.jsx";
import RestaurantDeliverCommand from "./pages/Dashboards/Delivery/map_deliveries/restaurant_command.jsx";
import DeliveryEarningsPage from "./pages/Dashboards/Delivery/earnings/delivery_earnings.jsx";
import DeliveryHistoryPage from "./pages/Dashboards/Delivery/History/delivery_history.jsx";
import DeliverySupport from "./pages/Dashboards/Delivery/support/delivery_support.jsx";

// Agent support pages
import SupportTicketsPage from "@/pages/Dashboards/Agent/Tickets/ticketsPage.jsx";
import SupportDisputesPage from "@/pages/Dashboards/Agent/Disputes/DisputesPage.jsx";
import SupportUserCommunication from "@/pages/Dashboards/Agent/User_communication/support_user_contact.jsx";
import SupportKnowledge from "@/pages/Dashboards/Agent/knowledge/agents_knowledge.jsx";
import SupportEscalation from "@/pages/Dashboards/Agent/Escalation/agents_escalation.jsx";
import SupportAgentMainDashboard from "@/pages/Dashboards/Agent/agent_dashboard.jsx";

// Client pages
import ClientDashboard from "./pages/Dashboards/Clients/clients_dashboards.jsx";
import ClientMenus from "./pages/Dashboards/Clients/Restaurants/clients_restaurants.jsx";
import ClientsCommande from "./pages/Dashboards/Clients/Commandes/clients_commandes.jsx";
import ClientsCommandeHistory from "./pages/Dashboards/Clients//Historique/clients_history.jsx";
import ClientsChatSupport from "./pages/Dashboards/Clients/Contact_support/clients_contact.jsx";
import ClientsProfilePage from "./pages/Dashboards/Clients/Profil/clients_profile.jsx";

// Layouts
import ClientsLayout from "./layouts/clients_layout.jsx";
import DeliveryLayout from "./layouts/delivery_layout.jsx";
import RestaurantLayoutWithProviders from "./layouts/restaurants_layout.jsx";

// Common components
import DashboardRedirect from "./components/CommonShare/test";
import RestaurantChatSupport from "./pages/Dashboards/Restaurants/contact_support/restaurant-aide.jsx";
import DeliveryChatSupport from "./pages/Dashboards/Delivery/contact_support/delivery_aide.jsx";

// Provider

import { UserInformationProvider } from "./pages/Authentication/const_provider.jsx";
// Create QueryClient


// Loading component
const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
  </div>
);

// Create QueryClient with error handling
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});



function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="app">
        <Routes>
          {/* Public Routes */}

          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/restaurants" element={<RestaurantPublicityPage />} />
          <Route
            path="/login"
            element={
              <UserInformationProvider>
                <Login />
              </UserInformationProvider>
            }
          />
          <Route
            path="/register"
            element={
              <UserInformationProvider>
                <Register />
              </UserInformationProvider>
            }
          />

          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/become" element={<BecomeAPartner />} />
          <Route path="/menu" element={<MenuPage />} />
          <Route path="/test" element={<DashboardRedirect />} />



          {/* term and condiction */}

          <Route path="/terms" element={<PrivacyPolicy />} />
          <Route path="/privacy" element={<RefundPolicy />} />
          <Route path="/refund" element={<TermsAndConditions />} />
          <Route path="/safety" element={<FoodSafety />} />



          {/* Admin Routes */}
          <Route
            path="/admin"
            element={
              <AdminRestaurantProvider>
                <UserInformationProvider>
                  <AdminDashboard />
                </UserInformationProvider>
              </AdminRestaurantProvider>
            }
          />
          <Route path="/admin/user" element={<UserListPage />} />
          <Route path="/admin/restaurants" element={<RestaurantManagement />} />
          <Route
            path="/admin/contact-messages"
            element={<AdminContactMessages />}
          />
          <Route path="/admin/orders" element={<AdminOrdersPage />} />
          <Route path="/admin/statistics" element={<StatisticsPage />} />
          <Route path="/admin/delivery" element={<AdminDeliveryManagement />} />
          <Route path="/admin/promotion" element={<PromotionManagement />} />

          {/* Agent Support Routes */}

          <Route
            path="/agent/dashboard"
            element={
              <UserInformationProvider>
                <SupportAgentMainDashboard />
              </UserInformationProvider>
            }
          />
          <Route path="/agent/tickets" element={<SupportTicketsPage />} />
          <Route path="/agent/disputes" element={<SupportDisputesPage />} />
          <Route
            path="/agent/contact-users"
            element={<SupportUserCommunication />}
          />
          <Route path="/agent/knowledge-base" element={<SupportKnowledge />} />
          <Route path="/agent/escalations" element={<SupportEscalation />} />

          {/* Restaurant Router */}

          <Route
            path="/restaurants_manager"
            element={
              <RestaurantLayoutWithProviders>
                <UserInformationProvider>
                  <RestaurantDashboard />
                </UserInformationProvider>
              </RestaurantLayoutWithProviders>
            }
          />
          <Route
            path="/restaurant/orders"
            element={
              <RestaurantLayoutWithProviders>
                <RestaurantCommand />
              </RestaurantLayoutWithProviders>
            }
          />
          <Route
            path="/restaurant/menu"
            element={
              <RestaurantLayoutWithProviders>
                <MenuPlatsPage />
              </RestaurantLayoutWithProviders>
            }
          />
          <Route
            path="/restaurant/stats"
            element={
              <RestaurantLayoutWithProviders>
                <RestaurantStatsPage />
              </RestaurantLayoutWithProviders>
            }
          />
          <Route
            path="/restaurant/reviews"
            element={
              <RestaurantLayoutWithProviders>
                <RestaurantReviews />
              </RestaurantLayoutWithProviders>
            }
          />

          <Route
            path="/restaurant/support/chat"
            element={
              <RestaurantLayoutWithProviders>
                <RestaurantChatSupport />
              </RestaurantLayoutWithProviders>
            }
          />

          {/* Delivery Router */}

          <Route
            path="/delivery/"
            element={
              <DeliveryLayout>
                <UserInformationProvider>
                  <DeliveryDashboard />
                </UserInformationProvider>
              </DeliveryLayout>
            }
          />
          <Route
            path="/delivery/missions"
            element={
              <DeliveryLayout>
                <MissionsPage />
              </DeliveryLayout>
            }
          />
          {/*<Route path="/live-map" element={<CameroonDeliveryMap />} />*/}
          <Route
            path="/delivery/live-map"
            element={
              <DeliveryLayout>
                <RestaurantDeliverCommand />
              </DeliveryLayout>
            }
          />
          <Route
            path="/delivery/earnings"
            element={
              <DeliveryLayout>
                <DeliveryEarningsPage />
              </DeliveryLayout>
            }
          />
          <Route
            path="/delivery/history"
            element={
              <DeliveryLayout>
                <DeliveryHistoryPage />
              </DeliveryLayout>
            }
          />
          {/* <Route path="/delivery/support" element={
          <DeliveryLayout>
          <DeliverySupport />
          </DeliveryLayout>} /> */}

          <Route
            path="/delivery/support/chat"
            element={
              <DeliveryLayout>
                <DeliveryChatSupport />
              </DeliveryLayout>
            }
          />

          {/* Clients Router */}

          <Route
            path="/clients"
            element={
              <UserInformationProvider>
                <ClientsLayout>
                  <ClientDashboard />
                </ClientsLayout>
              </UserInformationProvider>
            }
          />
          <Route
            path="/clients/restaurant"
            element={
              <ClientsLayout>
                <ClientMenus />
              </ClientsLayout>
            }
          />
          <Route
            path="/clients/orders"
            element={
              <ClientsLayout>
                <ClientsCommande />
              </ClientsLayout>
            }
          />
          <Route
            path="/clients/order-history"
            element={
              <ClientsLayout>
                <ClientsCommandeHistory />
              </ClientsLayout>
            }
          />

          <Route
            path="/clients/support/chat"
            element={
              <ClientsLayout>
                <ClientsChatSupport />
              </ClientsLayout>
            }
          />
          <Route
            path="/clients/profile"
            element={
              <UserInformationProvider>
                <ClientsLayout>
                  <ClientsProfilePage />
                </ClientsLayout>
              </UserInformationProvider>
            }
          />
        </Routes>
      </div>
    </QueryClientProvider>
  );
}

export default App;
