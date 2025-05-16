/* eslint-disable no-unused-vars */
// UserList.jsx
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from 'react-i18next';
import { FiEdit, FiTrash2, FiUserPlus, FiSearch, FiFilter, FiUser } from 'react-icons/fi';
import { toast } from 'react-toastify';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import UserDetailsModal from './UserDetailsModal';
import UserForm from './UserForm';
import AdminLayout from '../../../../layouts/admin_layout';

// Mock data for demonstration with added createdAt field
const mockUsers = [
  { id: 1, name: 'John Doe', email: 'john@example.com', phone: '123456789', role: 'admin', status: 'active', createdAt: '2024-01-01T00:00:00Z' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', phone: '987654321', role: 'customer', status: 'active', createdAt: '2024-02-15T00:00:00Z' },
  { id: 3, name: 'Mike Johnson', email: 'mike@example.com', phone: '567891234', role: 'restaurant', status: 'active', createdAt: '2024-03-10T00:00:00Z' },
  { id: 4, name: 'Sarah Williams', email: 'sarah@example.com', phone: '456789123', role: 'delivery', status: 'inactive', createdAt: '2024-04-05T00:00:00Z' },
  { id: 5, name: 'Alex Brown', email: 'alex@example.com', phone: '321654987', role: 'customer', status: 'active', createdAt: '2024-05-01T00:00:00Z' },
];

const UserList = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const usersPerPage = 10;

  // Form validation schema
  const userSchema = yup.object().shape({
    name: yup.string().required(t('users.validation.nameRequired')),
    email: yup.string().email(t('users.validation.validEmail')).required(t('users.validation.emailRequired')),
    phone: yup.string().matches(/^[0-9]+$/, t('users.validation.validPhone')).required(t('users.validation.phoneRequired')),
    role: yup.string().required(t('users.validation.roleRequired')),
    status: yup.string().required(t('users.validation.statusRequired')),
  });

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: yupResolver(userSchema)
  });

  // Fetch users with React Query (using mock data)
  const { data: users, isLoading } = useQuery('users', async () => {
    // Simulate API call delay
    return new Promise(resolve => {
      setTimeout(() => resolve(mockUsers), 500);
    });
  });

  // Delete user mutation
  const deleteUserMutation = useMutation(
    (userId) => {
      // Simulate API call
      return new Promise(resolve => {
        setTimeout(() => resolve({ success: true }), 500);
      });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('users');
        toast.success(t('users.deleteSuccess'));
      },
      onError: () => {
        toast.error(t('users.deleteError'));
      }
    }
  );

  // Add/Edit user mutation
  const saveUserMutation = useMutation(
    (userData) => {
      // Simulate API call
      return new Promise(resolve => {
        setTimeout(() => resolve({ success: true, data: userData }), 500);
      });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('users');
        toast.success(selectedUser ? t('users.updateSuccess') : t('users.createSuccess'));
        setIsFormOpen(false);
        setSelectedUser(null);
        reset();
      },
      onError: () => {
        toast.error(selectedUser ? t('users.updateError') : t('users.createError'));
      }
    }
  );

  // Filter and paginate users
  const filteredUsers = users?.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedRole === 'all' || user.role === selectedRole;
    return matchesSearch && matchesRole;
  }) || [];

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  // Handle form submission
  const onSubmit = (data) => {
    // If editing, add the id to the data
    if (selectedUser) {
      data.id = selectedUser.id;
      data.createdAt = selectedUser.createdAt;
    } else {
      // For new users, create an id and createdAt
      data.id = Date.now();
      data.createdAt = new Date().toISOString();
    }
    saveUserMutation.mutate(data);
  };

  // Handle edit user
  const handleEdit = (user) => {
    setSelectedUser(user);
    reset(user);
    setIsFormOpen(true);
  };

  // Handle view details
  const handleViewDetails = (user) => {
    setSelectedUser(user);
    setIsDetailsOpen(true);
  };

  // Handle delete user
  const handleDelete = (userId) => {
    if (window.confirm(t('users.deleteConfirm'))) {
      deleteUserMutation.mutate(userId);
    }
  };

  // Handle new user
  const handleNewUser = () => {
    setSelectedUser(null);
    reset({
      name: '',
      email: '',
      phone: '',
      role: 'customer',
      status: 'active'
    });
    setIsFormOpen(true);
  };

  const content = (
    <div className="container mx-auto px-4 py-6 animate-fadeIn">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-green-600 via-yellow-500 to-red-600 bg-clip-text text-transparent mb-4 md:mb-0">
          {t('users.title')}
        </h1>
        
        <div className="flex flex-col md:flex-row w-full md:w-auto space-y-2 md:space-y-0 md:space-x-4">
          <button
            onClick={handleNewUser}
            className="flex items-center justify-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors duration-200"
          >
            <FiUserPlus className="mr-2" size={18} />
            {t('users.addUser')}
          </button>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-6 transition-all duration-300">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder={t('users.searchPlaceholder')}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 transition-all duration-200"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          {/* Role Filter */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiFilter className="text-gray-400" />
            </div>
            <select
              className="pl-10 pr-4 py-2 w-full border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 appearance-none transition-all duration-200"
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
            >
              <option value="all">{t('users.allRoles')}</option>
              <option value="admin">{t('users.admin')}</option>
              <option value="restaurant">{t('users.restaurant')}</option>
              <option value="delivery">{t('users.delivery')}</option>
              <option value="customer">{t('users.customer')}</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-all duration-300">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {t('users.name')}
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {t('users.email')}
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {t('users.phone')}
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {t('users.role')}
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {t('users.status')}
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {t('users.actions')}
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {isLoading ? (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                    {t('loading')}...
                  </td>
                </tr>
              ) : currentUsers.length > 0 ? (
                currentUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gradient-to-r from-green-600 via-yellow-500 to-red-600 flex items-center justify-center">
                          <span className="text-white font-medium">
                            {user.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {user.name}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            ID: {user.id}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      {user.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      {user.phone}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        user.role === 'admin' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' :
                        user.role === 'restaurant' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                        user.role === 'delivery' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                        'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      }`}>
                        {user.role === 'admin' ? t('users.admin') :
                         user.role === 'restaurant' ? t('users.restaurant') :
                         user.role === 'delivery' ? t('users.delivery') : t('users.customer')}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        user.status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                        'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                      }`}>
                        {user.status === 'active' ? t('users.active') : t('users.inactive')}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => handleViewDetails(user)}
                          className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 transition-colors duration-200"
                          title={t('users.viewDetails')}
                        >
                          <FiUser size={18} />
                        </button>
                        <button
                          onClick={() => handleEdit(user)}
                          className="text-yellow-600 hover:text-yellow-900 dark:text-yellow-400 dark:hover:text-yellow-300 transition-colors duration-200"
                          title={t('users.edit')}
                        >
                          <FiEdit size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(user.id)}
                          className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 transition-colors duration-200"
                          title={t('users.delete')}
                        >
                          <FiTrash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                    {t('users.noUsersFound')}
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
                  {t('users.showing')} <span className="font-medium">{indexOfFirstUser + 1}</span> {t('users.to')} <span className="font-medium">
                    {Math.min(indexOfLastUser, filteredUsers.length)}
                  </span> {t('users.of')} <span className="font-medium">{filteredUsers.length}</span> {t('users.results')}
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 dark:border-gray-600 text-sm font-medium ${
                      currentPage === 1 ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed' : 
                      'bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                  >
                    <span className="sr-only">{t('users.previous')}</span>
                    &larr;
                  </button>
                  
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium ${
                        page === currentPage ? 
                        'z-10 bg-green-50 dark:bg-green-900 border-green-500 dark:border-green-600 text-green-600 dark:text-green-300' : 
                        'bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                  
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 dark:border-gray-600 text-sm font-medium ${
                      currentPage === totalPages ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed' : 
                      'bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                  >
                    <span className="sr-only">{t('users.next')}</span>
                    &rarr;
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* User Form Modal */}
      <UserForm 
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setSelectedUser(null);
          reset();
        }}
        onSubmit={handleSubmit(onSubmit)}
        register={register}
        errors={errors}
        selectedUser={selectedUser}
        isLoading={saveUserMutation.isLoading}
        t={t}
      />

      {/* User Details Modal */}
      <UserDetailsModal 
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        user={selectedUser}
        t={t}
      />
    </div>
  );

  return (
    <AdminLayout>
      {content}
    </AdminLayout>
  );
};

export default UserList;