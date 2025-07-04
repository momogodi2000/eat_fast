import React, { useState, useEffect, useCallback, createContext } from 'react';
import { useTranslation } from 'react-i18next';
import RestaurantLayout from '../../../../layouts/restaurants_layout';
import {
  FiSearch,
  FiFilter,
  FiClock,
  FiPhone,
  FiUser,
  FiMapPin,
  FiDollarSign,
  FiPrinter,
  FiMessageCircle,
  FiRefreshCw,
  FiTruck,
  FiCheckCircle,
  FiAlertCircle,
  FiXCircle,
  FiEye,
  FiMoreVertical,
  FiCalendar,
  FiPackage,
  FiStar,
  FiEdit3
} from 'react-icons/fi';

/**
 * RestaurantCommand Component
 * Gestion des commandes pour les gestionnaires de restaurant
 * 
 * @component
 * @returns {JSX.Element} Page de gestion des commandes
 */
 const mockOrders = [
    {
      id: 'CMD001',
      customerName: 'Marie Ngono',
      customerPhone: '+237 677 123 456',
      customerAddress: 'Quartier Mvog-Ada, Yaoundé',
      items: [
        { name: 'Ndolé aux crevettes', quantity: 2, price: 3500, options: 'Avec plantain' },
        { name: 'Jus de gingembre', quantity: 1, price: 1000, options: '' }
      ],
      totalAmount: 8000,
      paymentMethod: 'Mobile Money MTN',
      status: 'new',
      createdAt: new Date(Date.now() - 15 * 60 * 1000), // 15 minutes ago
      estimatedDelivery: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes from now
      specialInstructions: 'Livrer au bureau, étage 2',
      deliveryPerson: null,
      restaurant: "Chez Pierre"

    },
    {
      id: 'CMD002',
      customerName: 'Paul Mbida',
      customerPhone: '+237 691 234 567',
      customerAddress: 'Quartier Bastos, Yaoundé',
      items: [
        { name: 'Poulet DG', quantity: 1, price: 4000, options: 'Bien épicé' },
        { name: 'Riz sauté', quantity: 1, price: 2000, options: '' },
        { name: 'Coca Cola', quantity: 2, price: 1000, options: 'Frais' }
      ],
      totalAmount: 7000,
      paymentMethod: 'Orange Money',
      status: 'preparing',
      createdAt: new Date(Date.now() - 45 * 60 * 1000), // 45 minutes ago
      estimatedDelivery: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes from now
      specialInstructions: '',
      deliveryPerson: 'Jean Kamga',
      restaurant: "Chez Pierre"
    },
    {
      id: 'CMD003',
      customerName: 'Sophie Tchouang',
      customerPhone: '+237 654 345 678',
      customerAddress: 'Quartier Melen, Yaoundé',
      items: [
        { name: 'Koki aux feuilles', quantity: 3, price: 1500, options: 'Sans piment' },
        { name: 'Pain moderne', quantity: 2, price: 500, options: '' }
      ],
      totalAmount: 5500,
      paymentMethod: 'Espèces',
      status: 'ready',
      createdAt: new Date(Date.now() - 75 * 60 * 1000), // 1h15 ago
      estimatedDelivery: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago (en retard)
      specialInstructions: 'Appeler avant de livrer',
      deliveryPerson: 'Amadou Diallo',
      restaurant: "Chez Pierre"
    },
    {
      id: 'CMD004',
      customerName: 'Robert Fotso',
      customerPhone: '+237 678 456 789',
      customerAddress: 'Quartier Essos, Yaoundé',
      items: [
        { name: 'Achu soup', quantity: 1, price: 2500, options: 'Avec viande de bœuf' }
      ],
      totalAmount: 2500,
      paymentMethod: 'Mobile Money MTN',
      status: 'delivered',
      createdAt: new Date(Date.now() - 120 * 60 * 1000), // 2h ago
      estimatedDelivery: new Date(Date.now() - 90 * 60 * 1000), // 1h30 ago
      specialInstructions: '',
      deliveryPerson: 'Michel Essomba',
      restaurant: "African"
    }
  ];

