import React, { useState, useEffect } from 'react';
import { 
  DollarSign, 
  TrendingUp, 
  Calendar, 
  Clock, 
  Target, 
  Award, 
  Zap, 
  PieChart,
  BarChart3,
  MapPin,
  Star,
  Users,
  ArrowUp,
  ArrowDown,
  Info,
  Wallet,
  Calculator,
  TrendingDown,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import DeliveryLayout from '../../../../layouts/delivery_layout';

/**
 * Delivery Earnings Page Component
 * Displays comprehensive earnings data, analytics, and improvement suggestions
 * for delivery partners in the Eat Fast application
 */
const DeliveryEarningsPage = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('today');
  const [showCalculator, setShowCalculator] = useState(false);
  const [animationClass, setAnimationClass] = useState('');

  // Sample earnings data - replace with actual API calls
  const [earningsData, setEarningsData] = useState({
    today: {
      totalEarnings: 12500,
      deliveries: 8,
      avgPerDelivery: 1562,
      workingHours: 6.5,
      tips: 2300,
      bonuses: 1500
    },
    week: {
      totalEarnings: 85000,
      deliveries: 45,
      avgPerDelivery: 1889,
      workingHours: 32,
      tips: 12500,
      bonuses: 8500
    },
    month: {
      totalEarnings: 340000,
      deliveries: 180,
      avgPerDelivery: 1889,
      workingHours: 128,
      tips: 45000,
      bonuses: 35000
    }
  });

  const [suggestions] = useState([
    {
      title: "Optimiser les heures de pointe",
      description: "Travaillez entre 12h-14h et 18h-21h pour augmenter vos gains de 30%",
      impact: "+30%",
      icon: Clock,
      priority: "high"
    },
    {
      title: "Améliorer votre note",
      description: "Une note de 4.8+ peut vous faire gagner 25% de bonus supplémentaires",
      impact: "+25%",
      icon: Star,
      priority: "medium"
    },
    {
      title: "Zones premium",
      description: "Concentrez-vous sur Bastos et Bonanjo pour des commandes plus rentables",
      impact: "+20%",
      icon: MapPin,
      priority: "high"
    },
    {
      title: "Service client",
      description: "Des interactions positives augmentent les pourboires de 40%",
      impact: "+40%",
      icon: Users,
      priority: "medium"
    }
  ]);

  useEffect(() => {
    setAnimationClass('animate-fadeInUp');
    const timer = setTimeout(() => setAnimationClass(''), 500);
    return () => clearTimeout(timer);
  }, [selectedPeriod]);

  const currentData = earningsData[selectedPeriod];
  const formatCurrency = (amount) => `${amount.toLocaleString()} FCFA`;

  const StatCard = ({ title, value, icon: Icon, change, isPositive = true, subtitle, className = "" }) => (
    <div className={`bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 border border-gray-100 dark:border-gray-700 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-xl bg-gradient-to-r ${isPositive ? 'from-green-500 to-emerald-500' : 'from-orange-500 to-red-500'} shadow-lg`}>
          <Icon size={24} className="text-white" />
        </div>
        {change && (
          <div className={`flex items-center px-3 py-1 rounded-full text-sm font-medium ${
            isPositive ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
          }`}>
            {isPositive ? <ArrowUp size={16} className="mr-1" /> : <ArrowDown size={16} className="mr-1" />}
            {change}
          </div>
        )}
      </div>
      <div>
        <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-1">{value}</h3>
        <p className="text-gray-600 dark:text-gray-400 font-medium">{title}</p>
        {subtitle && <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">{subtitle}</p>}
      </div>
    </div>
  );

  const SuggestionCard = ({ suggestion }) => {
    const { title, description, impact, icon: Icon, priority } = suggestion;
    const priorityColors = {
      high: 'from-red-500 to-pink-500',
      medium: 'from-yellow-500 to-orange-500',
      low: 'from-blue-500 to-cyan-500'
    };

    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 border border-gray-100 dark:border-gray-700">
        <div className="flex items-start space-x-4">
          <div className={`p-3 rounded-xl bg-gradient-to-r ${priorityColors[priority]} shadow-lg flex-shrink-0`}>
            <Icon size={24} className="text-white" />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-lg font-bold text-gray-800 dark:text-white">{title}</h4>
              <span className="px-3 py-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 rounded-full text-sm font-bold">
                {impact}
              </span>
            </div>
            <p className="text-gray-600 dark:text-gray-400">{description}</p>
            <div className="mt-3">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                priority === 'high' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                priority === 'medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
              }`}>
                Priorité {priority === 'high' ? 'Haute' : priority === 'medium' ? 'Moyenne' : 'Faible'}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const EarningsCalculator = () => {
    const [calcData, setCalcData] = useState({
      hoursPerDay: 8,
      daysPerWeek: 6,
      avgDeliveriesPerHour: 2,
      avgEarningsPerDelivery: 1800
    });

    const calculateProjectedEarnings = () => {
      const dailyDeliveries = calcData.hoursPerDay * calcData.avgDeliveriesPerHour;
      const dailyEarnings = dailyDeliveries * calcData.avgEarningsPerDelivery;
      const weeklyEarnings = dailyEarnings * calcData.daysPerWeek;
      const monthlyEarnings = weeklyEarnings * 4.3; // Average weeks per month

      return {
        daily: dailyEarnings,
        weekly: weeklyEarnings,
        monthly: monthlyEarnings,
        deliveries: {
          daily: dailyDeliveries,
          weekly: dailyDeliveries * calcData.daysPerWeek,
          monthly: dailyDeliveries * calcData.daysPerWeek * 4.3
        }
      };
    };

    const projected = calculateProjectedEarnings();

    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl border border-gray-100 dark:border-gray-700">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-800 dark:text-white flex items-center">
            <Calculator className="mr-2 text-blue-500" size={24} />
            Calculateur de Gains
          </h3>
          <button
            onClick={() => setShowCalculator(false)}
            className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
          >
            ✕
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-800 dark:text-white mb-4">Paramètres</h4>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Heures par jour
              </label>
              <input
                type="range"
                min="4"
                max="12"
                value={calcData.hoursPerDay}
                onChange={(e) => setCalcData({...calcData, hoursPerDay: Number(e.target.value)})}
                className="w-full"
              />
              <span className="text-sm text-gray-600 dark:text-gray-400">{calcData.hoursPerDay}h</span>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Jours par semaine
              </label>
              <input
                type="range"
                min="3"
                max="7"
                value={calcData.daysPerWeek}
                onChange={(e) => setCalcData({...calcData, daysPerWeek: Number(e.target.value)})}
                className="w-full"
              />
              <span className="text-sm text-gray-600 dark:text-gray-400">{calcData.daysPerWeek} jours</span>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Livraisons par heure
              </label>
              <input
                type="range"
                min="1"
                max="4"
                step="0.5"
                value={calcData.avgDeliveriesPerHour}
                onChange={(e) => setCalcData({...calcData, avgDeliveriesPerHour: Number(e.target.value)})}
                className="w-full"
              />
              <span className="text-sm text-gray-600 dark:text-gray-400">{calcData.avgDeliveriesPerHour} livraisons</span>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Gain par livraison (FCFA)
              </label>
              <input
                type="range"
                min="1000"
                max="3000"
                step="100"
                value={calcData.avgEarningsPerDelivery}
                onChange={(e) => setCalcData({...calcData, avgEarningsPerDelivery: Number(e.target.value)})}
                className="w-full"
              />
              <span className="text-sm text-gray-600 dark:text-gray-400">{formatCurrency(calcData.avgEarningsPerDelivery)}</span>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-gray-800 dark:text-white mb-4">Projections</h4>
            <div className="space-y-4">
              <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
                <h5 className="font-medium text-gray-800 dark:text-white">Journalier</h5>
                <p className="text-2xl font-bold text-green-600">{formatCurrency(Math.round(projected.daily))}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">{Math.round(projected.deliveries.daily)} livraisons</p>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
                <h5 className="font-medium text-gray-800 dark:text-white">Hebdomadaire</h5>
                <p className="text-2xl font-bold text-blue-600">{formatCurrency(Math.round(projected.weekly))}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">{Math.round(projected.deliveries.weekly)} livraisons</p>
              </div>
              
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl p-4 text-white">
                <h5 className="font-medium">Mensuel</h5>
                <p className="text-2xl font-bold">{formatCurrency(Math.round(projected.monthly))}</p>
                <p className="text-sm opacity-90">{Math.round(projected.deliveries.monthly)} livraisons</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    // <DeliveryLayout>
    <>
      <div className={`min-h-screen p-6 ${animationClass}`}>
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2 flex items-center">
                <Wallet className="mr-3 text-green-500" size={32} />
                Mes Gains
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Analysez vos revenus et découvrez comment les optimiser
              </p>
            </div>
            
            <div className="flex items-center space-x-4 mt-4 lg:mt-0">
              <button
                onClick={() => setShowCalculator(true)}
                className="flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl hover:from-blue-600 hover:to-purple-600 transform hover:scale-105 transition-all duration-200 shadow-lg"
              >
                <Calculator size={20} className="mr-2" />
                Calculateur
              </button>
              
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800 dark:text-white"
              >
                <option value="today">Aujourd'hui</option>
                <option value="week">Cette semaine</option>
                <option value="month">Ce mois</option>
              </select>
            </div>
          </div>
        </div>

        {/* Calculator Modal */}
        {showCalculator && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="max-w-4xl w-full max-h-screen overflow-y-auto">
              <EarningsCalculator />
            </div>
          </div>
        )}

        {/* Main Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Gains Total"
            value={formatCurrency(currentData.totalEarnings)}
            icon={DollarSign}
            change="+12%"
            subtitle={`${currentData.deliveries} livraisons`}
            className="lg:col-span-2"
          />
          
          <StatCard
            title="Gain Moyen"
            value={formatCurrency(currentData.avgPerDelivery)}
            icon={TrendingUp}
            change="+5%"
            subtitle="Par livraison"
          />
          
          <StatCard
            title="Heures Travaillées"
            value={`${currentData.workingHours}h`}
            icon={Clock}
            change="+2h"
            subtitle="Temps productif"
          />
        </div>

        {/* Detailed Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-800 dark:text-white flex items-center">
                <PieChart className="mr-2 text-blue-500" size={24} />
                Répartition des Gains
              </h3>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-xl">
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-green-500 rounded-full mr-3"></div>
                  <span className="text-gray-700 dark:text-gray-300">Livraisons</span>
                </div>
                <span className="font-bold text-gray-800 dark:text-white">
                  {formatCurrency(currentData.totalEarnings - currentData.tips - currentData.bonuses)}
                </span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-xl">
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-yellow-500 rounded-full mr-3"></div>
                  <span className="text-gray-700 dark:text-gray-300">Pourboires</span>
                </div>
                <span className="font-bold text-gray-800 dark:text-white">{formatCurrency(currentData.tips)}</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-xl">
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-purple-500 rounded-full mr-3"></div>
                  <span className="text-gray-700 dark:text-gray-300">Bonus</span>
                </div>
                <span className="font-bold text-gray-800 dark:text-white">{formatCurrency(currentData.bonuses)}</span>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-800 dark:text-white flex items-center">
                <Target className="mr-2 text-orange-500" size={24} />
                Performance
              </h3>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600 dark:text-gray-400">Taux de réussite</span>
                <div className="flex items-center">
                  <div className="w-20 bg-gray-200 dark:bg-gray-700 rounded-full h-2 mr-3">
                    <div className="bg-green-500 h-2 rounded-full" style={{width: '96%'}}></div>
                  </div>
                  <span className="font-bold text-green-600">96%</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-gray-600 dark:text-gray-400">Note moyenne</span>
                <div className="flex items-center">
                  <Star className="text-yellow-500 mr-1" size={16} />
                  <span className="font-bold text-gray-800 dark:text-white">4.8/5</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-gray-600 dark:text-gray-400">Temps moyen</span>
                <span className="font-bold text-gray-800 dark:text-white">22 min</span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl p-6 shadow-lg text-white">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold flex items-center">
                <Award className="mr-2" size={24} />
                Objectifs du Mois
              </h3>
            </div>
            
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span>Revenus (400k FCFA)</span>
                  <span className="font-bold">85%</span>
                </div>
                <div className="w-full bg-white/20 rounded-full h-2">
                  <div className="bg-white h-2 rounded-full" style={{width: '85%'}}></div>
                </div>
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span>Livraisons (200)</span>
                  <span className="font-bold">90%</span>
                </div>
                <div className="w-full bg-white/20 rounded-full h-2">
                  <div className="bg-white h-2 rounded-full" style={{width: '90%'}}></div>
                </div>
              </div>
              
              <div className="mt-4 p-3 bg-white/10 rounded-xl">
                <p className="text-sm">🎯 Bonus objectif: <span className="font-bold">50,000 FCFA</span></p>
              </div>
            </div>
          </div>
        </div>

        {/* Suggestions Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center">
              <Zap className="mr-3 text-yellow-500" size={28} />
              Comment Augmenter Mes Gains
            </h2>
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
              <Info size={16} className="mr-1" />
              Conseils personnalisés
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {suggestions.map((suggestion, index) => (
              <SuggestionCard key={index} suggestion={suggestion} />
            ))}
          </div>
        </div>

        {/* Tax & Savings Estimation */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-800 dark:text-white flex items-center">
              <BarChart3 className="mr-2 text-indigo-500" size={24} />
              Estimation Taxes & Épargne
            </h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
              <div className="text-2xl font-bold text-blue-600 mb-2">
                {formatCurrency(Math.round(currentData.totalEarnings * 0.15))}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Taxes estimées (15%)</div>
            </div>
            
            <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-xl">
              <div className="text-2xl font-bold text-green-600 mb-2">
                {formatCurrency(Math.round(currentData.totalEarnings * 0.20))}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Épargne recommandée (20%)</div>
            </div>
            
            <div className="text-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-xl">
              <div className="text-2xl font-bold text-orange-600 mb-2">
                {formatCurrency(Math.round(currentData.totalEarnings * 0.65))}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Revenu net disponible</div>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
            <div className="flex items-start space-x-3">
              <AlertCircle className="text-blue-500 flex-shrink-0 mt-1" size={20} />
              <div>
                <h4 className="font-medium text-gray-800 dark:text-white mb-1">Conseil Financier</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Considérez mettre de côté 20% de vos gains pour les urgences et 15% pour les taxes. 
                  Cela vous assure une stabilité financière à long terme.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      </>
    // </DeliveryLayout>
  );
};

export default DeliveryEarningsPage;