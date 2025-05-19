import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import AdminLayout from '../../../../layouts/admin_layout';
import {
  FiMessageSquare,
  FiMessageCircle,
  FiSend,
  FiFilter,
  FiSearch,
  FiBell,
  FiCheck,
  FiArrowUpCircle,
  FiRefreshCw,
  FiAlertCircle,
  FiUser,
  FiPhoneCall,
  FiMail,
  FiClock,
  FiZap,
  FiToggleLeft,
  FiToggleRight,
  FiMoreVertical,
  FiTrash2
} from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';

// Mock data for demonstration
const MOCK_CONVERSATIONS = [
  {
    id: 1,
    user: {
      name: 'Jean Kouam',
      email: 'jean.k@example.com',
      avatar: null,
      phoneNumber: '+237 699123456'
    },
    status: 'active',
    lastMessage: 'Je n\'ai pas reçu ma commande et ça fait plus de 40 minutes',
    lastMessageTime: new Date(Date.now() - 15 * 60000), // 15 minutes ago
    unreadCount: 3,
    messages: [
      {
        id: 1,
        sender: 'user',
        content: 'Bonjour, j\'ai un problème avec ma commande #CMD-1234',
        timestamp: new Date(Date.now() - 45 * 60000),
      },
      {
        id: 2,
        sender: 'bot',
        content: 'Bonjour Jean, je suis le bot assistant de ChopFast. Comment puis-je vous aider avec votre commande #CMD-1234?',
        timestamp: new Date(Date.now() - 44 * 60000),
      },
      {
        id: 3,
        sender: 'user',
        content: 'Je n\'ai toujours pas reçu ma commande et ça fait plus de 30 minutes',
        timestamp: new Date(Date.now() - 30 * 60000),
      },
      {
        id: 4,
        sender: 'bot',
        content: 'Je suis désolé pour ce désagrément. Je vérifie immédiatement l\'état de votre commande.',
        timestamp: new Date(Date.now() - 29 * 60000),
      },
      {
        id: 5,
        sender: 'system',
        content: 'Conversation escaladée à un support humain',
        timestamp: new Date(Date.now() - 20 * 60000),
      },
      {
        id: 6,
        sender: 'user',
        content: 'Je n\'ai pas reçu ma commande et ça fait plus de 40 minutes',
        timestamp: new Date(Date.now() - 15 * 60000),
      }
    ]
  },
  {
    id: 2,
    user: {
      name: 'Marie Atangana',
      email: 'marie.a@example.com',
      avatar: null,
      phoneNumber: '+237 699789123'
    },
    status: 'pending',
    lastMessage: 'Comment puis-je annuler ma commande?',
    lastMessageTime: new Date(Date.now() - 2 * 60000), // 2 minutes ago
    unreadCount: 1,
    messages: [
      {
        id: 1,
        sender: 'user',
        content: 'Bonjour, comment puis-je annuler ma commande?',
        timestamp: new Date(Date.now() - 2 * 60000),
      }
    ]
  },
  {
    id: 3,
    user: {
      name: 'Paul Biya',
      email: 'paul.b@example.com',
      avatar: null,
      phoneNumber: '+237 699456789'
    },
    status: 'resolved',
    lastMessage: 'Merci pour votre aide!',
    lastMessageTime: new Date(Date.now() - 24 * 60 * 60000), // 1 day ago
    unreadCount: 0,
    messages: [
      {
        id: 1,
        sender: 'user',
        content: 'Je souhaite modifier mon adresse de livraison',
        timestamp: new Date(Date.now() - 26 * 60 * 60000),
      },
      {
        id: 2,
        sender: 'bot',
        content: 'Bien sûr, quelle est votre nouvelle adresse?',
        timestamp: new Date(Date.now() - 26 * 60 * 60000 + 1000),
      },
      {
        id: 3,
        sender: 'user',
        content: 'Quartier Bastos, près de l\'hôtel Hilton',
        timestamp: new Date(Date.now() - 26 * 60 * 60000 + 2000),
      },
      {
        id: 4,
        sender: 'bot',
        content: 'Votre adresse a été mise à jour. Votre commande sera livrée à la nouvelle adresse.',
        timestamp: new Date(Date.now() - 26 * 60 * 60000 + 3000),
      },
      {
        id: 5,
        sender: 'user',
        content: 'Merci pour votre aide!',
        timestamp: new Date(Date.now() - 24 * 60 * 60000),
      }
    ]
  },
  {
    id: 4,
    user: {
      name: 'Sophie Fokam',
      email: 'sophie.f@example.com',
      avatar: null,
      phoneNumber: '+237 697123456'
    },
    status: 'escalated',
    lastMessage: 'Le livreur a pris ma commande mais n\'est jamais arrivé',
    lastMessageTime: new Date(Date.now() - 35 * 60000), // 35 minutes ago
    unreadCount: 2,
    messages: [
      {
        id: 1,
        sender: 'user',
        content: 'Bonjour, j\'ai un problème avec ma livraison',
        timestamp: new Date(Date.now() - 60 * 60000),
      },
      {
        id: 2,
        sender: 'bot',
        content: 'Bonjour Sophie, je suis désolé d\'entendre cela. Pouvez-vous me donner plus de détails?',
        timestamp: new Date(Date.now() - 59 * 60000),
      },
      {
        id: 3,
        sender: 'user',
        content: 'Le livreur a pris ma commande mais n\'est jamais arrivé',
        timestamp: new Date(Date.now() - 58 * 60000),
      },
      {
        id: 4,
        sender: 'bot',
        content: 'Je suis désolé pour cette situation. Je vais escalader ce problème à notre équipe de support.',
        timestamp: new Date(Date.now() - 57 * 60000),
      },
      {
        id: 5,
        sender: 'system',
        content: 'Conversation escaladée à un support humain',
        timestamp: new Date(Date.now() - 56 * 60000),
      },
      {
        id: 6,
        sender: 'admin',
        content: 'Bonjour Sophie, je suis Marc du support client. Je vais vous aider à résoudre ce problème. Pouvez-vous me donner le numéro de votre commande?',
        timestamp: new Date(Date.now() - 45 * 60000),
      },
      {
        id: 7,
        sender: 'user',
        content: 'Mon numéro de commande est #CMD-5678. Ça fait plus d\'une heure que j\'attends.',
        timestamp: new Date(Date.now() - 40 * 60000),
      },
      {
        id: 8,
        sender: 'admin',
        content: 'Merci pour cette information. Je vais contacter le livreur immédiatement et vous tenir informé.',
        timestamp: new Date(Date.now() - 38 * 60000),
      },
      {
        id: 9,
        sender: 'user',
        content: 'Le livreur a pris ma commande mais n\'est jamais arrivé',
        timestamp: new Date(Date.now() - 35 * 60000),
      }
    ]
  },
  {
    id: 5,
    user: {
      name: 'Alain Nteff',
      email: 'alain.n@example.com',
      avatar: null,
      phoneNumber: '+237 698789456'
    },
    status: 'active',
    lastMessage: 'Est-ce que je peux ajouter un dessert à ma commande?',
    lastMessageTime: new Date(Date.now() - 5 * 60000), // 5 minutes ago
    unreadCount: 1,
    messages: [
      {
        id: 1,
        sender: 'user',
        content: 'Bonjour, je viens de passer une commande',
        timestamp: new Date(Date.now() - 10 * 60000),
      },
      {
        id: 2,
        sender: 'bot',
        content: 'Bonjour Alain, comment puis-je vous aider avec votre commande?',
        timestamp: new Date(Date.now() - 9 * 60000),
      },
      {
        id: 3,
        sender: 'user',
        content: 'Est-ce que je peux ajouter un dessert à ma commande?',
        timestamp: new Date(Date.now() - 5 * 60000),
      }
    ]
  }
];