const RestaurantCommand = () => {
  const { t } = useTranslation();
  
  // États principaux
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('today');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderDetails, setShowOrderDetails] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  // Données de démonstration (à remplacer par des appels API réels)
 

  // Statuts des commandes avec leurs configurations
  const orderStatuses = {
    new: { 
      label: 'Nouvelle', 
      color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
      icon: <FiAlertCircle size={16} />,
      actions: ['preparing', 'cancel']
    },
    preparing: { 
      label: 'En préparation', 
      color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
      icon: <FiClock size={16} />,
      actions: ['ready', 'cancel']
    },
    ready: { 
      label: 'Prête', 
      color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      icon: <FiCheckCircle size={16} />,
      actions: ['delivered']
    },
    delivered: { 
      label: 'Livrée', 
      color: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
      icon: <FiTruck size={16} />,
      actions: []
    },
    cancel: { 
      label: 'Annulée', 
      color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
      icon: <FiXCircle size={16} />,
      actions: []
    }
  };

  // Initialisation des données (simulation d'un appel API)
  useEffect(() => {
    const loadOrders = async () => {
      setLoading(true);
      try {
        // Simulation d'un délai d'API
        await new Promise(resolve => setTimeout(resolve, 1000));
        setOrders(mockOrders);
        setFilteredOrders(mockOrders);
      } catch (error) {
        console.error('Erreur lors du chargement des commandes:', error);
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, []);

  // Filtrage des commandes
  useEffect(() => {
    let filtered = [...orders];

    // Filtre par terme de recherche
    if (searchTerm) {
      filtered = filtered.filter(order => 
        order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customerPhone.includes(searchTerm)
      );
    }

    // Filtre par statut
    if (statusFilter !== 'all') {
      filtered = filtered.filter(order => order.status === statusFilter);
    }

    // Filtre par date
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    if (dateFilter === 'today') {
      filtered = filtered.filter(order => order.createdAt >= today);
    } else if (dateFilter === 'yesterday') {
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      filtered = filtered.filter(order => 
        order.createdAt >= yesterday && order.createdAt < today
      );
    } else if (dateFilter === 'week') {
      const weekAgo = new Date(today);
      weekAgo.setDate(weekAgo.getDate() - 7);
      filtered = filtered.filter(order => order.createdAt >= weekAgo);
    }

    setFilteredOrders(filtered);
  }, [orders, searchTerm, statusFilter, dateFilter]);


  // Les Orders pour le context 


  // Calcul des métriques
  const metrics = {
    today: orders.filter(order => {
      const today = new Date();
      const orderDate = new Date(order.createdAt);
      return orderDate.toDateString() === today.toDateString();
    }).length,
    pending: orders.filter(order => ['new', 'preparing', 'ready'].includes(order.status)).length,
    completed: orders.filter(order => order.status === 'delivered').length,
    revenue: orders
      .filter(order => order.status === 'delivered')
      .reduce((sum, order) => sum + order.totalAmount, 0)
  };

  /**
   * Met à jour le statut d'une commande
   * @param {string} orderId - ID de la commande
   * @param {string} newStatus - Nouveau statut
   */
  const updateOrderStatus = useCallback(async (orderId, newStatus) => {
    setIsUpdatingStatus(true);
    try {
      // Simulation d'appel API
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order.id === orderId 
            ? { ...order, status: newStatus }
            : order
        )
      );
      
      console.log(`Commande ${orderId} mise à jour vers ${newStatus}`);
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
    } finally {
      setIsUpdatingStatus(false);
    }
  }, []);

  /**
   * Imprime le reçu d'une commande
   * @param {Object} order - Commande à imprimer
   */
  const printReceipt = useCallback((order) => {
    console.log('Impression du reçu pour la commande:', order.id);
    // Logique d'impression à implémenter
  }, []);

  /**
   * Contacte le client
   * @param {Object} order - Commande du client à contacter
   */
  const contactCustomer = useCallback((order) => {
    console.log('Contact client:', order.customerPhone);
    // Logique de contact à implémenter
  }, []);

  /**
   * Formate le temps relatif
   * @param {Date} date - Date à formater
   * @returns {string} Temps formaté
   */
  const formatRelativeTime = (date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'À l\'instant';
    if (diffInMinutes < 60) return `Il y a ${diffInMinutes} min`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `Il y a ${diffInHours}h`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `Il y a ${diffInDays}j`;
  };

  /**
   * Composant de carte de commande
   * @param {Object} props - Props du composant
   * @param {Object} props.order - Données de la commande
   */
  const OrderCard = ({ order }) => {
    const status = orderStatuses[order.status];
    const isOverdue = order.status === 'ready' && new Date() > order.estimatedDelivery;

    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700 overflow-hidden">
        {/* En-tête de la carte */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-green-50 to-yellow-50 dark:from-gray-700 dark:to-gray-800">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                #{order.id}
              </h3>
              <div className="flex items-center mt-1 text-sm text-gray-600 dark:text-gray-300">
                <FiUser className="mr-2" size={14} />
                <span className="font-medium">{order.customerName}</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${status.color} ${isOverdue ? 'animate-pulse' : ''}`}>
                {status.icon}
                <span className="ml-1">{status.label}</span>
              </span>
              
              <div className="relative">
                <button className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                  <FiMoreVertical size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Contenu de la carte */}
        <div className="p-4">
          {/* Informations client */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
              <FiPhone className="mr-2 text-blue-500" size={14} />
              <span>{order.customerPhone}</span>
            </div>
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
              <FiMapPin className="mr-2 text-red-500" size={14} />
              <span className="truncate">{order.customerAddress}</span>
            </div>
          </div>

          {/* Articles commandés */}
          <div className="mb-4">
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
              Articles ({order.items.length})
            </h4>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {order.items.map((item, index) => (
                <div key={index} className="flex justify-between items-center text-sm bg-gray-50 dark:bg-gray-700 p-2 rounded-lg">
                  <div className="flex-1">
                    <span className="font-medium text-gray-900 dark:text-white">
                      {item.quantity}x {item.name}
                    </span>
                    {item.options && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {item.options}
                      </p>
                    )}
                  </div>
                  <span className="font-semibold text-green-600 dark:text-green-400">
                    {(item.quantity * item.price).toLocaleString()} FCFA
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Instructions spéciales */}
          {order.specialInstructions && (
            <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border-l-4 border-blue-400">
              <p className="text-sm font-medium text-blue-800 dark:text-blue-300 mb-1">
                Instructions spéciales:
              </p>
              <p className="text-sm text-blue-700 dark:text-blue-400">
                {order.specialInstructions}
              </p>
            </div>
          )}

          {/* Informations de livraison */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 text-sm">
            <div className="flex items-center text-gray-600 dark:text-gray-300">
              <FiClock className="mr-2 text-orange-500" size={14} />
              <span>Créée {formatRelativeTime(order.createdAt)}</span>
            </div>
            {order.deliveryPerson && (
              <div className="flex items-center text-gray-600 dark:text-gray-300">
                <FiTruck className="mr-2 text-purple-500" size={14} />
                <span>Livreur: {order.deliveryPerson}</span>
              </div>
            )}
          </div>

          {/* Total et paiement */}
          <div className="flex justify-between items-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg mb-4">
            <div className="text-sm text-gray-600 dark:text-gray-300">
              <span>Paiement: {order.paymentMethod}</span>
            </div>
            <div className="text-lg font-bold text-green-600 dark:text-green-400">
              {order.totalAmount.toLocaleString()} FCFA
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-2">
            {/* Actions de changement d'état */}
            {status.actions.map(action => (
              <button
                key={action}
                onClick={() => updateOrderStatus(order.id, action)}
                disabled={isUpdatingStatus}
                className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  action === 'cancel' 
                    ? 'bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/40'
                    : 'bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:hover:bg-blue-900/40'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {isUpdatingStatus ? (
                  <FiRefreshCw className="mr-1 animate-spin" size={14} />
                ) : (
                  orderStatuses[action]?.icon && React.cloneElement(orderStatuses[action].icon, { className: "mr-1", size: 14 })
                )}
                {orderStatuses[action]?.label || action}
              </button>
            ))}

            {/* Actions secondaires */}
            <div className="flex gap-2 ml-auto">
              <button
                onClick={() => contactCustomer(order)}
                className="p-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 transition-colors"
                title="Contacter le client"
              >
                <FiMessageCircle size={16} />
              </button>
              
              <button
                onClick={() => printReceipt(order)}
                className="p-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 transition-colors"
                title="Imprimer le reçu"
              >
                <FiPrinter size={16} />
              </button>
              
              <button
                onClick={() => {
                  setSelectedOrder(order);
                  setShowOrderDetails(true);
                }}
                className="p-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 transition-colors"
                title="Voir les détails"
              >
                <FiEye size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    // <RestaurantLayout>
    <>
      <div className="p-6 space-y-6">
        {/* En-tête avec métriques */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Gestion des Commandes
          </h1>
          
          {/* Métriques */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Commandes Aujourd'hui
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {metrics.today}
                  </p>
                </div>
                <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-full">
                  <FiCalendar className="text-blue-600 dark:text-blue-400" size={24} />
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    En Attente
                  </p>
                  <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                    {metrics.pending}
                  </p>
                </div>
                <div className="p-3 bg-orange-100 dark:bg-orange-900/20 rounded-full">
                  <FiClock className="text-orange-600 dark:text-orange-400" size={24} />
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Terminées
                  </p>
                  <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {metrics.completed}
                  </p>
                </div>
                <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-full">
                  <FiCheckCircle className="text-green-600 dark:text-green-400" size={24} />
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Revenus du Jour
                  </p>
                  <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                    {metrics.revenue.toLocaleString()} FCFA
                  </p>
                </div>
                <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-full">
                  <FiDollarSign className="text-purple-600 dark:text-purple-400" size={24} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filtres et recherche */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Recherche */}
            <div className="flex-1">
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Rechercher par nom, téléphone ou N° de commande..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-200"
                />
              </div>
            </div>

            {/* Filtres */}
            <div className="flex flex-col sm:flex-row gap-4">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all duration-200"
              >
                <option value="all">Tous les statuts</option>
                <option value="new">Nouvelles</option>
                <option value="preparing">En préparation</option>
                <option value="ready">Prêtes</option>
                <option value="delivered">Livrées</option>
                <option value="cancel">Annulées</option>
              </select>

              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all duration-200"
              >
                <option value="today">Aujourd'hui</option>
                <option value="yesterday">Hier</option>
                <option value="week">Cette semaine</option>
                <option value="all">Toutes les dates</option>
              </select>

              <button
                onClick={() => {
                  setSearchTerm('');
                  setStatusFilter('all');
                  setDateFilter('today');
                }}
                className="px-4 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200 flex items-center"
              >
                <FiRefreshCw className="mr-2" size={16} />
                Réinitialiser
              </button>
            </div>
          </div>
        </div>

        {/* Liste des commandes */}
        <div>
          {loading ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden animate-pulse">
                  <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-700">
                    <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded w-1/3 mb-2"></div>
                    <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/2"></div>
                  </div>
                  <div className="p-4 space-y-4">
                    <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-full"></div>
                    <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4"></div>
                    <div className="h-20 bg-gray-300 dark:bg-gray-600 rounded w-full"></div>
                    <div className="flex gap-2">
                      <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded w-20"></div>
                      <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded w-16"></div>
                    </div>
                  </div>
                </div>
                ))}
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="text-center py-12">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-8">
                <FiPackage className="mx-auto text-gray-400 mb-4" size={48} />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Aucune commande trouvée
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {searchTerm || statusFilter !== 'all' || dateFilter !== 'today'
                    ? 'Aucune commande ne correspond à vos critères de recherche.'
                    : 'Aucune nouvelle commande pour le moment.'}
                </p>
                {(searchTerm || statusFilter !== 'all' || dateFilter !== 'today') && (
                  <button
                    onClick={() => {
                      setSearchTerm('');
                      setStatusFilter('all');
                      setDateFilter('today');
                    }}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Voir toutes les commandes
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredOrders.map(order => (
                <OrderCard key={order.id} order={order} />
              ))}
            </div>
          )}
        </div>

        {/* Modal de détails de commande */}
        {showOrderDetails && selectedOrder && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              {/* En-tête du modal */}
              <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-green-50 to-yellow-50 dark:from-gray-700 dark:to-gray-800">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                      Détails de la commande #{selectedOrder.id}
                    </h2>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                      Créée {formatRelativeTime(selectedOrder.createdAt)}
                    </p>
                  </div>
                  <button
                    onClick={() => setShowOrderDetails(false)}
                    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                  >
                    <FiXCircle size={20} />
                  </button>
                </div>
              </div>

              {/* Contenu du modal */}
              <div className="p-6 space-y-6">
                {/* Informations client */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Informations Client
                  </h3>
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 space-y-3">
                    <div className="flex items-center">
                      <FiUser className="mr-3 text-blue-500" size={18} />
                      <span className="font-medium text-gray-900 dark:text-white">
                        {selectedOrder.customerName}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <FiPhone className="mr-3 text-green-500" size={18} />
                      <span className="text-gray-700 dark:text-gray-300">
                        {selectedOrder.customerPhone}
                      </span>
                    </div>
                    <div className="flex items-start">
                      <FiMapPin className="mr-3 text-red-500 mt-1" size={18} />
                      <span className="text-gray-700 dark:text-gray-300">
                        {selectedOrder.customerAddress}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Articles commandés */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Articles Commandés
                  </h3>
                  <div className="space-y-3">
                    {selectedOrder.items.map((item, index) => (
                      <div key={index} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900 dark:text-white">
                              {item.name}
                            </h4>
                            {item.options && (
                              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                {item.options}
                              </p>
                            )}
                            <div className="flex items-center mt-2 text-sm text-gray-500 dark:text-gray-400">
                              <span>Quantité: {item.quantity}</span>
                              <span className="mx-2">•</span>
                              <span>Prix unitaire: {item.price.toLocaleString()} FCFA</span>
                            </div>
                          </div>
                          <div className="text-lg font-semibold text-green-600 dark:text-green-400">
                            {(item.quantity * item.price).toLocaleString()} FCFA
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    {/* Total */}
                    <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 border-2 border-green-200 dark:border-green-800">
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-semibold text-gray-900 dark:text-white">
                          Total
                        </span>
                        <span className="text-xl font-bold text-green-600 dark:text-green-400">
                          {selectedOrder.totalAmount.toLocaleString()} FCFA
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Instructions spéciales */}
                {selectedOrder.specialInstructions && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      Instructions Spéciales
                    </h3>
                    <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border-l-4 border-blue-400">
                      <p className="text-gray-700 dark:text-gray-300">
                        {selectedOrder.specialInstructions}
                      </p>
                    </div>
                  </div>
                )}

                {/* Informations de livraison */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Informations de Livraison
                  </h3>
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Statut:</span>
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${orderStatuses[selectedOrder.status].color}`}>
                        {orderStatuses[selectedOrder.status].icon}
                        <span className="ml-1">{orderStatuses[selectedOrder.status].label}</span>
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Mode de paiement:</span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {selectedOrder.paymentMethod}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Heure estimée:</span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {selectedOrder.estimatedDelivery.toLocaleTimeString('fr-FR', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                    {selectedOrder.deliveryPerson && (
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Livreur:</span>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {selectedOrder.deliveryPerson}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                  {orderStatuses[selectedOrder.status].actions.map(action => (
                    <button
                      key={action}
                      onClick={() => {
                        updateOrderStatus(selectedOrder.id, action);
                        setShowOrderDetails(false);
                      }}
                      disabled={isUpdatingStatus}
                      className={`flex items-center px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                        action === 'cancel' 
                          ? 'bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/40'
                          : 'bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:hover:bg-blue-900/40'
                      } disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      {isUpdatingStatus ? (
                        <FiRefreshCw className="mr-2 animate-spin" size={16} />
                      ) : (
                        orderStatuses[action]?.icon && React.cloneElement(orderStatuses[action].icon, { className: "mr-2", size: 16 })
                      )}
                      {orderStatuses[action]?.label || action}
                    </button>
                  ))}
                  
                  <button
                    onClick={() => contactCustomer(selectedOrder)}
                    className="flex items-center px-4 py-2 rounded-lg bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/20 dark:text-green-400 dark:hover:bg-green-900/40 font-medium transition-colors"
                  >
                    <FiMessageCircle className="mr-2" size={16} />
                    Contacter
                  </button>
                  
                  <button
                    onClick={() => printReceipt(selectedOrder)}
                    className="flex items-center px-4 py-2 rounded-lg bg-purple-100 text-purple-700 hover:bg-purple-200 dark:bg-purple-900/20 dark:text-purple-400 dark:hover:bg-purple-900/40 font-medium transition-colors"
                  >
                    <FiPrinter className="mr-2" size={16} />
                    Imprimer
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Notification flottante pour les mises à jour */}
        {isUpdatingStatus && (
          <div className="fixed bottom-4 right-4 bg-blue-600 text-white px-6 py-3 rounded-lg shadow-lg flex items-center z-50">
            <FiRefreshCw className="mr-2 animate-spin" size={18} />
            Mise à jour en cours...
          </div>
        )}

        {/* Bouton d'action flottant pour actualiser */}
        <button
          onClick={() => window.location.reload()}
          className="fixed bottom-6 right-6 bg-green-600 hover:bg-green-700 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 z-40"
          title="Actualiser les commandes"
        >
          <FiRefreshCw size={24} />
        </button>
      </div>
      </>
    // {/* </RestaurantLayout> */}
  );
};

export default RestaurantCommand;

export const  OrderContext = createContext();

export const OrderProvider = ({children}) => {

  return(
    <OrderContext.Provider value={mockOrders}>
    {children}
    </OrderContext.Provider>
  )

}