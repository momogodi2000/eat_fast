import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
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
  FiPieChart
} from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

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
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Notification */}
      <AnimatePresence>
        {renderNotification()}
      </AnimatePresence>
      
      {/* En-tête avec onglets amélioré */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-white to-gray-50 dark:from-gray-800 dark:to-gray-750 shadow-xl border-b border-gray-200 dark:border-gray-700 p-6"
      >
        <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6">
          <div className="flex items-center">
            <motion.div 
              className="bg-gradient-to-br from-blue-500 to-purple-600 p-3 rounded-xl shadow-lg mr-4"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              {activeTab === 'contact' ? (
                <FiMessageSquare className="text-white" size={32} />
              ) : (
                <FiMail className="text-white" size={32} />
              )}
            </motion.div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                {activeTab === 'contact' ? 'Messages de Contact' : 'Newsletters'}
              </h1>
              <p className="text-gray-600 dark:text-gray-400 text-lg">
                Gestion avancée des communications clients
              </p>
            </div>
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 rounded-xl p-1 shadow-inner">
              <motion.button 
                className={`px-6 py-3 rounded-lg transition-all duration-300 font-medium ${
                  activeTab === 'contact' 
                    ? 'bg-white dark:bg-gray-800 shadow-lg text-gray-900 dark:text-white transform scale-105' 
                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                }`}
                onClick={() => setActiveTab('contact')}
                whileHover={{ scale: activeTab !== 'contact' ? 1.02 : 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                <FiMessageSquare className="mr-2 inline" />
                Messages
              </motion.button>
              <motion.button 
                className={`px-6 py-3 rounded-lg transition-all duration-300 font-medium ${
                  activeTab === 'newsletter' 
                    ? 'bg-white dark:bg-gray-800 shadow-lg text-gray-900 dark:text-white transform scale-105' 
                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                }`}
                onClick={() => setActiveTab('newsletter')}
                whileHover={{ scale: activeTab !== 'newsletter' ? 1.02 : 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                <FiMail className="mr-2 inline" />
                Newsletters
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Statistiques améliorées */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="p-6"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          {[
            { key: 'total', label: 'Total Messages', value: stats.total, icon: FiMessageSquare, color: 'indigo', bgGradient: 'from-indigo-500 to-indigo-600' },
            { key: 'unread', label: 'Non Lus', value: stats.unread, icon: FiBell, color: 'orange', bgGradient: 'from-orange-500 to-orange-600' },
            { key: 'pending', label: 'En Attente', value: stats.pending, icon: FiClock, color: 'yellow', bgGradient: 'from-yellow-500 to-yellow-600' },
            { key: 'answered', label: 'Répondus', value: stats.answered, icon: FiCheck, color: 'green', bgGradient: 'from-green-500 to-green-600' },
            { key: 'openRate', label: 'Taux d\'Ouverture', value: `${emailStats.openRate}%`, icon: FiPieChart, color: 'purple', bgGradient: 'from-purple-500 to-purple-600' }
          ].map((stat, index) => (
            <motion.div
              key={stat.key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 * index }}
              whileHover={{ y: -4, scale: 1.02 }}
              className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all duration-300"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                    {stat.label}
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {stat.value}
                  </p>
                </div>
                <div className={`bg-gradient-to-br ${stat.bgGradient} p-3 rounded-xl shadow-lg`}>
                  <stat.icon className="text-white" size={20} />
                </div>
              </div>
              <div className="mt-3 flex items-center">
                <FiTrendingUp className={`text-${stat.color}-500 mr-1`} size={14} />
                <span className={`text-${stat.color}-600 dark:text-${stat.color}-400 text-sm font-medium`}>
                  Temps réel
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Actions rapides */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 p-4 mb-6"
        >
          <div className="flex flex-wrap gap-3">
            <motion.button
              onClick={() => setShowMassEmailModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg font-medium shadow-lg transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FiSend size={16} />
              Email en Masse
            </motion.button>

            <motion.button
              onClick={() => setShowUploadModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-lg font-medium shadow-lg transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FiUpload size={16} />
              Importer Contacts
            </motion.button>

            <motion.button
              onClick={() => setShowTemplatesModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white rounded-lg font-medium shadow-lg transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FiFileText size={16} />
              Modèles
            </motion.button>

            <motion.button
              onClick={handleMassDelete}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-lg font-medium shadow-lg transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FiTrash2 size={16} />
              Supprimer Sélectionnés
            </motion.button>

            {activeTab === 'newsletter' && (
              <motion.button
                onClick={() => setIsCreatingNewsletter(true)}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white rounded-lg font-medium shadow-lg transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FiEdit size={16} />
                Créer Newsletter
              </motion.button>
            )}
          </div>
        </motion.div>

        {/* Contenu principal */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
          {isLoading ? (
            <div className="flex justify-center items-center p-12">
              <motion.div 
                className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
            </div>
          ) : (
            <div className="flex flex-col xl:flex-row">
              {/* Liste des messages à gauche */}
              {!selectedMessage && !isCreatingNewsletter && (
                <div className="w-full xl:w-1/2 border-r border-gray-200 dark:border-gray-700">
                  {/* Barre de recherche et filtres */}
                  <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 border-b border-gray-200 dark:border-gray-700 p-4">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
                      {/* Recherche */}
                      <div className="relative">
                        <input
                          type="text"
                          className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm font-medium"
                          placeholder="Rechercher messages..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        {searchTerm && (
                          <button 
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            onClick={() => setSearchTerm('')}
                          >
                            <FiX />
                          </button>
                        )}
                      </div>
                      
                      {/* Filtre par statut */}
                      <select
                        className="px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm font-medium"
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                      >
                        <option value="all">Tous les statuts</option>
                        {activeTab === 'contact' ? (
                          <>
                            <option value="pending">En attente</option>
                            <option value="answered">Répondus</option>
                            <option value="urgent">Urgents</option>
                            <option value="imported">Importés</option>
                          </>
                        ) : (
                          <>
                            <option value="draft">Brouillons</option>
                            <option value="scheduled">Programmés</option>
                            <option value="sent">Envoyés</option>
                          </>
                        )}
                      </select>

                      {/* Filtre par catégorie */}
                      <select
                        className="px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm font-medium"
                        value={filterCategory}
                        onChange={(e) => setFilterCategory(e.target.value)}
                      >
                        <option value="all">Toutes catégories</option>
                        <option value="delivery">Livraison</option>
                        <option value="complaint">Plainte</option>
                        <option value="suggestion">Suggestion</option>
                        <option value="business">Business</option>
                        <option value="recruitment">Recrutement</option>
                        <option value="import">Import</option>
                      </select>
                    </div>

                    {/* Sélection en masse */}
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center">
                        <motion.button
                          onClick={handleSelectAll}
                          className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          {selectAll ? <FiCheckSquare size={16} /> : <FiSquare size={16} />}
                          Tout sélectionner
                        </motion.button>
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {messages.filter(m => m.isSelected).length} sélectionné(s) sur {filteredMessages.length}
                      </div>
                    </div>
                  </div>
                  
                  {/* Liste des messages */}
                  {currentItems.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                      {activeTab === 'contact' ? (
                        <FiMessageSquare className="h-16 w-16 text-gray-400 mb-4" />
                      ) : (
                        <FiMail className="h-16 w-16 text-gray-400 mb-4" />
                      )}
                      <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                        Aucun message trouvé
                      </h3>
                      <p className="mt-1 text-gray-500 dark:text-gray-400">
                        {searchTerm || filterStatus !== 'all' 
                          ? 'Essayez de modifier vos filtres'
                          : activeTab === 'contact' 
                            ? 'Aucun message de contact'
                            : 'Aucune newsletter'}
                      </p>
                    </div>
                  ) : (
                    <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                      <AnimatePresence>
                        {currentItems.map((message, index) => (
                          <motion.li 
                            key={message.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            transition={{ delay: index * 0.05 }}
                            className={`hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-purple-50/50 dark:hover:from-blue-900/20 dark:hover:to-purple-900/20 cursor-pointer transition-all duration-200 ${
                              !message.isRead ? 'bg-gradient-to-r from-green-50/50 to-blue-50/50 dark:from-green-900/20 dark:to-blue-900/20' : ''
                            } ${message.isSelected ? 'bg-gradient-to-r from-blue-100/70 to-purple-100/70 dark:from-blue-800/30 dark:to-purple-800/30' : ''}`}
                            onClick={() => handleSelectMessage(message)}
                          >
                            <div className="px-6 py-4 relative">
                              <div className="flex items-center">
                                {/* Case à cocher */}
                                <motion.button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleSelectMessage2(message.id);
                                  }}
                                  className="mr-3 text-gray-400 hover:text-blue-600"
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.95 }}
                                >
                                  {message.isSelected ? <FiCheckSquare size={16} /> : <FiSquare size={16} />}
                                </motion.button>

                                {/* Icône du message */}
                                <div className="flex-shrink-0 flex items-center mr-4">
                                  {message.isNewsletter ? (
                                    <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white shadow-lg">
                                      <FiMail size={20} />
                                    </div>
                                  ) : (
                                    <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-green-500 to-blue-600 flex items-center justify-center text-white shadow-lg">
                                      <FiMessageSquare size={20} />
                                    </div>
                                  )}
                                  {/* Indicateur non lu */}
                                  {!message.isRead && (
                                    <span className="absolute top-4 left-16 h-3 w-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-800 animate-pulse"></span>
                                  )}
                                </div>
                                
                                <div className="flex-grow">
                                  <div className="flex items-center justify-between">
                                    <p className="text-sm font-bold text-gray-900 dark:text-white truncate">
                                      {message.name}
                                    </p>
                                    <div className="ml-2 flex items-center gap-2">
                                      {/* Badge de statut */}
                                      <motion.span 
                                        className={`px-2 py-1 text-xs font-bold rounded-full ${getStatusColor(message.status)}`}
                                        whileHover={{ scale: 1.05 }}
                                      >
                                        {message.status === 'pending' ? 'En attente' :
                                         message.status === 'answered' ? 'Répondu' :
                                         message.status === 'urgent' ? 'Urgent' :
                                         message.status === 'sent' ? 'Envoyé' :
                                         message.status === 'draft' ? 'Brouillon' :
                                         message.status === 'scheduled' ? 'Programmé' :
                                         message.status === 'imported' ? 'Importé' : message.status}
                                      </motion.span>
                                    </div>
                                  </div>
                                  
                                  {/* Email et téléphone */}
                                  <div className="flex items-center gap-4 mt-1">
                                    <p className="text-sm text-gray-500 truncate flex items-center">
                                      <FiMail size={12} className="mr-1" />
                                      {message.email}
                                    </p>
                                    {message.phone && (
                                      <p className="text-sm text-gray-500 flex items-center">
                                        <FiPhone size={12} className="mr-1" />
                                        {message.phone}
                                      </p>
                                    )}
                                  </div>
                                  
                                  {/* Sujet */}
                                  <p className={`mt-1 text-sm ${!message.isRead ? 'font-bold text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-300'} truncate`}>
                                    {message.subject}
                                  </p>
                                  
                                  {/* Aperçu du message */}
                                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 line-clamp-2">
                                    {message.message}
                                  </p>

                                  {/* Stats newsletter */}
                                  {message.isNewsletter && message.status === 'sent' && (
                                    <div className="mt-2 flex items-center gap-4 text-xs text-gray-500">
                                      <span className="flex items-center">
                                        <FiUsers size={12} className="mr-1" />
                                        {message.recipients} destinataires
                                      </span>
                                      <span className="flex items-center">
                                        <FiActivity size={12} className="mr-1" />
                                        {message.openRate} ouverture
                                      </span>
                                    </div>
                                  )}
                                </div>
                              </div>
                              
                              <div className="mt-3 flex items-center justify-between">
                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                  {formatDate(message.date)}
                                </div>
                                <div className="flex items-center gap-2">
                                  <motion.button
                                    className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 p-1 rounded"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleSelectMessage(message);
                                    }}
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.95 }}
                                    title="Voir détails"
                                  >
                                    <FiEye size={14} />
                                  </motion.button>
                                  
                                  <motion.button
                                    className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 p-1 rounded"
                                    onClick={(e) => handleDeleteMessage(message.id, e)}
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.95 }}
                                    title="Supprimer"
                                  >
                                    <FiTrash2 size={14} />
                                  </motion.button>
                                </div>
                              </div>
                            </div>
                          </motion.li>
                        ))}
                      </AnimatePresence>
                    </ul>
                  )}
                  
                  {/* Pagination */}
                  {filteredMessages.length > itemsPerPage && (
                    <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 px-6 py-4 flex items-center justify-between border-t border-gray-200 dark:border-gray-700">
                      <div className="text-sm text-gray-700 dark:text-gray-300">
                        Affichage de <span className="font-medium">{indexOfFirstItem + 1}</span> à{' '}
                        <span className="font-medium">{Math.min(indexOfLastItem, filteredMessages.length)}</span> sur{' '}
                        <span className="font-medium">{filteredMessages.length}</span> résultats
                      </div>
                      <div className="flex items-center gap-2">
                        <motion.button
                          onClick={() => paginate(currentPage - 1)}
                          disabled={currentPage === 1}
                          className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                            currentPage === 1 
                              ? 'bg-gray-200 dark:bg-gray-600 text-gray-400 dark:text-gray-500 cursor-not-allowed' 
                              : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 shadow-sm'
                          }`}
                          whileHover={currentPage !== 1 ? { scale: 1.05 } : {}}
                          whileTap={currentPage !== 1 ? { scale: 0.95 } : {}}
                        >
                          <FiArrowLeft size={16} />
                        </motion.button>

                        {Array.from({ length: Math.ceil(filteredMessages.length / itemsPerPage) }).slice(
                          Math.max(0, currentPage - 3),
                          Math.min(Math.ceil(filteredMessages.length / itemsPerPage), currentPage + 2)
                        ).map((_, index) => {
                          const pageNum = Math.max(0, currentPage - 3) + index + 1;
                          return (
                            <motion.button
                              key={pageNum}
                              onClick={() => paginate(pageNum)}
                              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                                currentPage === pageNum
                                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 shadow-sm'
                              }`}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              {pageNum}
                            </motion.button>
                          );
                        })}

                        <motion.button
                          onClick={() => paginate(currentPage + 1)}
                          disabled={currentPage === Math.ceil(filteredMessages.length / itemsPerPage)}
                          className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                            currentPage === Math.ceil(filteredMessages.length / itemsPerPage) 
                              ? 'bg-gray-200 dark:bg-gray-600 text-gray-400 dark:text-gray-500 cursor-not-allowed' 
                              : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 shadow-sm'
                          }`}
                          whileHover={currentPage !== Math.ceil(filteredMessages.length / itemsPerPage) ? { scale: 1.05 } : {}}
                          whileTap={currentPage !== Math.ceil(filteredMessages.length / itemsPerPage) ? { scale: 0.95 } : {}}
                        >
                          <FiArrowRight size={16} />
                        </motion.button>
                      </div>
                    </div>
                  )}
                </div>
              )}
              
              {/* Vue détaillée du message à droite */}
              {selectedMessage && (
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="w-full xl:w-1/2 bg-gradient-to-br from-gray-50 to-white dark:from-gray-700 dark:to-gray-800"
                >
                  <div className="p-6 h-full overflow-y-auto">
                    {/* Bouton retour */}
                    <motion.button
                      className="inline-flex items-center text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 mb-6 font-medium"
                      onClick={handleBackToList}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <FiArrowLeft className="mr-2" /> Retour à la liste
                    </motion.button>
                    
                    {/* En-tête du message */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                        {selectedMessage.subject}
                      </h2>
                      <motion.span 
                        className={`mt-2 sm:mt-0 px-4 py-2 text-sm font-bold rounded-full ${getStatusColor(selectedMessage.status)}`}
                        whileHover={{ scale: 1.05 }}
                      >
                        {selectedMessage.status === 'pending' ? 'En attente' :
                         selectedMessage.status === 'answered' ? 'Répondu' :
                         selectedMessage.status === 'urgent' ? 'Urgent' :
                         selectedMessage.status === 'sent' ? 'Envoyé' :
                         selectedMessage.status === 'draft' ? 'Brouillon' :
                         selectedMessage.status === 'scheduled' ? 'Programmé' :
                         selectedMessage.status === 'imported' ? 'Importé' : selectedMessage.status}
                      </motion.span>
                    </div>
                    
                    {/* Informations de l'expéditeur */}
                    <div className="flex items-center mb-6 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm">
                      <div className="flex-shrink-0">
                        <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                          {selectedMessage.name.charAt(0).toUpperCase()}
                        </div>
                      </div>
                      <div className="ml-4 flex-grow">
                        <p className="text-sm font-bold text-gray-900 dark:text-white">
                          {selectedMessage.name}
                        </p>
                        <div className="flex items-center gap-4 mt-1">
                          <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                            <FiMail size={12} className="mr-1" />
                            {selectedMessage.email}
                          </p>
                          {selectedMessage.phone && (
                            <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                              <FiPhone size={12} className="mr-1" />
                              {selectedMessage.phone}
                            </p>
                          )}
                        </div>
                      </div>
                      <p className="ml-auto text-sm text-gray-500 dark:text-gray-400">
                        {formatDate(selectedMessage.date)}
                      </p>
                    </div>
                    
                    {/* Contenu du message */}
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm mb-6">
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                        Contenu du message
                      </h3>
                      <div className="prose dark:prose-invert max-w-none">
                        <div className="whitespace-pre-wrap text-gray-700 dark:text-gray-300 leading-relaxed">
                          {selectedMessage.message}
                        </div>
                      </div>
                    </div>
                    
                    {/* Statistiques newsletter */}
                    {selectedMessage.isNewsletter && selectedMessage.status === 'sent' && (
                      <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/30 dark:to-purple-900/30 rounded-xl p-6 mb-6">
                        <h3 className="text-lg font-bold text-blue-800 dark:text-blue-200 mb-4">
                          Statistiques de la Newsletter
                        </h3>
                        <div className="grid grid-cols-2 gap-6">
                          <div className="text-center">
                            <div className="text-3xl font-bold text-gray-900 dark:text-white">
                              {selectedMessage.recipients}
                            </div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              Destinataires
                            </p>
                          </div>
                          <div className="text-center">
                            <div className="text-3xl font-bold text-gray-900 dark:text-white">
                              {selectedMessage.openRate}
                            </div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              Taux d'ouverture
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {/* Boutons d'action */}
                    <div className="flex flex-wrap gap-3 mb-6">
                      {selectedMessage.isNewsletter ? (
                        <>
                          {selectedMessage.status === 'draft' && (
                            <motion.button
                              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-xl font-medium shadow-lg transition-all duration-300"
                              onClick={() => handleSendNewsletter(selectedMessage.id)}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <FiSend size={16} />
                              Envoyer Newsletter
                            </motion.button>
                          )}
                          
                          <motion.button
                            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl font-medium shadow-lg transition-all duration-300"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <FiCopy size={16} />
                            Dupliquer
                          </motion.button>
                        </>
                      ) : (
                        <>
                          {selectedMessage.status !== 'answered' && (
                            <motion.button
                              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-xl font-medium shadow-lg transition-all duration-300"
                              onClick={() => setShowReplyForm(true)}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <FiSend size={16} />
                              Répondre
                            </motion.button>
                          )}
                          
                          {selectedMessage.status !== 'urgent' && (
                            <motion.button
                              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-xl font-medium shadow-lg transition-all duration-300"
                              onClick={() => {
                                setMessages(prev => prev.map(msg => 
                                  msg.id === selectedMessage.id ? { ...msg, status: 'urgent' } : msg
                                ));
                                setSelectedMessage({ ...selectedMessage, status: 'urgent' });
                              }}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <FiAlertCircle size={16} />
                              Marquer Urgent
                            </motion.button>
                          )}
                        </>
                      )}
                      
                      <motion.button
                        className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white rounded-xl font-medium shadow-lg transition-all duration-300"
                        onClick={() => handleDeleteMessage(selectedMessage.id, { stopPropagation: () => {} })}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <FiTrash2 size={16} />
                        Supprimer
                      </motion.button>
                    </div>
                    
                    {/* Formulaire de réponse */}
                    <AnimatePresence>
                      {showReplyForm && (
                        <motion.form 
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          onSubmit={handleSendReply} 
                          className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm"
                        >
                          <label htmlFor="reply" className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">
                            Votre réponse
                          </label>
                          <textarea
                            id="reply"
                            name="reply"
                            rows={6}
                            className="w-full p-4 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                            value={replyContent}
                            onChange={(e) => setReplyContent(e.target.value)}
                            ref={replyContentRef}
                            placeholder="Tapez votre réponse ici..."
                            required
                          />
                          <div className="mt-4 flex justify-end space-x-3">
                            <motion.button
                              type="button"
                              className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 rounded-xl font-medium transition-all duration-300"
                              onClick={() => setShowReplyForm(false)}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              Annuler
                            </motion.button>
                            <motion.button
                              type="submit"
                              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-xl font-medium shadow-lg transition-all duration-300"
                              disabled={replyContent.trim() === ''}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <FiSend size={16} />
                              Envoyer Réponse
                            </motion.button>
                          </div>
                        </motion.form>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              )}
              
              {/* Formulaire de création de newsletter */}
              {isCreatingNewsletter && (
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="w-full xl:w-1/2 bg-gradient-to-br from-gray-50 to-white dark:from-gray-700 dark:to-gray-800"
                >
                  <div className="p-6 h-full overflow-y-auto">
                    <motion.button
                      className="inline-flex items-center text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 mb-6 font-medium"
                      onClick={handleBackToList}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <FiArrowLeft className="mr-2" /> Retour à la liste
                    </motion.button>
                    
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                      <FiEdit className="mr-3 text-blue-600" />
                      Créer une Nouvelle Newsletter
                    </h2>
                    
                    <form onSubmit={handleSubmitNewsletter} className="space-y-6">
                      {/* Modèles prédéfinis */}
                      <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm">
                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">
                          Utiliser un modèle (optionnel)
                        </label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {EMAIL_TEMPLATES.map((template) => (
                            <motion.button
                              key={template.id}
                              type="button"
                              onClick={() => applyTemplate(template, true)}
                              className="p-3 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-left transition-all duration-200"
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              <div className="font-medium text-sm text-gray-900 dark:text-white">
                                {template.name}
                              </div>
                              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                {template.category}
                              </div>
                            </motion.button>
                          ))}
                        </div>
                      </div>

                      {/* Sujet */}
                      <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm">
                        <label htmlFor="subject" className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">
                          Sujet *
                        </label>
                        <input
                          type="text"
                          id="subject"
                          className="w-full p-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                          value={newsletterData.subject}
                          onChange={(e) => setNewsletterData({ ...newsletterData, subject: e.target.value })}
                          required
                        />
                      </div>
                      
                      {/* Contenu */}
                      <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm">
                        <label htmlFor="content" className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">
                          Contenu *
                        </label>
                        <textarea
                          id="content"
                          rows={12}
                          className="w-full p-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                          value={newsletterData.content}
                          onChange={(e) => setNewsletterData({ ...newsletterData, content: e.target.value })}
                          required
                        />
                      </div>
                      
                      {/* Destinataires */}
                      <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm">
                        <label htmlFor="recipients" className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">
                          Destinataires *
                        </label>
                        <select
                          id="recipients"
                          className="w-full p-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                          value={newsletterData.recipients}
                          onChange={(e) => setNewsletterData({ ...newsletterData, recipients: e.target.value })}
                          required
                        >
                          <option value="all">Tous les abonnés</option>
                          <option value="active">Utilisateurs actifs</option>
                          <option value="new">Nouveaux utilisateurs</option>
                        </select>
                      </div>
                      
                      {/* Date programmée */}
                      <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm">
                        <label htmlFor="scheduledDate" className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">
                          Date programmée (optionnel)
                        </label>
                        <input
                          type="datetime-local"
                          id="scheduledDate"
                          className="w-full p-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                          value={newsletterData.scheduledDate}
                          onChange={(e) => setNewsletterData({ ...newsletterData, scheduledDate: e.target.value })}
                        />
                      </div>
                      
                      {/* Boutons d'action */}
                      <div className="flex justify-end space-x-3">
                        <motion.button
                          type="button"
                          className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 rounded-xl font-medium transition-all duration-300"
                          onClick={handleBackToList}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          Annuler
                        </motion.button>
                        <motion.button
                          type="submit"
                          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl font-medium shadow-lg transition-all duration-300"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          {newsletterData.scheduledDate ? (
                            <>
                              <FiClock size={16} />
                              Programmer Newsletter
                            </>
                          ) : (
                            <>
                              <FiSave size={16} />
                              Sauver comme Brouillon
                            </>
                          )}
                        </motion.button>
                      </div>
                    </form>
                  </div>
                </motion.div>
              )}
            </div>
          )}
        </div>

        {/* Modal d'email en masse */}
        <AnimatePresence>
          {showMassEmailModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
              onClick={() => setShowMassEmailModal(false)}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
              >
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4 text-white">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold flex items-center">
                      <FiSend className="mr-3" />
                      Email en Masse
                    </h2>
                    <motion.button
                      onClick={() => setShowMassEmailModal(false)}
                      className="text-white hover:text-gray-200 p-2 rounded-full hover:bg-white hover:bg-opacity-20 transition-all duration-200"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <FiX size={20} />
                    </motion.button>
                  </div>
                </div>
                
                <form onSubmit={handleSendMassEmail} className="p-6 space-y-6">
                  {/* Sélection de modèle */}
                  <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">
                      Utiliser un modèle (optionnel)
                    </label>
                    <div className="grid grid-cols-1 gap-3">
                      {EMAIL_TEMPLATES.map((template) => (
                        <motion.button
                          key={template.id}
                          type="button"
                          onClick={() => applyTemplate(template, false)}
                          className="p-4 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-left transition-all duration-200"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <div className="font-medium text-gray-900 dark:text-white">
                            {template.name}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            {template.subject}
                          </div>
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  {/* Sujet */}
                  <div>
                    <label htmlFor="massSubject" className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">
                      Sujet *
                    </label>
                    <input
                      type="text"
                      id="massSubject"
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={massEmailData.subject}
                      onChange={(e) => setMassEmailData({ ...massEmailData, subject: e.target.value })}
                      required
                    />
                  </div>
                  
                  {/* Contenu */}
                  <div>
                    <label htmlFor="massContent" className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">
                      Contenu *
                    </label>
                    <textarea
                      id="massContent"
                      rows={8}
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={massEmailData.content}
                      onChange={(e) => setMassEmailData({ ...massEmailData, content: e.target.value })}
                      required
                    />
                  </div>
                  
                  {/* Destinataires */}
                  <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">
                      Destinataires *
                    </label>
                    <div className="space-y-3">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="recipients"
                          value="selected"
                          checked={massEmailData.recipients === 'selected'}
                          onChange={(e) => setMassEmailData({ ...massEmailData, recipients: e.target.value })}
                          className="mr-3"
                        />
                        Messages sélectionnés ({messages.filter(m => m.isSelected).length} destinataires)
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="recipients"
                          value="all"
                          checked={massEmailData.recipients === 'all'}
                          onChange={(e) => setMassEmailData({ ...massEmailData, recipients: e.target.value })}
                          className="mr-3"
                        />
                        Tous les contacts ({messages.length} destinataires)
                      </label>
                    </div>
                  </div>
                  
                  {/* Boutons d'action */}
                  <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <motion.button
                      type="button"
                      className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 rounded-xl font-medium transition-all duration-300"
                      onClick={() => setShowMassEmailModal(false)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Annuler
                    </motion.button>
                    <motion.button
                      type="submit"
                      className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl font-medium shadow-lg transition-all duration-300"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <FiSend size={16} />
                      Envoyer Email
                    </motion.button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Modal d'import de contacts */}
        <AnimatePresence>
          {showUploadModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
              onClick={() => setShowUploadModal(false)}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
              >
                <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-6 py-4 text-white">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold flex items-center">
                      <FiUpload className="mr-3" />
                      Importer des Contacts
                    </h2>
                    <motion.button
                      onClick={() => setShowUploadModal(false)}
                      className="text-white hover:text-gray-200 p-2 rounded-full hover:bg-white hover:bg-opacity-20 transition-all duration-200"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <FiX size={20} />
                    </motion.button>
                  </div>
                </div>
                
                <div className="p-6">
                  {/* Instructions */}
                  <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-xl mb-6">
                    <h3 className="font-bold text-blue-800 dark:text-blue-200 mb-2">
                      Instructions d'Import
                    </h3>
                    <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                      <li>• Formats acceptés: Excel (.xlsx, .xls), CSV</li>
                      <li>• Colonnes requises: Nom, Email</li>
                      <li>• Colonne optionnelle: Téléphone</li>
                      <li>• Première ligne = en-têtes de colonnes</li>
                    </ul>
                  </div>

                  {/* Zone de téléchargement */}
                  <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-8 text-center mb-6">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileUpload}
                      accept=".xlsx,.xls,.csv"
                      className="hidden"
                    />
                    
                    {!processingFile ? (
                      <motion.button
                        onClick={() => fileInputRef.current?.click()}
                        className="flex flex-col items-center gap-4 w-full"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-4 rounded-xl">
                          <FiUpload className="text-white" size={32} />
                        </div>
                        <div>
                          <p className="text-lg font-medium text-gray-900 dark:text-white">
                            Cliquez pour sélectionner un fichier
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            ou glissez-déposez votre fichier ici
                          </p>
                        </div>
                      </motion.button>
                    ) : (
                      <div className="flex flex-col items-center gap-4">
                        <motion.div 
                          className="w-12 h-12 border-4 border-green-200 border-t-green-600 rounded-full"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        />
                        <p className="text-lg font-medium text-gray-900 dark:text-white">
                          Traitement du fichier en cours...
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Aperçu des contacts extraits */}
                  {uploadedContacts.length > 0 && (
                    <div className="mb-6">
                      <h3 className="font-bold text-gray-900 dark:text-white mb-4">
                        Contacts extraits ({uploadedContacts.length})
                      </h3>
                      <div className="max-h-60 overflow-y-auto bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
                        {uploadedContacts.map((contact, index) => (
                          <div key={index} className="flex items-center justify-between py-2 border-b border-gray-200 dark:border-gray-600 last:border-b-0">
                            <div>
                              <div className="font-medium text-gray-900 dark:text-white">
                                {contact.name}
                              </div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">
                                {contact.email} {contact.phone && `• ${contact.phone}`}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      <div className="flex justify-end gap-3 mt-4">
                        <motion.button
                          onClick={() => {
                            setUploadedContacts([]);
                            setShowUploadModal(false);
                          }}
                          className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 rounded-xl font-medium transition-all duration-300"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          Annuler
                        </motion.button>
                        <motion.button
                          onClick={handleSaveImportedContacts}
                          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-xl font-medium shadow-lg transition-all duration-300"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <FiDatabase size={16} />
                          Sauvegarder dans la DB
                        </motion.button>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Modal des modèles */}
        <AnimatePresence>
          {showTemplatesModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
              onClick={() => setShowTemplatesModal(false)}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
              >
                <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-4 text-white">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold flex items-center">
                      <FiFileText className="mr-3" />
                      Modèles d'Email
                    </h2>
                    <motion.button
                      onClick={() => setShowTemplatesModal(false)}
                      className="text-white hover:text-gray-200 p-2 rounded-full hover:bg-white hover:bg-opacity-20 transition-all duration-200"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <FiX size={20} />
                    </motion.button>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {EMAIL_TEMPLATES.map((template) => (
                      <motion.div
                        key={template.id}
                        className="border border-gray-300 dark:border-gray-600 rounded-xl p-6 hover:shadow-lg transition-all duration-300"
                        whileHover={{ scale: 1.02 }}
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="font-bold text-gray-900 dark:text-white text-lg">
                              {template.name}
                            </h3>
                            <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full mt-2 ${
                              template.category === 'welcome' ? 'bg-green-100 text-green-800' :
                              template.category === 'promotion' ? 'bg-orange-100 text-orange-800' :
                              'bg-blue-100 text-blue-800'
                            }`}>
                              {template.category === 'welcome' ? 'Bienvenue' :
                               template.category === 'promotion' ? 'Promotion' :
                               template.category === 'retention' ? 'Rétention' : template.category}
                            </span>
                          </div>
                        </div>
                        
                        <div className="mb-4">
                          <p className="font-medium text-gray-700 dark:text-gray-300 text-sm mb-2">
                            Sujet:
                          </p>
                          <p className="text-gray-600 dark:text-gray-400 text-sm">
                            {template.subject}
                          </p>
                        </div>
                        
                        <div className="mb-6">
                          <p className="font-medium text-gray-700 dark:text-gray-300 text-sm mb-2">
                            Aperçu du contenu:
                          </p>
                          <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-4">
                            {template.content.substring(0, 150)}...
                          </p>
                        </div>
                        
                        <div className="flex gap-2">
                          <motion.button
                            onClick={() => applyTemplate(template, false)}
                            className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg font-medium transition-all duration-300"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            Utiliser pour Email
                          </motion.button>
                          <motion.button
                            onClick={() => applyTemplate(template, true)}
                            className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white rounded-lg font-medium transition-all duration-300"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            Utiliser pour Newsletter
                          </motion.button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default AdminContactMessages;