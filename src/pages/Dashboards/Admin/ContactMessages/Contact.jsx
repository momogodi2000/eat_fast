import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import {
  FiMail,
  FiSearch,
  FiRefreshCw,
  FiTrash2,
  FiSend,
  FiAlertCircle,
  FiClock,
  FiCheckCircle,
  FiCheck,
  FiTag,
  FiActivity,
  FiCalendar,
  FiX,
  FiChevronUp,
  FiChevronDown
} from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../../../layouts/admin_layout';

// Mock data for contact messages
const MOCK_CONTACT_MESSAGES = [
  {
    id: 1,
    name: 'Jean Dupont',
    email: 'jean.dupont@example.com',
    phone: '+237 675432198',
    subject: 'Question sur la livraison',
    message: 'Bonjour, j\'aimerais savoir si vous livrez dans le quartier Bonabéri à Douala ?',
    date: '2025-05-12T08:30:00',
    isRead: true,
    isNewsletter: false,
    status: 'answered',
    category: 'delivery',
    isSelected: false
  },
  {
    id: 2,
    name: 'Marie Nguemo',
    email: 'marie.nguemo@gmail.com',
    phone: '+237 677889900',
    subject: 'Problème avec ma commande #EF23456',
    message: 'Bonsoir, ma commande a été livrée incomplète hier soir.',
    date: '2025-05-15T19:45:00',
    isRead: false,
    isNewsletter: false,
    status: 'pending',
    category: 'complaint',
    isSelected: false
  }
];

