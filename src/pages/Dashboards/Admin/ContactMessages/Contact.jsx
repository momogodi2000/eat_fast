import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
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
  FiArrowDown,
  FiUpload,
  FiDownload,
  FiUsers,
  FiTarget,
  FiSettings,
  FiCheckSquare,
  FiSquare,
  FiEdit,
  FiCopy,
  FiZap,
  FiFileText,
  FiDatabase,
  FiTrendingUp,
  FiActivity,
  FiPhone,
  FiUserPlus,
  FiBell,
  FiPieChart,
  FiChevronDown, 
  FiChevronUp, 
  FiTag, 
  FiMessageCircle, 
  FiUser, 
  FiCalendar, 
  FiPaperclip, 
  FiFlag, 
  FiMeh, 
  FiSmile, 
  FiHelpCircle
} from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import AdminLayoutWrapper from '../../../../components/AdminLayoutWrapper';
import { useTheme } from '../../../../layouts/admin_layout';

// Données fictives pour les messages de contact
const MOCK_CONTACT_MESSAGES = [
  {
    id: 1,
    name: 'Jean Dupont',
    email: 'jean.dupont@example.com',
    phone: '+237 675432198',
    subject: 'Question sur la livraison',
    message: 'Bonjour, j\'aimerais savoir si vous livrez dans le quartier Bonabéri à Douala ? Merci d\'avance pour votre réponse.',
    date: '2025-05-12T08:30:00',
    isRead: true,
    isNewsletter: false,
    status: 'answered',
    category: 'delivery',
    isSelected: false
  },
  {
    id: 2,
    name: 'Marie Nguemo',
    email: 'marie.nguemo@gmail.com',
    phone: '+237 677889900',
    subject: 'Problème avec ma commande #EF23456',
    message: 'Bonsoir, ma commande a été livrée incomplète hier soir. Il manquait les boissons que j\'avais commandées. Pouvez-vous me contacter rapidement pour résoudre ce problème ? Merci.',
    date: '2025-05-15T19:45:00',
    isRead: false,
    isNewsletter: false,
    status: 'pending',
    category: 'complaint',
    isSelected: false
  },
  {
    id: 3,
    name: 'Pierre Kamga', 
    email: 'pierre.k@yahoo.fr',
    phone: '+237 654456789',
    subject: 'Candidature - Poste de livreur',
    message: 'Je souhaite postuler comme livreur pour EatFast à Yaoundé. J\'ai deux ans d\'expérience en livraison et je possède ma propre moto. Voici mon CV en pièce jointe.',
    date: '2025-05-10T14:20:00',
    isRead: true,
    isNewsletter: false,
    status: 'pending',
    category: 'recruitment',
    isSelected: false
  },
  {
    id: 4,
    name: 'Sophie Mbarga',
    email: 'sophie.mbarga@outlook.com',
    phone: '+237 699567890',
    subject: 'Suggestion de nouveaux restaurants',
    message: 'Bonjour, j\'utilise votre application depuis 3 mois et j\'adore ! J\'aimerais suggérer d\'ajouter le restaurant "Saveurs du Cameroun" qui se trouve au quartier Bastos. Leur cuisine traditionnelle est excellente et ferait un super ajout à votre plateforme.',
    date: '2025-05-14T11:15:00',
    isRead: false,
    isNewsletter: false,
    status: 'pending',
    category: 'suggestion',
    isSelected: false
  },
  {
    id: 5,
    name: 'Trésor Fotso',
    email: 'tfotso@company.cm',
    phone: '+237 681678901',
    subject: 'Commandes pour événement d\'entreprise',
    message: 'Notre entreprise organise un événement le 25 mai pour 50 personnes. Nous aimerions utiliser votre service pour commander des repas. Proposez-vous des offres spéciales pour les commandes de groupe ? Merci de me contacter pour en discuter.',
    date: '2025-05-13T09:30:00',
    isRead: true,
    isNewsletter: false,
    status: 'answered',
    category: 'business',
    isSelected: false
  }
];

