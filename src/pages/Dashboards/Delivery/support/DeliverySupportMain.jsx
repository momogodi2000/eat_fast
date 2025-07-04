import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HelpCircle,
  MessageCircle,
  FileText,
  MessageSquare,
  UserCheck,
  Search,
  ChevronRight,
  Plus,
  X,
  Clock,
  CheckCircle,
  Truck,
  User,
  CreditCard,
  MapPin,
  AlertTriangle,
  Package,
  Zap
} from 'lucide-react';
import DeliverySupportDetail from './DeliverySupportDetail';

const DeliverySupportMain = () => {
  // State management
  const [activeTab, setActiveTab] = useState('tickets');
  const [tickets, setTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [showNewTicketForm, setShowNewTicketForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [agentStatus, setAgentStatus] = useState('offline');

  // Sample data initialization
  useEffect(() => {
    const sampleTickets = [
      {
        id: 'TK001',
        category: 'delivery_issue',
        priority: 'high',
        subject: 'Client introuvable - Adresse incorrecte',
        description: 'Le client a fourni une adresse incorrecte à Bonapriso. Impossible de le joindre.',
        status: 'open',
        createdAt: new Date(Date.now() - 3600000),
        orderId: 'CMD-2025-0001',
        agentId: 'AG001',
        agentName: 'Marie Talla',
        lastResponse: new Date(Date.now() - 1800000),
        messages: [
          {
            id: 1,
            sender: 'driver',
            message: 'Bonjour, je suis actuellement à Bonapriso mais impossible de trouver l\'adresse indiquée par le client.',
            timestamp: new Date(Date.now() - 3600000),
            attachments: []
          },
          {
            id: 2,
            sender: 'agent',
            message: 'Bonjour! J\'ai essayé de contacter le client. Pouvez-vous m\'envoyer votre position actuelle?',
            timestamp: new Date(Date.now() - 1800000),
            attachments: []
          }
        ]
      },
      {
        id: 'TK002',
        category: 'payment_issue',
        priority: 'medium',
        subject: 'Problème de paiement mobile money',
        description: 'Le client veut payer via MTN Mobile Money mais le système ne fonctionne pas.',
        status: 'resolved',
        createdAt: new Date(Date.now() - 86400000),
        orderId: 'CMD-2025-0002',
        agentId: 'AG002',
        agentName: 'Paul Ngono',
        resolvedAt: new Date(Date.now() - 7200000)
      }
    ];

    setTickets(sampleTickets);

    // Simulate agent status check
    const statusInterval = setInterval(() => {
      setAgentStatus(Math.random() > 0.7 ? 'online' : 'offline');
    }, 30000);

    return () => clearInterval(statusInterval);
  }, []);

  // Ticket categories
  const ticketCategories = [
    { id: 'delivery_issue', label: 'Problème de livraison', icon: Truck, color: 'text-red-500' },
    { id: 'payment_issue', label: 'Problème de paiement', icon: CreditCard, color: 'text-blue-500' },
    { id: 'navigation_issue', label: 'Problème de navigation', icon: MapPin, color: 'text-green-500' },
    { id: 'vehicle_issue', label: 'Problème de véhicule', icon: Truck, color: 'text-orange-500' },
    { id: 'customer_issue', label: 'Problème client', icon: User, color: 'text-purple-500' },
    { id: 'app_issue', label: 'Problème technique', icon: AlertTriangle, color: 'text-yellow-500' },
    { id: 'other', label: 'Autre', icon: HelpCircle, color: 'text-gray-500' }
  ];

  // Priority levels
  const priorityLevels = [
    { id: 'low', label: 'Faible', color: 'bg-green-100 text-green-800', dotColor: 'bg-green-500' },
    { id: 'medium', label: 'Moyenne', color: 'bg-yellow-100 text-yellow-800', dotColor: 'bg-yellow-500' },
    { id: 'high', label: 'Élevée', color: 'bg-red-100 text-red-800', dotColor: 'bg-red-500' },
    { id: 'urgent', label: 'Urgente', color: 'bg-purple-100 text-purple-800', dotColor: 'bg-purple-500' }
  ];

  // Status configurations
  const statusConfig = {
    open: { label: 'Ouvert', color: 'bg-blue-100 text-blue-800', icon: Clock },
    in_progress: { label: 'En cours', color: 'bg-yellow-100 text-yellow-800', icon: Clock },
    resolved: { label: 'Résolu', color: 'bg-green-100 text-green-800', icon: CheckCircle },
    closed: { label: 'Fermé', color: 'bg-gray-100 text-gray-800', icon: X }
  };

  // Filter tickets
  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = ticket.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         ticket.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || ticket.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (selectedTicket) {
    return (
      <DeliverySupportDetail 
        ticket={selectedTicket} 
        onClose={() => setSelectedTicket(null)} 
        ticketCategories={ticketCategories}
        priorityLevels={priorityLevels}
        statusConfig={statusConfig}
      />
    );
  }

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 md:mb-8"
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
              Support & Assistance
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1 md:mt-2 text-sm md:text-base">
              Besoin d'aide ? Notre équipe est là pour vous accompagner
            </p>
          </div>
          
          {/* Agent Status */}
          <motion.div 
            className="flex items-center justify-between md:justify-start space-x-3 bg-white dark:bg-gray-800 p-3 md:p-4 rounded-lg shadow-sm w-full md:w-auto"
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${agentStatus === 'online' ? 'bg-green-500' : 'bg-gray-400'}`}></div>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Agents {agentStatus === 'online' ? 'en ligne' : 'hors ligne'}
              </span>
            </div>
            <UserCheck className="w-5 h-5 text-gray-500" />
          </motion.div>
        </div>
      </motion.div>

      {/* Navigation Tabs */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex overflow-x-auto space-x-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg mb-4 md:mb-6 scrollbar-hide"
      >
        {[
          { id: 'tickets', label: 'Mes Tickets', icon: FileText },
          { id: 'chat', label: 'Chat Support', icon: MessageSquare },
          { id: 'faq', label: 'FAQ', icon: HelpCircle }
        ].map((tab) => (
          <motion.button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center space-x-2 px-3 py-2 rounded-md font-medium transition-all whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-white dark:bg-gray-700 text-orange-600 dark:text-orange-400 shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <tab.icon className="w-4 h-4" />
            <span className="text-sm md:text-base">{tab.label}</span>
          </motion.button>
        ))}
      </motion.div>

      {/* Tickets Tab */}
      {activeTab === 'tickets' && (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          className="space-y-4 md:space-y-6"
        >
          {/* Tickets Header */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4 w-full">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Rechercher un ticket..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-gray-700 dark:text-white text-sm md:text-base"
                />
              </div>

              {/* Category Filter */}
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-gray-700 dark:text-white text-sm md:text-base"
              >
                <option value="all">Toutes catégories</option>
                {ticketCategories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>

            {/* New Ticket Button */}
            <motion.button
              onClick={() => setShowNewTicketForm(true)}
              className="flex items-center justify-center space-x-2 bg-orange-600 hover:bg-orange-700 text-white px-3 py-2 rounded-lg font-medium transition-colors text-sm md:text-base w-full sm:w-auto"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Plus className="w-4 h-4" />
              <span>Nouveau Ticket</span>
            </motion.button>
          </div>

          {/* Tickets List */}
          <div className="grid gap-3 md:gap-4">
            <AnimatePresence>
              {filteredTickets.map((ticket) => {
                const category = ticketCategories.find(cat => cat.id === ticket.category);
                const priority = priorityLevels.find(p => p.id === ticket.priority);
                const status = statusConfig[ticket.status];
                const StatusIcon = status.icon;

                return (
                  <motion.div
                    key={ticket.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 md:p-6 hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => setSelectedTicket(ticket)}
                    whileHover={{ scale: 1.005 }}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <span className="text-xs md:text-sm font-mono text-gray-500 dark:text-gray-400">
                            #{ticket.id}
                          </span>
                          {category && (
                            <div className="flex items-center space-x-1">
                              <category.icon className={`w-3 h-3 md:w-4 md:h-4 ${category.color}`} />
                              <span className="text-xs md:text-sm text-gray-600 dark:text-gray-400">
                                {category.label}
                              </span>
                            </div>
                          )}
                          <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs ${priority.color}`}>
                            <div className={`w-2 h-2 rounded-full ${priority.dotColor}`}></div>
                            <span>{priority.label}</span>
                          </div>
                        </div>
                        
                        <h3 className="text-base md:text-lg font-semibold text-gray-900 dark:text-white mb-1 md:mb-2 truncate">
                          {ticket.subject}
                        </h3>
                        
                        <p className="text-gray-600 dark:text-gray-400 mb-2 md:mb-3 line-clamp-2 text-sm">
                          {ticket.description}
                        </p>
                        
                        <div className="flex flex-wrap items-center gap-2 md:gap-4 text-xs md:text-sm text-gray-500 dark:text-gray-400">
                          <span>Créé il y a {Math.floor((Date.now() - ticket.createdAt) / 60000)} min</span>
                          {ticket.orderId && (
                            <span className="flex items-center space-x-1">
                              <Package className="w-3 h-3" />
                              <span>{ticket.orderId}</span>
                            </span>
                          )}
                          {ticket.agentName && (
                            <span className="flex items-center space-x-1">
                              <UserCheck className="w-3 h-3" />
                              <span>{ticket.agentName}</span>
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex flex-col items-end space-y-2">
                        <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs ${status.color}`}>
                          <StatusIcon className="w-3 h-3" />
                          <span>{status.label}</span>
                        </div>
                        <ChevronRight className="w-4 h-4 text-gray-400" />
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          {filteredTickets.length === 0 && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-8 md:py-12"
            >
              <FileText className="w-10 h-10 md:w-12 md:h-12 text-gray-400 mx-auto mb-3 md:mb-4" />
              <h3 className="text-base md:text-lg font-medium text-gray-900 dark:text-white mb-1 md:mb-2">
                Aucun ticket trouvé
              </h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm md:text-base">
                {searchQuery || selectedCategory !== 'all' 
                  ? 'Essayez de modifier vos critères de recherche'
                  : 'Vous n\'avez pas encore créé de ticket de support'
                }
              </p>
            </motion.div>
          )}
        </motion.div>
      )}

      {/* New Ticket Modal */}
      <AnimatePresence>
        {showNewTicketForm && (
          <NewTicketForm 
            onClose={() => setShowNewTicketForm(false)} 
            ticketCategories={ticketCategories} 
            priorityLevels={priorityLevels}
            onCreateTicket={(newTicket) => {
              setTickets([newTicket, ...tickets]);
              setShowNewTicketForm(false);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

const NewTicketForm = ({ onClose, ticketCategories, priorityLevels, onCreateTicket }) => {
  const [newTicketData, setNewTicketData] = useState({
    category: '',
    priority: 'medium',
    subject: '',
    description: '',
    orderId: '',
    attachments: []
  });

  const fileInputRef = useRef(null);

  const handleCreateTicket = async (e) => {
    e.preventDefault();
    
    const newTicket = {
      id: `TK${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`,
      ...newTicketData,
      status: 'open',
      createdAt: new Date(),
      messages: [
        {
          id: 1,
          sender: 'driver',
          message: newTicketData.description,
          timestamp: new Date(),
          attachments: newTicketData.attachments
        }
      ]
    };

    onCreateTicket(newTicket);
    
    // Reset form
    setNewTicketData({
      category: '',
      priority: 'medium',
      subject: '',
      description: '',
      orderId: '',
      attachments: []
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
    >
      <motion.div
        initial={{ scale: 0.9, y: 50 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 50 }}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="p-4 md:p-6">
          <div className="flex items-center justify-between mb-4 md:mb-6">
            <h2 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white">
              Créer un nouveau ticket
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
            >
              <X className="w-5 h-5 md:w-6 md:h-6" />
            </button>
          </div>

          <form onSubmit={handleCreateTicket}>
            <div className="space-y-4 md:space-y-6">
              {/* Ticket Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Catégorie
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 md:gap-3">
                  {ticketCategories.map((category) => (
                    <motion.button
                      key={category.id}
                      type="button"
                      onClick={() => setNewTicketData({ ...newTicketData, category: category.id })}
                      className={`flex items-center space-x-2 p-2 md:p-3 border rounded-lg transition-all ${
                        newTicketData.category === category.id
                          ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20'
                          : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <category.icon className={`w-4 h-4 md:w-5 md:h-5 ${category.color}`} />
                      <span className="text-xs md:text-sm font-medium text-gray-700 dark:text-gray-300">
                        {category.label}
                      </span>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Priority */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Priorité
                </label>
                <div className="flex flex-wrap gap-2">
                  {priorityLevels.map((priority) => (
                    <motion.button
                      key={priority.id}
                      type="button"
                      onClick={() => setNewTicketData({ ...newTicketData, priority: priority.id })}
                      className={`flex items-center space-x-2 px-2 py-1 md:px-3 md:py-2 rounded-full text-xs md:text-sm font-medium transition-colors ${
                        newTicketData.priority === priority.id
                          ? priority.color
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <div className={`w-2 h-2 rounded-full ${priority.dotColor}`}></div>
                      <span>{priority.label}</span>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Subject */}
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Sujet
                </label>
                <input
                  type="text"
                  id="subject"
                  value={newTicketData.subject}
                  onChange={(e) => setNewTicketData({ ...newTicketData, subject: e.target.value })}
                  className="w-full px-3 py-2 md:px-4 md:py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-gray-700 dark:text-white text-sm md:text-base"
                  placeholder="Décrivez brièvement votre problème"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Description détaillée
                </label>
                <textarea
                  id="description"
                  value={newTicketData.description}
                  onChange={(e) => setNewTicketData({ ...newTicketData, description: e.target.value })}
                  rows={4}
                  className="w-full px-3 py-2 md:px-4 md:py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-gray-700 dark:text-white text-sm md:text-base"
                  placeholder="Décrivez votre problème en détail..."
                  required
                />
              </div>

              {/* Order ID */}
              <div>
                <label htmlFor="orderId" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Numéro de commande (optionnel)
                </label>
                <input
                  type="text"
                  id="orderId"
                  value={newTicketData.orderId}
                  onChange={(e) => setNewTicketData({ ...newTicketData, orderId: e.target.value })}
                  className="w-full px-3 py-2 md:px-4 md:py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-gray-700 dark:text-white text-sm md:text-base"
                  placeholder="CMD-2025-XXXX"
                />
              </div>

              {/* Attachments */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Pièces jointes
                </label>
                <div className="flex items-center space-x-3 md:space-x-4">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center space-x-2 px-3 py-2 md:px-4 md:py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm md:text-base"
                  >
                    <Paperclip className="w-3 h-3 md:w-4 md:h-4" />
                    <span>Ajouter des fichiers</span>
                  </button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    multiple
                    onChange={(e) => {
                      const files = Array.from(e.target.files);
                      setNewTicketData({
                        ...newTicketData,
                        attachments: [...newTicketData.attachments, ...files]
                      });
                    }}
                    accept="image/*,.pdf,.doc,.docx"
                  />
                  {newTicketData.attachments.length > 0 && (
                    <span className="text-xs md:text-sm text-gray-500 dark:text-gray-400">
                      {newTicketData.attachments.length} fichier(s) sélectionné(s)
                    </span>
                  )}
                </div>
                {newTicketData.attachments.length > 0 && (
                  <div className="mt-2 space-y-2">
                    {newTicketData.attachments.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded text-sm">
                        <div className="flex items-center space-x-2">
                          <FileText className="w-3 h-3 md:w-4 md:h-4 text-gray-500" />
                          <span className="text-gray-700 dark:text-gray-300 truncate max-w-[180px] md:max-w-xs">
                            {file.name}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            const newAttachments = [...newTicketData.attachments];
                            newAttachments.splice(index, 1);
                            setNewTicketData({
                              ...newTicketData,
                              attachments: newAttachments
                            });
                          }}
                          className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                        >
                          <X className="w-3 h-3 md:w-4 md:h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="mt-6 md:mt-8 flex justify-end space-x-2 md:space-x-3">
              <motion.button
                type="button"
                onClick={onClose}
                className="px-3 py-2 md:px-4 md:py-2 border border-gray-300 dark:border-gray-600 rounded-lg font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm md:text-base"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Annuler
              </motion.button>
              <motion.button
                type="submit"
                disabled={!newTicketData.category || !newTicketData.subject || !newTicketData.description}
                className="px-3 py-2 md:px-4 md:py-2 bg-orange-600 hover:bg-orange-700 disabled:bg-gray-400 text-white rounded-lg font-medium transition-colors text-sm md:text-base"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Envoyer le ticket
              </motion.button>
            </div>
          </form>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default DeliverySupportMain;