const AdminContactMessages = () => {
  const { t } = useTranslation(['admin', 'translation']);
  const { isDarkMode } = useTheme();
  
  // States
  const [messages, setMessages] = useState([]);
  const [filteredMessages, setFilteredMessages] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [notification, setNotification] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showCategoryFilter, setShowCategoryFilter] = useState(false);
  const [showStatusFilter, setShowStatusFilter] = useState(false);
  const [showDateFilter, setShowDateFilter] = useState(false);
  const [dateFilter, setDateFilter] = useState('all');
  
  // Load messages on component mount
  useEffect(() => {
    setTimeout(() => {
      setMessages(MOCK_CONTACT_MESSAGES);
      setIsLoading(false);
    }, 800);
  }, []);

  // Filter and search messages
  const filteredAndSortedMessages = useMemo(() => {
    let result = [...messages];
    
    // Filter by status
    if (filterStatus !== 'all') {
      result = result.filter(msg => msg.status === filterStatus);
    }
    
    // Filter by category
    if (filterCategory !== 'all') {
      result = result.filter(msg => msg.category === filterCategory);
    }
    
    // Filter by search term
    if (searchTerm) {
      const lowerSearchTerm = searchTerm.toLowerCase();
      result = result.filter(
        msg => 
          msg.name.toLowerCase().includes(lowerSearchTerm) ||
          msg.email.toLowerCase().includes(lowerSearchTerm) ||
          msg.subject.toLowerCase().includes(lowerSearchTerm) ||
          msg.message.toLowerCase().includes(lowerSearchTerm)
      );
    }
    
    // Sort by date (most recent first)
    result.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    return result;
  }, [messages, filterStatus, filterCategory, searchTerm]);

  useEffect(() => {
    setFilteredMessages(filteredAndSortedMessages);
  }, [filteredAndSortedMessages]);

  // Handle refresh
  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsRefreshing(false);
    showNotification('success', 'Messages refreshed successfully');
  }, []);

  // Delete message
  const handleDeleteMessage = useCallback((id, event) => {
    event?.stopPropagation();
    
    if (window.confirm('Are you sure you want to delete this message?')) {
      setMessages(prev => prev.filter(msg => msg.id !== id));
      showNotification('success', 'Message deleted successfully');
    }
  }, []);

  // Handle delete selected
  const handleDeleteSelected = useCallback(() => {
    const selectedMessages = messages.filter(msg => msg.isSelected);
    
    if (selectedMessages.length === 0) {
      showNotification('error', 'No messages selected');
      return;
    }
    
    if (window.confirm(`Are you sure you want to delete ${selectedMessages.length} message(s)?`)) {
      setMessages(prev => prev.filter(msg => !msg.isSelected));
      showNotification('success', `${selectedMessages.length} message(s) deleted`);
    }
  }, [messages]);

  // Show notification
  const showNotification = useCallback((type, message) => {
    setNotification({ type, message });
    
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  }, []);

  // Format date
  const formatDate = useCallback((dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  }, []);

  // Get status color
  const getStatusColor = useCallback((status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800 border border-yellow-300',
      answered: 'bg-green-100 text-green-800 border border-green-300',
      urgent: 'bg-red-100 text-red-800 border border-red-300'
    };
    return colors[status] || 'bg-gray-100 text-gray-800 border border-gray-300';
  }, []);

  // Reset filters
  const resetFilters = useCallback(() => {
    setFilterStatus('all');
    setFilterCategory('all');
    setDateFilter('all');
    setSearchTerm('');
  }, []);

  // Calculate stats
  const stats = useMemo(() => {
    const total = filteredMessages.length;
    const unread = filteredMessages.filter(m => !m.isRead).length;
    const pending = filteredMessages.filter(m => m.status === 'pending').length;
    const answered = filteredMessages.filter(m => m.status === 'answered').length;
    
    return { total, unread, pending, answered };
  }, [filteredMessages]);

  // Options for filters
  const statusOptions = {
    all: 'All',
    pending: 'Pending',
    answered: 'Answered',
    urgent: 'Urgent'
  };

  const categoryOptions = {
    all: 'All Categories',
    delivery: 'Delivery',
    complaint: 'Complaint',
    suggestion: 'Suggestion',
    business: 'Business'
  };

  const dateFilterOptions = [
    { value: 'all', label: 'All Time' },
    { value: 'today', label: 'Today' },
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' }
  ];

  // Render notification
  const renderNotification = useCallback(() => {
    if (!notification) return null;
    
    const bgColor = notification.type === 'success' 
      ? 'bg-gradient-to-r from-green-500 to-green-600' 
      : 'bg-gradient-to-r from-red-500 to-red-600';
    
    return (
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -50 }}
        className={`fixed top-20 right-4 z-50 flex items-center p-4 rounded-xl shadow-2xl ${bgColor} text-white min-w-[300px]`}
      >
        {notification.type === 'success' ? <FiCheck className="mr-2" /> : <FiAlertCircle className="mr-2" />}
        <span className="font-medium">{notification.message}</span>
      </motion.div>
    );
  }, [notification]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-300">Loading messages...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors duration-300">
      {/* Notifications */}
      <AnimatePresence>
        {renderNotification()}
      </AnimatePresence>

      {/* Header */}
      <div className="mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Contact Messages
            </h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Manage customer inquiries and support requests
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex flex-wrap gap-3">
            <button
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-2 transition-colors duration-200"
              onClick={handleRefresh}
            >
              <FiRefreshCw className={isRefreshing ? "animate-spin" : ""} />
              Refresh
            </button>
            <button
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg flex items-center gap-2 transition-colors duration-200"
              onClick={handleDeleteSelected}
            >
              <FiTrash2 />
              Delete Selected
            </button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6 bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 transition-colors duration-300">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search messages..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {/* Category Filter */}
            <div className="relative">
              <button
                onClick={() => setShowCategoryFilter(!showCategoryFilter)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 flex items-center gap-2 transition-colors duration-200"
              >
                <FiTag />
                Category
                {showCategoryFilter ? <FiChevronUp /> : <FiChevronDown />}
              </button>
              {showCategoryFilter && (
                <div className="absolute z-10 mt-1 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 transition-colors duration-200">
                  {Object.keys(categoryOptions).map((category) => (
                    <button
                      key={category}
                      className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 ${
                        filterCategory === category
                          ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300"
                          : "text-gray-700 dark:text-gray-200"
                      }`}
                      onClick={() => {
                        setFilterCategory(category);
                        setShowCategoryFilter(false);
                      }}
                    >
                      {categoryOptions[category]}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Status Filter */}
            <div className="relative">
              <button
                onClick={() => setShowStatusFilter(!showStatusFilter)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 flex items-center gap-2 transition-colors duration-200"
              >
                <FiActivity />
                Status
                {showStatusFilter ? <FiChevronUp /> : <FiChevronDown />}
              </button>
              {showStatusFilter && (
                <div className="absolute z-10 mt-1 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 transition-colors duration-200">
                  {Object.keys(statusOptions).map((status) => (
                    <button
                      key={status}
                      className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 ${
                        filterStatus === status
                          ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300"
                          : "text-gray-700 dark:text-gray-200"
                      }`}
                      onClick={() => {
                        setFilterStatus(status);
                        setShowStatusFilter(false);
                      }}
                    >
                      {statusOptions[status]}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={resetFilters}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 flex items-center gap-2 transition-colors duration-200"
            >
              <FiX />
              Reset
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 border-l-4 border-blue-500 transition-colors duration-200">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Messages</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
            </div>
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <FiMail className="text-blue-600 dark:text-blue-400 text-xl" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 border-l-4 border-yellow-500 transition-colors duration-200">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Unread Messages</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">{stats.unread}</p>
            </div>
            <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
              <FiAlertCircle className="text-yellow-600 dark:text-yellow-400 text-xl" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 border-l-4 border-red-500 transition-colors duration-200">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Pending Messages</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">{stats.pending}</p>
            </div>
            <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
              <FiClock className="text-red-600 dark:text-red-400 text-xl" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 border-l-4 border-green-500 transition-colors duration-200">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Answered Messages</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">{stats.answered}</p>
            </div>
            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <FiCheckCircle className="text-green-600 dark:text-green-400 text-xl" />
            </div>
          </div>
        </div>
      </div>

      {/* Messages Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden transition-colors duration-200">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Subject
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredMessages.map((message) => (
                <tr key={message.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                          <span className="text-blue-600 dark:text-blue-400 font-medium">
                            {message.name.charAt(0)}
                          </span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {message.name}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {message.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 dark:text-white">{message.subject}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-xs">
                      {message.message}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(message.status)}`}>
                      {message.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {formatDate(message.date)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={(e) => handleDeleteMessage(message.id, e)}
                      className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300"
                    >
                      <FiTrash2 />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredMessages.length === 0 && (
        <div className="text-center py-12">
          <FiMail className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No messages</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            No messages match your current filters.
          </p>
        </div>
      )}
    </div>
  );
};

export default AdminContactMessages;