import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import {
  FiSearch,
  FiFilter,
  FiMessageSquare,
  FiPhone,
  FiMail,
  FiClock,
  FiUser,
  FiSend,
  FiSmile,
  FiPaperclip,
  FiCheck,
  FiCheckCircle,
  FiAlertCircle,
  FiArrowUp,
  FiUsers,
  FiTrash2,
  FiEdit3,
  FiMoreVertical,
  FiRefreshCw,
  FiTrendingUp,
  FiActivity,
  FiHeadphones,
  FiZap,
  FiBell,
  FiSettings,
  FiEye,
  FiArchive
} from 'react-icons/fi';
import AdminLayout from '../../../../layouts/admin_layout';

// Mock data for conversations (keep the same as before)
const MOCK_CONVERSATIONS = [
  {
    id: 1,
    user: {
      name: 'Marie Dupont',
      email: 'marie.dupont@email.com',
      phone: '+237 6XX XXX XXX',
      avatar: null,
      lastSeen: '2 min'
    },
    lastMessage: {
      text: 'Bonjour, j\'ai un problème avec ma commande #12345',
      timestamp: new Date(Date.now() - 2 * 60 * 1000),
      isFromUser: true
    },
    status: 'active',
    priority: 'urgent',
    channel: 'WhatsApp',
    unreadCount: 3,
    messages: [
      {
        id: 1,
        text: 'Bonjour ! Comment puis-je vous aider aujourd\'hui ?',
        timestamp: new Date(Date.now() - 30 * 60 * 1000),
        isFromUser: false,
        isAI: false
      },
      {
        id: 2,
        text: 'Bonjour, j\'ai passé une commande ce matin mais elle n\'est jamais arrivée',
        timestamp: new Date(Date.now() - 25 * 60 * 1000),
        isFromUser: true
      },
      {
        id: 3,
        text: 'Je suis désolé pour ce désagrément. Pouvez-vous me donner votre numéro de commande ?',
        timestamp: new Date(Date.now() - 20 * 60 * 1000),
        isFromUser: false,
        isAI: false
      },
      {
        id: 4,
        text: 'Le numéro de commande est #12345',
        timestamp: new Date(Date.now() - 15 * 60 * 1000),
        isFromUser: true
      },
      {
        id: 5,
        text: 'Bonjour, j\'ai un problème avec ma commande #12345',
        timestamp: new Date(Date.now() - 2 * 60 * 1000),
        isFromUser: true
      }
    ]
  },
  {
    id: 2,
    user: {
      name: 'Jean Kamga',
      email: 'jean.kamga@email.com',
      phone: '+237 6XX XXX XXX',
      avatar: null,
      lastSeen: '5 min'
    },
    lastMessage: {
      text: 'Merci pour votre aide, problème résolu !',
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
      isFromUser: true
    },
    status: 'resolved',
    priority: 'medium',
    channel: 'email',
    unreadCount: 0,
    messages: [
      {
        id: 1,
        text: 'J\'ai des difficultés à mettre à jour mon profil restaurant',
        timestamp: new Date(Date.now() - 120 * 60 * 1000),
        isFromUser: true
      },
      {
        id: 2,
        text: 'Je vais vous guider étape par étape pour mettre à jour votre profil.',
        timestamp: new Date(Date.now() - 115 * 60 * 1000),
        isFromUser: false,
        isAI: true
      },
      {
        id: 3,
        text: 'Merci pour votre aide, problème résolu !',
        timestamp: new Date(Date.now() - 5 * 60 * 1000),
        isFromUser: true
      }
    ]
  },
  {
    id: 3,
    user: {
      name: 'Restaurant Le Savoir',
      email: 'contact@lesavoir.cm',
      phone: '+237 6XX XXX XXX',
      avatar: null,
      lastSeen: '1h'
    },
    lastMessage: {
      text: 'Comment puis-je augmenter ma visibilité sur la plateforme ?',
      timestamp: new Date(Date.now() - 60 * 60 * 1000),
      isFromUser: true
    },
    status: 'pending',
    priority: 'high',
    channel: 'chat',
    unreadCount: 1,
    messages: [
      {
        id: 1,
        text: 'Comment puis-je augmenter ma visibilité sur la plateforme ?',
        timestamp: new Date(Date.now() - 60 * 60 * 1000),
        isFromUser: true
      }
    ]
  },
  {
    id: 4,
    user: {
      name: 'Paul Mballa',
      email: 'paul.mballa@email.com',
      phone: '+237 6XX XXX XXX',
      avatar: null,
      lastSeen: '2h'
    },
    lastMessage: {
      text: 'L\'application plante quand j\'essaie de passer commande',
      timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
      isFromUser: true
    },
    status: 'escalated',
    priority: 'urgent',
    channel: 'WhatsApp',
    unreadCount: 2,
    messages: [
      {
        id: 1,
        text: 'L\'application plante quand j\'essaie de passer commande',
        timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
        isFromUser: true
      },
      {
        id: 2,
        text: 'Ce problème a été escaladé à notre équipe technique.',
        timestamp: new Date(Date.now() - 2.5 * 60 * 60 * 1000),
        isFromUser: false,
        isAI: false
      }
    ]
  }
];

