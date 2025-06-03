import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import RestaurantLayout from '../../../../layouts/restaurants_layout';
import { 
  FiPlus, 
  FiEdit2, 
  FiTrash2, 
  FiEye, 
  FiSearch, 
  FiFilter, 
  FiGrid, 
  FiList, 
  FiUpload,
  FiSave,
  FiX,
  FiClock,
  FiDollarSign,
  FiTrendingUp,
  FiStar,
  FiToggleLeft,
  FiToggleRight,
  FiMove,
  FiCamera,
  FiAlertTriangle,
  FiBarChart,
  FiTag
} from 'react-icons/fi';

import ndole from '../../../../assets/images/ndoles.jpeg';
import DG from '../../../../assets/images/DG.jpeg';
import Fruits from '../../../../assets/images/Fruits.jpg';

/**
 * MenuPlatsPage Component
 * 
 * Main page for restaurant managers to handle menu and dishes management
 * Features: CRUD operations, categorization, stock management, analytics
 * 
 * @component
 * @returns {JSX.Element} The complete menu management interface
 */
const MenuPlatsPage = () => {
  const { t } = useTranslation();
  
  // State Management
  const [dishes, setDishes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('create'); // 'create' or 'edit'
  const [selectedDish, setSelectedDish] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [dishToDelete, setDishToDelete] = useState(null);
  const [loading, setLoading] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    ingredients: '',
    allergens: '',
    preparationTime: '',
    images: [],
    available: true,
    featured: false,
    spicy: false,
    vegetarian: false,
    timeBasedAvailability: {
      enabled: false,
      startTime: '',
      endTime: ''
    }
  });

  // Sample data initialization
  useEffect(() => {
    initializeSampleData();
  }, []);

  /**
   * Initialize sample data for demonstration
   */
  const initializeSampleData = () => {
    const sampleCategories = [
      { id: 1, name: 'Entrées', color: '#10B981', order: 1 },
      { id: 2, name: 'Plats Principaux', color: '#F59E0B', order: 2 },
      { id: 3, name: 'Spécialités Régionales', color: '#EF4444', order: 3 },
      { id: 4, name: 'Desserts', color: '#8B5CF6', order: 4 },
      { id: 5, name: 'Boissons', color: '#06B6D4', order: 5 }
    ];

    const sampleDishes = [
      {
        id: 1,
        name: 'Ndolé au Poisson',
        description: 'Plat traditionnel camerounais aux feuilles de ndolé avec poisson fumé',
        price: 2500,
        category: 3,
        ingredients: 'Feuilles de ndolé, poisson fumé, crevettes, arachides',
        allergens: 'Arachides, Crustacés',
        preparationTime: 45,
        images: ndole,
        available: true,
        featured: true,
        spicy: true,
        vegetarian: false,
        rating: 4.8,
        orders: 156,
        revenue: 390000,
        timeBasedAvailability: { enabled: false }
      },
      {
        id: 2,
        name: 'Poulet DG',
        description: 'Poulet aux légumes façon Directeur Général',
        price: 3000,
        category: 2,
        ingredients: 'Poulet, plantains, haricots verts, carottes',
        allergens: 'Aucun',
        preparationTime: 35,
        images: DG,
        available: true,
        featured: false,
        spicy: false,
        vegetarian: false,
        rating: 4.6,
        orders: 89,
        revenue: 267000,
        timeBasedAvailability: { enabled: false }
      },
      {
        id: 3,
        name: 'Salade de Fruits Exotiques',
        description: 'Mélange de fruits tropicaux frais de saison',
        price: 1500,
        category: 4,
        ingredients: 'Mangue, ananas, papaye, banane, citron vert',
        allergens: 'Aucun',
        preparationTime: 10,
        images: Fruits,
        available: false,
        featured: false,
        spicy: false,
        vegetarian: true,
        rating: 4.3,
        orders: 45,
        revenue: 67500,
        timeBasedAvailability: { 
          enabled: true, 
          startTime: '06:00', 
          endTime: '11:00' 
        }
      }
    ];

    setCategories(sampleCategories);
    setDishes(sampleDishes);
  };

  /**
   * Filter and sort dishes based on current filters
   */
  const filteredDishes = dishes
    .filter(dish => {
      const matchesSearch = dish.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           dish.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || dish.category === parseInt(selectedCategory);
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'price':
          return a.price - b.price;
        case 'orders':
          return (b.orders || 0) - (a.orders || 0);
        case 'rating':
          return (b.rating || 0) - (a.rating || 0);
        default:
          return 0;
      }
    });

  /**
   * Handle form submission for create/edit
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (modalMode === 'create') {
        const newDish = {
          ...formData,
          id: Date.now(),
          price: parseFloat(formData.price),
          preparationTime: parseInt(formData.preparationTime),
          category: parseInt(formData.category),
          rating: 0,
          orders: 0,
          revenue: 0
        };
        setDishes(prev => [...prev, newDish]);
      } else {
        setDishes(prev => prev.map(dish => 
          dish.id === selectedDish.id 
            ? { 
                ...dish, 
                ...formData, 
                price: parseFloat(formData.price),
                preparationTime: parseInt(formData.preparationTime),
                category: parseInt(formData.category)
              }
            : dish
        ));
      }
      
      resetForm();
      setShowModal(false);
    } catch (error) {
      console.error('Error saving dish:', error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Reset form to initial state
   */
  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      category: '',
      ingredients: '',
      allergens: '',
      preparationTime: '',
      images: [],
      available: true,
      featured: false,
      spicy: false,
      vegetarian: false,
      timeBasedAvailability: {
        enabled: false,
        startTime: '',
        endTime: ''
      }
    });
    setSelectedDish(null);
  };

  /**
   * Open modal for creating new dish
   */
  const handleCreateDish = () => {
    resetForm();
    setModalMode('create');
    setShowModal(true);
  };

  /**
   * Open modal for editing existing dish
   */
  const handleEditDish = (dish) => {
    setFormData({
      name: dish.name,
      description: dish.description,
      price: dish.price.toString(),
      category: dish.category.toString(),
      ingredients: dish.ingredients,
      allergens: dish.allergens,
      preparationTime: dish.preparationTime.toString(),
      images: dish.images || [],
      available: dish.available,
      featured: dish.featured || false,
      spicy: dish.spicy || false,
      vegetarian: dish.vegetarian || false,
      timeBasedAvailability: dish.timeBasedAvailability || {
        enabled: false,
        startTime: '',
        endTime: ''
      }
    });
    setSelectedDish(dish);
    setModalMode('edit');
    setShowModal(true);
  };

  /**
   * Toggle dish availability
   */
  const toggleAvailability = (dishId) => {
    setDishes(prev => prev.map(dish => 
      dish.id === dishId 
        ? { ...dish, available: !dish.available }
        : dish
    ));
  };

  /**
   * Handle dish deletion
   */
  const handleDeleteDish = (dish) => {
    setDishToDelete(dish);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    setDishes(prev => prev.filter(dish => dish.id !== dishToDelete.id));
    setShowDeleteConfirm(false);
    setDishToDelete(null);
  };

  /**
   * Get category name by ID
   */
  const getCategoryName = (categoryId) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.name : 'Non catégorisé';
  };

  /**
   * Get category color by ID
   */
  const getCategoryColor = (categoryId) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.color : '#6B7280';
  };

  return (
    <RestaurantLayout>
      <div className="p-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Gestion du Menu
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                Gérez vos plats, catégories et disponibilités
              </p>
            </div>
            <button
              onClick={handleCreateDish}
              className="mt-4 md:mt-0 bg-gradient-to-r from-green-600 to-yellow-600 text-white px-6 py-3 rounded-lg font-medium hover:from-green-700 hover:to-yellow-700 transition-all duration-200 transform hover:scale-105 flex items-center shadow-lg"
            >
              <FiPlus className="mr-2" size={20} />
              Ajouter un Plat
            </button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[
            { 
              label: 'Total Plats', 
              value: dishes.length, 
              icon: <FiBarChart className="text-blue-600" size={24} />,
              color: 'blue'
            },
            { 
              label: 'Disponibles', 
              value: dishes.filter(d => d.available).length, 
              icon: <FiToggleRight className="text-green-600" size={24} />,
              color: 'green'
            },
            { 
              label: 'En Vedette', 
              value: dishes.filter(d => d.featured).length, 
              icon: <FiStar className="text-yellow-600" size={24} />,
              color: 'yellow'
            },
            { 
              label: 'Catégories', 
              value: categories.length, 
              icon: <FiTag className="text-purple-600" size={24} />,
              color: 'purple'
            }
          ].map((stat, index) => (
            <div key={index} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 dark:text-gray-300 text-sm font-medium">
                    {stat.label}
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                    {stat.value}
                  </p>
                </div>
                <div className={`p-3 rounded-lg bg-${stat.color}-100 dark:bg-${stat.color}-900/20`}>
                  {stat.icon}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Filters and Controls */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Rechercher un plat..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>

            <div className="flex flex-wrap gap-4 items-center">
              {/* Category Filter */}
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="all">Toutes les catégories</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>

              {/* Sort */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="name">Trier par nom</option>
                <option value="price">Trier par prix</option>
                <option value="orders">Trier par popularité</option>
                <option value="rating">Trier par note</option>
              </select>

              {/* View Mode Toggle */}
              <div className="flex border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 ${viewMode === 'grid' ? 'bg-green-600 text-white' : 'bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300'} transition-colors duration-200`}
                >
                  <FiGrid size={20} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 ${viewMode === 'list' ? 'bg-green-600 text-white' : 'bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300'} transition-colors duration-200`}
                >
                  <FiList size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Dishes Display */}
        <div className={`${viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}`}>
          {filteredDishes.map(dish => (
            <div key={dish.id} className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden ${viewMode === 'list' ? 'flex' : ''}`}>
              {/* Image */}
              <div className={`relative ${viewMode === 'list' ? 'w-48 flex-shrink-0' : 'h-48'}`}>
                <img
                  src={dish.images[0] || '/api/placeholder/300/200'}
                  alt={dish.name}
                  className="w-full h-full object-cover"
                />
                
                {/* Status Badges */}
                <div className="absolute top-3 left-3 flex flex-col gap-2">
                  {dish.featured && (
                    <span className="bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center">
                      <FiStar className="mr-1" size={12} />
                      Vedette
                    </span>
                  )}
                  {dish.spicy && (
                    <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                      🌶️ Épicé
                    </span>
                  )}
                  {dish.vegetarian && (
                    <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                      🌱 Végé
                    </span>
                  )}
                </div>

                {/* Availability Toggle */}
                <div className="absolute top-3 right-3">
                  <button
                    onClick={() => toggleAvailability(dish.id)}
                    className={`p-2 rounded-full ${dish.available ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600'} text-white transition-colors duration-200`}
                  >
                    {dish.available ? <FiToggleRight size={20} /> : <FiToggleLeft size={20} />}
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className={`p-6 ${viewMode === 'list' ? 'flex-1' : ''}`}>
                <div className={`${viewMode === 'list' ? 'flex justify-between items-start' : ''}`}>
                  <div className={`${viewMode === 'list' ? 'flex-1 pr-4' : ''}`}>
                    {/* Header */}
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                          {dish.name}
                        </h3>
                        <span 
                          className="inline-block px-2 py-1 rounded-full text-xs font-medium text-white"
                          style={{ backgroundColor: getCategoryColor(dish.category) }}
                        >
                          {getCategoryName(dish.category)}
                        </span>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold text-green-600">
                          {dish.price.toLocaleString()} FCFA
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                          <FiClock className="mr-1" size={12} />
                          {dish.preparationTime}min
                        </p>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">
                      {dish.description}
                    </p>

                    {/* Stats */}
                    <div className="flex items-center gap-4 mb-4 text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center">
                        <FiStar className="mr-1 text-yellow-500" size={14} />
                        {dish.rating || 0}
                      </div>
                      <div className="flex items-center">
                        <FiTrendingUp className="mr-1" size={14} />
                        {dish.orders || 0} commandes
                      </div>
                      <div className="flex items-center">
                        <FiDollarSign className="mr-1" size={14} />
                        {(dish.revenue || 0).toLocaleString()} FCFA
                      </div>
                    </div>

                    {/* Time-based availability */}
                    {dish.timeBasedAvailability?.enabled && (
                      <div className="mb-4 p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <p className="text-xs text-blue-600 dark:text-blue-400 flex items-center">
                          <FiClock className="mr-1" size={12} />
                          Disponible de {dish.timeBasedAvailability.startTime} à {dish.timeBasedAvailability.endTime}
                        </p>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEditDish(dish)}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center"
                      >
                        <FiEdit2 className="mr-1" size={16} />
                        Modifier
                      </button>
                      <button
                        onClick={() => handleDeleteDish(dish)}
                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center"
                      >
                        <FiTrash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredDishes.length === 0 && (
          <div className="text-center py-12">
            <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
              <FiSearch className="text-gray-400" size={32} />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Aucun plat trouvé
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Essayez de modifier vos filtres ou créez un nouveau plat
            </p>
            <button
              onClick={handleCreateDish}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200"
            >
              Créer un plat
            </button>
          </div>
        )}

        {/* Create/Edit Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {modalMode === 'create' ? 'Ajouter un Plat' : 'Modifier le Plat'}
                  </h2>
                  <button 
                    onClick={() => setShowModal(false)}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                  >
                    <FiX size={24} />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Basic Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Nom du plat *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Prix (FCFA) *
                      </label>
                      <input
                        type="number"
                        required
                        min="0"
                        step="50"
                        value={formData.price}
                        onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Description *
                    </label>
                    <textarea
                      required
                      rows={3}
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Catégorie *
                      </label>
                      <select
                        required
                        value={formData.category}
                        onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      >
                        <option value="">Sélectionner une catégorie</option>
                        {categories.map(category => (
                          <option key={category.id} value={category.id}>
                            {category.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Temps de préparation (min) *
                      </label>
                      <input
                        type="number"
                        required
                        min="1"
                        max="120"
                        value={formData.preparationTime}
                        onChange={(e) => setFormData(prev => ({ ...prev, preparationTime: e.target.value }))}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Ingrédients (séparés par des virgules)
                      </label>
                    <input
                      type="text"
                      value={formData.ingredients}
                      onChange={(e) => setFormData(prev => ({ ...prev, ingredients: e.target.value }))}
                      placeholder="ex: Tomates, Oignons, Épices..."
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Allergènes (séparés par des virgules)
                    </label>
                    <input
                      type="text"
                      value={formData.allergens}
                      onChange={(e) => setFormData(prev => ({ ...prev, allergens: e.target.value }))}
                      placeholder="ex: Arachides, Gluten, Lactose..."
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>

                  {/* Options */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.available}
                        onChange={(e) => setFormData(prev => ({ ...prev, available: e.target.checked }))}
                        className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                      />
                      <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Disponible</span>
                    </label>

                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.featured}
                        onChange={(e) => setFormData(prev => ({ ...prev, featured: e.target.checked }))}
                        className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                      />
                      <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">En vedette</span>
                    </label>

                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.spicy}
                        onChange={(e) => setFormData(prev => ({ ...prev, spicy: e.target.checked }))}
                        className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                      />
                      <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Épicé</span>
                    </label>

                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.vegetarian}
                        onChange={(e) => setFormData(prev => ({ ...prev, vegetarian: e.target.checked }))}
                        className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                      />
                      <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Végétarien</span>
                    </label>
                  </div>

                  {/* Time-based Availability */}
                  <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                    <label className="flex items-center mb-4">
                      <input
                        type="checkbox"
                        checked={formData.timeBasedAvailability.enabled}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          timeBasedAvailability: {
                            ...prev.timeBasedAvailability,
                            enabled: e.target.checked
                          }
                        }))}
                        className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                      />
                      <span className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                        Disponibilité horaire
                      </span>
                    </label>

                    {formData.timeBasedAvailability.enabled && (
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
                            Heure de début
                          </label>
                          <input
                            type="time"
                            value={formData.timeBasedAvailability.startTime}
                            onChange={(e) => setFormData(prev => ({
                              ...prev,
                              timeBasedAvailability: {
                                ...prev.timeBasedAvailability,
                                startTime: e.target.value
                              }
                            }))}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
                            Heure de fin
                          </label>
                          <input
                            type="time"
                            value={formData.timeBasedAvailability.endTime}
                            onChange={(e) => setFormData(prev => ({
                              ...prev,
                              timeBasedAvailability: {
                                ...prev.timeBasedAvailability,
                                endTime: e.target.value
                              }
                            }))}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Image Upload Section */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Images
                    </label>
                    <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center">
                      <FiCamera className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        Glissez-déposez vos images ici ou cliquez pour sélectionner
                      </p>
                      <button
                        type="button"
                        className="bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
                      >
                        <FiUpload className="inline mr-2" size={16} />
                        Choisir des fichiers
                      </button>
                    </div>
                  </div>

                  {/* Form Actions */}
                  <div className="flex justify-end gap-4 pt-6 border-t border-gray-200 dark:border-gray-600">
                    <button
                      type="button"
                      onClick={() => setShowModal(false)}
                      className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                    >
                      Annuler
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors duration-200 flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Enregistrement...
                        </>
                      ) : (
                        <>
                          <FiSave className="mr-2" size={16} />
                          {modalMode === 'create' ? 'Créer le plat' : 'Sauvegarder'}
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-md w-full">
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
                    <FiAlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                      Supprimer le plat
                    </h3>
                  </div>
                </div>
                
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">
                  Êtes-vous sûr de vouloir supprimer <strong>{dishToDelete?.name}</strong> ? 
                  Cette action est irréversible.
                </p>
                
                <div className="flex justify-end gap-4">
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    className="px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={confirmDelete}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors duration-200"
                  >
                    Supprimer
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </RestaurantLayout>
  );
};

export default MenuPlatsPage;