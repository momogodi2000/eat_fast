import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../../../../layouts/admin_layout';
import { FiSearch, FiPlusCircle, FiFilter, FiEye, FiEdit, FiTrash2, FiCheckCircle, FiXCircle } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';

// Mock data for restaurants
const mockRestaurants = [
  {
    id: 1,
    name: "Le Gourmet",
    cuisine: "Traditionnel Camerounais",
    location: "Douala, Akwa",
    rating: 4.7,
    status: "active",
    orders: 238,
    created: "2024-11-15",
    image: "/api/placeholder/60/60"
  },
  {
    id: 2,
    name: "Saveur Rapide",
    cuisine: "Fast Food",
    location: "Yaoundé, Centre",
    rating: 4.2,
    status: "active",
    orders: 156,
    created: "2025-01-05",
    image: "/api/placeholder/60/60"
  },
  {
    id: 3,
    name: "Chef Palace",
    cuisine: "International",
    location: "Douala, Bonanjo",
    rating: 4.8,
    status: "pending",
    orders: 42,
    created: "2025-03-20",
    image: "/api/placeholder/60/60"
  },
  {
    id: 4,
    name: "Mami Nyanga",
    cuisine: "Fruits de mer",
    location: "Kribi, Centre-ville",
    rating: 4.5,
    status: "active",
    orders: 189,
    created: "2024-12-12",
    image: "/api/placeholder/60/60"
  },
  {
    id: 5,
    name: "La Fourchette d'Or",
    cuisine: "Français",
    location: "Yaoundé, Bastos",
    rating: 4.6,
    status: "inactive",
    orders: 95,
    created: "2025-01-18",
    image: "/api/placeholder/60/60"
  },
  {
    id: 6,
    name: "Délices d'Afrique",
    cuisine: "Panafricain",
    location: "Douala, Bonapriso",
    rating: 4.3,
    status: "active",
    orders: 124,
    created: "2025-02-01",
    image: "/api/placeholder/60/60"
  },
  {
    id: 7,
    name: "Baobab Fusion",
    cuisine: "Fusion",
    location: "Buea, Molyko",
    rating: 4.1,
    status: "pending",
    orders: 78,
    created: "2025-03-10",
    image: "/api/placeholder/60/60"
  },
];

const RestaurantsList = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [restaurants, setRestaurants] = useState([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterCuisine, setFilterCuisine] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedRestaurants, setSelectedRestaurants] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'ascending' });

  // Fetch restaurants data
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setRestaurants(mockRestaurants);
      setFilteredRestaurants(mockRestaurants);
      setIsLoading(false);
    }, 800);
  }, []);

  // Handle search and filters
  useEffect(() => {
    let results = restaurants;
    
    // Apply search term filter
    if (searchTerm) {
      results = results.filter(restaurant => 
        restaurant.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        restaurant.cuisine.toLowerCase().includes(searchTerm.toLowerCase()) ||
        restaurant.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply status filter
    if (filterStatus !== 'all') {
      results = results.filter(restaurant => restaurant.status === filterStatus);
    }
    
    // Apply cuisine filter
    if (filterCuisine !== 'all') {
      results = results.filter(restaurant => restaurant.cuisine === filterCuisine);
    }
    
    // Apply sorting
    if (sortConfig.key) {
      results = [...results].sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    
    setFilteredRestaurants(results);
  }, [searchTerm, filterStatus, filterCuisine, restaurants, sortConfig]);

  // Request sort
  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  // Handle checkbox selection
  const handleSelectRestaurant = (id) => {
    if (selectedRestaurants.includes(id)) {
      setSelectedRestaurants(selectedRestaurants.filter(restId => restId !== id));
    } else {
      setSelectedRestaurants([...selectedRestaurants, id]);
    }
  };

  // Handle select all
  const handleSelectAll = () => {
    if (selectedRestaurants.length === filteredRestaurants.length) {
      setSelectedRestaurants([]);
    } else {
      setSelectedRestaurants(filteredRestaurants.map(rest => rest.id));
    }
  };

  // Handle restaurant deletion
  const handleDeleteRestaurant = (id) => {
    if (window.confirm(t('confirmDelete'))) {
      setRestaurants(restaurants.filter(rest => rest.id !== id));
    }
  };

  // Handle bulk delete
  const handleBulkDelete = () => {
    if (selectedRestaurants.length === 0) return;
    if (window.confirm(t('confirmDeleteMultiple'))) {
      setRestaurants(restaurants.filter(rest => !selectedRestaurants.includes(rest.id)));
      setSelectedRestaurants([]);
    }
  };

  // Handle status toggle
  const handleStatusToggle = (id, currentStatus) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    setRestaurants(restaurants.map(rest => 
      rest.id === id ? { ...rest, status: newStatus } : rest
    ));
  };

  // Available cuisines for filter
  const cuisineTypes = ['Traditionnel Camerounais', 'Fast Food', 'International', 'Fruits de mer', 'Français', 'Panafricain', 'Fusion'];

  // Get status badge color
  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'inactive':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  // Navigate to add new restaurant
  const navigateToAddRestaurant = () => {
    navigate('/admin/restaurants/add');
  };

  // Navigate to view restaurant details
  const viewRestaurantDetails = (id) => {
    navigate(`/admin/restaurants/${id}`);
  };

  // Navigate to edit restaurant
  const editRestaurant = (id) => {
    navigate(`/admin/restaurants/${id}/edit`);
  };

  return (
    <AdminLayout>
      <div className="animate-fadeIn">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">{t('restaurantsManagement')}</h1>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
              {t('totalRestaurants')}: {restaurants.length} | {t('active')}: {restaurants.filter(r => r.status === 'active').length}
            </p>
          </div>
          
          <button 
            onClick={navigateToAddRestaurant}
            className="flex items-center justify-center bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-md"
          >
            <FiPlusCircle className="mr-2" />
            {t('addRestaurant')}
          </button>
        </div>
        
        {/* Search and Filters Bar */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search Input */}
            <div className="relative flex-1">
              <FiSearch className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder={t('searchRestaurants')}
                className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:text-white"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            {/* Filter Button */}
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center bg-gray-100 dark:bg-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
            >
              <FiFilter className="mr-2" />
              {t('filters')}
            </button>
            
            {/* Bulk Actions (when items selected) */}
            {selectedRestaurants.length > 0 && (
              <button 
                onClick={handleBulkDelete}
                className="flex items-center bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors duration-200"
              >
                <FiTrash2 className="mr-2" />
                {t('deleteSelected')} ({selectedRestaurants.length})
              </button>
            )}
          </div>
          
          {/* Expanded Filters */}
          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 animate-fadeIn">
              {/* Status Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('status')}</label>
                <select 
                  value={filterStatus} 
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full p-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:text-white"
                >
                  <option value="all">{t('all')}</option>
                  <option value="active">{t('active')}</option>
                  <option value="inactive">{t('inactive')}</option>
                  <option value="pending">{t('pending')}</option>
                </select>
              </div>
              
              {/* Cuisine Type Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('cuisineType')}</label>
                <select 
                  value={filterCuisine} 
                  onChange={(e) => setFilterCuisine(e.target.value)}
                  className="w-full p-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:text-white"
                >
                  <option value="all">{t('all')}</option>
                  {cuisineTypes.map((cuisine, index) => (
                    <option key={index} value={cuisine}>{cuisine}</option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </div>
        
        {/* Restaurants Table */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
          {isLoading ? (
            <div className="flex justify-center items-center p-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
            </div>
          ) : filteredRestaurants.length === 0 ? (
            <div className="text-center p-8">
              <p className="text-gray-500 dark:text-gray-400">{t('noRestaurantsFound')}</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full table-auto">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-4 py-3 text-left">
                      <input 
                        type="checkbox" 
                        checked={selectedRestaurants.length === filteredRestaurants.length && filteredRestaurants.length > 0} 
                        onChange={handleSelectAll}
                        className="rounded text-green-600 focus:ring-green-500"
                      />
                    </th>
                    <th 
                      className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
                      onClick={() => requestSort('name')}
                    >
                      {t('restaurant')}
                      {sortConfig.key === 'name' && (
                        <span className="ml-1">{sortConfig.direction === 'ascending' ? '↑' : '↓'}</span>
                      )}
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      {t('cuisine')}
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      {t('location')}
                    </th>
                    <th 
                      className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
                      onClick={() => requestSort('rating')}
                    >
                      {t('rating')}
                      {sortConfig.key === 'rating' && (
                        <span className="ml-1">{sortConfig.direction === 'ascending' ? '↑' : '↓'}</span>
                      )}
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      {t('status')}
                    </th>
                    <th 
                      className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
                      onClick={() => requestSort('orders')}
                    >
                      {t('orders')}
                      {sortConfig.key === 'orders' && (
                        <span className="ml-1">{sortConfig.direction === 'ascending' ? '↑' : '↓'}</span>
                      )}
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      {t('actions')}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredRestaurants.map((restaurant) => (
                    <tr 
                      key={restaurant.id} 
                      className="hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors duration-150"
                    >
                      <td className="px-4 py-4 whitespace-nowrap">
                        <input 
                          type="checkbox" 
                          checked={selectedRestaurants.includes(restaurant.id)} 
                          onChange={() => handleSelectRestaurant(restaurant.id)}
                          className="rounded text-green-600 focus:ring-green-500"
                        />
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 flex-shrink-0">
                            <img 
                              className="h-10 w-10 rounded-full object-cover border border-gray-200 dark:border-gray-600" 
                              src={restaurant.image} 
                              alt={restaurant.name} 
                            />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900 dark:text-white">{restaurant.name}</div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">{t('since')}: {restaurant.created}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                        {restaurant.cuisine}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                        {restaurant.location}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="text-sm text-gray-900 dark:text-white font-medium">{restaurant.rating}</div>
                          <div className="ml-1 text-yellow-400">★</div>
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <button
                          onClick={() => handleStatusToggle(restaurant.id, restaurant.status)}
                          className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeColor(restaurant.status)}`}
                        >
                          {restaurant.status === 'active' ? (
                            <FiCheckCircle className="mr-1" />
                          ) : restaurant.status === 'inactive' ? (
                            <FiXCircle className="mr-1" />
                          ) : (
                            <div className="h-4 w-4 rounded-full border-2 border-yellow-500 border-t-transparent animate-spin mr-1"></div>
                          )}
                          {t(restaurant.status)}
                        </button>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                        {restaurant.orders}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <button 
                            onClick={() => viewRestaurantDetails(restaurant.id)}
                            className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 transition-colors duration-200"
                            title={t('view')}
                          >
                            <FiEye size={18} />
                          </button>
                          <button 
                            onClick={() => editRestaurant(restaurant.id)}
                            className="text-yellow-600 hover:text-yellow-900 dark:text-yellow-400 dark:hover:text-yellow-300 transition-colors duration-200"
                            title={t('edit')}
                          >
                            <FiEdit size={18} />
                          </button>
                          <button 
                            onClick={() => handleDeleteRestaurant(restaurant.id)}
                            className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 transition-colors duration-200"
                            title={t('delete')}
                          >
                            <FiTrash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          
          {/* Table Footer with Pagination */}
          <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700 flex flex-col md:flex-row items-center justify-between">
            <div className="text-sm text-gray-500 dark:text-gray-400 mb-4 md:mb-0">
              {t('showing')} {filteredRestaurants.length} {t('of')} {restaurants.length} {t('restaurants')}
            </div>
            
            <div className="flex items-center space-x-1">
              <button className="px-3 py-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-white rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200">
                {t('previous')}
              </button>
              <button className="px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors duration-200">
                1
              </button>
              <button className="px-3 py-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-white rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200">
                2
              </button>
              <button className="px-3 py-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-white rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200">
                {t('next')}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics Cards - Hidden on mobile, shown on larger screens */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6 hidden md:grid">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transform transition-all duration-300 hover:scale-105 hover:shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">{t('totalRestaurants')}</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{restaurants.length}</p>
            </div>
            <div className="h-12 w-12 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
              <FiShoppingBag className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
          <div className="mt-4">
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div className="bg-green-600 h-2 rounded-full" style={{ width: '100%' }}></div>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transform transition-all duration-300 hover:scale-105 hover:shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">{t('activeRestaurants')}</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {restaurants.filter(r => r.status === 'active').length}
              </p>
            </div>
            <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
              <FiCheckCircle className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <div className="mt-4">
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full" 
                style={{ width: `${(restaurants.filter(r => r.status === 'active').length / restaurants.length) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transform transition-all duration-300 hover:scale-105 hover:shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">{t('pendingApproval')}</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {restaurants.filter(r => r.status === 'pending').length}
              </p>
            </div>
            <div className="h-12 w-12 rounded-full bg-yellow-100 dark:bg-yellow-900 flex items-center justify-center">
              <FiXCircle className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
            </div>
          </div>
          <div className="mt-4">
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div 
                className="bg-yellow-600 h-2 rounded-full" 
                style={{ width: `${(restaurants.filter(r => r.status === 'pending').length / restaurants.length) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transform transition-all duration-300 hover:scale-105 hover:shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">{t('averageRating')}</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {(restaurants.reduce((acc, rest) => acc + rest.rating, 0) / restaurants.length).toFixed(1)}
              </p>
            </div>
            <div className="h-12 w-12 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
              <span className="text-xl text-purple-600 dark:text-purple-400">★</span>
            </div>
          </div>
          <div className="mt-4">
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div 
                className="bg-purple-600 h-2 rounded-full" 
                style={{ width: `${(restaurants.reduce((acc, rest) => acc + rest.rating, 0) / restaurants.length / 5) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default RestaurantsList;