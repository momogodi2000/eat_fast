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
  Globe
} from 'lucide-react';
import DeliveryLayout from '../../../../layouts/delivery_layout';

/**
 * MissionsPage Component
 * 
 * Comprehensive delivery mission management interface for drivers
 * Features: Mission queue, heatmaps, smart batching, real-time tracking
 * 
 * @component
 */
const MissionsPage = () => {
  // State management
  const [activeTab, setActiveTab] = useState('available');
  const [missions, setMissions] = useState([]);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [driverStats, setDriverStats] = useState({
    todayEarnings: 8500,
    completedMissions: 12,
    rating: 4.8,
    efficiency: 95
  });

  // Sample mission data - In real app, this would come from API
  const sampleMissions = [
    {
      id: 'M001',
      type: 'delivery',
      status: 'available',
      restaurant: 'Chez Mama Moki',
      customer: 'Jean Baptiste',
      customerPhone: '+237 670 123 456',
      pickupAddress: 'Carrefour Warda, Yaoundé',
      deliveryAddress: 'Quartier Elig-Edzoa, Yaoundé',
      distance: 3.2,
      estimatedTime: 25,
      payment: 2500,
      bonus: 500,
      priority: 'high',
      orderItems: ['Ndolé', 'Riz sauté', 'Plantains'],
      createdAt: new Date(Date.now() - 10 * 60000),
      coordinates: { pickup: [3.8480, 11.5021], delivery: [3.8580, 11.5121] }
    },
    {
      id: 'M002',
      type: 'delivery',
      status: 'in_progress',
      restaurant: 'Le Bamiléké Gourmand',
      customer: 'Marie Fotso',
      customerPhone: '+237 690 987 654',
      pickupAddress: 'Marché Central, Douala',
      deliveryAddress: 'Bonapriso, Douala',
      distance: 4.8,
      estimatedTime: 35,
      payment: 3200,
      bonus: 300,
      priority: 'medium',
      orderItems: ['Poulet DG', 'Salade de concombre'],
      pickedUpAt: new Date(Date.now() - 15 * 60000),
      coordinates: { pickup: [4.0511, 9.7679], delivery: [4.0611, 9.7779] }
    },
    {
      id: 'M003',
      type: 'batch',
      status: 'available',
      restaurant: 'Fast Food Express',
      customers: ['Paul Mbah', 'Christine Nga'],
      batchCount: 2,
      totalDistance: 5.1,
      estimatedTime: 40,
      payment: 4800,
      bonus: 800,
      priority: 'high',
      coordinates: { pickup: [3.8680, 11.5221], delivery: [3.8780, 11.5321] }
    }
  ];

  const heatmapZones = [
    { name: 'Centre-ville', demand: 95, coordinates: [3.8480, 11.5021] },
    { name: 'Elig-Edzoa', demand: 78, coordinates: [3.8580, 11.5121] },
    { name: 'Bastos', demand: 92, coordinates: [3.8680, 11.5221] },
    { name: 'Mvan', demand: 65, coordinates: [3.8380, 11.4921] }
  ];

  useEffect(() => {
    // Initialize missions
    setMissions(sampleMissions);
    
    // Detect dark mode preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setIsDarkMode(true);
    }
    
    // Simulate real-time updates
    const interval = setInterval(() => {
      setMissions(prev => prev.map(mission => ({
        ...mission,
        estimatedTime: Math.max(1, mission.estimatedTime - 1)
      })));
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  // Filter missions based on active tab and filters
  const filteredMissions = missions.filter(mission => {
    const matchesTab = activeTab === 'all' || mission.status === activeTab || 
                       (activeTab === 'available' && mission.status === 'available') ||
                       (activeTab === 'active' && mission.status === 'in_progress');
    const matchesFilter = filterStatus === 'all' || mission.priority === filterStatus;
    const matchesSearch = mission.restaurant.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         mission.customer?.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesTab && matchesFilter && matchesSearch;
  });

  // Handle mission acceptance
  const handleAcceptMission = async (missionId) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setMissions(prev => prev.map(mission => 
        mission.id === missionId 
          ? { ...mission, status: 'in_progress', acceptedAt: new Date() }
          : mission
      ));
      
      // Show success notification (would use toast in real app)
      console.log(`Mission ${missionId} accepted successfully`);
    } catch (error) {
      console.error('Failed to accept mission:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle mission rejection
  const handleRejectMission = (missionId) => {
    setMissions(prev => prev.filter(mission => mission.id !== missionId));
  };

  // Handle mission completion
  const handleCompleteMission = async (missionId) => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setMissions(prev => prev.map(mission => 
        mission.id === missionId 
          ? { ...mission, status: 'completed', completedAt: new Date() }
          : mission
      ));
      
      // Update driver stats
      setDriverStats(prev => ({
        ...prev,
        completedMissions: prev.completedMissions + 1,
        todayEarnings: prev.todayEarnings + missions.find(m => m.id === missionId)?.payment || 0
      }));
    } catch (error) {
      console.error('Failed to complete mission:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DeliveryLayout>
      <div className="max-w-7xl mx-auto p-6">
        <div className="space-y-6">
          {/* Header Section */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <div className="flex items-center gap-4 mb-2">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  Missions de Livraison
                </h1>
                <button
                  onClick={() => setIsDarkMode(!isDarkMode)}
                  className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                >
                  {isDarkMode ? '☀️' : '🌙'}
                </button>
              </div>
              <p className="text-gray-600 dark:text-gray-400">
                Gérez vos livraisons et optimisez vos revenus
              </p>
            </div>
            
            {/* Quick Actions */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowHeatmap(!showHeatmap)}
                className={`px-4 py-2 rounded-xl flex items-center gap-2 transition-all duration-200 ${
                  showHeatmap 
                    ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg' 
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                <Globe size={18} />
                <span className="hidden sm:inline">Heatmap</span>
              </button>
              
              <button className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl flex items-center gap-2 hover:from-green-600 hover:to-emerald-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105">
                <Zap size={18} />
                <span className="hidden sm:inline">Mode Boost</span>
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatsCard 
              icon={<DollarSign size={24} className="text-green-500" />}
              title="Gains Aujourd'hui"
              value={`${driverStats.todayEarnings.toLocaleString()} FCFA`}
              trend="+12%"
              trendColor="text-green-500"
            />
            <StatsCard 
              icon={<Package size={24} className="text-blue-500" />}
              title="Missions Complétées"
              value={driverStats.completedMissions}
              trend="+3"
              trendColor="text-blue-500"
            />
            <StatsCard 
              icon={<Star size={24} className="text-yellow-500" />}
              title="Note Moyenne"
              value={driverStats.rating}
              trend="+0.2"
              trendColor="text-yellow-500"
            />
            <StatsCard 
              icon={<Activity size={24} className="text-purple-500" />}
              title="Efficacité"
              value={`${driverStats.efficiency}%`}
              trend="+5%"
              trendColor="text-purple-500"
            />
          </div>

          {/* Heatmap Section */}
          {showHeatmap && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Zones de Forte Demande
                </h3>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Temps réel
                </div>
              </div>
              
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {heatmapZones.map((zone, index) => (
                  <div 
                    key={index}
                    className="p-4 rounded-xl border-2 border-dashed transition-all duration-300 hover:scale-105 cursor-pointer"
                    style={{
                      borderColor: zone.demand > 80 ? '#ef4444' : zone.demand > 60 ? '#f59e0b' : '#10b981',
                      backgroundColor: `${zone.demand > 80 ? '#fee2e2' : zone.demand > 60 ? '#fef3c7' : '#d1fae5'}`
                    }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900">{zone.name}</h4>
                      <Target size={16} className={
                        zone.demand > 80 ? 'text-red-500' : zone.demand > 60 ? 'text-yellow-500' : 'text-green-500'
                      } />
                    </div>
                    <div className="text-2xl font-bold text-gray-900">{zone.demand}%</div>
                    <div className="text-sm text-gray-600">Demande</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Filters and Search */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Tab Navigation */}
              <div className="flex bg-gray-100 dark:bg-gray-700 rounded-xl p-1">
                {[
                  { key: 'available', label: 'Disponibles', count: missions.filter(m => m.status === 'available').length },
                  { key: 'active', label: 'En cours', count: missions.filter(m => m.status === 'in_progress').length },
                  { key: 'completed', label: 'Terminées', count: missions.filter(m => m.status === 'completed').length }
                ].map(tab => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                      activeTab === tab.key
                        ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                    }`}
                  >
                    {tab.label}
                    <span className="bg-gray-200 dark:bg-gray-600 text-xs px-2 py-1 rounded-full">
                      {tab.count}
                    </span>
                  </button>
                ))}
              </div>

              {/* Search and Filters */}
              <div className="flex flex-1 gap-3">
                <div className="relative flex-1">
                  <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Rechercher par restaurant ou client..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
                
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value="all">Toutes priorités</option>
                  <option value="high">Priorité haute</option>
                  <option value="medium">Priorité moyenne</option>
                  <option value="low">Priorité basse</option>
                </select>
              </div>
            </div>
          </div>

          {/* Predictive Mission Queue */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-6 border border-blue-200 dark:border-gray-700">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-blue-500 rounded-lg">
                <TrendingUp size={20} className="text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Queue Prédictive
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Missions à venir dans votre zone
                </p>
              </div>
            </div>
            
            <div className="text-center py-8">
              <div className="text-4xl mb-2">🎯</div>
              <div className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                3 missions prévues dans les 30 minutes
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Restez dans la zone Centre-ville pour optimiser vos gains
              </div>
            </div>
          </div>

          {/* Missions List */}
          <div className="space-y-4">
            {filteredMissions.length === 0 ? (
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-12 text-center shadow-lg border border-gray-200 dark:border-gray-700">
                <Package size={48} className="mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  Aucune mission disponible
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  De nouvelles missions apparaîtront bientôt dans votre zone.
                </p>
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
                  isDarkMode={isDarkMode}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </DeliveryLayout>
  );
};

/**
 * StatsCard Component
 * Displays key performance metrics
 */
const StatsCard = ({ icon, title, value, trend, trendColor }) => (
  <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-200 transform hover:scale-105">
    <div className="flex items-center justify-between mb-4">
      <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-xl">
        {icon}
      </div>
      <div className={`text-sm font-medium ${trendColor}`}>
        {trend}
      </div>
    </div>
    <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
      {value}
    </div>
    <div className="text-sm text-gray-600 dark:text-gray-400">
      {title}
    </div>
  </div>
);

/**
 * MissionCard Component
 * Individual mission display with actions
 */
const MissionCard = ({ mission, onAccept, onReject, onComplete, loading, isDarkMode }) => {
  const [expanded, setExpanded] = useState(false);
  
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'border-red-500 bg-red-50 dark:bg-red-900/20';
      case 'medium': return 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20';
      case 'low': return 'border-green-500 bg-green-50 dark:bg-green-900/20';
      default: return 'border-gray-300 dark:border-gray-600';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'in_progress': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'completed': return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border-2 transition-all duration-300 hover:shadow-xl ${getPriorityColor(mission.priority)}`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl text-white shadow-lg">
            {mission.type === 'batch' ? <Users size={20} /> : <Package size={20} />}
          </div>
          
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {mission.restaurant}
              </h3>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(mission.status)}`}>
                {mission.status === 'available' ? 'Disponible' : 
                 mission.status === 'in_progress' ? 'En cours' : 'Terminé'}
              </span>
              {mission.type === 'batch' && (
                <span className="px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400">
                  Lot de {mission.batchCount}
                </span>
              )}
            </div>
            
            <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
              <div className="flex items-center gap-2">
                <MapPin size={14} />
                <span>→ {mission.deliveryAddress || 'Livraisons multiples'}</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <Clock size={14} />
                  <span>{mission.estimatedTime} min</span>
                </div>
                <div className="flex items-center gap-1">
                  <Navigation size={14} />
                  <span>{mission.distance} km</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="text-right">
            <div className="text-lg font-bold text-gray-900 dark:text-white">
              {mission.payment.toLocaleString()} FCFA
            </div>
            {mission.bonus > 0 && (
              <div className="text-sm text-green-600 dark:text-green-400">
                +{mission.bonus} bonus
              </div>
            )}
          </div>
          
          <button
            onClick={() => setExpanded(!expanded)}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <MoreVertical size={16} className="text-gray-400" />
          </button>
        </div>
      </div>

      {/* Expanded Details */}
      {expanded && (
        <div className="space-y-4 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          {mission.customer && (
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-gray-900 dark:text-white">
                  {mission.customer}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {mission.customerPhone}
                </div>
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
          )}

          {mission.orderItems && (
            <div>
              <div className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                Articles commandés:
              </div>
              <div className="flex flex-wrap gap-2">
                {mission.orderItems.map((item, index) => (
                  <span 
                    key={index}
                    className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-3 mt-4">
        {mission.status === 'available' && (
          <>
            <button
              onClick={() => onAccept(mission.id)}
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white py-3 px-4 rounded-xl font-medium transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <CheckCircle size={18} />
              Accepter
            </button>
            <button
              onClick={() => onReject(mission.id)}
              className="px-4 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center gap-2"
            >
              <XCircle size={18} />
              Refuser
            </button>
          </>
        )}

        {mission.status === 'in_progress' && (
          <div className="flex items-center gap-3 w-full">
            <button className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white py-3 px-4 rounded-xl font-medium transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl">
              <Navigation size={18} />
              Navigation
            </button>
            <button
              onClick={() => onComplete(mission.id)}
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white py-3 px-4 rounded-xl font-medium transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <CheckCircle size={18} />
              Livré
            </button>
          </div>
        )}

        {mission.status === 'completed' && (
          <div className="w-full text-center py-2 text-green-600 dark:text-green-400 font-medium">
            ✅ Mission terminée
          </div>
        )}
      </div>
    </div>
  );
};

export default MissionsPage;