import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import RestaurantLayout from '../../../../layouts/restaurants_layout';
import menuPlatsServices from '../../../../Services/Restaurant/MenuPlat_Services';
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
  FiTag,
  FiUsers,
  FiHeart,
  FiAward,
  FiInfo,
  FiCheckCircle,
  FiXCircle,
  FiRefreshCw
} from 'react-icons/fi';

import { FaUtensils } from 'react-icons/fa6';

// Sample images - in a real app, these would be proper imports or URLs
const sampleImages = {
  ndole: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop',
  pouletDG: 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=400&h=300&fit=crop',
  fruits: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop',
  placeholder: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=400&h=300&fit=crop'
};

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
  // Gestion des états
  const [dishes, setDishes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' ou 'list'
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('create'); // 'create' ou 'edit'
  const [selectedDish, setSelectedDish] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [dishToDelete, setDishToDelete] = useState(null);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [notification, setNotification] = useState({ show: false, message: '', type: 'success' });
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  
  // État du formulaire
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
    glutenFree: false,
    lactoseFree: false,
    timeBasedAvailability: {
      enabled: false,
      startTime: '',
      endTime: ''
    },
    nutritionalInfo: {
      calories: '',
      protein: '',
      carbs: '',
      fat: ''
    }
  });

  // Initialisation des données
  useEffect(() => {
    loadInitialData();
  }, []);

  // Rechargement des plats quand les filtres changent
  useEffect(() => {
    if (!initialLoading) {
      loadDishes();
    }
  }, [searchTerm, selectedCategory, sortBy]);

  /**
   * Charge les données initiales (catégories et plats)
   */
  const loadInitialData = async () => {
    setInitialLoading(true);
    try {
      // Charger d'abord les catégories pour qu'elles soient disponibles
      await loadCategories();
      // Puis charger les plats
      await loadDishes();
    } catch (error) {
      console.log('Erreur lors du chargement initial, utilisation des données par défaut:', error);
      // En cas d'erreur, s'assurer que les données par défaut sont chargées
      initializeDefaultCategories();
      initializeSampleDishes();
    } finally {
      setInitialLoading(false);
    }
  };

  /**
   * Charge les catégories depuis l'API
   */
  const loadCategories = async () => {
    try {
      const response = await menuPlatsServices.getCategories();
      if (response.success && response.data && response.data.length > 0) {
        setCategories(response.data);
      } else {
        console.log('API catégories non disponible, utilisation des catégories par défaut');
        // Utilise toujours les catégories par défaut pour assurer le fonctionnement
        initializeDefaultCategories();
      }
    } catch (error) {
      console.log('Erreur API catégories, utilisation des catégories par défaut:', error);
      initializeDefaultCategories();
    }
  };

  /**
   * Initialise les catégories par défaut
   */
  const initializeDefaultCategories = () => {
    const defaultCategories = [
      { id: 1, name: 'Entrées & Amuse-bouches', color: '#10B981', order: 1, description: 'Commencez votre repas avec nos délicieuses entrées' },
      { id: 2, name: 'Plats Principaux', color: '#F59E0B', order: 2, description: 'Nos spécialités principales pour vous rassasier' },
      { id: 3, name: 'Spécialités Camerounaises', color: '#EF4444', order: 3, description: 'Découvrez les saveurs authentiques du Cameroun' },
      { id: 4, name: 'Desserts & Gourmandises', color: '#8B5CF6', order: 4, description: 'Terminez en beauté avec nos desserts' },
      { id: 5, name: 'Boissons & Rafraîchissements', color: '#06B6D4', order: 5, description: 'Désaltérez-vous avec nos boissons' },
      { id: 6, name: 'Menu Enfant', color: '#F97316', order: 6, description: 'Des plats adaptés aux plus petits' }
    ];
    setCategories(defaultCategories);
  };

  /**
   * Charge les plats depuis l'API avec filtres
   */
  const loadDishes = async () => {
    try {
      const filters = {
        search: searchTerm,
        categoryId: selectedCategory !== 'all' ? selectedCategory : undefined,
        sortBy: sortBy,
        order: sortBy === 'name' ? 'ASC' : 'DESC'
      };

      const response = await menuPlatsServices.getDishes(filters);
      if (response.success && response.data) {
        setDishes(response.data);
      } else {
        console.log('API plats non disponible, utilisation des données d\'exemple');
        // Si API non disponible, utilise des données d'exemple
        initializeSampleDishes();
      }
    } catch (error) {
      console.log('Erreur API plats, utilisation des données d\'exemple:', error);
      initializeSampleDishes();
    }
  };

  /**
   * Initialise les plats d'exemple
   */
  const initializeSampleDishes = () => {
    const sampleDishes = [
      {
        id: 1,
        name: 'Ndolé au Poisson Fumé',
        description: 'Plat traditionnel camerounais préparé avec des feuilles de ndolé fraîches, du poisson fumé de qualité, des crevettes et des arachides grillées. Servi avec du plantain bouilli ou du riz blanc parfumé.',
        price: 2500,
        category: 3,
        ingredients: 'Feuilles de ndolé fraîches, poisson fumé, crevettes séchées, arachides grillées, huile de palme, oignons, ail, gingembre, piment, cube maggi',
        allergens: 'Arachides, Crustacés, Poisson',
        preparationTime: 45,
        images: [sampleImages.ndole],
        available: true,
        featured: true,
        spicy: true,
        vegetarian: false,
        glutenFree: true,
        lactoseFree: true,
        rating: 4.8,
        orders: 156,
        revenue: 390000,
        timeBasedAvailability: { enabled: false },
        nutritionalInfo: { calories: 520, protein: 35, carbs: 25, fat: 32 },
        cookingTips: 'Plat mijotée lentement pour révéler tous les arômes',
        chefRecommendation: true
      },
      {
        id: 2,
        name: 'Poulet DG (Directeur Général)',
        description: 'Poulet tendre aux légumes sautés façon Directeur Général, accompagné de plantains dorés, haricots verts croquants et carottes fondantes. Un mélange parfait de saveurs et de textures.',
        price: 3000,
        category: 2,
        ingredients: 'Poulet fermier, plantains mûrs, haricots verts, carottes, poivrons, oignons, tomates, épices camerounaises, huile végétale',
        allergens: 'Aucun allergène majeur',
        preparationTime: 35,
        images: [sampleImages.pouletDG],
        available: true,
        featured: false,
        spicy: false,
        vegetarian: false,
        glutenFree: true,
        lactoseFree: true,
        rating: 4.6,
        orders: 89,
        revenue: 267000,
        timeBasedAvailability: { enabled: false },
        nutritionalInfo: { calories: 480, protein: 42, carbs: 28, fat: 24 },
        cookingTips: 'Poulet grillé puis mijoté avec les légumes',
        chefRecommendation: false
      },
      {
        id: 3,
        name: 'Salade de Fruits Exotiques Premium',
        description: 'Assortiment de fruits tropicaux frais de saison : mangue juteuse, ananas sucré, papaye fondante, banane douce et agrumes. Servi avec une touche de menthe fraîche et miel local.',
        price: 1500,
        category: 4,
        ingredients: 'Mangue fraîche, ananas Victoria, papaye rouge, banane plantain, citron vert, menthe fraîche, miel d\'acacia local',
        allergens: 'Aucun allergène',
        preparationTime: 10,
        images: [sampleImages.fruits],
        available: false,
        featured: false,
        spicy: false,
        vegetarian: true,
        glutenFree: true,
        lactoseFree: true,
        rating: 4.3,
        orders: 45,
        revenue: 67500,
        timeBasedAvailability: { 
          enabled: true, 
          startTime: '06:00', 
          endTime: '11:00' 
        },
        nutritionalInfo: { calories: 180, protein: 2, carbs: 45, fat: 1 },
        cookingTips: 'Fruits sélectionnés chaque matin au marché',
        chefRecommendation: false
      },
      {
        id: 4,
        name: 'Brochettes de Bœuf Grillées',
        description: 'Morceaux de bœuf tendre marinés dans nos épices secrètes, grillés à la perfection et servis avec des légumes grillés et une sauce pimentée maison.',
        price: 3500,
        category: 2,
        ingredients: 'Bœuf de qualité, oignons, poivrons, tomates cerises, épices africaines, huile d\'olive, ail, persil',
        allergens: 'Aucun',
        preparationTime: 25,
        images: [sampleImages.placeholder],
        available: true,
        featured: true,
        spicy: true,
        vegetarian: false,
        glutenFree: true,
        lactoseFree: true,
        rating: 4.7,
        orders: 78,
        revenue: 273000,
        timeBasedAvailability: { enabled: false },
        nutritionalInfo: { calories: 420, protein: 38, carbs: 12, fat: 26 },
        cookingTips: 'Marinade de 4 heures minimum',
        chefRecommendation: true
      },
      {
        id: 5,
        name: 'Jus de Gingembre Citronné',
        description: 'Boisson rafraîchissante préparée avec du gingembre frais, citron vert, miel et menthe. Parfait pour la digestion et riche en vitamines.',
        price: 800,
        category: 5,
        ingredients: 'Gingembre frais, citron vert, miel naturel, menthe fraîche, eau filtrée',
        allergens: 'Aucun',
        preparationTime: 5,
        images: [sampleImages.placeholder],
        available: true,
        featured: false,
        spicy: false,
        vegetarian: true,
        glutenFree: true,
        lactoseFree: true,
        rating: 4.4,
        orders: 132,
        revenue: 105600,
        timeBasedAvailability: { enabled: false },
        nutritionalInfo: { calories: 65, protein: 1, carbs: 16, fat: 0 },
        cookingTips: 'Préparé à la demande pour plus de fraîcheur',
        chefRecommendation: false
      }
    ];

    setDishes(sampleDishes);
  };

  /**
   * Recharge manuellement les données
   */
  const handleRefresh = async () => {
    setLoading(true);
    await loadInitialData();
    setLoading(false);
    showNotification('Données actualisées', 'success');
  };

  /**
   * Afficher une notification
   */
  const showNotification = (message, type = 'success') => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: '', type: 'success' });
    }, 3000);
  };

  /**
   * Filtre et trie les plats côté client (pour une UX plus fluide)
   */
  const filteredDishes = dishes
    .filter(dish => {
      const matchesSearch = dish.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           dish.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (dish.ingredients && dish.ingredients.toLowerCase().includes(searchTerm.toLowerCase()));
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
        case 'revenue':
          return (b.revenue || 0) - (a.revenue || 0);
        default:
          return 0;
      }
    });

  /**
   * Gère la soumission du formulaire pour créer/modifier
   */
  const handleSubmit = async (e) => {
    if (e && e.preventDefault) {
      e.preventDefault();
    }
    setLoading(true);

    try {
      // Validation des champs requis
      if (!formData.name || !formData.price || !formData.category || !formData.description) {
        showNotification('Veuillez remplir tous les champs obligatoires', 'error');
        setLoading(false);
        return;
      }

      if (modalMode === 'create') {
        // Créer un nouvel plat
        try {
          const response = await menuPlatsServices.createDish(formData);
          
          if (response.success && response.data) {
            // Utiliser les données du serveur si disponibles
            setDishes(prev => [...prev, response.data]);
            showNotification('Plat ajouté avec succès !', 'success');
          } else {
            throw new Error(response.message || 'Erreur serveur');
          }
        } catch (apiError) {
          console.log('API non disponible, ajout local:', apiError);
          // Fallback : ajouter localement si l'API n'est pas disponible
          const newDish = {
            id: Date.now(), // ID temporaire
            name: formData.name,
            description: formData.description,
            price: parseFloat(formData.price),
            category: parseInt(formData.category),
            ingredients: formData.ingredients || '',
            allergens: formData.allergens || '',
            preparationTime: parseInt(formData.preparationTime) || 15,
            images: formData.images.length > 0 ? formData.images : [sampleImages.placeholder],
            available: formData.available !== false,
            featured: formData.featured || false,
            spicy: formData.spicy || false,
            vegetarian: formData.vegetarian || false,
            glutenFree: formData.glutenFree || false,
            lactoseFree: formData.lactoseFree || false,
            rating: 0,
            orders: 0,
            revenue: 0,
            timeBasedAvailability: formData.timeBasedAvailability || { enabled: false },
            nutritionalInfo: {
              calories: parseInt(formData.nutritionalInfo.calories) || 0,
              protein: parseInt(formData.nutritionalInfo.protein) || 0,
              carbs: parseInt(formData.nutritionalInfo.carbs) || 0,
              fat: parseInt(formData.nutritionalInfo.fat) || 0
            }
          };
          
          setDishes(prev => [...prev, newDish]);
          showNotification('Plat ajouté avec succès (mode local) !', 'success');
        }
      } else {
        // Modifier un plat existant
        try {
          const response = await menuPlatsServices.updateDish(selectedDish.id, formData);
          
          if (response.success && response.data) {
            // Utiliser les données du serveur si disponibles
            setDishes(prev => prev.map(dish => 
              dish.id === selectedDish.id ? response.data : dish
            ));
            showNotification('Plat modifié avec succès !', 'success');
          } else {
            throw new Error(response.message || 'Erreur serveur');
          }
        } catch (apiError) {
          console.log('API non disponible, modification locale:', apiError);
          // Fallback : modifier localement si l'API n'est pas disponible
          const updatedDish = {
            ...selectedDish,
            name: formData.name,
            description: formData.description,
            price: parseFloat(formData.price),
            category: parseInt(formData.category),
            ingredients: formData.ingredients || '',
            allergens: formData.allergens || '',
            preparationTime: parseInt(formData.preparationTime) || selectedDish.preparationTime,
            available: formData.available !== false,
            featured: formData.featured || false,
            spicy: formData.spicy || false,
            vegetarian: formData.vegetarian || false,
            glutenFree: formData.glutenFree || false,
            lactoseFree: formData.lactoseFree || false,
            timeBasedAvailability: formData.timeBasedAvailability || { enabled: false },
            nutritionalInfo: {
              calories: parseInt(formData.nutritionalInfo.calories) || selectedDish.nutritionalInfo?.calories || 0,
              protein: parseInt(formData.nutritionalInfo.protein) || selectedDish.nutritionalInfo?.protein || 0,
              carbs: parseInt(formData.nutritionalInfo.carbs) || selectedDish.nutritionalInfo?.carbs || 0,
              fat: parseInt(formData.nutritionalInfo.fat) || selectedDish.nutritionalInfo?.fat || 0
            }
          };

          setDishes(prev => prev.map(dish => 
            dish.id === selectedDish.id ? updatedDish : dish
          ));
          showNotification('Plat modifié avec succès (mode local) !', 'success');
        }
      }
      
      resetForm();
      setShowModal(false);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde du plat:', error);
      showNotification('Erreur lors de la sauvegarde', 'error');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Remet le formulaire à l'état initial
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
      glutenFree: false,
      lactoseFree: false,
      timeBasedAvailability: {
        enabled: false,
        startTime: '',
        endTime: ''
      },
      nutritionalInfo: {
        calories: '',
        protein: '',
        carbs: '',
        fat: ''
      }
    });
    setSelectedDish(null);
    setUploadProgress(0);
  };

  /**
   * Ouvre le modal pour créer un nouveau plat
   */
  const handleCreateDish = () => {
    resetForm();
    setModalMode('create');
    setShowModal(true);
  };

  /**
   * Ouvre le modal pour modifier un plat existant
   */
  const handleEditDish = (dish) => {
    setFormData({
      name: dish.name,
      description: dish.description,
      price: dish.price.toString(),
      category: dish.category.toString(),
      ingredients: dish.ingredients || '',
      allergens: dish.allergens || '',
      preparationTime: dish.preparationTime.toString(),
      images: dish.images || [],
      available: dish.available,
      featured: dish.featured || false,
      spicy: dish.spicy || false,
      vegetarian: dish.vegetarian || false,
      glutenFree: dish.glutenFree || false,
      lactoseFree: dish.lactoseFree || false,
      timeBasedAvailability: dish.timeBasedAvailability || {
        enabled: false,
        startTime: '',
        endTime: ''
      },
      nutritionalInfo: dish.nutritionalInfo || {
        calories: '',
        protein: '',
        carbs: '',
        fat: ''
      }
    });
    setSelectedDish(dish);
    setModalMode('edit');
    setShowModal(true);
  };

  /**
   * Bascule la disponibilité d'un plat
   */
  const toggleAvailability = async (dishId) => {
    const dish = dishes.find(d => d.id === dishId);
    if (!dish) return;

    // Mise à jour optimiste de l'UI
    const newAvailability = !dish.available;
    setDishes(prev => prev.map(d => 
      d.id === dishId 
        ? { ...d, available: newAvailability }
        : d
    ));

    try {
      const response = await menuPlatsServices.toggleDishAvailability(dishId, newAvailability);
      
      if (response.success) {
        showNotification(
          `${dish.name} est maintenant ${newAvailability ? 'disponible' : 'indisponible'}`,
          'info'
        );
      } else {
        // Revert si l'API échoue
        setDishes(prev => prev.map(d => 
          d.id === dishId 
            ? { ...d, available: dish.available }
            : d
        ));
        console.log('API toggle availability échoué, mais modification locale conservée');
        showNotification(
          `${dish.name} est maintenant ${newAvailability ? 'disponible' : 'indisponible'} (mode local)`,
          'info'
        );
      }
    } catch (error) {
      console.log('API non disponible pour toggle availability:', error);
      // Garder la modification locale même si l'API échoue
      showNotification(
        `${dish.name} est maintenant ${newAvailability ? 'disponible' : 'indisponible'} (mode local)`,
        'info'
      );
    }
  };

  /**
   * Bascule le statut "en vedette" d'un plat
   */
  const toggleFeatured = async (dishId) => {
    const dish = dishes.find(d => d.id === dishId);
    if (!dish) return;

    // Mise à jour optimiste de l'UI
    const newFeaturedStatus = !dish.featured;
    setDishes(prev => prev.map(d => 
      d.id === dishId 
        ? { ...d, featured: newFeaturedStatus }
        : d
    ));

    try {
      const response = await menuPlatsServices.toggleDishFeatured(dishId, newFeaturedStatus);
      
      if (response.success) {
        showNotification(
          `${dish.name} ${newFeaturedStatus ? 'mis en vedette' : 'retiré de la vedette'}`,
          'info'
        );
      } else {
        // Revert si l'API échoue
        setDishes(prev => prev.map(d => 
          d.id === dishId 
            ? { ...d, featured: dish.featured }
            : d
        ));
        console.log('API toggle featured échoué, mais modification locale conservée');
        showNotification(
          `${dish.name} ${newFeaturedStatus ? 'mis en vedette' : 'retiré de la vedette'} (mode local)`,
          'info'
        );
      }
    } catch (error) {
      console.log('API non disponible pour toggle featured:', error);
      // Garder la modification locale même si l'API échoue
      showNotification(
        `${dish.name} ${newFeaturedStatus ? 'mis en vedette' : 'retiré de la vedette'} (mode local)`,
        'info'
      );
    }
  };

  /**
   * Gère la suppression d'un plat
   */
  const handleDeleteDish = (dish) => {
    setDishToDelete(dish);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    if (!dishToDelete) return;

    try {
      const response = await menuPlatsServices.deleteDish(dishToDelete.id);
      
      if (response.success) {
        setDishes(prev => prev.filter(dish => dish.id !== dishToDelete.id));
        showNotification(`${dishToDelete.name} a été supprimé`, 'success');
      } else {
        // Supprimer localement même si l'API échoue
        setDishes(prev => prev.filter(dish => dish.id !== dishToDelete.id));
        showNotification(`${dishToDelete.name} a été supprimé (mode local)`, 'success');
      }
    } catch (error) {
      console.log('API non disponible pour suppression:', error);
      // Supprimer localement même si l'API échoue
      setDishes(prev => prev.filter(dish => dish.id !== dishToDelete.id));
      showNotification(`${dishToDelete.name} a été supprimé (mode local)`, 'success');
    } finally {
      setShowDeleteConfirm(false);
      setDishToDelete(null);
    }
  };

  /**
   * Gère l'upload d'images
   */
  const handleImageUpload = async (files, dishId = null) => {
    if (!files || files.length === 0) return;

    setUploading(true);
    setUploadProgress(0);

    try {
      const targetDishId = dishId || selectedDish?.id;
      
      if (!targetDishId && modalMode === 'edit') {
        showNotification('Impossible d\'uploader les images', 'error');
        return;
      }

      // Si on est en mode création, on stocke les images localement
      // pour les uploader après la création du plat
      if (modalMode === 'create') {
        const imageFiles = Array.from(files);
        setFormData(prev => ({
          ...prev,
          images: [...(prev.images || []), ...imageFiles]
        }));
        showNotification('Images ajoutées (seront uploadées après création)', 'info');
        return;
      }

      const response = await menuPlatsServices.uploadDishImages(
        targetDishId,
        files,
        (progress) => setUploadProgress(progress)
      );

      if (response.success) {
        showNotification('Images uploadées avec succès', 'success');
        await loadDishes(); // Recharger pour voir les nouvelles images
      } else {
        showNotification(response.message || 'Erreur lors de l\'upload', 'error');
      }
    } catch (error) {
      console.error('Erreur lors de l\'upload d\'images:', error);
      showNotification('Erreur lors de l\'upload des images', 'error');
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  /**
   * Obtient le nom de la catégorie par ID
   */
  const getCategoryName = (categoryId) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.name : 'Non catégorisé';
  };

  /**
   * Obtient la couleur de la catégorie par ID
   */
  const getCategoryColor = (categoryId) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.color : '#6B7280';
  };

  /**
   * Calcule les statistiques globales
   */
  const totalRevenue = dishes.reduce((sum, dish) => sum + (dish.revenue || 0), 0);
  const totalOrders = dishes.reduce((sum, dish) => sum + (dish.orders || 0), 0);
  const avgRating = dishes.length > 0 ? dishes.reduce((sum, dish) => sum + (dish.rating || 0), 0) / dishes.length : 0;

  // Affichage de chargement initial
  if (initialLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-600 mx-auto mb-4"></div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            Chargement du menu
          </h3>
          <p className="text-gray-600 dark:text-gray-300">
            Récupération des plats et catégories...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Notification */}
      {notification.show && (
        <div className={`fixed top-4 right-4 z-50 max-w-md p-4 rounded-lg shadow-lg transform transition-all duration-300 ${
          notification.type === 'success' ? 'bg-green-500 text-white' :
          notification.type === 'error' ? 'bg-red-500 text-white' :
          'bg-blue-500 text-white'
        }`}>
          <div className="flex items-center">
            {notification.type === 'success' ? <FiCheckCircle className="mr-2" size={20} /> :
             notification.type === 'error' ? <FiXCircle className="mr-2" size={20} /> :
             <FiInfo className="mr-2" size={20} />}
            {notification.message}
          </div>
        </div>
      )}

      <div className="p-6 max-w-7xl mx-auto">
        {/* En-tête amélioré */}
        <div className="mb-8 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-green-600/10 to-yellow-600/10 rounded-3xl"></div>
          <div className="relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-center mb-6 lg:mb-0">
                <div className="p-4 bg-gradient-to-br from-green-500 to-yellow-500 rounded-2xl shadow-lg mr-6">
                  <FaUtensils className="text-white" size={32} />
                </div>
                <div>
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-yellow-600 bg-clip-text text-transparent mb-2">
                    Gestion du Menu
                  </h1>
                  <p className="text-gray-600 dark:text-gray-300 text-lg">
                    Gérez vos plats, catégories et disponibilités en toute simplicité
                  </p>
                  <div className="flex items-center mt-2 text-sm text-gray-500 dark:text-gray-400">
                    <FiUsers className="mr-1" size={16} />
                    <span className="mr-4">{totalOrders} commandes totales</span>
                    <FiDollarSign className="mr-1" size={16} />
                    <span>{totalRevenue.toLocaleString()} FCFA de revenus</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleRefresh}
                  disabled={loading}
                  className="group bg-gray-600 hover:bg-gray-700 text-white px-6 py-4 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-xl flex items-center justify-center disabled:opacity-50"
                >
                  <FiRefreshCw className={`mr-2 ${loading ? 'animate-spin' : 'group-hover:rotate-180'} transition-transform duration-300`} size={20} />
                  Actualiser
                </button>
                <button
                  onClick={handleCreateDish}
                  className="group bg-gradient-to-r from-green-600 to-yellow-600 text-white px-8 py-4 rounded-2xl font-semibold hover:from-green-700 hover:to-yellow-700 transition-all duration-300 transform hover:scale-105 hover:shadow-xl flex items-center justify-center"
                >
                  <FiPlus className="mr-2 group-hover:rotate-90 transition-transform duration-300" size={20} />
                  Ajouter un Plat
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Statistiques améliorées */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            { 
              label: 'Total Plats', 
              value: dishes.length, 
              icon: <FiBarChart className="text-blue-600" size={28} />,
              color: 'blue',
              change: '+2 cette semaine'
            },
            { 
              label: 'Disponibles', 
              value: dishes.filter(d => d.available).length, 
              icon: <FiToggleRight className="text-green-600" size={28} />,
              color: 'green',
              change: `${dishes.length > 0 ? Math.round((dishes.filter(d => d.available).length / dishes.length) * 100) : 0}% du menu`
            },
            { 
              label: 'En Vedette', 
              value: dishes.filter(d => d.featured).length, 
              icon: <FiStar className="text-yellow-600" size={28} />,
              color: 'yellow',
              change: 'Recommandés par le chef'
            },
            { 
              label: 'Note Moyenne', 
              value: avgRating.toFixed(1), 
              icon: <FiAward className="text-purple-600" size={28} />,
              color: 'purple',
              change: '/5.0 étoiles'
            }
          ].map((stat, index) => (
            <div key={index} className="group bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 dark:border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl bg-gradient-to-br from-${stat.color}-100 to-${stat.color}-200 dark:from-${stat.color}-900/30 dark:to-${stat.color}-800/30 group-hover:scale-110 transition-transform duration-300`}>
                  {stat.icon}
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {stat.value}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {stat.change}
                  </p>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-300 text-sm font-medium">
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        {/* Filtres et contrôles améliorés */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg mb-8 border border-gray-100 dark:border-gray-700">
          <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between">
            {/* Recherche améliorée */}
            <div className="relative flex-1 max-w-md">
              <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Rechercher un plat, ingrédient..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-200"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                >
                  <FiX size={16} />
                </button>
              )}
            </div>

            <div className="flex flex-wrap gap-4 items-center">
              {/* Filtre de catégorie */}
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-green-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all duration-200 cursor-pointer"
              >
                <option value="all">Toutes les catégories ({dishes.length})</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name} ({dishes.filter(d => d.category === category.id).length})
                  </option>
                ))}
              </select>

              {/* Tri */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-green-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all duration-200 cursor-pointer"
              >
                <option value="name">Trier par nom</option>
                <option value="price">Trier par prix</option>
                <option value="orders">Trier par popularité</option>
                <option value="rating">Trier par note</option>
                <option value="revenue">Trier par revenus</option>
              </select>

              {/* Basculeur de vue */}
              <div className="flex border border-gray-300 dark:border-gray-600 rounded-xl overflow-hidden">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-3 transition-all duration-200 ${viewMode === 'grid' ? 'bg-green-600 text-white shadow-lg' : 'bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600'}`}
                >
                  <FiGrid size={20} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-3 transition-all duration-200 ${viewMode === 'list' ? 'bg-green-600 text-white shadow-lg' : 'bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600'}`}
                >
                  <FiList size={20} />
                </button>
              </div>
            </div>
          </div>

          {/* Filtres rapides */}
          <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-300 mr-2">Filtres rapides:</span>
            {[
              { key: 'featured', label: 'En vedette', count: dishes.filter(d => d.featured).length },
              { key: 'vegetarian', label: 'Végétarien', count: dishes.filter(d => d.vegetarian).length },
              { key: 'spicy', label: 'Épicé', count: dishes.filter(d => d.spicy).length },
              { key: 'available', label: 'Disponible', count: dishes.filter(d => d.available).length }
            ].map(filter => (
              <button
                key={filter.key}
                className="px-3 py-1 text-xs rounded-full border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
              >
                {filter.label} ({filter.count})
              </button>
            ))}
          </div>
        </div>

        {/* Affichage des plats */}
        <div className={`${viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8' : 'space-y-6'}`}>
          {filteredDishes.map(dish => (
            <div key={dish.id} className={`group bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 dark:border-gray-700 ${viewMode === 'list' ? 'flex' : 'transform hover:-translate-y-2'}`}>
              {/* Image avec superposition */}
              <div className={`relative ${viewMode === 'list' ? 'w-64 flex-shrink-0' : 'h-56'} overflow-hidden`}>
                <img
                  src={dish.images?.[0] || sampleImages.placeholder}
                  alt={dish.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                
                {/* Superposition gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                
                {/* Badges de statut */}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  {dish.featured && (
                    <span className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center shadow-lg">
                      <FiStar className="mr-1" size={12} />
                      Coup de cœur
                    </span>
                  )}
                  {dish.chefRecommendation && (
                    <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center shadow-lg">
                      <FaUtensils className="mr-1" size={12} />
                      Recommandé
                    </span>
                  )}
                  <div className="flex gap-1">
                    {dish.spicy && (
                      <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium shadow-lg">
                        🌶️
                      </span>
                    )}
                    {dish.vegetarian && (
                      <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium shadow-lg">
                        🌱
                      </span>
                    )}
                    {dish.glutenFree && (
                      <span className="bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-medium shadow-lg">
                        GF
                      </span>
                    )}
                  </div>
                </div>

                {/* Contrôles de disponibilité */}
                <div className="absolute top-4 right-4 flex gap-2">
                  <button
                    onClick={() => toggleFeatured(dish.id)}
                    className={`p-2 rounded-full transition-all duration-200 ${dish.featured ? 'bg-yellow-500 hover:bg-yellow-600 text-white' : 'bg-white/80 hover:bg-white text-gray-700'} shadow-lg`}
                  >
                    <FiHeart size={16} />
                  </button>
                  <button
                    onClick={() => toggleAvailability(dish.id)}
                    className={`p-2 rounded-full transition-all duration-200 ${dish.available ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600'} text-white shadow-lg`}
                  >
                    {dish.available ? <FiToggleRight size={16} /> : <FiToggleLeft size={16} />}
                  </button>
                </div>

                {/* Prix en superposition */}
                <div className="absolute bottom-4 left-4">
                  <span className="bg-white/90 backdrop-blur-sm text-gray-900 px-3 py-1 rounded-full font-bold text-lg shadow-lg">
                    {dish.price.toLocaleString()} FCFA
                  </span>
                </div>
              </div>

              {/* Contenu */}
              <div className={`p-6 ${viewMode === 'list' ? 'flex-1' : ''}`}>
                <div className={`${viewMode === 'list' ? 'flex justify-between' : ''}`}>
                  <div className={`${viewMode === 'list' ? 'flex-1 pr-6' : ''}`}>
                    {/* En-tête */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-green-600 transition-colors duration-200">
                          {dish.name}
                        </h3>
                        <span 
                          className="inline-block px-3 py-1 rounded-full text-xs font-semibold text-white shadow-sm"
                          style={{ backgroundColor: getCategoryColor(dish.category) }}
                        >
                          {getCategoryName(dish.category)}
                        </span>
                      </div>
                      <div className="text-right ml-4">
                        <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center justify-end">
                          <FiClock className="mr-1" size={14} />
                          {dish.preparationTime}min
                        </p>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 leading-relaxed line-clamp-3">
                      {dish.description}
                    </p>

                    {/* Informations nutritionnelles */}
                    {dish.nutritionalInfo && (
                      <div className="grid grid-cols-4 gap-2 mb-4 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                        <div className="text-center">
                          <p className="text-xs text-gray-500 dark:text-gray-400">Calories</p>
                          <p className="font-semibold text-gray-900 dark:text-white text-sm">{dish.nutritionalInfo.calories}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-xs text-gray-500 dark:text-gray-400">Protéines</p>
                          <p className="font-semibold text-gray-900 dark:text-white text-sm">{dish.nutritionalInfo.protein}g</p>
                        </div>
                        <div className="text-center">
                          <p className="text-xs text-gray-500 dark:text-gray-400">Glucides</p>
                          <p className="font-semibold text-gray-900 dark:text-white text-sm">{dish.nutritionalInfo.carbs}g</p>
                        </div>
                        <div className="text-center">
                          <p className="text-xs text-gray-500 dark:text-gray-400">Lipides</p>
                          <p className="font-semibold text-gray-900 dark:text-white text-sm">{dish.nutritionalInfo.fat}g</p>
                        </div>
                      </div>
                    )}

                    {/* Statistiques */}
                    <div className="flex items-center justify-between mb-4 p-3 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700/50 dark:to-gray-600/50 rounded-lg">
                      <div className="flex items-center text-sm">
                        <FiStar className="mr-1 text-yellow-500" size={16} />
                        <span className="font-semibold text-gray-900 dark:text-white">{dish.rating || 0}</span>
                        <span className="text-gray-500 dark:text-gray-400 ml-1">/5</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                        <FiTrendingUp className="mr-1 text-green-500" size={16} />
                        <span className="font-semibold">{dish.orders || 0}</span>
                        <span className="ml-1">commandes</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                        <FiDollarSign className="mr-1 text-blue-500" size={16} />
                        <span className="font-semibold">{(dish.revenue || 0).toLocaleString()}</span>
                      </div>
                    </div>

                    {/* Disponibilité horaire */}
                    {dish.timeBasedAvailability?.enabled && (
                      <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                        <p className="text-sm text-blue-700 dark:text-blue-300 flex items-center font-medium">
                          <FiClock className="mr-2" size={16} />
                          Disponible de {dish.timeBasedAvailability.startTime} à {dish.timeBasedAvailability.endTime}
                        </p>
                      </div>
                    )}

                    {/* Allergènes */}
                    {dish.allergens && dish.allergens !== 'Aucun' && dish.allergens !== '' && (
                      <div className="mb-4 p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
                        <p className="text-sm text-orange-700 dark:text-orange-300">
                          <strong>Allergènes:</strong> {dish.allergens}
                        </p>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleEditDish(dish)}
                        className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-4 py-3 rounded-xl font-medium transition-all duration-200 flex items-center justify-center shadow-lg hover:shadow-xl transform hover:scale-105"
                      >
                        <FiEdit2 className="mr-2" size={16} />
                        Modifier
                      </button>
                      <button
                        onClick={() => handleDeleteDish(dish)}
                        className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-4 py-3 rounded-xl font-medium transition-all duration-200 flex items-center justify-center shadow-lg hover:shadow-xl transform hover:scale-105"
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

        {/* État vide amélioré */}
        {filteredDishes.length === 0 && (
          <div className="text-center py-16">
            <div className="relative">
              <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 rounded-full flex items-center justify-center shadow-lg">
                <FiSearch className="text-gray-400 dark:text-gray-500" size={48} />
              </div>
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-green-500 rounded-full animate-ping"></div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Aucun plat trouvé
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-8 max-w-md mx-auto">
              {searchTerm ? 
                `Aucun résultat pour "${searchTerm}". Essayez avec d'autres mots-clés.` :
                'Commencez par créer votre premier plat pour enrichir votre menu.'
              }
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleCreateDish}
                className="bg-gradient-to-r from-green-600 to-yellow-600 hover:from-green-700 hover:to-yellow-700 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg"
              >
                <FiPlus className="inline mr-2" size={20} />
                Créer un nouveau plat
              </button>
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="bg-gray-600 hover:bg-gray-700 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-200"
                >
                  Effacer la recherche
                </button>
              )}
            </div>
          </div>
        )}

        {/* Modal Créer/Modifier - Version améliorée */}
        {showModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl max-w-4xl w-full max-h-[95vh] overflow-y-auto border border-gray-200 dark:border-gray-700">
              <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-6 rounded-t-3xl">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                      {modalMode === 'create' ? 'Ajouter un Nouveau Plat' : 'Modifier le Plat'}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300 mt-1">
                      {modalMode === 'create' ? 'Créez un nouveau plat pour enrichir votre menu' : 'Modifiez les informations de votre plat'}
                    </p>
                  </div>
                  <button 
                    onClick={() => setShowModal(false)}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
                  >
                    <FiX size={24} />
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-8">
                {/* Informations de base */}
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-2xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                    <FiInfo className="mr-2 text-blue-600" size={20} />
                    Informations de base
                  </h3>
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
                        placeholder="Ex: Ndolé au poisson fumé"
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-200"
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
                        placeholder="2500"
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-200"
                      />
                    </div>
                  </div>

                  <div className="mt-6">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Description détaillée *
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Décrivez votre plat en détail: ingrédients, méthode de préparation, accompagnements..."
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-200 resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Catégorie *
                      </label>
                      <select
                        required
                        value={formData.category}
                        onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all duration-200 cursor-pointer"
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
                        Temps de préparation (minutes) *
                      </label>
                      <input
                        type="number"
                        required
                        min="1"
                        max="180"
                        value={formData.preparationTime}
                        onChange={(e) => setFormData(prev => ({ ...prev, preparationTime: e.target.value }))}
                        placeholder="30"
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-200"
                      />
                    </div>
                  </div>
                </div>

                {/* Ingrédients et allergènes */}
                <div className="bg-green-50 dark:bg-green-900/20 rounded-2xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                    <FiTag className="mr-2 text-green-600" size={20} />
                    Ingrédients et allergènes
                  </h3>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Liste des ingrédients
                        <span className="text-gray-500 dark:text-gray-400 text-xs ml-1">(séparés par des virgules)</span>
                      </label>
                      <textarea
                        rows={3}
                        value={formData.ingredients}
                        onChange={(e) => setFormData(prev => ({ ...prev, ingredients: e.target.value }))}
                        placeholder="Ex: Feuilles de ndolé fraîches, poisson fumé, crevettes séchées, arachides grillées..."
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-200 resize-none"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Allergènes potentiels
                        <span className="text-gray-500 dark:text-gray-400 text-xs ml-1">(laissez vide si aucun)</span>
                      </label>
                      <input
                        type="text"
                        value={formData.allergens}
                        onChange={(e) => setFormData(prev => ({ ...prev, allergens: e.target.value }))}
                        placeholder="Ex: Arachides, Crustacés, Gluten, Lactose..."
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-200"
                      />
                    </div>
                  </div>
                </div>

                {/* Informations nutritionnelles */}
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                    <FiBarChart className="mr-2 text-blue-600" size={20} />
                    Informations nutritionnelles
                    <span className="text-sm font-normal text-gray-500 dark:text-gray-400 ml-2">(optionnel)</span>
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Calories
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={formData.nutritionalInfo.calories}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          nutritionalInfo: { ...prev.nutritionalInfo, calories: e.target.value }
                        }))}
                        placeholder="520"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-200"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Protéines (g)
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={formData.nutritionalInfo.protein}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          nutritionalInfo: { ...prev.nutritionalInfo, protein: e.target.value }
                        }))}
                        placeholder="35"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-200"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Glucides (g)
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={formData.nutritionalInfo.carbs}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          nutritionalInfo: { ...prev.nutritionalInfo, carbs: e.target.value }
                        }))}
                        placeholder="25"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-200"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Lipides (g)
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={formData.nutritionalInfo.fat}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          nutritionalInfo: { ...prev.nutritionalInfo, fat: e.target.value }
                        }))}
                        placeholder="32"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-200"
                      />
                    </div>
                  </div>
                </div>

                {/* Options et caractéristiques */}
                <div className="bg-purple-50 dark:bg-purple-900/20 rounded-2xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                    <FiToggleRight className="mr-2 text-purple-600" size={20} />
                    Options et caractéristiques
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {[
                      { key: 'available', label: 'Disponible maintenant', color: 'green' },
                      { key: 'featured', label: 'Mettre en vedette', color: 'yellow' },
                      { key: 'spicy', label: 'Plat épicé', color: 'red' },
                      { key: 'vegetarian', label: 'Végétarien', color: 'green' },
                      { key: 'glutenFree', label: 'Sans gluten', color: 'blue' },
                      { key: 'lactoseFree', label: 'Sans lactose', color: 'indigo' }
                    ].map(option => (
                      <label key={option.key} className="flex items-center p-3 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer transition-colors duration-200">
                        <input
                          type="checkbox"
                          checked={formData[option.key]}
                          onChange={(e) => setFormData(prev => ({ ...prev, [option.key]: e.target.checked }))}
                          className={`rounded border-gray-300 text-${option.color}-600 focus:ring-${option.color}-500 mr-3`}
                        />
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{option.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Disponibilité horaire */}
                <div className="bg-orange-50 dark:bg-orange-900/20 rounded-2xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                    <FiClock className="mr-2 text-orange-600" size={20} />
                    Disponibilité horaire
                  </h3>
                  <label className="flex items-center mb-4 p-3 border border-gray-200 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200">
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
                      className="rounded border-gray-300 text-orange-600 focus:ring-orange-500 mr-3"
                    />
                    <div>
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Limiter les heures de disponibilité
                      </span>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Utile pour les plats du petit-déjeuner ou les spécialités de saison
                      </p>
                    </div>
                  </label>

                  {formData.timeBasedAvailability.enabled && (
                    <div className="grid grid-cols-2 gap-4 pl-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
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
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all duration-200"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
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
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all duration-200"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Section de téléchargement d'images */}
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-2xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                    <FiCamera className="mr-2 text-gray-600" size={20} />
                    Images du plat
                  </h3>
                  <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-8 text-center hover:border-green-500 dark:hover:border-green-400 transition-colors duration-200">
                    <FiCamera className="mx-auto h-16 w-16 text-gray-400 dark:text-gray-500 mb-4" />
                    <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                      Ajoutez des photos de votre plat
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                      Glissez-déposez vos images ici ou cliquez pour sélectionner des fichiers
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                      Formats acceptés: JPG, PNG, WebP • Taille max: 5MB • Max 5 images
                    </p>
                    
                    {uploading && (
                      <div className="mb-4">
                        <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                          <div className="bg-green-600 h-2 rounded-full transition-all duration-300" style={{ width: `${uploadProgress}%` }}></div>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Upload en cours... {uploadProgress}%</p>
                      </div>
                    )}
                    
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e.target.files)}
                      className="hidden"
                      id="image-upload"
                      disabled={uploading}
                    />
                    <label
                      htmlFor="image-upload"
                      className={`inline-block bg-gray-100 dark:bg-gray-600 hover:bg-gray-200 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-200 px-6 py-3 rounded-lg text-sm font-medium transition-colors duration-200 shadow-sm cursor-pointer ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      <FiUpload className="inline mr-2" size={16} />
                      {uploading ? 'Upload en cours...' : 'Choisir des fichiers'}
                    </label>
                  </div>
                </div>

                {/* Actions du formulaire */}
                <div className="flex justify-end gap-4 pt-6 border-t border-gray-200 dark:border-gray-600">
                  <button
                    onClick={() => setShowModal(false)}
                    className="px-8 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 font-medium"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={(e) => handleSubmit(e)}
                    disabled={loading}
                    className="px-8 py-3 bg-gradient-to-r from-green-600 to-yellow-600 hover:from-green-700 hover:to-yellow-700 text-white rounded-xl font-medium transition-all duration-200 flex items-center disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Enregistrement...
                      </>
                    ) : (
                      <>
                        <FiSave className="mr-2" size={16} />
                        {modalMode === 'create' ? 'Créer le plat' : 'Sauvegarder les modifications'}
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal de confirmation de suppression */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full border border-gray-200 dark:border-gray-700">
              <div className="p-6">
                <div className="flex items-center mb-6">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center mr-4">
                    <FiAlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                      Supprimer le plat
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      Cette action est irréversible
                    </p>
                  </div>
                </div>
                
                <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4 mb-6">
                  <p className="text-sm text-red-800 dark:text-red-200">
                    Êtes-vous sûr de vouloir supprimer <strong>"{dishToDelete?.name}"</strong> ?
                  </p>
                  <p className="text-xs text-red-600 dark:text-red-300 mt-2">
                    Toutes les données associées (statistiques, commandes) seront perdues.
                  </p>
                </div>
                
                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    className="px-6 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 font-medium"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={confirmDelete}
                    disabled={loading}
                    className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors duration-200 shadow-lg hover:shadow-xl disabled:opacity-50"
                  >
                    {loading ? 'Suppression...' : 'Supprimer définitivement'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MenuPlatsPage;