// AI response generator based on keywords (simplified mock)
const generateAIResponse = (message) => {
  const lowerMessage = message.toLowerCase();
  
  if (lowerMessage.includes('livraison') || lowerMessage.includes('livreur') || lowerMessage.includes('délai')) {
    return "Nos livreurs s'engagent à livrer dans un délai maximum de 30 minutes. Si votre commande dépasse ce délai, veuillez nous excuser pour ce désagrément. Je peux localiser votre livreur pour vous.";
  }
  
  if (lowerMessage.includes('annuler') || lowerMessage.includes('annulation')) {
    return "Pour annuler votre commande, c'est possible si elle n'a pas encore été préparée. Dans ce cas, vous recevrez un remboursement complet sous 3-5 jours ouvrables.";
  }
  
  if (lowerMessage.includes('paiement') || lowerMessage.includes('payé') || lowerMessage.includes('remboursement')) {
    return "Nous acceptons plusieurs méthodes de paiement: Mobile Money (Orange Money, MTN Mobile Money), carte bancaire et paiement à la livraison. Pour les remboursements, le délai est de 3-5 jours ouvrables.";
  }
  
  if (lowerMessage.includes('menu') || lowerMessage.includes('plat') || lowerMessage.includes('nourriture')) {
    return "Vous pouvez consulter les menus de nos restaurants partenaires directement sur l'application. Chaque plat est accompagné d'une description et de son prix.";
  }
  
  if (lowerMessage.includes('merci')) {
    return "Je vous en prie! N'hésitez pas si vous avez d'autres questions. Je suis là pour vous aider.";
  }
  
  return "Je comprends votre demande. Pour vous aider plus efficacement, pouvez-vous me donner plus de détails sur votre requête?";
};

