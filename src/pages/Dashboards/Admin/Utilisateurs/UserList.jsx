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
  FiPlus, FiSettings, FiBarChart2
} from 'react-icons/fi';

// Import the three separate components
import UserListMain from './UserListMain';
import UserFormPage from './UserFormPage';
import UserDetailsPage from './UserDetailsPage';

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

const DOCUMENT_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved', 
  REJECTED: 'rejected',
  NEEDS_REVIEW: 'needs_review'
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

const UserListPage = () => {
  const isOnline = useOnlineStatus();
  const { notification, showNotification, hideNotification } = useNotification();

  // State management
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(10);
  const [isLoading, setIsLoading] = useState(false);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  // Modal states
  const [selectedUser, setSelectedUser] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isDocumentModalOpen, setIsDocumentModalOpen] = useState(false);

  // Mock data for demonstration
  useEffect(() => {
    const mockUsers = [
      {
        id: 1,
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@example.com',
        phone_number: '+237 123 456 789',
        role: USER_ROLES.CLIENT,
        status: USER_STATUS.ACTIVE,
        city: 'Douala',
        address: '123 Main Street',
        createdAt: '2024-01-15T10:30:00Z',
        lastLoginAt: '2024-01-20T14:45:00Z',
        emailVerified: true,
        totalOrders: 15,
        totalSpent: 1250,
        rating: 4.5,
        daysActive: 45,
        documents: {}
      },
      {
        id: 2,
        first_name: 'Jane',
        last_name: 'Smith',
        email: 'jane.smith@example.com',
        phone_number: '+237 987 654 321',
        role: USER_ROLES.RESTAURANT_MANAGER,
        status: USER_STATUS.PENDING,
        city: 'Yaoundé',
        address: '456 Restaurant Ave',
        createdAt: '2024-01-10T09:15:00Z',
        lastLoginAt: null,
        emailVerified: false,
        totalOrders: 0,
        totalSpent: 0,
        rating: 0,
        daysActive: 10,
        documents: {
          business_license: {
            name: 'business_license.pdf',
            size: 2048576,
            status: DOCUMENT_STATUS.PENDING,
            uploadedAt: '2024-01-12T11:20:00Z',
            url: '#'
          }
        }
      },
      {
        id: 3,
        first_name: 'Mike',
        last_name: 'Johnson',
        email: 'mike.johnson@example.com',
        phone_number: '+237 555 123 456',
        role: USER_ROLES.DELIVERY_AGENT,
        status: USER_STATUS.ACTIVE,
        city: 'Bamenda',
        address: '789 Delivery St',
        createdAt: '2024-01-05T16:20:00Z',
        lastLoginAt: '2024-01-20T08:30:00Z',
        emailVerified: true,
        totalOrders: 0,
        totalSpent: 0,
        rating: 4.8,
        daysActive: 15,
        documents: {
          driving_license: {
            name: 'driving_license.pdf',
            size: 1024000,
            status: DOCUMENT_STATUS.APPROVED,
            uploadedAt: '2024-01-05T16:20:00Z'
          }
        }
      }
    ];
    
    setUsers(mockUsers);
    setFilteredUsers(mockUsers);
  }, []);

  // Filter users based on search and filters
  useEffect(() => {
    let filtered = users.filter(user => {
      const searchLower = searchTerm.toLowerCase();
      return (
        user.first_name.toLowerCase().includes(searchLower) ||
        user.last_name.toLowerCase().includes(searchLower) ||
        user.email.toLowerCase().includes(searchLower) ||
        user.phone_number.includes(searchTerm)
      );
    });

    // Role filter
    if (selectedRole !== 'all') {
      filtered = filtered.filter(user => user.role === selectedRole);
    }

    // Status filter
    if (selectedStatus !== 'all') {
      filtered = filtered.filter(user => user.status === selectedStatus);
    }

    setFilteredUsers(filtered);
    setCurrentPage(1);
  }, [users, searchTerm, selectedRole, selectedStatus]);

  // Fetch users (mock implementation)
  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      showNotification('Utilisateurs mis à jour', 'success');
    } catch (error) {
      showNotification('Erreur lors du chargement des utilisateurs', 'error');
    } finally {
      setIsLoading(false);
    }
  }, [showNotification]);

  // Handle user actions
  const handleUserAction = useCallback(async (action, user) => {
    switch (action) {
      case 'view':
        setSelectedUser(user);
        setIsDetailModalOpen(true);
        break;
      case 'edit':
        setSelectedUser(user);
        setIsFormOpen(true);
        break;
      case 'delete':
        if (window.confirm(`Êtes-vous sûr de vouloir supprimer ${user.first_name} ${user.last_name} ?`)) {
          setUsers(prev => prev.filter(u => u.id !== user.id));
          showNotification('Utilisateur supprimé avec succès', 'success');
        }
        break;
      case 'documents':
        setSelectedUser(user);
        setIsDocumentModalOpen(true);
        break;
      default:
        break;
    }
  }, [showNotification]);

  // Handle form submission
  const handleFormSubmit = useCallback(async (userData) => {
    try {
      if (selectedUser) {
        // Update existing user
        setUsers(prev => prev.map(user => 
          user.id === selectedUser.id ? { ...user, ...userData } : user
        ));
        showNotification('Utilisateur mis à jour avec succès', 'success');
      } else {
        // Create new user
        const newUser = {
          id: Date.now(),
          ...userData,
          createdAt: new Date().toISOString(),
          emailVerified: false,
          totalOrders: 0,
          totalSpent: 0,
          rating: 0,
          daysActive: 0
        };
        setUsers(prev => [...prev, newUser]);
        showNotification('Utilisateur créé avec succès', 'success');
      }
    } catch (error) {
      showNotification('Erreur lors de l\'enregistrement', 'error');
    }
  }, [selectedUser, showNotification]);

  // Export to CSV
  const exportToCSV = useCallback(() => {
    const headers = ['ID', 'Prénom', 'Nom', 'Email', 'Téléphone', 'Rôle', 'Statut', 'Ville', 'Date d\'inscription'];
    const csvContent = [
      headers.join(','),
      ...filteredUsers.map(user => [
        user.id,
        user.first_name,
        user.last_name,
        user.email,
        user.phone_number,
        user.role,
        user.status,
        user.city,
        new Date(user.createdAt).toLocaleDateString('fr-FR')
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `utilisateurs_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    showNotification('Export CSV réussi', 'success');
  }, [filteredUsers, showNotification]);

  // Handle add user
  const handleAddUser = useCallback(() => {
    setSelectedUser(null);
    setIsFormOpen(true);
  }, []);

  // Calculate statistics
  const stats = useMemo(() => {
    const totalUsers = users.length;
    const activeUsers = users.filter(u => u.status === USER_STATUS.ACTIVE).length;
    const pendingUsers = users.filter(u => u.status === USER_STATUS.PENDING).length;
    const clients = users.filter(u => u.role === USER_ROLES.CLIENT).length;
    const restaurants = users.filter(u => u.role === USER_ROLES.RESTAURANT_MANAGER).length;
    const deliveryAgents = users.filter(u => u.role === USER_ROLES.DELIVERY_AGENT).length;
    const supportAgents = users.filter(u => u.role === USER_ROLES.AGENT_SUPPORT).length;

    return {
      totalUsers,
      activeUsers,
      pendingUsers,
      clients,
      restaurants,
      deliveryAgents,
      supportAgents,
      activePercentage: totalUsers > 0 ? Math.round((activeUsers / totalUsers) * 100) : 0
    };
  }, [users]);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Gestion des Utilisateurs
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Gérez tous les utilisateurs de la plateforme
          </p>
        </div>
        <div className="flex items-center space-x-4 mt-4 sm:mt-0">
          <button
            onClick={fetchUsers}
            disabled={isLoading}
            className="flex items-center space-x-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
          >
            <FiRefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />
            <span>Actualiser</span>
          </button>
          <button
            onClick={handleAddUser}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            <FiPlus size={16} />
            <span>Ajouter Utilisateur</span>
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Utilisateurs"
          value={stats.totalUsers}
          icon={FiUsers}
          color="blue"
        />
        <StatCard
          title="Utilisateurs Actifs"
          value={stats.activeUsers}
          percentage={stats.activePercentage}
          icon={FiCheckCircle}
          color="green"
        />
        <StatCard
          title="En Attente"
          value={stats.pendingUsers}
          icon={FiClock}
          color="orange"
        />
        <StatCard
          title="Clients"
          value={stats.clients}
          icon={FiUser}
          color="purple"
        />
      </div>

      {/* Role Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Répartition par Rôle
          </h3>
          <div className="space-y-4">
            <RoleStat label="Clients" value={stats.clients} total={stats.totalUsers} color="blue" />
            <RoleStat label="Restaurants" value={stats.restaurants} total={stats.totalUsers} color="green" />
            <RoleStat label="Livreurs" value={stats.deliveryAgents} total={stats.totalUsers} color="orange" />
            <RoleStat label="Support" value={stats.supportAgents} total={stats.totalUsers} color="purple" />
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Actions Rapides
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <QuickActionButton
              icon={FiUserPlus}
              label="Ajouter Utilisateur"
              onClick={handleAddUser}
              color="blue"
            />
            <QuickActionButton
              icon={FiDownload}
              label="Exporter CSV"
              onClick={exportToCSV}
              color="green"
            />
            <QuickActionButton
              icon={FiBarChart2}
              label="Statistiques"
              onClick={() => {}}
              color="purple"
            />
            <QuickActionButton
              icon={FiSettings}
              label="Paramètres"
              onClick={() => {}}
              color="orange"
            />
          </div>
        </div>
      </div>

      {/* Offline Indicator */}
      <AnimatePresence>
        {!isOnline && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="bg-red-500 text-white px-4 py-3 rounded-lg shadow-lg"
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

      {/* Main User List Component */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl">
        <UserListMain
          users={users}
          filteredUsers={filteredUsers}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedRole={selectedRole}
          setSelectedRole={setSelectedRole}
          selectedStatus={selectedStatus}
          setSelectedStatus={setSelectedStatus}
          isLoading={isLoading}
          fetchUsers={fetchUsers}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          usersPerPage={usersPerPage}
          onUserAction={handleUserAction}
          onExportCSV={exportToCSV}
          onAddUser={handleAddUser}
        />
      </div>

      {/* User Form Modal */}
      <UserFormPage
        user={selectedUser}
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setSelectedUser(null);
        }}
        onSubmit={handleFormSubmit}
        showNotification={showNotification}
      />

      {/* User Details Modal */}
      <UserDetailsPage
        user={selectedUser}
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedUser(null);
        }}
        onEdit={(user) => {
          setIsDetailModalOpen(false);
          setSelectedUser(user);
          setIsFormOpen(true);
        }}
        onDocumentReview={(user) => {
          setIsDetailModalOpen(false);
          setSelectedUser(user);
          setIsDocumentModalOpen(true);
        }}
              />
      </div>
  );
};

// Stat Card Component
const StatCard = ({ title, value, percentage, icon: Icon, color }) => {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400',
    green: 'bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400',
    purple: 'bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400',
    orange: 'bg-orange-50 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400',
    red: 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400'
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all duration-300 border border-gray-100 dark:border-gray-700">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{value}</p>
          {percentage !== undefined && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{percentage}%</p>
          )}
        </div>
        <div className={`p-3 rounded-xl ${colorClasses[color]}`}>
          <Icon size={24} />
        </div>
      </div>
    </div>
  );
};

// Role Stat Component
const RoleStat = ({ label, value, total, color }) => {
  const percentage = total > 0 ? Math.round((value / total) * 100) : 0;
  const colorClasses = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    orange: 'bg-orange-500',
    purple: 'bg-purple-500'
  };

  return (
    <div className="flex items-center justify-between">
      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</span>
      <div className="flex items-center space-x-3">
        <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div 
            className={`h-2 rounded-full ${colorClasses[color]}`}
            style={{ width: `${percentage}%` }}
          />
        </div>
        <span className="text-sm font-medium text-gray-900 dark:text-white w-8 text-right">
          {value}
        </span>
      </div>
    </div>
  );
};

// Quick Action Button Component
const QuickActionButton = ({ icon: Icon, label, onClick, color }) => {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:hover:bg-blue-900/40',
    green: 'bg-green-50 text-green-600 hover:bg-green-100 dark:bg-green-900/20 dark:text-green-400 dark:hover:bg-green-900/40',
    orange: 'bg-orange-50 text-orange-600 hover:bg-orange-100 dark:bg-orange-900/20 dark:text-orange-400 dark:hover:bg-orange-900/40',
    purple: 'bg-purple-50 text-purple-600 hover:bg-purple-100 dark:bg-purple-900/20 dark:text-purple-400 dark:hover:bg-purple-900/40'
  };

  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center justify-center p-4 rounded-xl transition-all duration-200 ${colorClasses[color]}`}
    >
      <Icon size={24} className="mb-2" />
      <span className="text-sm font-medium text-center">{label}</span>
    </button>
  );
};

export default UserListPage;