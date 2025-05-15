import React from 'react';
import { FiX, FiEdit, FiClock, FiMail, FiPhone, FiUser, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';
import { FaUserShield, FaUserTie, FaMotorcycle } from 'react-icons/fa';

const UserDetailsModal = ({ isOpen, onClose, user, t }) => {
  if (!isOpen || !user) return null;

  const getRoleIcon = () => {
    switch(user.role) {
      case 'admin':
        return <FaUserShield className="text-purple-600 dark:text-purple-400" size={24} />;
      case 'restaurant':
        return <FaUserTie className="text-blue-600 dark:text-blue-400" size={24} />;
      case 'delivery':
        return <FaMotorcycle className="text-yellow-600 dark:text-yellow-400" size={24} />;
      default:
        return <FiUser className="text-green-600 dark:text-green-400" size={24} />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 dark:bg-gray-900 opacity-75" onClick={onClose}></div>
        </div>
        
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        
        <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="flex justify-between items-start">
              <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                {t('users.userDetails')}
              </h3>
              <button
                type="button"
                className="bg-white dark:bg-gray-800 rounded-md text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 focus:outline-none"
                onClick={onClose}
              >
                <FiX size={24} />
              </button>
            </div>
            
            <div className="mt-6">
              <div className="flex items-center justify-center mb-6">
                <div className="relative">
                  <div className="h-24 w-24 rounded-full bg-gradient-to-r from-green-600 via-yellow-500 to-red-600 flex items-center justify-center">
                    <span className="text-white text-3xl font-bold">
                      {user.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="absolute -bottom-2 -right-2 bg-white dark:bg-gray-700 p-1 rounded-full shadow-md">
                    {getRoleIcon()}
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                {/* Name */}
                <div className="flex items-start">
                  <div className="flex-shrink-0 pt-1">
                    <FiUser className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      {t('users.name')}
                    </p>
                    <p className="text-sm text-gray-900 dark:text-white">
                      {user.name}
                    </p>
                  </div>
                </div>
                
                {/* Email */}
                <div className="flex items-start">
                  <div className="flex-shrink-0 pt-1">
                    <FiMail className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      {t('users.email')}
                    </p>
                    <p className="text-sm text-gray-900 dark:text-white">
                      {user.email}
                    </p>
                  </div>
                </div>
                
                {/* Phone */}
                <div className="flex items-start">
                  <div className="flex-shrink-0 pt-1">
                    <FiPhone className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      {t('users.phone')}
                    </p>
                    <p className="text-sm text-gray-900 dark:text-white">
                      {user.phone}
                    </p>
                  </div>
                </div>
                
                {/* Role */}
                <div className="flex items-start">
                  <div className="flex-shrink-0 pt-1">
                    {getRoleIcon()}
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      {t('users.role')}
                    </p>
                    <p className="text-sm text-gray-900 dark:text-white">
                      {user.role === 'admin' ? t('users.admin') :
                       user.role === 'restaurant' ? t('users.restaurant') :
                       user.role === 'delivery' ? t('users.delivery') : t('users.customer')}
                    </p>
                  </div>
                </div>
                
                {/* Status */}
                <div className="flex items-start">
                  <div className="flex-shrink-0 pt-1">
                    {user.status === 'active' ? (
                      <FiCheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <FiAlertCircle className="h-5 w-5 text-red-500" />
                    )}
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      {t('users.status')}
                    </p>
                    <p className={`text-sm ${
                      user.status === 'active' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                    }`}>
                      {user.status === 'active' ? t('users.active') : t('users.inactive')}
                    </p>
                  </div>
                </div>
                
                {/* Created At */}
                <div className="flex items-start">
                  <div className="flex-shrink-0 pt-1">
                    <FiClock className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      {t('users.createdAt')}
                    </p>
                    <p className="text-sm text-gray-900 dark:text-white">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              onClick={onClose}
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-off