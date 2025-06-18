import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HelpCircle,
  MessageCircle,
  Phone,
  Mail,
  AlertTriangle,
  CheckCircle,
  Clock,
  Send,
  Paperclip,
  Search,
  ChevronDown,
  ChevronRight,
  MapPin,
  Package,
  User,
  CreditCard,
  Truck,
  Star,
  Filter,
  X,
  Plus,
  FileText,
  MessageSquare,
  UserCheck,
  Zap
} from 'lucide-react';
import DeliveryLayout from '../../../../layouts/delivery_layout';
import { Link, useNavigate } from 'react-router-dom';

/**
 * DeliverySupport Component
 * Comprehensive support page for delivery drivers with ticketing, chat, and FAQ
 */
const DeliverySupport = () => {
  // State management
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('tickets');

  const [tickets, setTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [showNewTicketForm, setShowNewTicketForm] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [agentStatus, setAgentStatus] = useState('offline');
  const [expandedFAQ, setExpandedFAQ] = useState(null);
  const [newTicketData, setNewTicketData] = useState({
    category: '',
    priority: 'medium',
    subject: '',
    description: '',
    orderId: '',
    attachments: []
  });

  const chatEndRef = useRef(null);
  const fileInputRef = useRef(null);

  // Sample data initialization
  useEffect(() => {
    initializeSampleData();
    // Simulate agent status check
    const statusInterval = setInterval(() => {
      setAgentStatus(Math.random() > 0.7 ? 'online' : 'offline');
    }, 30000);

    return () => clearInterval(statusInterval);
  }, []);

  const initializeSampleData = () => {
    // Initialize sample tickets
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

    // Initialize sample chat messages
    const sampleMessages = [
      {
        id: 1,
        sender: 'agent',
        message: 'Bonjour ! Je suis Marie, votre agent de support. Comment puis-je vous aider aujourd\'hui ?',
        timestamp: new Date(Date.now() - 300000),
        agentName: 'Marie Talla'
      },
      {
        id: 2,
        sender: 'driver',
        message: 'Salut Marie ! J\'ai un souci avec ma dernière livraison. Le client n\'était pas à l\'adresse indiquée.',
        timestamp: new Date(Date.now() - 240000)
      },
      {
        id: 3,
        sender: 'agent',
        message: 'Je comprends votre situation. Pouvez-vous me donner le numéro de commande ? Je vais contacter le client immédiatement.',
        timestamp: new Date(Date.now() - 180000),
        agentName: 'Marie Talla'
      }
    ];

    setTickets(sampleTickets);
    setChatMessages(sampleMessages);
  };

  // FAQ data
  const faqData = [
    {
      id: 1,
      category: 'delivery',
      question: 'Que faire si le client n\'est pas disponible ?',
      answer: 'Appelez d\'abord le client, puis contactez notre support. Attendez maximum 10 minutes sur place avant de signaler le problème.'
    },
    {
      id: 2,
      category: 'payment',
      question: 'Comment gérer un problème de paiement mobile money ?',
      answer: 'Vérifiez d\'abord la connexion réseau. Si le problème persiste, proposez un paiement en espèces et contactez le support pour signaler l\'incident.'
    },
    {
      id: 3,
      category: 'navigation',
      question: 'Que faire si l\'adresse de livraison est incorrecte ?',
      answer: 'Contactez immédiatement le client pour clarifier l\'adresse. Si pas de réponse, contactez le support avec votre position actuelle.'
    },
    {
      id: 4,
      category: 'vehicle',
      question: 'Ma moto est tombée en panne, que faire ?',
      answer: 'Contactez immédiatement le support d\'urgence. Nous organiserons une livraison de secours et vous assisterons pour la réparation.'
    },
    {
      id: 5,
      category: 'safety',
      question: 'Comment signaler un incident de sécurité ?',
      answer: 'Utilisez le bouton d\'urgence dans l\'app ou appelez directement le 17. Votre sécurité est notre priorité absolue.'
    }
  ];

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

  // Handle new ticket creation
  const handleCreateTicket = async (e) => {
    e.preventDefault();
    
    const newTicket = {
      id: `TK${String(tickets.length + 1).padStart(3, '0')}`,
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

    setTickets([newTicket, ...tickets]);
    setShowNewTicketForm(false);
    setNewTicketData({
      category: '',
      priority: 'medium',
      subject: '',
      description: '',
      orderId: '',
      attachments: []
    });
    
    // Auto-assign agent (simulation)
    setTimeout(() => {
      const agentResponse = {
        id: newTicket.messages.length + 1,
        sender: 'agent',
        message: 'Bonjour ! J\'ai bien reçu votre demande. Je m\'en occupe immédiatement.',
        timestamp: new Date(),
        agentName: 'Marie Talla'
      };
      
      setTickets(prev => prev.map(ticket => 
        ticket.id === newTicket.id 
          ? { ...ticket, messages: [...ticket.messages, agentResponse], agentId: 'AG001', agentName: 'Marie Talla' }
          : ticket
      ));
    }, 2000);
  };

  // Handle chat message send
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const message = {
      id: chatMessages.length + 1,
      sender: 'driver',
      message: newMessage,
      timestamp: new Date()
    };

    setChatMessages([...chatMessages, message]);
    setNewMessage('');

    // Simulate agent response
    setTimeout(() => {
      const agentResponse = {
        id: chatMessages.length + 2,
        sender: 'agent',
        message: 'Merci pour votre message. Je traite votre demande et vous réponds dans quelques instants.',
        timestamp: new Date(),
        agentName: 'Marie Talla'
      };
      setChatMessages(prev => [...prev, agentResponse]);
    }, 1500);
  };

  // Scroll to bottom of chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  // Filter tickets
  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = ticket.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         ticket.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || ticket.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Filter FAQ
  const filteredFAQ = faqData.filter(faq => 
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    // <DeliveryLayout>
    <>
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

        {/* Chat Tab */}
        {activeTab === 'chat' && (
        //   <motion.div
        //     initial={{ opacity: 0, x: -20 }}
        //     animate={{ opacity: 1, x: 0 }}
        //     exit={{ opacity: 0, x: 20 }}
        //     className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 h-[calc(100vh-220px)] md:h-[600px] flex flex-col"
        //   >
        //     {/* Chat Header */}
        //     <div className="p-3 md:p-4 border-b border-gray-200 dark:border-gray-700">
        //       <div className="flex items-center space-x-3">
        //         <div className="w-8 h-8 md:w-10 md:h-10 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center">
        //           <MessageCircle className="w-4 h-4 md:w-5 md:h-5 text-orange-600 dark:text-orange-400" />
        //         </div>
        //         <div>
        //           <h3 className="font-medium md:font-semibold text-gray-900 dark:text-white text-sm md:text-base">
        //             Support en Direct
        //           </h3>
        //           <div className="flex items-center space-x-2">
        //             <div className={`w-2 h-2 rounded-full ${agentStatus === 'online' ? 'bg-green-500' : 'bg-gray-400'}`}></div>
        //             <span className="text-xs md:text-sm text-gray-500 dark:text-gray-400">
        //               {agentStatus === 'online' ? 'Agent disponible' : 'Agent hors ligne'}
        //             </span>
        //           </div>
        //         </div>
        //       </div>
        //     </div>

        //     {/* Chat Messages */}
        //     <div className="flex-1 overflow-y-auto p-3 md:p-4 space-y-3 md:space-y-4">
        //       <AnimatePresence>
        //         {chatMessages.map((message) => (
        //           <motion.div
        //             key={message.id}
        //             initial={{ opacity: 0, y: 20 }}
        //             animate={{ opacity: 1, y: 0 }}
        //             className={`flex ${message.sender === 'driver' ? 'justify-end' : 'justify-start'}`}
        //           >
        //             <div className={`max-w-[80%] md:max-w-xs lg:max-w-md px-3 py-2 rounded-lg text-sm ${
        //               message.sender === 'driver'
        //                 ? 'bg-orange-600 text-white'
        //                 : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
        //             }`}>
        //               {message.sender === 'agent' && message.agentName && (
        //                 <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
        //                   {message.agentName}
        //                 </p>
        //               )}
        //               <p>{message.message}</p>
        //               <p className={`text-xs mt-1 ${
        //                 message.sender === 'driver' 
        //                   ? 'text-orange-200' 
        //                   : 'text-gray-500 dark:text-gray-400'
        //               }`}>
        //                 {message.timestamp.toLocaleTimeString('fr-FR', { 
        //                   hour: '2-digit', 
        //                   minute: '2-digit' 
        //                 })}
        //               </p>
        //             </div>
        //           </motion.div>
        //         ))}
        //       </AnimatePresence>
        //       <div ref={chatEndRef} />
        //     </div>

        //     {/* Chat Input */}
        //     <form onSubmit={handleSendMessage} className="p-3 md:p-4 border-t border-gray-200 dark:border-gray-700">
        //       <div className="flex items-center space-x-2">
        //         <button
        //           type="button"
        //           onClick={() => fileInputRef.current?.click()}
        //           className="p-1 md:p-2 text-gray-400 hover:text-gray-600 transition-colors"
        //         >
        //           <Paperclip className="w-4 h-4 md:w-5 md:h-5" />
        //         </button>
        //         <input
        //           type="file"
        //           ref={fileInputRef}
        //           className="hidden"
        //           multiple
        //           accept="image/*,.pdf,.doc,.docx"
        //         />
        //         <input
        //           type="text"
        //           value={newMessage}
        //           onChange={(e) => setNewMessage(e.target.value)}
        //           placeholder="Tapez votre message..."
        //           className="flex-1 px-3 py-2 md:px-4 md:py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-gray-700 dark:text-white text-sm md:text-base"
        //           disabled={agentStatus === 'offline'}
        //         />
        //         <motion.button
        //           type="submit"
        //           disabled={!newMessage.trim() || agentStatus === 'offline'}
        //           className="p-1 md:p-2 bg-orange-600 hover:bg-orange-700 disabled:bg-gray-400 text-white rounded-lg transition-colors"
        //           whileHover={{ scale: 1.05 }}
        //           whileTap={{ scale: 0.95 }}
        //         >
        //           <Send className="w-4 h-4 md:w-5 md:h-5" />
        //         </motion.button>
        //       </div>
        //     </form>
        //   </motion.div>
        // )} 

         navigate("/delivery/support/chat")

      )}

        {/* FAQ Tab */}
        {activeTab === 'faq' && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="space-y-4 md:space-y-6"
          >
            {/* FAQ Search */}
            <div className="relative max-w-full md:max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Rechercher dans la FAQ..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-gray-700 dark:text-white text-sm md:text-base"
              />
            </div>

            {/* FAQ Categories */}
            <div className="flex flex-wrap gap-2">
              {['all', 'delivery', 'payment', 'navigation', 'vehicle', 'safety'].map((category) => (
                <motion.button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-2 py-1 md:px-3 md:py-1 rounded-full text-xs md:text-sm font-medium transition-colors ${
                    selectedCategory === category
                      ? 'bg-orange-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {category === 'all' ? 'Tout' : 
                   category === 'delivery' ? 'Livraison' :
                   category === 'payment' ? 'Paiement' :
                   category === 'navigation' ? 'Navigation' :
                   category === 'vehicle' ? 'Véhicule' :
                   'Sécurité'}
                </motion.button>
              ))}
            </div>

            {/* FAQ Items */}
            <div className="space-y-2 md:space-y-3">
              <AnimatePresence>
                {filteredFAQ
                  .filter(faq => selectedCategory === 'all' || faq.category === selectedCategory)
                  .map((faq) => (
                    <motion.div
                      key={faq.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden"
                    >
                      <button
                        onClick={() => setExpandedFAQ(expandedFAQ === faq.id ? null : faq.id)}
                        className="w-full flex items-center justify-between p-3 md:p-4 text-left focus:outline-none"
                      >
                        <h3 className="font-medium text-gray-900 dark:text-white text-sm md:text-base">
                          {faq.question}
                        </h3>
                        <motion.div
                          animate={{ rotate: expandedFAQ === faq.id ? 180 : 0 }}
                        >
                          <ChevronDown className="w-4 h-4 md:w-5 md:h-5 text-gray-500" />
                        </motion.div>
                      </button>

                      <AnimatePresence>
                        {expandedFAQ === faq.id && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.2 }}
                            className="px-3 pb-3 md:px-4 md:pb-4 text-gray-600 dark:text-gray-400 text-sm md:text-base"
                          >
                            <p>{faq.answer}</p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  ))}
              </AnimatePresence>

              {filteredFAQ.length === 0 && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-8 md:py-12"
                >
                  <HelpCircle className="w-10 h-10 md:w-12 md:h-12 text-gray-400 mx-auto mb-3 md:mb-4" />
                  <h3 className="text-base md:text-lg font-medium text-gray-900 dark:text-white mb-1 md:mb-2">
                    Aucune question trouvée
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 text-sm md:text-base">
                    Essayez de modifier vos critères de recherche
                  </p>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}

        {/* New Ticket Modal */}
        <AnimatePresence>
          {showNewTicketForm && (
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
                      onClick={() => setShowNewTicketForm(false)}
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
                        onClick={() => setShowNewTicketForm(false)}
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
          )}
        </AnimatePresence>

        {/* Ticket Detail Modal */}
        <AnimatePresence>
          {selectedTicket && (
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
                className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              >
                <div className="p-4 md:p-6">
                  <div className="flex items-center justify-between mb-4 md:mb-6">
                    <h2 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white">
                      Ticket #{selectedTicket.id}
                    </h2>
                    <button
                      onClick={() => setSelectedTicket(null)}
                      className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                    >
                      <X className="w-5 h-5 md:w-6 md:h-6" />
                    </button>
                  </div>

                  <div className="space-y-4 md:space-y-6">
                    {/* Ticket Header */}
                    <div className="bg-gray-50 dark:bg-gray-700 p-3 md:p-4 rounded-lg">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 md:gap-4">
                        <div>
                          <h3 className="text-base md:text-lg font-semibold text-gray-900 dark:text-white">
                            {selectedTicket.subject}
                          </h3>
                          <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base">
                            {selectedTicket.description}
                          </p>
                        </div>
                        <div className="flex flex-col items-end space-y-1">
                          <div className="flex items-center space-x-2">
                            <span className="text-xs md:text-sm text-gray-500 dark:text-gray-400">
                              Statut:
                            </span>
                            <span className={`px-2 py-1 rounded-full text-xs ${statusConfig[selectedTicket.status].color}`}>
                              {statusConfig[selectedTicket.status].label}
                            </span>
                          </div>
                          <div className="text-xs md:text-sm text-gray-500 dark:text-gray-400">
                            Créé le {selectedTicket.createdAt.toLocaleDateString('fr-FR')}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Ticket Meta */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
                      <div className="bg-gray-50 dark:bg-gray-700 p-3 md:p-4 rounded-lg">
                        <h4 className="text-xs md:text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                          Détails du ticket
                        </h4>
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <Package className="w-3 h-3 md:w-4 md:h-4 text-gray-400" />
                            <span className="text-xs md:text-sm text-gray-700 dark:text-gray-300">
                              {selectedTicket.orderId || 'Non spécifié'}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Truck className="w-3 h-3 md:w-4 md:h-4 text-gray-400" />
                            <span className="text-xs md:text-sm text-gray-700 dark:text-gray-300">
                              {ticketCategories.find(c => c.id === selectedTicket.category)?.label || 'Autre'}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Zap className="w-3 h-3 md:w-4 md:h-4 text-gray-400" />
                            <span className="text-xs md:text-sm text-gray-700 dark:text-gray-300">
                              {priorityLevels.find(p => p.id === selectedTicket.priority)?.label || 'Moyenne'}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-gray-50 dark:bg-gray-700 p-3 md:p-4 rounded-lg">
                        <h4 className="text-xs md:text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                          Assigné à
                        </h4>
                        {selectedTicket.agentId ? (
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 md:w-10 md:h-10 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center">
                              <User className="w-4 h-4 md:w-5 md:h-5 text-orange-600 dark:text-orange-400" />
                            </div>
                            <div>
                              <p className="font-medium text-gray-900 dark:text-white text-sm md:text-base">
                                {selectedTicket.agentName}
                              </p>
                              <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400">
                                Agent de support
                              </p>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center space-x-2 text-gray-500 dark:text-gray-400">
                            <User className="w-3 h-3 md:w-4 md:h-4" />
                            <span className="text-xs md:text-sm">Non assigné</span>
                          </div>
                        )}
                      </div>

                      <div className="bg-gray-50 dark:bg-gray-700 p-3 md:p-4 rounded-lg">
                        <h4 className="text-xs md:text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                          Dernière mise à jour
                        </h4>
                        <div className="flex items-center space-x-2">
                          <Clock className="w-3 h-3 md:w-4 md:h-4 text-gray-400" />
                          <span className="text-xs md:text-sm text-gray-700 dark:text-gray-300">
                            {selectedTicket.lastResponse
                              ? `Il y a ${Math.floor((Date.now() - selectedTicket.lastResponse) / 60000)} min`
                              : 'Pas de réponse'}
                          </span>
                        </div>
                        {selectedTicket.resolvedAt && (
                          <div className="flex items-center space-x-2 mt-2">
                            <CheckCircle className="w-3 h-3 md:w-4 md:h-4 text-green-500" />
                            <span className="text-xs md:text-sm text-gray-700 dark:text-gray-300">
                              Résolu le {selectedTicket.resolvedAt.toLocaleDateString('fr-FR')}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Ticket Conversation */}
                    <div>
                      <h4 className="text-xs md:text-sm font-medium text-gray-500 dark:text-gray-400 mb-3 md:mb-4">
                        Conversation
                      </h4>
                      <div className="space-y-3 md:space-y-4">
                        {selectedTicket.messages?.map((message) => (
                          <div
                            key={message.id}
                            className={`flex ${message.sender === 'driver' ? 'justify-end' : 'justify-start'}`}
                          >
                            <div className={`max-w-[80%] md:max-w-xs lg:max-w-md px-3 py-2 rounded-lg text-sm ${
                              message.sender === 'driver'
                                ? 'bg-orange-600 text-white'
                                : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                            }`}>
                              {message.sender === 'agent' && (
                                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                                  {selectedTicket.agentName}
                                </p>
                              )}
                              <p>{message.message}</p>
                              <p className={`text-xs mt-1 ${
                                message.sender === 'driver' 
                                  ? 'text-orange-200' 
                                  : 'text-gray-500 dark:text-gray-400'
                              }`}>
                                {message.timestamp.toLocaleTimeString('fr-FR', { 
                                  hour: '2-digit', 
                                  minute: '2-digit' 
                                })}
                              </p>
                              {message.attachments?.length > 0 && (
                                <div className="mt-2 space-y-2">
                                  {message.attachments.map((attachment, index) => (
                                    <div
                                      key={index}
                                      className="flex items-center space-x-2 p-2 bg-white/20 dark:bg-black/20 rounded text-xs"
                                    >
                                      <FileText className="w-3 h-3 md:w-4 md:h-4" />
                                      <span className="truncate max-w-[120px] md:max-w-xs">
                                        {attachment.name}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Reply Form */}
                    <div className="border-t border-gray-200 dark:border-gray-700 pt-3 md:pt-4">
                      <form onSubmit={(e) => {
                        e.preventDefault();
                        const newMessage = {
                          id: selectedTicket.messages.length + 1,
                          sender: 'driver',
                          message: newMessage,
                          timestamp: new Date()
                        };
                        
                        setTickets(prev => prev.map(ticket => 
                          ticket.id === selectedTicket.id
                            ? { 
                                ...ticket, 
                                messages: [...ticket.messages, newMessage],
                                lastResponse: new Date()
                              }
                            : ticket
                        ));
                        
                        setNewMessage('');
                        
                        // Simulate agent response
                        setTimeout(() => {
                          const agentResponse = {
                            id: selectedTicket.messages.length + 2,
                            sender: 'agent',
                            message: 'Merci pour votre message. Nous traitons votre demande et vous répondrons sous peu.',
                            timestamp: new Date(),
                            agentName: selectedTicket.agentName || 'Support Agent'
                          };
                          
                          setTickets(prev => prev.map(ticket => 
                            ticket.id === selectedTicket.id
                              ? { 
                                  ...ticket, 
                                  messages: [...ticket.messages, agentResponse],
                                  lastResponse: new Date()
                                }
                              : ticket
                          ));
                        }, 2000);
                      }}>
                        <textarea
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          rows={3}
                          className="w-full px-3 py-2 md:px-4 md:py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-gray-700 dark:text-white text-sm md:text-base"
                          placeholder="Répondre au ticket..."
                        />
                        <div className="flex justify-between items-center mt-2">
                          <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="p-1 md:p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                          >
                            <Paperclip className="w-4 h-4 md:w-5 md:h-5" />
                          </button>
                          <input
                            type="file"
                            ref={fileInputRef}
                            className="hidden"
                            multiple
                            accept="image/*,.pdf,.doc,.docx"
                          />
                          <motion.button
                            type="submit"
                            disabled={!newMessage.trim()}
                            className="px-3 py-2 md:px-4 md:py-2 bg-orange-600 hover:bg-orange-700 disabled:bg-gray-400 text-white rounded-lg font-medium transition-colors text-sm md:text-base"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            Envoyer
                          </motion.button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    {/* // </DeliveryLayout> */}
    </>
  );
};

export default DeliverySupport;