// Main Admin Support Component
const AdminSupportPage = () => {
  const { t } = useTranslation();
  const [conversations, setConversations] = useState(MOCK_CONVERSATIONS);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [message, setMessage] = useState('');
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [aiEnabled, setAiEnabled] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  
  // Filter conversations based on status and search query
  const filteredConversations = conversations.filter(convo => {
    const matchesFilter = filter === 'all' || convo.status === filter;
    const matchesSearch = 
      convo.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      convo.lastMessage.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });
  
  // Sort conversations by unread count (descending) and then by last message time (newest first)
  const sortedConversations = [...filteredConversations].sort((a, b) => {
    if (a.unreadCount !== b.unreadCount) {
      return b.unreadCount - a.unreadCount; // Sort by unread count first
    }
    return b.lastMessageTime - a.lastMessageTime; // Then by timestamp
  });
  
  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [selectedConversation?.messages]);
  
  // Function to format timestamps
  const formatTime = (timestamp) => {
    const now = new Date();
    const messageDate = new Date(timestamp);
    
    // Check if it's today
    if (messageDate.toDateString() === now.toDateString()) {
      return messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    
    // Check if it's yesterday
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    if (messageDate.toDateString() === yesterday.toDateString()) {
      return `${t('yesterday')} ${messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    }
    
    // Otherwise show date and time
    return messageDate.toLocaleDateString([], { day: '2-digit', month: '2-digit' }) + ' ' + 
           messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  // Handle clicking on a conversation
  const handleSelectConversation = (conversation) => {
    // Reset unread count when opening a conversation
    const updatedConversations = conversations.map(c => 
      c.id === conversation.id ? { ...c, unreadCount: 0 } : c
    );
    setConversations(updatedConversations);
    setSelectedConversation(conversation);
  };
  
  // Send a message
  const handleSendMessage = (e) => {
    e.preventDefault();
    
    if (!message.trim() || !selectedConversation) return;
    
    // Add admin message
    const newAdminMessage = {
      id: Date.now(),
      sender: 'admin',
      content: message,
      timestamp: new Date(),
    };
    
    // Create updated conversation with the new message
    const updatedConversation = {
      ...selectedConversation,
      messages: [...selectedConversation.messages, newAdminMessage],
      lastMessage: message,
      lastMessageTime: new Date(),
    };
    
    // Update conversations state
    const updatedConversations = conversations.map(c => 
      c.id === selectedConversation.id ? updatedConversation : c
    );
    
    setConversations(updatedConversations);
    setSelectedConversation(updatedConversation);
    setMessage('');
    
    // Generate AI response if enabled
    if (aiEnabled && !message.includes('!noai')) {
      setIsTyping(true);
      
      // Simulate typing delay
      setTimeout(() => {
        const aiResponse = {
          id: Date.now() + 1,
          sender: 'bot',
          content: generateAIResponse(message),
          timestamp: new Date(),
        };
        
        // Add AI response to conversation
        const conversationWithAiResponse = {
          ...updatedConversation,
          messages: [...updatedConversation.messages, aiResponse],
          lastMessage: aiResponse.content,
          lastMessageTime: new Date(),
        };
        
        // Update states
        setConversations(prevConversations => 
          prevConversations.map(c => c.id === selectedConversation.id ? conversationWithAiResponse : c)
        );
        setSelectedConversation(conversationWithAiResponse);
        setIsTyping(false);
      }, 2000);
    }
  };
  
  // Mark conversation as resolved
  const handleResolveConversation = (convoId) => {
    const updatedConversations = conversations.map(c => 
      c.id === convoId ? { ...c, status: 'resolved' } : c
    );
    setConversations(updatedConversations);
    
    // Update selected conversation if it's the one being resolved
    if (selectedConversation?.id === convoId) {
      setSelectedConversation({ ...selectedConversation, status: 'resolved' });
    }
  };
  
  // Escalate conversation
  const handleEscalateConversation = (convoId) => {
    // Add system message about escalation
    const conversationToUpdate = conversations.find(c => c.id === convoId);
    const escalationMessage = {
      id: Date.now(),
      sender: 'system',
      content: 'Conversation escaladée à un support humain',
      timestamp: new Date(),
    };
    
    const updatedMessages = [...conversationToUpdate.messages, escalationMessage];
    
    const updatedConversations = conversations.map(c => 
      c.id === convoId ? 
      { 
        ...c, 
        status: 'escalated', 
        messages: updatedMessages,
        lastMessage: 'Conversation escaladée à un support humain',
        lastMessageTime: new Date(),
      } : c
    );
    
    setConversations(updatedConversations);
    
    // Update selected conversation if it's the one being escalated
    if (selectedConversation?.id === convoId) {
      setSelectedConversation({ 
        ...selectedConversation, 
        status: 'escalated',
        messages: updatedMessages,
        lastMessage: 'Conversation escaladée à un support humain',
        lastMessageTime: new Date(),
      });
    }
    
    // In a real app, you'd send an email notification here
    console.log(`Email notification sent for escalated conversation #${convoId}`);
  };
  
  // Get status badge component
  const StatusBadge = ({ status }) => {
    const badgeClasses = {
      active: "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100",
      pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100",
      resolved: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-100",
      escalated: "bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100"
    };
    
    const statusTranslations = {
      active: t('statusActive'),
      pending: t('statusPending'),
      resolved: t('statusResolved'),
      escalated: t('statusEscalated')
    };
    
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${badgeClasses[status]}`}>
        {statusTranslations[status]}
      </span>
    );
  };

  return (
    <AdminLayout>
      <div className="h-full flex flex-col">
        <div className="pb-5">
          <h1 className="text-2xl font-bold mb-2">{t('supportDashboard')}</h1>
          <p className="text-gray-600 dark:text-gray-300">{t('supportDashboardDescription')}</p>
        </div>
        
        <div className="flex flex-1 overflow-hidden bg-white dark:bg-gray-800 rounded-lg shadow-lg">
          {/* Left sidebar - Conversation list */}
          <div className="w-1/3 border-r border-gray-200 dark:border-gray-700 flex flex-col">
            {/* Search and filter bar */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center mb-4 bg-gray-100 dark:bg-gray-700 rounded-lg px-3 py-2">
                <FiSearch className="text-gray-500 dark:text-gray-400 mr-2" />
                <input
                  type="text"
                  placeholder={t('searchConversations')}
                  className="bg-transparent border-none focus:ring-0 focus:outline-none w-full text-sm"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-thin">
                <button
                  className={`px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                    filter === 'all' 
                      ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100' 
                      : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                  }`}
                  onClick={() => setFilter('all')}
                >
                  {t('allConversations')}
                </button>
                <button
                  className={`px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                    filter === 'active' 
                      ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100' 
                      : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                  }`}
                  onClick={() => setFilter('active')}
                >
                  {t('activeConversations')}
                </button>
                <button
                  className={`px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                    filter === 'pending' 
                      ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100' 
                      : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                  }`}
                  onClick={() => setFilter('pending')}
                >
                  {t('pendingConversations')}
                </button>
                <button
                  className={`px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                    filter === 'escalated' 
                      ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100' 
                      : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                  }`}
                  onClick={() => setFilter('escalated')}
                >
                  {t('escalatedConversations')}
                </button>
                <button
                  className={`px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                    filter === 'resolved' 
                      ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100' 
                      : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                  }`}
                  onClick={() => setFilter('resolved')}
                >
                  {t('resolvedConversations')}
                </button>
              </div>
            </div>
            
            {/* Conversations list */}
            <div className="flex-1 overflow-y-auto">
              <AnimatePresence>
                {sortedConversations.length > 0 ? (
                  sortedConversations.map((conversation) => (
                    <motion.div
                      key={conversation.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      transition={{ duration: 0.2 }}
                      className={`p-4 border-b border-gray-200 dark:border-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                        selectedConversation?.id === conversation.id 
                          ? 'bg-green-50 dark:bg-green-900/30' 
                          : ''
                      }`}
                      onClick={() => handleSelectConversation(conversation)}
                    >
                      <div className="flex justify-between items-start mb-1">
                        <h3 className="font-medium text-gray-900 dark:text-white flex items-center">
                          {conversation.user.name}
                          {conversation.unreadCount > 0 && (
                            <span className="ml-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                              {conversation.unreadCount}
                            </span>
                          )}
                        </h3>
                        <div className="flex items-center">
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {formatTime(conversation.lastMessageTime)}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <p className="text-sm text-gray-600 dark:text-gray-300 truncate w-3/4">
                          {conversation.lastMessage}
                        </p>
                        <StatusBadge status={conversation.status} />
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center h-full p-4 text-center">
                    <FiMessageSquare className="text-gray-400 mb-2" size={40} />
                    <p className="text-gray-500 dark:text-gray-400">{t('noConversationsFound')}</p>
                  </div>
                )}
              </AnimatePresence>
            </div>
          </div>
          
          {/* Right side - Chat window */}
          <div className="w-2/3 flex flex-col">
            {selectedConversation ? (
              <>
                {/* Chat header */}
                <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-green-600 via-yellow-500 to-red-600 flex items-center justify-center mr-3">
                      <FiUser className="text-white" size={18} />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white">
                        {selectedConversation.user.name}
                      </h3>
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <span>{selectedConversation.user.email}</span>
                        <span className="mx-2">•</span>
                        <span>{selectedConversation.user.phoneNumber}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center bg-green-500 hover:bg-green-600 text-white px-3 py-1.5 rounded-md transition-colors"
                      onClick={() => window.open(`https://wa.me/${selectedConversation.user.phoneNumber.replace(/\s+/g, '')}`, '_blank')}
                    >
                      <FaWhatsapp className="mr-1" size={16} />
                      <span className="text-sm">{t('whatsapp')}</span>
                    </motion.button>
                    
                    <div className="flex items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-300 mr-2">{t('aiAssistant')}</span>
                      <button 
                        className="relative focus:outline-none"
                        onClick={() => setAiEnabled(!aiEnabled)}
                        aria-label={aiEnabled ? t('disableAI') : t('enableAI')}
                      >
                        <div className={`w-12 h-6 rounded-full transition-colors ${aiEnabled ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'}`}>
                          <div className={`absolute w-5 h-5 rounded-full bg-white shadow-md transform transition-transform ${aiEnabled ? 'translate-x-6 mt-0.5 ml-0.5' : 'translate-x-0.5 mt-0.5'}`}></div>
                        </div>
                      </button>
                    </div>
                  </div>
                </div>
                
              {/* Chat messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {selectedConversation.messages.map((msg) => {
                    // Determine message position and styling based on sender
                    const isUserMessage = msg.sender === 'user';
                    const isAdminMessage = msg.sender === 'admin';
                    // Removed unused variable 'isBotMessage'
                    const isSystemMessage = msg.sender === 'system';
                    
                    // Message container classes
                    const containerClasses = isSystemMessage
                      ? "flex justify-center"
                      : isUserMessage
                        ? "flex justify-start"
                        : "flex justify-end";
                    
                    // Message bubble classes
                    const bubbleClasses = isSystemMessage
                      ? "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-center text-sm py-1 px-4 rounded-full"
                      : isUserMessage
                        ? "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100 p-3 rounded-lg rounded-tl-none max-w-[70%]"
                        : isAdminMessage
                          ? "bg-green-500 text-white p-3 rounded-lg rounded-tr-none max-w-[70%]"
                          : "bg-blue-500 text-white p-3 rounded-lg rounded-tr-none max-w-[70%]";
                    
                    return (
                      <div key={msg.id} className={containerClasses}>
                        {isSystemMessage ? (
                          <div className={bubbleClasses}>
                            <span>{msg.content}</span>
                          </div>
                        ) : (
                          <div className="flex flex-col">
                            <div className={bubbleClasses}>
                              <span>{msg.content}</span>
                            </div>
                            <span className="text-xs text-gray-500 dark:text-gray-400 mt-1 self-start">
                              {isUserMessage ? t('user') : isAdminMessage ? t('admin') : t('bot')} • {formatTime(msg.timestamp)}
                            </span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                  
                  {/* Typing indicator */}
                  {isTyping && (
                    <div className="flex justify-end">
                      <div className="bg-green-100 dark:bg-green-800/30 text-green-800 dark:text-green-100 p-3 rounded-lg rounded-tr-none">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-green-500 dark:bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                          <div className="w-2 h-2 bg-green-500 dark:bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                          <div className="w-2 h-2 bg-green-500 dark:bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Auto-scroll anchor div */}
                  <div ref={messagesEndRef} />
                </div>
                
                {/* Chat actions */}
                <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex flex-col">
                  {selectedConversation.status !== 'resolved' && (
                    <div className="flex items-center mb-3 space-x-2">
                      <button
                        className="flex items-center bg-green-100 hover:bg-green-200 dark:bg-green-800/20 dark:hover:bg-green-800/40 text-green-800 dark:text-green-100 px-3 py-1.5 rounded-md transition-colors"
                        onClick={() => handleResolveConversation(selectedConversation.id)}
                      >
                        <FiCheck className="mr-1" />
                        <span className="text-sm">{t('markAsResolved')}</span>
                      </button>
                      
                      {selectedConversation.status !== 'escalated' && (
                        <button
                          className="flex items-center bg-red-100 hover:bg-red-200 dark:bg-red-800/20 dark:hover:bg-red-800/40 text-red-800 dark:text-red-100 px-3 py-1.5 rounded-md transition-colors"
                          onClick={() => handleEscalateConversation(selectedConversation.id)}
                        >
                          <FiArrowUpCircle className="mr-1" />
                          <span className="text-sm">{t('escalateIssue')}</span>
                        </button>
                      )}
                      
                      <button className="flex items-center bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-100 px-3 py-1.5 rounded-md transition-colors">
                        <FiRefreshCw className="mr-1" />
                        <span className="text-sm">{t('reassign')}</span>
                      </button>
                      
                      <button className="flex items-center ml-auto bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-100 p-1.5 rounded-md transition-colors">
                        <FiMoreVertical />
                      </button>
                    </div>
                  )}
                  
                  {/* Message input */}
                  {selectedConversation.status !== 'resolved' && (
                    <form onSubmit={handleSendMessage} className="flex items-center">
                      <div className="flex-1 bg-gray-100 dark:bg-gray-700 rounded-lg px-4 py-2 mr-2">
                        <input
                          type="text"
                          placeholder={t('typeYourMessage')}
                          className="w-full bg-transparent border-none focus:ring-0 focus:outline-none"
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                        />
                      </div>
                      <button
                        type="submit"
                        className="bg-green-500 hover:bg-green-600 text-white p-2 rounded-lg transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                        disabled={!message.trim()}
                      >
                        <FiSend size={20} />
                      </button>
                    </form>
                  )}
                  
                  {selectedConversation.status === 'resolved' && (
                    <div className="flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded-lg p-3">
                      <FiCheck className="text-green-500 mr-2" />
                      <span className="text-gray-600 dark:text-gray-300">{t('conversationMarkedAsResolved')}</span>
                    </div>
                  )}
                </div>
              </>
            ) : (
              // No conversation selected state
              <div className="flex flex-col items-center justify-center h-full p-6 text-center">
                <div className="w-24 h-24 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
                  <FiMessageCircle className="text-gray-400" size={40} />
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  {t('selectConversation')}
                </h3>
                <p className="text-gray-500 dark:text-gray-400 max-w-md">
                  {t('selectConversationDescription')}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminSupportPage;