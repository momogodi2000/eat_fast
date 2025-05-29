import React, { useState } from 'react';
import { 
  FiTag, FiPlus, FiEdit3, FiTrash2, FiEye, FiCopy, 
  FiDownload, FiFilter, FiSearch, FiCalendar, FiPercent,
  FiDollarSign, FiTruck, FiGift, FiUsers, FiShoppingBag,
  FiClock, FiBarChart3, FiTrendingUp, FiCheckCircle,
  FiXCircle, FiAlertCircle, FiRefreshCw
} from 'react-icons/fi';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import AdminLayout from '../../../../layouts/admin_layout';
import { useTheme } from '../../../../layouts/admin_layout';


// Mock data for promotions
const mockPromotions = [
  {
    id: 1,
    code: 'CHOPFAST2024ABC',
    type: 'PERCENTAGE',
    value: 20,
    description: 'New Year Special - 20% off all orders',
    status: 'active',
    usageCount: 145,
    usageLimit: 500,
    startDate: '2024-01-01',
    endDate: '2024-12-31',
    minOrderValue: 2000,
    maxDiscount: 5000,
    eligibility: ['new_users', 'returning_users'],
    restaurants: ['all'],
    categories: ['all'],
    createdDate: '2023-12-15'
  },
  {
    id: 2,
    code: 'NEWUSER50XYZ',
    type: 'FIXED_AMOUNT',
    value: 1000,
    description: 'First-time user discount',
    status: 'active',
    usageCount: 89,
    usageLimit: 1000,
    startDate: '2024-01-01',
    endDate: '2024-12-31',
    minOrderValue: 3000,
    maxDiscount: 1000,
    eligibility: ['new_users'],
    restaurants: ['all'],
    categories: ['all'],
    createdDate: '2024-01-01'
  },
  {
    id: 3,
    code: 'WEEKEND25DEF',
    type: 'PERCENTAGE',
    value: 25,
    description: 'Weekend Special Discount',
    status: 'scheduled',
    usageCount: 0,
    usageLimit: 200,
    startDate: '2024-06-01',
    endDate: '2024-06-30',
    minOrderValue: 1500,
    maxDiscount: 3000,
    eligibility: ['weekend_only'],
    restaurants: ['all'],
    categories: ['fast_food', 'pizza'],
    createdDate: '2024-05-15'
  },
  {
    id: 4,
    code: 'FREEDELIVERY',
    type: 'FREE_DELIVERY',
    value: 0,
    description: 'Free delivery for orders above 5000 FCFA',
    status: 'active',
    usageCount: 234,
    usageLimit: 1000,
    startDate: '2024-01-01',
    endDate: '2024-12-31',
    minOrderValue: 5000,
    maxDiscount: 2000,
    eligibility: ['all_users'],
    restaurants: ['all'],
    categories: ['all'],
    createdDate: '2024-01-01'
  }
];

// Mock analytics data
const usageAnalytics = [
    { month: 'Jan', codes: 245, revenue: 125000 },
    { month: 'Feb', codes: 312, revenue: 156000 },
    { month: 'Mar', codes: 289, revenue: 144500 },
    { month: 'Apr', codes: 376, revenue: 188000 },
    { month: 'May', codes: 425, revenue: 212500 }
  ];
  
  const promotionTypes = [
    { name: 'Percentage', value: 45, color: '#10B981' },
    { name: 'Fixed Amount', value: 30, color: '#F59E0B' },
    { name: 'Free Delivery', value: 20, color: '#3B82F6' },
    { name: 'BOGO', value: 5, color: '#EF4444' }
  ];
  
  const PromotionManagement = () => {
    const theme = useTheme();
    const darkMode = theme?.darkMode || false;
    const [promotions, setPromotions] = useState(mockPromotions);
    const [selectedPromotion, setSelectedPromotion] = useState(null);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showBulkModal, setShowBulkModal] = useState(false);
    const [showAnalytics, setShowAnalytics] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [filterType, setFilterType] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    
    const itemsPerPage = 10;
  
    // Filter promotions based on search and filters
    const filteredPromotions = promotions.filter(promo => {
      const matchesSearch = promo.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           promo.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = filterStatus === 'all' || promo.status === filterStatus;
      const matchesType = filterType === 'all' || promo.type === filterType;
      
      return matchesSearch && matchesStatus && matchesType;
    });

  // Pagination logic
  const totalPages = Math.ceil(filteredPromotions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedPromotions = filteredPromotions.slice(startIndex, startIndex + itemsPerPage);

  // Generate promotion code
  const generatePromotionCode = (type, length = 8) => {
    const prefixes = {
      PERCENTAGE: 'SAVE',
      FIXED_AMOUNT: 'DEAL',
      FREE_DELIVERY: 'FREE',
      BOGO: 'BOGO',
      WEEKEND: 'WKND',
      NEWUSER: 'NEW'
    };
    
    const prefix = prefixes[type] || 'PROMO';
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = prefix;
    
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    
    return result;
  };

  // Create new promotion
  const handleCreatePromotion = (formData) => {
    const newPromotion = {
      id: Date.now(),
      ...formData,
      code: generatePromotionCode(formData.type),
      usageCount: 0,
      createdDate: new Date().toISOString().split('T')[0]
    };
    
    setPromotions([...promotions, newPromotion]);
    setShowCreateModal(false);
  };

  // Toggle promotion status
  const togglePromotionStatus = (id) => {
    setPromotions(promotions.map(promo => 
      promo.id === id 
        ? { ...promo, status: promo.status === 'active' ? 'inactive' : 'active' }
        : promo
    ));
  };

  // Delete promotion
  const deletePromotion = (id) => {
    setPromotions(promotions.filter(promo => promo.id !== id));
  };

  // Copy promotion code to clipboard
  const copyToClipboard = (code) => {
    navigator.clipboard.writeText(code);
    // You could add a toast notification here
  };

// Format currency
const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XAF',
      minimumFractionDigits: 0
    }).format(amount);
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'inactive': return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
      case 'scheduled': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'expired': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Get type icon
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
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-4 lg:space-y-0">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center">
              <FiTag className="mr-3 text-green-600" />
              Promotion Management
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-1">
              Create, manage, and analyze promotional campaigns
            </p>
          </div>
          
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setShowAnalytics(!showAnalytics)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 flex items-center"
            >
              <FiBarChart3 className="mr-2" />
              Analytics
            </button>
            <button
              onClick={() => setShowBulkModal(true)}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all duration-200 flex items-center"
            >
              <FiDownload className="mr-2" />
              Bulk Generate
            </button>
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-200 flex items-center"
            >
              <FiPlus className="mr-2" />
              Create Promotion
            </button>
          </div>
        </div>

        {/* Analytics Section */}
        {showAnalytics && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fadeIn">
            {/* Stats Cards */}
            <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">Total Promotions</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{promotions.length}</p>
                  </div>
                  <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
                    <FiTag className="w-6 h-6 text-green-600 dark:text-green-400" />
                  </div>
                </div>
                <div className="flex items-center mt-2">
                  <FiTrendingUp className="w-4 h-4 text-green-500 mr-1" />
                  <span className="text-green-500 text-sm">+12%</span>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">Active Codes</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {promotions.filter(p => p.status === 'active').length}
                    </p>
                  </div>
                  <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
                    <FiCheckCircle className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
                <div className="flex items-center mt-2">
                  <FiTrendingUp className="w-4 h-4 text-blue-500 mr-1" />
                  <span className="text-blue-500 text-sm">+8%</span>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">Total Usage</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {promotions.reduce((sum, p) => sum + p.usageCount, 0)}
                    </p>
                  </div>
                  <div className="p-3 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
                    <FiUsers className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                  </div>
                </div>
                <div className="flex items-center mt-2">
                  <FiTrendingUp className="w-4 h-4 text-yellow-500 mr-1" />
                  <span className="text-yellow-500 text-sm">+25%</span>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">Revenue Impact</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{formatCurrency(826000)}</p>
                  </div>
                  <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-lg">
                    <FiDollarSign className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                  </div>
                </div>
                <div className="flex items-center mt-2">
                  <FiTrendingUp className="w-4 h-4 text-purple-500 mr-1" />
                  <span className="text-purple-500 text-sm">+18%</span>
                </div>
              </div>
            </div>

            {/* Charts */}
            <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Usage Trends</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={usageAnalytics}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="month" stroke="#6B7280" />
                  <YAxis stroke="#6B7280" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: darkMode ? '#1F2937' : '#FFFFFF',
                      border: `1px solid ${darkMode ? '#374151' : '#E5E7EB'}`,
                      borderRadius: '8px'
                    }}
                  />
                  <Line type="monotone" dataKey="codes" stroke="#10B981" strokeWidth={3} />
                  <Line type="monotone" dataKey="revenue" stroke="#3B82F6" strokeWidth={3} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Promotion Types</h3>
              <ResponsiveContainer width="100%" height={300}>
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
              <div className="mt-4 space-y-2">
                {promotionTypes.map((type, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div 
                        className="w-3 h-3 rounded-full mr-2"
                        style={{ backgroundColor: type.color }}
                      />
                      <span className="text-sm text-gray-600 dark:text-gray-300">{type.name}</span>
                    </div>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">{type.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Search and Filters */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <FiSearch className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Search promotions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="scheduled">Scheduled</option>
              <option value="expired">Expired</option>
            </select>
            
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="all">All Types</option>
              <option value="PERCENTAGE">Percentage</option>
              <option value="FIXED_AMOUNT">Fixed Amount</option>
              <option value="FREE_DELIVERY">Free Delivery</option>
              <option value="BOGO">Buy One Get One</option>
            </select>
            
            <button className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200 flex items-center">
              <FiFilter className="mr-2" />
              More Filters
            </button>
          </div>
        </div>

        {/* Promotions Table */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Code & Description
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Type & Value
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Usage
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Validity
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {paginatedPromotions.map((promotion) => (
                  <tr key={promotion.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150">
                    <td className="px-6 py-4">
                      <div>
                        <div className="flex items-center">
                          <span className="font-mono font-medium text-gray-900 dark:text-white">
                            {promotion.code}
                          </span>
                          <button
                            onClick={() => copyToClipboard(promotion.code)}
                            className="ml-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                          >
                            <FiCopy className="w-4 h-4" />
                          </button>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                          {promotion.description}
                        </p>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg mr-3">
                          {getTypeIcon(promotion.type)}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {promotion.type === 'PERCENTAGE' ? `${promotion.value}%` : 
                             promotion.type === 'FIXED_AMOUNT' ? formatCurrency(promotion.value) :
                             promotion.type === 'FREE_DELIVERY' ? 'Free Delivery' : 'BOGO'}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            Min: {formatCurrency(promotion.minOrderValue)}
                          </p>
                        </div>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4">
                      <div>
                        <div className="flex items-center">
                          <span className="font-medium text-gray-900 dark:text-white">
                            {promotion.usageCount}/{promotion.usageLimit}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2 mt-1">
                          <div 
                            className="bg-green-500 h-2 rounded-full"
                            style={{ width: `${(promotion.usageCount / promotion.usageLimit) * 100}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm text-gray-900 dark:text-white">
                          {new Date(promotion.startDate).toLocaleDateString()} - 
                        </p>
                        <p className="text-sm text-gray-900 dark:text-white">
                          {new Date(promotion.endDate).toLocaleDateString()}
                        </p>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(promotion.status)}`}>
                        {promotion.status}
                      </span>
                    </td>
                    
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button 
                          onClick={() => setSelectedPromotion(promotion)}
                          className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                        >
                          <FiEye className="w-4 h-4" />
                        </button>
                        <button className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300">
                          <FiEdit3 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => togglePromotionStatus(promotion.id)}
                          className={`${promotion.status === 'active' ? 'text-red-600 hover:text-red-900' : 'text-green-600 hover:text-green-900'}`}
                        >
                          {promotion.status === 'active' ? <FiXCircle className="w-4 h-4" /> : <FiCheckCircle className="w-4 h-4" />}
                        </button>
                        <button 
                          onClick={() => deletePromotion(promotion.id)}
                          className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                        >
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          <div className="bg-white dark:bg-gray-800 px-4 py-3 border-t border-gray-200 dark:border-gray-700 sm:px-6">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700 dark:text-gray-300">
                Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredPromotions.length)} of {filteredPromotions.length} results
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 rounded border border-gray-300 dark:border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                >
                  Previous
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-1 rounded border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 ${currentPage === page ? 'bg-blue-500 text-white' : ''}`}                   >
                    {page}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 rounded border border-gray-300 dark:border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Create Promotion Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">Create New Promotion</h3>
                  <button
                    onClick={() => setShowCreateModal(false)}
                    className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                  >
                    <FiXCircle className="w-6 h-6" />
                  </button>
                </div>

                <form onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.target);
                  handleCreatePromotion(Object.fromEntries(formData));
                }}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Promotion Type
                      </label>
                      <select
                        name="type"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        required
                      >
                        <option value="">Select type</option>
                        <option value="PERCENTAGE">Percentage Discount</option>
                        <option value="FIXED_AMOUNT">Fixed Amount</option>
                        <option value="FREE_DELIVERY">Free Delivery</option>
                        <option value="BOGO">Buy One Get One</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Discount Value
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          name="value"
                          className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          placeholder="0"
                          required
                        />
                        <span className="absolute left-3 top-2.5 text-gray-500 dark:text-gray-400">
                          {document.querySelector('select[name="type"]')?.value === 'PERCENTAGE' ? '%' : 'FCFA'}
                        </span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Description
                      </label>
                      <input
                        type="text"
                        name="description"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        placeholder="Promotion description"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Status
                      </label>
                      <select
                        name="status"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        required
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                        <option value="scheduled">Scheduled</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Start Date
                      </label>
                      <div className="relative">
                        <FiCalendar className="absolute left-3 top-3 text-gray-400" />
                        <input
                          type="date"
                          name="startDate"
                          className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        End Date
                      </label>
                      <div className="relative">
                        <FiCalendar className="absolute left-3 top-3 text-gray-400" />
                        <input
                          type="date"
                          name="endDate"
                          className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Minimum Order Value (FCFA)
                      </label>
                      <input
                        type="number"
                        name="minOrderValue"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        placeholder="0"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Usage Limit
                      </label>
                      <input
                        type="number"
                        name="usageLimit"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        placeholder="0"
                        required
                      />
                    </div>
                  </div>

                  <div className="mt-8 flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => setShowCreateModal(false)}
                      className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 flex items-center"
                    >
                      <FiPlus className="mr-2" />
                      Create Promotion
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Bulk Generate Modal */}
        {showBulkModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">Bulk Generate Promotions</h3>
                  <button
                    onClick={() => setShowBulkModal(false)}
                    className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                  >
                    <FiXCircle className="w-6 h-6" />
                  </button>
                </div>

                <form>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Number of Codes to Generate
                      </label>
                      <input
                        type="number"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        placeholder="e.g. 100"
                        min="1"
                        max="1000"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Promotion Type
                      </label>
                      <select
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      >
                        <option value="PERCENTAGE">Percentage Discount</option>
                        <option value="FIXED_AMOUNT">Fixed Amount</option>
                        <option value="FREE_DELIVERY">Free Delivery</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Discount Value
                      </label>
                      <input
                        type="number"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        placeholder="0"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Prefix (optional)
                      </label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        placeholder="e.g. SUMMER"
                        maxLength="8"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Start Date
                      </label>
                      <div className="relative">
                        <FiCalendar className="absolute left-3 top-3 text-gray-400" />
                        <input
                          type="date"
                          className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        End Date
                      </label>
                      <div className="relative">
                        <FiCalendar className="absolute left-3 top-3 text-gray-400" />
                        <input
                          type="date"
                          className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => setShowBulkModal(false)}
                      className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200 flex items-center"
                    >
                      <FiDownload className="mr-2" />
                      Generate Codes
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Promotion Details Modal */}
        {selectedPromotion && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">Promotion Details</h3>
                  <button
                    onClick={() => setSelectedPromotion(null)}
                    className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                  >
                    <FiXCircle className="w-6 h-6" />
                  </button>
                </div>

                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <span className="font-mono font-medium text-gray-900 dark:text-white text-lg">
                        {selectedPromotion.code}
                      </span>
                      <button
                        onClick={() => copyToClipboard(selectedPromotion.code)}
                        className="ml-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                      >
                        <FiCopy className="w-5 h-5" />
                      </button>
                    </div>
                    <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(selectedPromotion.status)}`}>
                      {selectedPromotion.status}
                    </span>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Description</h4>
                    <p className="text-gray-900 dark:text-white">{selectedPromotion.description}</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Type</h4>
                      <div className="flex items-center">
                        <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg mr-3">
                          {getTypeIcon(selectedPromotion.type)}
                        </div>
                        <p className="text-gray-900 dark:text-white">
                          {selectedPromotion.type === 'PERCENTAGE' ? `${selectedPromotion.value}% discount` : 
                           selectedPromotion.type === 'FIXED_AMOUNT' ? `${formatCurrency(selectedPromotion.value)} off` :
                           selectedPromotion.type === 'FREE_DELIVERY' ? 'Free Delivery' : 'Buy One Get One'}
                        </p>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Usage</h4>
                      <div>
                        <p className="text-gray-900 dark:text-white">
                          {selectedPromotion.usageCount} / {selectedPromotion.usageLimit} ({Math.round((selectedPromotion.usageCount / selectedPromotion.usageLimit) * 100)}%)
                        </p>
                        <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2 mt-1">
                          <div 
                            className="bg-green-500 h-2 rounded-full"
                            style={{ width: `${(selectedPromotion.usageCount / selectedPromotion.usageLimit) * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Validity Period</h4>
                      <p className="text-gray-900 dark:text-white">
                        {new Date(selectedPromotion.startDate).toLocaleDateString()} - {new Date(selectedPromotion.endDate).toLocaleDateString()}
                      </p>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Minimum Order</h4>
                      <p className="text-gray-900 dark:text-white">
                        {formatCurrency(selectedPromotion.minOrderValue)}
                      </p>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Created Date</h4>
                      <p className="text-gray-900 dark:text-white">
                        {new Date(selectedPromotion.createdDate).toLocaleDateString()}
                      </p>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Eligibility</h4>
                      <p className="text-gray-900 dark:text-white">
                        {selectedPromotion.eligibility.join(', ').replace(/_/g, ' ')}
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Restrictions</h4>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-xs rounded-full">
                        {selectedPromotion.restaurants.includes('all') ? 'All Restaurants' : `${selectedPromotion.restaurants.length} Restaurants`}
                      </span>
                      <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-xs rounded-full">
                        {selectedPromotion.categories.includes('all') ? 'All Categories' : `${selectedPromotion.categories.length} Categories`}
                      </span>
                      {selectedPromotion.maxDiscount && (
                        <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-xs rounded-full">
                          Max discount: {formatCurrency(selectedPromotion.maxDiscount)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex justify-end">
                  <button
                    onClick={() => setSelectedPromotion(null)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default PromotionManagement;