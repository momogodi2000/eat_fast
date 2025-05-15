import React from 'react';
import { FiX, FiSave } from 'react-icons/fi';
import { FaUserShield, FaUserTie, FaUser, FaMotorcycle } from 'react-icons/fa';

const UserForm = ({ isOpen, onClose, onSubmit, register, errors, selectedUser, isLoading, t }) => {
  if (!isOpen) return null;

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
                {selectedUser ? t('users.editUser') : t('users.addUser')}
              </h3>
              <button
                type="button"
                className="bg-white dark:bg-gray-800 rounded-md text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 focus:outline-none"
                onClick={onClose}
              >
                <FiX size={24} />
              </button>
            </div>
            
            <form onSubmit={onSubmit} className="mt-4">
              <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                {/* Name */}
                <div className="sm:col-span-6">
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    {t('users.name')} *
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      id="name"
                      name="name"
                      {...register('name')}
                      className={`block w-full rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm ${
                        errors.name ? 'border-red-300' : 'border-gray-300 dark:border-gray-600'
                      } ${errors.name ? 'bg-red-50 dark:bg-red-900/20' : 'bg-white dark:bg-gray-700'}`}
                    />
                    {errors.name && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.name.message}</p>
                    )}
                  </div>
                </div>
                
                {/* Email */}
                <div className="sm:col-span-6">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    {t('users.email')} *
                  </label>
                  <div className="mt-1">
                    <input
                      type="email"
                      id="email"
                      name="email"
                      {...register('email')}
                      className={`block w-full rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm ${
                        errors.email ? 'border-red-300' : 'border-gray-300 dark:border-gray-600'
                      } ${errors.email ? 'bg-red-50 dark:bg-red-900/20' : 'bg-white dark:bg-gray-700'}`}
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.email.message}</p>
                    )}
                  </div>
                </div>
                
                {/* Phone */}
                <div className="sm:col-span-6">
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    {t('users.phone')} *
                  </label>
                  <div className="mt-1">
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      {...register('phone')}
                      className={`block w-full rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm ${
                        errors.phone ? 'border-red-300' : 'border-gray-300 dark:border-gray-600'
                      } ${errors.phone ? 'bg-red-50 dark:bg-red-900/20' : 'bg-white dark:bg-gray-700'}`}
                    />
                    {errors.phone && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.phone.message}</p>
                    )}
                  </div>
                </div>
                
                {/* Role */}
                <div className="sm:col-span-6">
                  <label htmlFor="role" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    {t('users.role')} *
                  </label>
                  <div className="mt-1">
                    <select
                      id="role"
                      name="role"
                      {...register('role')}
                      className={`block w-full rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm ${
                        errors.role ? 'border-red-300' : 'border-gray-300 dark:border-gray-600'
                      } ${errors.role ? 'bg-red-50 dark:bg-red-900/20' : 'bg-white dark:bg-gray-700'}`}
                    >
                      <option value="customer">
                        <div className="flex items-center">
                          <FaUser className="mr-2" />
                          {t('users.customer')}
                        </div>
                      </option>
                      <option value="restaurant">
                        <div className="flex items-center">
                          <FaUserTie className="mr-2" />
                          {t('users.restaurant')}
                        </div>
                      </option>
                      <option value="delivery">
                        <div className="flex items-center">
                          <FaMotorcycle className="mr-2" />
                          {t('users.delivery')}
                        </div>
                      </option>
                      <option value="admin">
                        <div className="flex items-center">
                          <FaUserShield className="mr-2" />
                          {t('users.admin')}
                        </div>
                      </option>
                    </select>
                    {errors.role && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.role.message}</p>
                    )}
                  </div>
                </div>
                
                {/* Status */}
                <div className="sm:col-span-6">
                  <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    {t('users.status')} *
                  </label>
                  <div className="mt-1">
                    <select
                      id="status"
                      name="status"
                      {...register('status')}
                      className={`block w-full rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm ${
                        errors.status ? 'border-red-300' : 'border-gray-300 dark:border-gray-600'
                      } ${errors.status ? 'bg-red-50 dark:bg-red-900/20' : 'bg-white dark:bg-gray-700'}`}
                    >
                      <option value="active">{t('users.active')}</option>
                      <option value="inactive">{t('users.inactive')}</option>
                    </select>
                    {errors.status && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.status.message}</p>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="inline-flex justify-center py-2 px-4 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200"
                >
                  {t('users.cancel')}
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200 disabled:opacity-75 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      {t('users.saving')}
                    </span>
                  ) : (
                    <span className="flex items-center">
                      <FiSave className="mr-2" size={16} />
                      {selectedUser ? t('users.update') : t('users.save')}
                    </span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserForm;