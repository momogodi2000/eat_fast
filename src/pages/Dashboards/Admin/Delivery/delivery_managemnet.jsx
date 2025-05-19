import React, { useState, useEffect } from 'react';
import AdminLayout from '../../../../layouts/admin_layout';
import { motion } from 'framer-motion';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import {
  FiTruck, 
  FiRefreshCw, 
  FiAlertCircle, 
  FiMessageSquare, 
  FiCheckCircle, 
  FiXCircle,
  FiFilter, 
  FiClock, 
  FiPieChart, 
  FiDownload,
  FiCalendar, 
  FiMail, 
  FiPhone,
  FiPlus, 
  FiArrowRight,
  FiSearch,
  FiUser,
  FiStar
} from 'react-icons/fi';
import { HiLocationMarker, HiOutlineLocationMarker } from 'react-icons/hi';
import { useTranslation } from 'react-i18next';
import L from 'leaflet';

// Custom marker icons for leaflet
// We need to define these outside the component to avoid recreation on each render
const createCustomIcon = (color, type) => {
  return L.divIcon({
    className: 'custom-div-icon',
    html: `
      <div style="background-color: ${color}; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 3px 10px rgba(0,0,0,0.3);">
        <svg viewBox="0 0 24 24" width="18" height="18" stroke="white" fill="none" strokeWidth="2">
          ${type === 'bike' ? 
            '<path d="M19 14a5 5 0 1 1-5-5 5 5 0 0 1 5 5zM5 14a5 5 0 1 1-5-5 5 5 0 0 1 5 5z M21 15v-2a4 4 0 0 0-4-4h-3M3 15v-2a4 4 0 0 1 4-4h5l3 4"></path>' : 
            '<path d="M16 8h-2V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-2h2"></path>'}
        </svg>
      </div>
    `,
    iconSize: [30, 30],
    iconAnchor: [15, 15]
  });
};

// Map marker icons
const greenBikeIcon = createCustomIcon('#22c55e', 'bike');
const blueBikeIcon = createCustomIcon('#3b82f6', 'bike');
const redBikeIcon = createCustomIcon('#ef4444', 'bike');
const greenTruckIcon = createCustomIcon('#22c55e', 'truck');
const blueTruckIcon = createCustomIcon('#3b82f6', 'truck');
const redTruckIcon = createCustomIcon('#ef4444', 'truck');

// Dummy delivery data for demo purposes
const generateDummyDeliveries = () => {
  // Centers for Douala and Yaoundé
  const cities = [
    { name: 'Douala', center: [4.0511, 9.7679] },
    { name: 'Yaoundé', center: [3.8480, 11.5021] }
  ];

  const statuses = ['pending', 'en_route', 'delivered', 'delayed'];
  const vehicles = ['moto', 'car'];
  
  const deliveries = [];
  const now = new Date();
  
  // Generate 25 random deliveries
  for (let i = 0; i < 25; i++) {
    const city = cities[Math.floor(Math.random() * cities.length)];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const vehicle = vehicles[Math.floor(Math.random() * vehicles.length)];
    
    // Create random offset from city center
    const latOffset = (Math.random() - 0.5) * 0.05;
    const lngOffset = (Math.random() - 0.5) * 0.05;
    
    // Random delivery time (0-60 minutes from now)
    const estimatedDeliveryTime = new Date(now.getTime() + Math.floor(Math.random() * 60) * 60000);
    
    // Progress percentage
    const progress = status === 'delivered' ? 100 : Math.floor(Math.random() * 90);
    
    deliveries.push({
      id: `DEL-${(1000 + i).toString()}`,
      orderId: `ORD-${(10000 + i).toString()}`,
      customerName: `Client ${i + 1}`,
      customerAddress: `${city.name}, Quartier ${(i % 10) + 1}`,
      position: [city.center[0] + latOffset, city.center[1] + lngOffset],
      status,
      vehicle,
      estimatedDeliveryTime,
      progress,
      restaurantName: `Restaurant ${(i % 8) + 1}`,
      deliveryFee: Math.floor(Math.random() * 1000) + 500,
      orderTotal: Math.floor(Math.random() * 10000) + 2000,
      distance: (Math.random() * 5 + 1).toFixed(1), // km
      driverId: `DRV-${(100 + i % 10).toString()}`,
      driverName: `Livreur ${(i % 10) + 1}`,
      driverRating: (Math.random() * 2 + 3).toFixed(1), // 3-5 stars
      driverPhone: `+237 6${Math.floor(Math.random() * 10)}${Math.floor(Math.random() * 10)} ${Math.floor(Math.random() * 10)}${Math.floor(Math.random() * 10)}${Math.floor(Math.random() * 10)} ${Math.floor(Math.random() * 10)}${Math.floor(Math.random() * 10)}${Math.floor(Math.random() * 10)}`,
    });
  }
  
  return deliveries;
};

// Custom map component to recenter when needed
const MapController = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView(center, map.getZoom());
    }
  }, [center, map]);
  return null;
};