const AdminSupportPage = () => {
  const { t } = useTranslation();
  const [darkMode, setDarkMode] = useState(() => {
    return document.documentElement.classList.contains('dark');
  });
  
  // States for conversation management
  const [conversations, setConversations] = useState(MOCK_CONVERSATIONS);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [channelFilter, setChannelFilter] = useState('all');
  
  // States for messaging
  const [messageText, setMessageText] = useState('');
  const [aiEnabled, setAiEnabled] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const [showStats, setShowStats] = useState(false);
  
  // Refs
  const messagesEndRef = useRef(null);
  const messageInputRef = useRef(null);
  
  // Detect dark mode changes
  useEffect(() => {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          setDarkMode(document.documentElement.classList.contains('dark'));
        }
      });
    });
    
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });
    
    return () => observer.disconnect();
  }, []);
  
  // Auto-scroll messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [selectedConversation?.messages]);
  
  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.key === 'k') {
        e.preventDefault();
        document.getElementById('search-input')?.focus();
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);
  
  // Filter conversations
  const filteredConversations = conversations.filter(conv => {
    const matchesSearch = conv.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         conv.user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         conv.lastMessage.text.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || conv.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || conv.priority === priorityFilter;
    const matchesChannel = channelFilter === 'all' || conv.channel.toLowerCase() === channelFilter.toLowerCase();
    
    return matchesSearch && matchesStatus && matchesPriority && matchesChannel;
  });
  
  // Generate AI response
  const generateAIResponse = async (conversationContext) => {
    const responses = [
      "Je comprends votre préoccupation. Laissez-moi vérifier cela pour vous.",
      "Merci de nous avoir contactés. Je vais examiner votre demande immédiatement.",
      "Je suis désolé pour ce désagrément. Permettez-moi de vous aider à résoudre ce problème.",
      "Votre feedback est important pour nous. Je vais transmettre votre message à l'équipe concernée.",
      "Je vais vérifier les détails de votre commande et vous tenir informé.",
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  };
  
  // Send message
  const sendMessage = async () => {
    if (!messageText.trim() || !selectedConversation) return;
    
    const newMessage = {
      id: Date.now(),
      text: messageText,
      timestamp: new Date(),
      isFromUser: false,
      isAI: false
    };
    
    setConversations(prev => prev.map(conv => 
      conv.id === selectedConversation.id 
        ? {
            ...conv,
            messages: [...conv.messages, newMessage],
            lastMessage: { ...newMessage, isFromUser: false }
          }
        : conv
    ));
    
    setSelectedConversation(prev => ({
      ...prev,
      messages: [...prev.messages, newMessage]
    }));
    
    setMessageText('');
    
    // AI auto-response if enabled
    if (aiEnabled) {
      setIsTyping(true);
      setTimeout(async () => {
        const aiResponse = await generateAIResponse(selectedConversation.messages);
        const aiMessage = {
          id: Date.now() + 1,
          text: aiResponse,
          timestamp: new Date(),
          isFromUser: false,
          isAI: true
        };
        
        setConversations(prev => prev.map(conv => 
          conv.id === selectedConversation.id 
            ? {
                ...conv,
                messages: [...conv.messages, newMessage, aiMessage],
                lastMessage: aiMessage
              }
            : conv
        ));
        
        setSelectedConversation(prev => ({
          ...prev,
          messages: [...prev.messages, aiMessage]
        }));
        
        setIsTyping(false);
      }, 2000);
    }
  };
  
  // Handle Enter key
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };
  
  // Update conversation status
  const updateConversationStatus = (conversationId, newStatus) => {
    setConversations(prev => prev.map(conv => 
      conv.id === conversationId ? { ...conv, status: newStatus } : conv
    ));
    
    if (selectedConversation?.id === conversationId) {
      setSelectedConversation(prev => ({ ...prev, status: newStatus }));
    }
  };
  
  // Delete conversation
  const deleteConversation = (conversationId) => {
    setConversations(prev => prev.filter(conv => conv.id !== conversationId));
    if (selectedConversation?.id === conversationId) {
      setSelectedConversation(null);
    }
  };
  
  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'pending': return 'bg-yellow-500';
      case 'resolved': return 'bg-gray-500';
      case 'escalated': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };
  
  // Get priority color
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };
  
  // Get channel icon
  const getChannelIcon = (channel) => {
    switch (channel.toLowerCase()) {
      case 'whatsapp': return <FiMessageSquare className="w-4 h-4" />;
      case 'email': return <FiMail className="w-4 h-4" />;
      case 'chat': return <FiHeadphones className="w-4 h-4" />;
      default: return <FiMessageSquare className="w-4 h-4" />;
    }
  };
  
  // Calculate stats
  const stats = {
    total: conversations.length,
    active: conversations.filter(c => c.status === 'active').length,
    pending: conversations.filter(c => c.status === 'pending').length,
    resolved: conversations.filter(c => c.status === 'resolved').length,
    escalated: conversations.filter(c => c.status === 'escalated').length,
    unread: conversations.reduce((sum, c) => sum + c.unreadCount, 0)
  };

  return (
    <AdminLayout>
      <div className={`h-full flex flex-col ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
        {/* Header */}
        <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b px-6 py-4`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-green-600 via-yellow-500 to-red-600 bg-clip-text text-transparent">
                {t('support services')}
              </h1>
              <div className="flex items-center space-x-2">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  aiEnabled ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                }`}>
                  <FiZap className="w-3 h-3 mr-1" />
                  IA {aiEnabled ? 'Activée' : 'Désactivée'}
                </span>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowStats(!showStats)}
                className={`inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  showStats 
                    ? 'bg-green-600 text-white' 
                    : `${darkMode ? 'bg-gray-700 hover:bg-gray-600 text-gray-200' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'}`
                }`}
              >
                <FiActivity className="w-4 h-4 mr-2" />
                Statistiques
              </button>
              
              <button
                onClick={() => setAiEnabled(!aiEnabled)}
                className={`inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  aiEnabled 
                    ? 'bg-green-600 text-white' 
                    : `${darkMode ? 'bg-gray-700 hover:bg-gray-600 text-gray-200' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'}`
                }`}
              >
                <FiZap className="w-4 h-4 mr-2" />
                Assistant IA
              </button>
              
              <button className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-600'} transition-colors`}>
                <FiBell className="w-5 h-5" />
              </button>
              
              <button className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-600'} transition-colors`}>
                <FiSettings className="w-5 h-5" />
              </button>
            </div>
          </div>
          
          {/* Stats Cards */}
          {showStats && (
            <div className="mt-4 grid grid-cols-2 md:grid-cols-6 gap-4">
              <div className={`${darkMode ? 'bg-gray-700' : 'bg-white'} p-4 rounded-lg shadow-sm border ${darkMode ? 'border-gray-600' : 'border-gray-200'}`}>
                <div className="flex items-center">
                  <FiUsers className="w-5 h-5 text-blue-500 mr-2" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Total</p>
                    <p className="text-xl font-semibold">{stats.total}</p>
                  </div>
                </div>
              </div>
              
              <div className={`${darkMode ? 'bg-gray-700' : 'bg-white'} p-4 rounded-lg shadow-sm border ${darkMode ? 'border-gray-600' : 'border-gray-200'}`}>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Actives</p>
                    <p className="text-xl font-semibold">{stats.active}</p>
                  </div>
                </div>
              </div>
              
              <div className={`${darkMode ? 'bg-gray-700' : 'bg-white'} p-4 rounded-lg shadow-sm border ${darkMode ? 'border-gray-600' : 'border-gray-200'}`}>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">En attente</p>
                    <p className="text-xl font-semibold">{stats.pending}</p>
                  </div>
                </div>
              </div>
              
              <div className={`${darkMode ? 'bg-gray-700' : 'bg-white'} p-4 rounded-lg shadow-sm border ${darkMode ? 'border-gray-600' : 'border-gray-200'}`}>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-gray-500 rounded-full mr-2"></div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Résolues</p>
                    <p className="text-xl font-semibold">{stats.resolved}</p>
                  </div>
                </div>
              </div>
              
              <div className={`${darkMode ? 'bg-gray-700' : 'bg-white'} p-4 rounded-lg shadow-sm border ${darkMode ? 'border-gray-600' : 'border-gray-200'}`}>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Escaladées</p>
                    <p className="text-xl font-semibold">{stats.escalated}</p>
                  </div>
                </div>
              </div>
              
              <div className={`${darkMode ? 'bg-gray-700' : 'bg-white'} p-4 rounded-lg shadow-sm border ${darkMode ? 'border-gray-600' : 'border-gray-200'}`}>
                <div className="flex items-center">
                  <FiEye className="w-5 h-5 text-red-500 mr-2" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Non lus</p>
                    <p className="text-xl font-semibold">{stats.unread}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        
        <div className="flex-1 flex overflow-hidden">
          {/* Left Panel - Conversations List */}
          <div className={`w-1/3 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-r flex flex-col`}>
            {/* Search and Filters */}
            <div className="p-4 space-y-4">
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  id="search-input"
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Rechercher conversations... (Ctrl+K)"
                  className={`w-full pl-10 pr-4 py-2 rounded-lg border ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                      : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500'
                  } focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all`}
                />
              </div>
              
              {/* Filter Buttons */}
              <div className="flex flex-wrap gap-2">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className={`px-3 py-1 rounded-full text-xs border ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-gray-200' 
                      : 'bg-gray-100 border-gray-300 text-gray-700'
                  } focus:outline-none focus:ring-2 focus:ring-green-500`}
                >
                  <option value="all">Tous les statuts</option>
                  <option value="active">Actives</option>
                  <option value="pending">En attente</option>
                  <option value="resolved">Résolues</option>
                  <option value="escalated">Escaladées</option>
                </select>
                
                <select
                  value={priorityFilter}
                  onChange={(e) => setPriorityFilter(e.target.value)}
                  className={`px-3 py-1 rounded-full text-xs border ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-gray-200' 
                      : 'bg-gray-100 border-gray-300 text-gray-700'
                  } focus:outline-none focus:ring-2 focus:ring-green-500`}
                >
                  <option value="all">Toutes priorités</option>
                  <option value="urgent">Urgent</option>
                  <option value="high">Élevée</option>
                  <option value="medium">Moyenne</option>
                  <option value="low">Faible</option>
                </select>
                
                <select
                  value={channelFilter}
                  onChange={(e) => setChannelFilter(e.target.value)}
                  className={`px-3 py-1 rounded-full text-xs border ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-gray-200' 
                      : 'bg-gray-100 border-gray-300 text-gray-700'
                  } focus:outline-none focus:ring-2 focus:ring-green-500`}
                >
                  <option value="all">Tous canaux</option>
                  <option value="whatsapp">WhatsApp</option>
                  <option value="email">Email</option>
                  <option value="chat">Chat</option>
                </select>
              </div>
            </div>
            
            {/* Conversations List */}
            <div className="flex-1 overflow-y-auto">
              {filteredConversations.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 text-gray-500 dark:text-gray-400">
                  <FiMessageSquare className="w-12 h-12 mb-4 opacity-50" />
                  <p className="text-center">Aucune conversation trouvée</p>
                </div>
              ) : (
                filteredConversations.map((conversation) => (
                  <div
                    key={conversation.id}
                    onClick={() => setSelectedConversation(conversation)}
                    className={`p-4 border-b cursor-pointer transition-all duration-200 ${
                      darkMode ? 'border-gray-700 hover:bg-gray-700' : 'border-gray-200 hover:bg-gray-50'
                    } ${
                      selectedConversation?.id === conversation.id 
                        ? `${darkMode ? 'bg-gray-700' : 'bg-green-50'} border-l-4 border-l-green-500` 
                        : ''
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3 flex-1">
                        {/* Avatar */}
                        <div className="w-12 h-12 rounded-full bg-gradient-to-r from-green-600 via-yellow-500 to-red-600 flex items-center justify-center text-white font-medium text-sm">
                          {conversation.user.avatar ? (
                            <img src={conversation.user.avatar} alt="" className="w-full h-full rounded-full object-cover" />
                          ) : (
                            conversation.user.name.split(' ').map(n => n[0]).join('').toUpperCase()
                          )}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h3 className="font-medium truncate">{conversation.user.name}</h3>
                            <div className="flex items-center space-x-1">
                              {getChannelIcon(conversation.channel)}
                              <span className="text-xs text-gray-500 dark:text-gray-400">
                                {conversation.lastMessage.timestamp.toLocaleTimeString('fr-FR', { 
                                  hour: '2-digit', 
                                  minute: '2-digit' 
                                })}
                              </span>
                            </div>
                          </div>
                          
                          <p className="text-sm text-gray-600 dark:text-gray-300 truncate mt-1">
                            {conversation.lastMessage.text}
                          </p>
                          
                          <div className="flex items-center justify-between mt-2">
                            <div className="flex items-center space-x-2">
                              {/* Status Badge */}
                              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium text-white ${getStatusColor(conversation.status)}`}>
                                {conversation.status === 'active' && 'Active'}
                                {conversation.status === 'pending' && 'En attente'}
                                {conversation.status === 'resolved' && 'Résolue'}
                                {conversation.status === 'escalated' && 'Escaladée'}
                              </span>
                              
                              {/* Priority Badge */}
                              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium text-white ${getPriorityColor(conversation.priority)}`}>
                                {conversation.priority === 'urgent' && 'Urgent'}
                                {conversation.priority === 'high' && 'Élevée'}
                                {conversation.priority === 'medium' && 'Moyenne'}
                                {conversation.priority === 'low' && 'Faible'}
                              </span>
                            </div>
                            
                            {/* Unread Count */}
                            {conversation.unreadCount > 0 && (
                              <span className="inline-flex items-center justify-center w-6 h-6 bg-red-500 text-white rounded-full text-xs font-medium">
                                {conversation.unreadCount}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      {/* Actions Menu */}
                      <div className="relative ml-2">
                        <button
                          className={`p-1 rounded-full ${darkMode ? 'hover:bg-gray-600 text-gray-400' : 'hover:bg-gray-200 text-gray-500'} transition-colors`}
                          onClick={(e) => {
                            e.stopPropagation();
                            // Toggle actions menu
                          }}
                        >
                          <FiMoreVertical className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
          
          {/* Right Panel - Chat Interface */}
          <div className="flex-1 flex flex-col">
            {selectedConversation ? (
              <>
                {/* Chat Header */}
                <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b px-6 py-4`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      {/* User Avatar */}
                      <div className="w-12 h-12 rounded-full bg-gradient-to-r from-green-600 via-yellow-500 to-red-600 flex items-center justify-center text-white font-medium">
                        {selectedConversation.user.avatar ? (
                          <img src={selectedConversation.user.avatar} alt="" className="w-full h-full rounded-full object-cover" />
                        ) : (
                          selectedConversation.user.name.split(' ').map(n => n[0]).join('').toUpperCase()
                        )}
                      </div>
                      
                      <div>
                        <h2 className="text-lg font-semibold">{selectedConversation.user.name}</h2>
                        <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                          <span className="flex items-center">
                            <FiMail className="w-4 h-4 mr-1" />
                            {selectedConversation.user.email}
                          </span>
                          <span className="flex items-center">
                            <FiPhone className="w-4 h-4 mr-1" />
                            {selectedConversation.user.phone}
                          </span>
                          <span className="flex items-center">
                            <FiClock className="w-4 h-4 mr-1" />
                            Vu il y a {selectedConversation.user.lastSeen}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      {/* Status Update Buttons */}
                      {selectedConversation.status !== 'resolved' && (
                        <button
                          onClick={() => updateConversationStatus(selectedConversation.id, 'resolved')}
                          className="inline-flex items-center px-3 py-1.5 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
                        >
                          <FiCheckCircle className="w-4 h-4 mr-1" />
                          Marquer comme résolu
                        </button>
                      )}
                      
                      {selectedConversation.status !== 'escalated' && (
                        <button
                          onClick={() => updateConversationStatus(selectedConversation.id, 'escalated')}
                          className="inline-flex items-center px-3 py-1.5 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
                        >
                          <FiArrowUp className="w-4 h-4 mr-1" />
                          Escalader
                        </button>
                      )}
                      
                      <button
                        onClick={() => deleteConversation(selectedConversation.id)}
                        className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-600'} transition-colors`}
                      >
                        <FiTrash2 className="w-5 h-5" />
                      </button>
                      
                      <button className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-600'} transition-colors`}>
                        <FiArchive className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
                
                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                  {selectedConversation.messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.isFromUser ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-xs lg:max-w-md xl:max-w-lg ${
                        message.isFromUser
                          ? 'bg-green-600 text-white rounded-l-lg rounded-tr-lg'
                          : message.isAI
                          ? `${darkMode ? 'bg-blue-900 text-blue-100' : 'bg-blue-100 text-blue-900'} rounded-r-lg rounded-tl-lg border border-blue-200 dark:border-blue-800`
                          : `${darkMode ? 'bg-gray-700 text-gray-100' : 'bg-gray-100 text-gray-900'} rounded-r-lg rounded-tl-lg`
                      } px-4 py-2 shadow-sm`}>
                        {message.isAI && (
                          <div className="flex items-center mb-2 text-xs opacity-75">
                            <FiZap className="w-3 h-3 mr-1" />
                            Assistant IA
                          </div>
                        )}
                        <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                        <p className={`text-xs mt-1 ${
                          message.isFromUser 
                            ? 'text-green-100' 
                            : message.isAI 
                            ? 'text-blue-600 dark:text-blue-300' 
                            : 'text-gray-500 dark:text-gray-400'
                        }`}>
                          {message.timestamp.toLocaleTimeString('fr-FR', { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </p>
                      </div>
                    </div>
                  ))}
                  
                  {/* Typing Indicator */}
                  {isTyping && (
                    <div className="flex justify-start">
                      <div className={`max-w-xs lg:max-w-md xl:max-w-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} rounded-r-lg rounded-tl-lg px-4 py-2 shadow-sm`}>
                        <div className="flex items-center space-x-2">
                          <FiZap className="w-4 h-4 text-blue-500" />
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                          </div>
                          <span className="text-xs text-gray-500 dark:text-gray-400">Assistant IA tape...</span>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div ref={messagesEndRef} />
                </div>
                
                {/* Message Input */}
                <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-t px-6 py-4`}>
                  <div className="flex items-end space-x-4">
                    <div className="flex-1">
                      <div className="relative">
                        <textarea
                          ref={messageInputRef}
                          value={messageText}
                          onChange={(e) => setMessageText(e.target.value)}
                          onKeyPress={handleKeyPress}
                          placeholder="Tapez votre message... (Entrée pour envoyer, Maj+Entrée pour nouvelle ligne)"
                          className={`w-full px-4 py-3 pr-12 rounded-lg border resize-none ${
                            darkMode 
                              ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                              : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500'
                          } focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all`}
                          rows={1}
                          style={{ minHeight: '44px', maxHeight: '120px' }}
                        />
                        
                        {/* Emoji Button */}
                        <button
                          className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${
                            darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-600'
                          } transition-colors`}
                        >
                          <FiSmile className="w-5 h-5" />
                        </button>
                      </div>
                      
                      {/* Quick Actions */}
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center space-x-2">
                          <button className={`p-1 rounded ${darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-600'} transition-colors`}>
                            <FiPaperclip className="w-4 h-4" />
                          </button>
                          
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {messageText.length}/1000 caractères
                          </span>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          {aiEnabled && (
                            <span className="text-xs text-green-600 dark:text-green-400">
                              IA activée - Réponse automatique
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <button
                      onClick={sendMessage}
                      disabled={!messageText.trim()}
                      className={`px-6 py-3 rounded-lg font-medium transition-all ${
                        messageText.trim()
                          ? 'bg-green-600 text-white hover:bg-green-700 shadow-md hover:shadow-lg'
                          : `${darkMode ? 'bg-gray-700 text-gray-400' : 'bg-gray-200 text-gray-400'} cursor-not-allowed`
                      }`}
                    >
                      <FiSend className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </>
            ) : (
              /* No Conversation Selected */
              <div className="flex-1 flex flex-col items-center justify-center text-gray-500 dark:text-gray-400">
                <FiMessageSquare className="w-24 h-24 mb-6 opacity-50" />
                <h3 className="text-xl font-medium mb-2">Sélectionnez une conversation</h3>
                <p className="text-center max-w-md">
                  Choisissez une conversation dans la liste de gauche pour commencer à répondre aux clients.
                </p>
                <div className="mt-8 grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                      <FiZap className="w-4 h-4 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <p className="font-medium">Assistant IA</p>
                      <p className="text-xs text-gray-400">Réponses automatiques intelligentes</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                      <FiTrendingUp className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <p className="font-medium">Analyses temps réel</p>
                      <p className="text-xs text-gray-400">Statistiques et métriques</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminSupportPage;