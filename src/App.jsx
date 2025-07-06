// src/App.jsx
import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Toaster } from "react-hot-toast";

// Error Boundary
import ErrorBoundary from "./components/ErrorBoundary/ErrorBoundary";

// Context Providers
import { UserInformationProvider } from "./pages/Authentication/const_provider";

// Loading Components
import LoadingSpinner from "./components/CommonShare/LoadingSpinner";

// Lazy load components for better performance
const LandingPage = lazy(() => import("./pages/LandingPage/landing_page"));
const LoginPage = lazy(() => import("./pages/Authentication/login_page"));
const RegisterPage = lazy(() => import("./pages/Authentication/register_page"));
const AboutPage = lazy(() => import("./pages/About/about_page"));
const ContactPage = lazy(() => import("./pages/Contact/contact_page"));
const FoodSafety = lazy(() => import("./pages/food_safety/food_safety"));
const TermsPage = lazy(() => import("./pages/TermsConditions/terms_page"));
const PrivacyPage = lazy(() => import("./pages/Privacy/privacy_page"));

// Dashboard components
const AdminDashboard = lazy(() => import("./pages/Dashboards/Admin/admin_dashboad"));
const ClientDashboard = lazy(() => import("./pages/Dashboards/Clients/clients_dashboards"));
const RestaurantDashboard = lazy(() => import("./pages/Dashboards/Restaurants/restaurants_dashboard"));
const DeliveryDashboard = lazy(() => import("./pages/Dashboards/Delivery/delivery_dashboad"));
const SupportAgentMainDashboard = lazy(() => import("./pages/Dashboards/Agent/agent_dashboard"));

// Admin pages
const UserListPage = lazy(() => import("./pages/Dashboards/Admin/User/userListPage"));
const RestaurantManagement = lazy(() => import("./pages/Dashboards/Admin/Restaurants/restaurantManagement"));
const AdminContactMessages = lazy(() => import("./pages/Dashboards/Admin/Contact/adminContactMessages"));
const AdminOrdersPage = lazy(() => import("./pages/Dashboards/Admin/Orders/adminOrdersPage"));
const StatisticsPage = lazy(() => import("./pages/Dashboards/Admin/Statistics/statisticsPage"));
const AdminDeliveryManagement = lazy(() => import("./pages/Dashboards/Admin/Delivery/adminDeliveryManagement"));
const PromotionManagement = lazy(() => import("./pages/Dashboards/Admin/Promotion/promotionManagement"));

// Agent Support pages
const SupportTicketsPage = lazy(() => import("./pages/Dashboards/Agent/Tickets/ticketsPage"));
const SupportDisputesPage = lazy(() => import("./pages/Dashboards/Agent/Disputes/DisputesPage"));
const SupportUserCommunication = lazy(() => import("./pages/Dashboards/Agent/User_communication/support_user_contact"));
const SupportKnowledge = lazy(() => import("./pages/Dashboards/Agent/knowledge/agents_knowledge"));
const SupportEscalation = lazy(() => import("./pages/Dashboards/Agent/Escalation/agents_escalation"));

// Restaurant pages
const RestaurantOrders = lazy(() => import("./pages/Dashboards/Restaurants/Orders/restaurant_orders"));
const RestaurantMenuManagement = lazy(() => import("./pages/Dashboards/Restaurants/Menu/restaurant_menu"));
const RestaurantStats = lazy(() => import("./pages/Dashboards/Restaurants/Stats/restaurantStats"));
const RestaurantReviews = lazy(() => import("./pages/Dashboards/Restaurants/Review/restaurantreview"));

// Delivery pages
const MissionsPage = lazy(() => import("./pages/Dashboards/Delivery/mission/delivey_mission"));
const RestaurantDeliverCommand = lazy(() => import("./pages/Dashboards/Delivery/map_deliveries/restaurant_command"));
const DeliveryEarningsPage = lazy(() => import("./pages/Dashboards/Delivery/earnings/delivery_earnings"));
const DeliveryHistoryPage = lazy(() => import("./pages/Dashboards/Delivery/History/delivery_history"));
const DeliveryChatSupport = lazy(() => import("./pages/Dashboards/Delivery/Support_chat/delivery_chat"));