// Main delivery management component
const AdminDeliveryManagement = ({ i18n }) => {
  const { t } = useTranslation();
  const [deliveries, setDeliveries] = useState([]);
  const [selectedDelivery, setSelectedDelivery] = useState(null);
  const [mapCenter, setMapCenter] = useState([4.0511, 9.7679]); // Default to Douala
  const [activeTab, setActiveTab] = useState('all');
  const [filterVehicle, setFilterVehicle] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('estimatedDeliveryTime');
  const [expandedSection, setExpandedSection] = useState('map');
  const [selectedDrivers, setSelectedDrivers] = useState([]);
  const [isAssigning, setIsAssigning] = useState(false);
  const [autoDismissEnabled, setAutoDismissEnabled] = useState(true);

  // Columns config for the table display
  const columns = [
    { key: 'id', label: t('delivery.deliveryId') },
    { key: 'orderId', label: t('delivery.orderId') },
    { key: 'customerName', label: t('delivery.customer') },
    { key: 'restaurantName', label: t('delivery.restaurant') },
    { key: 'status', label: t('delivery.status') },
    { key: 'estimatedDeliveryTime', label: t('delivery.eta') },
    { key: 'driverName', label: t('delivery.driver') },
  ];

  // Load dummy deliveries on component mount
  useEffect(() => {
    setDeliveries(generateDummyDeliveries());
  }, []);

  // Filter deliveries based on active tab, search query, and vehicle filter
  const filteredDeliveries = deliveries.filter(delivery => {
    // Filter by tab (status)
    if (activeTab !== 'all' && delivery.status !== activeTab) {
      return false;
    }
    
    // Filter by vehicle type
    if (filterVehicle !== 'all' && delivery.vehicle !== filterVehicle) {
      return false;
    }
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        delivery.id.toLowerCase().includes(query) ||
        delivery.orderId.toLowerCase().includes(query) ||
        delivery.customerName.toLowerCase().includes(query) ||
        delivery.restaurantName.toLowerCase().includes(query) ||
        delivery.driverName.toLowerCase().includes(query)
      );
    }
    
    return true;
  });
  
  // Sort filtered deliveries
  const sortedDeliveries = [...filteredDeliveries].sort((a, b) => {
    if (sortBy === 'estimatedDeliveryTime') {
      return new Date(a.estimatedDeliveryTime) - new Date(b.estimatedDeliveryTime);
    } else if (sortBy === 'distance') {
      return parseFloat(a.distance) - parseFloat(b.distance);
    } else if (sortBy === 'status') {
      const statusOrder = { pending: 0, en_route: 1, delayed: 2, delivered: 3 };
      return statusOrder[a.status] - statusOrder[b.status];
    }
    return 0;
  });
  
  // Handle marker click on map
  const handleMarkerClick = (delivery) => {
    setSelectedDelivery(delivery);
    setMapCenter(delivery.position);
  };
  
  // Handle delivery selection from list
  const handleDeliverySelect = (delivery) => {
    setSelectedDelivery(delivery);
    setMapCenter(delivery.position);
  };
  
  // Get marker icon based on delivery status and vehicle
  const getMarkerIcon = (status, vehicle) => {
    if (status === 'en_route') {
      return vehicle === 'moto' ? greenBikeIcon : greenTruckIcon;
    } else if (status === 'pending') {
      return vehicle === 'moto' ? blueBikeIcon : blueTruckIcon;
    } else {
      return vehicle === 'moto' ? redBikeIcon : redTruckIcon;
    }
  };
  
  // Get status color for UI elements
  const getStatusColor = (status) => {
    switch(status) {
      case 'pending': return 'bg-blue-500';
      case 'en_route': return 'bg-green-500';
      case 'delivered': return 'bg-green-700';
      case 'delayed': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };
  
  // Get translated status text
  const getStatusText = (status) => {
    switch(status) {
      case 'pending': return t('delivery.pending');
      case 'en_route': return t('delivery.enRoute');
      case 'delivered': return t('delivery.delivered');
      case 'delayed': return t('delivery.delayed');
      default: return status;
    }
  };
  
  // Handle driver assignment
  const handleAssignDriver = () => {
    if (selectedDrivers.length && selectedDelivery) {
      // In a real app, this would make API calls to update the assignments
      setIsAssigning(true);
      
      // Simulate API call delay
      setTimeout(() => {
        const updatedDeliveries = deliveries.map(del => {
          if (del.id === selectedDelivery.id) {
            return {
              ...del,
              driverId: selectedDrivers[0].id,
              driverName: selectedDrivers[0].name,
              driverPhone: selectedDrivers[0].phone,
              driverRating: selectedDrivers[0].rating,
              status: 'en_route'
            };
          }
          return del;
        });
        
        setDeliveries(updatedDeliveries);
        setSelectedDelivery(updatedDeliveries.find(d => d.id === selectedDelivery.id));
        setSelectedDrivers([]);
        setIsAssigning(false);
      }, 1500);
    }
  };
  
  // Generate dummy available drivers
  const availableDrivers = Array(5).fill().map((_, i) => ({
    id: `DRV-${(200 + i).toString()}`,
    name: `Livreur ${(20 + i)}`,
    vehicle: i % 2 === 0 ? 'moto' : 'car',
    rating: (Math.random() * 2 + 3).toFixed(1),
    phone: `+237 6${Math.floor(Math.random() * 10)}${Math.floor(Math.random() * 10)} ${Math.floor(Math.random() * 10)}${Math.floor(Math.random() * 10)}${Math.floor(Math.random() * 10)} ${Math.floor(Math.random() * 10)}${Math.floor(Math.random() * 10)}${Math.floor(Math.random() * 10)}`,
    distance: (Math.random() * 3 + 0.5).toFixed(1),
    available: true
  }));
  
  // Format date for display
  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString(i18n.language === 'fr' ? 'fr-FR' : 'en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };
  
  // Get analytics data for dashboard
  const getAnalyticsData = () => {
    const totalDeliveries = deliveries.length;
    const pendingCount = deliveries.filter(d => d.status === 'pending').length;
    const enRouteCount = deliveries.filter(d => d.status === 'en_route').length;
    const deliveredCount = deliveries.filter(d => d.status === 'delivered').length;
    const delayedCount = deliveries.filter(d => d.status === 'delayed').length;
    
    const pendingPercent = Math.round((pendingCount / totalDeliveries) * 100);
    const enRoutePercent = Math.round((enRouteCount / totalDeliveries) * 100);
    const deliveredPercent = Math.round((deliveredCount / totalDeliveries) * 100);
    const delayedPercent = Math.round((delayedCount / totalDeliveries) * 100);
    
    return {
      totalDeliveries,
      pending: { count: pendingCount, percent: pendingPercent },
      enRoute: { count: enRouteCount, percent: enRoutePercent },
      delivered: { count: deliveredCount, percent: deliveredPercent },
      delayed: { count: delayedCount, percent: delayedPercent }
    };
  };
  
  const analyticsData = getAnalyticsData();

  return (
    <AdminLayout>
      <div className="flex flex-col h-full animate-fadeIn">
        {/* Page Header */}
        <motion.div 
          className="mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold mb-2 flex items-center">
                <FiTruck className="mr-3 text-green-600 dark:text-yellow-400" size={28} />
                {t('delivery.managementTitle')}
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                {t('delivery.subtitle')}
              </p>
            </div>
            
            <div className="mt-4 md:mt-0 flex items-center space-x-3">
              <div className="relative">
                <input
                  type="text"
                  className="form-input pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white w-full"
                  placeholder={t('delivery.searchPlaceholder')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <FiSearch className="absolute left-3 top-3 text-gray-400" size={18} />
              </div>
              
              <select
                className="form-select rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                value={filterVehicle}
                onChange={(e) => setFilterVehicle(e.target.value)}
              >
                <option value="all">{t('delivery.allVehicles')}</option>
                <option value="moto">{t('delivery.motorcycle')}</option>
                <option value="car">{t('delivery.car')}</option>
              </select>
              
              <button 
                className="flex items-center justify-center p-2 bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800 text-white rounded-lg transition-colors duration-200"
                onClick={() => setDeliveries(generateDummyDeliveries())}
                title={t('delivery.refresh')}
              >
                <FiRefreshCw size={20} />
              </button>
            </div>
          </div>
        </motion.div>
        
        {/* Status Tabs */}
        <motion.div 
          className="flex flex-nowrap overflow-x-auto mb-6 pb-2"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <button
            className={`flex items-center px-4 py-2 rounded-lg mr-2 whitespace-nowrap transition-colors duration-200 ${
              activeTab === 'all' 
                ? 'bg-green-600 text-white dark:bg-green-800'
                : 'bg-white dark:bg-gray-800 hover:bg-green-100 dark:hover:bg-green-900 text-gray-700 dark:text-gray-200'
            }`}
            onClick={() => setActiveTab('all')}
          >
            {t('delivery.allDeliveries')}
            <span className="ml-2 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-2 py-0.5 text-xs rounded-full">
              {deliveries.length}
            </span>
          </button>
          
          <button
            className={`flex items-center px-4 py-2 rounded-lg mr-2 whitespace-nowrap transition-colors duration-200 ${
              activeTab === 'pending' 
                ? 'bg-blue-600 text-white'
                : 'bg-white dark:bg-gray-800 hover:bg-blue-100 dark:hover:bg-blue-900 text-gray-700 dark:text-gray-200'
            }`}
            onClick={() => setActiveTab('pending')}
          >
            {t('delivery.pending')}
            <span className="ml-2 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-2 py-0.5 text-xs rounded-full">
              {analyticsData.pending.count}
            </span>
          </button>
          
          <button
            className={`flex items-center px-4 py-2 rounded-lg mr-2 whitespace-nowrap transition-colors duration-200 ${
              activeTab === 'en_route' 
                ? 'bg-green-600 text-white'
                : 'bg-white dark:bg-gray-800 hover:bg-green-100 dark:hover:bg-green-900 text-gray-700 dark:text-gray-200'
            }`}
            onClick={() => setActiveTab('en_route')}
          >
            {t('delivery.enRoute')}
            <span className="ml-2 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-2 py-0.5 text-xs rounded-full">
              {analyticsData.enRoute.count}
            </span>
          </button>
          
          <button
            className={`flex items-center px-4 py-2 rounded-lg mr-2 whitespace-nowrap transition-colors duration-200 ${
              activeTab === 'delivered' 
                ? 'bg-green-800 text-white'
                : 'bg-white dark:bg-gray-800 hover:bg-green-100 dark:hover:bg-green-900 text-gray-700 dark:text-gray-200'
            }`}
            onClick={() => setActiveTab('delivered')}
          >
            {t('delivery.delivered')}
            <span className="ml-2 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-2 py-0.5 text-xs rounded-full">
              {analyticsData.delivered.count}
            </span>
          </button>
          
          <button
            className={`flex items-center px-4 py-2 rounded-lg mr-2 whitespace-nowrap transition-colors duration-200 ${
              activeTab === 'delayed' 
                ? 'bg-red-600 text-white'
                : 'bg-white dark:bg-gray-800 hover:bg-red-100 dark:hover:bg-red-900 text-gray-700 dark:text-gray-200'
            }`}
            onClick={() => setActiveTab('delayed')}
          >
            {t('delivery.delayed')}
            <span className="ml-2 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-2 py-0.5 text-xs rounded-full">
              {analyticsData.delayed.count}
            </span>
          </button>
        </motion.div>
        
        {/* Dashboard Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
          {/* Left Column - Map View */}
          <motion.div 
            className={`bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden ${expandedSection === 'map' ? 'lg:col-span-2' : 'lg:col-span-1'}`}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <h2 className="text-lg font-semibold flex items-center">
                <HiLocationMarker className="mr-2 text-green-600 dark:text-yellow-400" size={20} />
                {t('delivery.liveTracking')}
              </h2>
              <div className="flex space-x-2">
                <button
                  className={`p-2 rounded-md transition-colors duration-200 ${
                    expandedSection === 'map' 
                      ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100' 
                      : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300'
                  }`}
                  onClick={() => setExpandedSection(expandedSection === 'map' ? '' : 'map')}
                  title={expandedSection === 'map' ? t('delivery.collapse') : t('delivery.expand')}
                >
                  {expandedSection === 'map' ? 
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="4 14 10 14 10 20"></polyline>
                      <polyline points="20 10 14 10 14 4"></polyline>
                      <line x1="14" y1="10" x2="21" y2="3"></line>
                      <line x1="3" y1="21" x2="10" y2="14"></line>
                    </svg> :
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="15 3 21 3 21 9"></polyline>
                      <polyline points="9 21 3 21 3 15"></polyline>
                      <line x1="21" y1="3" x2="14" y2="10"></line>
                      <line x1="3" y1="21" x2="10" y2="14"></line>
                    </svg>
                  }
                </button>
                <button
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors duration-200 text-gray-600 dark:text-gray-300"
                  onClick={() => {
                    if (selectedDelivery) {
                      setMapCenter(selectedDelivery.position);
                    }
                  }}
                  title={t('delivery.centerMap')}
                  disabled={!selectedDelivery}
                >
                  <HiOutlineLocationMarker size={20} />
                </button>
              </div>
            </div>
            
            <div className="h-96">
              <MapContainer 
                center={mapCenter} 
                zoom={14} 
                style={{ height: '100%', width: '100%' }}
                zoomControl={false}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <MapController center={mapCenter} />
                {sortedDeliveries.map((delivery) => (
                  <Marker
                    key={delivery.id}
                    position={delivery.position}
                    icon={getMarkerIcon(delivery.status, delivery.vehicle)}
                    eventHandlers={{
                      click: () => handleMarkerClick(delivery),
                    }}
                  >
                    <Popup>
                      <div className="text-sm">
                        <p className="font-semibold">{delivery.id} - {delivery.orderId}</p>
                        <p><span className="font-medium">{t('delivery.customer')}:</span> {delivery.customerName}</p>
                        <p><span className="font-medium">{t('delivery.from')}:</span> {delivery.restaurantName}</p>
                        <p><span className="font-medium">{t('delivery.status')}:</span> {getStatusText(delivery.status)}</p>
                        <p><span className="font-medium">{t('delivery.driver')}:</span> {delivery.driverName}</p>
                        <p><span className="font-medium">{t('delivery.eta')}:</span> {formatTime(delivery.estimatedDeliveryTime)}</p>
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            </div>
            
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex flex-wrap items-center space-x-1 md:space-x-4">
                <div className="flex items-center space-x-1 mb-2">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span className="text-sm">{t('delivery.enRoute')}</span>
                </div>
                <div className="flex items-center space-x-1 mb-2">
                  <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                  <span className="text-sm">{t('delivery.pending')}</span>
                </div>
                <div className="flex items-center space-x-1 mb-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <span className="text-sm">{t('delivery.delayed')}</span>
                </div>
                <div className="flex items-center space-x-1 mb-2">
                  <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" fill="none" strokeWidth="2">
                    <path d="M19 14a5 5 0 1 1-5-5 5 5 0 0 1 5 5zM5 14a5 5 0 1 1-5-5 5 5 0 0 1 5 5z M21 15v-2a4 4 0 0 0-4-4h-3M3 15v-2a4 4 0 0 1 4-4h5l3 4"></path>
                  </svg>
                  <span className="text-sm">{t('delivery.motorcycle')}</span>
                </div>
                <div className="flex items-center space-x-1 mb-2">
                  <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" fill="none" strokeWidth="2">
                  <path d="M16 8h-2V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-2h2"></path>
                  </svg>
                  <span className="text-sm">{t('delivery.car')}</span>
                </div>
              </div>
            </div>
          </motion.div>
          
          {/* Right Column - Delivery Details / Analytics */}
          <motion.div 
            className={`bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden flex flex-col ${expandedSection === 'details' ? 'lg:col-span-2' : 'lg:col-span-1'}`}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.3 }}
          >
            {selectedDelivery ? (
              <>
                <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                  <h2 className="text-lg font-semibold flex items-center">
                    <FiTruck className="mr-2 text-green-600 dark:text-yellow-400" size={20} />
                    {t('delivery.deliveryDetails')}
                  </h2>
                  <div className="flex space-x-2">
                    <button
                      className={`p-2 rounded-md transition-colors duration-200 ${
                        expandedSection === 'details' 
                          ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100' 
                          : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300'
                      }`}
                      onClick={() => setExpandedSection(expandedSection === 'details' ? '' : 'details')}
                      title={expandedSection === 'details' ? t('delivery.collapse') : t('delivery.expand')}
                    >
                      {expandedSection === 'details' ? 
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="4 14 10 14 10 20"></polyline>
                          <polyline points="20 10 14 10 14 4"></polyline>
                          <line x1="14" y1="10" x2="21" y2="3"></line>
                          <line x1="3" y1="21" x2="10" y2="14"></line>
                        </svg> :
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="15 3 21 3 21 9"></polyline>
                          <polyline points="9 21 3 21 3 15"></polyline>
                          <line x1="21" y1="3" x2="14" y2="10"></line>
                          <line x1="3" y1="21" x2="10" y2="14"></line>
                        </svg>
                      }
                    </button>
                    <button
                      className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors duration-200 text-gray-600 dark:text-gray-300"
                      onClick={() => setSelectedDelivery(null)}
                      title={t('delivery.close')}
                    >
                      <FiXCircle size={20} />
                    </button>
                  </div>
                </div>
                
                <div className="p-4 flex-grow overflow-y-auto">
                  <div className="mb-6">
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center">
                        <span className={`inline-block w-3 h-3 rounded-full mr-2 ${getStatusColor(selectedDelivery.status)}`}></span>
                        <h3 className="text-lg font-semibold mr-2">{selectedDelivery.id}</h3>
                        <span className="text-sm bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded-full">
                          {selectedDelivery.orderId}
                        </span>
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${selectedDelivery.status === 'delayed' ? 'bg-red-500' : 'bg-green-500'}`}
                          style={{ width: `${selectedDelivery.progress}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between mt-1 text-xs text-gray-500 dark:text-gray-400">
                        <span>{t('delivery.orderPlaced')}</span>
                        <span>{t('delivery.delivery')}</span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
                        <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                          {t('delivery.customer')}
                        </h4>
                        <p className="font-medium mb-1">{selectedDelivery.customerName}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-300 flex items-start">
                          <HiLocationMarker className="mr-1 mt-0.5 flex-shrink-0" />
                          {selectedDelivery.customerAddress}
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
                        <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                          {t('delivery.restaurant')}
                        </h4>
                        <p className="font-medium mb-1">{selectedDelivery.restaurantName}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          {t('delivery.distanceKm', { distance: selectedDelivery.distance })}
                        </p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                      <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
                        <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                          {t('delivery.deliveryFee')}
                        </h4>
                        <p className="font-medium">
                          {new Intl.NumberFormat(i18n.language === 'fr' ? 'fr-FR' : 'en-US', {
                            style: 'currency',
                            currency: 'XAF',
                            maximumFractionDigits: 0
                          }).format(selectedDelivery.deliveryFee)}
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
                        <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                          {t('delivery.orderTotal')}
                        </h4>
                        <p className="font-medium">
                          {new Intl.NumberFormat(i18n.language === 'fr' ? 'fr-FR' : 'en-US', {
                            style: 'currency',
                            currency: 'XAF',
                            maximumFractionDigits: 0
                          }).format(selectedDelivery.orderTotal)}
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
                        <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                          {t('delivery.eta')}
                        </h4>
                        <p className={`font-medium ${selectedDelivery.status === 'delayed' ? 'text-red-600 dark:text-red-400' : ''}`}>
                          {formatTime(selectedDelivery.estimatedDeliveryTime)}
                        </p>
                      </div>
                    </div>
                    
                    {/* Driver Section */}
                    <div className="mb-4">
                      <h4 className="font-medium mb-3 flex items-center">
                        <FiUser className="mr-2" />
                        {t('delivery.driverDetails')}
                      </h4>
                      
                      {selectedDelivery.driverId ? (
                        <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <div>
                              <p className="font-medium">{selectedDelivery.driverName}</p>
                              <div className="flex items-center text-sm text-gray-600 dark:text-gray-300 mt-1">
                                <span className="flex items-center mr-4">
                                  <FiStar className="mr-1 text-yellow-500" />
                                  {selectedDelivery.driverRating}
                                </span>
                                <span className="flex items-center">
                                  {selectedDelivery.vehicle === 'moto' ? (
                                    <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" fill="none" strokeWidth="2" className="mr-1">
                                      <path d="M19 14a5 5 0 1 1-5-5 5 5 0 0 1 5 5zM5 14a5 5 0 1 1-5-5 5 5 0 0 1 5 5z M21 15v-2a4 4 0 0 0-4-4h-3M3 15v-2a4 4 0 0 1 4-4h5l3 4"></path>
                                    </svg>
                                  ) : (
                                    <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" fill="none" strokeWidth="2" className="mr-1">
                                      <path d="M16 8h-2V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-2h2"></path>
                                    </svg>
                                  )}
                                  {selectedDelivery.vehicle === 'moto' ? t('delivery.motorcycle') : t('delivery.car')}
                                </span>
                              </div>
                            </div>
                            
                            <div className="flex space-x-2">
                              <button 
                                className="p-2 bg-green-100 hover:bg-green-200 dark:bg-green-900 dark:hover:bg-green-800 text-green-700 dark:text-green-300 rounded-full"
                                title={t('delivery.call')}
                              >
                                <FiPhone size={18} />
                              </button>
                              <button 
                                className="p-2 bg-blue-100 hover:bg-blue-200 dark:bg-blue-900 dark:hover:bg-blue-800 text-blue-700 dark:text-blue-300 rounded-full"
                                title={t('delivery.message')}
                              >
                                <FiMessageSquare size={18} />
                              </button>
                            </div>
                          </div>
                          
                          <p className="text-sm text-gray-600 dark:text-gray-300 flex items-center">
                            <FiPhone className="mr-1 text-gray-400" size={14} />
                            {selectedDelivery.driverPhone}
                          </p>
                        </div>
                      ) : (
                        <div className="bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-800 p-3 rounded-lg">
                          <p className="text-sm flex items-center">
                            <FiAlertCircle className="mr-2 text-yellow-500" />
                            {t('delivery.noDriverAssigned')}
                          </p>
                          
                          <button
                            className="mt-3 bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800 text-white px-4 py-2 rounded-lg flex items-center text-sm transition-colors duration-200"
                            onClick={() => setIsAssigning(!isAssigning)}
                          >
                            <FiPlus className="mr-2" />
                            {t('delivery.assignDriver')}
                          </button>
                          
                          {isAssigning && (
                            <div className="mt-3 border-t border-yellow-200 dark:border-yellow-800 pt-3">
                              <h5 className="font-medium text-sm mb-2">{t('delivery.availableDrivers')}:</h5>
                              
                              <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                                {availableDrivers.map(driver => (
                                  <div 
                                    key={driver.id}
                                    className={`p-2 rounded-lg border transition-colors duration-200 cursor-pointer ${
                                      selectedDrivers.some(d => d.id === driver.id)
                                        ? 'bg-green-100 dark:bg-green-900/50 border-green-300 dark:border-green-700'
                                        : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-green-300 dark:hover:border-green-700'
                                    }`}
                                    onClick={() => setSelectedDrivers([driver])}
                                  >
                                    <div className="flex items-center justify-between">
                                      <div>
                                        <p className="font-medium text-sm">{driver.name}</p>
                                        <div className="flex items-center text-xs text-gray-600 dark:text-gray-300 mt-1">
                                          <span className="flex items-center mr-4">
                                            <FiStar className="mr-1 text-yellow-500" />
                                            {driver.rating}
                                          </span>
                                          <span className="flex items-center">
                                            {driver.vehicle === 'moto' ? (
                                              <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" fill="none" strokeWidth="2" className="mr-1">
                                                <path d="M19 14a5 5 0 1 1-5-5 5 5 0 0 1 5 5zM5 14a5 5 0 1 1-5-5 5 5 0 0 1 5 5z M21 15v-2a4 4 0 0 0-4-4h-3M3 15v-2a4 4 0 0 1 4-4h5l3 4"></path>
                                              </svg>
                                            ) : (
                                              <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" fill="none" strokeWidth="2" className="mr-1">
                                                <path d="M16 8h-2V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-2h2"></path>
                                              </svg>
                                            )}
                                            {driver.vehicle === 'moto' ? t('delivery.motorcycle') : t('delivery.car')}
                                          </span>
                                        </div>
                                      </div>
                                      <div className="text-xs">
                                        <span className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">
                                          {t('delivery.distanceKm', { distance: driver.distance })}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                              
                              <div className="mt-3 flex justify-end space-x-2">
                                <button
                                  className="bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 px-3 py-1 rounded text-sm transition-colors duration-200"
                                  onClick={() => {
                                    setIsAssigning(false);
                                    setSelectedDrivers([]);
                                  }}
                                >
                                  {t('common.cancel')}
                                </button>
                                <button
                                  className="bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800 text-white px-3 py-1 rounded text-sm flex items-center transition-colors duration-200"
                                  onClick={handleAssignDriver}
                                  disabled={selectedDrivers.length === 0}
                                >
                                  {t('delivery.confirm')}
                                  <FiArrowRight className="ml-2" />
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                    
                    {/* Actions Footer */}
                    <div className="mt-6 flex flex-wrap justify-end space-x-0 space-y-2 sm:space-x-2 sm:space-y-0">
                      {selectedDelivery.status === 'pending' && (
                        <button
                          className="w-full sm:w-auto bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800 text-white px-4 py-2 rounded-lg flex items-center justify-center transition-colors duration-200"
                        >
                          <FiTruck className="mr-2" />
                          {t('delivery.startDelivery')}
                        </button>
                      )}
                      
                      {selectedDelivery.status === 'en_route' && (
                        <button
                          className="w-full sm:w-auto bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800 text-white px-4 py-2 rounded-lg flex items-center justify-center transition-colors duration-200"
                        >
                          <FiCheckCircle className="mr-2" />
                          {t('delivery.markAsDelivered')}
                        </button>
                      )}
                      
                      {selectedDelivery.status !== 'delivered' && (
                        <button
                          className="w-full sm:w-auto bg-red-100 hover:bg-red-200 dark:bg-red-900/50 dark:hover:bg-red-900/70 text-red-700 dark:text-red-300 px-4 py-2 rounded-lg flex items-center justify-center transition-colors duration-200"
                        >
                          <FiAlertCircle className="mr-2" />
                          {selectedDelivery.status === 'delayed' ? t('delivery.resolveIssue') : t('delivery.reportIssue')}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                  <h2 className="text-lg font-semibold flex items-center">
                    <FiPieChart className="mr-2 text-green-600 dark:text-yellow-400" size={20} />
                    {t('delivery.analytics')}
                  </h2>
                  <div className="flex space-x-2">
                    <button
                      className={`p-2 rounded-md transition-colors duration-200 ${
                        expandedSection === 'details' 
                          ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100' 
                          : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300'
                      }`}
                      onClick={() => setExpandedSection(expandedSection === 'details' ? '' : 'details')}
                      title={expandedSection === 'details' ? t('delivery.collapse') : t('delivery.expand')}
                    >
                      {expandedSection === 'details' ? 
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="4 14 10 14 10 20"></polyline>
                          <polyline points="20 10 14 10 14 4"></polyline>
                          <line x1="14" y1="10" x2="21" y2="3"></line>
                          <line x1="3" y1="21" x2="10" y2="14"></line>
                        </svg> :
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="15 3 21 3 21 9"></polyline>
                          <polyline points="9 21 3 21 3 15"></polyline>
                          <line x1="21" y1="3" x2="14" y2="10"></line>
                          <line x1="3" y1="21" x2="10" y2="14"></line>
                        </svg>
                      }
                    </button>
                    <button
                      className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors duration-200 text-gray-600 dark:text-gray-300"
                      title={t('delivery.download')}
                    >
                      <FiDownload size={20} />
                    </button>
                  </div>
                </div>
                
                <div className="p-4 flex-grow">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
                      <div className="flex items-center justify-between mb-2">
                        <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
                          <FiClock className="text-blue-600 dark:text-blue-400" size={20} />
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">{t('delivery.today')}</span>
                      </div>
                      <h3 className="text-2xl font-bold mb-1">{analyticsData.totalDeliveries}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{t('delivery.totalDeliveries')}</p>
                    </div>
                    
                    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
                      <div className="flex items-center justify-between mb-2">
                        <div className="p-2 bg-green-100 dark:bg-green-900/50 rounded-lg">
                          <FiCheckCircle className="text-green-600 dark:text-green-400" size={20} />
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">{t('delivery.completed')}</span>
                      </div>
                      <h3 className="text-2xl font-bold mb-1">{analyticsData.delivered.count}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{t('delivery.completedDeliveries')}</p>
                    </div>
                    
                    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
                      <div className="flex items-center justify-between mb-2">
                        <div className="p-2 bg-yellow-100 dark:bg-yellow-900/50 rounded-lg">
                          <FiTruck className="text-yellow-600 dark:text-yellow-400" size={20} />
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">{t('delivery.ongoing')}</span>
                      </div>
                      <h3 className="text-2xl font-bold mb-1">{analyticsData.enRoute.count}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{t('delivery.ongoingDeliveries')}</p>
                    </div>
                    
                    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
                      <div className="flex items-center justify-between mb-2">
                        <div className="p-2 bg-red-100 dark:bg-red-900/50 rounded-lg">
                          <FiAlertCircle className="text-red-600 dark:text-red-400" size={20} />
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">{t('delivery.issues')}</span>
                      </div>
                      <h3 className="text-2xl font-bold mb-1">{analyticsData.delayed.count}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{t('delivery.delayedDeliveries')}</p>
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-4">{t('delivery.deliveryOverview')}</h3>
                    
                    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm">{t('delivery.pending')}</span>
                            <span className="text-sm font-medium">{analyticsData.pending.percent}%</span>
                          </div>
                          <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
                            <div className="h-full bg-blue-500 rounded-full" style={{ width: `${analyticsData.pending.percent}%` }}></div>
                          </div>
                        </div>
                        
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm">{t('delivery.enRoute')}</span>
                            <span className="text-sm font-medium">{analyticsData.enRoute.percent}%</span>
                          </div>
                          <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
                            <div className="h-full bg-green-500 rounded-full" style={{ width: `${analyticsData.enRoute.percent}%` }}></div>
                          </div>
                        </div>
                        
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm">{t('delivery.delivered')}</span>
                            <span className="text-sm font-medium">{analyticsData.delivered.percent}%</span>
                          </div>
                          <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
                            <div className="h-full bg-green-700 rounded-full" style={{ width: `${analyticsData.delivered.percent}%` }}></div>
                          </div>
                        </div>
                        
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm">{t('delivery.delayed')}</span>
                            <span className="text-sm font-medium">{analyticsData.delayed.percent}%</span>
                          </div>
                          <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
                            <div className="h-full bg-red-500 rounded-full" style={{ width: `${analyticsData.delayed.percent}%` }}></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold mb-4">{t('delivery.recentActivity')}</h3>
                    
                    <div className="space-y-3">
                      {sortedDeliveries.slice(0, 5).map(delivery => (
                        <div 
                          key={delivery.id}
                          className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-green-300 dark:hover:border-green-700 cursor-pointer transition-colors duration-200"
                          onClick={() => handleDeliverySelect(delivery)}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <span className={`w-2 h-2 rounded-full mr-2 ${getStatusColor(delivery.status)}`}></span>
                              <span className="font-medium text-sm">{delivery.id}</span>
                            </div>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {formatTime(delivery.estimatedDeliveryTime)}
                            </span>
                          </div>
                          <div className="flex justify-between mt-1 text-sm">
                            <span className="text-gray-600 dark:text-gray-300">{delivery.customerName}</span>
                            <span className="text-gray-500 dark:text-gray-400">{delivery.driverName}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        </div>
        
        {/* Delivery List Table (shown when no delivery is selected) */}
        {!selectedDelivery && (
          <motion.div 
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md mt-6 overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.4 }}
          >
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <h2 className="text-lg font-semibold">{t('delivery.allDeliveries')}</h2>
              <div className="flex items-center space-x-2">
                <div className="flex items-center text-sm">
                  <span className="mr-2">{t('delivery.sortBy')}:</span>
                  <select
                    className="form-select text-sm rounded border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                  >
                    <option value="estimatedDeliveryTime">{t('delivery.eta')}</option>
                    <option value="distance">{t('delivery.distance')}</option>
                    <option value="status">{t('delivery.status')}</option>
                  </select>
                </div>
                <button 
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors duration-200 text-gray-600 dark:text-gray-300"
                  title={t('delivery.download')}
                >
                  <FiDownload size={18} />
                </button>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    {columns.map(column => (
                      <th 
                        key={column.key}
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                      >
                        {column.label}
                      </th>
                    ))}
                    <th scope="col" className="relative px-6 py-3">
                      <span className="sr-only">{t('common.actions')}</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {sortedDeliveries.map(delivery => (
                    <tr 
                      key={delivery.id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer transition-colors duration-150"
                      onClick={() => handleDeliverySelect(delivery)}
                    >
                      {columns.map(column => (
                        <td key={`${delivery.id}-${column.key}`} className="px-6 py-4 whitespace-nowrap">
                          {column.key === 'status' ? (
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(delivery.status)} text-white`}>
                              {getStatusText(delivery.status)}
                            </span>
                          ) : column.key === 'estimatedDeliveryTime' ? (
                            <div className="text-sm text-gray-900 dark:text-gray-100">
                              {formatTime(delivery.estimatedDeliveryTime)}
                            </div>
                          ) : (
                            <div className="text-sm text-gray-900 dark:text-gray-100">
                              {delivery[column.key]}
                            </div>
                          )}
                        </td>
                      ))}
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          className="text-green-600 dark:text-green-400 hover:text-green-900 dark:hover:text-green-300"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeliverySelect(delivery);
                          }}
                        >
                          {t('common.view')}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 flex items-center justify-between border-t border-gray-200 dark:border-gray-700 sm:px-6">
              <div className="flex-1 flex justify-between sm:hidden">
                <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700">
                  {t('common.previous')}
                </button>
                <button className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700">
                  {t('common.next')}
                </button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    {t('common.showing')} <span className="font-medium">1</span> {t('common.to')} <span className="font-medium">10</span> {t('common.of')} <span className="font-medium">{sortedDeliveries.length}</span> {t('common.results')}
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                    <button className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
                      <span className="sr-only">{t('common.previous')}</span>
                      <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </button>
                    <button aria-current="page" className="z-10 bg-green-50 dark:bg-green-900/50 border-green-500 dark:border-green-700 text-green-600 dark:text-green-400 relative inline-flex items-center px-4 py-2 border text-sm font-medium">
                      1
                    </button>
                    <button className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 relative inline-flex items-center px-4 py-2 border text-sm font-medium">
                      2
                    </button>
                    <button className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 relative inline-flex items-center px-4 py-2 border text-sm font-medium">
                      3
                    </button>
                    <button className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
                      <span className="sr-only">{t('common.next')}</span>
                      <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminDeliveryManagement;