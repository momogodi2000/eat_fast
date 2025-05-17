import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiUser, FiMail, FiPhone, FiMapPin, FiCalendar, FiClock, FiPackage } from 'react-icons/fi';

const UserDetailModal = ({ user, isOpen, onClose, onEdit }) => {
  const { t } = useTranslation();

  const formatDate = (date) => {
    return date ? new Intl.DateTimeFormat('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(date)) : '—';
  };

  const getStatusColor = (status) => {
    return status === 'active' 
      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
      : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
  };

  const getRoleColor = (role) => {
    switch(role) {
      case 'admin':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'livreur':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      default:
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 overflow-y-auto"
        >
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 transition-opacity"
              onClick={onClose}
            >
              <div className="absolute inset-0 bg-gray-500 dark:bg-gray-900 opacity-75"></div>
            </motion.div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>

            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
              role="dialog"
              aria-modal="true"
              aria-labelledby="modal-headline"
            >
              <div className="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                      {user.name}
                    </h3>
                    <div className="mt-1 flex items-center space-x-2">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getRoleColor(user.role)}`}>
                        {t(`userManagement.roles.${user.role}`)}
                      </span>
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(user.status)}`}>
                        {user.status === 'active' ? t('userManagement.statusActive') : t('userManagement.statusInactive')}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                  >
                    <FiX size={24} />
                  </button>
                </div>

                <div className="mt-6 space-y-4">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                      <FiUser className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                    </div>
                    <div className="ml-4">
                      <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        {t('userDetail.fullName')}
                      </h4>
                      <p className="text-sm text-gray-900 dark:text-white">
                        {user.name}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                      <FiMail className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                    </div>
                    <div className="ml-4">
                      <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        {t('userDetail.email')}
                      </h4>
                      <p className="text-sm text-gray-900 dark:text-white">
                        {user.email}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                      <FiPhone className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                    </div>
                    <div className="ml-4">
                      <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        {t('userDetail.phone')}
                      </h4>
                      <p className="text-sm text-gray-900 dark:text-white">
                        {user.phone}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                      <FiMapPin className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                    </div>
                    <div className="ml-4">
                      <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        {t('userDetail.address')}
                      </h4>
                      <p className="text-sm text-gray-900 dark:text-white">
                        {user.address}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                      <FiCalendar className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                    </div>
                    <div className="ml-4">
                      <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        {t('userDetail.registered')}
                      </h4>
                      <p className="text-sm text-gray-900 dark:text-white">
                        {formatDate(user.createdAt)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                      <FiClock className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                    </div>
                    <div className="ml-4">
                      <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        {t('userDetail.lastLogin')}
                      </h4>
                      <p className="text-sm text-gray-900 dark:text-white">
                        {user.lastLogin ? formatDate(user.lastLogin) : t('userDetail.neverLoggedIn')}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                      <FiPackage className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                    </div>
                    <div className="ml-4">
                      <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        {t('userDetail.totalOrders')}
                      </h4>
                      <p className="text-sm text-gray-900 dark:text-white">
                        {user.orders || 0}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={() => {
                    onClose();
                    onEdit();
                  }}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  {t('userDetail.editButton')}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={onClose}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-600 text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  {t('userDetail.closeButton')}
                </motion.button>
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default UserDetailModal;