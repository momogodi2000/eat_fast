import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import AdminLayout from '../../../../layouts/admin_layout';
import { 
  FiSend, 
  FiRefreshCw, 
  FiAlertCircle, 
  FiCheckCircle,
  FiUser,
  FiMessageCircle,
  FiMail,
  FiFilter,
  FiCalendar,
  FiClock,
  FiSearch,
  FiBell,
  FiInfo,
  FiArrowRightCircle
} from 'react-icons/fi';
import { HiOutlineBot, HiOutlineUserCircle } from 'react-icons/hi';
import {  AnimatePresence } from 'framer-motion';
import SupportChatView from './SupportChatView';
import SupportConversationList from './SupportConversationList';

const AdminSupportPage = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('chat');
  const [darkMode, setDarkMode] = useState(false);
  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [messageInput, setMessageInput] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showNotification, setShowNotification] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [showUserInfoPanel, setShowUserInfoPanel] = useState(false);
  const chatEndRef = useRef(null);
  const [isTyping, setIsTyping] = useState(false);
  const [availabilityStatus, setAvailabilityStatus] = useState('available');
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [autoResponse, setAutoResponse] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);
  
  // Detect dark mode and mobile view
  useEffect(() => {
    const isDark = document.documentElement.classList.contains('dark');
    setDarkMode(isDark);
    
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setShowSidebar(false);
      } else {
        setShowSidebar(true);
      }
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Load mock data
  useEffect(() => {
    const mockConversations = [
      {
        id: 1,
        customer: {
          id: 101,
          name: 'Sophie Martin',
          email: 'sophie.martin@example.com',
          phone: '+33 6 12 34 56 78',
          avatar: 'https://randomuser.me/api/portraits/women/11.jpg',
          location: 'Paris, France',
          memberSince: '2022-03-15',
          orderCount: 12
        },
        subject: 'Problème avec ma commande #EF2305',
        status: 'active',
        priority: 'high',
        category: 'delivery',
        assignedTo: 'admin',
        createdAt: '2023-05-14T09:30:00.000Z',
        lastMessage: '2023-05-15T14:35:00.000Z',
        unread: 2,
        messages: [
          {
            id: 1,
            sender: 'customer',
            content: 'Bonjour, je n\'ai toujours pas reçu ma commande #EF2305 qui devait arriver hier. Pouvez-vous m\'aider?',
            timestamp: '2023-05-14T09:30:00.000Z',
            read: true
          },
          {
            id: 2,
            sender: 'admin',
            content: 'Bonjour Sophie, je suis désolé pour ce désagrément. Je vais vérifier l\'état de votre commande immédiatement.',
            timestamp: '2023-05-14T09:35:00.000Z',
            read: true
          },
          {
            id: 3,
            sender: 'bot',
            content: 'Je viens de consulter notre système de livraison. Votre colis est actuellement en transit et devrait être livré aujourd\'hui avant 18h.',
            timestamp: '2023-05-14T09:37:00.000Z',
            read: true
          },
          {
            id: 4,
            sender: 'customer',
            content: 'Merci pour cette information. Pourriez-vous me donner un créneau horaire plus précis?',
            timestamp: '2023-05-14T10:15:00.000Z',
            read: true
          },
          {
            id: 5,
            sender: 'admin',
            content: 'D\'après les informations du transporteur, la livraison est prévue entre 14h et 16h. Vous recevrez un SMS 30 minutes avant l\'arrivée du livreur.',
            timestamp: '2023-05-14T10:20:00.000Z',
            read: true
          },
          {
            id: 6,
            sender: 'customer',
            content: 'Je n\'ai toujours pas reçu ma commande et il est déjà 16h30. Aucun SMS reçu non plus.',
            timestamp: '2023-05-14T16:30:00.000Z',
            read: true
          },
          {
            id: 7,
            sender: 'admin',
            content: 'Je suis vraiment désolé pour ce retard. Je viens de contacter le transporteur et il semble qu\'il y ait eu un problème avec leur tournée aujourd\'hui. Votre commande sera livrée demain en priorité, entre 9h et 11h.',
            timestamp: '2023-05-14T16:45:00.000Z',
            read: true
          },
          {
            id: 8,
            sender: 'notification',
            content: 'Un code promo de 10% a été ajouté à votre compte en compensation du retard de livraison.',
            timestamp: '2023-05-14T16:50:00.000Z',
            read: true
          },
          {
            id: 9,
            sender: 'customer',
            content: 'C\'est très gentil, merci. J\'espère que la livraison se passera bien demain.',
            timestamp: '2023-05-14T17:05:00.000Z',
            read: true
          },
          {
            id: 10,
            sender: 'customer',
            content: 'Bonjour, toujours pas de livraison ce matin. C\'est vraiment frustrant!',
            timestamp: '2023-05-15T11:30:00.000Z',
            read: false
          },
          {
            id: 11,
            sender: 'customer',
            content: 'Est-ce que quelqu\'un peut m\'aider? Je commence à perdre patience.',
            timestamp: '2023-05-15T14:35:00.000Z',
            read: false
          }
        ]
      },
      {
        id: 2,
        customer: {
          id: 102,
          name: 'Thomas Dubois',
          email: 'thomas.dubois@example.com',
          phone: '+33 6 23 45 67 89',
          avatar: 'https://randomuser.me/api/portraits/men/22.jpg',
          location: 'Lyon, France',
          memberSince: '2021-11-08',
          orderCount: 27
        },
        subject: 'Remboursement commande #EF2290',
        status: 'pending',
        priority: 'medium',
        category: 'refund',
        assignedTo: 'admin',
        createdAt: '2023-05-13T15:20:00.000Z',
        lastMessage: '2023-05-15T09:45:00.000Z',
        unread: 0,
        messages: [
          {
            id: 1,
            sender: 'customer',
            content: 'Bonjour, j\'ai retourné ma commande #EF2290 il y a 10 jours et je n\'ai toujours pas été remboursé. Pouvez-vous vérifier?',
            timestamp: '2023-05-13T15:20:00.000Z',
            read: true
          },
          {
            id: 2,
            sender: 'bot',
            content: 'Bonjour Thomas, merci de nous avoir contactés. Je vérifie immédiatement l\'état de votre remboursement.',
            timestamp: '2023-05-13T15:22:00.000Z',
            read: true
          },
          {
            id: 3,
            sender: 'admin',
            content: 'Bonjour Thomas, j\'ai vérifié votre dossier. Nous avons bien reçu votre retour le 5 mai et le remboursement a été initié le 8 mai. Le délai habituel est de 5 à 10 jours ouvrés pour que la somme apparaisse sur votre compte, selon votre banque.',
            timestamp: '2023-05-13T15:30:00.000Z',
            read: true
          },
          {
            id: 4,
            sender: 'customer',
            content: 'Merci pour votre réponse. Je vais patienter encore quelques jours dans ce cas.',
            timestamp: '2023-05-13T15:45:00.000Z',
            read: true
          },
          {
            id: 5,
            sender: 'customer',
            content: 'Bonjour, nous sommes maintenant le 15 mai et je n\'ai toujours rien reçu sur mon compte. Pouvez-vous relancer la procédure?',
            timestamp: '2023-05-15T09:45:00.000Z',
            read: true
          }
        ]
      },
      {
        id: 3,
        customer: {
          id: 103,
          name: 'Émilie Lefebvre',
          email: 'emilie.lefebvre@example.com',
          phone: '+33 6 34 56 78 90',
          avatar: 'https://randomuser.me/api/portraits/women/33.jpg',
          location: 'Marseille, France',
          memberSince: '2023-01-21',
          orderCount: 5
        },
        subject: 'Question sur l\'abonnement premium',
        status: 'resolved',
        priority: 'low',
        category: 'subscription',
        assignedTo: 'admin',
        createdAt: '2023-05-10T11:05:00.000Z',
        lastMessage: '2023-05-11T16:30:00.000Z',
        unread: 0,
        messages: [
          {
            id: 1,
            sender: 'customer',
            content: 'Bonjour, j\'aimerais avoir plus d\'informations sur l\'abonnement premium. Quels sont les avantages par rapport à la version gratuite?',
            timestamp: '2023-05-10T11:05:00.000Z',
            read: true
          },
          {
            id: 2,
            sender: 'bot',
            content: 'Bonjour Émilie, merci pour votre message. Je serais ravi de vous donner plus d\'informations sur notre abonnement premium.',
            timestamp: '2023-05-10T11:07:00.000Z',
            read: true
          },
          {
            id: 3,
            sender: 'admin',
            content: 'Bonjour Émilie, l\'abonnement premium à 9,99€/mois vous offre plusieurs avantages: livraison gratuite illimitée, accès prioritaire aux nouvelles collections, service client dédié, et 5% de remise sur toutes vos commandes. Vous pouvez l\'essayer gratuitement pendant 30 jours.',
            timestamp: '2023-05-10T11:15:00.000Z',
            read: true
          },
          {
            id: 4,
            sender: 'customer',
            content: 'Merci pour ces informations. Est-ce que je peux annuler à tout moment?',
            timestamp: '2023-05-10T11:30:00.000Z',
            read: true
          },
          {
            id: 5,
            sender: 'admin',
            content: 'Absolument, vous pouvez annuler votre abonnement à tout moment depuis votre espace client, sans frais supplémentaires. Si vous annulez pendant la période d\'essai, aucun prélèvement ne sera effectué.',
            timestamp: '2023-05-10T11:35:00.000Z',
            read: true
          },
          {
            id: 6,
            sender: 'customer',
            content: 'Parfait, je vais essayer. Comment puis-je m\'inscrire?',
            timestamp: '2023-05-11T09:20:00.000Z',
            read: true
          },
          {
            id: 7,
            sender: 'admin',
            content: 'C\'est très simple! Connectez-vous à votre compte, allez dans la section "Abonnements" et cliquez sur "Essayer Premium". Vous aurez besoin d\'entrer vos coordonnées bancaires, mais aucun prélèvement ne sera effectué avant la fin de la période d\'essai de 30 jours.',
            timestamp: '2023-05-11T09:30:00.000Z',
            read: true
          },
          {
            id: 8,
            sender: 'customer',
            content: 'Merci beaucoup! Je viens de m\'inscrire. Très hâte de profiter des avantages!',
            timestamp: '2023-05-11T16:30:00.000Z',
            read: true
          }
        ]
      }
    ];
    
    setConversations(mockConversations);
    
    setNotifications([
      {
        id: 1,
        type: 'alert',
        message: 'Sophie Martin a répondu à votre message',
        timestamp: '2023-05-15T14:35:00.000Z',
        read: false
      },
      {
        id: 2,
        type: 'info',
        message: 'Thomas Dubois a ouvert votre dernier message',
        timestamp: '2023-05-15T10:15:00.000Z',
        read: false
      },
      {
        id: 3,
        type: 'success',
        message: 'La conversation avec Émilie Lefebvre a été marquée comme résolue',
        timestamp: '2023-05-11T16:45:00.000Z',
        read: true
      },
      {
        id: 4,
        type: 'warning',
        message: 'La livraison de la commande #EF2305 est en retard',
        timestamp: '2023-05-14T18:00:00.000Z',
        read: true
      },
      {
        id: 5,
        type: 'info',
        message: '3 nouvelles conversations ont été assignées à votre équipe',
        timestamp: '2023-05-13T09:00:00.000Z',
        read: true
      }
    ]);
  }, []);

  // Scroll to bottom of chat
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [activeConversation]);

  // Helper functions
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString();
  };

  const formatTimestamp = (timestamp) => {
    const now = new Date();
    const messageDate = new Date(timestamp);
    const diffInDays = Math.floor((now - messageDate) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) {
      return `${t('today')}, ${formatTime(timestamp)}`;
    } else if (diffInDays === 1) {
      return `${t('yesterday')}, ${formatTime(timestamp)}`;
    } else {
      return `${formatDate(timestamp)}, ${formatTime(timestamp)}`;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-yellow-500';
      case 'pending':
        return 'bg-blue-500';
      case 'resolved':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'text-red-500';
      case 'medium':
        return 'text-yellow-500';
      case 'low':
        return 'text-green-500';
      default:
        return 'text-gray-500';
    }
  };

  const getFilteredConversations = () => {
    return conversations
      .filter(conv => {
        if (filterStatus !== 'all' && conv.status !== filterStatus) return false;
        if (searchInput && !conv.customer.name.toLowerCase().includes(searchInput.toLowerCase()) && 
            !conv.subject.toLowerCase().includes(searchInput.toLowerCase())) {
          return false;
        }
        return true;
      })
      .sort((a, b) => new Date(b.lastMessage) - new Date(a.lastMessage));
  };

  const filterOptions = [
    { value: 'all', label: t('all') },
    { value: 'active', label: t('active') },
    { value: 'pending', label: t('pending') },
    { value: 'resolved', label: t('resolved') }
  ];

  const getSenderName = (sender, conversation) => {
    switch (sender) {
      case 'admin': return t('you');
      case 'customer': return conversation.customer.name;
      case 'bot': return 'EatFast Bot';
      case 'notification': return t('system');
      default: return sender;
    }
  };

  // Conversation and message handlers
  const handleConversationSelect = (conversation) => {
    setActiveConversation(conversation);
    markMessagesAsRead(conversation.id);
    setShowUserInfoPanel(false);
    if (isMobile) setShowSidebar(false);
  };

  const markMessagesAsRead = (conversationId) => {
    const updatedConversations = conversations.map(conv => {
      if (conv.id === conversationId) {
        const updatedMessages = conv.messages.map(msg => ({ ...msg, read: true }));
        return { ...conv, messages: updatedMessages, unread: 0 };
      }
      return conv;
    });
    
    setConversations(updatedConversations);
    
    if (activeConversation?.id === conversationId) {
      const updatedMessages = activeConversation.messages.map(msg => ({ ...msg, read: true }));
      setActiveConversation({
        ...activeConversation,
        messages: updatedMessages,
        unread: 0
      });
    }
  };

  const handleStatusChange = (conversationId, newStatus) => {
    const updatedConversations = conversations.map(conv => {
      if (conv.id === conversationId) {
        return { ...conv, status: newStatus };
      }
      return conv;
    });
    
    setConversations(updatedConversations);
    
    if (activeConversation?.id === conversationId) {
      setActiveConversation({
        ...activeConversation,
        status: newStatus
      });
    }
  };

  // Message handling functions
  const handleSendMessage = () => {
    if (messageInput.trim() === '' || !activeConversation) return;
    
    const updatedConversations = conversations.map(conv => {
      if (conv.id === activeConversation.id) {
        const newMessage = {
          id: conv.messages.length + 1,
          sender: 'admin',
          content: messageInput,
          timestamp: new Date().toISOString(),
          read: true
        };
        
        return {
          ...conv,
          messages: [...conv.messages, newMessage],
          lastMessage: new Date().toISOString()
        };
      }
      return conv;
    });
    
    setConversations(updatedConversations);
    setActiveConversation({
      ...activeConversation,
      messages: [...activeConversation.messages, {
        id: activeConversation.messages.length + 1,
        sender: 'admin',
        content: messageInput,
        timestamp: new Date().toISOString(),
        read: true
      }],
      lastMessage: new Date().toISOString()
    });
    
    setMessageInput('');
    
    if (Math.random() > 0.5) {
      setTimeout(() => simulateCustomerResponse(), 5000 + Math.random() * 5000);
    } else {
      setTimeout(() => simulateBotTyping(), 1000);
    }
  };

  const simulateBotTyping = () => {
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      if (activeConversation) sendAiResponse();
    }, 1500);
  };

  const sendAiResponse = () => {
    if (!activeConversation) return;
    
    const aiResponses = [
      "Je comprends votre préoccupation. Permettez-moi de vous aider avec ce problème.",
      "Merci pour votre patience. Selon nos données, votre commande est en cours de préparation.",
      "Je vérifie les informations dans notre système. Un moment, s'il vous plaît.",
      "Votre satisfaction est notre priorité. Puis-je vous proposer une solution alternative?",
      "D'après ce que je comprends, vous rencontrez un problème avec votre livraison. Est-ce correct?"
    ];
    
    const randomResponse = aiResponses[Math.floor(Math.random() * aiResponses.length)];
    
    const updatedConversations = conversations.map(conv => {
      if (conv.id === activeConversation.id) {
        const newMessage = {
          id: conv.messages.length + 1,
          sender: 'bot',
          content: randomResponse,
          timestamp: new Date().toISOString(),
          read: true
        };
        
        return {
          ...conv,
          messages: [...conv.messages, newMessage],
          lastMessage: new Date().toISOString()
        };
      }
      return conv;
    });
    
    setConversations(updatedConversations);
    setActiveConversation({
      ...activeConversation,
      messages: [...activeConversation.messages, {
        id: activeConversation.messages.length + 1,
        sender: 'bot',
        content: randomResponse,
        timestamp: new Date().toISOString(),
        read: true
      }],
      lastMessage: new Date().toISOString()
    });
  };

  const simulateCustomerResponse = () => {
    if (!activeConversation) return;
    
    const customerResponses = [
      "Merci pour votre aide!",
      "Je comprends, mais j'ai encore un problème...",
      "Est-ce que vous pouvez me donner plus de détails?",
      "D'accord, je vais essayer cette solution.",
      "Combien de temps cela va-t-il prendre?"
    ];
    
    const randomResponse = customerResponses[Math.floor(Math.random() * customerResponses.length)];
    
    const updatedConversations = conversations.map(conv => {
      if (conv.id === activeConversation.id) {
        const newMessage = {
          id: conv.messages.length + 1,
          sender: 'customer',
          content: randomResponse,
          timestamp: new Date().toISOString(),
          read: false
        };
        
        return {
          ...conv,
          messages: [...conv.messages, newMessage],
          lastMessage: new Date().toISOString(),
          unread: conv.unread + 1
        };
      }
      return conv;
    });
    
    setConversations(updatedConversations);
    setActiveConversation({
      ...activeConversation,
      messages: [...activeConversation.messages, {
        id: activeConversation.messages.length + 1,
        sender: 'customer',
        content: randomResponse,
        timestamp: new Date().toISOString(),
        read: false
      }],
      lastMessage: new Date().toISOString(),
      unread: activeConversation.unread + 1
    });
    
    const newNotification = {
      id: notifications.length + 1,
      type: 'alert',
      message: `${activeConversation.customer.name} a répondu à votre message`,
      timestamp: new Date().toISOString(),
      read: false
    };
    
    setNotifications([newNotification, ...notifications]);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 5000);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Render functions for child components
  const renderSettingsTab = () => {
    return (
      <div className="h-full flex flex-col">
        <div className="p-6 space-y-6">
          <div className="flex flex-col gap-4">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">{t('supportSettings')}</h2>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
              <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-4">{t('availability')}</h3>
              <div className="space-y-3">
                <div className="flex items-center">
                  <select
                    value={availabilityStatus}
                    onChange={(e) => setAvailabilityStatus(e.target.value)}
                    className="form-select rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 focus:border-green-500 dark:focus:border-green-500 focus:ring focus:ring-green-200 dark:focus:ring-green-800 focus:ring-opacity-50"
                  >
                    <option value="available">{t('available')}</option>
                    <option value="away">{t('away')}</option>
                    <option value="busy">{t('busy')}</option>
                    <option value="offline">{t('offline')}</option>
                  </select>
                  <div className="ml-3">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {availabilityStatus === 'available' && t('availableDesc')}
                      {availabilityStatus === 'away' && t('awayDesc')}
                      {availabilityStatus === 'busy' && t('busyDesc')}
                      {availabilityStatus === 'offline' && t('offlineDesc')}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
              <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-4">{t('notifications')}</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <FiMail className="mr-2 text-gray-600 dark:text-gray-400" />
                    <span className="text-gray-700 dark:text-gray-300">{t('emailNotifications')}</span>
                  </div>
                  <div className="flex items-center">
                    <label className="switch">
                      <input
                        type="checkbox"
                        checked={emailNotifications}
                        onChange={() => setEmailNotifications(!emailNotifications)}
                        className="sr-only"
                      />
                      <div className={`slider ${emailNotifications ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'} relative inline-block w-10 h-5 rounded-full transition-all duration-200`}>
                        <span className={`knob ${emailNotifications ? 'translate-x-5' : 'translate-x-0'} absolute left-0 top-0 bg-white h-5 w-5 rounded-full transform transition-all duration-200 shadow`}></span>
                      </div>
                    </label>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <FiBell className="mr-2 text-gray-600 dark:text-gray-400" />
                    <span className="text-gray-700 dark:text-gray-300">{t('pushNotifications')}</span>
                  </div>
                  <div className="flex items-center">
                    <label className="switch">
                      <input
                        type="checkbox"
                        checked={pushNotifications}
                        onChange={() => setPushNotifications(!pushNotifications)}
                        className="sr-only"
                      />
<div className={`slider ${pushNotifications ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'} relative inline-block w-10 h-5 rounded-full transition-all duration-200`}>
  <span className={`knob ${pushNotifications ? 'translate-x-5' : 'translate-x-0'} absolute left-0 top-0 bg-white h-5 w-5 rounded-full transform transition-all duration-200 shadow`}></span>
</div>
</label>
</div>
</div>
</div>
</div>

<div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
  <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-4">{t('autoResponses')}</h3>
  <div className="space-y-4">
    <div className="flex items-center justify-between">
      <div className="flex items-center">
        <HiOutlineBot className="mr-2 text-gray-600 dark:text-gray-400" />
        <span className="text-gray-700 dark:text-gray-300">{t('enableAutoResponse')}</span>
      </div>
      <div className="flex items-center">
        <label className="switch">
          <input
            type="checkbox"
            checked={autoResponse}
            onChange={() => setAutoResponse(!autoResponse)}
            className="sr-only"
          />
          <div className={`slider ${autoResponse ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'} relative inline-block w-10 h-5 rounded-full transition-all duration-200`}>
            <span className={`knob ${autoResponse ? 'translate-x-5' : 'translate-x-0'} absolute left-0 top-0 bg-white h-5 w-5 rounded-full transform transition-all duration-200 shadow`}></span>
          </div>
        </label>
      </div>
    </div>
    <div className="text-sm text-gray-600 dark:text-gray-400">
      {t('autoResponseDesc')}
    </div>
  </div>
</div>

<div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
  <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-4">{t('keySupportPerformance')}</h3>
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <div className="bg-green-50 dark:bg-green-900 dark:bg-opacity-20 rounded-lg p-3">
      <div className="text-sm text-gray-500 dark:text-gray-400">{t('averageResponseTime')}</div>
      <div className="text-xl font-semibold text-gray-800 dark:text-gray-200">15 {t('minutes')}</div>
    </div>
    <div className="bg-blue-50 dark:bg-blue-900 dark:bg-opacity-20 rounded-lg p-3">
      <div className="text-sm text-gray-500 dark:text-gray-400">{t('resolvedConversations')}</div>
      <div className="text-xl font-semibold text-gray-800 dark:text-gray-200">92%</div>
    </div>
    <div className="bg-purple-50 dark:bg-purple-900 dark:bg-opacity-20 rounded-lg p-3">
      <div className="text-sm text-gray-500 dark:text-gray-400">{t('customerSatisfaction')}</div>
      <div className="text-xl font-semibold text-gray-800 dark:text-gray-200">4.8/5</div>
    </div>
    <div className="bg-yellow-50 dark:bg-yellow-900 dark:bg-opacity-20 rounded-lg p-3">
      <div className="text-sm text-gray-500 dark:text-gray-400">{t('activeConversations')}</div>
      <div className="text-xl font-semibold text-gray-800 dark:text-gray-200">{conversations.filter(c => c.status === 'active').length}</div>
    </div>
  </div>
</div>
</div>
</div>
</div>
);
};

