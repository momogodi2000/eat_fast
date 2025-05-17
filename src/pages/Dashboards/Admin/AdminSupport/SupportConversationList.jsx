import React from 'react';
import { FiMessageCircle, FiRefreshCw, FiSearch, FiBell, FiInfo, FiArrowRightCircle } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

const SupportConversationList = ({
  conversations,
  activeConversation,
  searchInput,
  setSearchInput,
  filterStatus,
  setFilterStatus,
  filterOptions,
  notifications,
  showNotification,
  setShowNotification,
  formatTimestamp,
  getStatusColor,
  getPriorityColor,
  handleConversationSelect,
  setActiveConversation,
  setShowSidebar,
  showSidebar,
  isMobile,
  t
}) => {
  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b dark:border-gray-700">
        <div className="flex items-center mb-4">
          <div className="flex-1">
            <h2 className="text-lg font-semibold">{t('conversations')}</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {conversations.length} {t('totalConversations')}
            </p>
          </div>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowSidebar(!showSidebar)}
            className="md:hidden p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-300"
          >
            <FiArrowRightCircle size={20} />
          </motion.button>
        </div>
        
        <div className="relative mb-4">
          <input
            type="text"
            placeholder={t('searchConversations')}
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <FiSearch className="absolute left-3 top-2.5 text-gray-400" size={20} />
        </div>
        
        <div className="flex space-x-2 mb-2">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="flex-1 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            {filterOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setActiveConversation(null)}
              className="px-3 py-1.5 text-sm bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-100 rounded-lg hover:bg-green-200 dark:hover:bg-green-700 focus:outline-none transition-colors"
            >
              <FiRefreshCw size={14} className="mr-1 inline" />
              {t('refresh')}
            </button>
            <button
              onClick={() => setShowNotification(!showNotification)}
              className="relative p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none"
            >
              <FiBell size={18} className="text-gray-600 dark:text-gray-300" />
              {notifications.filter(n => !n.read).length > 0 && (
                <span className="absolute top-0 right-0 block w-2 h-2 rounded-full bg-red-500" />
              )}
            </button>
          </div>
        </div>
      </div>
      
      <div className="overflow-y-auto flex-1">
        <AnimatePresence>
          {showNotification && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mx-4 mt-2 p-3 bg-blue-50 dark:bg-blue-900 rounded-lg border-l-4 border-blue-500"
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <FiInfo className="text-blue-500 mr-2" size={18} />
                  <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                    {notifications[0]?.message || t('newNotification')}
                  </span>
                </div>
                <button 
                  onClick={() => setShowNotification(false)}
                  className="text-blue-700 dark:text-blue-300 hover:text-blue-900 dark:hover:text-blue-100"
                >
                  &times;
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {conversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-center p-4">
            <FiMessageCircle size={48} className="text-gray-300 dark:text-gray-600 mb-4" />
            <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t('noConversationsFound')}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {t('tryDifferentFilters')}
            </p>
          </div>
        ) : (
          conversations.map(conversation => (
            <motion.div
              key={conversation.id}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={() => handleConversationSelect(conversation)}
              className={`p-4 border-b dark:border-gray-700 cursor-pointer ${
                activeConversation?.id === conversation.id 
                  ? 'bg-green-50 dark:bg-green-900/30' 
                  : 'hover:bg-gray-50 dark:hover:bg-gray-800'
              }`}
            >
              {/* ... (same conversation item rendering as before) */}
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

export default SupportConversationList;