import React, { useState, useEffect, useRef, useContext } from 'react';
import { useAppContext, AppContext } from '../../../../layouts/clients_layout';
import { 
  MessageCircle, 
  Send, 
  Paperclip, 
  Image, 
  FileText, 
  Bot, 
  User, 
  Headphones, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Camera,
  Mic,
  MicOff,
  Phone,
  Video,
  MoreVertical,
  Star,
  ThumbsUp,
  ThumbsDown,
  X,
  ArrowLeft,
  Loader,
  Zap
} from 'lucide-react';

const ClientsChatSupport = () => {
  const user= useContext(AppContext);



  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [chatMode, setChatMode] = useState('bot'); // 'bot' or 'agent'
  const [agentInfo, setAgentInfo] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [chatStatus, setChatStatus] = useState('active'); // 'active', 'ended', 'waiting'
  const [supportCategory, setSupportCategory] = useState('');
  const [showRating, setShowRating] = useState(false);
  const [rating, setRating] = useState(0);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  // Cameroon flag colors
  const colors = {
    green: '#00AA00',
    red: '#FF0000',
    yellow: '#FFFF00',
    dark: '#1a1a1a',
    light: '#f5f5f5'
  };

  // Initial bot welcome message
  useEffect(() => {
    const welcomeMessage = {
      id: 1,
      type: 'bot',
      message: `Bonjour ${user?.name || 'cher client'} ! 👋\n\nJe suis EatBot, votre assistant virtuel Eat Fast. Je suis là pour vous aider avec :\n\n🍽️ Questions sur vos commandes\n⏰ Problèmes de livraison\n💳 Questions de paiement\n🎯 Support technique\n\nComment puis-je vous aider aujourd'hui ?`,
      timestamp: new Date(),
      quickReplies: [
        'Où est ma commande ?',
        'Problème de paiement',
        'Modifier ma commande',
        'Parler à un agent'
      ]
    };
    setMessages([welcomeMessage]);
  }, [user]);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Bot response logic
  const getBotResponse = (userMessage) => {
    const message = userMessage.toLowerCase();
    
    if (message.includes('commande') || message.includes('livraison') || message.includes('retard')) {
      return {
        message: "Je comprends votre préoccupation concernant votre commande. 📱\n\nPour mieux vous aider, pourriez-vous me donner :\n• Votre numéro de commande\n• L'heure approximative de votre commande\n\nSi c'est urgent, je peux vous connecter directement avec un agent support.",
        quickReplies: ['Donner numéro commande', 'Parler à un agent', 'C\'est très urgent']
      };
    }
    
    if (message.includes('paiement') || message.includes('argent') || message.includes('mobile money')) {
      return {
        message: "Questions de paiement ? 💳\n\nNos méthodes acceptées :\n• MTN Mobile Money\n• Orange Money\n• Cartes bancaires\n• Paiement à la livraison\n\nQuel est le problème spécifique ?",
        quickReplies: ['Paiement refusé', 'Remboursement', 'Facture incorrecte', 'Autre problème']
      };
    }
    
    if (message.includes('agent') || message.includes('humain') || message.includes('personne')) {
      return {
        message: "Je vais vous connecter avec un agent support humain. 👥\n\nVeuillez patienter quelques instants...",
        escalate: true
      };
    }
    
    if (message.includes('restaurant') || message.includes('menu') || message.includes('plat')) {
      return {
        message: "Questions sur les restaurants ou menus ? 🍽️\n\nJe peux vous aider avec :\n• Recherche de restaurants\n• Informations sur les plats\n• Horaires d'ouverture\n• Spécialités camerounaises\n\nQue souhaitez-vous savoir ?",
        quickReplies: ['Trouver restaurant', 'Plats traditionnels', 'Horaires', 'Autre question']
      };
    }
    
    return {
      message: "Je comprends votre demande. 🤔\n\nPour vous offrir la meilleure assistance, puis-je vous proposer de vous connecter avec l'un de nos agents support ? Ils pourront répondre à toutes vos questions spécifiques.",
      quickReplies: ['Oui, merci', 'Non, continuer ici', 'Plus d\'informations']
    };
  };

  // Handle escalation to human agent
  const escalateToAgent = () => {
    setChatMode('agent');
    setIsTyping(true);
    
    // Simulate agent connection
    setTimeout(() => {
      const agentMessage = {
        id: Date.now(),
        type: 'agent',
        message: "Bonjour ! Je suis Marie, agent support Eat Fast. 👋\n\nJ'ai pris connaissance de votre conversation avec EatBot. Comment puis-je vous aider davantage ?",
        timestamp: new Date(),
        agent: {
          name: 'Marie Nkomo',
          avatar: '👩🏾‍💼',
          status: 'En ligne',
          department: 'Support Client'
        }
      };
      
      setAgentInfo(agentMessage.agent);
      setMessages(prev => [...prev, agentMessage]);
      setIsTyping(false);
    }, 2000);
  };

  // Send message
  const sendMessage = () => {
    if (!newMessage.trim() && selectedFiles.length === 0) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      message: newMessage,
      timestamp: new Date(),
      files: selectedFiles
    };

    setMessages(prev => [...prev, userMessage]);
    setNewMessage('');
    setSelectedFiles([]);

    // Bot or agent response
    if (chatMode === 'bot') {
      setIsTyping(true);
      setTimeout(() => {
        const botResponse = getBotResponse(newMessage);
        const responseMessage = {
          id: Date.now() + 1,
          type: 'bot',
          message: botResponse.message,
          timestamp: new Date(),
          quickReplies: botResponse.quickReplies
        };

        setMessages(prev => [...prev, responseMessage]);
        setIsTyping(false);

        if (botResponse.escalate) {
          setTimeout(() => escalateToAgent(), 1500);
        }
      }, 1500);
    } else {
      // Agent response simulation
      setIsTyping(true);
      setTimeout(() => {
        const responses = [
          "Je comprends votre situation. Laissez-moi vérifier cela pour vous...",
          "Merci pour ces informations. Je vais résoudre cela immédiatement.",
          "C'est noté ! Je vais traiter votre demande et vous tenir informé.",
          "Parfait, je vois le problème. Je vais le corriger maintenant."
        ];
        
        const agentMessage = {
          id: Date.now() + 1,
          type: 'agent',
          message: responses[Math.floor(Math.random() * responses.length)],
          timestamp: new Date()
        };

        setMessages(prev => [...prev, agentMessage]);
        setIsTyping(false);
      }, 2000);
    }
  };

  // Handle file selection
  const handleFileSelect = (event) => {
    const files = Array.from(event.target.files);
    setSelectedFiles(prev => [...prev, ...files]);
  };

  // Handle quick reply
  const handleQuickReply = (reply) => {
    setNewMessage(reply);
    setTimeout(() => sendMessage(), 100);
  };

  // Format message with line breaks
  const formatMessage = (message) => {
    return message.split('\n').map((line, index) => (
      <React.Fragment key={index}>
        {line}
        {index < message.split('\n').length - 1 && <br />}
      </React.Fragment>
    ));
  };

  // End chat and show rating
  const endChat = () => {
    setChatStatus('ended');
    setShowRating(true);
  };

  return (
    // <ClientsLayout>
    <>
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-yellow-50 to-red-50">
        {/* Header */}
        <div className="bg-white shadow-lg border-b-4 border-green-600">
          <div className="max-w-6xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button className="lg:hidden p-2 rounded-lg bg-green-100 text-green-600 hover:bg-green-200 transition-colors">
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-yellow-500 rounded-full flex items-center justify-center animate-pulse">
                      {chatMode === 'bot' ? (
                        <Bot className="w-6 h-6 text-white" />
                      ) : (
                        <Headphones className="w-6 h-6 text-white" />
                      )}
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 border-2 border-white rounded-full animate-bounce"></div>
                  </div>
                  <div>
                    <h1 className="text-xl font-bold bg-gradient-to-r from-green-600 to-red-600 bg-clip-text text-transparent">
                      {chatMode === 'bot' ? 'EatBot Assistant' : `Agent: ${agentInfo?.name || 'Support'}`}
                    </h1>
                    <p className="text-sm text-gray-600 flex items-center">
                      <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                      {chatMode === 'bot' ? 'Assistant virtuel actif' : 'Agent en ligne'}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {chatMode === 'agent' && (
                  <>
                    <button className="p-2 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200 transition-all transform hover:rotate-12">
                      <Phone className="w-5 h-5" />
                    </button>
                    <button className="p-2 rounded-lg bg-purple-100 text-purple-600 hover:bg-purple-200 transition-all transform hover:scale-110">
                      <Video className="w-5 h-5" />
                    </button>
                  </>
                )}
                <button 
                  onClick={endChat}
                  className="p-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition-all transform hover:rotate-90"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Chat Container */}
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
            {/* Chat Header Info */}
            <div className="bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 p-4">
              <div className="flex items-center justify-between text-white">
                <div className="flex items-center space-x-3">
                  <Zap className="w-6 h-6 animate-bounce" />
                  <div>
                    <h2 className="font-bold">Support Eat Fast - Service Express</h2>
                    <p className="text-sm opacity-90">Réponse garantie en moins de 2 minutes</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm">Session: #{Date.now().toString().slice(-6)}</p>
                  <p className="text-xs opacity-75">Démarrée: {new Date().toLocaleTimeString('fr-FR')}</p>
                </div>
              </div>
            </div>

            {/* Messages Area */}
            <div className="h-96 overflow-y-auto p-4 space-y-4 bg-gray-50">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-xs lg:max-w-md xl:max-w-lg ${
                    message.type === 'user' 
                      ? 'order-2' 
                      : 'order-1'
                  }`}>
                    <div className={`flex items-start space-x-2 ${
                      message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                    }`}>
                      {/* Avatar */}
                      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                        message.type === 'user' 
                          ? 'bg-gradient-to-r from-blue-500 to-purple-500' 
                          : message.type === 'bot'
                          ? 'bg-gradient-to-r from-green-500 to-yellow-500'
                          : 'bg-gradient-to-r from-red-500 to-pink-500'
                      }`}>
                        {message.type === 'user' ? (
                          <User className="w-4 h-4 text-white" />
                        ) : message.type === 'bot' ? (
                          <Bot className="w-4 h-4 text-white" />
                        ) : (
                          <span className="text-xs text-white">{message.agent?.avatar || '👤'}</span>
                        )}
                      </div>

                      {/* Message Bubble */}
                      <div className={`relative px-4 py-3 rounded-2xl shadow-lg ${
                        message.type === 'user'
                          ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
                          : message.type === 'bot'
                          ? 'bg-white border-l-4 border-green-500 text-gray-800'
                          : 'bg-gradient-to-r from-red-50 to-yellow-50 border-l-4 border-red-500 text-gray-800'
                      }`}>
                        <div className="text-sm leading-relaxed">
                          {formatMessage(message.message)}
                        </div>
                        
                        {/* Files */}
                        {message.files && message.files.length > 0 && (
                          <div className="mt-2 space-y-2">
                            {message.files.map((file, index) => (
                              <div key={index} className="flex items-center space-x-2 p-2 bg-black bg-opacity-10 rounded-lg">
                                <FileText className="w-4 h-4" />
                                <span className="text-xs">{file.name}</span>
                              </div>
                            ))}
                          </div>
                        )}
                        
                        <div className={`text-xs mt-1 opacity-70 ${
                          message.type === 'user' ? 'text-white' : 'text-gray-500'
                        }`}>
                          {message.timestamp.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    </div>

                    {/* Quick Replies */}
                    {message.quickReplies && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {message.quickReplies.map((reply, index) => (
                          <button
                            key={index}
                            onClick={() => handleQuickReply(reply)}
                            className="px-3 py-2 bg-gradient-to-r from-green-100 to-yellow-100 hover:from-green-200 hover:to-yellow-200 text-green-800 text-sm rounded-full border border-green-300 transition-all transform hover:scale-105 hover:shadow-md"
                          >
                            {reply}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {/* Typing Indicator */}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-yellow-500 rounded-full flex items-center justify-center">
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                    <div className="bg-white rounded-2xl px-4 py-3 border-l-4 border-green-500">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-yellow-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Selected Files Preview */}
            {selectedFiles.length > 0 && (
              <div className="px-4 py-2 bg-yellow-50 border-t border-yellow-200">
                <div className="flex flex-wrap gap-2">
                  {selectedFiles.map((file, index) => (
                    <div key={index} className="flex items-center space-x-2 bg-white rounded-lg px-3 py-2 border border-yellow-300">
                      <FileText className="w-4 h-4 text-yellow-600" />
                      <span className="text-sm text-gray-700">{file.name}</span>
                      <button
                        onClick={() => setSelectedFiles(prev => prev.filter((_, i) => i !== index))}
                        className="text-red-500 hover:text-red-700 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Message Input */}
            <div className="p-4 border-t bg-white">
              <div className="flex items-end space-x-3">
                {/* Attachment Button */}
                <div className="relative">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="p-3 bg-gradient-to-r from-green-500 to-yellow-500 text-white rounded-full hover:shadow-lg transition-all transform hover:scale-110"
                  >
                    <Paperclip className="w-5 h-5" />
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/*,application/pdf,.doc,.docx,.txt"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                </div>

                {/* Message Input */}
                <div className="flex-1 relative">
                  <textarea
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        sendMessage();
                      }
                    }}
                    placeholder="Tapez votre message ici..."
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:border-green-500 focus:ring-2 focus:ring-green-200 resize-none transition-all"
                    rows="2"
                  />
                </div>

                {/* Voice Record Button */}
                <button
                  onClick={() => setIsRecording(!isRecording)}
                  className={`p-3 rounded-full transition-all transform hover:scale-110 ${
                    isRecording 
                      ? 'bg-red-500 text-white animate-pulse' 
                      : 'bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:shadow-lg'
                  }`}
                >
                  {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                </button>

                {/* Send Button */}
                <button
                  onClick={sendMessage}
                  disabled={!newMessage.trim() && selectedFiles.length === 0}
                  className="p-3 bg-gradient-to-r from-red-500 to-yellow-500 text-white rounded-full hover:shadow-lg transition-all transform hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>

              {/* Quick Actions */}
              <div className="mt-3 flex flex-wrap gap-2">
                <button
                  onClick={() => handleQuickReply("Où est ma commande ?")}
                  className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full hover:bg-green-200 transition-colors"
                >
                  📍 Suivi commande
                </button>
                <button
                  onClick={() => handleQuickReply("Problème de paiement")}
                  className="px-3 py-1 bg-yellow-100 text-yellow-800 text-sm rounded-full hover:bg-yellow-200 transition-colors"
                >
                  💳 Paiement
                </button>
                <button
                  onClick={() => handleQuickReply("Parler à un agent")}
                  className="px-3 py-1 bg-red-100 text-red-800 text-sm rounded-full hover:bg-red-200 transition-colors"
                >
                  👤 Agent humain
                </button>
              </div>
            </div>
          </div>

          {/* Support Categories */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-green-500 hover:shadow-xl transition-all transform hover:-translate-y-1">
              <div className="flex items-center space-x-3 mb-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Clock className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="font-bold text-gray-800">Suivi Livraison</h3>
              </div>
              <p className="text-sm text-gray-600">Questions sur vos commandes et délais de livraison</p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-yellow-500 hover:shadow-xl transition-all transform hover:-translate-y-1">
              <div className="flex items-center space-x-3 mb-3">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <AlertCircle className="w-6 h-6 text-yellow-600" />
                </div>
                <h3 className="font-bold text-gray-800">Problèmes Techniques</h3>
              </div>
              <p className="text-sm text-gray-600">Assistance pour l'utilisation de l'application</p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-red-500 hover:shadow-xl transition-all transform hover:-translate-y-1">
              <div className="flex items-center space-x-3 mb-3">
                <div className="p-2 bg-red-100 rounded-lg">
                  <CheckCircle className="w-6 h-6 text-red-600" />
                </div>
                <h3 className="font-bold text-gray-800">Satisfaction Client</h3>
              </div>
              <p className="text-sm text-gray-600">Retours et suggestions d'amélioration</p>
            </div>
          </div>
        </div>

        {/* Rating Modal */}
        {showRating && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl p-6 max-w-md w-full">
              <h3 className="text-xl font-bold text-center mb-4">Évaluez notre support</h3>
              <p className="text-gray-600 text-center mb-6">Comment était votre expérience avec notre équipe support ?</p>
              
              <div className="flex justify-center space-x-2 mb-6">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setRating(star)}
                    className={`p-2 transition-all transform hover:scale-110 ${
                      star <= rating ? 'text-yellow-500' : 'text-gray-300'
                    }`}
                  >
                    <Star className="w-8 h-8 fill-current" />
                  </button>
                ))}
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => setShowRating(false)}
                  className="flex-1 py-3 px-4 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Plus tard
                </button>
                <button
                  onClick={() => {
                    setShowRating(false);
                    // Handle rating submission
                  }}
                  className="flex-1 py-3 px-4 bg-gradient-to-r from-green-500 to-yellow-500 text-white rounded-xl hover:shadow-lg transition-all"
                >
                  Envoyer
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      </>
    //</ClientsLayout>
  );
};

export default ClientsChatSupport;