return (
<AdminLayout>
  <div className="h-full flex flex-col bg-gray-100 dark:bg-gray-900">
    <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">{t('supportCenter')}</h1>
          </div>
          <div className="flex items-center space-x-4">
            <button 
              className="relative text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 focus:outline-none"
              onClick={() => setShowNotification(!showNotification)}
            >
              <FiBell className="h-6 w-6" />
              {notifications.filter(n => !n.read).length > 0 && (
                <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-gray-800"></span>
              )}
            </button>
            
            <AnimatePresence>
              {showNotification && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute right-4 top-16 mt-2 w-80 bg-white dark:bg-gray-800 rounded-md shadow-lg z-20 border border-gray-200 dark:border-gray-700 overflow-hidden"
                >
                  <div className="p-3 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                    <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('notifications')}</h3>
                    <button 
                      className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 text-xs"
                      onClick={() => {
                        const updatedNotifications = notifications.map(n => ({ ...n, read: true }));
                        setNotifications(updatedNotifications);
                      }}
                    >
                      {t('markAllAsRead')}
                    </button>
                  </div>
                  <div className="max-h-72 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="p-4 text-center text-gray-500 dark:text-gray-400 text-sm">
                        {t('noNotifications')}
                      </div>
                    ) : (
                      notifications.map((notification) => (
                        <div 
                          key={notification.id} 
                          className={`p-3 border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-750 ${!notification.read ? 'bg-blue-50 dark:bg-blue-900 dark:bg-opacity-20' : ''}`}
                        >
                          <div className="flex items-start">
                            <div className="flex-shrink-0 pt-0.5">
                              {notification.type === 'alert' && <FiAlertCircle className="h-5 w-5 text-red-500" />}
                              {notification.type === 'info' && <FiInfo className="h-5 w-5 text-blue-500" />}
                              {notification.type === 'success' && <FiCheckCircle className="h-5 w-5 text-green-500" />}
                              {notification.type === 'warning' && <FiAlertCircle className="h-5 w-5 text-yellow-500" />}
                            </div>
                            <div className="ml-3 w-0 flex-1">
                              <p className="text-sm text-gray-800 dark:text-gray-200">{notification.message}</p>
                              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{formatTimestamp(notification.timestamp)}</p>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            
            {isMobile && (
              <button
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 focus:outline-none"
                onClick={() => setShowSidebar(!showSidebar)}
              >
                <FiMessageCircle className="h-6 w-6" />
              </button>
            )}
          </div>
        </div>
        
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="-mb-px flex space-x-8">
            <button
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'chat'
                  ? 'border-green-500 text-green-600 dark:text-green-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:border-gray-600'
              }`}
              onClick={() => setActiveTab('chat')}
            >
              {t('chat')}
            </button>
            <button
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'settings'
                  ? 'border-green-500 text-green-600 dark:text-green-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:border-gray-600'
              }`}
              onClick={() => setActiveTab('settings')}
            >
              {t('settings')}
            </button>
          </nav>
        </div>
      </div>
    </div>
    
    <div className="flex-1 flex overflow-hidden">
      {activeTab === 'chat' ? (
        <>
          <AnimatePresence>
            {(showSidebar || !isMobile) && (
              <motion.div
                initial={isMobile ? { x: -300 } : false}
                animate={{ x: 0 }}
                exit={isMobile ? { x: -300 } : false}
                className={`${isMobile ? 'absolute z-10 h-full' : 'relative'} w-80 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col`}
              >
                <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiSearch className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      placeholder={t('searchConversations')}
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-700 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 dark:focus:ring-green-500 dark:focus:border-green-400 sm:text-sm text-gray-900 dark:text-gray-100"
                      value={searchInput}
                      onChange={(e) => setSearchInput(e.target.value)}
                    />
                  </div>
                  
                  <div className="mt-3 flex">
                    <div className="w-full inline-flex rounded-md shadow-sm">
                      <div className="relative z-0 inline-flex shadow-sm rounded-md flex-1">
                        <select
                          value={filterStatus}
                          onChange={(e) => setFilterStatus(e.target.value)}
                          className="relative w-full inline-flex items-center px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-650 focus:z-10 focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500"
                        >
                          {filterOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex-1 overflow-y-auto">
                  <SupportConversationList 
                    conversations={getFilteredConversations()}
                    activeConversationId={activeConversation?.id}
                    onSelect={handleConversationSelect}
                    formatTimestamp={formatTimestamp}
                    getStatusColor={getStatusColor}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          <div className="flex-1 flex overflow-hidden">
            {activeConversation ? (
              <div className="flex-1 flex flex-col">
                <SupportChatView
                  conversation={activeConversation}
                  messageInput={messageInput}
                  setMessageInput={setMessageInput}
                  handleSendMessage={handleSendMessage}
                  handleKeyPress={handleKeyPress}
                  isTyping={isTyping}
                  showUserInfoPanel={showUserInfoPanel}
                  setShowUserInfoPanel={setShowUserInfoPanel}
                  handleStatusChange={handleStatusChange}
                  formatTimestamp={formatTimestamp}
                  getSenderName={getSenderName}
                  getPriorityColor={getPriorityColor}
                  chatEndRef={chatEndRef}
                  darkMode={darkMode}
                />
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center p-6 bg-gray-50 dark:bg-gray-850">
                <div className="text-center">
                  <HiOutlineBot className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">{t('noConversationSelected')}</h3>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{t('selectConversationToStart')}</p>
                </div>
              </div>
            )}
          </div>
        </>
      ) : (
        renderSettingsTab()
      )}
    </div>
  </div>
</AdminLayout>
);
};

export default AdminSupportPage;