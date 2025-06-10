import React, { useState, useEffect, useMemo } from 'react';
import SupportAgentLayout from "@/layouts/agent_support_layout.jsx";
import { 
  Search, 
  BookOpen, 
  HelpCircle, 
  Star, 
  Clock, 
  Filter,
  ChevronDown,
  ChevronRight,
  Lightbulb,
  Tag,
  Users,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  FileText,
  MessageSquare,
  Phone,
  Mail,
  ArrowRight,
  Bookmark,
  ThumbsUp,
  Eye,
  RefreshCw
} from 'lucide-react';

const SupportKnowledge = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [expandedItems, setExpandedItems] = useState(new Set());
  const [selectedTags, setSelectedTags] = useState([]);
  const [viewMode, setViewMode] = useState('faq'); // 'faq' or 'procedures'

  // Données FAQ dynamiques
  const faqData = [
    {
      id: 1,
      question: "Comment gérer les retards de livraison ?",
      answer: "1. Contacter immédiatement le livreur pour connaître sa position\n2. Informer le client du retard avec un nouveau délai\n3. Proposer une compensation (réduction, livraison gratuite)\n4. Suivre en temps réel jusqu'à la livraison",
      category: "livraison",
      tags: ["retard", "livreur", "client", "compensation"],
      priority: "high",
      views: 245,
      helpful: 89,
      lastUpdated: "2025-06-08"
    },
    {
      id: 2,
      question: "Procédure de remboursement client",
      answer: "1. Vérifier la validité de la demande\n2. Consulter les conditions de remboursement\n3. Traiter via le système de paiement\n4. Confirmer par email/SMS au client\n5. Mettre à jour le dossier client",
      category: "paiement",
      tags: ["remboursement", "paiement", "client", "validation"],
      priority: "high",
      views: 178,
      helpful: 76,
      lastUpdated: "2025-06-05"
    },
    {
      id: 3,
      question: "Gestion des restaurants inactifs",
      answer: "1. Vérifier les dernières activités du restaurant\n2. Contacter le gestionnaire par téléphone\n3. Proposer de l'aide technique si nécessaire\n4. Mettre en statut 'temporairement fermé' si pas de réponse\n5. Planifier un suivi dans 24h",
      category: "restaurant",
      tags: ["restaurant", "inactif", "contact", "statut"],
      priority: "medium",
      views: 132,
      helpful: 65,
      lastUpdated: "2025-06-07"
    },
    {
      id: 4,
      question: "Problèmes de paiement Mobile Money",
      answer: "1. Vérifier le solde du client\n2. Contrôler le statut du réseau (MTN/Orange)\n3. Demander une capture d'écran de l'erreur\n4. Réessayer la transaction\n5. Escalader vers l'équipe technique si échec",
      category: "paiement",
      tags: ["mobile-money", "mtn", "orange", "technique"],
      priority: "high",
      views: 298,
      helpful: 112,
      lastUpdated: "2025-06-09"
    },
    {
      id: 5,
      question: "Litige entre client et restaurant",
      answer: "1. Écouter les deux parties séparément\n2. Analyser les preuves (photos, commande)\n3. Appliquer la politique de résolution\n4. Proposer une solution équitable\n5. Documenter la résolution pour futur référence",
      category: "litige",
      tags: ["litige", "client", "restaurant", "résolution"],
      priority: "high",
      views: 189,
      helpful: 94,
      lastUpdated: "2025-06-06"
    }
  ];

  // Procédures internes
  const procedures = [
    {
      id: 'p1',
      title: "Escalade vers l'équipe technique",
      steps: [
        "Identifier le type de problème technique",
        "Collecter les informations nécessaires (logs, captures)",
        "Créer un ticket prioritaire dans le système",
        "Informer le client du délai de résolution",
        "Suivre jusqu'à résolution complète"
      ],
      category: "technique",
      estimatedTime: "15-30 min"
    },
    {
      id: 'p2',
      title: "Validation d'un nouveau restaurant",
      steps: [
        "Vérifier les documents légaux",
        "Contrôler l'adresse et coordonnées",
        "Valider les informations bancaires",
        "Tester la qualité des photos de menu",
        "Activer le compte après validation complète"
      ],
      category: "restaurant",
      estimatedTime: "30-45 min"
    },
    {
      id: 'p3',
      title: "Gestion des pics d'activité",
      steps: [
        "Surveiller les métriques en temps réel",
        "Activer le mode 'haute demande'",
        "Prioriser les tickets urgents",
        "Communiquer les délais aux clients",
        "Coordonner avec l'équipe de livraison"
      ],
      category: "operations",
      estimatedTime: "En continu"
    }
  ];

  // Catégories avec couleurs Cameroun
  const categories = [
    { id: 'all', name: 'Toutes', color: 'bg-green-500', count: faqData.length },
    { id: 'livraison', name: 'Livraison', color: 'bg-red-500', count: faqData.filter(f => f.category === 'livraison').length },
    { id: 'paiement', name: 'Paiement', color: 'bg-yellow-500', count: faqData.filter(f => f.category === 'paiement').length },
    { id: 'restaurant', name: 'Restaurant', color: 'bg-green-600', count: faqData.filter(f => f.category === 'restaurant').length },
    { id: 'litige', name: 'Litiges', color: 'bg-red-600', count: faqData.filter(f => f.category === 'litige').length }
  ];

  // Tags populaires
  const popularTags = ['retard', 'paiement', 'client', 'livreur', 'restaurant', 'technique', 'mobile-money'];

  // Filtrage et recherche
  const filteredFAQ = useMemo(() => {
    let filtered = faqData;

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(item => item.category === selectedCategory);
    }

    if (searchTerm) {
      filtered = filtered.filter(item => 
        item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (selectedTags.length > 0) {
      filtered = filtered.filter(item => 
        selectedTags.some(tag => item.tags.includes(tag))
      );
    }

    return filtered.sort((a, b) => {
      if (a.priority === 'high' && b.priority !== 'high') return -1;
      if (b.priority === 'high' && a.priority !== 'high') return 1;
      return b.views - a.views;
    });
  }, [searchTerm, selectedCategory, selectedTags]);

  // Suggestions automatiques basées sur les tags
  const getSuggestions = (tags) => {
    const suggestions = [];
    if (tags.includes('retard')) {
      suggestions.push("Considérer une compensation pour le client");
    }
    if (tags.includes('paiement')) {
      suggestions.push("Vérifier le statut du service de paiement");
    }
    if (tags.includes('technique')) {
      suggestions.push("Escalader vers l'équipe technique");
    }
    return suggestions;
  };

  const toggleExpand = (id) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedItems(newExpanded);
  };

  const toggleTag = (tag) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  return (
    <SupportAgentLayout>
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-yellow-50 to-red-50 p-3 sm:p-6">
        {/* Header avec animation 3D */}
        <div className="mb-6 sm:mb-8">
          <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-6 border-l-4 border-green-500">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
              <div className="flex items-center space-x-3 sm:space-x-4">
                <div className="relative">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 rounded-full flex items-center justify-center transform hover:scale-110 transition-all duration-300">
                    <BookOpen className="w-6 h-6 sm:w-8 sm:h-8 text-white animate-pulse" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-5 h-5 sm:w-6 sm:h-6 bg-red-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">{faqData.length}</span>
                  </div>
                </div>
                <div>
                  <h1 className="text-xl sm:text-3xl font-bold text-gray-800 mb-1 sm:mb-2">Base de Connaissances</h1>
                  <p className="text-sm sm:text-base text-gray-600">Solutions rapides et procédures standardisées</p>
                </div>
              </div>
              
              {/* Mode Toggle */}
              <div className="flex bg-gray-100 rounded-lg p-1 w-full sm:w-auto">
                <button
                  onClick={() => setViewMode('faq')}
                  className={`flex-1 sm:flex-none px-3 sm:px-4 py-2 rounded-md transition-all duration-300 text-sm ${
                    viewMode === 'faq' 
                      ? 'bg-green-500 text-white shadow-md' 
                      : 'text-gray-600 hover:text-green-500'
                  }`}
                >
                  <HelpCircle className="w-4 h-4 inline-block mr-1 sm:mr-2" />
                  FAQ
                </button>
                <button
                  onClick={() => setViewMode('procedures')}
                  className={`flex-1 sm:flex-none px-3 sm:px-4 py-2 rounded-md transition-all duration-300 text-sm ${
                    viewMode === 'procedures' 
                      ? 'bg-red-500 text-white shadow-md' 
                      : 'text-gray-600 hover:text-red-500'
                  }`}
                >
                  <FileText className="w-4 h-4 inline-block mr-1 sm:mr-2" />
                  Procédures
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Barre de recherche et filtres */}
        <div className="mb-4 sm:mb-6 space-y-4">
          <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
              <input
                type="text"
                placeholder="Rechercher dans la base de connaissances..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 sm:pl-10 pr-4 py-2 sm:py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-300 text-sm sm:text-base"
              />
            </div>
          </div>

          {/* Catégories */}
          <div className="flex flex-wrap gap-2 sm:gap-3">
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border-2 transition-all duration-300 transform hover:scale-105 text-xs sm:text-sm ${
                  selectedCategory === category.id
                    ? `${category.color} text-white border-transparent shadow-lg`
                    : 'bg-white text-gray-700 border-gray-200 hover:border-green-300'
                }`}
              >
                <span className="hidden sm:inline">{category.name}</span>
                <span className="sm:hidden">{category.name.substring(0, 3)}</span>
                <span className="ml-1">({category.count})</span>
              </button>
            ))}
          </div>

          {/* Tags populaires */}
          <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4">
            <h3 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3 flex items-center">
              <Tag className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-yellow-500" />
              Tags Populaires
            </h3>
            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              {popularTags.map(tag => (
                <button
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm transition-all duration-300 ${
                    selectedTags.includes(tag)
                      ? 'bg-yellow-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-yellow-100'
                  }`}
                >
                  #{tag}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Contenu principal */}
        {viewMode === 'faq' ? (
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6">
            {/* Liste FAQ */}
            <div className="xl:col-span-2 space-y-3 sm:space-y-4">
              {filteredFAQ.map(item => (
                <div key={item.id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
                  <div
                    className="p-4 sm:p-6 cursor-pointer"
                    onClick={() => toggleExpand(item.id)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center mb-2">
                          <div className={`w-2 h-2 rounded-full mr-2 sm:mr-3 flex-shrink-0 ${
                            item.priority === 'high' ? 'bg-red-500' : 'bg-yellow-500'
                          } animate-pulse`}></div>
                          <h3 className="text-base sm:text-lg font-semibold text-gray-800 pr-2">{item.question}</h3>
                        </div>
                        
                        <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-500 mb-2 sm:mb-3">
                          <span className="flex items-center">
                            <Eye className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                            {item.views} vues
                          </span>
                          <span className="flex items-center">
                            <ThumbsUp className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                            {item.helpful} utile
                          </span>
                          <span className="flex items-center">
                            <Clock className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                            <span className="hidden sm:inline">{item.lastUpdated}</span>
                            <span className="sm:hidden">{item.lastUpdated.split('-').reverse().join('/')}</span>
                          </span>
                        </div>

                        <div className="flex flex-wrap gap-1 sm:gap-2 mb-2 sm:mb-3">
                          {item.tags.map(tag => (
                            <span key={tag} className="px-2 py-0.5 sm:py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                              #{tag}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      <div className="ml-2 sm:ml-4 flex-shrink-0">
                        {expandedItems.has(item.id) ? (
                          <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                        ) : (
                          <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                        )}
                      </div>
                    </div>

                    {expandedItems.has(item.id) && (
                      <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-200 animate-in slide-in-from-top-2 duration-500">
                        <div className="bg-gray-50 rounded-lg p-3 sm:p-4 mb-3 sm:mb-4">
                          <pre className="whitespace-pre-wrap text-gray-700 font-medium text-sm sm:text-base">
                            {item.answer}
                          </pre>
                        </div>

                        {/* Suggestions automatiques */}
                        {getSuggestions(item.tags).length > 0 && (
                          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 sm:p-4 rounded-r-lg mb-3 sm:mb-4">
                            <div className="flex items-start">
                              <Lightbulb className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500 mr-2 mt-0.5 flex-shrink-0" />
                              <div className="min-w-0">
                                <h4 className="font-semibold text-yellow-800 mb-2 text-sm sm:text-base">Suggestions automatiques :</h4>
                                <ul className="list-disc list-inside space-y-1 text-yellow-700 text-sm">
                                  {getSuggestions(item.tags).map((suggestion, index) => (
                                    <li key={index}>{suggestion}</li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          </div>
                        )}

                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0">
                          <div className="flex flex-wrap gap-2">
                            <button className="px-2 sm:px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs sm:text-sm hover:bg-green-200 transition-colors">
                              <ThumbsUp className="w-3 h-3 inline-block mr-1" />
                              Utile
                            </button>
                            <button className="px-2 sm:px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs sm:text-sm hover:bg-blue-200 transition-colors">
                              <Bookmark className="w-3 h-3 inline-block mr-1" />
                              Sauvegarder
                            </button>
                          </div>
                          <button className="text-red-500 hover:text-red-700 text-xs sm:text-sm">
                            <RefreshCw className="w-3 h-3 sm:w-4 sm:h-4 inline-block mr-1" />
                            Signaler une erreur
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {filteredFAQ.length === 0 && (
                <div className="text-center py-8 sm:py-12">
                  <HelpCircle className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-500 mb-2">Aucun résultat trouvé</h3>
                  <p className="text-sm sm:text-base text-gray-400">Essayez de modifier vos critères de recherche</p>
                </div>
              )}
            </div>

            {/* Sidebar avec statistiques */}
            <div className="space-y-4 sm:space-y-6">
              {/* Statistiques du jour */}
              <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
                <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 flex items-center">
                  <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-green-500" />
                  Statistiques du jour
                </h3>
                <div className="space-y-3 sm:space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm sm:text-base text-gray-600">Consultations FAQ</span>
                    <span className="font-bold text-green-600">247</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm sm:text-base text-gray-600">Tickets résolus</span>
                    <span className="font-bold text-blue-600">156</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm sm:text-base text-gray-600">Temps moyen</span>
                    <span className="font-bold text-yellow-600">12 min</span>
                  </div>
                </div>
              </div>

              {/* FAQ les plus consultées */}
              <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
                <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 flex items-center">
                  <Star className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-yellow-500" />
                  Top FAQ
                </h3>
                <div className="space-y-2 sm:space-y-3">
                  {faqData.slice(0, 3).map((item, index) => (
                    <div key={item.id} className="flex items-start space-x-2 sm:space-x-3 p-2 sm:p-3 rounded-lg hover:bg-gray-50 transition-colors">
                      <div className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0 ${
                        index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : 'bg-yellow-600'
                      }`}>
                        {index + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-xs sm:text-sm text-gray-800 mb-1 line-clamp-2">{item.question}</p>
                        <p className="text-xs text-gray-500">{item.views} vues</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions rapides */}
              <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
                <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 flex items-center">
                  <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-red-500" />
                  Actions Rapides
                </h3>
                <div className="space-y-2 sm:space-y-3">
                  <button className="w-full bg-green-500 text-white py-2 px-3 sm:px-4 rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center text-sm">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Nouveau Ticket
                  </button>
                  <button className="w-full bg-blue-500 text-white py-2 px-3 sm:px-4 rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center text-sm">
                    <Phone className="w-4 h-4 mr-2" />
                    Appel d'Urgence
                  </button>
                  <button className="w-full bg-yellow-500 text-white py-2 px-3 sm:px-4 rounded-lg hover:bg-yellow-600 transition-colors flex items-center justify-center text-sm">
                    <Mail className="w-4 h-4 mr-2" />
                    Email Équipe
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Vue Procédures */
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {procedures.map(procedure => (
              <div key={procedure.id} className="bg-white rounded-xl shadow-lg p-4 sm:p-6 hover:shadow-xl transition-all duration-300">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-3 sm:mb-4 space-y-2 sm:space-y-0">
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-800 pr-2">{procedure.title}</h3>
                  <span className="px-2 sm:px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs sm:text-sm flex-shrink-0">
                    {procedure.estimatedTime}
                  </span>
                </div>
                
                <div className="space-y-2 sm:space-y-3">
                  {procedure.steps.map((step, index) => (
                    <div key={index} className="flex items-start space-x-2 sm:space-x-3">
                      <div className="w-5 h-5 sm:w-6 sm:h-6 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                        {index + 1}
                      </div>
                      <p className="text-sm sm:text-base text-gray-700 flex-1">{step}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-gray-200">
                  <button className="w-full bg-gradient-to-r from-green-500 to-blue-500 text-white py-2 px-3 sm:px-4 rounded-lg hover:from-green-600 hover:to-blue-600 transition-all duration-300 flex items-center justify-center text-sm">
                    Appliquer cette procédure
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </SupportAgentLayout>
  );
};

export default SupportKnowledge;