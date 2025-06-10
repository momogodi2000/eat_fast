import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  MessageCircle, 
  Phone, 
  Mail, 
  AlertTriangle, 
  Users, 
  Clock, 
  TrendingUp,
  Search,
  Filter,
  ArrowUp,
  ArrowDown,
  Eye,
  UserPlus,
  Zap,
  BarChart3,
  Map,
  Mic,
  Settings,
  RefreshCw,
  CheckCircle,
  XCircle,
  AlertCircle,
  Star,
  ThumbsUp,
  ThumbsDown,
  Send,
  FileText,
  Headphones,
  Target,
  Trophy,
  Activity
} from 'lucide-react';
import SupportAgentLayout from "@/layouts/agent_support_layout.jsx";

const SupportAgentMainDashboard = () => {
  const [tickets, setTickets] = useState([
    {
      id: 'T001',
      userName: 'Marie Dupont',
      issueType: 'Livraison',
      priority: 'Critique',
      timeOpen: '45 min',
      assignee: 'Moi',
      sentiment: 'angry',
      status: 'En cours',
      description: 'Commande en retard de 1h30'
    },
    {
      id: 'T002',
      userName: 'Jean Kamga',
      issueType: 'Paiement',
      priority: 'Moyen',
      timeOpen: '12 min',
      assignee: 'Non assigné',
      sentiment: 'neutral',
      status: 'Nouveau',
      description: 'Problème avec Mobile Money'
    },
    {
      id: 'T003',
      userName: 'Sarah Mballa',
      issueType: 'Compte',
      priority: 'Faible',
      timeOpen: '3 min',
      assignee: 'Équipe Tech',
      sentiment: 'calm',
      status: 'Escaladé',
      description: 'Impossible de se connecter'
    }
  ]);

  const [activeFilter, setActiveFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const sentimentEmojis = {
    angry: '😡',
    neutral: '😐',
    calm: '😊'
  };

  const priorityColors = {
    'Critique': 'bg-red-500',
    'Moyen': 'bg-yellow-500',
    'Faible': 'bg-green-500'
  };

  const filteredTickets = tickets.filter(ticket => {
    const matchesFilter = activeFilter === 'all' || 
                         (activeFilter === 'assigned' && ticket.assignee === 'Moi') ||
                         (activeFilter === 'unassigned' && ticket.assignee === 'Non assigné') ||
                         (activeFilter === ticket.priority.toLowerCase());
    
    const matchesSearch = ticket.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.issueType.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  const StatCard = ({ title, value, icon: Icon, color, change, isPositive }) => (
    <div className={`${color} p-6 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 relative overflow-hidden`}>
      <div className="absolute top-0 right-0 w-20 h-20 bg-white bg-opacity-10 rounded-full -mr-10 -mt-10"></div>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-white/80 text-sm font-medium">{title}</p>
          <p className="text-3xl font-bold text-white mt-2">{value}</p>
          {change && (
            <div className="flex items-center mt-2">
              {isPositive ? (
                <ArrowUp className="w-4 h-4 text-white mr-1" />
              ) : (
                <ArrowDown className="w-4 h-4 text-white mr-1" />
              )}
              <span className="text-white/90 text-sm">{change}</span>
            </div>
          )}
        </div>
        <div className="bg-white/20 p-3 rounded-full">
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );

  const QuickActionButton = ({ icon: Icon, label, onClick, color = "bg-blue-500" }) => (
    <button
      onClick={onClick}
      className={`${color} hover:opacity-90 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-all duration-200 transform hover:scale-105 shadow-md`}
    >
      <Icon className="w-4 h-4" />
      <span className="text-sm font-medium">{label}</span>
    </button>
  );

  const PriorityBadge = ({ priority }) => (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-white ${priorityColors[priority]}`}>
      {priority}
    </span>
  );

  const SentimentBadge = ({ sentiment }) => (
    <span className="text-lg">{sentimentEmojis[sentiment]}</span>
  );

  return (
    <SupportAgentLayout>
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-red-50 to-yellow-50 p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Tableau de Bord Agent Support
              </h1>
              <p className="text-gray-600">
                {currentTime.toLocaleString('fr-FR', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
            <div className="flex items-center space-x-4 mt-4 lg:mt-0">
              <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-all duration-200">
                <RefreshCw className="w-4 h-4" />
                <span>Actualiser</span>
              </button>
              <button className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-all duration-200">
                <Settings className="w-4 h-4" />
                <span>Paramètres</span>
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Tickets Ouverts"
            value="23"
            icon={AlertTriangle}
            color="bg-gradient-to-r from-red-500 to-red-600"
            change="+12%"
            isPositive={false}
          />
          <StatCard
            title="Assignés à Moi"
            value="8"
            icon={Users}
            color="bg-gradient-to-r from-green-500 to-green-600"
            change="+5%"
            isPositive={true}
          />
          <StatCard
            title="Temps Moyen"
            value="24min"
            icon={Clock}
            color="bg-gradient-to-r from-yellow-500 to-yellow-600"
            change="-8%"
            isPositive={true}
          />
          <StatCard
            title="Satisfaction"
            value="4.7/5"
            icon={Star}
            color="bg-gradient-to-r from-blue-500 to-blue-600"
            change="⭐ +0.2"
            isPositive={true}
          />
        </div>

        {/* Alerts Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border-l-4 border-red-500">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900 flex items-center">
              <Bell className="w-5 h-5 mr-2 text-red-500" />
              Alertes Proactives
            </h2>
            <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium">
              3 Alertes
            </span>
          </div>
          <div className="space-y-3">
            <div className="flex items-center p-3 bg-red-50 rounded-lg border border-red-200">
              <AlertCircle className="w-5 h-5 text-red-500 mr-3" />
              <div className="flex-1">
                <p className="text-sm font-medium text-red-800">
                  Retard de Livraison Détecté
                </p>
                <p className="text-xs text-red-600">
                  5 commandes du Restaurant Chez Maman sont en retard de plus de 20 minutes
                </p>
              </div>
              <button className="bg-red-500 text-white px-3 py-1 rounded-md text-xs hover:bg-red-600 transition-colors">
                Notifier
              </button>
            </div>
            <div className="flex items-center p-3 bg-yellow-50 rounded-lg border border-yellow-200">
              <TrendingUp className="w-5 h-5 text-yellow-500 mr-3" />
              <div className="flex-1">
                <p className="text-sm font-medium text-yellow-800">
                  Tendance Alerte
                </p>
                <p className="text-xs text-yellow-600">
                  12 échecs de paiement dans la dernière heure - Problème système possible
                </p>
              </div>
              <button className="bg-yellow-500 text-white px-3 py-1 rounded-md text-xs hover:bg-yellow-600 transition-colors">
                Enquêter
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Main Ticket Management Panel */}
          <div className="xl:col-span-2 space-y-6">
            {/* Search and Filters */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4 lg:mb-0">
                  Gestion des Tickets
                </h2>
                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Rechercher tickets..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent w-full sm:w-auto"
                    />
                  </div>
                  <select
                    value={activeFilter}
                    onChange={(e) => setActiveFilter(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="all">Tous</option>
                    <option value="assigned">Assignés à moi</option>
                    <option value="unassigned">Non assignés</option>
                    <option value="critique">Critique</option>
                    <option value="moyen">Moyen</option>
                    <option value="faible">Faible</option>
                  </select>
                </div>
              </div>

              {/* Tickets Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">ID</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Utilisateur</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Type</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Priorité</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Temps</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Humeur</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTickets.map((ticket) => (
                      <tr key={ticket.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                        <td className="py-4 px-4 font-medium text-blue-600">{ticket.id}</td>
                        <td className="py-4 px-4">
                          <div>
                            <div className="font-medium text-gray-900">{ticket.userName}</div>
                            <div className="text-sm text-gray-500">{ticket.description}</div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {ticket.issueType}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <PriorityBadge priority={ticket.priority} />
                        </td>
                        <td className="py-4 px-4 text-sm text-gray-500">{ticket.timeOpen}</td>
                        <td className="py-4 px-4">
                          <SentimentBadge sentiment={ticket.sentiment} />
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex space-x-2">
                            <QuickActionButton
                              icon={MessageCircle}
                              label="Chat"
                              onClick={() => setSelectedTicket(ticket)}
                              color="bg-green-500"
                            />
                            <QuickActionButton
                              icon={ArrowUp}
                              label="Escalader"
                              onClick={() => {}}
                              color="bg-yellow-500"
                            />
                            <QuickActionButton
                              icon={CheckCircle}
                              label="Fermer"
                              onClick={() => {}}
                              color="bg-red-500"
                            />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* AI Assistant */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <Zap className="w-5 h-5 mr-2 text-yellow-500" />
                Assistant IA
              </h3>
              <div className="space-y-4">
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <h4 className="font-semibold text-green-800 mb-2">Solutions Suggérées</h4>
                  <p className="text-sm text-green-700">
                    80% des tickets "livraison en retard" sont résolus avec un remboursement de 10%
                  </p>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <h4 className="font-semibold text-blue-800 mb-2">Articles Populaires</h4>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Procédure de remboursement</li>
                    <li>• Politique de retard</li>
                    <li>• Contact livreur</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Communication Channels */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <Headphones className="w-5 h-5 mr-2 text-blue-500" />
                Canaux de Communication
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center">
                    <MessageCircle className="w-5 h-5 text-green-500 mr-3" />
                    <span className="font-medium text-green-800">Chat</span>
                  </div>
                  <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs">5</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center">
                    <Mail className="w-5 h-5 text-blue-500 mr-3" />
                    <span className="font-medium text-blue-800">Email</span>
                  </div>
                  <span className="bg-blue-500 text-white px-2 py-1 rounded-full text-xs">12</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                  <div className="flex items-center">
                    <Phone className="w-5 h-5 text-yellow-500 mr-3" />
                    <span className="font-medium text-yellow-800">Appels</span>
                  </div>
                  <span className="bg-yellow-500 text-white px-2 py-1 rounded-full text-xs">3</span>
                </div>
              </div>
            </div>

            {/* Performance Metrics */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <Trophy className="w-5 h-5 mr-2 text-yellow-500" />
                Performance
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Temps de résolution</span>
                  <span className="font-semibold text-gray-900">18 min</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '85%' }}></div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Taux de satisfaction</span>
                  <span className="font-semibold text-gray-900">4.8/5</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '96%' }}></div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Tickets fermés</span>
                  <span className="font-semibold text-gray-900">47 aujourd'hui</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-red-500 h-2 rounded-full" style={{ width: '75%' }}></div>
                </div>
              </div>
            </div>

            {/* Voice to Ticket */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <Mic className="w-5 h-5 mr-2 text-red-500" />
                Vocal vers Ticket
              </h3>
              <button
                onClick={() => setIsRecording(!isRecording)}
                className={`w-full p-4 rounded-lg border-2 border-dashed transition-all duration-300 ${
                  isRecording 
                    ? 'bg-red-50 border-red-300 text-red-700' 
                    : 'bg-gray-50 border-gray-300 text-gray-700 hover:bg-gray-100'
                }`}
              >
                <div className="flex flex-col items-center">
                  <div className={`p-3 rounded-full mb-2 ${
                    isRecording ? 'bg-red-500 animate-pulse' : 'bg-gray-400'
                  }`}>
                    <Mic className="w-6 h-6 text-white" />
                  </div>
                  <span className="font-medium">
                    {isRecording ? 'Enregistrement...' : 'Enregistrer un problème'}
                  </span>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Chat Modal */}
        {selectedTicket && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">
                      Chat avec {selectedTicket.userName}
                    </h3>
                    <p className="text-sm text-gray-500">Ticket #{selectedTicket.id}</p>
                  </div>
                  <button
                    onClick={() => setSelectedTicket(null)}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <XCircle className="w-6 h-6" />
                  </button>
                </div>
              </div>
              <div className="p-6">
                <div className="h-64 overflow-y-auto mb-4 space-y-3">
                  <div className="bg-gray-100 p-3 rounded-lg">
                    <p className="text-sm text-gray-800">{selectedTicket.description}</p>
                    <span className="text-xs text-gray-500">Il y a {selectedTicket.timeOpen}</span>
                  </div>
                  <div className="bg-green-100 p-3 rounded-lg ml-8">
                    <p className="text-sm text-gray-800">Bonjour, je comprends votre frustration. Laissez-moi vérifier le statut de votre commande.</p>
                    <span className="text-xs text-gray-500">Maintenant</span>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    placeholder="Tapez votre message..."
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                  <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors">
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </SupportAgentLayout>
  );
};

export default SupportAgentMainDashboard;