// Client pages
const ClientMenus = lazy(() => import("./pages/Dashboards/Clients/Restaurants/clients_restaurants"));
const ClientsCommande = lazy(() => import("./pages/Dashboards/Clients/Commandes/clients_commandes"));
const ClientsCommandeHistory = lazy(() => import("./pages/Dashboards/Clients/Historique/clients_history"));
const ClientsChatSupport = lazy(() => import("./pages/Dashboards/Clients/Contact_support/clients_contact"));
const ClientsProfilePage = lazy(() => import("./pages/Dashboards/Clients/Profil/clients_profile"));

// Layouts
const ClientsLayout = lazy(() => import("./layouts/clients_layout"));
const DeliveryLayout = lazy(() => import("./layouts/delivery_layout"));
const RestaurantLayoutWithProviders = lazy(() => import("./layouts/restaurants_layout"));
const AdminRestaurantProvider = lazy(() => import("./layouts/admin_layout"));

// Common components
const DashboardRedirect = lazy(() => import("./components/CommonShare/redirectToDashboard"));

// Create Query Client with optimized settings
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      retry: (failureCount, error) => {
        // Don't retry on 4xx errors
        if (error?.status >= 400 && error?.status < 500) {
          return false;
        }
        return failureCount < 3;
      },
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
    },
    mutations: {
      retry: 1,
    },
  },
});

// Loading fallback component
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-red-50">
    <LoadingSpinner size="large" />
  </div>
);

// Main App Component
function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <Router>
          <div className="App">
            {/* Global Toast Notifications */}
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#363636',
                  color: '#fff',
                },
                success: {
                  duration: 3000,
                  iconTheme: {
                    primary: '#4ade80',
                    secondary: '#fff',
                  },
                },
                error: {
                  duration: 5000,
                  iconTheme: {
                    primary: '#ef4444',
                    secondary: '#fff',
                  },
                },
              }}
            />

            <Suspense fallback={<PageLoader />}>
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/terms" element={<TermsPage />} />
                <Route path="/privacy" element={<PrivacyPage />} />
                <Route path="/safety" element={<FoodSafety />} />
                <Route path="/dashboard-redirect" element={<DashboardRedirect />} />

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
                <Route path="/admin/users" element={<UserListPage />} />
                <Route path="/admin/restaurants" element={<RestaurantManagement />} />
                <Route path="/admin/contact-messages" element={<AdminContactMessages />} />
                <Route path="/admin/orders" element={<AdminOrdersPage />} />
                <Route path="/admin/statistics" element={<StatisticsPage />} />
                <Route path="/admin/delivery" element={<AdminDeliveryManagement />} />
                <Route path="/admin/promotions" element={<PromotionManagement />} />

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
                <Route path="/agent/contact-users" element={<SupportUserCommunication />} />
                <Route path="/agent/knowledge-base" element={<SupportKnowledge />} />
                <Route path="/agent/escalations" element={<SupportEscalation />} />

                {/* Restaurant Manager Routes */}
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
                      <RestaurantOrders />
                    </RestaurantLayoutWithProviders>
                  }
                />
                <Route
                  path="/restaurant/menu"
                  element={
                    <RestaurantLayoutWithProviders>
                      <RestaurantMenuManagement />
                    </RestaurantLayoutWithProviders>
                  }
                />
                <Route
                  path="/restaurant/statistics"
                  element={
                    <RestaurantLayoutWithProviders>
                      <RestaurantStats />
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

                {/* Delivery Routes */}
                <Route
                  path="/delivery"
                  element={
                    <UserInformationProvider>
                      <DeliveryLayout>
                        <DeliveryDashboard />
                      </DeliveryLayout>
                    </UserInformationProvider>
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
                <Route
                  path="/delivery/map"
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
                <Route
                  path="/delivery/support/chat"
                  element={
                    <DeliveryLayout>
                      <DeliveryChatSupport />
                    </DeliveryLayout>
                  }
                />

                {/* Client Routes */}
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
                  path="/clients/restaurants"
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

                {/* 404 Route */}
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </Suspense>
          </div>
        </Router>

        {/* React Query Devtools (only in development) */}
        {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

// 404 Not Found Component
const NotFoundPage = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="text-center">
      <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
      <p className="text-xl text-gray-600 mb-8">Page not found</p>
      <a
        href="/"
        className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg transition-colors"
      >
        Go Home
      </a>
    </div>
  </div>
);

export default App;