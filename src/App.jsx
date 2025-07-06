// src/App.jsx
import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Toaster } from "react-hot-toast";

// Error Boundary
import ErrorBoundary from "./components/ErrorBoundary";

// Context Providers
import { UserInformationProvider } from "./pages/Authentication/const_provider";

// Loading Components
import LoadingSpinner from "./components/CommonShare/LoadingSpinner";

// Lazy load components for better performance
const LandingPage = lazy(() => import("./pages/LandingPage/homepage"));
const LoginPage = lazy(() => import("./pages/Authentication/login"));
const RegisterPage = lazy(() => import("./pages/Authentication/register"));
const ForgotPasswordPage = lazy(() => import("./pages/Authentication/forgot_password"));
const AboutPage = lazy(() => import("./pages/LandingPage/about_us"));
const ContactPage = lazy(() => import("./pages/LandingPage/contact_us"));
const BecomeAPartnerPage = lazy(() => import("./pages/LandingPage/BecomeAPartner"));
const MenuPage = lazy(() => import("./pages/LandingPage/menus"));
const RestaurantsPage = lazy(() => import("./pages/LandingPage/Restaurants"));

// Privacy and policy pages
const PrivacyPolicy = lazy(() => import("./components/CommonShare/privacy"));
const RefundPolicy = lazy(() => import("./components/CommonShare/refund"));
const TermsAndConditions = lazy(() => import("./components/CommonShare/term"));
const FoodSafety = lazy(() => import("./components/CommonShare/safety"));

// Dashboard components
const AdminDashboard = lazy(() => import("./pages/Dashboards/Admin/admin_dashboard"));
const ClientDashboard = lazy(() => import("./pages/Dashboards/Clients/clients_dashboards"));
const RestaurantDashboard = lazy(() => import("./pages/Dashboards/Restaurants/restaurant_dashboard"));
const DeliveryDashboard = lazy(() => import("./pages/Dashboards/Delivery/delivery_dashboad"));
const SupportAgentMainDashboard = lazy(() => import("./pages/Dashboards/Agent/agent_dashboard"));

// Admin pages
const UserListPage = lazy(() => import("./pages/Dashboards/Admin/Utilisateurs/UserList"));
const RestaurantManagement = lazy(() => import("./pages/Dashboards/Admin/Restaurants/RestaurantsList"));
const AdminContactMessages = lazy(() => import("./pages/Dashboards/Admin/ContactMessages/Contact"));
const AdminOrdersPage = lazy(() => import("./pages/Dashboards/Admin/Orders/orders"));
const StatisticsPage = lazy(() => import("./pages/Dashboards/Admin/Statistics/StatisticsPage"));
const AdminDeliveryManagement = lazy(() => import("./pages/Dashboards/Admin/Delivery/delivery_managemnet"));
const PromotionManagement = lazy(() => import("./pages/Dashboards/Admin/Promotion/promotion"));

// Import OrderProvider
const OrderProviderModule = lazy(() => import("./pages/Dashboards/Restaurants/command/restaurant_command"));

// Agent Support pages
const SupportTicketsPage = lazy(() => import("./pages/Dashboards/Agent/Tickets/ticketsPage"));
const SupportDisputesPage = lazy(() => import("./pages/Dashboards/Agent/Disputes/DisputesPage"));
const SupportUserCommunication = lazy(() => import("./pages/Dashboards/Agent/User_communication/support_user_contact"));
const SupportKnowledge = lazy(() => import("./pages/Dashboards/Agent/knowledge/agents_knowledge"));
const SupportEscalation = lazy(() => import("./pages/Dashboards/Agent/Escalation/agents_escalation"));

// Restaurant pages
const RestaurantCommand = lazy(() => import("./pages/Dashboards/Restaurants/command/restaurant_command"));
const MenuPlatsPage = lazy(() => import("./pages/Dashboards/Restaurants/manager_menu/restuarantMenu"));
const RestaurantStatsPage = lazy(() => import("./pages/Dashboards/Restaurants/statistic/RestaurantStats"));
const RestaurantReviews = lazy(() => import("./pages/Dashboards/Restaurants/Review/restaurantreview"));
const RestaurantChatSupport = lazy(() => import("./pages/Dashboards/Restaurants/contact_support/restaurant-aide"));

// Delivery pages
const MissionsPage = lazy(() => import("./pages/Dashboards/Delivery/mission/delivey_mission"));
const RestaurantDeliverCommand = lazy(() => import("./pages/Dashboards/Delivery/map_deliveries/restaurant_command"));
const DeliveryEarningsPage = lazy(() => import("./pages/Dashboards/Delivery/earnings/delivery_earnings"));
const DeliveryHistoryPage = lazy(() => import("./pages/Dashboards/Delivery/History/delivery_history"));
const DeliveryChatSupport = lazy(() => import("./pages/Dashboards/Delivery/contact_support/delivery_aide"));

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
const AdminLayout = lazy(() => import("./layouts/admin_layout"));
const AdminRestaurantProvider = lazy(() => 
  import("./pages/Dashboards/Admin/Restaurants/RestaurantsList")
    .then(module => ({ default: module.AdminRestaurantProvider }))
);

// Common components
const DashboardRedirect = lazy(() => import("./components/CommonShare/test"));

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
    <LoadingSpinner />
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
                <Route 
                  path="/login" 
                  element={
                    <UserInformationProvider>
                      <LoginPage />
                    </UserInformationProvider>
                  } 
                />
                <Route 
                  path="/register" 
                  element={
                    <UserInformationProvider>
                      <RegisterPage />
                    </UserInformationProvider>
                  } 
                />
                <Route 
                  path="/forgot-password" 
                  element={
                    <UserInformationProvider>
                      <ForgotPasswordPage />
                    </UserInformationProvider>
                  } 
                />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/become" element={<BecomeAPartnerPage />} />
                <Route path="/menu" element={<MenuPage />} />
                <Route path="/restaurants" element={<RestaurantsPage />} />
                <Route path="/test" element={<DashboardRedirect />} />

                {/* Privacy and Policy Routes */}
                <Route path="/terms" element={<PrivacyPolicy />} />
                <Route path="/privacy" element={<RefundPolicy />} />
                <Route path="/refund" element={<TermsAndConditions />} />
                <Route path="/safety" element={<FoodSafety />} />

                {/* Admin Routes */}
                <Route
                  path="/admin"
                  element={
                    <UserInformationProvider>
                      <AdminRestaurantProvider>
                        <AdminLayout>
                          <AdminDashboard />
                        </AdminLayout>
                      </AdminRestaurantProvider>
                    </UserInformationProvider>
                  }
                />
                <Route
                  path="/admin/dashboard"
                  element={
                    <UserInformationProvider>
                      <AdminRestaurantProvider>
                        <AdminLayout>
                          <AdminDashboard />
                        </AdminLayout>
                      </AdminRestaurantProvider>
                    </UserInformationProvider>
                  }
                />
                <Route 
                  path="/admin/users" 
                  element={
                    <UserInformationProvider>
                      <AdminRestaurantProvider>
                        <AdminLayout>
                          <UserListPage />
                        </AdminLayout>
                      </AdminRestaurantProvider>
                    </UserInformationProvider>
                  } 
                />
                <Route 
                  path="/admin/user" 
                  element={
                    <UserInformationProvider>
                      <AdminRestaurantProvider>
                        <AdminLayout>
                          <UserListPage />
                        </AdminLayout>
                      </AdminRestaurantProvider>
                    </UserInformationProvider>
                  } 
                />
                <Route 
                  path="/admin/restaurants" 
                  element={
                    <UserInformationProvider>
                      <AdminRestaurantProvider>
                        <AdminLayout>
                          <RestaurantManagement />
                        </AdminLayout>
                      </AdminRestaurantProvider>
                    </UserInformationProvider>
                  } 
                />
                <Route 
                  path="/admin/contact-messages" 
                  element={
                    <UserInformationProvider>
                      <AdminRestaurantProvider>
                        <AdminLayout>
                          <AdminContactMessages />
                        </AdminLayout>
                      </AdminRestaurantProvider>
                    </UserInformationProvider>
                  } 
                />
                <Route 
                  path="/admin/orders" 
                  element={
                    <UserInformationProvider>
                      <AdminRestaurantProvider>
                        <AdminLayout>
                          <AdminOrdersPage />
                        </AdminLayout>
                      </AdminRestaurantProvider>
                    </UserInformationProvider>
                  } 
                />
                <Route 
                  path="/admin/statistics" 
                  element={
                    <UserInformationProvider>
                      <AdminRestaurantProvider>
                        <AdminLayout>
                          <StatisticsPage />
                        </AdminLayout>
                      </AdminRestaurantProvider>
                    </UserInformationProvider>
                  } 
                />
                <Route 
                  path="/admin/delivery" 
                  element={
                    <UserInformationProvider>
                      <AdminRestaurantProvider>
                        <AdminLayout>
                          <AdminDeliveryManagement />
                        </AdminLayout>
                      </AdminRestaurantProvider>
                    </UserInformationProvider>
                  } 
                />
                <Route 
                  path="/admin/promotion" 
                  element={
                    <UserInformationProvider>
                      <AdminRestaurantProvider>
                        <AdminLayout>
                          <PromotionManagement />
                        </AdminLayout>
                      </AdminRestaurantProvider>
                    </UserInformationProvider>
                  } 
                />

                {/* Agent Support Routes */}
                <Route
                  path="/agent/dashboard"
                  element={
                    <UserInformationProvider>
                      <SupportAgentMainDashboard />
                    </UserInformationProvider>
                  }
                />
                <Route 
                  path="/agent/tickets" 
                  element={
                    <UserInformationProvider>
                      <SupportTicketsPage />
                    </UserInformationProvider>
                  } 
                />
                <Route 
                  path="/agent/disputes" 
                  element={
                    <UserInformationProvider>
                      <SupportDisputesPage />
                    </UserInformationProvider>
                  } 
                />
                <Route 
                  path="/agent/contact-users" 
                  element={
                    <UserInformationProvider>
                      <SupportUserCommunication />
                    </UserInformationProvider>
                  } 
                />
                <Route 
                  path="/agent/knowledge-base" 
                  element={
                    <UserInformationProvider>
                      <SupportKnowledge />
                    </UserInformationProvider>
                  } 
                />
                <Route 
                  path="/agent/escalations" 
                  element={
                    <UserInformationProvider>
                      <SupportEscalation />
                    </UserInformationProvider>
                  } 
                />

                {/* Restaurant Manager Routes */}
                <Route
                  path="/restaurants_manager"
                  element={
                    <UserInformationProvider>
                      <RestaurantLayoutWithProviders>
                        <RestaurantDashboard />
                      </RestaurantLayoutWithProviders>
                    </UserInformationProvider>
                  }
                />
                <Route
                  path="/restaurant/orders"
                  element={
                    <UserInformationProvider>
                      <RestaurantLayoutWithProviders>
                        <RestaurantCommand />
                      </RestaurantLayoutWithProviders>
                    </UserInformationProvider>
                  }
                />
                <Route
                  path="/restaurant/menu"
                  element={
                    <UserInformationProvider>
                      <RestaurantLayoutWithProviders>
                        <MenuPlatsPage />
                      </RestaurantLayoutWithProviders>
                    </UserInformationProvider>
                  }
                />
                <Route
                  path="/restaurant/stats"
                  element={
                    <UserInformationProvider>
                      <RestaurantLayoutWithProviders>
                        <RestaurantStatsPage />
                      </RestaurantLayoutWithProviders>
                    </UserInformationProvider>
                  }
                />
                <Route
                  path="/restaurant/reviews"
                  element={
                    <UserInformationProvider>
                      <RestaurantLayoutWithProviders>
                        <RestaurantReviews />
                      </RestaurantLayoutWithProviders>
                    </UserInformationProvider>
                  }
                />
                <Route
                  path="/restaurant/support/chat"
                  element={
                    <UserInformationProvider>
                      <RestaurantLayoutWithProviders>
                        <RestaurantChatSupport />
                      </RestaurantLayoutWithProviders>
                    </UserInformationProvider>
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
                    <UserInformationProvider>
                      <DeliveryLayout>
                        <MissionsPage />
                      </DeliveryLayout>
                    </UserInformationProvider>
                  }
                />
                <Route
                  path="/delivery/live-map"
                  element={
                    <UserInformationProvider>
                      <DeliveryLayout>
                        <RestaurantDeliverCommand />
                      </DeliveryLayout>
                    </UserInformationProvider>
                  }
                />
                <Route
                  path="/delivery/earnings"
                  element={
                    <UserInformationProvider>
                      <DeliveryLayout>
                        <DeliveryEarningsPage />
                      </DeliveryLayout>
                    </UserInformationProvider>
                  }
                />
                <Route
                  path="/delivery/history"
                  element={
                    <UserInformationProvider>
                      <DeliveryLayout>
                        <DeliveryHistoryPage />
                      </DeliveryLayout>
                    </UserInformationProvider>
                  }
                />
                <Route
                  path="/delivery/support/chat"
                  element={
                    <UserInformationProvider>
                      <DeliveryLayout>
                        <DeliveryChatSupport />
                      </DeliveryLayout>
                    </UserInformationProvider>
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
                  path="/clients/restaurant"
                  element={
                    <UserInformationProvider>
                      <ClientsLayout>
                        <ClientMenus />
                      </ClientsLayout>
                    </UserInformationProvider>
                  }
                />
                <Route
                  path="/clients/orders"
                  element={
                    <UserInformationProvider>
                      <ClientsLayout>
                        <ClientsCommande />
                      </ClientsLayout>
                    </UserInformationProvider>
                  }
                />
                <Route
                  path="/clients/order-history"
                  element={
                    <UserInformationProvider>
                      <ClientsLayout>
                        <ClientsCommandeHistory />
                      </ClientsLayout>
                    </UserInformationProvider>
                  }
                />
                <Route
                  path="/clients/support/chat"
                  element={
                    <UserInformationProvider>
                      <ClientsLayout>
                        <ClientsChatSupport />
                      </ClientsLayout>
                    </UserInformationProvider>
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