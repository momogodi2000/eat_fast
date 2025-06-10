import React, { useState, useRef, useEffect } from 'react';
import { 
  MessageCircle, 
  Mail, 
  Phone, 
  Send, 
  Users, 
  Clock, 
  Search, 
  Filter,
  MoreVertical,
  Paperclip,
  Smile,
  Star,
  CheckCircle,
  AlertCircle,
  User,
  ChefHat,
  Truck,
  X,
  Minimize2,
  Maximize2
} from 'lucide-react';
import SupportAgentLayout from "@/layouts/agent_support_layout.jsx";

const SupportUserCommunication = () => {
  const [selectedContact, setSelectedContact] = useState(null);
  const [activeTab, setActiveTab] = useState('chat');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [message, setMessage] = useState('');
  const [isMinimized, setIsMinimized] = useState(false);
  const messagesEndRef = useRef(null);

  const contacts = [
    {
      id: 1,
      name: 'Marie Ngozi',
      type: 'client',
      avatar: '/api/placeholder/40/40',
      status: 'urgent',
      lastMessage: 'Ma commande est en retard de 45 minutes',
      timestamp: '14:32',
      unread: 3,
      phone: '+237 691 234 567',
      email: 'marie.ngozi@gmail.com',
      orderNumber: '#EF2024001',
      issue: 'Retard de livraison'
    },
    {
      id: 2,
      name: 'Restaurant Chez Tantine',
      type: 'restaurant',
      avatar: '/api/placeholder/40/40',
      status: 'active',
      lastMessage: 'Besoin d\'aide avec l\'interface de gestion',
      timestamp: '13:45',
      unread: 1,
      phone: '+237 696 789 123',
      email: 'contact@cheztantine.cm',
      restaurantId: 'RST-445',
      issue: 'Support technique'
    },
    {
      id: 3,
      name: 'Jean-Pierre Fouda',
      type: 'livreur',
      avatar: '/api/placeholder/40/40',
      status: 'resolved',
      lastMessage: 'Merci pour votre aide',
      timestamp: '12:15',
      unread: 0,
      phone: '+237 655 442 881',
      email: 'jp.fouda@eatfast.cm',
      deliveryId: 'DLV-2891',
      issue: 'Problème de géolocalisation'
    },
    {
      id: 4,
      name: 'Aminata Diallo',
      type: 'client',
      avatar: '/api/placeholder/40/40',
      status: 'pending',
      lastMessage: 'Question sur la facturation',
      timestamp: '11:30',
      unread: 2,
      phone: '+237 677 159 753',
      email: 'aminata.diallo@yahoo.fr',
      orderNumber: '#EF2024002',
      issue: 'Facturation'
    }
  ];

  const chatMessages = [
    {
      id: 1,
      sender: 'user',
      content: 'Bonjour, ma commande #EF2024001 est en retard',
      timestamp: '14:20',
      type: 'text'
    },
    {
      id: 2,
      sender: 'agent',
      content: 'Bonjour Marie, je comprends votre préoccupation. Laissez-moi vérifier le statut de votre commande.',
      timestamp: '14:22',
      type: 'text'
    },
    {
      id: 3,
      sender: 'agent',
      content: 'Votre commande a été retardée à cause du trafic. Le livreur sera chez vous dans 10 minutes.',
      timestamp: '14:25',
      type: 'text'
    },
    {
      id: 4,
      sender: 'user',
      content: 'D\'accord, merci pour l\'information',
      timestamp: '14:32',
      type: 'text'
    }
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);

  const getStatusColor = (status) => {
    switch(status) {
      case 'urgent': return 'bg-red-500';
      case 'active': return 'bg-green-500';
      case 'pending': return 'bg-yellow-500';
      case 'resolved': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const getTypeIcon = (type) => {
    switch(type) {
      case 'client': return <User className="w-4 h-4" />;
      case 'restaurant': return <ChefHat className="w-4 h-4" />;
      case 'livreur': return <Truck className="w-4 h-4" />;
      default: return <User className="w-4 h-4" />;
    }
  };

  const getTypeColor = (type) => {
    switch(type) {
      case 'client': return 'text-blue-600';
      case 'restaurant': return 'text-purple-600';
      case 'livreur': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contact.issue.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || contact.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const handleSendMessage = () => {
    if (message.trim()) {
      // Logic to send message
      setMessage('');
    }
  };

  const handlePhoneCall = (contact) => {
    // Logic to initiate phone call
    console.log(`Appel vers ${contact.phone}`);
  };

  const handleSendEmail = (contact) => {
    // Logic to open email client
    console.log(`Email vers ${contact.email}`);
  };

  const handleSendSMS = (contact) => {
    // Logic to send SMS
    console.log(`SMS vers ${contact.phone}`);
  };

  return (
    <SupportAgentLayout>
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-red-50 p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="bg-white rounded-2xl shadow-xl p-6 border-l-4 border-green-600">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-800 mb-2">
                  Communication Utilisateurs
                </h1>
                <p className="text-gray-600">
                  Gérez les communications avec les clients, restaurants et livreurs
                </p>
              </div>
              <div className="bg-gradient-to-r from-green-500 to-red-500 p-4 rounded-xl">
                <MessageCircle className="w-8 h-8 text-white animate-pulse" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
          {/* Contacts List */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            {/* Search and Filter */}
            <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-green-500 to-red-500">
              <div className="flex flex-col gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Rechercher un contact..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-white/20 backdrop-blur border border-white/30 rounded-lg text-white placeholder-white/80 focus:outline-none focus:ring-2 focus:ring-white/50"
                  />
                </div>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full px-3 py-2 bg-white/20 backdrop-blur border border-white/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white/50"
                >
                  <option value="all" className="text-gray-800">Tous les statuts</option>
                  <option value="urgent" className="text-gray-800">Urgent</option>
                  <option value="active" className="text-gray-800">Actif</option>
                  <option value="pending" className="text-gray-800">En attente</option>
                  <option value="resolved" className="text-gray-800">Résolu</option>
                </select>
              </div>
            </div>

            {/* Contacts */}
            <div className="overflow-y-auto flex-1">
              {filteredContacts.map((contact) => (
                <div
                  key={contact.id}
                  onClick={() => setSelectedContact(contact)}
                  className={`p-4 border-b border-gray-100 cursor-pointer transition-all duration-300 hover:bg-gray-50 ${
                    selectedContact?.id === contact.id ? 'bg-green-50 border-l-4 border-l-green-500' : ''
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <img
                        src={contact.avatar}
                        alt={contact.name}
                        className="w-12 h-12 rounded-full object-cover ring-2 ring-gray-200 animate-pulse"
                      />
                      <div className={`absolute -top-1 -right-1 w-4 h-4 rounded-full ${getStatusColor(contact.status)} border-2 border-white`}></div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`${getTypeColor(contact.type)}`}>
                          {getTypeIcon(contact.type)}
                        </span>
                        <h3 className="font-semibold text-gray-800 truncate">
                          {contact.name}
                        </h3>
                        {contact.unread > 0 && (
                          <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full animate-bounce">
                            {contact.unread}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 truncate mb-1">
                        {contact.lastMessage}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">
                          {contact.timestamp}
                        </span>
                        <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">
                          {contact.issue}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Communication Panel */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col">
            {selectedContact ? (
              <>
                {/* Contact Header */}
                <div className="p-4 bg-gradient-to-r from-green-500 to-red-500 text-white">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img
                        src={selectedContact.avatar}
                        alt={selectedContact.name}
                        className="w-12 h-12 rounded-full object-cover ring-2 ring-white/50"
                      />
                      <div>
                        <h2 className="font-bold text-lg">{selectedContact.name}</h2>
                        <div className="flex items-center gap-2">
                          <span className="text-white/80">
                            {getTypeIcon(selectedContact.type)}
                          </span>
                          <span className="text-sm text-white/80">
                            {selectedContact.issue}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setIsMinimized(!isMinimized)}
                        className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                      >
                        {isMinimized ? <Maximize2 className="w-5 h-5" /> : <Minimize2 className="w-5 h-5" />}
                      </button>
                      <button
                        onClick={() => setSelectedContact(null)}
                        className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  {/* Contact Info */}
                  {!isMinimized && (
                    <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-white/20 backdrop-blur p-3 rounded-lg">
                        <div className="text-xs text-white/80 mb-1">Téléphone</div>
                        <div className="text-sm font-medium">{selectedContact.phone}</div>
                      </div>
                      <div className="bg-white/20 backdrop-blur p-3 rounded-lg">
                        <div className="text-xs text-white/80 mb-1">Email</div>
                        <div className="text-sm font-medium truncate">{selectedContact.email}</div>
                      </div>
                      <div className="bg-white/20 backdrop-blur p-3 rounded-lg">
                        <div className="text-xs text-white/80 mb-1">Référence</div>
                        <div className="text-sm font-medium">
                          {selectedContact.orderNumber || selectedContact.restaurantId || selectedContact.deliveryId}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {!isMinimized && (
                  <>
                    {/* Communication Tabs */}
                    <div className="flex border-b border-gray-200">
                      <button
                        onClick={() => setActiveTab('chat')}
                        className={`flex items-center gap-2 px-6 py-3 font-medium transition-colors ${
                          activeTab === 'chat' 
                            ? 'text-green-600 border-b-2 border-green-600 bg-green-50' 
                            : 'text-gray-600 hover:text-green-600'
                        }`}
                      >
                        <MessageCircle className="w-4 h-4" />
                        Chat
                      </button>
                      <button
                        onClick={() => setActiveTab('email')}
                        className={`flex items-center gap-2 px-6 py-3 font-medium transition-colors ${
                          activeTab === 'email' 
                            ? 'text-green-600 border-b-2 border-green-600 bg-green-50' 
                            : 'text-gray-600 hover:text-green-600'
                        }`}
                      >
                        <Mail className="w-4 h-4" />
                        Email
                      </button>
                      <button
                        onClick={() => setActiveTab('sms')}
                        className={`flex items-center gap-2 px-6 py-3 font-medium transition-colors ${
                          activeTab === 'sms' 
                            ? 'text-green-600 border-b-2 border-green-600 bg-green-50' 
                            : 'text-gray-600 hover:text-green-600'
                        }`}
                      >
                        <Phone className="w-4 h-4" />
                        SMS/Appel
                      </button>
                    </div>

                    {/* Communication Content */}
                    <div className="flex-1 flex flex-col">
                      {activeTab === 'chat' && (
                        <>
                          {/* Messages */}
                          <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            {chatMessages.map((msg) => (
                              <div
                                key={msg.id}
                                className={`flex ${msg.sender === 'agent' ? 'justify-end' : 'justify-start'}`}
                              >
                                <div
                                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                                    msg.sender === 'agent'
                                      ? 'bg-gradient-to-r from-green-500 to-red-500 text-white'
                                      : 'bg-gray-100 text-gray-800'
                                  } transform transition-all duration-300 hover:scale-105`}
                                >
                                  <p>{msg.content}</p>
                                  <p className={`text-xs mt-1 ${
                                    msg.sender === 'agent' ? 'text-white/80' : 'text-gray-500'
                                  }`}>
                                    {msg.timestamp}
                                  </p>
                                </div>
                              </div>
                            ))}
                            <div ref={messagesEndRef} />
                          </div>

                          {/* Message Input */}
                          <div className="p-4 border-t border-gray-200">
                            <div className="flex items-center gap-2">
                              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                                <Paperclip className="w-5 h-5 text-gray-500" />
                              </button>
                              <div className="flex-1 relative">
                                <input
                                  type="text"
                                  value={message}
                                  onChange={(e) => setMessage(e.target.value)}
                                  placeholder="Tapez votre message..."
                                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                                />
                              </div>
                              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                                <Smile className="w-5 h-5 text-gray-500" />
                              </button>
                              <button
                                onClick={handleSendMessage}
                                className="p-2 bg-gradient-to-r from-green-500 to-red-500 text-white rounded-lg hover:from-green-600 hover:to-red-600 transition-all duration-300 transform hover:scale-105"
                              >
                                <Send className="w-5 h-5" />
                              </button>
                            </div>
                          </div>
                        </>
                      )}

                      {activeTab === 'email' && (
                        <div className="flex-1 p-6">
                          <div className="bg-gray-50 rounded-lg p-6 h-full">
                            <h3 className="text-lg font-semibold mb-4">Envoyer un Email</h3>
                            <div className="space-y-4">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  Destinataire
                                </label>
                                <input
                                  type="email"
                                  value={selectedContact.email}
                                  readOnly
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  Objet
                                </label>
                                <input
                                  type="text"
                                  placeholder="Objet de l'email..."
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  Message
                                </label>
                                <textarea
                                  rows={6}
                                  placeholder="Votre message..."
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                ></textarea>
                              </div>
                              <button
                                onClick={() => handleSendEmail(selectedContact)}
                                className="w-full bg-gradient-to-r from-green-500 to-red-500 text-white py-3 rounded-lg font-medium hover:from-green-600 hover:to-red-600 transition-all duration-300 transform hover:scale-105"
                              >
                                <Mail className="w-5 h-5 inline-block mr-2" />
                                Envoyer l'Email
                              </button>
                            </div>
                          </div>
                        </div>
                      )}

                      {activeTab === 'sms' && (
                        <div className="flex-1 p-6">
                          <div className="bg-gray-50 rounded-lg p-6 h-full">
                            <h3 className="text-lg font-semibold mb-4">SMS & Appel Téléphonique</h3>
                            <div className="space-y-6">
                              {/* Quick Call */}
                              <div className="bg-white p-4 rounded-lg border">
                                <h4 className="font-medium mb-3">Appel Téléphonique</h4>
                                <div className="flex items-center justify-between">
                                  <div>
                                    <p className="text-sm text-gray-600 mb-1">Numéro</p>
                                    <p className="font-medium">{selectedContact.phone}</p>
                                  </div>
                                  <button
                                    onClick={() => handlePhoneCall(selectedContact)}
                                    className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-all duration-300 transform hover:scale-105"
                                  >
                                    <Phone className="w-5 h-5 inline-block mr-2" />
                                    Appeler
                                  </button>
                                </div>
                              </div>

                              {/* SMS */}
                              <div className="bg-white p-4 rounded-lg border">
                                <h4 className="font-medium mb-3">Envoyer un SMS</h4>
                                <div className="space-y-3">
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                      Destinataire
                                    </label>
                                    <input
                                      type="tel"
                                      value={selectedContact.phone}
                                      readOnly
                                      className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                      Message SMS
                                    </label>
                                    <textarea
                                      rows={3}
                                      placeholder="Votre message SMS..."
                                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                      maxLength={160}
                                    ></textarea>
                                    <p className="text-xs text-gray-500 mt-1">160 caractères max</p>
                                  </div>
                                  <button
                                    onClick={() => handleSendSMS(selectedContact)}
                                    className="w-full bg-gradient-to-r from-green-500 to-red-500 text-white py-3 rounded-lg font-medium hover:from-green-600 hover:to-red-600 transition-all duration-300 transform hover:scale-105"
                                  >
                                    <MessageCircle className="w-5 h-5 inline-block mr-2" />
                                    Envoyer SMS
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-24 h-24 bg-gradient-to-r from-green-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                    <MessageCircle className="w-12 h-12 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    Sélectionnez un contact
                  </h3>
                  <p className="text-gray-600">
                    Choisissez un contact pour commencer la communication
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
            <div className="flex items-center gap-3">
              <div className="bg-red-100 p-3 rounded-lg">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="font-semibold">Tickets Urgents</h3>
                <p className="text-2xl font-bold text-red-600">2</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
            <div className="flex items-center gap-3">
              <div className="bg-yellow-100 p-3 rounded-lg">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <h3 className="font-semibold">En Attente</h3>
                <p className="text-2xl font-bold text-yellow-600">5</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
            <div className="flex items-center gap-3">
              <div className="bg-green-100 p-3 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold">Résolus Aujourd'hui</h3>
                <p className="text-2xl font-bold text-green-600">12</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 p-3 rounded-lg">
                <Star className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold">Satisfaction</h3>
                <p className="text-2xl font-bold text-blue-600">4.8/5</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SupportAgentLayout>
  );
};

export default SupportUserCommunication;