// Modèles d'emails prédéfinis
const EMAIL_TEMPLATES = [
  {
    id: 1,
    name: 'Bienvenue Nouvel Utilisateur',
    subject: 'Bienvenue sur EatFast - Votre première commande vous attend !',
    content: `Bonjour {{name}},

Bienvenue sur EatFast, la plateforme de livraison de repas la plus rapide du Cameroun !

Nous sommes ravis de vous compter parmi nous. Pour célébrer votre arrivée, profitez de 15% de réduction sur votre première commande avec le code BIENVENUE15.

Découvrez dès maintenant nos centaines de restaurants partenaires à Douala et Yaoundé.

À très bientôt sur EatFast !

L'équipe EatFast`,
    category: 'welcome'
  },
  {
    id: 2,
    name: 'Offre Spéciale Weekend',
    subject: '🎉 Weekend Gourmand - Livraison Gratuite !',
    content: `Bonjour {{name}},

Le weekend arrive et nous avons une surprise pour vous !

🚚 LIVRAISON GRATUITE sur toutes vos commandes ce weekend
🍔 Découvrez nos nouveaux restaurants partenaires
🎁 Offres exclusives sur vos plats préférés

Utilisez le code WEEKEND2025 avant dimanche minuit.

Bon appétit !

L'équipe EatFast`,
    category: 'promotion'
  },
  {
    id: 3,
    name: 'Récupération Client Inactif',
    subject: 'On vous a manqué ! Revenez avec 20% de réduction',
    content: `Bonjour {{name}},

Cela fait un moment que nous ne vous avons pas vu sur EatFast...

Vos restaurants préférés vous attendent ! Pour vous faire revenir, nous vous offrons 20% de réduction sur votre prochaine commande.

Code promo : RETOUR20 (valable jusqu'au {{expiry_date}})

Qu'est-ce qui vous ferait plaisir aujourd'hui ?

L'équipe EatFast vous attend !`,
    category: 'retention'
  }
];

const AdminContactMessages = () => {
  const { t } = useTranslation(['admin', 'translation']);
  const { isDarkMode } = useTheme();
  const [activeTab, setActiveTab] = useState('contact');
  const [messages, setMessages] = useState([]);
  const [filteredMessages, setFilteredMessages] = useState([]);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const [isCreatingNewsletter, setIsCreatingNewsletter] = useState(false);
  const [showMassEmailModal, setShowMassEmailModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showTemplatesModal, setShowTemplatesModal] = useState(false);
  const [newsletterData, setNewsletterData] = useState({
    subject: '',
    content: '',
    recipients: 'all',
    scheduledDate: '',
    template: ''
  });
  const [massEmailData, setMassEmailData] = useState({
    subject: '',
    content: '',
    recipients: 'selected',
    template: ''
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);
  const replyContentRef = useRef(null);
  const fileInputRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notification, setNotification] = useState(null);
  const [selectAll, setSelectAll] = useState(false);
  const [uploadedContacts, setUploadedContacts] = useState([]);
  const [processingFile, setProcessingFile] = useState(false);
  const [emailStats, setEmailStats] = useState({
    totalEmails: 0,
    openRate: 68,
    clickRate: 15,
    bounceRate: 3
  });

  // Charger les messages au montage du composant
  useEffect(() => {
    setTimeout(() => {
      setMessages(MOCK_CONTACT_MESSAGES);
      setEmailStats(prev => ({
        ...prev,
        totalEmails: MOCK_CONTACT_MESSAGES.length
      }));
      setIsLoading(false);
    }, 800);
  }, []);

  // Appliquer les filtres et la recherche
  const filteredAndSortedMessages = useMemo(() => {
    let result = [...messages];
    
    // Filtrer par onglet (contact/newsletter)
    if (activeTab === 'contact') {
      result = result.filter(msg => !msg.isNewsletter);
    } else {
      result = result.filter(msg => msg.isNewsletter);
    }
    
    // Filtrer par statut
    if (filterStatus !== 'all') {
      result = result.filter(msg => msg.status === filterStatus);
    }
    
    // Filtrer par catégorie
    if (filterCategory !== 'all') {
      result = result.filter(msg => msg.category === filterCategory);
    }
    
    // Filtrer par terme de recherche
    if (searchTerm) {
      const lowerSearchTerm = searchTerm.toLowerCase();
      result = result.filter(
        msg => 
          msg.name.toLowerCase().includes(lowerSearchTerm) ||
          msg.email.toLowerCase().includes(lowerSearchTerm) ||
          msg.subject.toLowerCase().includes(lowerSearchTerm) ||
          msg.message.toLowerCase().includes(lowerSearchTerm) ||
          (msg.phone && msg.phone.toLowerCase().includes(lowerSearchTerm))
      );
    }
    
    // Trier par date (plus récent en premier)
    result.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    return result;
  }, [messages, activeTab, filterStatus, filterCategory, searchTerm]);

  useEffect(() => {
    setFilteredMessages(filteredAndSortedMessages);
    setCurrentPage(1);
  }, [filteredAndSortedMessages]);

  // Obtenir les messages actuels pour la pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredMessages.slice(indexOfFirstItem, indexOfLastItem);
  
  // Changer de page
  const paginate = useCallback((pageNumber) => setCurrentPage(pageNumber), []);
  
  // Formater la date pour l'affichage
  const formatDate = useCallback((dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  }, []);
  
  // Sélectionner un message pour afficher les détails
  const handleSelectMessage = useCallback((message) => {
    // Marquer comme lu s'il ne l'était pas déjà
    if (!message.isRead) {
      setMessages(prev => prev.map(msg => 
        msg.id === message.id ? { ...msg, isRead: true } : msg
      ));
    }
    setSelectedMessage(message);
    setShowReplyForm(false);
    setReplyContent('');
  }, []);
  
  // Supprimer un message
  const handleDeleteMessage = useCallback((id, event) => {
    event?.stopPropagation();
    
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce message ?')) {
      setMessages(prev => prev.filter(msg => msg.id !== id));
      
      if (selectedMessage && selectedMessage.id === id) {
        setSelectedMessage(null);
      }
      
      showNotification('success', 'Message supprimé avec succès');
    }
  }, [selectedMessage]);

  // Suppression en masse
  const handleMassDelete = useCallback(() => {
    const selectedMessages = messages.filter(msg => msg.isSelected);
    
    if (selectedMessages.length === 0) {
      showNotification('error', 'Aucun message sélectionné');
      return;
    }
    
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer ${selectedMessages.length} message(s) ?`)) {
      setMessages(prev => prev.filter(msg => !msg.isSelected));
      setSelectAll(false);
      showNotification('success', `${selectedMessages.length} message(s) supprimé(s)`);
    }
  }, [messages]);

  // Sélectionner/Désélectionner tous les messages
  const handleSelectAll = useCallback(() => {
    const newSelectAll = !selectAll;
    setSelectAll(newSelectAll);
    setMessages(prev => prev.map(msg => ({ ...msg, isSelected: newSelectAll })));
  }, [selectAll]);

  // Sélectionner/Désélectionner un message individuel
  const handleSelectMessage2 = useCallback((id) => {
    setMessages(prev => prev.map(msg => 
      msg.id === id ? { ...msg, isSelected: !msg.isSelected } : msg
    ));
  }, []);
  
  // Gérer l'envoi de réponse
  const handleSendReply = useCallback((e) => {
    e.preventDefault();
    
    if (replyContent.trim() === '') return;
    
    setMessages(prev => prev.map(msg => 
      msg.id === selectedMessage.id ? { ...msg, status: 'answered' } : msg
    ));
    
    setShowReplyForm(false);
    setReplyContent('');
    
    showNotification('success', 'Réponse envoyée avec succès');
  }, [selectedMessage, replyContent]);

  // Créer une nouvelle newsletter
  const handleSubmitNewsletter = useCallback((e) => {
    e.preventDefault();
    
    const newNewsletter = {
      id: Date.now(),
      name: 'EatFast Marketing',
      email: 'marketing@eatfast.cm',
      subject: newsletterData.subject,
      message: newsletterData.content,
      date: newsletterData.scheduledDate || new Date().toISOString(),
      isRead: true,
      isNewsletter: true,
      status: newsletterData.scheduledDate ? 'scheduled' : 'draft',
      recipients: 0,
      openRate: '0%',
      isSelected: false
    };
    
    setMessages(prev => [...prev, newNewsletter]);
    setIsCreatingNewsletter(false);
    setNewsletterData({
      subject: '',
      content: '',
      recipients: 'all',
      scheduledDate: '',
      template: ''
    });
    
    showNotification('success', 'Newsletter créée avec succès');
  }, [newsletterData]);

  // Envoyer un email en masse
  const handleSendMassEmail = useCallback((e) => {
    e.preventDefault();
    
    const selectedMessages = messages.filter(msg => msg.isSelected);
    
    if (massEmailData.recipients === 'selected' && selectedMessages.length === 0) {
      showNotification('error', 'Aucun destinataire sélectionné');
      return;
    }
    
    const recipientCount = massEmailData.recipients === 'all' 
      ? messages.length 
      : selectedMessages.length;
    
    // Simuler l'envoi
    setTimeout(() => {
      showNotification('success', `Email envoyé à ${recipientCount} destinataire(s)`);
      setShowMassEmailModal(false);
      setMassEmailData({
        subject: '',
        content: '',
        recipients: 'selected',
        template: ''
      });
    }, 1000);
  }, [massEmailData, messages]);
  
  // Envoyer une newsletter
  const handleSendNewsletter = useCallback((id) => {
    setMessages(prev => prev.map(msg => 
      msg.id === id ? { 
        ...msg, 
        status: 'sent',
        recipients: Math.floor(Math.random() * 500) + 2000,
        openRate: Math.floor(Math.random() * 30 + 20) + '%'
      } : msg
    ));
    
    showNotification('success', 'Newsletter envoyée avec succès');
  }, []);

  // Traitement des fichiers uploadés
  const handleFileUpload = useCallback((event) => {
    const file = event.target.files[0];
    if (!file) return;

    const allowedTypes = [
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'text/csv',
      'application/csv'
    ];

    if (!allowedTypes.includes(file.type)) {
      showNotification('error', 'Format de fichier non supporté. Utilisez Excel (.xlsx, .xls) ou CSV');
      return;
    }

    setProcessingFile(true);

    // Simuler le traitement du fichier
    setTimeout(() => {
      const mockExtractedContacts = [
        { name: 'Contact Import 1', email: 'import1@example.com', phone: '+237 600000001' },
        { name: 'Contact Import 2', email: 'import2@example.com', phone: '+237 600000002' },
        { name: 'Contact Import 3', email: 'import3@example.com', phone: '+237 600000003' },
        { name: 'Contact Import 4', email: 'import4@example.com', phone: '+237 600000004' },
        { name: 'Contact Import 5', email: 'import5@example.com', phone: '+237 600000005' }
      ];

      setUploadedContacts(mockExtractedContacts);
      setProcessingFile(false);
      showNotification('success', `${mockExtractedContacts.length} contacts extraits avec succès`);
    }, 2000);
  }, []);

  // Sauvegarder les contacts importés
  const handleSaveImportedContacts = useCallback(() => {
    const newMessages = uploadedContacts.map((contact, index) => ({
      id: Date.now() + index,
      name: contact.name,
      email: contact.email,
      phone: contact.phone,
      subject: 'Contact importé',
      message: 'Contact ajouté via import de fichier',
      date: new Date().toISOString(),
      isRead: true,
      isNewsletter: false,
      status: 'imported',
      category: 'import',
      isSelected: false
    }));

    setMessages(prev => [...prev, ...newMessages]);
    setEmailStats(prev => ({
      ...prev,
      totalEmails: prev.totalEmails + newMessages.length
    }));
    setUploadedContacts([]);
    setShowUploadModal(false);
    
    showNotification('success', `${newMessages.length} contacts ajoutés à la base de données`);
  }, [uploadedContacts]);

  // Appliquer un modèle d'email
  const applyTemplate = useCallback((template, isNewsletter = false) => {
    if (isNewsletter) {
      setNewsletterData(prev => ({
        ...prev,
        subject: template.subject,
        content: template.content,
        template: template.id
      }));
    } else {
      setMassEmailData(prev => ({
        ...prev,
        subject: template.subject,
        content: template.content,
        template: template.id
      }));
    }
    setShowTemplatesModal(false);
  }, []);
  
  // Afficher une notification
  const showNotification = useCallback((type, message) => {
    setNotification({ type, message });
    
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  }, []);
  
  // Retour à la liste
  const handleBackToList = useCallback(() => {
    setSelectedMessage(null);
    setShowReplyForm(false);
    setIsCreatingNewsletter(false);
  }, []);
  
  // Obtenir la couleur du badge de statut
  const getStatusColor = useCallback((status) => {
    const colors = {
      pending: 'bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-800 border border-yellow-300',
      answered: 'bg-gradient-to-r from-green-100 to-green-200 text-green-800 border border-green-300',
      urgent: 'bg-gradient-to-r from-red-100 to-red-200 text-red-800 border border-red-300',
      sent: 'bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 border border-blue-300',
      draft: 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 border border-gray-300',
      scheduled: 'bg-gradient-to-r from-purple-100 to-purple-200 text-purple-800 border border-purple-300',
      imported: 'bg-gradient-to-r from-indigo-100 to-indigo-200 text-indigo-800 border border-indigo-300'
    };
    return colors[status] || 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 border border-gray-300';
  }, []);

  // Statistiques calculées
  const stats = useMemo(() => {
    const total = messages.length;
    const unread = messages.filter(m => !m.isRead).length;
    const pending = messages.filter(m => m.status === 'pending').length;
    const answered = messages.filter(m => m.status === 'answered').length;
    
    return { total, unread, pending, answered };
  }, [messages]);
  
  // Rendu de la notification
  const renderNotification = useCallback(() => {
    if (!notification) return null;
    
    const bgColor = notification.type === 'success' 
      ? 'bg-gradient-to-r from-green-500 to-green-600' 
      : 'bg-gradient-to-r from-red-500 to-red-600';
    
    return (
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -50 }}
        className={`fixed top-20 right-4 z-50 flex items-center p-4 rounded-xl shadow-2xl ${bgColor} text-white min-w-[300px]`}
      >
        {notification.type === 'success' ? <FiCheck className="mr-2" /> : <FiAlertCircle className="mr-2" />}
        <span className="font-medium">{notification.message}</span>
      </motion.div>
    );
  }, [notification]);

  return (
    <AdminLayoutWrapper pageTitle="contactMessages">
      <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors duration-300">
        {/* Header */}
        <div className="mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {t('contactMessages.title', { ns: 'admin' })}
              </h1>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {t('contactMessages.subtitle', { ns: 'admin' })}
              </p>
            </div>
            <div className="mt-4 md:mt-0 flex flex-wrap gap-3">
              <button
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-2 transition-colors duration-200"
                onClick={handleRefresh}
              >
                <FiRefreshCw className={isRefreshing ? "animate-spin" : ""} />
                {t('common.refresh', { ns: 'translation' })}
              </button>
              <button
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg flex items-center gap-2 transition-colors duration-200"
                onClick={() => setShowComposeModal(true)}
              >
                <FiSend />
                {t('common.compose', { ns: 'translation' })}
              </button>
              <button
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg flex items-center gap-2 transition-colors duration-200"
                onClick={handleDeleteSelected}
                disabled={selectedMessages.length === 0}
              >
                <FiTrash2 />
                {t('contactMessages.deleteSelected', { ns: 'admin' })}
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6 bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden transition-colors duration-300">
          <div className="flex overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.value}
                className={`px-6 py-4 text-sm font-medium whitespace-nowrap ${
                  activeTab === tab.value
                    ? "text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400"
                    : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                }`}
                onClick={() => setActiveTab(tab.value)}
              >
                <div className="flex items-center gap-2">
                  {tab.icon}
                  <span>{tab.label}</span>
                  {tab.count > 0 && (
                    <span className="px-2 py-1 text-xs rounded-full bg-gray-100 dark:bg-gray-700">
                      {tab.count}
                    </span>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6 bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 transition-colors duration-300">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiSearch className="text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder={t('common.search', { ns: 'translation' })}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <div className="relative">
                <button
                  onClick={() => setShowCategoryFilter(!showCategoryFilter)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 flex items-center gap-2 transition-colors duration-200"
                >
                  <FiTag />
                  {t('common.category', { ns: 'translation' })}
                  {showCategoryFilter ? <FiChevronUp /> : <FiChevronDown />}
                </button>
                {showCategoryFilter && (
                  <div className="absolute z-10 mt-1 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 transition-colors duration-200">
                    {Object.keys(categoryOptions).map((category) => (
                      <button
                        key={category}
                        className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 ${
                          filterCategory === category
                            ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300"
                            : "text-gray-700 dark:text-gray-200"
                        }`}
                        onClick={() => {
                          setFilterCategory(category);
                          setShowCategoryFilter(false);
                        }}
                      >
                        {categoryOptions[category]}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="relative">
                <button
                  onClick={() => setShowStatusFilter(!showStatusFilter)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 flex items-center gap-2 transition-colors duration-200"
                >
                  <FiActivity />
                  {t('common.status', { ns: 'translation' })}
                  {showStatusFilter ? <FiChevronUp /> : <FiChevronDown />}
                </button>
                {showStatusFilter && (
                  <div className="absolute z-10 mt-1 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 transition-colors duration-200">
                    {Object.keys(statusOptions).map((status) => (
                      <button
                        key={status}
                        className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 ${
                          filterStatus === status
                            ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300"
                            : "text-gray-700 dark:text-gray-200"
                        }`}
                        onClick={() => {
                          setFilterStatus(status);
                          setShowStatusFilter(false);
                        }}
                      >
                        {statusOptions[status]}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="relative">
                <button
                  onClick={() => setShowDateFilter(!showDateFilter)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 flex items-center gap-2 transition-colors duration-200"
                >
                  <FiCalendar />
                  {t('common.date', { ns: 'translation' })}
                  {showDateFilter ? <FiChevronUp /> : <FiChevronDown />}
                </button>
                {showDateFilter && (
                  <div className="absolute z-10 mt-1 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 transition-colors duration-200">
                    {dateFilterOptions.map((option) => (
                      <button
                        key={option.value}
                        className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 ${
                          dateFilter === option.value
                            ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300"
                            : "text-gray-700 dark:text-gray-200"
                        }`}
                        onClick={() => {
                          setDateFilter(option.value);
                          setShowDateFilter(false);
                        }}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <button
                onClick={resetFilters}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 flex items-center gap-2 transition-colors duration-200"
              >
                <FiX />
                {t('common.reset', { ns: 'translation' })}
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 border-l-4 border-blue-500 transition-colors duration-200">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">{t('contactMessages.totalMessages', { ns: 'admin' })}</p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">{filteredMessages.length}</p>
              </div>
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <FiMail className="text-blue-600 dark:text-blue-400 text-xl" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 border-l-4 border-yellow-500 transition-colors duration-200">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">{t('contactMessages.unreadMessages', { ns: 'admin' })}</p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">{unreadCount}</p>
              </div>
              <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
                <FiAlertCircle className="text-yellow-600 dark:text-yellow-400 text-xl" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 border-l-4 border-red-500 transition-colors duration-200">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">{t('contactMessages.pendingMessages', { ns: 'admin' })}</p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">{pendingCount}</p>
              </div>
              <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
                <FiClock className="text-red-600 dark:text-red-400 text-xl" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 border-l-4 border-green-500 transition-colors duration-200">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">{t('contactMessages.answeredMessages', { ns: 'admin' })}</p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">{answeredCount}</p>
              </div>
              <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <FiCheckCircle className="text-green-600 dark:text-green-400 text-xl" />
              </div>
            </div>
          </div>
        </div>

        {/* Messages Table */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden transition-colors duration-200">
          {/* Table content... */}
        </div>

        {/* Message Details Modal */}
        <AnimatePresence>
          {selectedMessage && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
              onClick={closeMessageDetails}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden transition-colors duration-300"
              >
                {/* Modal content... */}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Compose Message Modal */}
        <AnimatePresence>
          {showComposeModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
              onClick={() => setShowComposeModal(false)}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden transition-colors duration-300"
              >
                {/* Modal content... */}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AdminLayoutWrapper>
  );
};

export default AdminContactMessages;