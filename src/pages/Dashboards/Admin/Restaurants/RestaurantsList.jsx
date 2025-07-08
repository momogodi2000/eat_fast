import React, { useState, useEffect, useRef, createContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  FiSend, 
 

} from 'react-icons/fi';
import { HiOutlineSpeakerphone } from 'react-icons/hi';
import { Tooltip, Badge, Modal, Progress } from '../../../../components/ui/ui-components';

import { useFetcher } from 'react-router-dom';
 
import { FiBarChart2, FiCalendar, FiTrendingUp, FiImage } from 'react-icons/fi';
import AdminLayout from '../../../../layouts/admin_layout';


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

const RestaurantManagement = () => {
  const chatbotRef = useRef(null);
  
  // États principaux
  const [restaurants, setRestaurants] = useState(mockRestaurants);
  const [filteredRestaurants, setFilteredRestaurants] = useState(mockRestaurants);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { role: 'system', content: 'Bonjour ! Je suis votre assistant IA pour la gestion des restaurants. Comment puis-je vous aider ?' }
  ]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [statsView, setStatsView] = useState('overview');
  const [viewMode, setViewMode] = useState('grid'); // grid ou list
  const [showFilters, setShowFilters] = useState(false);
  
  // Effets pour le filtrage, tri et recherche
  useEffect(() => {
    let results = [...restaurants];
    
    // Appliquer le filtre de recherche
    if (searchTerm) {
      results = results.filter(restaurant => 
        (restaurant.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (restaurant.cuisine?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (restaurant.address?.toLowerCase() || '').includes(searchTerm.toLowerCase())
      );
    }
    
    // Appliquer le filtre de statut
    if (filterStatus !== 'all') {
      results = results.filter(restaurant => restaurant.status === filterStatus);
    }
    
    // Appliquer le filtre de catégorie
    if (filterCategory !== 'all') {
      results = results.filter(restaurant => restaurant.categorie === filterCategory);
    }
    
    // Appliquer le tri
    results.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return sortOrder === 'asc' 
            ? (a.name || '').localeCompare(b.name || '')
            : (b.name || '').localeCompare(a.name || '');
        case 'rating':
          return sortOrder === 'asc' ? (a.rating || 0) - (b.rating || 0) : (b.rating || 0) - (a.rating || 0);
        case 'orders':
          return sortOrder === 'asc' ? (a.orders || 0) - (b.orders || 0) : (b.orders || 0) - (a.orders || 0);
        case 'revenue':
          return sortOrder === 'asc' ? (a.revenue || 0) - (b.revenue || 0) : (b.revenue || 0) - (a.revenue || 0);
        case 'created':
          return sortOrder === 'asc' 
            ? new Date(a.createdAt || 0) - new Date(b.createdAt || 0)
            : new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
        default:
          return 0;
      }
    });
    
    setFilteredRestaurants(results);
  }, [restaurants, searchTerm, filterStatus, filterCategory, sortBy, sortOrder]);
  
  // Gestionnaires d'événements
  const handleRestaurantClick = (restaurant) => {
    setSelectedRestaurant(restaurant);
    setIsDetailModalOpen(true);
  };
  
  const handleStatusChange = (restaurantId, newStatus) => {
    setRestaurants(prevRestaurants => 
      prevRestaurants.map(r => 
        r.id === restaurantId ? { ...r, status: newStatus } : r
      )
    );
    
    if (selectedRestaurant && selectedRestaurant.id === restaurantId) {
      setSelectedRestaurant(prev => ({ ...prev, status: newStatus }));
    }
  };
  
  const toggleChatbot = () => {
    setIsChatbotOpen(!isChatbotOpen);
    if (!isChatbotOpen) {
      setTimeout(() => {
        if (chatbotRef.current) {
          chatbotRef.current.scrollTop = chatbotRef.current.scrollHeight;
        }
      }, 100);
    }
  };
  
  const handleSendMessage = () => {
    if (!currentMessage.trim()) return;
    
    setChatMessages(prev => [...prev, { role: 'user', content: currentMessage }]);
    
    setTimeout(() => {
      const responses = [
        "Je peux vous aider à analyser les performances de vos restaurants.",
        "Voulez-vous que je vous donne des statistiques détaillées ?",
        "Je peux vous suggérer des améliorations basées sur les données.",
        "Avez-vous besoin d'aide pour gérer un restaurant spécifique ?"
      ];
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      
      setChatMessages(prev => [...prev, { 
        role: 'system', 
        content: randomResponse
      }]);
      
      if (chatbotRef.current) {
        chatbotRef.current.scrollTop = chatbotRef.current.scrollHeight;
      }
    }, 1000);
    
    setCurrentMessage('');
  };
  
  const handleAddRestaurant = () => {
    setIsAddModalOpen(true);
  };
  
  const handleSubmitNewRestaurant = (e) => {
    e.preventDefault();
    setLoading(true);
    
    const formData = new FormData(e.target);
    const newRestaurant = {
      id: mockRestaurants.length + 1,
      name: formData.get('restaurantName'),
      address: formData.get('address'),
      cuisine: formData.get('cuisineType'),
      status: formData.get('status'),
      verificationStatus: formData.get('status') === "active" ? "verified" : "pending",
      createdAt: new Date().toISOString().split('T')[0],
      rating: 0,
      contactPhone: formData.get('contactPhone'),
      contactEmail: formData.get('contactEmail'),
      categorie: formData.get('categorie'),
      orders: 0,
      revenue: 0,
      city: formData.get('city'),
      avgDeliveryTime: 30,
      totalReviews: 0,
      monthlyGrowth: 0,
      complianceScore: 0,
      image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400"
    };
    
    setTimeout(() => {
      setRestaurants(prev => [...prev, newRestaurant]);
      setLoading(false);
      setIsAddModalOpen(false);
    }, 2000);
  };
  
  const handleRefreshData = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };
  
  const handleDeleteRestaurant = (restaurantId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce restaurant ?')) {
      setRestaurants(prev => prev.filter(r => r.id !== restaurantId));
      setIsDetailModalOpen(false);
    }
  };
  
  // Fonctions utilitaires
  const getStatusBadgeColor = (status) => {
    switch(status) {
      case 'active': return 'bg-emerald-500';
      case 'suspended': return 'bg-red-500';
      case 'pending': return 'bg-amber-500';
      default: return 'bg-gray-500';
    }
  };
  
  const getVerificationBadgeColor = (status) => {
    switch(status) {
      case 'verified': return 'bg-blue-500';
      case 'pending': return 'bg-amber-500';
      default: return 'bg-gray-500';
    }
  };
  
  const getComplianceScoreColor = (score) => {
    if (score >= 90) return 'text-emerald-600 dark:text-emerald-400';
    if (score >= 70) return 'text-amber-600 dark:text-amber-400';
    return 'text-red-600 dark:text-red-400';
  };
  
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-FR', { 
      style: 'currency', 
      currency: 'XAF',
      maximumFractionDigits: 0
    }).format(amount);
  };
  
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('fr-FR');
  };

  // Statistiques calculées
  const stats = {
    total: restaurants.length,
    active: restaurants.filter(r => r.status === 'active').length,
    pending: restaurants.filter(r => r.status === 'pending').length,
    suspended: restaurants.filter(r => r.status === 'suspended').length,
    totalRevenue: restaurants.reduce((sum, r) => sum + r.revenue, 0),
    totalOrders: restaurants.reduce((sum, r) => sum + r.orders, 0),
    avgRating: restaurants.reduce((sum, r) => sum + r.rating, 0) / restaurants.length || 0
  };

  return (
    <AdminLayout>
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* En-tête de page */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="p-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                <div className="p-3 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl">
                  <FiShoppingBag className="text-white text-2xl" />
                </div>
                Gestion des Restaurants
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Gérez tous vos restaurants partenaires depuis un seul endroit
              </p>
            </motion.div>
            
            <div className="flex flex-wrap items-center gap-3">
              <button 
                onClick={handleAddRestaurant}
                className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <FiPlus className="text-lg" /> Ajouter Restaurant
              </button>
              
              <button 
                onClick={handleRefreshData}
                className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
              >
                <FiRefreshCw className={`text-lg ${loading ? 'animate-spin' : ''}`} /> 
                Actualiser
              </button>
              
              <button className="flex items-center gap-2 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-xl font-medium transition-all duration-200 shadow-md hover:shadow-lg">
                <FiDownload className="text-lg" /> Exporter
              </button>
              
              <button 
                onClick={toggleChatbot}
                className="relative flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <FiMessageSquare className="text-lg" /> Assistant IA
                {!isChatbotOpen && (
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Statistiques globales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <motion.div 
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-xl transition-all duration-300"
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl">
                <FiShoppingBag className="text-white text-xl" />
              </div>
              <span className="text-sm text-emerald-600 dark:text-emerald-400 font-medium bg-emerald-50 dark:bg-emerald-900 px-2 py-1 rounded-full">
                +3 ce mois
              </span>
            </div>
            <h3 className="text-gray-600 dark:text-gray-400 text-sm font-medium">Total Restaurants</h3>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
          </motion.div>

          <motion.div 
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-xl transition-all duration-300"
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl">
                <FiCheck className="text-white text-xl" />
              </div>
              <span className="text-sm text-emerald-600 dark:text-emerald-400 font-medium bg-emerald-50 dark:bg-emerald-900 px-2 py-1 rounded-full">
                {Math.round((stats.active / stats.total) * 100)}%
              </span>
            </div>
            <h3 className="text-gray-600 dark:text-gray-400 text-sm font-medium">Restaurants Actifs</h3>
            <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">{stats.active}</p>
          </motion.div>

          <motion.div 
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-xl transition-all duration-300"
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl">
                <FiClock className="text-white text-xl" />
              </div>
              <span className="text-sm text-amber-600 dark:text-amber-400 font-medium bg-amber-50 dark:bg-amber-900 px-2 py-1 rounded-full">
                En attente
              </span>
            </div>
            <h3 className="text-gray-600 dark:text-gray-400 text-sm font-medium">En Approbation</h3>
            <p className="text-3xl font-bold text-amber-600 dark:text-amber-400">{stats.pending}</p>
          </motion.div>

          <motion.div 
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-xl transition-all duration-300"
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-red-500 to-red-600 rounded-xl">
                <FiAlertTriangle className="text-white text-xl" />
              </div>
              <span className="text-sm text-red-600 dark:text-red-400 font-medium bg-red-50 dark:bg-red-900 px-2 py-1 rounded-full">
                Action requise
              </span>
            </div>
            <h3 className="text-gray-600 dark:text-gray-400 text-sm font-medium">Suspendus</h3>
            <p className="text-3xl font-bold text-red-600 dark:text-red-400">{stats.suspended}</p>
          </motion.div>
        </div>

        {/* Barre de recherche et filtres */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg" />
              <input 
                type="text" 
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-600 focus:border-transparent transition-all duration-200 text-gray-900 dark:text-white placeholder-gray-500"
                placeholder="Rechercher par nom, cuisine, adresse..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex flex-wrap gap-3">
              <div className="relative">
                <select 
                  className="pl-4 pr-10 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-600 focus:border-transparent appearance-none transition-all duration-200 text-gray-900 dark:text-white min-w-[140px]"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option value="all">Tous statuts</option>
                  <option value="active">Actif</option>
                  <option value="suspended">Suspendu</option>
                  <option value="pending">En attente</option>
                </select>
                <FiChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
              
              <div className="relative">
                <select 
                  className="pl-4 pr-10 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-600 focus:border-transparent appearance-none transition-all duration-200 text-gray-900 dark:text-white min-w-[140px]"
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                >
                  <option value="all">Toutes catégories</option>
                  <option value="Africaine">Africaine</option>
                  <option value="Asiatique">Asiatique</option>
                  <option value="Européenne">Européenne</option>
                  <option value="Fast Food">Fast Food</option>
                  <option value="Autre">Autre</option>
                </select>
                <FiChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
              
              <div className="relative">
                <select 
                  className="pl-4 pr-10 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-600 focus:border-transparent appearance-none transition-all duration-200 text-gray-900 dark:text-white min-w-[140px]"
                  value={`${sortBy}-${sortOrder}`}
                  onChange={(e) => {
                    const [field, order] = e.target.value.split('-');
                    setSortBy(field);
                    setSortOrder(order);
                  }}
                >
                  <option value="name-asc">Nom A-Z</option>
                  <option value="name-desc">Nom Z-A</option>
                  <option value="rating-desc">Note ↓</option>
                  <option value="rating-asc">Note ↑</option>
                  <option value="orders-desc">Commandes ↓</option>
                  <option value="orders-asc">Commandes ↑</option>
                  <option value="revenue-desc">Revenus ↓</option>
                  <option value="revenue-asc">Revenus ↑</option>
                  <option value="created-desc">Plus récents</option>
                  <option value="created-asc">Plus anciens</option>
                </select>
                <FiChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
              
              <button 
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-3 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-xl transition-all duration-200 font-medium"
              >
                <FiFilter className="text-lg" /> Filtres
              </button>
            </div>
          </div>
          
          {/* Filtres avancés */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Note minimum
                    </label>
                    <input 
                      type="range" 
                      min="0" 
                      max="5" 
                      step="0.5"
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Ville
                    </label>
                    <select className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white">
                      <option value="">Toutes les villes</option>
                      <option value="Douala">Douala</option>
                      <option value="Yaoundé">Yaoundé</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Période d'inscription
                    </label>
                    <select className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white">
                      <option value="">Toutes périodes</option>
                      <option value="7d">7 derniers jours</option>
                      <option value="30d">30 derniers jours</option>
                      <option value="3m">3 derniers mois</option>
                    </select>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Liste des restaurants */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Restaurants ({filteredRestaurants.length})
              </h2>
              <div className="flex gap-2">
                <button 
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-all duration-200 ${
                    viewMode === 'grid' 
                      ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900 dark:text-emerald-400' 
                      : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <FiPackage className="text-lg" />
                </button>
                <button 
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-all duration-200 ${
                    viewMode === 'list' 
                      ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900 dark:text-emerald-400' 
                      : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <FiBarChart2 className="text-lg" />
                </button>
              </div>
            </div>
          </div>

          {filteredRestaurants.length > 0 ? (
            <div className={`p-6 ${viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}`}>
              {filteredRestaurants.map(restaurant => (
                <motion.div 
                  key={restaurant.id}
                  onClick={() => handleRestaurantClick(restaurant)}
                  className={`group cursor-pointer rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 ${
                    viewMode === 'grid' 
                      ? 'bg-white dark:bg-gray-800' 
                      : 'bg-gray-50 dark:bg-gray-800 flex items-center p-4'
                  }`}
                  whileHover={{ scale: viewMode === 'grid' ? 1.02 : 1.01 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {viewMode === 'grid' ? (
                    <>
                      <div className="h-48 relative overflow-hidden">
                        <img 
                          src={restaurant.image} 
                          alt={restaurant.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                        <div className="absolute top-3 right-3 flex gap-2">
                          <Badge 
                            text={restaurant.status === 'active' ? 'Actif' : restaurant.status === 'pending' ? 'En attente' : 'Suspendu'} 
                            color={getStatusBadgeColor(restaurant.status)}
                          />
                          {restaurant.verificationStatus === 'verified' && (
                            <Tooltip content="Vérifié">
                              <span className="inline-flex items-center justify-center w-8 h-8 bg-blue-500 text-white rounded-full">
                                <FiShield size={16} />
                              </span>
                            </Tooltip>
                          )}
                        </div>
                        
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                          <h3 className="text-white text-xl font-bold truncate">{restaurant.name}</h3>
                          <p className="text-gray-200 text-sm flex items-center gap-1 mt-1">
                            <FiMapPin size={14} /> {restaurant.city}
                          </p>
                        </div>
                      </div>
                      
                      <div className="p-6">
                        <div className="flex justify-between items-start mb-4">
                          <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm font-medium">
                            {restaurant.categorie}
                          </span>
                          <div className="flex items-center gap-1 text-amber-500">
                            <FiStar className="fill-current" size={16} />
                            <span className="font-semibold">{restaurant.rating.toFixed(1)}</span>
                            <span className="text-gray-500 text-sm">({restaurant.totalReviews})</span>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div className="bg-blue-50 dark:bg-blue-900/30 p-3 rounded-lg">
                            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Commandes</p>
                            <p className="text-lg font-bold text-blue-700 dark:text-blue-300">{restaurant.orders}</p>
                          </div>
                          <div className="bg-emerald-50 dark:bg-emerald-900/30 p-3 rounded-lg">
                            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Revenus</p>
                            <p className="text-lg font-bold text-emerald-700 dark:text-emerald-300">
                              {formatCurrency(restaurant.revenue)}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500 dark:text-gray-400 flex items-center gap-1">
                            <FiCalendar size={14} /> {formatDate(restaurant.createdAt)}
                          </span>
                          <div className="flex items-center gap-1">
                            <span className={`font-medium ${restaurant.monthlyGrowth >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                              {restaurant.monthlyGrowth >= 0 ? '+' : ''}{restaurant.monthlyGrowth}%
                            </span>
                            <FiTrendingUp size={14} className={restaurant.monthlyGrowth >= 0 ? 'text-emerald-600' : 'text-red-600'} />
                          </div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
                        <img 
                          src={restaurant.image} 
                          alt={restaurant.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      
                      <div className="flex-1 ml-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-bold text-lg text-gray-900 dark:text-white">{restaurant.name}</h3>
                            <p className="text-gray-600 dark:text-gray-400 text-sm">{restaurant.address}</p>
                          </div>
                          <div className="flex gap-2">
                            <Badge 
                              text={restaurant.status === 'active' ? 'Actif' : restaurant.status === 'pending' ? 'En attente' : 'Suspendu'} 
                              color={getStatusBadgeColor(restaurant.status)}
                            />
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-6 mt-3">
                          <div className="flex items-center gap-1 text-amber-500">
                            <FiStar className="fill-current" size={16} />
                            <span className="font-semibold">{restaurant.rating.toFixed(1)}</span>
                          </div>
                          <div className="text-gray-600 dark:text-gray-400">
                            <span className="font-medium">{restaurant.orders}</span> commandes
                          </div>
                          <div className="text-gray-600 dark:text-gray-400">
                            <span className="font-medium">{formatCurrency(restaurant.revenue)}</span>
                          </div>
                          <div className="text-gray-600 dark:text-gray-400">
                            <span className="font-medium">{restaurant.categorie}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex-shrink-0 ml-4">
                        <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                          <FiEye size={20} />
                        </button>
                      </div>
                    </>
                  )}
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="p-12 text-center">
              <div className="flex justify-center mb-4">
                <HiOutlineSpeakerphone className="text-gray-400 dark:text-gray-500 text-6xl" />
              </div>
              <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
                Aucun restaurant trouvé
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6">
                Essayez d'ajuster vos filtres de recherche
              </p>
              <button 
                onClick={() => {
                  setSearchTerm('');
                  setFilterStatus('all');
                  setFilterCategory('all');
                  setSortBy('name');
                  setSortOrder('asc');
                }}
                className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-medium transition-all duration-200"
              >
                Réinitialiser les filtres
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Modal détails restaurant */}
      {selectedRestaurant && (
        <Modal
          isOpen={isDetailModalOpen}
          onClose={() => setIsDetailModalOpen(false)}
          title={selectedRestaurant.name}
        >
          <div className="p-6 max-h-96 overflow-y-auto">
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 rounded-xl p-6 mb-6">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="w-24 h-24 rounded-xl overflow-hidden flex-shrink-0">
                  <img 
                    src={selectedRestaurant.image} 
                    alt={selectedRestaurant.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{selectedRestaurant.name}</h3>
                      <p className="text-gray-600 dark:text-gray-400 flex items-center gap-2 mt-1">
                        <FiMapPin size={16} /> {selectedRestaurant.address}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Badge 
                        text={selectedRestaurant.status === 'active' ? 'Actif' : selectedRestaurant.status === 'pending' ? 'En attente' : 'Suspendu'} 
                        color={getStatusBadgeColor(selectedRestaurant.status)}
                      />
                      <Badge 
                        text={selectedRestaurant.verificationStatus === 'verified' ? 'Vérifié' : 'En attente'} 
                        color={getVerificationBadgeColor(selectedRestaurant.verificationStatus)}
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                      <FiPhone size={16} />
                      <span>{selectedRestaurant.contactPhone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                      <FiMail size={16} />
                      <span>{selectedRestaurant.contactEmail}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1 text-amber-500">
                      <FiStar className="fill-current" size={18} />
                      <span className="font-bold text-lg">{selectedRestaurant.rating.toFixed(1)}</span>
                      <span className="text-gray-600 dark:text-gray-400 text-sm ml-1">
                        ({selectedRestaurant.totalReviews} avis)
                      </span>
                    </div>
                    <div className="h-6 w-px bg-gray-300 dark:bg-gray-600"></div>
                    <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium">
                      {selectedRestaurant.categorie}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <FiActivity className="text-emerald-600" /> Performance
                </h4>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                    <span className="text-gray-600 dark:text-gray-400">Total commandes</span>
                    <span className="font-bold text-blue-700 dark:text-blue-300 text-xl">{selectedRestaurant.orders}</span>
                  </div>
                  
                  <div className="flex justify-between items-center p-3 bg-emerald-50 dark:bg-emerald-900/30 rounded-lg">
                    <span className="text-gray-600 dark:text-gray-400">Revenus totaux</span>
                    <span className="font-bold text-emerald-700 dark:text-emerald-300 text-xl">
                      {formatCurrency(selectedRestaurant.revenue)}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center p-3 bg-amber-50 dark:bg-amber-900/30 rounded-lg">
                    <span className="text-gray-600 dark:text-gray-400">Temps livraison moy.</span>
                    <span className="font-bold text-amber-700 dark:text-amber-300 text-xl">{selectedRestaurant.avgDeliveryTime}min</span>
                  </div>
                  
                  <div className="flex justify-between items-center p-3 bg-purple-50 dark:bg-purple-900/30 rounded-lg">
                    <span className="text-gray-600 dark:text-gray-400">Croissance mensuelle</span>
                    <span className={`font-bold text-xl ${selectedRestaurant.monthlyGrowth >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                      {selectedRestaurant.monthlyGrowth >= 0 ? '+' : ''}{selectedRestaurant.monthlyGrowth}%
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <FiShield className="text-blue-600" /> Conformité
                </h4>
                
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600 dark:text-gray-400">Score global</span>
                    <span className={`font-bold text-xl ${getComplianceScoreColor(selectedRestaurant.complianceScore)}`}>
                      {selectedRestaurant.complianceScore}%
                    </span>
                  </div>
                  <Progress 
                    value={selectedRestaurant.complianceScore} 
                    color={
                      selectedRestaurant.complianceScore >= 90 ? 'green' : 
                      selectedRestaurant.complianceScore >= 70 ? 'yellow' : 'red'
                    }
                  />
                </div>
                
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Sécurité alimentaire</span>
                      <span className="font-semibold text-emerald-600 dark:text-emerald-400">95%</span>
                    </div>
                    <Progress value={95} color="green" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Documentation</span>
                      <span className="font-semibold text-amber-600 dark:text-amber-400">82%</span>
                    </div>
                    <Progress value={82} color="yellow" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Service client</span>
                      <span className="font-semibold text-emerald-600 dark:text-emerald-400">90%</span>
                    </div>
                    <Progress value={90} color="green" />
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex flex-wrap justify-end gap-3">
              <button className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-medium transition-all duration-200">
                <FiEdit size={16} /> Modifier
              </button>
              
              {selectedRestaurant.status === 'active' ? (
                <button 
                  onClick={() => handleStatusChange(selectedRestaurant.id, 'suspended')}
                  className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl font-medium transition-all duration-200"
                >
                  <FiAlertTriangle size={16} /> Suspendre
                </button>
              ) : selectedRestaurant.status === 'suspended' ? (
                <button 
                  onClick={() => handleStatusChange(selectedRestaurant.id, 'active')}
                  className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-medium transition-all duration-200"
                >
                  <FiCheck size={16} /> Réactiver
                </button>
              ) : (
                <button 
                  onClick={() => handleStatusChange(selectedRestaurant.id, 'active')}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-all duration-200"
                >
                  <FiCheck size={16} /> Approuver
                </button>
              )}
              
              <button 
                onClick={() => handleDeleteRestaurant(selectedRestaurant.id)}
                className="flex items-center gap-2 px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-xl font-medium transition-all duration-200"
              >
                <FiTrash2 size={16} /> Supprimer
              </button>
            </div>
          </div>
        </Modal>
      )}
      
      {/* Modal ajout restaurant */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Ajouter un nouveau restaurant"
      >
        <form onSubmit={handleSubmitNewRestaurant} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
                Nom du restaurant *
              </label>
              <input 
                type="text" 
                name="restaurantName"
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-emerald-500 text-gray-900 dark:text-white transition-all duration-200"
                placeholder="Ex: Chez Pierre"
              />
            </div>
            
            <div>
              <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
                Type de cuisine *
              </label>
              <select 
                name="cuisineType"
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-emerald-500 text-gray-900 dark:text-white transition-all duration-200"
              >
                <option value="">Sélectionner une cuisine</option>
                <option value="Traditionnel Camerounais">Traditionnel Camerounais</option>
                <option value="Fast Food">Fast Food</option>
                <option value="Italien">Italien</option>
                <option value="Fusion">Fusion</option>
                <option value="Healthy">Healthy</option>
                <option value="Français">Français</option>
              </select>
            </div>
            
            <div>
              <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
                Téléphone *
              </label>
              <input 
                type="tel" 
                name="contactPhone"
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-emerald-500 text-gray-900 dark:text-white transition-all duration-200"
                placeholder="+237 6XX XXX XXX"
              />
            </div>
            
            <div>
              <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
                Email *
              </label>
              <input 
                type="email" 
                name="contactEmail"
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-emerald-500 text-gray-900 dark:text-white transition-all duration-200"
                placeholder="restaurant@example.com"
              />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
                Adresse complète *
              </label>
              <input 
                type="text" 
                name="address"
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-emerald-500 text-gray-900 dark:text-white transition-all duration-200"
                placeholder="123 Avenue Kennedy, Quartier, Ville"
              />
            </div>
            
            <div>
              <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
                Ville *
              </label>
              <select 
                name="city"
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-emerald-500 text-gray-900 dark:text-white transition-all duration-200"
              >
                <option value="">Sélectionner une ville</option>
                <option value="Douala">Douala</option>
                <option value="Yaoundé">Yaoundé</option>
                <option value="Bafoussam">Bafoussam</option>
                <option value="Limbe">Limbe</option>
                <option value="Buea">Buea</option>
              </select>
            </div>
            
            <div>
              <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
                Catégorie *
              </label>
              <select 
                name="categorie"
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-emerald-500 text-gray-900 dark:text-white transition-all duration-200"
              >
                <option value="">Sélectionner une catégorie</option>
                <option value="Africaine">Africaine</option>
                <option value="Européenne">Européenne</option>
                <option value="Asiatique">Asiatique</option>
                <option value="Fast Food">Fast Food</option>
                <option value="Autre">Autre</option>
              </select>
            </div>
            
            <div>
              <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
                Statut initial
              </label>
              <select 
                name="status"
                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-emerald-500 text-gray-900 dark:text-white transition-all duration-200"
              >
                <option value="pending">En attente d'approbation</option>
                <option value="active">Actif immédiatement</option>
              </select>
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
                Logo du restaurant
              </label>
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-8 text-center hover:border-emerald-500 dark:hover:border-emerald-400 transition-colors duration-200">
                <div className="flex flex-col items-center">
                  <FiImage className="text-gray-400 text-4xl mb-3" />
                  <p className="text-gray-600 dark:text-gray-400 mb-3">
                    Glissez une image ici ou cliquez pour parcourir
                  </p>
                  <button 
                    type="button" 
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-colors duration-200"
                  >
                    Parcourir les fichiers
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
            <button 
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="px-6 py-3 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-xl font-medium transition-all duration-200"
            >
              Annuler
            </button>
            <button 
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-medium transition-all duration-200 flex items-center gap-2 disabled:opacity-50"
            >
              {loading && <FiRefreshCw className="animate-spin" size={16} />}
              Créer le restaurant
            </button>
          </div>
        </form>
      </Modal>
      
      {/* Assistant chatbot */}
      <AnimatePresence>
        {isChatbotOpen && (
          <motion.div 
            className="fixed bottom-6 right-6 w-96 h-[500px] bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden z-50 flex flex-col"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.3 }}
          >
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-4 text-white flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <FiMessageSquare size={20} />
                </div>
                <div>
                  <h3 className="font-semibold">Assistant IA</h3>
                  <p className="text-xs opacity-75">En ligne</p>
                </div>
              </div>
              <button 
                onClick={toggleChatbot} 
                className="p-2 hover:bg-white/20 rounded-lg transition-colors duration-200"
              >
                <FiX size={18} />
              </button>
            </div>
            
            <div 
              ref={chatbotRef} 
              className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-900"
            >
              {chatMessages.map((msg, index) => (
                <motion.div 
                  key={index} 
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div 
                    className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                      msg.role === 'user' 
                        ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white ml-4' 
                        : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-sm border border-gray-200 dark:border-gray-700 mr-4'
                    }`}
                  >
                    {msg.content}
                  </div>
                </motion.div>
              ))}
            </div>
            
            <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
              <div className="flex gap-2">
                <input 
                  type="text" 
                  className="flex-1 px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 dark:text-white transition-all duration-200"
                  placeholder="Tapez votre message..."
                  value={currentMessage}
                  onChange={(e) => setCurrentMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                />
                <button 
                  onClick={handleSendMessage}
                  className="px-4 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-xl transition-all duration-200 transform hover:scale-105"
                >
                  <FiSend size={18} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      </div>
    </AdminLayout>
  );
};

export default RestaurantManagement;


export const AdminRestaurantProvider = ({children}) => {
  const [restaurants, setRestaurants] = useState(mockRestaurants); 
  const [registerRestaurants, setRegisterRestaurant] = useState(mockRegisterRestaurants);
  
  useEffect(() => {
    setRestaurants(mockRestaurants);
  }, [mockRestaurants])  

  useEffect(() => {
    setRegisterRestaurant(mockRegisterRestaurants)
  }, [mockRegisterRestaurants]);

  return(
    <adminRestaurantContext.Provider value={restaurants}>
      <registerRestaurantContext.Provider value={registerRestaurants}>
        {children}
      </registerRestaurantContext.Provider>
    </adminRestaurantContext.Provider>
  )
} 