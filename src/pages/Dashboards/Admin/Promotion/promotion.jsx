import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiTag, FiPlus, FiEdit3, FiTrash2, FiEye, FiCopy, 
  FiDownload, FiFilter, FiSearch, FiCalendar, FiPercent,
  FiDollarSign, FiTruck, FiGift, FiUsers, FiShoppingBag,
  FiClock, FiBarChart2, FiTrendingUp, FiCheckCircle,
  FiXCircle, FiAlertCircle, FiRefreshCw, FiStar,
  FiTarget, FiZap, FiSettings, FiUser, FiPackage,
  FiActivity, FiAward, FiSend, FiMail, FiSmartphone,FiPieChart
} from 'react-icons/fi';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, AreaChart, Area } from 'recharts';
import AdminLayout from '../../../../layouts/admin_layout';

// Données mockées pour les promotions
const mockPromotions = [
  {
    id: 1,
    code: 'CHOPFAST2024ABC',
    type: 'PERCENTAGE',
    value: 20,
    description: 'Promotion Nouvel An - 20% de réduction',
    status: 'active',
    usageCount: 145,
    usageLimit: 500,
    startDate: '2024-01-01',
    endDate: '2024-12-31',
    minOrderValue: 2000,
    maxDiscount: 5000,
    eligibility: ['nouveaux_clients', 'clients_reguliers'],
    autoAssigned: true,
    createdDate: '2023-12-15'
  },
  {
    id: 2,
    code: 'NEWUSER50XYZ',
    type: 'FIXED_AMOUNT',
    value: 1000,
    description: 'Réduction première commande',
    status: 'active',
    usageCount: 89,
    usageLimit: 1000,
    startDate: '2024-01-01',
    endDate: '2024-12-31',
    minOrderValue: 3000,
    maxDiscount: 1000,
    eligibility: ['nouveaux_clients'],
    autoAssigned: true,
    createdDate: '2024-01-01'
  },
  {
    id: 3,
    code: 'WEEKEND25DEF',
    type: 'PERCENTAGE',
    value: 25,
    description: 'Spécial Weekend',
    status: 'scheduled',
    usageCount: 0,
    usageLimit: 200,
    startDate: '2024-06-01',
    endDate: '2024-06-30',
    minOrderValue: 1500,
    maxDiscount: 3000,
    eligibility: ['weekends_seulement'],
    autoAssigned: false,
    createdDate: '2024-05-15'
  },
  {
    id: 4,
    code: 'FREEDELIVERY',
    type: 'FREE_DELIVERY',
    value: 0,
    description: 'Livraison gratuite commandes +5000 FCFA',
    status: 'active',
    usageCount: 234,
    usageLimit: 1000,
    startDate: '2024-01-01',
    endDate: '2024-12-31',
    minOrderValue: 5000,
    maxDiscount: 2000,
    eligibility: ['tous_clients'],
    autoAssigned: true,
    createdDate: '2024-01-01'
  }
];

// Données pour les commandes des utilisateurs
const mockUserOrders = [
  {
    id: 1,
    userId: 'user_001',
    userName: 'Jean Dupont',
    email: 'jean.dupont@email.cm',
    phone: '+237 698765432',
    totalOrders: 15,
    totalSpent: 180000,
    avgOrderValue: 12000,
    lastOrderDate: '2024-06-10',
    customerType: 'regulier',
    preferredCategories: ['Fast Food', 'Africain'],
    loyaltyScore: 85,
    suggestedPromo: 'LOYALTY15',
    promoEligible: true
  },
  {
    id: 2,
    userId: 'user_002',
    userName: 'Marie Kamga',
    email: 'marie.kamga@email.cm',
    phone: '+237 699876543',
    totalOrders: 3,
    totalSpent: 35000,
    avgOrderValue: 11667,
    lastOrderDate: '2024-06-08',
    customerType: 'nouveau',
    preferredCategories: ['Healthy', 'Européen'],
    loyaltyScore: 25,
    suggestedPromo: 'NEWUSER50',
    promoEligible: true
  },
  {
    id: 3,
    userId: 'user_003',
    userName: 'Paul Mballa',
    email: 'paul.mballa@email.cm',
    phone: '+237 697654321',
    totalOrders: 28,
    totalSpent: 420000,
    avgOrderValue: 15000,
    lastOrderDate: '2024-06-11',
    customerType: 'vip',
    preferredCategories: ['Africain', 'Fast Food'],
    loyaltyScore: 95,
    suggestedPromo: 'VIP25',
    promoEligible: true
  }
];

