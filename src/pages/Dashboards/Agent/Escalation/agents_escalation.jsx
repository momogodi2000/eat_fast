import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  AlertTriangle, 
  ArrowUp, 
  Clock, 
  User, 
  CheckCircle, 
  XCircle,
  ArrowRight,
  Zap,
  Target,
  Filter,
  Search,
  MoreHorizontal,
  Phone,
  MessageCircle,
  Mail,
  Briefcase,
  Star,
  TrendingUp,
  AlertCircle,
  Users,
  Activity
} from 'lucide-react';
import SupportAgentLayout from '@/layouts/agent_support_layout.jsx';

const SupportEscalation = () => {
  const [tickets, setTickets] = useState([]);
  const [filteredTickets, setFilteredTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('tous');
  const [filterPriority, setFilterPriority] = useState('tous');
  const [showEscalationModal, setShowEscalationModal] = useState(false);
  const [loading, setLoading] = useState(false);

  // Données simulées pour les tickets
  useEffect(() => {
    const mockTickets = [
      {
        id: 'ESC-001',
        title: 'Problème de livraison critique - Commande #12345',
        description: 'Client attend depuis plus de 2h, livreur introuvable',
        priority: 'critique',
        status: 'en_attente',
        customer: 'Marie Ngomo',
        customerPhone: '+237 691 234 567',
        assignedAgent: 'Jean Baptiste',
        restaurant: 'Mama Africa',
        orderValue: 15000,
        escalationTime: new Date(Date.now() - 45 * 60000),
        category: 'livraison',
        attempts: 3,
        lastContact: new Date(Date.now() - 15 * 60000)
      },
      {
        id: 'ESC-002',
        title: 'Problème de paiement récurrent',
        description: 'Échec des transactions Mobile Money répétés',
        priority: 'haute',
        status: 'en_cours',
        customer: 'Paul Biya Jr',
        customerPhone: '+237 677 890 123',
        assignedAgent: 'Christine Mballa',
        restaurant: 'Chez Tantine',
        orderValue: 8500,
        escalationTime: new Date(Date.now() - 120 * 60000),
        category: 'paiement',
        attempts: 2,
        lastContact: new Date(Date.now() - 30 * 60000)
      },
      {
        id: 'ESC-003',
        title: 'Réclamation qualité - Commande incorrecte',
        description: 'Plat livré différent de la commande, client mécontent',
        priority: 'moyenne',
        status: 'resolu',
        customer: 'Fatima Hassan',
        customerPhone: '+237 655 432 109',
        assignedAgent: 'Eric Manga',
        restaurant: 'Saveurs du Nord',
        orderValue: 12000,
        escalationTime: new Date(Date.now() - 180 * 60000),
        category: 'qualite',
        attempts: 1,
        lastContact: new Date(Date.now() - 60 * 60000)
      }
    ];
    
    setTickets(mockTickets);
    setFilteredTickets(mockTickets);
  }, []);

  // Filtrage intelligent des tickets
  useEffect(() => {
    let filtered = tickets.filter(ticket => {
      const matchesSearch = ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           ticket.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           ticket.id.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = filterStatus === 'tous' || ticket.status === filterStatus;
      const matchesPriority = filterPriority === 'tous' || ticket.priority === filterPriority;
      
      return matchesSearch && matchesStatus && matchesPriority;
    });

    // Tri intelligent par priorité et temps
    filtered.sort((a, b) => {
      const priorityOrder = { 'critique': 3, 'haute': 2, 'moyenne': 1 };
      if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      }
      return new Date(a.escalationTime) - new Date(b.escalationTime);
    });

    setFilteredTickets(filtered);
  }, [tickets, searchTerm, filterStatus, filterPriority]);

  // Algorithme de routage intelligent
  const intelligentRouting = (ticket) => {
    const routingRules = {
      'livraison': {
        team: 'Équipe Logistique',
        agents: ['Sophie Ndong', 'Michel Ateba', 'Grace Fouda'],
        escalationLevel: ticket.priority === 'critique' ? 'Superviseur' : 'Agent Senior'
      },
      'paiement': {
        team: 'Équipe Financière',
        agents: ['Roger Bile', 'Sandrine Momo', 'David Nyong'],
        escalationLevel: 'Spécialiste Paiements'
      },
      'qualite': {
        team: 'Équipe Qualité',
        agents: ['Annie Bessala', 'Frank Mbida', 'Nadine Kana'],
        escalationLevel: 'Responsable Qualité'
      }
    };

    return routingRules[ticket.category] || routingRules['livraison'];
  };

  const handleEscalation = async (ticketId, escalationType) => {
    setLoading(true);
    
    // Simulation d'escalade
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setTickets(prev => prev.map(ticket => 
      ticket.id === ticketId 
        ? { ...ticket, status: 'escale', escalationType }
        : ticket
    ));
    
    setLoading(false);
    setShowEscalationModal(false);
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'critique': return 'bg-red-500';
      case 'haute': return 'bg-orange-500';
      case 'moyenne': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'en_attente': return 'text-red-600 bg-red-100';
      case 'en_cours': return 'text-orange-600 bg-orange-100';
      case 'escale': return 'text-purple-600 bg-purple-100';
      case 'resolu': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const formatTime = (date) => {
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    
    if (hours > 0) return `il y a ${hours}h ${minutes % 60}min`;
    return `il y a ${minutes}min`;
  };

  return (
    <SupportAgentLayout>
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-red-50 to-yellow-50 p-6">
        {/* En-tête avec statistiques */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <motion.div
                className="p-3 bg-gradient-to-r from-green-500 to-red-500 rounded-xl shadow-lg"
                whileHover={{ scale: 1.05, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
              >
                <AlertTriangle className="w-8 h-8 text-white" />
              </motion.div>
              <div>
                <h1 className="text-3xl font-bold text-gray-800">Escalade & Routage</h1>
                <p className="text-gray-600">Gestion intelligente des tickets critiques</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 bg-gradient-to-r from-green-600 to-red-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-shadow"
              >
                <TrendingUp className="w-5 h-5 inline mr-2" />
                Rapport d'Escalade
              </motion.button>
            </div>
          </div>

          {/* Statistiques rapides */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {[
              { title: 'Tickets Critiques', value: '3', icon: AlertCircle, color: 'red' },
              { title: 'En Escalade', value: '7', icon: ArrowUp, color: 'orange' },
              { title: 'Résolus Aujourd\'hui', value: '24', icon: CheckCircle, color: 'green' },
              { title: 'Temps Moyen', value: '15min', icon: Clock, color: 'blue' }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
                whileHover={{ scale: 1.02, boxShadow: "0 10px 30px rgba(0,0,0,0.1)" }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                  </div>
                  <motion.div
                    className={`p-3 bg-${stat.color}-100 rounded-xl`}
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.5 }}
                  >
                    <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Filtres et recherche */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl p-6 shadow-lg mb-8 border border-gray-100"
        >
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Rechercher par ID, client, ou description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            
            <div className="flex gap-4">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="tous">Tous les statuts</option>
                <option value="en_attente">En attente</option>
                <option value="en_cours">En cours</option>
                <option value="escale">Escalé</option>
                <option value="resolu">Résolu</option>
              </select>
              
              <select
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
                className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="tous">Toutes priorités</option>
                <option value="critique">Critique</option>
                <option value="haute">Haute</option>
                <option value="moyenne">Moyenne</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Liste des tickets */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {/* Colonne principale - Liste des tickets */}
          <div className="space-y-6">
            <AnimatePresence>
              {filteredTickets.map((ticket, index) => (
                <motion.div
                  key={ticket.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow cursor-pointer"
                  onClick={() => setSelectedTicket(ticket)}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start space-x-4">
                      <motion.div
                        className={`w-4 h-4 rounded-full ${getPriorityColor(ticket.priority)} shadow-lg`}
                        animate={{ 
                          boxShadow: ticket.priority === 'critique' 
                            ? ['0 0 0 0 rgba(239, 68, 68, 0.7)', '0 0 0 10px rgba(239, 68, 68, 0)', '0 0 0 0 rgba(239, 68, 68, 0)']
                            : 'none'
                        }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-800 mb-1">{ticket.title}</h3>
                        <p className="text-sm text-gray-600 mb-2">{ticket.description}</p>
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <span className="flex items-center">
                            <User className="w-3 h-3 mr-1" />
                            {ticket.customer}
                          </span>
                          <span className="flex items-center">
                            <Clock className="w-3 h-3 mr-1" />
                            {formatTime(ticket.escalationTime)}
                          </span>
                          <span className="flex items-center">
                            <Briefcase className="w-3 h-3 mr-1" />
                            {ticket.restaurant}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(ticket.status)}`}>
                        {ticket.status.replace('_', ' ').toUpperCase()}
                      </span>
                      <p className="text-sm font-semibold text-gray-800 mt-2">
                        {ticket.orderValue.toLocaleString()} FCFA
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <img
                        src={`https://ui-avatars.com/api/?name=${ticket.assignedAgent}&background=random`}
                        alt={ticket.assignedAgent}
                        className="w-6 h-6 rounded-full"
                      />
                      <span className="text-sm text-gray-600">{ticket.assignedAgent}</span>
                    </div>
                    
                    <div className="flex space-x-2">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
                        onClick={(e) => {
                          e.stopPropagation();
                          window.open(`tel:${ticket.customerPhone}`);
                        }}
                      >
                        <Phone className="w-4 h-4" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedTicket(ticket);
                          setShowEscalationModal(true);
                        }}
                      >
                        <ArrowUp className="w-4 h-4" />
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Colonne secondaire - Détails du ticket sélectionné */}
          <div className="lg:sticky lg:top-6">
            {selectedTicket ? (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-800">Détails du Ticket</h2>
                  <span className="text-sm text-gray-500">{selectedTicket.id}</span>
                </div>

                <div className="space-y-6">
                  {/* Informations client */}
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-3">Informations Client</h3>
                    <div className="bg-gray-50 rounded-xl p-4">
                      <div className="flex items-center space-x-3 mb-2">
                        <User className="w-5 h-5 text-gray-600" />
                        <span className="font-medium">{selectedTicket.customer}</span>
                      </div>
                      <div className="flex items-center space-x-3 mb-2">
                        <Phone className="w-5 h-5 text-gray-600" />
                        <span>{selectedTicket.customerPhone}</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Briefcase className="w-5 h-5 text-gray-600" />
                        <span>{selectedTicket.restaurant}</span>
                      </div>
                    </div>
                  </div>

                  {/* Routage intelligent */}
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-3">Routage Intelligent</h3>
                    <div className="bg-gradient-to-r from-green-50 to-red-50 rounded-xl p-4">
                      {(() => {
                        const routing = intelligentRouting(selectedTicket);
                        return (
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-gray-600">Équipe Recommandée</span>
                              <span className="font-semibold text-green-600">{routing.team}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-gray-600">Niveau d'Escalade</span>
                              <span className="font-semibold text-red-600">{routing.escalationLevel}</span>
                            </div>
                            <div>
                              <span className="text-sm text-gray-600">Agents Disponibles</span>
                              <div className="flex flex-wrap gap-2 mt-2">
                                {routing.agents.map((agent, idx) => (
                                  <span key={idx} className="px-2 py-1 bg-white rounded-lg text-xs font-medium text-gray-700">
                                    {agent}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                        );
                      })()}
                    </div>
                  </div>

                  {/* Actions d'escalade */}
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-3">Actions d'Escalade</h3>
                    <div className="grid grid-cols-2 gap-3">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleEscalation(selectedTicket.id, 'superviseur')}
                        className="p-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-medium shadow-lg"
                      >
                        <Target className="w-4 h-4 mx-auto mb-1" />
                        Superviseur
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleEscalation(selectedTicket.id, 'specialiste')}
                        className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-medium shadow-lg"
                      >
                        <Star className="w-4 h-4 mx-auto mb-1" />
                        Spécialiste
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleEscalation(selectedTicket.id, 'manager')}
                        className="p-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-xl font-medium shadow-lg"
                      >
                        <Users className="w-4 h-4 mx-auto mb-1" />
                        Manager
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleEscalation(selectedTicket.id, 'urgent')}
                        className="p-3 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl font-medium shadow-lg"
                      >
                        <Zap className="w-4 h-4 mx-auto mb-1" />
                        Urgent
                      </motion.button>
                    </div>
                  </div>

                  {/* Historique des tentatives */}
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-3">Tentatives de Contact</h3>
                    <div className="space-y-2">
                      {Array.from({ length: selectedTicket.attempts }, (_, i) => (
                        <div key={i} className="flex items-center space-x-3 p-2 bg-gray-50 rounded-lg">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          <span className="text-sm text-gray-600">
                            Tentative {i + 1} - {formatTime(new Date(Date.now() - (selectedTicket.attempts - i) * 30 * 60000))}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white rounded-2xl p-12 shadow-lg border border-gray-100 text-center"
              >
                <Activity className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-600 mb-2">
                  Sélectionnez un ticket
                </h3>
                <p className="text-gray-500">
                  Cliquez sur un ticket pour voir les détails et options d'escalade
                </p>
              </motion.div>
            )}
          </div>
        </div>

        {/* Modal d'escalade (si nécessaire) */}
        <AnimatePresence>
          {showEscalationModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
              onClick={() => setShowEscalationModal(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Confirmation d'Escalade</h2>
                <p className="text-gray-600 mb-6">
                  Êtes-vous sûr de vouloir escalader ce ticket ? Cette action ne peut pas être annulée.
                </p>
                <div className="flex space-x-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowEscalationModal(false)}
                    className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50"
                  >
                    Annuler
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleEscalation(selectedTicket?.id, 'confirm')}
                    disabled={loading}
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl font-medium disabled:opacity-50"
                  >
                    {loading ? 'Escalade...' : 'Confirmer'}
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </SupportAgentLayout>
  );
};

export default SupportEscalation;