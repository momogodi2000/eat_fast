import React, { useState, useEffect } from 'react';
import { 
  MapPin, 
  Clock, 
  Package, 
  CheckCircle, 
  XCircle, 
  Navigation, 
  TrendingUp, 
  Users, 
  DollarSign,
  Filter,
  Search,
  MoreVertical,
  Phone,
  MessageSquare,
  Star,
  AlertCircle,
  Zap,
  Target,
  Calendar,
  Activity,
  Globe,
  Wifi,
  WifiOff,
  RefreshCw,
  Bell,
  Award,
  Timer,
  CreditCard,
  User,
  Home,
  ShoppingBag,
  ArrowRight,
  Eye,
  TrendingDown,
  Flame,
  Shield,
  Route,
  Compass
} from 'lucide-react';

/**
 * Page de Gestion des Missions EatFast
 * Interface complète pour les livreurs à Yaoundé
 * Optimisée pour mobile et desktop avec support PWA
 */
const MissionsPage = () => {
  // Gestion des états
  const [activeTab, setActiveTab] = useState('available');
  const [missions, setMissions] = useState([]);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isOffline, setIsOffline] = useState(false);
  const [showStats, setShowStats] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);

  // Statistiques du livreur
  const [driverStats, setDriverStats] = useState({
    todayEarnings: 18750,
    completedMissions: 14,
    rating: 4.9,
    efficiency: 97,
    totalDistance: 89.3,
    activeHours: 7.5,
    acceptanceRate: 94,
    averageDeliveryTime: 22
  });

  // Données de missions pour Yaoundé
  const sampleMissions = [
    {
      id: 'LIV-YDE-001',
      type: 'delivery',
      status: 'available',
      restaurant: {
        name: 'Restaurant Le Palais Royal',
        address: 'Avenue Kennedy, Centre-ville, Yaoundé',
        phone: '+237 670 123 456',
        rating: 4.8,
        preparationTime: 12
      },
      customer: {
        name: 'Marie Nsangou',
        phone: '+237 698 234 567',
        address: 'Quartier Mvog-Ada, près du Rond-point Express',
        landmark: 'Immeuble bleu à côté de la Pharmacie du Peuple',
        floor: '2ème étage, porte rouge',
        customerNote: 'Appeler en arrivant, sonnette ne fonctionne pas'
      },
      pickupAddress: 'Avenue Kennedy, Centre-ville, Yaoundé',
      deliveryAddress: 'Quartier Mvog-Ada, près du Rond-point Express, Yaoundé',
      distance: 4.2,
      estimatedTime: 28,
      payment: 3500,
      deliveryFee: 800,
      bonus: 600,
      priority: 'high',
      urgency: 'standard',
      orderItems: [
        { name: 'Ndolé complet avec poisson fumé', quantity: 2, price: 4500, category: 'plat principal' },
        { name: 'Plantain sauté aux crevettes', quantity: 1, price: 2800, category: 'accompagnement' },
        { name: 'Jus de gingembre frais', quantity: 2, price: 800, category: 'boisson' }
      ],
      paymentMethod: 'mobile_money',
      totalOrderValue: 12900,
      createdAt: new Date(Date.now() - 12 * 60000),
      estimatedPickupTime: new Date(Date.now() + 8 * 60000),
      coordinates: { 
        pickup: [3.848, 11.502], 
        delivery: [3.858, 11.512] 
      },
      weatherCondition: 'ensoleillé',
      trafficLevel: 'modéré'
    },
    {
      id: 'LIV-YDE-002',
      type: 'delivery',
      status: 'in_progress',
      restaurant: {
        name: 'Chez Tantine Moderne',
        address: 'Marché Central, Yaoundé',
        phone: '+237 677 345 678',
        rating: 4.6,
        preparationTime: 15
      },
      customer: {
        name: 'Paul Ebolo',
        phone: '+237 699 876 543',
        address: 'Quartier Bastos, Rue des Ambassades',
        landmark: 'Villa avec portail vert, numéro 45',
        floor: 'Rez-de-chaussée',
        customerNote: 'Livraison au bureau, demander Monsieur Paul'
      },
      pickupAddress: 'Marché Central, Yaoundé',
      deliveryAddress: 'Quartier Bastos, Rue des Ambassades, Yaoundé',
      distance: 5.8,
      estimatedTime: 18,
      payment: 4200,
      deliveryFee: 1000,
      bonus: 400,
      priority: 'medium',
      urgency: 'urgent',
      orderItems: [
        { name: 'Poulet DG authentique', quantity: 1, price: 5500, category: 'plat principal' },
        { name: 'Riz safran aux légumes', quantity: 1, price: 2200, category: 'accompagnement' },
        { name: 'Bissap glacé artisanal', quantity: 2, price: 1200, category: 'boisson' }
      ],
      paymentMethod: 'cash',
      totalOrderValue: 13100,
      pickedUpAt: new Date(Date.now() - 8 * 60000),
      estimatedDeliveryTime: new Date(Date.now() + 10 * 60000),
      coordinates: { 
        pickup: [3.848, 11.502], 
        delivery: [3.878, 11.522] 
      },
      weatherCondition: 'nuageux',
      trafficLevel: 'dense'
    },
    {
      id: 'LIV-YDE-003',
      type: 'batch',
      status: 'available',
      restaurant: {
        name: 'Saveurs du Nord',
        address: 'Carrefour Warda, Yaoundé',
        phone: '+237 681 456 789',
        rating: 4.7,
        preparationTime: 20
      },
      customers: [
        {
          name: 'Fatima Oumarou',
          phone: '+237 690 234 567',
          address: 'Quartier Essos, près de l\'École Publique',
          landmark: 'Maison jaune avec jardin fleuri',
          customerNote: 'Sonner deux fois, chien gentil dans la cour'
        },
        {
          name: 'Jean Mballa',
          phone: '+237 695 678 901',
          address: 'Quartier Melen, Avenue de l\'Unité',
          landmark: 'Près de la station-service Total',
          customerNote: 'Appeler avant d\'arriver'
        }
      ],
      batchCount: 2,
      totalDistance: 7.3,
      estimatedTime: 45,
      payment: 6800,
      deliveryFee: 1400,
      bonus: 1200,
      priority: 'high',
      urgency: 'standard',
      paymentMethod: 'mixed',
      totalOrderValue: 18600,
      createdAt: new Date(Date.now() - 5 * 60000),
      coordinates: { 
        pickup: [3.848, 11.502], 
        delivery: [3.838, 11.492] 
      },
      weatherCondition: 'pluvieux',
      trafficLevel: 'fluide'
    },
    {
      id: 'LIV-YDE-004',
      type: 'delivery',
      status: 'completed',
      restaurant: {
        name: 'Fast Food Elite',
        address: 'Carrefour Nlongkak, Yaoundé',
        phone: '+237 671 234 890',
        rating: 4.5,
        preparationTime: 8
      },
      customer: {
        name: 'Christine Nga',
        phone: '+237 697 345 678',
        address: 'Quartier Omnisport, Yaoundé',
        landmark: 'Immeuble face au stade',
        customerNote: 'Appartement 3B au 3ème étage'
      },
      distance: 3.1,
      payment: 2800,
      deliveryFee: 600,
      bonus: 300,
      priority: 'medium',
      completedAt: new Date(Date.now() - 45 * 60000),
      rating: 5,
      tip: 500,
      coordinates: { 
        pickup: [3.848, 11.502], 
        delivery: [3.828, 11.482] 
      }
    }
  ];

  // Zones de forte demande à Yaoundé
  const heatmapZones = [
    { 
      name: 'Centre-ville', 
      demand: 95, 
      coordinates: [3.848, 11.502],
      averageWait: 8,
      activeMissions: 12,
      earnings: 'Élevé'
    },
    { 
      name: 'Bastos', 
      demand: 89, 
      coordinates: [3.878, 11.522],
      averageWait: 12,
      activeMissions: 8,
      earnings: 'Très élevé'
    },
    { 
      name: 'Mvog-Ada', 
      demand: 82, 
      coordinates: [3.858, 11.512],
      averageWait: 15,
      activeMissions: 6,
      earnings: 'Élevé'
    },
    { 
      name: 'Essos', 
      demand: 76, 
      coordinates: [3.838, 11.492],
      averageWait: 18,
      activeMissions: 4,
      earnings: 'Moyen'
    },
    { 
      name: 'Melen', 
      demand: 71, 
      coordinates: [3.818, 11.472],
      averageWait: 22,
      activeMissions: 3,
      earnings: 'Moyen'
    },
    { 
      name: 'Nlongkak', 
      demand: 68, 
      coordinates: [3.828, 11.482],
      averageWait: 25,
      activeMissions: 2,
      earnings: 'Correct'
    }
  ];

  // Initialisation
  useEffect(() => {
    setMissions(sampleMissions);
    
    // Vérification du statut en ligne
    const handleOnlineStatus = () => setIsOffline(!navigator.onLine);
    window.addEventListener('online', handleOnlineStatus);
    window.addEventListener('offline', handleOnlineStatus);
    
    // Actualisation automatique des temps
    const timeUpdateInterval = setInterval(() => {
      if (autoRefresh) {
        setMissions(prev => prev.map(mission => ({
          ...mission,
          estimatedTime: Math.max(1, mission.estimatedTime - 1)
        })));
      }
    }, 60000);

    return () => {
      window.removeEventListener('online', handleOnlineStatus);
      window.removeEventListener('offline', handleOnlineStatus);
      clearInterval(timeUpdateInterval);
    };
  }, [autoRefresh]);

  // Filtrage des missions
  const filteredMissions = missions.filter(mission => {
    const matchesTab = activeTab === 'all' || mission.status === activeTab || 
                       (activeTab === 'available' && mission.status === 'available') ||
                       (activeTab === 'active' && mission.status === 'in_progress') ||
                       (activeTab === 'completed' && mission.status === 'completed');
    const matchesFilter = filterStatus === 'all' || mission.priority === filterStatus;
    const matchesSearch = mission.restaurant?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         mission.customer?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         mission.customers?.[0]?.name?.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesTab && matchesFilter && matchesSearch;
  });

  // Actions sur les missions
  const handleAcceptMission = async (missionId) => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      setMissions(prev => prev.map(mission => 
        mission.id === missionId 
          ? { ...mission, status: 'in_progress', acceptedAt: new Date() }
          : mission
      ));

      // Animation de succès
      showSuccessAnimation('🎉 Mission acceptée! Bonne livraison!');
    } catch (error) {
      console.error('Erreur lors de l\'acceptation:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRejectMission = (missionId) => {
    setMissions(prev => prev.filter(mission => mission.id !== missionId));
    showSuccessAnimation('❌ Mission refusée');
  };

  const handleCompleteMission = async (missionId) => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mission = missions.find(m => m.id === missionId);
      const earnings = mission ? mission.payment + mission.deliveryFee + mission.bonus : 0;
      
      setMissions(prev => prev.map(mission => 
        mission.id === missionId 
          ? { ...mission, status: 'completed', completedAt: new Date(), rating: 5 }
          : mission
      ));
      
      setDriverStats(prev => ({
        ...prev,
        completedMissions: prev.completedMissions + 1,
        todayEarnings: prev.todayEarnings + earnings
      }));

      showSuccessAnimation(`✅ Mission terminée! +${earnings.toLocaleString()} FCFA`);
    } catch (error) {
      console.error('Erreur lors de la completion:', error);
    } finally {
      setLoading(false);
    }
  };

  const showSuccessAnimation = (message) => {
    const successDiv = document.createElement('div');
    successDiv.className = 'fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-green-500 to-green-600 text-white px-8 py-6 rounded-2xl shadow-2xl z-50 slide-up font-bold text-center';
    successDiv.innerHTML = message;
    document.body.appendChild(successDiv);
    
    setTimeout(() => {
      if (document.body.contains(successDiv)) {
        document.body.removeChild(successDiv);
      }
    }, 3500);
  };

  const refreshMissions = () => {
    setLoading(true);
    setTimeout(() => {
      setMissions([...sampleMissions]);
      setLoading(false);
      showSuccessAnimation('🔄 Missions actualisées');
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="space-y-6">
          {/* En-tête avec style moderne */}
          <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-3xl p-6 text-white shadow-2xl">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-2">
                  <div className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl">
                    <ShoppingBag size={32} />
                  </div>
                  <div>
                    <h1 className="text-3xl lg:text-4xl font-bold">
                      Missions EatFast
                    </h1>
                    <p className="text-blue-100 mt-1">
                      📍 Yaoundé, Cameroun • Optimisez vos revenus
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Actions rapides */}
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => setShowHeatmap(!showHeatmap)}
                  className={`px-4 py-3 rounded-xl flex items-center gap-2 transition-all duration-300 font-semibold ${
                    showHeatmap 
                      ? 'bg-white text-blue-600 shadow-lg scale-105' 
                      : 'bg-white/20 hover:bg-white/30 backdrop-blur-sm'
                  }`}
                >
                  <Globe size={20} />
                  <span className="hidden sm:inline">Zones Chaudes</span>
                </button>
                
                <button 
                  onClick={refreshMissions}
                  className="px-4 py-3 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-xl flex items-center gap-2 transition-all duration-300 font-semibold hover:scale-105"
                >
                  <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
                  <span className="hidden sm:inline">Actualiser</span>
                </button>

                <button className="px-4 py-3 bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white rounded-xl flex items-center gap-2 transition-all duration-300 font-semibold hover:scale-105 shadow-lg">
                  <Zap size={20} />
                  <span className="hidden sm:inline">Mode Boost</span>
                </button>
              </div>
            </div>
          </div>

          {/* Statistiques améliorées */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatsCard 
              icon={<DollarSign size={24} className="text-green-500" />}
              title="Gains Aujourd'hui"
              value={`${driverStats.todayEarnings.toLocaleString()} FCFA`}
              trend="+18%"
              trendColor="text-green-500"
              subtitle="Objectif: 25 000 FCFA"
              bgGradient="from-green-50 to-emerald-50"
            />
            <StatsCard 
              icon={<Package size={24} className="text-blue-500" />}
              title="Missions Terminées"
              value={driverStats.completedMissions}
              trend="+5"
              trendColor="text-blue-500"
              subtitle={`${driverStats.averageDeliveryTime} min moy./mission`}
              bgGradient="from-blue-50 to-indigo-50"
            />
            <StatsCard 
              icon={<Star size={24} className="text-yellow-500" />}
              title="Note Client"
              value={driverStats.rating}
              trend="+0.3"
              trendColor="text-yellow-500"
              subtitle={`${driverStats.acceptanceRate}% d'acceptation`}
              bgGradient="from-yellow-50 to-amber-50"
            />
            <StatsCard 
              icon={<Activity size={24} className="text-purple-500" />}
              title="Efficacité"
              value={`${driverStats.efficiency}%`}
              trend="+8%"
              trendColor="text-purple-500"
              subtitle={`${driverStats.totalDistance} km parcourus`}
              bgGradient="from-purple-50 to-pink-50"
            />
          </div>

          {/* Zones de forte demande */}
          {showHeatmap && (
            <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-xl border border-gray-200 dark:border-gray-700">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-r from-red-500 to-orange-500 rounded-xl text-white">
                      <Flame size={24} />
                    </div>
                    Zones de Forte Demande
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mt-1">
                    🕐 Données en temps réel • Dernière mise à jour: maintenant
                  </p>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-gray-600 dark:text-gray-400">Mise à jour automatique</span>
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {heatmapZones.map((zone, index) => (
                  <div 
                    key={index}
                    className="relative p-5 rounded-2xl border-2 transition-all duration-300 hover:scale-[1.02] cursor-pointer group overflow-hidden"
                    style={{
                      borderColor: zone.demand > 85 ? '#ef4444' : zone.demand > 70 ? '#f59e0b' : '#10b981',
                      background: `linear-gradient(135deg, ${
                        zone.demand > 85 ? '#fee2e2' : zone.demand > 70 ? '#fef3c7' : '#d1fae5'
                      }, ${
                        zone.demand > 85 ? '#fecaca' : zone.demand > 70 ? '#fde68a' : '#a7f3d0'
                      })`
                    }}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-lg font-bold text-gray-900">{zone.name}</h4>
                      <div className={`p-2 rounded-lg ${
                        zone.demand > 85 ? 'bg-red-500' : zone.demand > 70 ? 'bg-yellow-500' : 'bg-green-500'
                      }`}>
                        <Target size={18} className="text-white" />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-3xl font-bold text-gray-900">{zone.demand}%</span>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold text-white ${
                          zone.demand > 85 ? 'bg-red-500' : zone.demand > 70 ? 'bg-yellow-500' : 'bg-green-500'
                        }`}>
                          {zone.earnings}
                        </span>
                      </div>
                      
                      <div className="space-y-1 text-sm text-gray-700">
                        <div className="flex justify-between">
                          <span>⏱️ Attente moy.:</span>
                          <span className="font-semibold">{zone.averageWait} min</span>
                        </div>
                        <div className="flex justify-between">
                          <span>📦 Missions actives:</span>
                          <span className="font-semibold">{zone.activeMissions}</span>
                        </div>
                      </div>
                    </div>

                    {/* Effet de hover */}
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Filtres et recherche améliorés */}
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-xl border border-gray-200 dark:border-gray-700">
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Navigation par onglets */}
              <div className="flex bg-gray-100 dark:bg-gray-700 rounded-2xl p-1.5 overflow-x-auto">
                {[
                  { key: 'available', label: '🟢 Disponibles', count: missions.filter(m => m.status === 'available').length },
                  { key: 'active', label: '🔵 En Cours', count: missions.filter(m => m.status === 'in_progress').length },
                  { key: 'completed', label: '✅ Terminées', count: missions.filter(m => m.status === 'completed').length }
                ].map(tab => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center gap-3 whitespace-nowrap ${
                      activeTab === tab.key
                        ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-lg scale-105'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-gray-600/50'
                    }`}
                  >
                    {tab.label}
                    <span className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs px-2.5 py-1 rounded-full font-bold">
                      {tab.count}
                    </span>
                  </button>
                ))}
              </div>

              {/* Recherche et filtres */}
              <div className="flex flex-1 flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Rechercher par restaurant ou client..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  />
                </div>
                
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 font-medium"
                >
                  <option value="all">🎯 Toutes priorités</option>
                  <option value="high">🔴 Priorité élevée</option>
                  <option value="medium">🟡 Priorité moyenne</option>
                  <option value="low">🟢 Priorité basse</option>
                </select>
              </div>
            </div>
          </div>

          {/* File prédictive */}
          <div className="bg-gradient-to-br from-indigo-50 via-blue-50 to-cyan-50 dark:from-gray-800 dark:to-gray-900 rounded-3xl p-6 border-2 border-blue-200 dark:border-gray-700 shadow-xl">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl text-white shadow-lg">
                <TrendingUp size={28} />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                  File d'Attente Intelligente
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  IA prédictive • Missions à venir dans votre zone
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-6 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-2xl">
                <div className="text-4xl mb-3">🎯</div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  5 missions
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Prévues dans 30 min
                </div>
              </div>
              
              <div className="text-center p-6 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-2xl">
                <div className="text-4xl mb-3">💰</div>
                <div className="text-2xl font-bold text-green-600 mb-2">
                  8 500 FCFA
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Gains potentiels
                </div>
              </div>
              
              <div className="text-center p-6 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-2xl">
                <div className="text-4xl mb-3">📍</div>
                <div className="text-2xl font-bold text-blue-600 mb-2">
                  Centre-ville
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Zone recommandée
                </div>
              </div>
            </div>
          </div>

          {/* Liste des missions */}
          <div className="space-y-4">
            {filteredMissions.length === 0 ? (
              <div className="bg-white dark:bg-gray-800 rounded-3xl p-12 text-center shadow-xl border border-gray-200 dark:border-gray-700">
                <div className="text-6xl mb-4">📦</div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                  Aucune mission disponible
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  De nouvelles missions vont bientôt apparaître dans votre zone.
                  Restez connecté pour les recevoir en premier!
                </p>
                <button 
                  onClick={refreshMissions}
                  className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white rounded-xl font-semibold transition-all duration-300 hover:scale-105 shadow-lg"
                >
                  🔄 Actualiser les missions
                </button>
              </div>
            ) : (
              filteredMissions.map((mission) => (
                <MissionCard
                  key={mission.id}
                  mission={mission}
                  onAccept={handleAcceptMission}
                  onReject={handleRejectMission}
                  onComplete={handleCompleteMission}
                  loading={loading}
                />
              ))
            )}
          </div>
        </div>
      </div>

      {/* Indicateur de statut hors ligne */}
      {isOffline && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-3 rounded-full shadow-2xl flex items-center space-x-3 z-50 animate-bounce">
          <WifiOff size={20} />
          <span className="font-semibold">Mode Hors Ligne - PWA Actif</span>
        </div>
      )}

      {/* Badge de statut en ligne */}
      <div className="fixed top-4 right-4 z-40">
        <div className={`px-4 py-2 rounded-full text-sm font-bold transition-all duration-300 ${
          isOffline ? 'bg-red-500 text-white' : 'bg-green-500 text-white'
        }`}>
          {isOffline ? '🔴 Hors ligne' : '🟢 En ligne'}
        </div>
      </div>
    </div>
  );
};

// Composant de carte de statistiques amélioré
const StatsCard = ({ icon, title, value, trend, trendColor, subtitle, bgGradient }) => (
  <div className={`bg-gradient-to-br ${bgGradient} dark:from-gray-800 dark:to-gray-700 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-600 hover:shadow-xl transition-all duration-300 hover:scale-[1.02] group`}>
    <div className="flex items-center justify-between mb-4">
      <div className="p-3 bg-white dark:bg-gray-800 rounded-xl shadow-md group-hover:scale-110 transition-transform duration-300">
        {icon}
      </div>
      <div className={`text-sm font-bold px-3 py-1 rounded-full ${trendColor} bg-white dark:bg-gray-800`}>
        {trend}
      </div>
    </div>
    <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
      {value}
    </div>
    <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
      {title}
    </div>
    <div className="text-xs text-gray-500 dark:text-gray-500">
      {subtitle}
    </div>
  </div>
);

// Composant de carte de mission amélioré
const MissionCard = ({ mission, onAccept, onReject, onComplete, loading }) => {
  const [expanded, setExpanded] = useState(false);
  
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'border-red-400 bg-gradient-to-br from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20';
      case 'medium': return 'border-yellow-400 bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20';
      case 'low': return 'border-green-400 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20';
      default: return 'border-gray-300 dark:border-gray-600';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'available': return 'bg-gradient-to-r from-green-500 to-emerald-500 text-white';
      case 'in_progress': return 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white';
      case 'completed': return 'bg-gradient-to-r from-purple-500 to-pink-500 text-white';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'high': return '🔥';
      case 'medium': return '⚡';
      case 'low': return '📦';
      default: return '📋';
    }
  };

  const getPaymentIcon = (method) => {
    switch (method) {
      case 'mobile_money': return '📱';
      case 'cash': return '💵';
      case 'card': return '💳';
      case 'mixed': return '💰';
      default: return '💰';
    }
  };

  const getWeatherIcon = (condition) => {
    switch (condition) {
      case 'ensoleillé': return '☀️';
      case 'nuageux': return '☁️';
      case 'pluvieux': return '🌧️';
      default: return '🌤️';
    }
  };

  const getTrafficIcon = (level) => {
    switch (level) {
      case 'fluide': return '🟢';
      case 'modéré': return '🟡';
      case 'dense': return '🔴';
      default: return '⚪';
    }
  };

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-xl border-2 transition-all duration-300 hover:shadow-2xl hover:scale-[1.01] ${getPriorityColor(mission.priority)}`}>
      {/* En-tête de la mission */}
      <div className="flex flex-col lg:flex-row lg:items-start justify-between mb-6 gap-4">
        <div className="flex items-start gap-4">
          <div className="p-4 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl text-white shadow-lg">
            {mission.type === 'batch' ? <Users size={24} /> : <Package size={24} />}
          </div>
          
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                {mission.restaurant.name}
              </h3>
              <span className={`px-3 py-1 rounded-full text-sm font-bold ${getStatusColor(mission.status)}`}>
                {mission.status === 'available' ? 'Disponible' : 
                 mission.status === 'in_progress' ? 'En Cours' : 'Terminé'}
              </span>
              {mission.type === 'batch' && (
                <span className="px-3 py-1 rounded-full text-sm font-bold bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                  Lot de {mission.batchCount}
                </span>
              )}
              <span className="text-xl">{getPriorityIcon(mission.priority)}</span>
            </div>
            
            <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center gap-2">
                <MapPin size={16} />
                <span>📍 {mission.deliveryAddress || 'Livraisons multiples'}</span>
              </div>
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-1">
                  <Clock size={16} />
                  <span>⏱️ {mission.estimatedTime} min</span>
                </div>
                <div className="flex items-center gap-1">
                  <Route size={16} />
                  <span>📏 {mission.distance} km</span>
                </div>
                <div className="flex items-center gap-1">
                  <span>{getWeatherIcon(mission.weatherCondition)}</span>
                  <span>{mission.weatherCondition}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span>{getTrafficIcon(mission.trafficLevel)}</span>
                  <span>Trafic {mission.trafficLevel}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between lg:justify-end gap-4">
          <div className="text-right">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {(mission.payment + mission.deliveryFee + mission.bonus).toLocaleString()} FCFA
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {getPaymentIcon(mission.paymentMethod)} Base: {mission.payment.toLocaleString()}
            </div>
            <div className="text-sm text-green-600 dark:text-green-400">
              🚚 +{mission.deliveryFee} • 🎁 +{mission.bonus}
            </div>
          </div>
          
          <button
            onClick={() => setExpanded(!expanded)}
            className="p-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <Eye size={20} className="text-gray-400" />
          </button>
        </div>
      </div>

      {/* Détails étendus */}
      {expanded && (
        <div className="space-y-6 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          {/* Informations restaurant */}
          <div className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 p-4 rounded-2xl">
            <h4 className="font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
              🏪 Restaurant
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-gray-600 dark:text-gray-400">Adresse:</div>
                <div className="font-semibold">{mission.restaurant.address}</div>
              </div>
              <div>
                <div className="text-gray-600 dark:text-gray-400">Préparation:</div>
                <div className="font-semibold">⏱️ {mission.restaurant.preparationTime} min</div>
              </div>
              <div>
                <div className="text-gray-600 dark:text-gray-400">Note:</div>
                <div className="font-semibold">⭐ {mission.restaurant.rating}/5</div>
              </div>
              <div>
                <div className="text-gray-600 dark:text-gray-400">Téléphone:</div>
                <div className="font-semibold">{mission.restaurant.phone}</div>
              </div>
            </div>
          </div>

          {/* Informations client(s) */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-4 rounded-2xl">
            <h4 className="font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
              👤 Client{mission.type === 'batch' ? 's' : ''}
            </h4>
            
            {mission.customer ? (
              <div className="space-y-3">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                  <div>
                    <div className="font-bold text-lg">{mission.customer.name}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">{mission.customer.phone}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="p-2 bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-lg hover:bg-green-200 dark:hover:bg-green-900/40 transition-colors">
                      <Phone size={16} />
                    </button>
                    <button className="p-2 bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/40 transition-colors">
                      <MessageSquare size={16} />
                    </button>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-gray-600 dark:text-gray-400">Adresse:</div>
                    <div className="font-semibold">{mission.customer.address}</div>
                  </div>
                  <div>
                    <div className="text-gray-600 dark:text-gray-400">Point de repère:</div>
                    <div className="font-semibold">🎯 {mission.customer.landmark}</div>
                  </div>
                  <div className="md:col-span-2">
                    <div className="text-gray-600 dark:text-gray-400">Instructions:</div>
                    <div className="font-semibold bg-blue-100 dark:bg-blue-900/20 p-2 rounded-lg mt-1">
                      💬 {mission.customer.customerNote}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {mission.customers?.map((customer, index) => (
                  <div key={index} className="border border-gray-200 dark:border-gray-600 p-3 rounded-xl">
                    <div className="font-bold">{index + 1}. {customer.name}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">{customer.address}</div>
                    <div className="text-sm text-blue-600 dark:text-blue-400">💬 {customer.customerNote}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Articles commandés */}
          {mission.orderItems && (
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-4 rounded-2xl">
              <h4 className="font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                🛍️ Commande ({mission.orderItems.length} article{mission.orderItems.length > 1 ? 's' : ''})
              </h4>
              <div className="space-y-2">
                {mission.orderItems.map((item, index) => (
                  <div key={index} className="flex justify-between items-center p-2 bg-white dark:bg-gray-800 rounded-lg">
                    <div>
                      <span className="font-semibold">{item.quantity}x {item.name}</span>
                      <span className="text-xs text-gray-500 ml-2 px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-full">
                        {item.category}
                      </span>
                    </div>
                    <span className="font-bold text-green-600">
                      {item.price.toLocaleString()} FCFA
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                <div className="flex justify-between items-center font-bold text-lg">
                  <span>Total commande:</span>
                  <span className="text-green-600">{mission.totalOrderValue?.toLocaleString()} FCFA</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-col sm:flex-row items-center gap-3 mt-6">
        {mission.status === 'available' && (
          <>
            <button
              onClick={() => onAccept(mission.id)}
              disabled={loading}
              className="w-full sm:flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white py-4 px-6 rounded-2xl font-bold transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <CheckCircle size={20} />
              {loading ? 'Acceptation...' : 'Accepter Mission'}
            </button>
            <button
              onClick={() => onReject(mission.id)}
              className="w-full sm:w-auto px-6 py-4 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center justify-center gap-2 font-semibold"
            >
              <XCircle size={20} />
              Refuser
            </button>
          </>
        )}

        {mission.status === 'in_progress' && (
          <div className="w-full flex flex-col sm:flex-row items-center gap-3">
            <button className="w-full sm:flex-1 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white py-4 px-6 rounded-2xl font-bold transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl hover:scale-[1.02]">
              <Navigation size={20} />
              Navigation Active
            </button>
            <button
              onClick={() => onComplete(mission.id)}
              disabled={loading}
              className="w-full sm:flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white py-4 px-6 rounded-2xl font-bold transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <CheckCircle size={20} />
              {loading ? 'Finalisation...' : 'Marquer Livré'}
            </button>
          </div>
        )}

        {mission.status === 'completed' && (
          <div className="w-full text-center py-4 text-green-600 dark:text-green-400 font-bold text-lg bg-green-50 dark:bg-green-900/20 rounded-2xl">
            ✅ Mission terminée avec succès!
            {mission.rating && (
              <div className="text-sm mt-1">
                ⭐ Note reçue: {mission.rating}/5
                {mission.tip && <span className="ml-2">💰 Pourboire: +{mission.tip} FCFA</span>}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MissionsPage;