// Données analytiques
const usageAnalytics = [
  { month: 'Jan', codes: 245, revenue: 125000, savings: 18500 },
  { month: 'Fév', codes: 312, revenue: 156000, savings: 23400 },
  { month: 'Mar', codes: 289, revenue: 144500, savings: 21675 },
  { month: 'Avr', codes: 376, revenue: 188000, savings: 28200 },
  { month: 'Mai', codes: 425, revenue: 212500, savings: 31875 }
];

const promotionTypes = [
  { name: 'Pourcentage', value: 45, color: '#10B981', count: 12 },
  { name: 'Montant Fixe', value: 30, color: '#F59E0B', count: 8 },
  { name: 'Livraison Gratuite', value: 20, color: '#3B82F6', count: 5 },
  { name: 'BOGO', value: 5, color: '#EF4444', count: 2 }
];

const customerSegments = [
  { segment: 'Nouveaux', count: 1250, percentage: 35, avgSpent: 8500, promoUsage: 78 },
  { segment: 'Réguliers', count: 1850, percentage: 52, avgSpent: 15200, promoUsage: 45 },
  { segment: 'VIP', count: 465, percentage: 13, avgSpent: 28500, promoUsage: 65 }
];

const PromotionManagement = () => {
  const [promotions, setPromotions] = useState(mockPromotions);
  const [userOrders, setUserOrders] = useState(mockUserOrders);
  const [selectedPromotion, setSelectedPromotion] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [showAutoAssignModal, setShowAutoAssignModal] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  
  const itemsPerPage = 10;

  // Formater la devise
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XAF',
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Filtrer les promotions
  const filteredPromotions = promotions.filter(promo => {
    const matchesSearch = promo.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         promo.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || promo.status === filterStatus;
    const matchesType = filterType === 'all' || promo.type === filterType;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  // Pagination
  const totalPages = Math.ceil(filteredPromotions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedPromotions = filteredPromotions.slice(startIndex, startIndex + itemsPerPage);

  // Générer un code promo
  const generatePromotionCode = (type, length = 8) => {
    const prefixes = {
      PERCENTAGE: 'SAVE',
      FIXED_AMOUNT: 'DEAL',
      FREE_DELIVERY: 'FREE',
      BOGO: 'BOGO',
      VIP: 'VIP',
      LOYALTY: 'LOYAL'
    };
    
    const prefix = prefixes[type] || 'PROMO';
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = prefix;
    
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    
    return result;
  };

  // Assigner automatiquement des promotions
  const autoAssignPromotion = (userId, promoType) => {
    const user = userOrders.find(u => u.userId === userId);
    if (!user) return;

    let promoCode = '';
    let promoValue = 0;
    let promoDescription = '';

    switch (promoType) {
      case 'loyalty':
        promoCode = generatePromotionCode('LOYALTY');
        promoValue = Math.min(15, Math.floor(user.loyaltyScore / 6));
        promoDescription = `Récompense fidélité - ${promoValue}% de réduction`;
        break;
      case 'welcome':
        promoCode = generatePromotionCode('FIXED_AMOUNT');
        promoValue = 1500;
        promoDescription = 'Bienvenue - 1500 FCFA de réduction';
        break;
      case 'vip':
        promoCode = generatePromotionCode('VIP');
        promoValue = 25;
        promoDescription = 'Statut VIP - 25% de réduction';
        break;
      case 'free_delivery':
        promoCode = generatePromotionCode('FREE_DELIVERY');
        promoValue = 0;
        promoDescription = 'Livraison gratuite offerte';
        break;
    }

    const newPromotion = {
      id: Date.now(),
      code: promoCode,
      type: promoType === 'free_delivery' ? 'FREE_DELIVERY' : 
            promoType === 'welcome' ? 'FIXED_AMOUNT' : 'PERCENTAGE',
      value: promoValue,
      description: promoDescription,
      status: 'active',
      usageCount: 0,
      usageLimit: 1,
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      minOrderValue: promoType === 'welcome' ? 2000 : 0,
      maxDiscount: promoType === 'loyalty' ? user.avgOrderValue * 0.15 : 
                   promoType === 'vip' ? user.avgOrderValue * 0.25 : promoValue,
      eligibility: [user.customerType],
      autoAssigned: true,
      assignedTo: userId,
      createdDate: new Date().toISOString().split('T')[0]
    };

    setPromotions(prev => [...prev, newPromotion]);
    return newPromotion;
  };

  // Composant carte de statistique amélioré
  const EnhancedStatCard = ({ icon, title, value, subtitle, trend, color, onClick }) => (
    <motion.div 
      className={`relative overflow-hidden rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 cursor-pointer bg-gradient-to-br ${color || 'from-white to-gray-50 dark:from-gray-800 dark:to-gray-900'} hover:shadow-xl transition-all duration-300`}
      whileHover={{ scale: 1.02, y: -2 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      onClick={onClick}
    >
      <div className="absolute right-4 top-4 opacity-20">
        {React.cloneElement(icon, { size: 32 })}
      </div>
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-3">
          <div className={`p-3 rounded-xl backdrop-blur-sm ${color ? 'bg-white/20' : 'bg-gray-100 dark:bg-gray-700'}`}>
            {React.cloneElement(icon, { size: 24, className: color ? 'text-white' : 'text-gray-700 dark:text-gray-300' })}
          </div>
          {trend !== undefined && (
            <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
              trend >= 0 
                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300' 
                : 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
            }`}>
              {trend >= 0 ? <FiTrendingUp size={12} /> : <FiTrendingUp size={12} className="rotate-180" />}
              {Math.abs(trend)}%
            </div>
          )}
        </div>
        
        <h3 className={`text-lg font-semibold mb-2 ${color ? 'text-white' : 'text-gray-700 dark:text-gray-200'}`}>
          {title}
        </h3>
        
        <div className={`text-3xl font-bold mb-2 ${color ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
          {value}
        </div>
        
        {subtitle && (
          <p className={`text-sm ${color ? 'text-white/80' : 'text-gray-600 dark:text-gray-400'}`}>
            {subtitle}
          </p>
        )}
      </div>
    </motion.div>
  );

  // Tooltip personnalisé
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg">
          <p className="font-semibold text-gray-900 dark:text-white mb-2">{label}</p>
          {payload.map((entry, index) => (
            <p key={`item-${index}`} style={{ color: entry.color }} className="text-sm flex items-center gap-2">
              <span className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }}></span>
              {`${entry.name}: ${entry.name.includes('revenue') || entry.name.includes('savings') ? formatCurrency(entry.value) : entry.value}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  // Couleurs pour les statuts
  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200';
      case 'inactive': return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
      case 'scheduled': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'expired': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Icônes pour les types
  const getTypeIcon = (type) => {
    switch (type) {
      case 'PERCENTAGE': return <FiPercent className="w-4 h-4" />;
      case 'FIXED_AMOUNT': return <FiDollarSign className="w-4 h-4" />;
      case 'FREE_DELIVERY': return <FiTruck className="w-4 h-4" />;
      case 'BOGO': return <FiGift className="w-4 h-4" />;
      default: return <FiPercent className="w-4 h-4" />;
    }
  };

  return (
    <AdminLayout>
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4 lg:p-6">
      {/* En-tête */}
      <motion.div 
        className="mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-4">
              <div className="p-3 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl">
                <FiTag className="text-white text-3xl" />
              </div>
              Gestion des Promotions
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              Créez, gérez et assignez automatiquement des promotions à vos clients
            </p>
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setShowAutoAssignModal(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <FiZap size={18} />
              Auto-Assignation
            </button>
            
            <button
              onClick={() => setShowBulkModal(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <FiDownload size={18} />
              Génération Groupée
            </button>
            
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <FiPlus size={18} />
              Créer Promotion
            </button>
          </div>
        </div>
      </motion.div>

      {/* Navigation par onglets */}
      <div className="flex flex-wrap gap-2 mb-8">
        {[
          { key: 'overview', label: 'Vue d\'ensemble', icon: FiBarChart2 },
          { key: 'promotions', label: 'Promotions', icon: FiTag },
          { key: 'customers', label: 'Clients', icon: FiUsers },
          { key: 'analytics', label: 'Analytics', icon: FiActivity }
        ].map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
              activeTab === key
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg'
                : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 border border-gray-200 dark:border-gray-700'
            }`}
          >
            <Icon size={18} />
            {label}
          </button>
        ))}
      </div>

      {/* Contenu principal */}
      <AnimatePresence mode="wait">
        {activeTab === 'overview' && (
          <motion.div
            key="overview"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.5 }}
            className="space-y-8"
          >
            {/* Cartes de statistiques */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <EnhancedStatCard 
                icon={<FiTag />}
                title="Total Promotions"
                value={promotions.length}
                subtitle={`${promotions.filter(p => p.status === 'active').length} actives`}
                trend={12}
                color="from-emerald-500 to-emerald-600"
              />
              
              <EnhancedStatCard 
                icon={<FiUsers />}
                title="Utilisations"
                value={promotions.reduce((sum, p) => sum + p.usageCount, 0)}
                subtitle="Ce mois"
                trend={25}
                color="from-blue-500 to-blue-600"
              />
              
              <EnhancedStatCard 
                icon={<FiDollarSign />}
                title="Économies Clients"
                value={formatCurrency(148750)}
                subtitle="Total économisé"
                trend={18}
                color="from-amber-500 to-orange-500"
              />
              
              <EnhancedStatCard 
                icon={<FiZap />}
                title="Auto-Assignées"
                value={promotions.filter(p => p.autoAssigned).length}
                subtitle="Automatiquement"
                trend={35}
                color="from-purple-500 to-indigo-600"
              />
            </div>

            {/* Graphiques de vue d'ensemble */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <motion.div 
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-3 mb-6">
                  <FiTrendingUp className="text-emerald-600" size={24} />
                  Tendances d'Usage
                </h3>
                
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={usageAnalytics} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                      <defs>
                        <linearGradient id="colorCodes" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10B981" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#10B981" stopOpacity={0.1}/>
                        </linearGradient>
                        <linearGradient id="colorSavings" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#F59E0B" stopOpacity={0.1}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                      <XAxis dataKey="month" tick={{ fill: '#6B7280' }} />
                      <YAxis tick={{ fill: '#6B7280' }} />
                      <Tooltip content={<CustomTooltip />} />
                      <Area 
                        type="monotone" 
                        dataKey="codes" 
                        stroke="#10B981" 
                        fillOpacity={1} 
                        fill="url(#colorCodes)"
                        name="Codes utilisés"
                      />
                      <Area 
                        type="monotone" 
                        dataKey="savings" 
                        stroke="#F59E0B" 
                        fillOpacity={1} 
                        fill="url(#colorSavings)"
                        name="Économies (FCFA)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>

              <motion.div 
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-3 mb-6">
                  <FiPieChart className="text-blue-600" size={24} />
                  Types de Promotions
                </h3>
                
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={promotionTypes}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {promotionTypes.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                
                <div className="mt-4 space-y-3">
                  {promotionTypes.map((type, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: type.color }}
                        />
                        <span className="font-medium text-gray-900 dark:text-white">{type.name}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-lg font-bold text-gray-900 dark:text-white">{type.count}</span>
                        <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">({type.value}%)</span>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Segments de clients */}
            <motion.div 
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-3 mb-6">
                <FiTarget className="text-purple-600" size={24} />
                Segments de Clientèle
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {customerSegments.map((segment, index) => (
                  <div key={index} className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-700 dark:to-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-600">
                    <div className="flex justify-between items-start mb-4">
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-white">{segment.segment}</h4>
                      <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-sm font-medium rounded-full">
                        {segment.percentage}%
                      </span>
                    </div>
                    
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Nombre de clients</p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">{segment.count.toLocaleString()}</p>
                      </div>
                      
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Dépense moyenne</p>
                        <p className="text-lg font-semibold text-emerald-600">{formatCurrency(segment.avgSpent)}</p>
                      </div>
                      
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Usage promos</p>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                            <div 
                              className="bg-purple-500 h-2 rounded-full"
                              style={{ width: `${segment.promoUsage}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium text-gray-900 dark:text-white">{segment.promoUsage}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}

        {activeTab === 'customers' && (
          <motion.div
            key="customers"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.5 }}
            className="space-y-8"
          >
            {/* Filtres clients */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Clients Éligibles aux Promotions
                </h2>
                
                <div className="flex gap-3">
                  <div className="relative">
                    <FiSearch className="absolute left-3 top-3 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Rechercher un client..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white min-w-[250px]"
                    />
                  </div>
                  
                  <select className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                    <option>Tous les types</option>
                    <option value="nouveau">Nouveaux</option>
                    <option value="regulier">Réguliers</option>
                    <option value="vip">VIP</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Liste des clients */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">Client</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">Type</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">Commandes</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">Dépense Totale</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">Score Fidélité</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">Promo Suggérée</th>
                      <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900 dark:text-white">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {userOrders.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">{user.userName}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{user.phone}</p>
                          </div>
                        </td>
                        
                        <td className="px-6 py-4">
                          <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                            user.customerType === 'vip' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' :
                            user.customerType === 'regulier' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                            'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          }`}>
                            {user.customerType === 'vip' ? 'VIP' : 
                             user.customerType === 'regulier' ? 'Régulier' : 'Nouveau'}
                          </span>
                        </td>
                        
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-semibold text-gray-900 dark:text-white">{user.totalOrders}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              Moy: {formatCurrency(user.avgOrderValue)}
                            </p>
                          </div>
                        </td>
                        
                        <td className="px-6 py-4">
                          <p className="font-semibold text-emerald-600">{formatCurrency(user.totalSpent)}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Dernière: {new Date(user.lastOrderDate).toLocaleDateString('fr-FR')}
                          </p>
                        </td>
                        
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <div className="flex-1 bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                              <div 
                                className={`h-2 rounded-full ${
                                  user.loyaltyScore >= 80 ? 'bg-emerald-500' :
                                  user.loyaltyScore >= 50 ? 'bg-blue-500' : 'bg-amber-500'
                                }`}
                                style={{ width: `${user.loyaltyScore}%` }}
                              />
                            </div>
                            <span className="text-sm font-medium text-gray-900 dark:text-white">{user.loyaltyScore}/100</span>
                          </div>
                        </td>
                        
                        <td className="px-6 py-4">
                          <span className="font-mono font-medium text-purple-600 dark:text-purple-400">
                            {user.suggestedPromo}
                          </span>
                        </td>
                        
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button 
                              onClick={() => setSelectedUser(user)}
                              className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 p-1 rounded"
                              title="Voir détails"
                            >
                              <FiEye size={16} />
                            </button>
                            
                            <button 
                              onClick={() => {
                                if (user.customerType === 'vip') {
                                  autoAssignPromotion(user.userId, 'vip');
                                } else if (user.customerType === 'nouveau') {
                                  autoAssignPromotion(user.userId, 'welcome');
                                } else {
                                  autoAssignPromotion(user.userId, 'loyalty');
                                }
                              }}
                              className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1 rounded-lg text-sm font-medium transition-colors flex items-center gap-1"
                              title="Assigner promo automatique"
                            >
                              <FiZap size={14} />
                              Assigner
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'promotions' && (
          <motion.div
            key="promotions"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.5 }}
            className="space-y-8"
          >
            {/* Filtres promotions */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="relative">
                  <FiSearch className="absolute left-3 top-3 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Rechercher promotions..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="all">Tous les statuts</option>
                  <option value="active">Actif</option>
                  <option value="inactive">Inactif</option>
                  <option value="scheduled">Programmé</option>
                  <option value="expired">Expiré</option>
                </select>
                
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="all">Tous les types</option>
                  <option value="PERCENTAGE">Pourcentage</option>
                  <option value="FIXED_AMOUNT">Montant fixe</option>
                  <option value="FREE_DELIVERY">Livraison gratuite</option>
                  <option value="BOGO">Achetez 1 obtenez 1</option>
                </select>
                
                <button 
                  onClick={() => {
                    setIsLoading(true);
                    setTimeout(() => setIsLoading(false), 1000);
                  }}
                  className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  <FiRefreshCw className={`${isLoading ? 'animate-spin' : ''}`} size={16} />
                  Actualiser
                </button>
              </div>
            </div>

            {/* Tableau des promotions */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">Code & Description</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">Type & Valeur</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">Usage</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">Validité</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">Statut</th>
                      <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900 dark:text-white">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {paginatedPromotions.map((promotion) => (
                      <tr key={promotion.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                        <td className="px-6 py-4">
                          <div>
                            <div className="flex items-center gap-3">
                              <span className="font-mono font-medium text-gray-900 dark:text-white">
                                {promotion.code}
                              </span>
                              <button
                                onClick={() => navigator.clipboard.writeText(promotion.code)}
                                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                              >
                                <FiCopy size={14} />
                              </button>
                              {promotion.autoAssigned && (
                                <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300 text-xs font-medium rounded-full">
                                  <FiZap size={10} />
                                  Auto
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                              {promotion.description}
                            </p>
                          </div>
                        </td>
                        
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-emerald-100 dark:bg-emerald-900 rounded-lg">
                              {getTypeIcon(promotion.type)}
                            </div>
                            <div>
                              <p className="font-medium text-gray-900 dark:text-white">
                                {promotion.type === 'PERCENTAGE' ? `${promotion.value}%` : 
                                 promotion.type === 'FIXED_AMOUNT' ? formatCurrency(promotion.value) :
                                 promotion.type === 'FREE_DELIVERY' ? 'Livraison Gratuite' : 'BOGO'}
                              </p>
                              <p className="text-sm text-gray-600 dark:text-gray-300">
                                Min: {formatCurrency(promotion.minOrderValue)}
                              </p>
                            </div>
                          </div>
                        </td>
                        
                        <td className="px-6 py-4">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium text-gray-900 dark:text-white">
                                {promotion.usageCount}/{promotion.usageLimit}
                              </span>
                              <span className="text-sm text-gray-500">
                                ({Math.round((promotion.usageCount / promotion.usageLimit) * 100)}%)
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                              <div 
                                className="bg-emerald-500 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${(promotion.usageCount / promotion.usageLimit) * 100}%` }}
                              />
                            </div>
                          </div>
                        </td>
                        
                        <td className="px-6 py-4">
                          <div>
                            <p className="text-sm text-gray-900 dark:text-white">
                              {new Date(promotion.startDate).toLocaleDateString('fr-FR')}
                            </p>
                            <p className="text-sm text-gray-900 dark:text-white">
                              {new Date(promotion.endDate).toLocaleDateString('fr-FR')}
                            </p>
                          </div>
                        </td>
                        
                        <td className="px-6 py-4">
                          <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(promotion.status)}`}>
                            {promotion.status === 'active' ? 'Actif' :
                             promotion.status === 'inactive' ? 'Inactif' :
                             promotion.status === 'scheduled' ? 'Programmé' : 'Expiré'}
                          </span>
                        </td>
                        
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button 
                              onClick={() => setSelectedPromotion(promotion)}
                              className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 p-1 rounded"
                            >
                              <FiEye size={16} />
                            </button>
                            <button className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300 p-1 rounded">
                              <FiEdit3 size={16} />
                            </button>
                            <button className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 p-1 rounded">
                              <FiTrash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {/* Pagination */}
              <div className="bg-gray-50 dark:bg-gray-700 px-6 py-4 border-t border-gray-200 dark:border-gray-600">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-700 dark:text-gray-300">
                    Affichage {startIndex + 1} à {Math.min(startIndex + itemsPerPage, filteredPromotions.length)} sur {filteredPromotions.length} résultats
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      className="px-3 py-1 rounded border border-gray-300 dark:border-gray-600 disabled:opacity-50 hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300"
                    >
                      Précédent
                    </button>
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      const page = i + Math.max(1, currentPage - 2);
                      return page <= totalPages ? (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`px-3 py-1 rounded border ${
                            currentPage === page 
                              ? 'bg-emerald-500 text-white border-emerald-500' 
                              : 'border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300'
                          }`}
                        >
                          {page}
                        </button>
                      ) : null;
                    })}
                    <button
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                      className="px-3 py-1 rounded border border-gray-300 dark:border-gray-600 disabled:opacity-50 hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300"
                    >
                      Suivant
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal Auto-Assignation */}
      <AnimatePresence>
        {showAutoAssignModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                    <FiZap className="text-purple-600" />
                    Auto-Assignation de Promotions
                  </h3>
                  <button
                    onClick={() => setShowAutoAssignModal(false)}
                    className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <FiXCircle size={24} />
                  </button>
                </div>

                <div className="space-y-6">
                  <div className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 p-6 rounded-xl border border-purple-200 dark:border-purple-800">
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                      Règles d'Assignation Automatique
                    </h4>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-gray-700 dark:text-gray-300">
                          <strong>Nouveaux clients:</strong> Code de bienvenue (1500 FCFA de réduction)
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span className="text-gray-700 dark:text-gray-300">
                          <strong>Clients réguliers:</strong> Réduction basée sur le score de fidélité
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                        <span className="text-gray-700 dark:text-gray-300">
                          <strong>Clients VIP:</strong> 25% de réduction sur toute commande
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                        <span className="text-gray-700 dark:text-gray-300">
                          <strong>Commandes importantes:</strong> Livraison gratuite automatique
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <button
                      onClick={() => {
                        userOrders.filter(u => u.customerType === 'nouveau').forEach(user => {
                          autoAssignPromotion(user.userId, 'welcome');
                        });
                        setShowAutoAssignModal(false);
                      }}
                      className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-800 rounded-xl hover:shadow-lg transition-all duration-200"
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <FiUsers className="text-green-600" size={24} />
                        <h5 className="font-semibold text-gray-900 dark:text-white">Nouveaux Clients</h5>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        Assigner des codes de bienvenue aux nouveaux utilisateurs
                      </p>
                      <span className="text-lg font-bold text-green-600">
                        {userOrders.filter(u => u.customerType === 'nouveau').length} éligibles
                      </span>
                    </button>

                    <button
                      onClick={() => {
                        userOrders.filter(u => u.customerType === 'regulier').forEach(user => {
                          autoAssignPromotion(user.userId, 'loyalty');
                        });
                        setShowAutoAssignModal(false);
                      }}
                      className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800 rounded-xl hover:shadow-lg transition-all duration-200"
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <FiStar className="text-blue-600" size={24} />
                        <h5 className="font-semibold text-gray-900 dark:text-white">Clients Réguliers</h5>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        Récompenser la fidélité avec des codes personnalisés
                      </p>
                      <span className="text-lg font-bold text-blue-600">
                        {userOrders.filter(u => u.customerType === 'regulier').length} éligibles
                      </span>
                    </button>

                    <button
                      onClick={() => {
                        userOrders.filter(u => u.customerType === 'vip').forEach(user => {
                          autoAssignPromotion(user.userId, 'vip');
                        });
                        setShowAutoAssignModal(false);
                      }}
                      className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border border-purple-200 dark:border-purple-800 rounded-xl hover:shadow-lg transition-all duration-200"
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <FiAward className="text-purple-600" size={24} />
                        <h5 className="font-semibold text-gray-900 dark:text-white">Clients VIP</h5>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        Offrir des avantages exclusifs aux meilleurs clients
                      </p>
                      <span className="text-lg font-bold text-purple-600">
                        {userOrders.filter(u => u.customerType === 'vip').length} éligibles
                      </span>
                    </button>

                    <button
                      onClick={() => {
                        userOrders.filter(u => u.avgOrderValue > 10000).forEach(user => {
                          autoAssignPromotion(user.userId, 'free_delivery');
                        });
                        setShowAutoAssignModal(false);
                      }}
                      className="p-6 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border border-amber-200 dark:border-amber-800 rounded-xl hover:shadow-lg transition-all duration-200"
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <FiTruck className="text-amber-600" size={24} />
                        <h5 className="font-semibold text-gray-900 dark:text-white">Livraison Gratuite</h5>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        Offrir la livraison gratuite aux gros commanditaires
                      </p>
                      <span className="text-lg font-bold text-amber-600">
                        {userOrders.filter(u => u.avgOrderValue > 10000).length} éligibles
                      </span>
                    </button>
                  </div>

                  <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <button
                      onClick={() => setShowAutoAssignModal(false)}
                      className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-xl font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                    >
                      Annuler
                    </button>
                    <button
                      onClick={() => {
                        // Assigner toutes les promotions automatiquement
                        userOrders.forEach(user => {
                          if (user.customerType === 'nouveau') {
                            autoAssignPromotion(user.userId, 'welcome');
                          } else if (user.customerType === 'vip') {
                            autoAssignPromotion(user.userId, 'vip');
                          } else if (user.customerType === 'regulier') {
                            autoAssignPromotion(user.userId, 'loyalty');
                          }
                        });
                        setShowAutoAssignModal(false);
                      }}
                      className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-xl font-medium transition-all duration-200 flex items-center gap-2"
                    >
                      <FiZap size={18} />
                      Assigner Tout Automatiquement
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal de création de promotion */}
      <AnimatePresence>
        {showCreateModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Créer une Nouvelle Promotion</h3>
                  <button
                    onClick={() => setShowCreateModal(false)}
                    className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <FiXCircle size={24} />
                  </button>
                </div>

                <form onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.target);
                  const newPromotion = {
                    id: Date.now(),
                    code: generatePromotionCode(formData.get('type')),
                    type: formData.get('type'),
                    value: parseInt(formData.get('value')),
                    description: formData.get('description'),
                    status: formData.get('status'),
                    usageCount: 0,
                    usageLimit: parseInt(formData.get('usageLimit')),
                    startDate: formData.get('startDate'),
                    endDate: formData.get('endDate'),
                    minOrderValue: parseInt(formData.get('minOrderValue')),
                    maxDiscount: parseInt(formData.get('maxDiscount')) || 0,
                    eligibility: [formData.get('eligibility')],
                    autoAssigned: formData.get('autoAssigned') === 'on',
                    createdDate: new Date().toISOString().split('T')[0]
                  };
                  setPromotions([...promotions, newPromotion]);
                  setShowCreateModal(false);
                }}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Type de Promotion *
                      </label>
                      <select
                        name="type"
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-emerald-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        required
                      >
                        <option value="">Sélectionner un type</option>
                        <option value="PERCENTAGE">Pourcentage de réduction</option>
                        <option value="FIXED_AMOUNT">Montant fixe</option>
                        <option value="FREE_DELIVERY">Livraison gratuite</option>
                        <option value="BOGO">Achetez 1 obtenez 1</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Valeur de la Réduction *
                      </label>
                      <input
                        type="number"
                        name="value"
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-emerald-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        placeholder="0"
                        required
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Description *
                      </label>
                      <input
                        type="text"
                        name="description"
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-emerald-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        placeholder="Description de la promotion"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Statut *
                      </label>
                      <select
                        name="status"
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-emerald-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        required
                      >
                        <option value="active">Actif</option>
                        <option value="inactive">Inactif</option>
                        <option value="scheduled">Programmé</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Limite d'Usage *
                      </label>
                      <input
                        type="number"
                        name="usageLimit"
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-emerald-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        placeholder="0"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Date de Début *
                      </label>
                      <input
                        type="date"
                        name="startDate"
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-emerald-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Date de Fin *
                      </label>
                      <input
                        type="date"
                        name="endDate"
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-emerald-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Commande Minimum (FCFA) *
                      </label>
                      <input
                        type="number"
                        name="minOrderValue"
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-emerald-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        placeholder="0"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Éligibilité *
                      </label>
                      <select
                        name="eligibility"
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-emerald-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        required
                      >
                        <option value="tous_clients">Tous les clients</option>
                        <option value="nouveaux_clients">Nouveaux clients</option>
                        <option value="clients_reguliers">Clients réguliers</option>
                        <option value="clients_vip">Clients VIP</option>
                      </select>
                    </div>

                    <div className="md:col-span-2">
                      <label className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          name="autoAssigned"
                          className="w-5 h-5 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
                        />
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Activer l'assignation automatique
                        </span>
                      </label>
                    </div>
                  </div>

                  <div className="mt-8 flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setShowCreateModal(false)}
                      className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-xl font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                    >
                      Annuler
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl font-medium transition-all duration-200 flex items-center gap-2"
                    >
                      <FiPlus size={18} />
                      Créer la Promotion
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      </div>
    </AdminLayout>
  );
};

export default PromotionManagement;