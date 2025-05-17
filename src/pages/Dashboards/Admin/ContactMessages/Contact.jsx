import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  FiTrash2, 
  FiMessageSquare, 
  FiMail, 
  FiSend, 
  FiCheck, 
  FiFilter, 
  FiArrowLeft, 
  FiArrowRight, 
  FiSearch,
  FiX,
  FiEye,
  FiRefreshCw,
  FiAlertCircle,
  FiStar,
  FiArchive,
  FiClock,
  FiSave,
  FiArrowDown
} from 'react-icons/fi';
import AdminLayout from '../../../../layouts/admin_layout'; // Import the AdminLayout component


// Mock data for contact messages
const MOCK_CONTACT_MESSAGES = [
  {
    id: 1,
    name: 'Jean Dupont',
    email: 'jean.dupont@example.com',
    subject: 'Question sur la livraison',
    message: 'Bonjour, j\'aimerais savoir si vous livrez dans le quartier Bonabéri à Douala ? Merci d\'avance pour votre réponse.',
    date: '2025-05-12T08:30:00',
    isRead: true,
    isNewsletter: false,
    status: 'answered',
  },
  {
    id: 2,
    name: 'Marie Nguemo',
    email: 'marie.nguemo@gmail.com',
    subject: 'Problème avec ma commande #EF23456',
    message: 'Bonsoir, ma commande a été livrée incomplète hier soir. Il manquait les boissons que j\'avais commandées. Pouvez-vous me contacter rapidement pour résoudre ce problème ? Merci.',
    date: '2025-05-15T19:45:00',
    isRead: false,
    isNewsletter: false,
    status: 'pending',
  },
  {
    id: 3,
    name: 'Pierre Kamga',
    email: 'pierre.k@yahoo.fr',
    subject: 'Candidature - Poste de livreur',
    message: 'Je souhaite postuler comme livreur pour EatFast à Yaoundé. J\'ai deux ans d\'expérience en livraison et je possède ma propre moto. Voici mon CV en pièce jointe.',
    date: '2025-05-10T14:20:00',
    isRead: true,
    isNewsletter: false,
    status: 'pending',
  },
  {
    id: 4,
    name: 'Sophie Mbarga',
    email: 'sophie.mbarga@outlook.com',
    subject: 'Suggestion de nouveaux restaurants',
    message: 'Bonjour, j\'utilise votre application depuis 3 mois et j\'adore ! J\'aimerais suggérer d\'ajouter le restaurant "Saveurs du Cameroun" qui se trouve au quartier Bastos. Leur cuisine traditionnelle est excellente et ferait un super ajout à votre plateforme.',
    date: '2025-05-14T11:15:00',
    isRead: false,
    isNewsletter: false,
    status: 'pending',
  },
  {
    id: 5,
    name: 'Trésor Fotso',
    email: 'tfotso@company.cm',
    subject: 'Commandes pour événement d\'entreprise',
    message: 'Notre entreprise organise un événement le 25 mai pour 50 personnes. Nous aimerions utiliser votre service pour commander des repas. Proposez-vous des offres spéciales pour les commandes de groupe ? Merci de me contacter pour en discuter.',
    date: '2025-05-13T09:30:00',
    isRead: true,
    isNewsletter: false,
    status: 'answered',
  },
  {
    id: 6,
    name: 'Ahmed Bello',
    email: 'a.bello@example.com',
    subject: 'Newsletter - Mai 2025',
    message: 'Découvrez nos nouvelles offres de restaurants partenaires à Douala ! Ce mois-ci, profitez de 15% de réduction sur votre première commande avec le code EATFAST15.',
    date: '2025-05-01T08:00:00',
    isRead: true,
    isNewsletter: true,
    status: 'sent',
    recipients: 2547,
    openRate: '38%',
  },
  {
    id: 7,
    name: 'Francine Eyinga',
    email: 'francine92@gmail.com',
    subject: 'Remboursement demandé',
    message: 'Bonjour, j\'ai été débité deux fois pour ma commande #EF34567 du 14 mai. Pourriez-vous vérifier et procéder au remboursement du paiement en double ? J\'ai joint les captures d\'écran des deux transactions.',
    date: '2025-05-15T16:22:00',
    isRead: false,
    isNewsletter: false,
    status: 'urgent',
  },
  {
    id: 8,
    name: 'EatFast Marketing',
    email: 'marketing@eatfast.cm',
    subject: 'Newsletter - Spécial Weekend',
    message: 'Weekend gourmand en perspective ! Profitez de la livraison gratuite sur toutes vos commandes ce samedi et dimanche avec le code WEEKEND.',
    date: '2025-05-08T10:15:00',
    isRead: true,
    isNewsletter: true,
    status: 'draft',
    recipients: 0,
    openRate: '0%',
  },
  {
    id: 9,
    name: 'Nicolas Fouda',
    email: 'nic.fouda@outlook.fr',
    subject: 'Application qui plante',
    message: 'Depuis la dernière mise à jour, l\'application se ferme toute seule quand j\'essaie de valider mon panier. J\'utilise un Samsung Galaxy S25. Pouvez-vous corriger ce problème ? Merci.',
    date: '2025-05-11T20:05:00',
    isRead: true,
    isNewsletter: false,
    status: 'answered',
  },
  {
    id: 10,
    name: 'EatFast Team',
    email: 'news@eatfast.cm',
    subject: 'Newsletter - Nouveaux Restaurants',
    message: 'Nous sommes ravis d\'accueillir 5 nouveaux restaurants cette semaine sur la plateforme! Découvrez leurs menus et bénéficiez de -10% sur votre première commande chez ces nouveaux partenaires.',
    date: '2025-04-25T09:30:00',
    isRead: true,
    isNewsletter: true,
    status: 'sent',
    recipients: 2489,
    openRate: '42%',
  }
];

