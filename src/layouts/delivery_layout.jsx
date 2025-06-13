import React, { useState, useEffect, createContext, useContext, useMemo } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Globe, 
  Bell, 
  User, 
  Settings, 
  LogOut, 
  Menu, 
  X, 
  Map, 
  Clock, 
  Award, 
  FileText, 
  HelpCircle,
  Truck,
  DollarSign,
  Navigation,
  Battery,
  Wifi,
  CheckCircle,
  AlertCircle,
  Phone,
  Mail,
  MapPin,
  Star,
  TrendingUp,
  Package,
  Route,
  Timer,
  Target
} from 'lucide-react';

// Contexte pour les données de livraison
export const DeliveryContext = createContext();

export const useDeliveryContext = () => {
  const context = useContext(DeliveryContext);
  if (!context) {
    throw new Error('useDeliveryContext must be used within DeliveryLayout');
  }
  return context;
};

// Fournisseur de données de livraison
const DeliveryProvider = ({ children }) => {
  const [deliveryData, setDeliveryData] = useState({
    driver: {
      name: "Jean Dupont",
      phone: "+237 6XX XXX XXX",
      email: "jean.dupont@eatfast.cm",
      rating: 4.9,
      totalDeliveries: 1247,
      status: "online", // online, offline, busy
      vehicleType: "Moto",
      licenseNumber: "CM-123-ABC",
      joinDate: "2023-01-15"
    },
    todayStats: {
      deliveries: 12,
      earnings: 45000,
      distance: 67.5,
      rating: 4.8,
      onTimeRate: 96
    },
    weeklyStats: {
      deliveries: 78,
      earnings: 285000,
      distance: 425.3,
      averageTime: 28
    },
    currentMission: {
      id: "CMD-001234",
      restaurant: "Restaurant Chez Mama",
      customer: "Marie Atangana",
      address: "Bonanjo, Douala",
      estimatedTime: 15,
      distance: 3.2,
      status: "en_route" // new, accepted, picked_up, en_route, delivered
    }
  });

  const [notifications, setNotifications] = useState([
    { id: 1, type: 'mission', message: 'Nouvelle mission disponible près de vous', time: '2 min', unread: true },
    { id: 2, type: 'bonus', message: 'Bonus de performance débloqué !', time: '15 min', unread: true },
    { id: 3, type: 'system', message: 'Mise à jour de l\'application disponible', time: '1h', unread: false }
  ]);

  const [currentTime, setCurrentTime] = useState(new Date());

  const unreadCount = useMemo(() => 
    notifications.filter(n => n.unread).length, 
    [notifications]
  );

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  return (
    <DeliveryContext.Provider value={{ 
      deliveryData, 
      setDeliveryData, 
      notifications, 
      setNotifications, 
      unreadCount,
      currentTime 
    }}>
      {children}
    </DeliveryContext.Provider>
  );
};

// Composant Popup de Bienvenue
const WelcomePopup = ({ show, onClose }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-lg w-full transform transition-all duration-500 scale-100 animate-bounce-in">
        <div className="p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-orange-600 via-red-500 to-pink-600 bg-clip-text text-transparent">
              Bienvenue Partenaire Livraison
            </h2>
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
            >
              <X size={24} />
            </button>
          </div>
          
          <div className="mb-8">
            <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-orange-500 via-red-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg">
              <Truck className="text-white" size={28} />
            </div>
            <p className="text-gray-600 dark:text-gray-300 text-center leading-relaxed text-lg">
              Prêt à commencer vos livraisons ? Gérez vos missions, suivez vos gains et 
              offrez un service exceptionnel à nos clients.
            </p>
          </div>
          
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-2 bg-orange-100 rounded-full flex items-center justify-center">
                <Map className="text-orange-600" size={20} />
              </div>
              <p className="text-sm text-gray-600">Missions</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-2 bg-green-100 rounded-full flex items-center justify-center">
                <DollarSign className="text-green-600" size={20} />
              </div>
              <p className="text-sm text-gray-600">Gains</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-2 bg-blue-100 rounded-full flex items-center justify-center">
                <Award className="text-blue-600" size={20} />
              </div>
              <p className="text-sm text-gray-600">Performances</p>
            </div>
          </div>
          
          <button
            onClick={onClose}
            className="w-full bg-gradient-to-r from-orange-600 via-red-500 to-pink-600 text-white py-4 px-6 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-105"
          >
            Commencer mes Livraisons
          </button>
        </div>
      </div>
    </div>
  );
};

// Composant Popup des Notifications
const NotificationPopup = ({ show, onClose, notifications }) => {
  if (!show) return null;

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'mission': return <Package size={18} className="text-orange-600" />;
      case 'bonus': return <Award size={18} className="text-green-500" />;
      case 'system': return <Settings size={18} className="text-blue-600" />;
      default: return <Bell size={18} className="text-gray-600" />;
    }
  };

  return (
    <div className="absolute right-0 top-12 w-80 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 z-50 max-h-96 overflow-hidden">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Notifications</h3>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={20} />
          </button>
        </div>
      </div>
      <div className="max-h-72 overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="p-6 text-center">
            <Bell className="mx-auto text-gray-300 mb-2" size={32} />
            <p className="text-gray-500">Aucune notification</p>
          </div>
        ) : (
          notifications.map((notification) => (
            <div 
              key={notification.id} 
              className={`p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                notification.unread ? 'bg-orange-50' : ''
              }`}
            >
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 mt-1">
                  {getNotificationIcon(notification.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">
                    {notification.message}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Il y a {notification.time}
                  </p>
                </div>
                {notification.unread && (
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

const DeliveryLayout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { deliveryData, notifications, unreadCount, currentTime } = useDeliveryContext();
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showWelcomePopup, setShowWelcomePopup] = useState(() => {
    return !sessionStorage.getItem('eatfast_delivery_welcome_shown');
  });
  const [showNotifications, setShowNotifications] = useState(false);

  // Gestion de la déconnexion
  const handleLogout = () => {
    console.log('Delivery logout');
    navigate('/login');
  };

  const handleWelcomeClose = () => {
    setShowWelcomePopup(false);
    sessionStorage.setItem('eatfast_delivery_welcome_shown', 'true');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'online': return 'bg-green-100 text-green-800 border-green-200';
      case 'offline': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'busy': return 'bg-orange-100 text-orange-800 border-orange-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'online': return 'En Ligne';
      case 'offline': return 'Hors Ligne';
      case 'busy': return 'Occupé';
      default: return 'Inconnu';
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XAF',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 transition-all duration-300">
      {/* Popup de Bienvenue */}
      <WelcomePopup show={showWelcomePopup} onClose={handleWelcomeClose} />
      
      {/* En-tête Mobile */}
      <div className="lg:hidden bg-white shadow-lg border-b border-gray-200">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 rounded-lg bg-gradient-to-r from-orange-500 to-red-500 text-white hover:from-orange-600 hover:to-red-600 transform hover:scale-105 transition-all duration-200"
            >
              {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center text-white font-bold">
                E
              </div>
              <span className="font-bold text-gray-800">EatFast Livraison</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <HeaderControls notifications={unreadCount} />
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <div className={`fixed inset-y-0 left-0 z-50 w-80 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}>
          <div className="flex flex-col h-full">
            {/* Logo et Info Chauffeur */}
            <div className="p-6 border-b border-gray-200 bg-gradient-to-br from-orange-50 to-red-50">
              <div className="flex items-center justify-between mb-4">
                <Link to="/delivery" className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center text-white font-bold text-lg transform hover:scale-110 transition-transform duration-200">
                    E
                  </div>
                  <div>
                    <h1 className="font-bold text-xl text-gray-800">EatFast</h1>
                    <p className="text-sm text-gray-500">Partenaire Livraison</p>
                  </div>
                </Link>
                {isSidebarOpen && (
                  <button 
                    onClick={() => setIsSidebarOpen(false)}
                    className="lg:hidden text-gray-500 hover:text-gray-700 transition-colors p-2 rounded-full hover:bg-gray-200"
                  >
                    <X size={20} />
                  </button>
                )}
              </div>

              {/* Informations du Chauffeur */}
              <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-gray-900 text-lg">{deliveryData.driver.name}</h3>
                  <span className={`text-xs px-3 py-1 rounded-full border font-medium ${getStatusColor(deliveryData.driver.status)}`}>
                    {getStatusText(deliveryData.driver.status)}
                  </span>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-gray-600">
                    <Star className="mr-2 text-yellow-500" size={14} />
                    <span className="font-medium">{deliveryData.driver.rating}</span>
                    <span className="ml-1 text-gray-500">({deliveryData.driver.totalDeliveries} livraisons)</span>
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-600">
                    <Truck className="mr-2 text-blue-600" size={14} />
                    <span>{deliveryData.driver.vehicleType} - {deliveryData.driver.licenseNumber}</span>
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-600">
                    <Phone className="mr-2 text-green-600" size={14} />
                    <span>{deliveryData.driver.phone}</span>
                  </div>
                </div>

                {/* Statistiques du Jour */}
                <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-gray-200">
                  <div className="text-center">
                    <p className="text-lg font-bold text-orange-600">{deliveryData.todayStats.deliveries}</p>
                    <p className="text-xs text-gray-500">Livraisons aujourd'hui</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold text-green-600">{formatCurrency(deliveryData.todayStats.earnings)}</p>
                    <p className="text-xs text-gray-500">Gains du jour</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Mission Actuelle */}
            {deliveryData.currentMission && (
              <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
                <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
                  <Navigation className="mr-2 text-blue-600" size={16} />
                  Mission Actuelle
                </h4>
                <div className="bg-white p-3 rounded-lg shadow-sm">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-sm font-medium text-gray-900">#{deliveryData.currentMission.id}</span>
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                      En Route
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-1">{deliveryData.currentMission.restaurant}</p>
                  <p className="text-sm text-gray-600 mb-2">→ {deliveryData.currentMission.customer}</p>
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>{deliveryData.currentMission.distance} km</span>
                    <span>{deliveryData.currentMission.estimatedTime} min</span>
                  </div>
                </div>
              </div>
            )}

            {/* Contrôles Desktop */}
            <div className="hidden lg:block p-4 border-b border-gray-200">
              <HeaderControls notifications={unreadCount} />
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
              <NavItem 
                icon={<User size={20} />}
                label="Tableau de Bord" 
                path="/delivery" 
                isActive={location.pathname === '/delivery'}
              />
              <NavItem 
                icon={<Map size={20} />}
                label="Missions" 
                path="/missions" 
                isActive={location.pathname === '/missions'}
                badge={unreadCount > 0 ? unreadCount : null}
              />
              <NavItem 
                icon={<Route size={20} />}
                label="Carte en Direct" 
                path="/live-map" 
                isActive={location.pathname === '/live-map'}
              />
              <NavItem 
                icon={<DollarSign size={20} />}
                label="Mes Gains" 
                path="/earnings" 
                isActive={location.pathname === '/earnings'}
              />
              <NavItem 
                icon={<FileText size={20} />}
                label="Historique Livraisons" 
                path="/history" 
                isActive={location.pathname === '/history'}
              />
              <NavItem 
                icon={<Target size={20} />}
                label="Performances" 
                path="/performance" 
                isActive={location.pathname === '/performance'}
              />
              <NavItem 
                icon={<HelpCircle size={20} />}
                label="Support & Aide" 
                path="/support" 
                isActive={location.pathname === '/support'}
              />
            </nav>

            {/* Profil et Actions */}
            <div className="p-4 border-t border-gray-200 bg-gray-50">
              <div className="bg-white rounded-xl p-4 mb-3 shadow-sm border border-gray-100">
                <div className="flex items-center mb-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                    {deliveryData.driver.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="ml-3">
                    <p className="font-semibold text-gray-800 text-sm">{deliveryData.driver.name}</p>
                    <p className="text-xs text-green-500 flex items-center">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-1 animate-pulse"></div>
                      {getStatusText(deliveryData.driver.status)}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 text-xs text-gray-500 mb-3">
                  <Mail size={12} />
                  <span>{deliveryData.driver.email}</span>
                </div>

                {/* Statistiques Rapides */}
                <div className="grid grid-cols-2 gap-2 text-center border-t border-gray-100 pt-3">
                  <div>
                    <p className="text-sm font-bold text-green-600">{deliveryData.todayStats.distance} km</p>
                    <p className="text-xs text-gray-500">Distance</p>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-blue-600">{deliveryData.todayStats.onTimeRate}%</p>
                    <p className="text-xs text-gray-500">À l'heure</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <ProfileButton 
                  icon={<Settings size={16} />} 
                  label="Paramètres" 
                  path="/settings"
                />
                <ProfileButton 
                  icon={<LogOut size={16} />} 
                  label="Se Déconnecter" 
                  onClick={handleLogout}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Overlay pour mobile */}
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Contenu Principal */}
        <div className="flex-1 lg:ml-0">
          <main className="min-h-screen">
            {/* Barre d'état supérieure */}
            <div className="hidden lg:block bg-white shadow-sm border-b border-gray-200 px-8 py-4">
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Tableau de Bord Livraison</h1>
                  <p className="text-sm text-gray-500 mt-1">
                    {currentTime.toLocaleDateString('fr-FR', { 
                      weekday: 'long', 
                      day: 'numeric', 
                      month: 'long', 
                      year: 'numeric' 
                    })} - {currentTime.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
                
                <div className="flex items-center space-x-4">
                  {/* Indicateurs de Statut */}
                  <div className="flex items-center space-x-4 bg-gray-50 px-4 py-2 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Battery className="text-green-500" size={16} />
                      <span className="text-sm text-gray-600">98%</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Wifi className="text-blue-500" size={16} />
                      <span className="text-sm text-gray-600">4G</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-sm font-medium text-green-600">En Ligne</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-4 lg:p-8">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

// Composant Contrôles d'En-tête
const HeaderControls = ({ notifications }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const { notifications: notificationList } = useDeliveryContext();

  return (
    <div className="flex items-center space-x-3">
      {/* Notifications */}
      <div className="relative">
        <button 
          onClick={() => setShowNotifications(!showNotifications)}
          className="relative p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transform hover:scale-110 transition-all duration-200"
        >
          <Bell size={18} className="text-gray-600 hover:text-orange-500 transition-colors" />
          {notifications > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center animate-pulse">
              {notifications}
            </span>
          )}
        </button>
        
        {showNotifications && (
          <NotificationPopup 
            show={showNotifications} 
            onClose={() => setShowNotifications(false)}
            notifications={notificationList}
          />
        )}
      </div>
    </div>
  );
};

// Composant Élément de Navigation
const NavItem = ({ icon, label, path, isActive, badge }) => (
  <Link
    to={path}
    className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transform hover:scale-[1.02] transition-all duration-200 font-medium ${
      isActive
        ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg' 
        : 'hover:bg-gradient-to-r hover:from-orange-50 hover:to-red-50 text-gray-700 hover:text-orange-600'
    }`}
  >
    <div className="flex items-center space-x-3">
      <div className={`p-2 rounded-lg transition-all duration-200 ${
        isActive 
          ? 'bg-white/20 text-white' 
          : 'bg-gray-100 text-orange-600 group-hover:bg-orange-100'
      }`}>
        {icon}
      </div>
      <span>{label}</span>
    </div>
    {badge && (
      <span className={`text-xs px-2 py-1 rounded-full font-medium ${
        isActive 
          ? 'bg-white/20 text-white' 
          : 'bg-orange-100 text-orange-600'
      }`}>
        {badge}
      </span>
    )}
  </Link>
);

// Composant Bouton de Profil
const ProfileButton = ({ icon, label, path, onClick }) => {
  if (path) {
    return (
      <Link
        to={path}
        className="flex items-center space-x-2 w-full p-3 rounded-lg hover:bg-gray-100 text-gray-600 hover:text-gray-800 transition-all duration-200 group"
      >
        <div className="text-gray-500 group-hover:text-gray-700 group-hover:scale-110 transition-all duration-200">
          {icon}
        </div>
        <span className="text-sm font-medium">{label}</span>
      </Link>
    );
  }

  return (
    <button
      onClick={onClick}
      className="flex items-center space-x-2 w-full p-3 rounded-lg hover:bg-red-50 text-gray-600 hover:text-red-600 transition-all duration-200 group"
    >
      <div className="text-red-500 group-hover:text-red-600 group-hover:scale-110 transition-all duration-200">
        {icon}
      </div>
      <span className="text-sm font-medium">{label}</span>
    </button>
  );
};

// Composant principal avec fournisseurs
const DeliveryLayoutWithProviders = ({ children }) => {
  return (
    <DeliveryProvider>
      <DeliveryLayout>{children}</DeliveryLayout>
    </DeliveryProvider>
  );
};

export default DeliveryLayoutWithProviders;