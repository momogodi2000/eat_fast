import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiEdit2, FiTrash2, FiSearch, FiUserPlus, FiFilter, FiDownload, 
  FiEye, FiChevronLeft, FiChevronRight, FiRefreshCw, FiMoreVertical,
  FiUsers, FiShield, FiTruck, FiHome, FiHeadphones, FiCheck, FiX,
  FiClock, FiAlertTriangle, FiFileText, FiUpload, FiWifi, FiWifiOff,
  FiPhone, FiMail, FiMapPin, FiCalendar, FiPackage, FiStar, FiActivity,
  FiUser, FiLock, FiCamera, FiImage, FiCheckCircle, FiXCircle,
  FiAlertCircle, FiInfo, FiTrendingUp, FiTrendingDown, FiZap, FiGlobe,
  FiChevronDown, FiChevronUp, FiPlus
} from 'react-icons/fi';

// Constants
const USER_ROLES = {
  CLIENT: 'client',
  AGENT_SUPPORT: 'agent_support', 
  ADMINISTRATOR: 'administrator',
  RESTAURANT_MANAGER: 'restaurant_manager',
  DELIVERY_AGENT: 'delivery_agent'
};

const USER_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive', 
  PENDING: 'pending',
  SUSPENDED: 'suspended',
  REJECTED: 'rejected'
};

// Role Configuration
const getRoleConfig = (role) => {
  const configs = {
    [USER_ROLES.CLIENT]: {
      icon: FiUsers,
      color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      label: 'Client',
      documentsRequired: [],
      canManage: ['profile']
    },
    [USER_ROLES.AGENT_SUPPORT]: {
      icon: FiHeadphones,
      color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
      label: 'Agent Support',
      documentsRequired: ['education_certificate', 'language_proficiency'],
      canManage: ['clients', 'tickets']
    },
    [USER_ROLES.ADMINISTRATOR]: {
      icon: FiShield,
      color: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20',
      label: 'Administrateur',
      documentsRequired: [],
      canManage: ['all']
    },
    [USER_ROLES.RESTAURANT_MANAGER]: {
      icon: FiHome,
      color: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
      bgColor: 'bg-orange-50 dark:bg-orange-900/20',
      label: 'Gestionnaire Restaurant',
      documentsRequired: ['business_license', 'health_certificate', 'menu', 'id_document'],
      canManage: ['restaurant', 'orders', 'menu']
    },
    [USER_ROLES.DELIVERY_AGENT]: {
      icon: FiTruck,
      color: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200',
      bgColor: 'bg-indigo-50 dark:bg-indigo-900/20',
      label: 'Agent Livreur',
      documentsRequired: ['driving_license', 'vehicle_registration', 'id_document'],
      canManage: ['deliveries', 'profile']
    }
  };
  return configs[role] || configs[USER_ROLES.CLIENT];
};

// User Status Badge Component
const UserStatusBadge = ({ status }) => {
  const getStatusConfig = (status) => {
    switch (status) {
      case USER_STATUS.ACTIVE:
        return {
          bg: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
          icon: FiCheckCircle,
          label: 'Actif'
        };
      case USER_STATUS.PENDING:
        return {
          bg: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
          icon: FiClock,
          label: 'En attente'
        };
      case USER_STATUS.SUSPENDED:
        return {
          bg: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
          icon: FiAlertTriangle,
          label: 'Suspendu'
        };
      case USER_STATUS.REJECTED:
        return {
          bg: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
          icon: FiXCircle,
          label: 'Rejeté'
        };
      default:
        return {
          bg: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
          icon: FiUser,
          label: 'Inactif'
        };
    }
  };

  const config = getStatusConfig(status);
  const Icon = config.icon;

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg}`}>
      <Icon size={12} className="mr-1" />
      {config.label}
    </span>
  );
};

// Offline Status Hook
const useOnlineStatus = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  
  return isOnline;
};

// Notification Hook
const useNotification = () => {
  const [notification, setNotification] = useState(null);

  const showNotification = useCallback((message, type = 'info', duration = 5000) => {
    setNotification({ message, type, id: Date.now() });
    if (duration > 0) {
      setTimeout(() => setNotification(null), duration);
    }
  }, []);

  const hideNotification = useCallback(() => {
    setNotification(null);
  }, []);

  return { notification, showNotification, hideNotification };
};

// Enhanced Notification Component
const NotificationComponent = ({ notification, onClose }) => {
  if (!notification) return null;

  const getNotificationConfig = (type) => {
    switch (type) {
      case 'success':
        return { bg: 'bg-green-500', icon: FiCheckCircle, title: 'Succès' };
      case 'error':
        return { bg: 'bg-red-500', icon: FiXCircle, title: 'Erreur' };
      case 'warning':
        return { bg: 'bg-yellow-500', icon: FiAlertTriangle, title: 'Attention' };
      default:
        return { bg: 'bg-blue-500', icon: FiInfo, title: 'Information' };
    }
  };

  const config = getNotificationConfig(notification.type);
  const Icon = config.icon;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: -20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: -20 }}
        className={`fixed top-4 right-4 z-50 ${config.bg} text-white rounded-xl shadow-2xl max-w-md overflow-hidden`}
      >
        <div className="p-4">
          <div className="flex items-start space-x-3">
            <Icon size={24} className="flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h4 className="font-semibold text-sm">{config.title}</h4>
              <p className="text-sm opacity-90 mt-1">{notification.message}</p>
            </div>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white transition-colors"
            >
              <FiX size={20} />
            </button>
          </div>
        </div>
        <motion.div
          initial={{ width: '100%' }}
          animate={{ width: '0%' }}
          transition={{ duration: 5, ease: 'linear' }}
          className="h-1 bg-white/20"
        />
      </motion.div>
    </AnimatePresence>
  );
};

const UserListMain = ({ 
  users, 
  filteredUsers, 
  searchTerm, 
  setSearchTerm, 
  selectedRole, 
  setSelectedRole, 
  selectedStatus, 
  setSelectedStatus,
  isLoading,
  fetchUsers,
  currentPage,
  setCurrentPage,
  usersPerPage,
  onUserAction,
  onExportCSV,
  onAddUser
}) => {
  const isOnline = useOnlineStatus();
  const { notification, showNotification, hideNotification } = useNotification();

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  const handleSort = (key) => {
    // Implement sorting logic
  };

  return (
    <>
      {/* Offline Indicator */}
      <AnimatePresence>
        {!isOnline && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-0 left-0 right-0 z-50 bg-red-500 text-white px-4 py-3 text-center shadow-lg"
          >
            <div className="flex items-center justify-center space-x-2">
              <FiWifiOff size={20} />
              <span className="font-medium">Mode hors ligne - Fonctionnalités limitées</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Notifications */}
      <NotificationComponent notification={notification} onClose={hideNotification} />

      <div className={`${!isOnline ? 'pt-16' : ''}`}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8"
        >
          <div>
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-2">
              Gestion des Utilisateurs
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Gérez tous les utilisateurs de votre plateforme • {filteredUsers.length} utilisateur(s)
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 mt-4 lg:mt-0">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onAddUser}
              className="flex items-center justify-center px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl font-medium shadow-lg transition-all duration-200"
            >
              <FiUserPlus className="mr-2" size={20} />
              Nouvel utilisateur
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onExportCSV}
              className="flex items-center justify-center px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl font-medium shadow-lg transition-all duration-200"
            >
              <FiDownload className="mr-2" size={20} />
              Exporter CSV
            </motion.button>
          </div>
        </motion.div>

        {/* Statistics Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-8"
        >
          {Object.values(USER_ROLES).map(role => {
            const roleConfig = getRoleConfig(role);
            const newusers=[...users];
            const count = newusers.filter(user => user.role === role).length;
            const activeCount = newusers.filter(user => user.role === role && user.status === USER_STATUS.ACTIVE).length;
            const RoleIcon = roleConfig.icon;
            const percentage = count > 0 ? Math.round((activeCount / count) * 100) : 0;
            
            return (
              <motion.div
                key={role}
                whileHover={{ scale: 1.02, y: -2 }}
                className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-200 border border-gray-200 dark:border-gray-700"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${roleConfig.color}`}>
                    <RoleIcon size={24} />
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {count}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {activeCount} actifs
                    </p>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                    {roleConfig.label}
                  </p>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-500 ${
                        percentage >= 80 ? 'bg-green-500' :
                        percentage >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {percentage}% actifs
                  </p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Filters and Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-8 border border-gray-200 dark:border-gray-700"
        >
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <FiSearch className="text-gray-400" size={20} />
              </div>
              <input
                type="text"
                placeholder="Rechercher par nom, email ou téléphone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors dark:bg-gray-700 dark:text-white"
              />
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex items-center space-x-2">
                <FiFilter className="text-gray-400" size={20} />
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  className="px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors dark:bg-gray-700 dark:text-white"
                >
                  <option value="all">Tous les rôles</option>
                  {Object.values(USER_ROLES).map(role => (
                    <option key={role} value={role}>
                      {getRoleConfig(role).label}
                    </option>
                  ))}
                </select>
              </div>

              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors dark:bg-gray-700 dark:text-white"
              >
                <option value="all">Tous les statuts</option>
                {Object.values(USER_STATUS).map(status => (
                  <option key={status} value={status}>
                    {status === USER_STATUS.ACTIVE ? 'Actif' :
                     status === USER_STATUS.PENDING ? 'En attente' :
                     status === USER_STATUS.SUSPENDED ? 'Suspendu' :
                     status === USER_STATUS.REJECTED ? 'Rejeté' : 'Inactif'}
                  </option>
                ))}
              </select>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={fetchUsers}
                className="p-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-xl transition-colors"
              >
                <FiRefreshCw className={`${isLoading ? 'animate-spin' : ''} text-gray-600 dark:text-gray-300`} size={20} />
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Users Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700"
        >
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Utilisateur
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Rôle
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Statut
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Localisation
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Date d'inscription
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {currentUsers.length > 0 ? (
                  currentUsers.map((user, index) => {
                    const roleConfig = getRoleConfig(user.role);
                    return (
                      <motion.tr
                        key={user.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center">
                              <span className="text-white font-medium text-sm">
                                {user.first_name?.charAt(0)}{user.last_name?.charAt(0)}
                              </span>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900 dark:text-white">
                                {user.first_name} {user.last_name}
                              </div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">
                                ID: {user.id}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 dark:text-white">
                            {user.email}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-3 py-1 text-xs font-medium rounded-full ${roleConfig.color}`}>
                            {roleConfig.label}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <UserStatusBadge status={user.status} />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                          {user.city}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {new Date(user.createdAt).toLocaleDateString('fr-FR')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end space-x-2">
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => onUserAction('view', user)}
                              className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-200 transition-colors"
                              title="Voir les détails"
                            >
                              <FiEye size={18} />
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => onUserAction('edit', user)}
                              className="text-emerald-600 hover:text-emerald-900 dark:text-emerald-400 dark:hover:text-emerald-200 transition-colors"
                              title="Modifier"
                            >
                              <FiEdit2 size={18} />
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => onUserAction('delete', user)}
                              className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-200 transition-colors"
                              title="Supprimer"
                            >
                              <FiTrash2 size={18} />
                            </motion.button>
                          </div>
                        </td>
                      </motion.tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="7" className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                      <div className="flex flex-col items-center space-y-4">
                        <FiUsers size={48} className="text-gray-300 dark:text-gray-600" />
                        <div>
                          <p className="text-lg font-medium">Aucun utilisateur trouvé</p>
                          <p className="text-sm">Essayez de modifier vos critères de recherche</p>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {filteredUsers.length > 0 && (
            <div className="bg-white dark:bg-gray-800 px-6 py-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="text-sm text-gray-700 dark:text-gray-300">
                  Affichage de <span className="font-medium">{indexOfFirstUser + 1}</span> à{' '}
                  <span className="font-medium">{Math.min(indexOfLastUser, filteredUsers.length)}</span> sur{' '}
                  <span className="font-medium">{filteredUsers.length}</span> résultats
                </div>
                
                <div className="flex items-center space-x-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <FiChevronLeft size={16} />
                  </motion.button>
                  
                  <div className="flex space-x-1">
                    {Array.from({ length: Math.min(5, totalPages) }).map((_, idx) => {
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = idx + 1;
                      } else if (currentPage <= 3) {
                        pageNum = idx + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + idx;
                      } else {
                        pageNum = currentPage - 2 + idx;
                      }
                      
                      if (pageNum > 0 && pageNum <= totalPages) {
                        return (
                          <motion.button
                            key={pageNum}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setCurrentPage(pageNum)}
                            className={`px-3 py-2 rounded-lg transition-colors text-sm font-medium ${
                              currentPage === pageNum
                                ? 'bg-indigo-600 text-white shadow-lg'
                                : 'border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                            }`}
                          >
                            {pageNum}
                          </motion.button>
                        );
                      }
                      return null;
                    })}
                  </div>
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <FiChevronRight size={16} />
                  </motion.button>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </>
  );
};

export default UserListMain; 