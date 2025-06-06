import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import {
  FiSearch, FiFilter, FiMessageSquare, FiPhone, FiMail, FiClock, FiUser,
  FiSend, FiSmile, FiPaperclip, FiCheck, FiCheckCircle, FiAlertCircle, FiArrowUp,
  FiUsers, FiTrash2, FiEdit3, FiMoreVertical, FiRefreshCw, FiTrendingUp, FiActivity,
  FiHeadphones, FiZap, FiBell, FiSettings, FiEye, FiArchive, FiChevronLeft, FiX
} from 'react-icons/fi';
import AdminLayout from '../../../../layouts/admin_layout';

// Mock data (gardée telle quelle)
const MOCK_CONVERSATIONS = [
  {
    id: 1, user: { name: 'Marie Dupont', email: 'marie.dupont@email.com', phone: '+237 6XX XXX XXX', avatar: null, lastSeen: '2 min' },
    lastMessage: { text: 'Bonjour, j\'ai un problème avec ma commande #12345', timestamp: new Date(Date.now() - 2 * 60 * 1000), isFromUser: true },
    status: 'active', priority: 'urgent', channel: 'WhatsApp', unreadCount: 3,
    messages: [ { id: 1, text: 'Bonjour ! Comment puis-je vous aider aujourd\'hui ?', timestamp: new Date(Date.now() - 30 * 60 * 1000), isFromUser: false, isAI: false }, { id: 2, text: 'Bonjour, j\'ai passé une commande ce matin mais elle n\'est jamais arrivée', timestamp: new Date(Date.now() - 25 * 60 * 1000), isFromUser: true }, { id: 3, text: 'Je suis désolé pour ce désagrément. Pouvez-vous me donner votre numéro de commande ?', timestamp: new Date(Date.now() - 20 * 60 * 1000), isFromUser: false, isAI: false }, { id: 4, text: 'Le numéro de commande est #12345', timestamp: new Date(Date.now() - 15 * 60 * 1000), isFromUser: true }, { id: 5, text: 'Bonjour, j\'ai un problème avec ma commande #12345', timestamp: new Date(Date.now() - 2 * 60 * 1000), isFromUser: true } ]
  },
  {
    id: 2, user: { name: 'Jean Kamga', email: 'jean.kamga@email.com', phone: '+237 6XX XXX XXX', avatar: null, lastSeen: '5 min' },
    lastMessage: { text: 'Merci pour votre aide, problème résolu !', timestamp: new Date(Date.now() - 5 * 60 * 1000), isFromUser: true },
    status: 'resolved', priority: 'medium', channel: 'email', unreadCount: 0,
    messages: [ { id: 1, text: 'J\'ai des difficultés à mettre à jour mon profil restaurant', timestamp: new Date(Date.now() - 120 * 60 * 1000), isFromUser: true }, { id: 2, text: 'Je vais vous guider étape par étape pour mettre à jour votre profil.', timestamp: new Date(Date.now() - 115 * 60 * 1000), isFromUser: false, isAI: true }, { id: 3, text: 'Merci pour votre aide, problème résolu !', timestamp: new Date(Date.now() - 5 * 60 * 1000), isFromUser: true } ]
  },
  {
    id: 3, user: { name: 'Restaurant Le Savoir', email: 'contact@lesavoir.cm', phone: '+237 6XX XXX XXX', avatar: null, lastSeen: '1h' },
    lastMessage: { text: 'Comment puis-je augmenter ma visibilité sur la plateforme ?', timestamp: new Date(Date.now() - 60 * 60 * 1000), isFromUser: true },
    status: 'pending', priority: 'high', channel: 'chat', unreadCount: 1,
    messages: [ { id: 1, text: 'Comment puis-je augmenter ma visibilité sur la plateforme ?', timestamp: new Date(Date.now() - 60 * 60 * 1000), isFromUser: true } ]
  },
  {
    id: 4, user: { name: 'Paul Mballa', email: 'paul.mballa@email.com', phone: '+237 6XX XXX XXX', avatar: null, lastSeen: '2h' },
    lastMessage: { text: 'L\'application plante quand j\'essaie de passer commande', timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000), isFromUser: true },
    status: 'escalated', priority: 'urgent', channel: 'WhatsApp', unreadCount: 2,
    messages: [ { id: 1, text: 'L\'application plante quand j\'essaie de passer commande', timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000), isFromUser: true }, { id: 2, text: 'Ce problème a été escaladé à notre équipe technique.', timestamp: new Date(Date.now() - 2.5 * 60 * 60 * 1000), isFromUser: false, isAI: false } ]
  }
];


const AdminSupportPage = () => {
  const { t } = useTranslation();
  const [darkMode, setDarkMode] = useState(() => document.documentElement.classList.contains('dark'));
  const [isMobile, setIsMobile] = useState(false);
  const [showConversationList, setShowConversationList] = useState(true);
  const [showChatView, setShowChatView] = useState(false);
  const [showFiltersPopup, setShowFiltersPopup] = useState(false); // Pour un modal de filtres sur mobile
  
  const [conversations, setConversations] = useState(MOCK_CONVERSATIONS);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [channelFilter, setChannelFilter] = useState('all');
  
  const [messageText, setMessageText] = useState('');
  const [aiEnabled, setAiEnabled] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  
  const messagesEndRef = useRef(null);
  const messageInputRef = useRef(null);
  const emojiPickerRef = useRef(null);
  
  useEffect(() => {
    const checkIfMobile = () => {
      const mobile = window.innerWidth < 768; // md breakpoint
      setIsMobile(mobile);
      if (!mobile) { // Si on passe en desktop, on ferme le popup de filtres
        setShowFiltersPopup(false);
      }
    };
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);
  
  useEffect(() => {
    if (isMobile) {
      if (selectedConversation) {
        setShowConversationList(false);
        setShowChatView(true);
      } else {
        setShowConversationList(true);
        setShowChatView(false);
      }
    } else {
      setShowConversationList(true);
      setShowChatView(true);
    }
  }, [isMobile, selectedConversation]);
  
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [selectedConversation?.messages, isTyping]);
  
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target)) {
        setShowEmojiPicker(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  const filteredConversations = conversations.filter(conv => {
    const matchesTab = activeTab === 'all' ||
                       (activeTab === 'unread' && conv.unreadCount > 0) ||
                       (activeTab === 'active' && conv.status === 'active') ||
                       (activeTab === 'resolved' && conv.status === 'resolved');
    const matchesSearch = conv.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         conv.user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (conv.lastMessage.text && conv.lastMessage.text.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || conv.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || conv.priority === priorityFilter;
    const matchesChannel = channelFilter === 'all' || conv.channel.toLowerCase() === channelFilter.toLowerCase();
    return matchesTab && matchesSearch && matchesStatus && matchesPriority && matchesChannel;
  });
  
  const generateAIResponse = async (conversationContext) => {
    setIsTyping(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    const responses = [ "Je comprends...", "Merci de nous avoir contactés...", "Je suis désolé...", "Votre feedback...", "Je vais vérifier..." ];
    setIsTyping(false); // Ensure isTyping is set to false after AI "response"
    return responses[Math.floor(Math.random() * responses.length)];
  };
  
  const sendMessage = async () => {
    if (!messageText.trim() || !selectedConversation) return;
    const userMessage = { id: Date.now(), text: messageText, timestamp: new Date(), isFromUser: false, isAI: false };
    
    const updatedConversations = prevConversations => prevConversations.map(conv => 
      conv.id === selectedConversation.id 
        ? { ...conv, messages: [...conv.messages, userMessage], lastMessage: { ...userMessage, isFromUser: false }, unreadCount: 0 }
        : conv
    );
    setConversations(updatedConversations);
    setSelectedConversation(prev => ({ ...prev, messages: [...prev.messages, userMessage], unreadCount: 0 }));
    
    const currentMessageText = messageText; // Capture messageText before clearing
    setMessageText('');
    
    if (aiEnabled) {
      const aiResponseText = await generateAIResponse(selectedConversation.messages);
      const aiMessage = { id: Date.now() + 1, text: aiResponseText, timestamp: new Date(), isFromUser: false, isAI: true };
      
      setConversations(prevConvs => prevConvs.map(conv => 
        conv.id === selectedConversation.id 
          ? { ...conv, messages: [...conv.messages, aiMessage], lastMessage: aiMessage }
          : conv
      ));
      setSelectedConversation(prev => ({ ...prev, messages: [...prev.messages, aiMessage] }));
    }
  };
  
  const handleKeyPress = (e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } };
  
  const updateConversationStatus = (conversationId, newStatus) => {
    setConversations(prev => prev.map(conv => conv.id === conversationId ? { ...conv, status: newStatus } : conv));
    if (selectedConversation?.id === conversationId) setSelectedConversation(prev => ({ ...prev, status: newStatus }));
  };
  
  const deleteConversation = (conversationId) => {
    setConversations(prev => prev.filter(conv => conv.id !== conversationId));
    if (selectedConversation?.id === conversationId) {
      setSelectedConversation(null);
      if (isMobile) { setShowConversationList(true); setShowChatView(false); }
    }
  };
  
  const getStatusColor = (status) => ({ active: 'bg-green-500', pending: 'bg-yellow-500', resolved: 'bg-gray-500', escalated: 'bg-red-500' }[status] || 'bg-gray-500');
  const getPriorityColor = (priority) => ({ urgent: 'bg-red-500', high: 'bg-orange-500', medium: 'bg-yellow-500', low: 'bg-blue-500' }[priority] || 'bg-gray-500');
  const getChannelIcon = (channel) => ({ whatsapp: <FiMessageSquare className="w-4 h-4" />, email: <FiMail className="w-4 h-4" />, chat: <FiHeadphones className="w-4 h-4" /> }[channel.toLowerCase()] || <FiMessageSquare className="w-4 h-4" />);
  
  const stats = {
    total: conversations.length,
    active: conversations.filter(c => c.status === 'active').length,
    pending: conversations.filter(c => c.status === 'pending').length,
    resolved: conversations.filter(c => c.status === 'resolved').length,
    escalated: conversations.filter(c => c.status === 'escalated').length,
    unread: conversations.reduce((sum, c) => sum + (c.unreadCount || 0), 0)
  };

  const handleSelectConversation = (conversation) => {
    const updatedConv = conversations.map(c => c.id === conversation.id ? { ...c, unreadCount: 0 } : c);
    setConversations(updatedConv);
    setSelectedConversation({ ...conversation, unreadCount: 0 });
    if (isMobile) { setShowConversationList(false); setShowChatView(true); }
  };

  const handleBackToList = () => { setSelectedConversation(null); if (isMobile) { setShowConversationList(true); setShowChatView(false); } };
  const addEmoji = (emoji) => { setMessageText(prev => prev + emoji.native); setShowEmojiPicker(false); messageInputRef.current?.focus(); };

  const renderFilters = (isPopup = false) => (
    <div className={`flex flex-col sm:flex-row sm:flex-wrap gap-2 ${isPopup ? 'p-4 space-y-3' : 'flex-1'}`}>
      <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
        className={`w-full sm:w-auto px-2 py-1.5 rounded-full text-xs border ${darkMode ? 'bg-gray-700 border-gray-600 text-gray-200' : 'bg-gray-100 border-gray-300 text-gray-700'} focus:outline-none focus:ring-1 focus:ring-green-500`}>
        <option value="all">Tous statuts</option><option value="active">Actives</option><option value="pending">En attente</option><option value="resolved">Résolues</option><option value="escalated">Escaladées</option>
      </select>
      <select value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)}
        className={`w-full sm:w-auto px-2 py-1.5 rounded-full text-xs border ${darkMode ? 'bg-gray-700 border-gray-600 text-gray-200' : 'bg-gray-100 border-gray-300 text-gray-700'} focus:outline-none focus:ring-1 focus:ring-green-500`}>
        <option value="all">Toutes priorités</option><option value="urgent">Urgent</option><option value="high">Élevée</option><option value="medium">Moyenne</option><option value="low">Faible</option>
      </select>
      <select value={channelFilter} onChange={(e) => setChannelFilter(e.target.value)}
        className={`w-full sm:w-auto px-2 py-1.5 rounded-full text-xs border ${darkMode ? 'bg-gray-700 border-gray-600 text-gray-200' : 'bg-gray-100 border-gray-300 text-gray-700'} focus:outline-none focus:ring-1 focus:ring-green-500`}>
        <option value="all">Tous canaux</option><option value="whatsapp">WhatsApp</option><option value="email">Email</option><option value="chat">Chat</option>
      </select>
       {isPopup && (
        <button 
            onClick={() => setShowFiltersPopup(false)}
            className="w-full mt-3 px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
        >
            Appliquer les filtres
        </button>
      )}
    </div>
  );

  return (
    <AdminLayout>
      <div className={`h-screen flex flex-col ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
        {/* Header */}
        <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b px-4 py-3`}>
          <div className="flex items-center justify-between">
            {isMobile && showChatView && selectedConversation ? (
               <div className="flex items-center min-w-0">
                <button onClick={handleBackToList} className={`p-2 mr-1 rounded-full ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}>
                  <FiChevronLeft className="w-5 h-5" />
                </button>
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-green-500 to-blue-500 flex items-center justify-center text-white text-sm font-semibold mr-2 flex-shrink-0">
                  {selectedConversation.user.name.charAt(0).toUpperCase()}
                </div>
                <span className="font-semibold text-base truncate">{selectedConversation.user.name}</span>
              </div>
            ) : (
              <h1 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-green-600 via-yellow-500 to-red-600 bg-clip-text text-transparent">
                {t('support services')}
              </h1>
            )}
            
            <div className="flex items-center space-x-2">
              {(!isMobile || !showChatView) && ( // Show these buttons if not mobile OR if on mobile but on conversation list view
                <>
                  <button
                    onClick={() => setShowStats(!showStats)}
                    title="Statistiques"
                    className={`p-2 rounded-lg transition-colors ${showStats ? 'bg-green-600 text-white' : (darkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-600')}`}
                  > <FiActivity className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setAiEnabled(!aiEnabled)}
                    title={aiEnabled ? "Désactiver l'assistant IA" : "Activer l'assistant IA"}
                    className={`p-2 rounded-lg transition-colors ${aiEnabled ? 'bg-green-600 text-white' : (darkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-600')}`}
                  > <FiZap className={`w-5 h-5 ${aiEnabled ? '' : 'opacity-50'}`} />
                  </button>
                </>
              )}
              <button title="Notifications" className={`relative p-2 rounded-lg ${darkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-600'} transition-colors`}>
                <FiBell className="w-5 h-5" />
                {stats.unread > 0 && (<span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-current"></span>)}
              </button>
            </div>
          </div>
          
          {showStats && (
            <div className="mt-3 grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-3 md:grid-cols-6 gap-2">
              {[
                { label: 'Total', value: stats.total, icon: <FiUsers className="text-blue-500" /> },
                { label: 'Actives', value: stats.active, color: 'bg-green-500' },
                { label: 'En attente', value: stats.pending, color: 'bg-yellow-500' },
                { label: 'Résolues', value: stats.resolved, color: 'bg-gray-500' },
                { label: 'Escaladées', value: stats.escalated, color: 'bg-red-500' },
                { label: 'Non lus', value: stats.unread, icon: <FiEye className="text-orange-500" /> },
              ].map(stat => (
                <div key={stat.label} className={`${darkMode ? 'bg-gray-700' : 'bg-white'} p-2.5 rounded-lg shadow-sm border ${darkMode ? 'border-gray-600' : 'border-gray-200'}`}>
                  <div className="flex items-center space-x-2">
                    {stat.icon ? React.cloneElement(stat.icon, {className: "w-4 h-4"}) : <div className={`w-2.5 h-2.5 ${stat.color} rounded-full`}></div>}
                    <div className="min-w-0">
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{stat.label}</p>
                      <p className="text-md font-semibold truncate">{stat.value}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="flex-1 flex overflow-hidden">
          {showConversationList && (
            <div className={`w-full md:w-2/5 lg:w-1/3 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-r flex flex-col`}>
              <div className="p-3 space-y-3">
                <div className="relative">
                  <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Rechercher..."
                    className={`w-full pl-9 pr-3 py-2 rounded-lg border text-sm ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500'} focus:ring-1 focus:ring-green-500 focus:border-transparent`}
                  />
                </div>
                
                <div className={`flex border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'} overflow-x-auto no-scrollbar`}> {/* Pour le scroll horizontal si besoin, ajoutez .scrollbar-thin etc. si plugin tailwind-scrollbar est utilisé */}
                  {[{key: 'all', label: 'Toutes'}, {key: 'unread', label: 'Non lues', count: stats.unread}, {key: 'active', label: 'Actives'}, {key: 'resolved', label: 'Résolues'}].map(tab => (
                    <button key={tab.key} onClick={() => setActiveTab(tab.key)}
                      className={`py-2 px-3 text-center text-sm font-medium whitespace-nowrap ${activeTab === tab.key ? 'border-b-2 border-green-500 text-green-600 dark:text-green-400' : `text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 ${darkMode ? 'hover:border-gray-500' : 'hover:border-gray-300'}`}`}>
                      {tab.label} {tab.count > 0 && <span className="ml-1 inline-flex items-center justify-center px-1.5 py-0.5 text-xs bg-red-500 text-white rounded-full">{tab.count}</span>}
                    </button>
                  ))}
                </div>
                
                <div className="flex items-center justify-between">
                  {isMobile ? (
                     <button onClick={() => setShowFiltersPopup(true)}
                      className={`flex items-center w-full justify-center px-3 py-1.5 rounded-lg text-sm font-medium ${darkMode ? 'bg-gray-700 hover:bg-gray-600 text-gray-200' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'}`}>
                      <FiFilter className="w-4 h-4 mr-1.5" /> Filtres
                    </button>
                  ) : renderFilters()}
                </div>
              </div>
              
              <div className="flex-1 overflow-y-auto">
                {filteredConversations.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-gray-400 dark:text-gray-500 p-4">
                    <FiMessageSquare className="w-16 h-16 mb-4 opacity-30" />
                    <p className="text-center text-sm">Aucune conversation à afficher.</p>
                  </div>
                ) : (
                  filteredConversations.map((conv) => (
                    <div key={conv.id} onClick={() => handleSelectConversation(conv)}
                      className={`p-3 border-b cursor-pointer transition-colors ${darkMode ? 'border-gray-700 hover:bg-gray-750' : 'border-gray-200 hover:bg-gray-50'} ${selectedConversation?.id === conv.id ? `${darkMode ? 'bg-gray-750' : 'bg-green-50'} border-l-4 border-l-green-500` : ''}`}>
                      <div className="flex items-start space-x-3">
                        <div className="relative flex-shrink-0">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-500 via-red-500 to-yellow-500 flex items-center justify-center text-white font-semibold text-sm">
                            {conv.user.avatar ? <img src={conv.user.avatar} alt="" className="w-full h-full rounded-full object-cover" /> : conv.user.name.split(' ').map(n=>n[0]).join('').toUpperCase()}
                          </div>
                          {conv.user.lastSeen === 'now' && <div className={`absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 ${darkMode ? 'border-gray-800' : 'border-white'}`}></div>}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h3 className="text-sm font-medium truncate">{conv.user.name}</h3>
                            <span className="text-xs text-gray-400 dark:text-gray-500 whitespace-nowrap">
                              {conv.lastMessage.timestamp.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5">
                            {conv.lastMessage.isFromUser ? "Vous: " : ""}{conv.lastMessage.text}
                          </p>
                          <div className="flex items-center justify-between mt-1.5">
                            <div className="flex items-center space-x-1.5 flex-wrap">
                              <span className={`inline-flex items-center px-1.5 py-0.5 rounded-full text-[0.65rem] font-medium text-white ${getStatusColor(conv.status)}`}>{t(`status.${conv.status}`, conv.status)}</span>
                              <span className={`inline-flex items-center px-1.5 py-0.5 rounded-full text-[0.65rem] font-medium text-white ${getPriorityColor(conv.priority)}`}>{t(`priority.${conv.priority}`, conv.priority)}</span>
                              <span className={`inline-flex items-center px-1.5 py-0.5 rounded-full text-[0.65rem] font-medium ${darkMode ? "bg-gray-600 text-gray-300" : "bg-gray-200 text-gray-700"}`}>{getChannelIcon(conv.channel)}<span className="ml-1">{conv.channel}</span></span>
                            </div>
                            {conv.unreadCount > 0 && <span className="inline-flex items-center justify-center w-5 h-5 bg-red-500 text-white rounded-full text-xs font-semibold">{conv.unreadCount}</span>}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
          
          {showFiltersPopup && isMobile && (
            <div className="fixed inset-0 z-20 bg-black bg-opacity-50 flex items-center justify-center p-4">
              <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-xl w-full max-w-sm`}>
                <div className="flex justify-between items-center p-4 border-b dark:border-gray-700">
                  <h3 className="font-semibold">Filtres</h3>
                  <button onClick={() => setShowFiltersPopup(false)} className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
                    <FiX />
                  </button>
                </div>
                {renderFilters(true)}
              </div>
            </div>
          )}
          
          {showChatView && (
            <div className={`${isMobile ? 'w-full' : 'flex-1'} flex flex-col ${darkMode ? 'bg-gray-850' : 'bg-gray-100'}`}> {/* Changed chat bg for contrast */}
              {selectedConversation ? (
                <>
                  <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b px-4 py-3`}>
                    <div className="flex items-center justify-between">
                      {!isMobile && (
                          <div className="flex items-center space-x-3 min-w-0">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-semibold flex-shrink-0">
                                {selectedConversation.user.avatar ? <img src={selectedConversation.user.avatar} alt="" className="w-full h-full rounded-full object-cover" /> : selectedConversation.user.name.split(' ').map(n=>n[0]).join('').toUpperCase()}
                            </div>
                            <div className="min-w-0">
                                <h2 className="text-base font-semibold truncate">{selectedConversation.user.name}</h2>
                                <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
                                  <span className="flex items-center truncate">{getChannelIcon(selectedConversation.channel)}<span className="ml-1">{selectedConversation.channel}</span></span>
                                  <span className="hidden xs:flex items-center truncate"><FiMail className="w-3 h-3 mr-1" />{selectedConversation.user.email}</span>
                                  <span className="hidden sm:flex items-center"><FiClock className="w-3 h-3 mr-1" />Vu il y a {selectedConversation.user.lastSeen}</span>
                                </div>
                            </div>
                         </div>
                      )}
                      
                       <div className={`flex items-center space-x-2 ${isMobile ? 'ml-auto' : ''}`}>
                        {selectedConversation.status !== 'resolved' && <button onClick={() => updateConversationStatus(selectedConversation.id, 'resolved')} title="Marquer comme résolu" className="p-1.5 bg-green-100 text-green-700 dark:bg-green-700 dark:text-green-100 rounded-lg hover:bg-green-200 dark:hover:bg-green-600"><FiCheckCircle className="w-4 h-4" /></button>}
                        {selectedConversation.status !== 'escalated' && <button onClick={() => updateConversationStatus(selectedConversation.id, 'escalated')} title="Escalader" className="p-1.5 bg-red-100 text-red-700 dark:bg-red-700 dark:text-red-100 rounded-lg hover:bg-red-200 dark:hover:bg-red-600"><FiArrowUp className="w-4 h-4" /></button>}
                        <button onClick={() => deleteConversation(selectedConversation.id)} title="Supprimer" className={`p-1.5 rounded-lg ${darkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-200 text-gray-500'} `}><FiTrash2 className="w-4 h-4" /></button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    {selectedConversation.messages.map((msg) => (
                      <div key={msg.id} className={`flex ${msg.isFromUser ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[80%] sm:max-w-[70%] px-3 py-2 rounded-lg shadow-sm ${msg.isFromUser ? 'bg-green-600 text-white rounded-l-lg rounded-tr-lg' : (msg.isAI ? `${darkMode ? 'bg-blue-800 text-blue-100' : 'bg-blue-100 text-blue-800'} rounded-r-lg rounded-tl-lg border ${darkMode ? 'border-blue-700':'border-blue-200'}` : `${darkMode ? 'bg-gray-700 text-gray-100' : 'bg-gray-200 text-gray-800'} rounded-r-lg rounded-tl-lg`)}`}>
                          {msg.isAI && <div className="flex items-center mb-1 text-xs opacity-80"><FiZap className="w-3 h-3 mr-1" /> Assistant IA</div>}
                          <p className="text-sm whitespace-pre-wrap break-words">{msg.text}</p>
                          <div className={`flex items-center mt-1 text-xs ${msg.isFromUser ? 'text-green-100 opacity-70 justify-end' : (msg.isAI ? `${darkMode ? 'text-blue-300' : 'text-blue-600'} opacity-70` : 'text-gray-500 dark:text-gray-400 opacity-70')}`}>
                            <span>{msg.timestamp.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</span>
                            {msg.isFromUser && <FiCheck className="w-3 h-3 ml-1" />}
                          </div>
                        </div>
                      </div>
                    ))}
                    {isTyping && <div className="flex justify-start"><div className={`max-w-xs px-4 py-2 shadow-sm ${darkMode ? 'bg-gray-700':'bg-gray-100'} rounded-r-lg rounded-tl-lg`}><div className="flex items-center space-x-1.5"><FiZap className="w-3.5 h-3.5 text-blue-500" /><div className="flex space-x-0.5"><div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></div><div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-75"></div><div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-150"></div></div><span className="text-xs text-gray-500 dark:text-gray-400">Assistant IA tape...</span></div></div></div>}
                    <div ref={messagesEndRef} />
                  </div>
                  
                  <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-t px-3 py-2.5`}>
                    <div className="flex items-end space-x-2">
                      <div className="flex-1 relative">
                        <textarea ref={messageInputRef} value={messageText} onChange={(e) => setMessageText(e.target.value)} onKeyPress={handleKeyPress}
                          placeholder="Votre message..." rows={1} style={{ minHeight: '40px', maxHeight: '100px' }}
                          className={`w-full px-3 py-2 pr-12 text-sm rounded-lg border resize-none ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-gray-50 border-gray-300 text-gray-800 placeholder-gray-400'} focus:ring-1 focus:ring-green-500 focus:border-transparent`}
                        />
                        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center">
                          <button onClick={() => setShowEmojiPicker(!showEmojiPicker)} title="Emojis" className={`p-1 rounded-full ${darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'}`}>
                            <FiSmile className="w-4.5 h-4.5" /> {/* Icône légèrement plus grande */}
                          </button>
                          {showEmojiPicker && (
                            <div ref={emojiPickerRef} className="absolute bottom-full right-0 mb-1 z-10">
                              <div className={`p-2 rounded-lg shadow-lg border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'}`}>
                                <div className="grid grid-cols-6 gap-1 text-lg"> {/* Emojis plus grands */}
                                  {['😀', '😂', '😍', '👍', '👋', '🙏', '😊', '🎉', '🤔', '😥', '😠', '💯'].map(emoji => (
                                    <button key={emoji} onClick={() => addEmoji({ native: emoji })} className={`p-1 hover:bg-opacity-20 ${darkMode ? 'hover:bg-gray-600':'hover:bg-gray-200'} rounded`}>{emoji}</button>
                                  ))}
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                      <button onClick={sendMessage} disabled={!messageText.trim()} title="Envoyer"
                        className={`p-2.5 rounded-lg font-medium transition-all ${messageText.trim() ? 'bg-green-600 text-white hover:bg-green-700 shadow-md' : `${darkMode ? 'bg-gray-700 text-gray-500' : 'bg-gray-200 text-gray-400'} cursor-not-allowed`}`}>
                        <FiSend className="w-4.5 h-4.5" />
                      </button>
                    </div>
                    <div className="flex items-center justify-between mt-1.5 text-xs">
                        <button title="Joindre un fichier" className={`${darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'} p-1`}><FiPaperclip className="w-3.5 h-3.5" /></button>
                        <span className={`${messageText.length > 1000 ? 'text-red-500' : (darkMode ? 'text-gray-400' : 'text-gray-500')}`}>{messageText.length}/1000</span>
                    </div>
                  </div>
                </>
              ) : (
                !isMobile && (
                  <div className="flex-1 flex flex-col items-center justify-center text-center p-6 text-gray-400 dark:text-gray-500">
                    <div className="relative w-28 h-28 sm:w-32 sm:h-32 mb-5">
                      <div className="absolute inset-0 bg-gradient-to-br from-green-500 via-yellow-500 to-red-500 rounded-full opacity-10 animate-pulse"></div>
                      <FiMessageSquare className="absolute inset-0 m-auto w-14 h-14 sm:w-16 sm:h-16 opacity-40" />
                    </div>
                    <h3 className="text-lg sm:text-xl font-medium mb-1.5">{t('noConversationSelected.title', 'Sélectionnez une conversation')}</h3>
                    <p className="text-sm sm:text-base max-w-sm">{t('noConversationSelected.description', 'Choisissez une conversation dans la liste pour afficher les messages et répondre.')}</p>
                  </div>
                )
              )}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminSupportPage;