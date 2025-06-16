// src/services/MenuPlatsServices.js - Updated for new backend endpoints
import dbConnection from '../db_connection';

/**
 * Service for menu and dish management
 * Updated to work with the new /api/v1/menu endpoints
 */
class MenuPlatsServices {
  constructor() {
    this.apiClient = dbConnection;
    this.baseEndpoint = '/menu'; // Updated to use menu endpoints
  }

  // ==================== GESTION DES PLATS ====================

  /**
   * Récupère tous les plats avec filtres optionnels
   * @param {Object} filters - Filtres de recherche
   * @param {string} filters.search - Terme de recherche
   * @param {number} filters.categoryId - ID de la catégorie
   * @param {string} filters.sortBy - Critère de tri (name, price, orders, rating, revenue)
   * @param {boolean} filters.available - Filtrer par disponibilité
   * @param {boolean} filters.featured - Filtrer par mise en vedette
   * @param {boolean} filters.spicy - Filtrer par plats épicés
   * @param {boolean} filters.vegetarian - Filtrer par plats végétariens
   * @param {boolean} filters.glutenFree - Filtrer par plats sans gluten
   * @returns {Promise<Object>} Réponse avec la liste des plats
   */
  async getDishes(filters = {}) {
    try {
      const params = this.buildFilterParams(filters);
      const response = await this.apiClient.get(`${this.baseEndpoint}/dishes`, { params });
      
      return {
        success: true,
        data: response.data.data || [],
        pagination: response.data.pagination || null,
        message: 'Plats récupérés avec succès'
      };
    } catch (error) {
      console.error('Erreur lors de la récupération des plats:', error);
      return this.handleServiceError(error, 'Impossible de récupérer les plats');
    }
  }

  /**
   * Récupère un plat par son ID
   * @param {number} dishId - ID du plat
   * @returns {Promise<Object>} Réponse avec les détails du plat
   */
  async getDishById(dishId) {
    try {
      if (!dishId) {
        throw new Error('ID du plat requis');
      }

      const response = await this.apiClient.get(`${this.baseEndpoint}/dishes/${dishId}`);
      
      return {
        success: true,
        data: response.data.data,
        message: 'Plat récupéré avec succès'
      };
    } catch (error) {
      console.error('Erreur lors de la récupération du plat:', error);
      return this.handleServiceError(error, 'Impossible de récupérer le plat');
    }
  }

  /**
   * Crée un nouveau plat
   * @param {Object} dishData - Données du plat à créer
   * @returns {Promise<Object>} Réponse avec le plat créé
   */
  async createDish(dishData) {
    try {
      // Validation des données requises
      this.validateDishData(dishData);

      // Préparation des données
      const preparedData = this.prepareDishData(dishData);

      const response = await this.apiClient.post(`${this.baseEndpoint}/dishes`, preparedData);
      
      return {
        success: true,
        data: response.data.data,
        message: 'Plat créé avec succès'
      };
    } catch (error) {
      console.error('Erreur lors de la création du plat:', error);
      return this.handleServiceError(error, 'Impossible de créer le plat');
    }
  }

  /**
   * Met à jour un plat existant
   * @param {number} dishId - ID du plat à mettre à jour
   * @param {Object} dishData - Nouvelles données du plat
   * @returns {Promise<Object>} Réponse avec le plat mis à jour
   */
  async updateDish(dishId, dishData) {
    try {
      if (!dishId) {
        throw new Error('ID du plat requis');
      }

      // Validation des données
      this.validateDishData(dishData, false); // false = pas de validation stricte pour update

      // Préparation des données
      const preparedData = this.prepareDishData(dishData);

      const response = await this.apiClient.put(`${this.baseEndpoint}/dishes/${dishId}`, preparedData);
      
      return {
        success: true,
        data: response.data.data,
        message: 'Plat mis à jour avec succès'
      };
    } catch (error) {
      console.error('Erreur lors de la mise à jour du plat:', error);
      return this.handleServiceError(error, 'Impossible de mettre à jour le plat');
    }
  }

  /**
   * Supprime un plat
   * @param {number} dishId - ID du plat à supprimer
   * @returns {Promise<Object>} Réponse de confirmation
   */
  async deleteDish(dishId) {
    try {
      if (!dishId) {
        throw new Error('ID du plat requis');
      }

      const response = await this.apiClient.delete(`${this.baseEndpoint}/dishes/${dishId}`);
      
      return {
        success: true,
        data: response.data.data,
        message: 'Plat supprimé avec succès'
      };
    } catch (error) {
      console.error('Erreur lors de la suppression du plat:', error);
      return this.handleServiceError(error, 'Impossible de supprimer le plat');
    }
  }

  /**
   * Bascule la disponibilité d'un plat
   * @param {number} dishId - ID du plat
   * @param {boolean} available - Nouvel état de disponibilité
   * @returns {Promise<Object>} Réponse avec le plat mis à jour
   */
  async toggleDishAvailability(dishId, available) {
    try {
      if (!dishId) {
        throw new Error('ID du plat requis');
      }

      const response = await this.apiClient.put(`${this.baseEndpoint}/dishes/${dishId}/availability`, {
        available: Boolean(available)
      });
      
      return {
        success: true,
        data: response.data.data,
        message: `Plat ${available ? 'rendu disponible' : 'rendu indisponible'}`
      };
    } catch (error) {
      console.error('Erreur lors du changement de disponibilité:', error);
      return this.handleServiceError(error, 'Impossible de changer la disponibilité');
    }
  }

  /**
   * Bascule le statut "en vedette" d'un plat
   * @param {number} dishId - ID du plat
   * @param {boolean} featured - Nouvel état de mise en vedette
   * @returns {Promise<Object>} Réponse avec le plat mis à jour
   */
  async toggleDishFeatured(dishId, featured) {
    try {
      if (!dishId) {
        throw new Error('ID du plat requis');
      }

      const response = await this.apiClient.put(`${this.baseEndpoint}/dishes/${dishId}/featured`, {
        featured: Boolean(featured)
      });
      
      return {
        success: true,
        data: response.data.data,
        message: `Plat ${featured ? 'mis en vedette' : 'retiré de la vedette'}`
      };
    } catch (error) {
      console.error('Erreur lors du changement de statut vedette:', error);
      return this.handleServiceError(error, 'Impossible de changer le statut vedette');
    }
  }

  // ==================== GESTION DES CATÉGORIES ====================

  /**
   * Récupère toutes les catégories
   * @returns {Promise<Object>} Réponse avec la liste des catégories
   */
  async getCategories() {
    try {
      const response = await this.apiClient.get(`${this.baseEndpoint}/categories`);
      
      return {
        success: true,
        data: response.data.data || [],
        message: 'Catégories récupérées avec succès'
      };
    } catch (error) {
      console.error('Erreur lors de la récupération des catégories:', error);
      return this.handleServiceError(error, 'Impossible de récupérer les catégories');
    }
  }

  /**
   * Crée une nouvelle catégorie
   * @param {Object} categoryData - Données de la catégorie
   * @returns {Promise<Object>} Réponse avec la catégorie créée
   */
  async createCategory(categoryData) {
    try {
      this.validateCategoryData(categoryData);

      const response = await this.apiClient.post(`${this.baseEndpoint}/categories`, categoryData);
      
      return {
        success: true,
        data: response.data.data,
        message: 'Catégorie créée avec succès'
      };
    } catch (error) {
      console.error('Erreur lors de la création de la catégorie:', error);
      return this.handleServiceError(error, 'Impossible de créer la catégorie');
    }
  }

  /**
   * Met à jour une catégorie
   * @param {number} categoryId - ID de la catégorie
   * @param {Object} categoryData - Nouvelles données de la catégorie
   * @returns {Promise<Object>} Réponse avec la catégorie mise à jour
   */
  async updateCategory(categoryId, categoryData) {
    try {
      if (!categoryId) {
        throw new Error('ID de la catégorie requis');
      }

      this.validateCategoryData(categoryData, false);

      const response = await this.apiClient.put(`${this.baseEndpoint}/categories/${categoryId}`, categoryData);
      
      return {
        success: true,
        data: response.data.data,
        message: 'Catégorie mise à jour avec succès'
      };
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la catégorie:', error);
      return this.handleServiceError(error, 'Impossible de mettre à jour la catégorie');
    }
  }

  /**
   * Supprime une catégorie
   * @param {number} categoryId - ID de la catégorie à supprimer
   * @returns {Promise<Object>} Réponse de confirmation
   */
  async deleteCategory(categoryId) {
    try {
      if (!categoryId) {
        throw new Error('ID de la catégorie requis');
      }

      const response = await this.apiClient.delete(`${this.baseEndpoint}/categories/${categoryId}`);
      
      return {
        success: true,
        data: response.data.data,
        message: 'Catégorie supprimée avec succès'
      };
    } catch (error) {
      console.error('Erreur lors de la suppression de la catégorie:', error);
      return this.handleServiceError(error, 'Impossible de supprimer la catégorie');
    }
  }

  // ==================== GESTION DES IMAGES ====================

  /**
   * Upload d'images pour un plat
   * @param {number} dishId - ID du plat
   * @param {FileList} images - Liste des fichiers images
   * @param {Function} onProgress - Callback de progression
   * @returns {Promise<Object>} Réponse avec les URLs des images uploadées
   */
  async uploadDishImages(dishId, images, onProgress = null) {
    try {
      if (!dishId) {
        throw new Error('ID du plat requis');
      }

      if (!images || images.length === 0) {
        throw new Error('Aucune image fournie');
      }

      // Validation des fichiers
      for (let i = 0; i < images.length; i++) {
        const validation = this.apiClient.validateFile ? 
          this.apiClient.validateFile(images[i], {
            maxSize: 5 * 1024 * 1024, // 5MB
            allowedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
          }) : { isValid: true };

        if (!validation.isValid) {
          throw new Error(`Fichier ${images[i].name}: ${validation.errors?.join(', ') || 'Format non supporté'}`);
        }
      }

      // Préparation du FormData
      const formData = new FormData();
      for (let i = 0; i < images.length; i++) {
        formData.append('images', images[i]);
      }
      formData.append('dishId', dishId.toString());

      // Upload avec progression
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: onProgress ? (progressEvent) => {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(progress);
        } : undefined
      };

      const response = await this.apiClient.post(
        `${this.baseEndpoint}/dishes/${dishId}/images`,
        formData,
        config
      );
      
      return {
        success: true,
        data: response.data.data,
        message: 'Images uploadées avec succès'
      };
    } catch (error) {
      console.error('Erreur lors de l\'upload des images:', error);
      return this.handleServiceError(error, 'Impossible d\'uploader les images');
    }
  }

  /**
   * Supprime une image d'un plat
   * @param {number} dishId - ID du plat
   * @param {string} imageId - ID de l'image à supprimer
   * @returns {Promise<Object>} Réponse de confirmation
   */
  async deleteDishImage(dishId, imageId) {
    try {
      if (!dishId || !imageId) {
        throw new Error('ID du plat et de l\'image requis');
      }

      const response = await this.apiClient.delete(`${this.baseEndpoint}/dishes/${dishId}/images/${imageId}`);
      
      return {
        success: true,
        data: response.data.data,
        message: 'Image supprimée avec succès'
      };
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'image:', error);
      return this.handleServiceError(error, 'Impossible de supprimer l\'image');
    }
  }

  // ==================== STATISTIQUES ====================

  /**
   * Récupère les statistiques du menu
   * @param {Object} options - Options pour les statistiques
   * @returns {Promise<Object>} Réponse avec les statistiques
   */
  async getMenuStatistics(options = {}) {
    try {
      const params = {
        period: options.period || '30d',
        groupBy: options.groupBy || 'day'
      };

      const response = await this.apiClient.get(`${this.baseEndpoint}/statistics`, { params });
      
      return {
        success: true,
        data: response.data.data,
        message: 'Statistiques récupérées avec succès'
      };
    } catch (error) {
      console.error('Erreur lors de la récupération des statistiques:', error);
      return this.handleServiceError(error, 'Impossible de récupérer les statistiques');
    }
  }

  /**
   * Récupère les plats les plus populaires
   * @param {number} limit - Nombre de plats à récupérer
   * @returns {Promise<Object>} Réponse avec les plats populaires
   */
  async getPopularDishes(limit = 10) {
    try {
      const response = await this.apiClient.get(`${this.baseEndpoint}/dishes`, { 
        params: { 
          sortBy: 'orders',
          order: 'DESC',
          limit,
          featured: true
        }
      });
      
      return {
        success: true,
        data: response.data.data || [],
        message: 'Plats populaires récupérés avec succès'
      };
    } catch (error) {
      console.error('Erreur lors de la récupération des plats populaires:', error);
      return this.handleServiceError(error, 'Impossible de récupérer les plats populaires');
    }
  }

  // ==================== MÉTHODES UTILITAIRES ====================

  /**
   * Construit les paramètres de filtre pour les requêtes
   * @param {Object} filters - Filtres à appliquer
   * @returns {Object} Paramètres formatés
   */
  buildFilterParams(filters) {
    const params = {};

    if (filters.search && filters.search.trim()) {
      params.search = filters.search.trim();
    }

    if (filters.categoryId && filters.categoryId !== 'all') {
      params.categoryId = parseInt(filters.categoryId);
    }

    if (filters.sortBy) {
      params.sortBy = filters.sortBy;
    }

    if (filters.order) {
      params.order = filters.order;
    }

    if (typeof filters.available === 'boolean') {
      params.available = filters.available;
    }

    if (typeof filters.featured === 'boolean') {
      params.featured = filters.featured;
    }

    if (filters.spicy !== undefined) {
      params.spicy = filters.spicy;
    }

    if (filters.vegetarian !== undefined) {
      params.vegetarian = filters.vegetarian;
    }

    if (filters.glutenFree !== undefined) {
      params.glutenFree = filters.glutenFree;
    }

    if (filters.page) {
      params.page = parseInt(filters.page);
    }

    if (filters.limit) {
      params.limit = parseInt(filters.limit);
    }

    return params;
  }

  /**
   * Valide les données d'un plat
   * @param {Object} dishData - Données à valider
   * @param {boolean} strict - Validation stricte (pour création)
   */
  validateDishData(dishData, strict = true) {
    const errors = [];

    if (strict) {
      if (!dishData.name || !dishData.name.trim()) {
        errors.push('Le nom du plat est requis');
      }

      if (!dishData.description || !dishData.description.trim()) {
        errors.push('La description est requise');
      }

      if (!dishData.price || dishData.price <= 0) {
        errors.push('Le prix doit être supérieur à 0');
      }

      if (!dishData.category) {
        errors.push('La catégorie est requise');
      }
    }

    if (dishData.name && dishData.name.length > 200) {
      errors.push('Le nom du plat ne peut pas dépasser 200 caractères');
    }

    if (dishData.description && dishData.description.length > 2000) {
      errors.push('La description ne peut pas dépasser 2000 caractères');
    }

    if (dishData.preparationTime && (dishData.preparationTime < 1 || dishData.preparationTime > 300)) {
      errors.push('Le temps de préparation doit être entre 1 et 300 minutes');
    }

    if (errors.length > 0) {
      throw new Error(errors.join(', '));
    }
  }

  /**
   * Valide les données d'une catégorie
   * @param {Object} categoryData - Données à valider
   * @param {boolean} strict - Validation stricte
   */
  validateCategoryData(categoryData, strict = true) {
    const errors = [];

    if (strict) {
      if (!categoryData.name || !categoryData.name.trim()) {
        errors.push('Le nom de la catégorie est requis');
      }
    }

    if (categoryData.name && categoryData.name.length > 100) {
      errors.push('Le nom de la catégorie ne peut pas dépasser 100 caractères');
    }

    if (errors.length > 0) {
      throw new Error(errors.join(', '));
    }
  }

  /**
   * Prépare les données d'un plat pour l'envoi au backend
   * @param {Object} dishData - Données brutes du plat
   * @returns {Object} Données formatées
   */
  prepareDishData(dishData) {
    const prepared = {
      name: dishData.name?.trim(),
      description: dishData.description?.trim(),
      price: parseFloat(dishData.price) || 0,
      category: parseInt(dishData.category) || null,
      ingredients: dishData.ingredients?.trim() || '',
      allergens: dishData.allergens?.trim() || '',
      preparationTime: parseInt(dishData.preparationTime) || 15,
      available: Boolean(dishData.available !== false), // Default to true
      featured: Boolean(dishData.featured),
      spicy: Boolean(dishData.spicy),
      vegetarian: Boolean(dishData.vegetarian),
      glutenFree: Boolean(dishData.glutenFree),
      lactoseFree: Boolean(dishData.lactoseFree)
    };

    // Gestion de la disponibilité horaire
    if (dishData.timeBasedAvailability) {
      prepared.timeBasedAvailability = {
        enabled: Boolean(dishData.timeBasedAvailability.enabled),
        startTime: dishData.timeBasedAvailability.startTime || null,
        endTime: dishData.timeBasedAvailability.endTime || null
      };
    }

    // Gestion des informations nutritionnelles
    if (dishData.nutritionalInfo) {
      prepared.nutritionalInfo = {
        calories: parseInt(dishData.nutritionalInfo.calories) || 0,
        protein: parseInt(dishData.nutritionalInfo.protein) || 0,
        carbs: parseInt(dishData.nutritionalInfo.carbs) || 0,
        fat: parseInt(dishData.nutritionalInfo.fat) || 0
      };
    }

    // Gestion des images
    if (dishData.images && Array.isArray(dishData.images)) {
      prepared.images = dishData.images;
    }

    // Filtrer les valeurs nulles/undefined
    Object.keys(prepared).forEach(key => {
      if (prepared[key] === null || prepared[key] === undefined) {
        delete prepared[key];
      }
    });

    return prepared;
  }

  /**
   * Gère les erreurs de service de manière cohérente
   * @param {Error} error - Erreur à traiter
   * @param {string} defaultMessage - Message par défaut
   * @returns {Object} Réponse d'erreur formatée
   */
  handleServiceError(error, defaultMessage) {
    let message = defaultMessage;
    let errors = [];

    if (error.response?.data?.message) {
      message = error.response.data.message;
    } else if (error.message) {
      message = error.message;
    }

    if (error.response?.data?.errors) {
      errors = Array.isArray(error.response.data.errors) 
        ? error.response.data.errors 
        : [error.response.data.errors];
    }

    return {
      success: false,
      message,
      errors,
      status: error.response?.status || 0
    };
  }

  // ==================== MÉTHODES DE RECHERCHE AVANCÉE ====================

  /**
   * Recherche de plats avec suggestions
   * @param {string} query - Terme de recherche
   * @param {Object} options - Options de recherche
   * @returns {Promise<Object>} Résultats de recherche avec suggestions
   */
  async searchDishes(query, options = {}) {
    try {
      const params = {
        search: query.trim(),
        limit: options.limit || 20,
        sortBy: options.sortBy || 'name'
      };

      const response = await this.apiClient.get(`${this.baseEndpoint}/dishes`, { params });
      
      return {
        success: true,
        data: response.data.data || [],
        pagination: response.data.pagination,
        suggestions: [], // À implémenter côté backend si nécessaire
        message: 'Recherche effectuée avec succès'
      };
    } catch (error) {
      console.error('Erreur lors de la recherche:', error);
      return this.handleServiceError(error, 'Erreur lors de la recherche');
    }
  }

  /**
   * Exporte les données du menu
   * @param {string} format - Format d'export (csv, xlsx, json)
   * @param {Object} filters - Filtres à appliquer
   * @returns {Promise<Object>} Données exportées
   */
  async exportMenu(format = 'csv', filters = {}) {
    try {
      const params = {
        format,
        ...this.buildFilterParams(filters)
      };

      const response = await this.apiClient.get(`${this.baseEndpoint}/export`, { 
        params,
        responseType: 'blob' // Important pour les fichiers
      });
      
      return {
        success: true,
        data: response.data,
        fileName: response.headers['content-disposition']?.split('filename=')[1] || `menu_export.${format}`,
        message: 'Export généré avec succès'
      };
    } catch (error) {
      console.error('Erreur lors de l\'export:', error);
      return this.handleServiceError(error, 'Impossible de générer l\'export');
    }
  }
}

// Instance singleton du service
const menuPlatsServices = new MenuPlatsServices();

// Export par défaut de l'instance
export default menuPlatsServices;

// Export de la classe pour les tests ou instanciation personnalisée
export { MenuPlatsServices };