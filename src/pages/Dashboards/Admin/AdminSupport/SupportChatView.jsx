import React from 'react';
import { FiUser, FiMessageCircle, FiMail, FiCalendar, FiClock, FiInfo, FiArrowRightCircle, FiSend } from 'react-icons/fi';
import { HiOutlineBot, HiOutlineUserCircle } from 'react-icons/hi';

const SupportChatView = ({
  activeConversation,
  isTyping,
  messageInput,
  setMessageInput,
  handleSendMessage,
  handleKeyPress,
  chatEndRef,
  showUserInfoPanel,
  setShowUserInfoPanel,
  isMobile,
  setShowSidebar,
  handleStatusChange,
  getSenderName,
  formatTime,
  formatTimestamp,
  t
}) => {
  const renderMessageBubble = (message) => {
    const isAdmin = message.sender === 'admin';
    const isCustomer = message.sender === 'customer';
    const isBot = message.sender === 'bot';
    const isNotification = message.sender === 'notification';
    
    if (isNotification) {
      return (
        <div key={message.id} className="flex justify-center my-2">
          <div className="px-4 py-2 rounded-full bg-gray-100 dark:bg-gray-700 text-sm text-gray-500 dark:text-gray-300">
            {message.content}
          </div>
        </div>
      );
    }
    
    return (
      <div key={message.id} className={`flex ${isAdmin ? 'justify-end' : 'justify-start'} mb-4`}>
        <div className={`flex ${isAdmin ? 'flex-row-reverse' : 'flex-row'} max-w-[80%]`}>
          <div className="flex-shrink-0">
            {isCustomer && (
              <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-500 dark:text-blue-300">
                <FiUser size={16} />
              </div>
            )}
            {isAdmin && (
              <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center text-green-500 dark:text-green-300">
                <HiOutlineUserCircle size={16} />
              </div>
            )}
            {isBot && (
              <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center text-purple-500 dark:text-purple-300">
                <HiOutlineBot size={16} />
              </div>
            )}
          </div>
          <div className={`ml-2 ${isAdmin ? 'mr-2' : ''}`}>
            <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
              {getSenderName(message.sender, activeConversation)} • {formatTime(message.timestamp)}
            </div>
            <div className={`px-4 py-2 rounded-lg ${
              isAdmin 
                ? 'bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-100' 
                : isBot
                  ? 'bg-purple-100 dark:bg-purple-800 text-purple-800 dark:text-purple-100'
                  : 'bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-100'
            }`}>
              {message.content}
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (!activeConversation) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center p-4">
        <FiMessageCircle size={64} className="text-gray-300 dark:text-gray-600 mb-4" />
        <h2 className="text-xl font-medium text-gray-700 dark:text-gray-300 mb-2">
          {t('selectConversation')}
        </h2>
        <p className="text-gray-500 dark:text-gray-400 max-w-md">
          {t('selectConversationMessage')}
        </p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* ... (same chat header as before) */}
      
      <div className="flex-1 overflow-y-auto p-4" style={{ scrollBehavior: 'smooth' }}>
        <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {t('subject')}
          </h4>
          <p className="text-gray-600 dark:text-gray-400">
            {activeConversation.subject}
          </p>
        </div>
        
        {activeConversation.messages.map(message => renderMessageBubble(message))}
        
        {isTyping && (
          <div className="flex justify-start mb-4">
            {/* ... (same typing indicator as before) */}
          </div>
        )}
        
        <div ref={chatEndRef} />
      </div>
      
      <div className="p-4 border-t dark:border-gray-700">
        <div className="flex space-x-2">
          <textarea
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder={t('typeMessage')}
            className="flex-1 p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
            rows={3}
          />
          <div className="flex flex-col justify-end">
            <button
              onClick={handleSendMessage}
              disabled={messageInput.trim() === ''}
              className={`p-3 rounded-lg flex items-center justify-center ${
                messageInput.trim() === '' 
                  ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed' 
                  : 'bg-green-500 hover:bg-green-600 text-white cursor-pointer'
              } focus:outline-none transition-colors`}
            >
              <FiSend size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupportChatView;