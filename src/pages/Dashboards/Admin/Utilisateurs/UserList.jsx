import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import AdminLayout from '../../../../layouts/admin_layout';
import { 
  FiEdit2, 
  FiTrash2, 
  FiSearch, 
  FiUserPlus, 
  FiFilter, 
  FiDownload, 
  FiEye, 
  FiChevronLeft, 
  FiChevronRight,
  FiRefreshCw
} from 'react-icons/fi';
import UserForm from './UserForm';
import UserDetailModal from './UserDetailsModal';
import { motion } from 'framer-motion';

const UserListPage = () => {
  const { t } = useTranslation();
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(10);
  const [sortConfig, setSortConfig] = useState({ key: 'createdAt', direction: 'desc' });
  const [selectedUser, setSelectedUser] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');

  // Fetch users data (mock data for now)
  const fetchUsers = useCallback(() => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      const mockUsers = Array(32).fill().map((_, index) => ({
        id: index + 1,
        name: `Utilisateur ${index + 1}`,
        email: `user${index + 1}@example.com`,
        phone: `+237 ${Math.floor(Math.random() * 10000000) + 60000000}`,
        role: index % 5 === 0 ? 'admin' : index % 3 === 0 ? 'livreur' : 'client',
        status: index % 4 === 0 ? 'inactive' : 'active',
        createdAt: new Date(Date.now() - Math.floor(Math.random() * 10000000000)),
        lastLogin: index % 7 === 0 ? null : new Date(Date.now() - Math.floor(Math.random() * 1000000000)),
        address: `Quartier ${index % 10 + 1}, ${index % 2 === 0 ? 'Douala' : 'Yaoundé'}, Cameroun`,
        orders: Math.floor(Math.random() * 50),
      }));
      setUsers(mockUsers);
      setFilteredUsers(mockUsers);
      setIsLoading(false);
    }, 800);
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Apply filters and search
  useEffect(() => {
    let result = [...users];
    
    // Apply status filter
    if (filterStatus !== 'all') {
      result = result.filter(user => user.status === filterStatus);
    }
    
    // Apply search
    if (searchTerm) {
      const searchTermLower = searchTerm.toLowerCase();
      result = result.filter(
        user =>
          user.name.toLowerCase().includes(searchTermLower) ||
          user.email.toLowerCase().includes(searchTermLower) ||
          user.phone.toLowerCase().includes(searchTermLower) ||
          user.role.toLowerCase().includes(searchTermLower)
      );
    }
    
    // Apply sorting
    if (sortConfig.key) {
      result.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    
    setFilteredUsers(result);
    setCurrentPage(1); // Reset to first page when filters change
  }, [users, searchTerm, sortConfig, filterStatus]);

  // Get current users for pagination
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Sort function
  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Handle actions
  const handleViewUser = (user) => {
    setSelectedUser(user);
    setIsDetailModalOpen(true);
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setIsFormOpen(true);
  };

  const handleDeleteUser = (userId) => {
    if (window.confirm(t('deleteUserConfirmation'))) {
      // Simulate delete action
      setUsers(users.filter(user => user.id !== userId));
    }
  };

  const handleAddUser = () => {
    setSelectedUser(null);
    setIsFormOpen(true);
  };

  const formatDate = (date) => {
    return date ? new Intl.DateTimeFormat('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(date)) : '—';
  };

  const handleExportCSV = () => {
    // Function to export user data as CSV
    const headers = ['ID', 'Nom', 'Email', 'Téléphone', 'Rôle', 'Statut', 'Date Création', 'Dernière Connexion'];
    const data = filteredUsers.map(user => [
      user.id,
      user.name,
      user.email,
      user.phone,
      user.role,
      user.status,
      formatDate(user.createdAt),
      formatDate(user.lastLogin)
    ]);
    
    const csvContent = [
      headers.join(','),
      ...data.map(row => row.join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `utilisateurs_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleFormSubmit = (userData) => {
    if (selectedUser) {
      // Update existing user
      setUsers(users.map(user => user.id === selectedUser.id ? { ...user, ...userData } : user));
    } else {
      // Add new user
      setUsers([...users, { 
        id: users.length + 1, 
        ...userData,
        createdAt: new Date(),
        lastLogin: null,
        orders: 0
      }]);
    }
    setIsFormOpen(false);
  };

  return (
    <AdminLayout>
      <div className="flex flex-col h-full">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex flex-col md:flex-row md:items-center md:justify-between mb-6"
        >
          <h1 className="text-2xl font-bold mb-4 md:mb-0">
            {t('userManagement.title')}
          </h1>
          <div className="flex flex-wrap gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleAddUser}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg shadow-lg hover:bg-green-700 transition-all duration-200"
            >
              <FiUserPlus className="mr-2" />
              {t('userManagement.addUser')}
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleExportCSV}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700 transition-all duration-200"
            >
              <FiDownload className="mr-2" />
              {t('userManagement.export')}
            </motion.button>
          </div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden transform perspective-1000 transition-all duration-300 hover:shadow-xl"
          style={{
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            transform: 'perspective(1000px) rotateX(0deg)'
          }}
        >
          {/* Filters and Search */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiSearch className="text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder={t('userManagement.search')}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white dark:bg-gray-700 dark:text-white transition-colors duration-200"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div className="flex items-center gap-2">
                <div className="flex items-center">
                  <FiFilter className="mr-2 text-gray-500 dark:text-gray-400" />
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="form-select rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 focus:ring-2 focus:ring-green-500 transition-shadow duration-200 pr-8"
                  >
                    <option value="all">{t('userManagement.statusAll')}</option>
                    <option value="active">{t('userManagement.statusActive')}</option>
                    <option value="inactive">{t('userManagement.statusInactive')}</option>
                  </select>
                </div>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={fetchUsers}
                  className="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
                  aria-label="Refresh"
                >
                  <FiRefreshCw className={`${isLoading ? 'animate-spin' : ''} text-gray-600 dark:text-gray-300`} />
                </motion.button>
              </div>
            </div>
          </div>
          
          {/* Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                    onClick={() => requestSort('id')}
                  >
                    <div className="flex items-center">
                      {t('userManagement.id')}
                      {sortConfig.key === 'id' && (
                        <span className="ml-1">{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
                      )}
                    </div>
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                    onClick={() => requestSort('name')}
                  >
                    <div className="flex items-center">
                      {t('userManagement.name')}
                      {sortConfig.key === 'name' && (
                        <span className="ml-1">{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
                      )}
                    </div>
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                    onClick={() => requestSort('email')}
                  >
                    <div className="flex items-center">
                      {t('userManagement.email')}
                      {sortConfig.key === 'email' && (
                        <span className="ml-1">{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
                      )}
                    </div>
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                    onClick={() => requestSort('role')}
                  >
                    <div className="flex items-center">
                      {t('userManagement.role')}
                      {sortConfig.key === 'role' && (
                        <span className="ml-1">{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
                      )}
                    </div>
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                    onClick={() => requestSort('status')}
                  >
                    <div className="flex items-center">
                      {t('userManagement.status')}
                      {sortConfig.key === 'status' && (
                        <span className="ml-1">{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
                      )}
                    </div>
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                    onClick={() => requestSort('createdAt')}
                  >
                    <div className="flex items-center">
                      {t('userManagement.registered')}
                      {sortConfig.key === 'createdAt' && (
                        <span className="ml-1">{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
                      )}
                    </div>
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    {t('userManagement.actions')}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {isLoading ? (
                  // Loading skeleton
                  Array(usersPerPage).fill().map((_, index) => (
                    <tr key={`skeleton-${index}`} className="animate-pulse">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-10"></div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-24"></div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-32"></div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-16"></div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-16"></div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-24"></div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-20 ml-auto"></div>
                      </td>
                    </tr>
                  ))
                ) : currentUsers.length > 0 ? (
                  currentUsers.map((user) => (
                    <motion.tr 
                      key={user.id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2 }}
                      whileHover={{ 
                        backgroundColor: 'rgba(0, 0, 0, 0.05)',
                        transition: { duration: 0.1 }
                      }}
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{user.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">{user.name}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">{user.phone}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{user.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${user.role === 'admin' 
                            ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' 
                            : user.role === 'livreur' 
                              ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' 
                              : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'}`}
                        >
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${user.status === 'active' 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                            : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'}`}
                        >
                          {user.status === 'active' ? t('userManagement.statusActive') : t('userManagement.statusInactive')}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {formatDate(user.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end gap-2">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleViewUser(user)}
                            className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-200 transition-colors duration-200"
                            aria-label="View details"
                          >
                            <FiEye size={18} />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleEditUser(user)}
                            className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-200 transition-colors duration-200"
                            aria-label="Edit"
                          >
                            <FiEdit2 size={18} />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleDeleteUser(user.id)}
                            className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-200 transition-colors duration-200"
                            aria-label="Delete"
                          >
                            <FiTrash2 size={18} />
                          </motion.button>
                        </div>
                      </td>
                    </motion.tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                      {t('userManagement.noUsers')}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          {filteredUsers.length > 0 && (
            <div className="bg-white dark:bg-gray-800 px-4 py-3 flex items-center justify-between border-t border-gray-200 dark:border-gray-700 sm:px-6">
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    {t('userManagement.showing')} <span className="font-medium">{indexOfFirstUser + 1}</span> {t('userManagement.to')} <span className="font-medium">{Math.min(indexOfLastUser, filteredUsers.length)}</span> {t('userManagement.of')} <span className="font-medium">{filteredUsers.length}</span> {t('userManagement.results')}
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                    <button
                      onClick={() => paginate(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium ${
                        currentPage === 1 
                        ? 'text-gray-300 dark:text-gray-600 cursor-not-allowed' 
                        : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                      }`}
                    >
                      <span className="sr-only">{t('userManagement.previous')}</span>
                      <FiChevronLeft className="h-5 w-5" aria-hidden="true" />
                    </button>
                    
                    {/* Page numbers */}
                    {Array.from({ length: Math.min(5, totalPages) }).map((_, idx) => {
                      let pageNum;
                      
                      // Logic to show appropriate page numbers based on current page
                      if (totalPages <= 5) {
                        pageNum = idx + 1;
                      } else if (currentPage <= 3) {
                        pageNum = idx + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + idx;
                      } else {
                        pageNum = currentPage - 2 + idx;
                      }
                      
                      // Only show if pageNum is valid
                      if (pageNum > 0 && pageNum <= totalPages) {
                        return (
                          <button
                            key={pageNum}
                            onClick={() => paginate(pageNum)}
                            className={`relative inline-flex items-center px-4 py-2 border ${
                              currentPage === pageNum
                                ? 'z-10 bg-green-50 dark:bg-green-900 border-green-500 dark:border-green-600 text-green-600 dark:text-green-300'
                                : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                            } text-sm font-medium`}
                          >
                            {pageNum}
                          </button>
                        );
                      }
                      return null;
                    })}
                    
                    <button
                      onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                      className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium ${
                        currentPage === totalPages 
                        ? 'text-gray-300 dark:text-gray-600 cursor-not-allowed' 
                        : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                      }`}
                    >
                      <span className="sr-only">{t('userManagement.next')}</span>
                      <FiChevronRight className="h-5 w-5" aria-hidden="true" />
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
      
      {/* User Form Modal */}
      {isFormOpen && (
        <UserForm 
          user={selectedUser} 
          isOpen={isFormOpen} 
          onClose={() => setIsFormOpen(false)}
          onSubmit={handleFormSubmit}
        />
      )}
      
      {/* User Detail Modal */}
      {isDetailModalOpen && selectedUser && (
        <UserDetailModal 
          user={selectedUser} 
          isOpen={isDetailModalOpen} 
          onClose={() => setIsDetailModalOpen(false)}
          onEdit={() => {
            setIsDetailModalOpen(false);
            setIsFormOpen(true);
          }}
          />
        )}
      </AdminLayout>
    );
  };
  
  export default UserListPage;