const ContactMessagesAdmin = () => {
  const { t, i18n } = useTranslation();
  const [activeTab, setActiveTab] = useState('contact');
  const [messages, setMessages] = useState([]);
  const [filteredMessages, setFilteredMessages] = useState([]);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const [isCreatingNewsletter, setIsCreatingNewsletter] = useState(false);
  const [newsletterData, setNewsletterData] = useState({
    subject: '',
    content: '',
    recipients: 'all',
    scheduledDate: ''
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const replyContentRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notification, setNotification] = useState(null);
  
  // Load messages on component mount
  useEffect(() => {
    // Simulate loading delay
    setTimeout(() => {
      setMessages(MOCK_CONTACT_MESSAGES);
      setIsLoading(false);
    }, 800);
  }, []);
  
  // Apply filters and search
  useEffect(() => {
    let result = [...messages];
    
    // Filter by tab (contact/newsletter)
    if (activeTab === 'contact') {
      result = result.filter(msg => !msg.isNewsletter);
    } else {
      result = result.filter(msg => msg.isNewsletter);
    }
    
    // Filter by status
    if (filterStatus !== 'all') {
      result = result.filter(msg => msg.status === filterStatus);
    }
    
    // Filter by search term
    if (searchTerm) {
      const lowerSearchTerm = searchTerm.toLowerCase();
      result = result.filter(
        msg => 
          msg.name.toLowerCase().includes(lowerSearchTerm) ||
          msg.email.toLowerCase().includes(lowerSearchTerm) ||
          msg.subject.toLowerCase().includes(lowerSearchTerm) ||
          msg.message.toLowerCase().includes(lowerSearchTerm)
      );
    }
    
    // Sort by date (newest first)
    result.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    setFilteredMessages(result);
    // Reset to first page when filters change
    setCurrentPage(1);
  }, [messages, activeTab, filterStatus, searchTerm]);
  
  // Focus on reply text area when form is shown
  useEffect(() => {
    if (showReplyForm && replyContentRef.current) {
      replyContentRef.current.focus();
    }
  }, [showReplyForm]);
  
  // Get current messages for pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredMessages.slice(indexOfFirstItem, indexOfLastItem);
  
  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  
  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat(i18n.language === 'fr' ? 'fr-FR' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };
  
  // Select a message to view details
  const handleSelectMessage = (message) => {
    // Mark as read if it wasn't already
    if (!message.isRead) {
      setMessages(messages.map(msg => 
        msg.id === message.id ? { ...msg, isRead: true } : msg
      ));
    }
    setSelectedMessage(message);
    setShowReplyForm(false);
    setReplyContent('');
  };
  
  // Delete a message
  const handleDeleteMessage = (id, event) => {
    event.stopPropagation();
    
    // Show confirmation
    if (window.confirm(t('confirmDelete'))) {
      setMessages(messages.filter(msg => msg.id !== id));
      
      // If the deleted message was selected, clear selection
      if (selectedMessage && selectedMessage.id === id) {
        setSelectedMessage(null);
      }
      
      showNotification('success', t('messageDeleted'));
    }
  };
  
  // Handle reply submission
  const handleSendReply = (e) => {
    e.preventDefault();
    
    if (replyContent.trim() === '') return;
    
    // Update the message status
    setMessages(messages.map(msg => 
      msg.id === selectedMessage.id ? { ...msg, status: 'answered' } : msg
    ));
    
    // Reset reply form
    setShowReplyForm(false);
    setReplyContent('');
    
    // Show notification
    showNotification('success', t('replySent'));
  };
  
  // Create new newsletter
  const handleSubmitNewsletter = (e) => {
    e.preventDefault();
    
    const newNewsletter = {
      id: messages.length + 1,
      name: 'EatFast Marketing',
      email: 'marketing@eatfast.cm',
      subject: newsletterData.subject,
      message: newsletterData.content,
      date: newsletterData.scheduledDate || new Date().toISOString(),
      isRead: true,
      isNewsletter: true,
      status: newsletterData.scheduledDate ? 'scheduled' : 'draft',
      recipients: 0,
      openRate: '0%'
    };
    
    setMessages([...messages, newNewsletter]);
    setIsCreatingNewsletter(false);
    setNewsletterData({
      subject: '',
      content: '',
      recipients: 'all',
      scheduledDate: ''
    });
    
    showNotification('success', t('newsletterCreated'));
  };
  
  // Send a newsletter
  const handleSendNewsletter = (id) => {
    setMessages(messages.map(msg => 
      msg.id === id ? { 
        ...msg, 
        status: 'sent',
        recipients: Math.floor(Math.random() * 500) + 2000,
        openRate: Math.floor(Math.random() * 30 + 20) + '%'
      } : msg
    ));
    
    showNotification('success', t('newsletterSent'));
  };
  
  // Show notification
  const showNotification = (type, message) => {
    setNotification({ type, message });
    
    // Clear notification after 3 seconds
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };
  
  // Back to message list
  const handleBackToList = () => {
    setSelectedMessage(null);
    setShowReplyForm(false);
    setIsCreatingNewsletter(false);
  };
  
  // Get status badge color
  const getStatusColor = (status) => {
    switch(status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'answered': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'urgent': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'sent': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'draft': return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
      case 'scheduled': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };
  
  // Render notification
  const renderNotification = () => {
    if (!notification) return null;
    
    const bgColor = notification.type === 'success' 
      ? 'bg-green-500 dark:bg-green-600' 
      : 'bg-red-500 dark:bg-red-600';
    
    return (
      <div className={`fixed top-20 right-4 z-50 flex items-center p-4 rounded-lg shadow-lg ${bgColor} text-white`}>
        {notification.type === 'success' ? <FiCheck className="mr-2" /> : <FiAlertCircle className="mr-2" />}
        <span>{notification.message}</span>
      </div>
    );
  };

  return (
    <AdminLayout>
    <div className="min-h-full">
      {/* Notification */}
      {renderNotification()}
      
      {/* Header with tabs */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center gap-4">
        <h1 className="text-2xl font-bold flex items-center">
          {activeTab === 'contact' ? (
            <FiMessageSquare className="mr-2 text-green-600 dark:text-yellow-400" />
          ) : (
            <FiMail className="mr-2 text-green-600 dark:text-yellow-400" />
          )}
          {activeTab === 'contact' ? t('contactMessages') : t('newsletters')}
        </h1>
        
        <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1 self-start">
          <button 
            className={`px-4 py-2 rounded-md transition-all duration-200 ${
              activeTab === 'contact' 
                ? 'bg-white dark:bg-gray-700 shadow-sm' 
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
            onClick={() => setActiveTab('contact')}
          >
            <div className="flex items-center">
              <FiMessageSquare className="mr-2" />
              <span>{t('contactMessages')}</span>
            </div>
          </button>
          <button 
            className={`px-4 py-2 rounded-md transition-all duration-200 ${
              activeTab === 'newsletter' 
                ? 'bg-white dark:bg-gray-700 shadow-sm' 
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
            onClick={() => setActiveTab('newsletter')}
          >
            <div className="flex items-center">
              <FiMail className="mr-2" />
              <span>{t('newsletters')}</span>
            </div>
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        {/* Loading state */}
        {isLoading && (
          <div className="flex justify-center items-center p-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
          </div>
        )}
        
        {/* Main content when not loading */}
        {!isLoading && (
          <div className="flex flex-col md:flex-row h-full">
            {/* Left sidebar - List of messages */}
            {!selectedMessage && !isCreatingNewsletter && (
              <div className="w-full">
                {/* Search and filter bar */}
                <div className="bg-gray-50 dark:bg-gray-750 border-b border-gray-200 dark:border-gray-700 p-4">
                  <div className="flex flex-col sm:flex-row gap-3">
                    {/* Search input */}
                    <div className="relative flex-grow">
                      <input
                        type="text"
                        className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder={t('searchMessages')}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                        <FiSearch />
                      </div>
                      {searchTerm && (
                        <button 
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                          onClick={() => setSearchTerm('')}
                        >
                          <FiX />
                        </button>
                      )}
                    </div>
                    
                    {/* Filter dropdown */}
                    <div className="relative w-full sm:w-48">
                      <select
                        className="w-full appearance-none pl-10 pr-8 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                      >
                        <option value="all">{t('allStatuses')}</option>
                        {activeTab === 'contact' ? (
                          <>
                            <option value="pending">{t('pending')}</option>
                            <option value="answered">{t('answered')}</option>
                            <option value="urgent">{t('urgent')}</option>
                          </>
                        ) : (
                          <>
                            <option value="draft">{t('draft')}</option>
                            <option value="scheduled">{t('scheduled')}</option>
                            <option value="sent">{t('sent')}</option>
                          </>
                        )}
                      </select>
                      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                        <FiFilter />
                      </div>
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">
                        <FiArrowDown className="w-4 h-4" />
                      </div>
                    </div>
                    
                    {/* Create newsletter button (only on newsletter tab) */}
                    {activeTab === 'newsletter' && (
                      <button
                        className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center"
                        onClick={() => setIsCreatingNewsletter(true)}
                      >
                        <FiMail className="mr-2" />
                        {t('createNewsletter')}
                      </button>
                    )}
                  </div>
                </div>
                
                {/* Message list */}
                {currentItems.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                    {activeTab === 'contact' ? (
                      <FiMessageSquare className="h-16 w-16 text-gray-400 mb-4" />
                    ) : (
                      <FiMail className="h-16 w-16 text-gray-400 mb-4" />
                    )}
                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                      {t('noMessagesFound')}
                    </h3>
                    <p className="mt-1 text-gray-500 dark:text-gray-400">
                      {searchTerm || filterStatus !== 'all' 
                        ? t('tryChangingFilters')
                        : activeTab === 'contact' 
                          ? t('noContactMessages') 
                          : t('noNewsletters')}
                    </p>
                    {(searchTerm || filterStatus !== 'all') && (
                      <button
                        className="mt-4 flex items-center text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300"
                        onClick={() => {
                          setSearchTerm('');
                          setFilterStatus('all');
                        }}
                      >
                        <FiRefreshCw className="mr-2" />
                        {t('clearFilters')}
                      </button>
                    )}
                  </div>
                ) : (
                  <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                    {currentItems.map((message) => (
                      <li 
                        key={message.id}
                        className={`hover:bg-gray-50 dark:hover:bg-gray-750 cursor-pointer transition-colors duration-150 ${
                          !message.isRead ? 'bg-green-50 dark:bg-gray-700/60' : ''
                        }`}
                        onClick={() => handleSelectMessage(message)}
                      >
                        <div className="px-4 py-4 sm:px-6 relative">
                          <div className="flex justify-between">
                            <div className="flex-shrink-0 flex items-center">
                              {/* Icon based on message type */}
                              {message.isNewsletter ? (
                                <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-200">
                                  <FiMail size={20} />
                                </div>
                              ) : (
                                <div className="h-10 w-10 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center text-green-600 dark:text-green-200">
                                  <FiMessageSquare size={20} />
                                </div>
                              )}
                              {/* Unread indicator */}
                              {!message.isRead && (
                                <span className="absolute top-4 left-4 h-3 w-3 bg-green-600 dark:bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></span>
                              )}
                            </div>
                            <div className="ml-4 flex-grow">
                              <div className="flex items-center justify-between">
                                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                  {message.name}
                                </p>
                                <div className="ml-2 flex-shrink-0 flex">
                                  {/* Status badge */}
                                  <p className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(message.status)}`}>
                                    {t(message.status)}
                                  </p>
                                </div>
                              </div>
                              {/* Email */}
                              <p className="text-sm text-gray-500 truncate">
                                {message.email}
                              </p>
                              {/* Subject */}
                              <p className={`mt-1 text-sm ${!message.isRead ? 'font-semibold text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-300'} truncate`}>
                                {message.subject}
                              </p>
                              {/* Message preview */}
                              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 line-clamp-1">
                                {message.message}
                              </p>
                            </div>
                          </div>
                          <div className="mt-2 sm:flex sm:justify-between">
                            <div className="sm:flex">
                              {/* Newsletter stats */}
                              {message.isNewsletter && message.status === 'sent' && (
                                <p className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                                  <span className="mr-1">{message.recipients} {t('recipients')}</span>
                                  <span className="mx-1">•</span>
                                  <span>{t('openRate')}: {message.openRate}</span>
                                </p>
                              )}
                            </div>
                            <div className="mt-2 flex items-center text-sm text-gray-500 dark:text-gray-400 sm:mt-0">
                              {/* Date */}
                              <p>
                                {formatDate(message.date)}
                              </p>
                              {/* Delete button */}
                              <button
                                className="ml-4 text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 transition-colors duration-150"
                                onClick={(e) => handleDeleteMessage(message.id, e)}
                                aria-label={t('delete')}
                              >
                                <FiTrash2 />
                              </button>
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
                
                {/* Pagination */}
                {filteredMessages.length > itemsPerPage && (
                  <div className="bg-gray-50 dark:bg-gray-750 px-4 py-3 flex items-center justify-between border-t border-gray-200 dark:border-gray-700 sm:px-6">
                    <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                      <div>
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                          {t('showing')} <span className="font-medium">{indexOfFirstItem + 1}</span> {t('to')} <span className="font-medium">
                            {Math.min(indexOfLastItem, filteredMessages.length)}
                          </span> {t('of')} <span className="font-medium">{filteredMessages.length}</span> {t('results')}
                        </p>
                      </div>
                      <div>
                        <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                          <button
                            onClick={() => paginate(currentPage - 1)}
                            disabled={currentPage === 1}
                            className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm font-medium ${
                                currentPage === 1
                                ? 'text-gray-300 dark:text-gray-500 cursor-not-allowed'
                                : 'text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600'
                            }`}
                          >
                            <span className="sr-only">{t('previous')}</span>
                            <FiArrowLeft className="h-5 w-5" aria-hidden="true" />
                          </button>
                          
                          {/* Page numbers */}
                          {Array.from({ length: Math.ceil(filteredMessages.length / itemsPerPage) }).map((_, index) => (
                            <button
                              key={index}
                              onClick={() => paginate(index + 1)}
                              className={`relative inline-flex items-center px-4 py-2 border ${
                                currentPage === index + 1
                                  ? 'z-10 bg-green-50 dark:bg-green-900 border-green-500 dark:border-green-500 text-green-600 dark:text-green-200'
                                  : 'bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600'
                              } text-sm font-medium`}
                            >
                              {index + 1}
                            </button>
                          ))}
                          
                          <button
                            onClick={() => paginate(currentPage + 1)}
                            disabled={currentPage === Math.ceil(filteredMessages.length / itemsPerPage)}
                            className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm font-medium ${
                              currentPage === Math.ceil(filteredMessages.length / itemsPerPage)
                                ? 'text-gray-300 dark:text-gray-500 cursor-not-allowed'
                                : 'text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600'
                            }`}
                          >
                            <span className="sr-only">{t('next')}</span>
                            <FiArrowRight className="h-5 w-5" aria-hidden="true" />
                          </button>
                        </nav>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
            
            {/* Right side - Message detail view */}
            {selectedMessage && (
              <div className="w-full md:w-2/3 border-t md:border-t-0 md:border-l border-gray-200 dark:border-gray-700">
                <div className="p-6">
                  {/* Back button */}
                  <button
                    className="inline-flex items-center text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 mb-6"
                    onClick={handleBackToList}
                  >
                    <FiArrowLeft className="mr-2" /> {t('backToList')}
                  </button>
                  
                  {/* Message header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                      {selectedMessage.subject}
                    </h2>
                    <span className={`mt-2 sm:mt-0 px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(selectedMessage.status)}`}>
                      {t(selectedMessage.status)}
                    </span>
                  </div>
                  
                  {/* Sender info */}
                  <div className="flex items-center mb-6">
                    <div className="flex-shrink-0">
                      <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-500 dark:text-gray-300">
                        {selectedMessage.name.charAt(0).toUpperCase()}
                      </div>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {selectedMessage.name}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {selectedMessage.email}
                      </p>
                    </div>
                    <p className="ml-auto text-sm text-gray-500 dark:text-gray-400">
                      {formatDate(selectedMessage.date)}
                    </p>
                  </div>
                  
                  {/* Message content */}
                  <div className="prose dark:prose-invert max-w-none mb-8 bg-gray-50 dark:bg-gray-750 p-4 rounded-lg">
                    <div className="whitespace-pre-wrap">
                      {selectedMessage.message}
                    </div>
                  </div>
                  
                  {/* Newsletter stats (if applicable) */}
                  {selectedMessage.isNewsletter && selectedMessage.status === 'sent' && (
                    <div className="bg-blue-50 dark:bg-blue-900/30 rounded-lg p-4 mb-6">
                      <h3 className="text-lg font-medium text-blue-800 dark:text-blue-200 mb-2">
                        {t('newsletterStats')}
                      </h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {t('recipients')}
                          </p>
                          <p className="text-xl font-semibold text-gray-900 dark:text-white">
                            {selectedMessage.recipients}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {t('openRate')}
                          </p>
                          <p className="text-xl font-semibold text-gray-900 dark:text-white">
                            {selectedMessage.openRate}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Action buttons */}
                  <div className="flex flex-wrap gap-3 mb-6">
                    {/* Different actions based on message type */}
                    {selectedMessage.isNewsletter ? (
                      <>
                        {selectedMessage.status === 'draft' && (
                          <button
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                            onClick={() => handleSendNewsletter(selectedMessage.id)}
                          >
                            <FiSend className="mr-2" /> {t('sendNewsletter')}
                          </button>
                        )}
                        
                        <button
                          className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                          onClick={() => handleDeleteMessage(selectedMessage.id, { stopPropagation: () => {} })}
                        >
                          <FiTrash2 className="mr-2" /> {t('delete')}
                        </button>
                      </>
                    ) : (
                      <>
                        {/* Contact message actions */}
                        {selectedMessage.status !== 'answered' && (
                          <button
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                            onClick={() => setShowReplyForm(true)}
                          >
                            <FiSend className="mr-2" /> {t('reply')}
                          </button>
                        )}
                        
                        {selectedMessage.status !== 'urgent' && (
                          <button
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                            onClick={() => {
                              setMessages(messages.map(msg => 
                                msg.id === selectedMessage.id ? { ...msg, status: 'urgent' } : msg
                              ));
                              setSelectedMessage({ ...selectedMessage, status: 'urgent' });
                            }}
                          >
                            <FiAlertCircle className="mr-2" /> {t('markUrgent')}
                          </button>
                        )}
                        
                        <button
                          className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                          onClick={() => handleDeleteMessage(selectedMessage.id, { stopPropagation: () => {} })}
                        >
                          <FiTrash2 className="mr-2" /> {t('delete')}
                        </button>
                      </>
                    )}
                  </div>
                  
                  {/* Reply form */}
                  {showReplyForm && (
                    <form onSubmit={handleSendReply} className="mt-6">
                      <label htmlFor="reply" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        {t('yourReply')}
                      </label>
                      <div className="mt-1">
                        <textarea
                          id="reply"
                          name="reply"
                          rows={5}
                          className="shadow-sm block w-full focus:ring-green-500 focus:border-green-500 sm:text-sm border border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-md"
                          value={replyContent}
                          onChange={(e) => setReplyContent(e.target.value)}
                          ref={replyContentRef}
                          placeholder={t('typeYourReply')}
                          required
                        />
                      </div>
                      <div className="mt-3 flex justify-end space-x-3">
                        <button
                          type="button"
                          className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                          onClick={() => setShowReplyForm(false)}
                        >
                          {t('cancel')}
                        </button>
                        <button
                          type="submit"
                          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                          disabled={replyContent.trim() === ''}
                        >
                          <FiSend className="mr-2" /> {t('sendReply')}
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              </div>
            )}
            
            {/* Newsletter creation form */}
            {isCreatingNewsletter && (
              <div className="w-full md:w-2/3 border-t md:border-t-0 md:border-l border-gray-200 dark:border-gray-700">
                <div className="p-6">
                  {/* Back button */}
                  <button
                    className="inline-flex items-center text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 mb-6"
                    onClick={handleBackToList}
                  >
                    <FiArrowLeft className="mr-2" /> {t('backToList')}
                  </button>
                  
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                    {t('createNewNewsletter')}
                  </h2>
                  
                  <form onSubmit={handleSubmitNewsletter}>
                    {/* Subject */}
                    <div className="mb-4">
                      <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        {t('subject')} *
                      </label>
                      <input
                        type="text"
                        id="subject"
                        className="mt-1 block w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                        value={newsletterData.subject}
                        onChange={(e) => setNewsletterData({ ...newsletterData, subject: e.target.value })}
                        required
                      />
                    </div>
                    
                    {/* Content */}
                    <div className="mb-4">
                      <label htmlFor="content" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        {t('content')} *
                      </label>
                      <textarea
                        id="content"
                        rows={10}
                        className="mt-1 block w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                        value={newsletterData.content}
                        onChange={(e) => setNewsletterData({ ...newsletterData, content: e.target.value })}
                        required
                      />
                    </div>
                    
                    {/* Recipients */}
                    <div className="mb-4">
                      <label htmlFor="recipients" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        {t('recipients')} *
                      </label>
                      <select
                        id="recipients"
                        className="mt-1 block w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                        value={newsletterData.recipients}
                        onChange={(e) => setNewsletterData({ ...newsletterData, recipients: e.target.value })}
                        required
                      >
                        <option value="all">{t('allSubscribers')}</option>
                        <option value="active">{t('activeUsers')}</option>
                        <option value="new">{t('newUsers')}</option>
                      </select>
                    </div>
                    
                    {/* Scheduled date */}
                    <div className="mb-6">
                      <label htmlFor="scheduledDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        {t('scheduledDate')} ({t('optional')})
                      </label>
                      <input
                        type="datetime-local"
                        id="scheduledDate"
                        className="mt-1 block w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                        value={newsletterData.scheduledDate}
                        onChange={(e) => setNewsletterData({ ...newsletterData, scheduledDate: e.target.value })}
                      />
                    </div>
                    
                    {/* Action buttons */}
                    <div className="flex justify-end space-x-3">
                      <button
                        type="button"
                        className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                        onClick={handleBackToList}
                      >
                        {t('cancel')}
                      </button>
                      <button
                        type="submit"
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                      >
                        {newsletterData.scheduledDate ? (
                          <>
                            <FiClock className="mr-2" />
                            {t('scheduleNewsletter')}
                          </>
                        ) : (
                          <>
                            <FiSave className="mr-2" />
                            {t('saveAsDraft')}
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
    </AdminLayout>

  );
};

export default ContactMessagesAdmin;