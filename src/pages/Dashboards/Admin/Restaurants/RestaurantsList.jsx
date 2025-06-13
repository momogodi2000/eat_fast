import React, { useState, useEffect, useRef, createContext } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { 
  FiSearch, 
  FiPlus, 
  FiFilter, 
  FiRefreshCw, 
  FiDownload, 
  FiMessageSquare,
  FiAward,
  FiAlertTriangle,
  FiChevronDown,
  FiEdit,
  FiTrash2,
  FiShield,
  FiStar,
  FiPackage,
  FiClock,
  FiDollarSign,
  FiMapPin,
  FiPhone,
  FiMail,
  FiShoppingBag, 
  FiCheck, 
  FiX, 
  FiSend 
} from 'react-icons/fi';
import { HiOutlineSpeakerphone } from 'react-icons/hi';
import AdminLayout from '../../../../layouts/admin_layout';
import { Tooltip, Badge, Modal, Progress } from '../../../../components/ui/ui-components';
import { OrderProvider } from '../../Restaurants/command/restaurant_command';
import { useFetcher } from 'react-router-dom';


export const adminRestaurantContext = createContext();

export const registerRestaurantContext = createContext();

// Mock data for register Restaurant 

const mockRegisterRestaurants = [];



// Mock data for restaurants
const mockRestaurants = [
  {
    id: 1,
    name: "Chez Pierre",
    address: "123 Avenue Kennedy, Douala",
    cuisine: "Traditionnel Camerounais",
    rating: 4.8,
    orders: 245,
    revenue: 1350000,
    status: "active",
    verificationStatus: "verified",
    complianceScore: 97,
    image: "https://placeholder.com/restaurant1.jpg",
    createdAt: "2024-12-01",
    contactPhone: "+237 698765432",
    contactEmail: "contact@chezpierre.cm",
    categorie  : "African",
    avgDeliveryTime : 20
  },
  {
    id: 2,
    name: "Le Gourmet",
    address: "45 Rue de la Paix, Yaoundé",
    cuisine: "Fusion",
    rating: 4.2,
    orders: 185,
    revenue: 920000,
    status: "active",
    verificationStatus: "pending",
    complianceScore: 82,
    image: "https://placeholder.com/restaurant2.jpg",
    createdAt: "2025-01-15",
    contactPhone: "+237 699876543",
    contactEmail: "info@legourmet.cm",
    categorie: "Asian",
    avgDeliveryTime : 17
  },
  {
    id: 3,
    name: "Mama Africa",
    address: "78 Rue des Manguiers, Douala",
    cuisine: "Local",
    rating: 4.6,
    orders: 320,
    revenue: 1750000,
    status: "suspended",
    verificationStatus: "verified",
    complianceScore: 65,
    image: "https://placeholder.com/restaurant3.jpg",
    createdAt: "2024-11-20",
    contactPhone: "+237 697654321",
    contactEmail: "mamaafrica@gmail.com",
    categorie : "African",
    avgDeliveryTime : 25
  },
  {
    id: 4,
    name: "Fresh Taste",
    address: "22 Boulevard de la Liberté, Yaoundé",
    cuisine: "Healthy",
    rating: 4.4,
    orders: 156,
    revenue: 834000,
    status: "active",
    verificationStatus: "verified",
    complianceScore: 91,
    image: "https://placeholder.com/restaurant4.jpg",
    createdAt: "2025-02-05",
    contactPhone: "+237 696543210",
    contactEmail: "contact@freshtaste.cm",
    categorie : "Others",
    avgDeliveryTime : 12
  },
  {
    id: 5,
    name: "Délices Express",
    address: "5 Avenue de l'Indépendance, Douala",
    cuisine: "Fast Food",
    rating: 3.9,
    orders: 425,
    revenue: 2100000,
    status: "active",
    verificationStatus: "verified",
    complianceScore: 86,
    image: "https://placeholder.com/restaurant5.jpg",
    createdAt: "2024-09-30",
    contactPhone: "+237 695432109",
    contactEmail: "delices@express.cm",
    categorie : "Others",
    avgDeliveryTime : 30
  },
  {
    id: 6,
    name: "Le Bistrot Chic",
    address: "12 Rue des Flamboyants, Yaoundé",
    cuisine: "Français",
    rating: 4.7,
    orders: 98,
    revenue: 1250000,
    status: "pending",
    verificationStatus: "pending",
    complianceScore: 0,
    image: "https://placeholder.com/restaurant6.jpg",
    createdAt: "2025-03-10",
    contactPhone: "+237 694321098",
    contactEmail: "contact@bistrotchic.cm",
    categorie: "European",
    avgDeliveryTime : 20
  }
];

const   RestaurantManagement = () => {
  const { t, i18n } = useTranslation();
  const chatbotRef = useRef(null);
  
  // States
  const [restaurants, setRestaurants] = useState(mockRestaurants);
  const [filteredRestaurants, setFilteredRestaurants] = useState(mockRestaurants);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { role: 'system', content: t('chatbotWelcome') }
  ]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [statsView, setStatsView] = useState('overview'); // overview, performance, compliance
  
  // Filter, sort and search effects
  useEffect(() => {
    let results = [...restaurants];
    
    // Apply search filter
    if (searchTerm) {
      results = results.filter(restaurant => 
        restaurant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        restaurant.cuisine.toLowerCase().includes(searchTerm.toLowerCase()) ||
        restaurant.address.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply status filter
    if (filterStatus !== 'all') {
      results = results.filter(restaurant => restaurant.status === filterStatus);
    }
    
    // Apply sorting
    results.sort((a, b) => {
      if (sortBy === 'name') {
        return sortOrder === 'asc' 
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      } else if (sortBy === 'rating') {
        return sortOrder === 'asc' ? a.rating - b.rating : b.rating - a.rating;
      } else if (sortBy === 'orders') {
        return sortOrder === 'asc' ? a.orders - b.orders : b.orders - a.orders;
      } else if (sortBy === 'revenue') {
        return sortOrder === 'asc' ? a.revenue - b.revenue : b.revenue - a.revenue;
      }
      return 0;
    });
    
    setFilteredRestaurants(results);
  }, [restaurants, searchTerm, filterStatus, sortBy, sortOrder, i18n.language]);
  
  // Handle restaurant click for details
  const handleRestaurantClick = (restaurant) => {
    setSelectedRestaurant(restaurant);
    setIsDetailModalOpen(true);
  };
  
  // Handle status updates
  const handleStatusChange = (restaurantId, newStatus) => {
    setRestaurants(prevRestaurants => 
      prevRestaurants.map(r => 
        r.id === restaurantId ? { ...r, status: newStatus } : r
      )
    );
    
    // Close modal after update
    if (selectedRestaurant && selectedRestaurant.id === restaurantId) {
      setIsDetailModalOpen(false);
    }
  };
  
  // Handle chatbot toggle
  const toggleChatbot = () => {
    setIsChatbotOpen(!isChatbotOpen);
    // Scroll to bottom of chat when opening
    if (!isChatbotOpen) {
      setTimeout(() => {
        if (chatbotRef.current) {
          chatbotRef.current.scrollTop = chatbotRef.current.scrollHeight;
        }
      }, 100);
    }
  };
  
  // Handle chat messages
  const handleSendMessage = () => {
    if (!currentMessage.trim()) return;
    
    // Add user message
    setChatMessages(prev => [...prev, { role: 'user', content: currentMessage }]);
    
    // Simulate AI response
    setTimeout(() => {
      setChatMessages(prev => [...prev, { 
        role: 'system', 
        content: t('chatbotResponse', { query: currentMessage })
      }]);
      
      // Scroll to bottom
      if (chatbotRef.current) {
        chatbotRef.current.scrollTop = chatbotRef.current.scrollHeight;
      }
    }, 1000);
    
    setCurrentMessage('');
  };
  
  // Handle "Add Restaurant" click
  const handleAddRestaurant = () => {
    setIsAddModalOpen(true);
  };
  
  // Simulated form submission
  const handleSubmitNewRestaurant = (e) => {
    e.preventDefault();
    setLoading(true);

    const inputRestaurantName = document.getElementById("restaurantName").value;

    const inputCuisineType = document.getElementById("cuisineType").value;
    
    const inputContactPhone = document.getElementById("contactPhone").value;

    const inputContactMail = document.getElementById("contactEmail").value;

    const inputAddress = document.getElementById("address").value;

    const inputCity = document.getElementById("city").value;

    const inputStatus = document.getElementById("status").value ; 

   
    const inputCategorie = document.getElementById("categorie").value;


    const today = new Date();

    const date = `${today.getFullYear().toString()+ "-"+today.getMonth().toString() +" -" +today.getDate().toString()}`
    const newRestaurant = {
      id : mockRestaurants.length + 1 ,
      name : inputRestaurantName,
      address : inputAddress,
      cuisine : inputCuisineType,
      status : inputStatus,
      // image 
      verificationStatus : inputStatus === "active" ? "verified":"pending" ,
      createdAt : new Date().toISOString().split('T')[0],
      rating : 1.0,
      contactPhone : inputContactPhone,
      contactEmail : inputContactMail,
      categorie : inputCategorie,
      orders:0,
      revenue : 0 ,
      city : inputCity,
      avgDeliveryTime : 30

    }

    const registerRestaurantsNotification = {

      action : "added" ,

      name : inputRestaurantName,

      id : mockRestaurants.length + 1 ,

      type : "restaurant",

      createdAt : new Date(Date.now())


    }

    mockRestaurants.push(newRestaurant);

    mockRegisterRestaurants.push(registerRestaurantsNotification);

 

    // setRestaurants([...restaurants, newRestaurant])


   
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setIsAddModalOpen(false);
      
      // Add success message or notification here
    }, 2000);
  };
  
  // Simulate data refresh
  const handleRefreshData = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      // You could fetch new data here in a real application
    }, 1000);
  };
  
  // Function to get status badge color
  const getStatusBadgeColor = (status) => {
    switch(status) {
      case 'active': return 'bg-green-500';
      case 'suspended': return 'bg-red-500';
      case 'pending': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };
  
  // Function to get verification badge color
  const getVerificationBadgeColor = (status) => {
    switch(status) {
      case 'verified': return 'bg-blue-500';
      case 'pending': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };
  
  // Function to get compliance score color
  const getComplianceScoreColor = (score) => {
    if (score >= 90) return 'text-green-500';
    if (score >= 70) return 'text-yellow-500';
    return 'text-red-500';
  };

  return (
    <AdminLayout>
      <div className="animate-fadeIn">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
          <motion.h1 
            className="text-2xl md:text-3xl font-bold mb-2 md:mb-0"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {t('restaurantManagement')}
          </motion.h1>
          
          <div className="flex flex-wrap items-center gap-2 md:gap-4">
            <button 
              onClick={handleAddRestaurant}
              className="flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-1"
            >
              <FiPlus className="mr-2" /> {t('addRestaurant')}
            </button>
            
            <button 
              onClick={handleRefreshData}
              className="flex items-center px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-1"
            >
              <FiRefreshCw className={`mr-2 ${loading ? 'animate-spin' : ''}`} /> {t('refresh')}
            </button>
            
            <button 
              className="flex items-center px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-1"
            >
              <FiDownload className="mr-2" /> {t('export')}
            </button>
            
            <button 
              onClick={toggleChatbot}
              className="relative flex items-center px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-1"
            >
              <FiMessageSquare className="mr-2" /> {t('aiAssistant')}
              {!isChatbotOpen && (
                <span className="absolute -top-2 -right-2 w-4 h-4 bg-red-500 rounded-full"></span>
              )}
            </button>
          </div>
        </div>
        
        {/* Filters & Search */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 mb-6">
          <div className="flex flex-col md:flex-row justify-between gap-4">
            <div className="relative">
              <FiSearch className="absolute left-3 top-3 text-gray-400" />
              <input 
                type="text" 
                className="pl-10 pr-4 py-2 w-full md:w-80 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-green-500 dark:focus:ring-green-600 focus:border-transparent transition-all duration-200"
                placeholder={t('searchRestaurants')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex flex-wrap gap-2">
              <div className="relative">
                <select 
                  className="pl-4 pr-8 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-green-500 dark:focus:ring-green-600 focus:border-transparent appearance-none transition-all duration-200"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option value="all">{t('allStatuses')}</option>
                  <option value="active">{t('activeStatus')}</option>
                  <option value="suspended">{t('suspendedStatus')}</option>
                  <option value="pending">{t('pendingStatus')}</option>
                </select>
                <FiChevronDown className="absolute right-3 top-3 text-gray-400 pointer-events-none" />
              </div>
              
              <div className="relative">
                <select 
                  className="pl-4 pr-8 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-green-500 dark:focus:ring-green-600 focus:border-transparent appearance-none transition-all duration-200"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="name">{t('sortByName')}</option>
                  <option value="rating">{t('sortByRating')}</option>
                  <option value="orders">{t('sortByOrders')}</option>
                  <option value="revenue">{t('sortByRevenue')}</option>
                </select>
                <FiChevronDown className="absolute right-3 top-3 text-gray-400 pointer-events-none" />
              </div>
              
              <div className="relative">
                <select 
                  className="pl-4 pr-8 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-green-500 dark:focus:ring-green-600 focus:border-transparent appearance-none transition-all duration-200"
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                >
                  <option value="asc">{t('ascending')}</option>
                  <option value="desc">{t('descending')}</option>
                </select>
                <FiChevronDown className="absolute right-3 top-3 text-gray-400 pointer-events-none" />
              </div>
              
              <button 
                className="flex items-center px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg transition-colors duration-200"
              >
                <FiFilter className="mr-2" /> {t('moreFilters')}
              </button>
            </div>
          </div>
        </div>
        
        {/* Stats Overview */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 mb-6 overflow-hidden">
          <div className="flex flex-wrap mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">
            <button 
              className={`mr-4 pb-2 font-medium ${statsView === 'overview' ? 'text-green-600 dark:text-green-400 border-b-2 border-green-600 dark:border-green-400' : 'text-gray-600 dark:text-gray-400'}`}
              onClick={() => setStatsView('overview')}
            >
              {t('overview')}
            </button>
            <button 
              className={`mr-4 pb-2 font-medium ${statsView === 'performance' ? 'text-green-600 dark:text-green-400 border-b-2 border-green-600 dark:border-green-400' : 'text-gray-600 dark:text-gray-400'}`}
              onClick={() => setStatsView('performance')}
            >
              {t('performance')}
            </button>
            <button 
              className={`mr-4 pb-2 font-medium ${statsView === 'compliance' ? 'text-green-600 dark:text-green-400 border-b-2 border-green-600 dark:border-green-400' : 'text-gray-600 dark:text-gray-400'}`}
              onClick={() => setStatsView('compliance')}
            >
              {t('compliance')}
            </button>
          </div>
          
          {statsView === 'overview' && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-900 dark:to-blue-900 p-4 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 transform transition-transform hover:scale-105">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-gray-600 dark:text-gray-300">{t('totalRestaurants')}</h3>
                  <span className="bg-blue-100 dark:bg-blue-800 text-blue-600 dark:text-blue-300 p-1 rounded">
                    <FiShoppingBag size={16} />
                  </span>
                </div>
                <p className="text-3xl font-bold">{restaurants.length}</p>
                <div className="flex items-center mt-2 text-sm text-green-600 dark:text-green-400">
                  <span>+3 {t('thisMonth')}</span>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900 dark:to-pink-900 p-4 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 transform transition-transform hover:scale-105">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-gray-600 dark:text-gray-300">{t('activeRestaurants')}</h3>
                  <span className="bg-purple-100 dark:bg-purple-800 text-purple-600 dark:text-purple-300 p-1 rounded">
                    <FiAward size={16} />
                  </span>
                </div>
                <p className="text-3xl font-bold">
                  {restaurants.filter(r => r.status === 'active').length}
                </p>
                <div className="flex items-center mt-2 text-sm text-green-600 dark:text-green-400">
                  <span>85% {t('activeRate')}</span>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900 dark:to-orange-900 p-4 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 transform transition-transform hover:scale-105">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-gray-600 dark:text-gray-300">{t('pendingApproval')}</h3>
                  <span className="bg-yellow-100 dark:bg-yellow-800 text-yellow-600 dark:text-yellow-300 p-1 rounded">
                    <FiClock size={16} />
                  </span>
                </div>
                <p className="text-3xl font-bold">
                  {restaurants.filter(r => r.status === 'pending').length}
                </p>
                <div className="flex items-center mt-2 text-sm text-yellow-600 dark:text-yellow-400">
                  <span>{t('requiresReview')}</span>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-900 dark:to-orange-900 p-4 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 transform transition-transform hover:scale-105">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-gray-600 dark:text-gray-300">{t('suspendedRestaurants')}</h3>
                  <span className="bg-red-100 dark:bg-red-800 text-red-600 dark:text-red-300 p-1 rounded">
                    <FiAlertTriangle size={16} />
                  </span>
                </div>
                <p className="text-3xl font-bold">
                  {restaurants.filter(r => r.status === 'suspended').length}
                </p>
                <div className="flex items-center mt-2 text-sm text-red-600 dark:text-red-400">
                  <span>{t('requiresAction')}</span>
                </div>
              </div>
            </div>
          )}
          
          {statsView === 'performance' && (
            <div className="rounded-lg overflow-hidden">
              <div className="flex flex-col md:flex-row">
                <div className="w-full md:w-1/2 p-4">
                  <h3 className="text-lg font-medium mb-4">{t('topPerformers')}</h3>
                  {restaurants
                    .sort((a, b) => b.orders - a.orders)
                    .slice(0, 3)
                    .map(restaurant => (
                      <div key={restaurant.id} className="flex items-center mb-4 bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                        <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-800 flex items-center justify-center mr-3">
                          <FiShoppingBag className="text-green-600 dark:text-green-300" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium">{restaurant.name}</h4>
                          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                            <FiPackage className="mr-1" /> {restaurant.orders} {t('orders')}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold">
                            {new Intl.NumberFormat(i18n.language, { 
                              style: 'currency', 
                              currency: 'XAF',
                              maximumFractionDigits: 0
                            }).format(restaurant.revenue)}
                          </div>
                          <div className="flex items-center justify-end text-yellow-500">
                            <FiStar className="mr-1" /> {restaurant.rating.toFixed(1)}
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
                <div className="w-full md:w-1/2 p-4">
                  <h3 className="text-lg font-medium mb-4">{t('needsImprovement')}</h3>
                  {restaurants
                    .filter(r => r.status !== 'pending')
                    .sort((a, b) => a.orders - b.orders)
                    .slice(0, 3)
                    .map(restaurant => (
                      <div key={restaurant.id} className="flex items-center mb-4 bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                        <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-800 flex items-center justify-center mr-3">
                          <FiAlertTriangle className="text-red-600 dark:text-red-300" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium">{restaurant.name}</h4>
                          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                            <FiPackage className="mr-1" /> {restaurant.orders} {t('orders')}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold">
                            {new Intl.NumberFormat(i18n.language, { 
                              style: 'currency', 
                              currency: 'XAF',
                              maximumFractionDigits: 0
                            }).format(restaurant.revenue)}
                          </div>
                          <div className="flex items-center justify-end text-yellow-500">
                            <FiStar className="mr-1" /> {restaurant.rating.toFixed(1)}
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          )}
          
          {statsView === 'compliance' && (
            <div className="rounded-lg overflow-hidden">
              <div className="flex flex-col md:flex-row">
                <div className="w-full md:w-1/2 p-4">
                  <h3 className="text-lg font-medium mb-4">{t('complianceLeaders')}</h3>
                  {restaurants
                    .filter(r => r.complianceScore > 0)
                    .sort((a, b) => b.complianceScore - a.complianceScore)
                    .slice(0, 3)
                    .map(restaurant => (
                      <div key={restaurant.id} className="flex items-center mb-4 bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                        <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-800 flex items-center justify-center mr-3">
                          <FiShield className="text-blue-600 dark:text-blue-300" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium">{restaurant.name}</h4>
                          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                            {restaurant.verificationStatus === 'verified' ? (
                              <span className="text-green-500 dark:text-green-400">{t('verified')}</span>
                            ) : (
                              <span className="text-yellow-500 dark:text-yellow-400">{t('pending')}</span>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={`text-lg font-bold ${getComplianceScoreColor(restaurant.complianceScore)}`}>
                            {restaurant.complianceScore}%
                          </div>
                          <div className="w-24 bg-gray-200 dark:bg-gray-600 rounded-full h-2 mt-1">
                            <div 
                              className={`h-2 rounded-full ${
                                restaurant.complianceScore >= 90 ? 'bg-green-500' : 
                                restaurant.complianceScore >= 70 ? 'bg-yellow-500' : 'bg-red-500'
                              }`}
                              style={{ width: `${restaurant.complianceScore}%` }}
                            ></div>
                          </div>
                        </div>
                        </div>
                    ))}
                </div>
                <div className="w-full md:w-1/2 p-4">
                  <h3 className="text-lg font-medium mb-4">{t('complianceIssues')}</h3>
                  {restaurants
                    .filter(r => r.complianceScore > 0)
                    .sort((a, b) => a.complianceScore - b.complianceScore)
                    .slice(0, 3)
                    .map(restaurant => (
                      <div key={restaurant.id} className="flex items-center mb-4 bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                        <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-800 flex items-center justify-center mr-3">
                          <FiAlertTriangle className="text-red-600 dark:text-red-300" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium">{restaurant.name}</h4>
                          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                            {restaurant.verificationStatus === 'verified' ? (
                              <span className="text-green-500 dark:text-green-400">{t('verified')}</span>
                            ) : (
                              <span className="text-yellow-500 dark:text-yellow-400">{t('pending')}</span>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={`text-lg font-bold ${getComplianceScoreColor(restaurant.complianceScore)}`}>
                            {restaurant.complianceScore}%
                          </div>
                          <div className="w-24 bg-gray-200 dark:bg-gray-600 rounded-full h-2 mt-1">
                            <div 
                              className={`h-2 rounded-full ${
                                restaurant.complianceScore >= 90 ? 'bg-green-500' : 
                                restaurant.complianceScore >= 70 ? 'bg-yellow-500' : 'bg-red-500'
                              }`}
                              style={{ width: `${restaurant.complianceScore}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Restaurant Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          {filteredRestaurants.map(restaurant => (
            <motion.div 
              key={restaurant.id}
              onClick={() => handleRestaurantClick(restaurant)}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden cursor-pointer transform transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="h-36 bg-gray-300 dark:bg-gray-700 relative">
                <div className="absolute top-2 right-2 flex space-x-2">
                  <Badge 
                    text={restaurant.status} 
                    color={getStatusBadgeColor(restaurant.status)}
                  />
                  {restaurant.verificationStatus === 'verified' && (
                    <Tooltip content={t('verified')}>
                      <span className="inline-flex items-center justify-center w-6 h-6 bg-blue-500 text-white rounded-full">
                        <FiCheck size={14} />
                      </span>
                    </Tooltip>
                  )}
                </div>
                
                <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black to-transparent p-4">
                  <h3 className="text-white text-xl font-bold truncate">{restaurant.name}</h3>
                  <p className="text-gray-200 text-sm flex items-center">
                    <FiMapPin className="mr-1" /> {restaurant.address}
                  </p>
                </div>
              </div>
              
              <div className="p-4">
                <div className="flex justify-between items-center mb-3">
                  <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm">
                    {restaurant.cuisine}
                  </span>
                  <div className="flex items-center text-yellow-500">
                    <FiStar className="mr-1" /> {restaurant.rating.toFixed(1)}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-2 mb-3">
                  <div className="bg-blue-50 dark:bg-blue-900 p-2 rounded-lg">
                    <p className="text-xs text-gray-500 dark:text-gray-400">{t('totalOrders')}</p>
                    <p className="text-lg font-bold text-blue-700 dark:text-blue-300">{restaurant.orders}</p>
                  </div>
                  <div className="bg-green-50 dark:bg-green-900 p-2 rounded-lg">
                    <p className="text-xs text-gray-500 dark:text-gray-400">{t('revenue')}</p>
                    <p className="text-lg font-bold text-green-700 dark:text-green-300">
                      {new Intl.NumberFormat(i18n.language, { 
                        style: 'currency', 
                        currency: 'XAF',
                        maximumFractionDigits: 0
                      }).format(restaurant.revenue)}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-400 flex items-center">
                    <FiClock className="mr-1" /> {new Date(restaurant.createdAt).toLocaleDateString()}
                  </span>
                  <span className="text-blue-600 dark:text-blue-400 hover:underline">
                    {t('viewDetails')} →
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        
        {/* Restaurant Grid Empty State */}
        {filteredRestaurants.length === 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-8 text-center">
            <div className="flex justify-center mb-4">
              <HiOutlineSpeakerphone className="text-gray-400 dark:text-gray-500 text-5xl" />
            </div>
            <h3 className="text-xl font-medium mb-2">{t('noRestaurantsFound')}</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">{t('tryAdjustingFilters')}</p>
            <button 
              onClick={() => {
                setSearchTerm('');
                setFilterStatus('all');
                setSortBy('name');
                setSortOrder('asc');
              }}
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors duration-200"
            >
              {t('clearFilters')}
            </button>
          </div>
        )}
        
        {/* Restaurant Detail Modal */}
        {selectedRestaurant && (
          <Modal
            isOpen={isDetailModalOpen}
            onClose={() => setIsDetailModalOpen(false)}
            title={selectedRestaurant.name}
          >
            <div className="p-4">
              <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 mb-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <div className="mb-4 md:mb-0">
                    <h3 className="text-xl font-bold mb-2">{selectedRestaurant.name}</h3>
                    <p className="flex items-center text-gray-600 dark:text-gray-300 mb-2">
                      <FiMapPin className="mr-2" /> {selectedRestaurant.address}
                    </p>
                    <div className="flex items-center space-x-4">
                      <p className="flex items-center text-gray-600 dark:text-gray-300">
                        <FiPhone className="mr-2" /> {selectedRestaurant.contactPhone}
                      </p>
                      <p className="flex items-center text-gray-600 dark:text-gray-300">
                        <FiMail className="mr-2" /> {selectedRestaurant.contactEmail}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-end">
                    <div className="flex space-x-2 mb-2">
                      <Badge 
                        text={selectedRestaurant.status} 
                        color={getStatusBadgeColor(selectedRestaurant.status)}
                      />
                      <Badge 
                        text={selectedRestaurant.verificationStatus} 
                        color={getVerificationBadgeColor(selectedRestaurant.verificationStatus)}
                      />
                    </div>
                    <div className="flex items-center text-yellow-500">
                      <FiStar className="mr-1" /> 
                      <span className="font-bold">{selectedRestaurant.rating.toFixed(1)}</span>
                      <span className="text-gray-600 dark:text-gray-400 ml-1 text-sm">
                        (42 {t('reviews')})
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h4 className="text-lg font-medium mb-3">{t('performance')}</h4>
                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{t('totalOrders')}</p>
                        <p className="text-2xl font-bold">{selectedRestaurant.orders}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{t('revenue')}</p>
                        <p className="text-2xl font-bold">
                          {new Intl.NumberFormat(i18n.language, { 
                            style: 'currency', 
                            currency: 'XAF',
                            maximumFractionDigits: 0
                          }).format(selectedRestaurant.revenue)}
                        </p>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{t('orderTrend')}</p>
                      <div className="h-20 bg-gray-100 dark:bg-gray-700 rounded flex items-end p-1">
                        {/* Mock chart bars */}
                        {Array(12).fill(0).map((_, i) => (
                          <div 
                            key={i} 
                            className="flex-1 mx-0.5 bg-green-500 rounded-t"
                            style={{ height: `${Math.random() * 70 + 20}%` }}
                          ></div>
                        ))}
                      </div>
                      <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                        <span>Jan</span>
                        <span>Dec</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-lg font-medium mb-3">{t('compliance')}</h4>
                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
                    <div className="mb-4">
                      <div className="flex justify-between items-center mb-1">
                        <p className="text-sm text-gray-600 dark:text-gray-400">{t('overallCompliance')}</p>
                        <p className={`font-bold ${getComplianceScoreColor(selectedRestaurant.complianceScore)}`}>
                          {selectedRestaurant.complianceScore}%
                        </p>
                      </div>
                      <Progress 
                        value={selectedRestaurant.complianceScore} 
                        color={
                          selectedRestaurant.complianceScore >= 90 ? 'green' : 
                          selectedRestaurant.complianceScore >= 70 ? 'yellow' : 'red'
                        }
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <p className="text-sm text-gray-600 dark:text-gray-400">{t('foodSafety')}</p>
                          <p className="font-bold text-green-600 dark:text-green-400">95%</p>
                        </div>
                        <Progress value={95} color="green" />
                      </div>
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <p className="text-sm text-gray-600 dark:text-gray-400">{t('documentation')}</p>
                          <p className="font-bold text-yellow-600 dark:text-yellow-400">82%</p>
                        </div>
                        <Progress value={82} color="yellow" />
                      </div>
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <p className="text-sm text-gray-600 dark:text-gray-400">{t('customerFeedback')}</p>
                          <p className="font-bold text-green-600 dark:text-green-400">90%</p>
                        </div>
                        <Progress value={90} color="green" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-wrap justify-end space-x-4">
                <button 
                  className="flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors duration-200"
                >
                  <FiEdit className="mr-2" /> {t('edit')}
                </button>
                
                {selectedRestaurant.status === 'active' ? (
                  <button 
                    onClick={() => handleStatusChange(selectedRestaurant.id, 'suspended')}
                    className="flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-200"
                  >
                    <FiAlertTriangle className="mr-2" /> {t('suspend')}
                  </button>
                ) : selectedRestaurant.status === 'suspended' ? (
                  <button 
                    onClick={() => handleStatusChange(selectedRestaurant.id, 'active')}
                    className="flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors duration-200"
                  >
                    <FiCheck className="mr-2" /> {t('activate')}
                  </button>
                ) : (
                  <button 
                    onClick={() => handleStatusChange(selectedRestaurant.id, 'active')}
                    className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200"
                  >
                    <FiCheck className="mr-2" /> {t('approve')}
                  </button>
                )}
                
                <button 
                  className="flex items-center px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-lg transition-colors duration-200"
                >
                  <FiTrash2 className="mr-2" /> {t('delete')}
                </button>
              </div>
            </div>
          </Modal>
        )}
        
        {/* Add Restaurant Modal */}
        <Modal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          title={t('addNewRestaurant')}
        >
          <form onSubmit={handleSubmitNewRestaurant} className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-1">{t('restaurantName')}</label>
                <input 
                  type="text" 
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-green-500"
                  placeholder={t('enterRestaurantName')}
                  id= "restaurantName"
                />
              </div>
              <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-1">{t('cuisineType')}</label>
                <select 
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-green-500"
                  id= "cuisineType"
                >
                  <option value="">{t('selectCuisine')}</option>
                  <option value="traditional">{t('traditional')}</option>
                  <option value="fastfood">{t('fastFood')}</option>
                  <option value="italian">{t('italian')}</option>
                  <option value="fusion">{t('fusion')}</option>
                  <option value="healthy">{t('healthy')}</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-1">{t('contactPhone')}</label>
                <input 
                  type="text" 
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-green-500"
                  placeholder="+237 6XX XXX XXX"
                  id="contactPhone"
                />
              </div>
              <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-1">{t('contactEmail')}</label>
                <input 
                  type="email" 
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-green-500"
                  placeholder="restaurant@example.com"
                  id = "contactEmail"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-gray-700 dark:text-gray-300 mb-1">{t('address')}</label>
                <input 
                  type="text" 
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-green-500"
                  placeholder={t('enterFullAddress')}
                  id = "address"
                />
              </div>
              <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-1">{t('city')}</label>
                <select 
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-green-500"
                  id ="city"
                >
                  <option value="">{t('selectCity')}</option>
                  <option value="douala">Douala</option>
                  <option value="yaounde">Yaoundé</option>
                  <option value="bafoussam">Bafoussam</option>
                  <option value="limbe">Limbe</option>
                  <option value="buea">Buea</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-1">{t('initialStatus')}</label>
                <select 
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-green-500"
                  id = "status"
                >
                  <option value="pending">{t('pendingApproval')}</option>
                  <option value="active">{t('activeImmediately')}</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-1">{t('Categorie')}</label>
                <select 
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-green-500"
                  id = "categorie"
                >
                  <option value="african">{t('African')}</option>
                  <option value="european">{t('European')}</option>
                  <option value="asian">{t('Asian')}</option>
                  <option value="fast food">{t('Fast Food')}</option>
                   <option value="others">{t('Others')}</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-gray-700 dark:text-gray-300 mb-1">{t('restaurantLogo')}</label>
                <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4 text-center">
                  <div className="flex flex-col items-center">
                    <FiPackage className="text-gray-400 text-3xl mb-2" />
                    <p className="text-gray-600 dark:text-gray-400 mb-2">{t('dragImageHere')}</p>
                    <button type="button" className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg">
                      {t('browseFiles')}
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end space-x-4">
              <button 
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-lg transition-colors duration-200"
              >
                {t('cancel')}
              </button>
              <button 
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors duration-200 flex items-center"
              >
                {loading && <FiRefreshCw className="animate-spin mr-2" />}
                {t('createRestaurant')}
              </button>
            </div>
          </form>
        </Modal>
        
        {/* Chatbot Assistant */}
        {isChatbotOpen && (
          <motion.div 
            className="fixed bottom-20 right-6 w-80 md:w-96 h-96 bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden z-50 flex flex-col"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="bg-green-600 dark:bg-green-700 p-3 text-white flex justify-between items-center">
              <h3 className="font-medium">{t('aiAssistant')}</h3>
              <button onClick={toggleChatbot} className="p-1 hover:bg-green-700 dark:hover:bg-green-800 rounded">
                <FiX />
              </button>
            </div>
            
            <div 
              ref={chatbotRef} 
              className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600"
            >
              {chatMessages.map((msg, index) => (
                <div 
                  key={index} 
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div 
                    className={`max-w-3/4 rounded-lg p-3 ${
                      msg.role === 'user' 
                        ? 'bg-blue-500 text-white' 
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100'
                    }`}>
                    {msg.content}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="p-3 border-t border-gray-200 dark:border-gray-700 flex">
              <input 
                type="text" 
                className="flex-1 px-4 py-2 rounded-l-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder={t('askAnything')}
                value={currentMessage}
                onChange={(e) => setCurrentMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              />
              <button 
                onClick={handleSendMessage}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-r-lg"
              >
                <FiSend />
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </AdminLayout>
  );
};

export default RestaurantManagement;


export const AdminRestaurantProvider = ({children}) => {

const [restaurants, setRestaurants] = useState(mockRestaurants); 

const [registerRestaurants, setRegisterRestaurant] = useState(mockRegisterRestaurants);
useEffect( () => {
  setRestaurants(mockRestaurants);
},[mockRestaurants])  

useEffect (() => {
setRegisterRestaurant(mockRegisterRestaurants)
}, [mockRegisterRestaurants]);


return(
    <adminRestaurantContext.Provider value={restaurants}>
      <registerRestaurantContext.Provider value={registerRestaurants}>
      
      <OrderProvider>
      {children}
      </OrderProvider>
      </registerRestaurantContext.Provider>
    </adminRestaurantContext.Provider>

  )
} 