// i18n.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translations
import enTranslation from './locales/en/translation.json';
import frTranslation from './locales/fr/translation.json';

// Import restaurant translations
import { restaurantTranslations } from './restaurant_i18n_translations';

// Merge translations
const resources = {
  en: {
    translation: {
      ...restaurantTranslations.en,
      ...enTranslation,
      // Navigation
      nav: {
        home: 'Home',
        restaurants: 'Restaurants',
        about: 'About',
        contact: 'Contact',
        account: 'Account',
        cart: 'Cart'
      },

      // Hero Section
      hero: {
        title: 'Order Delicious Food With',
        subtitle: 'Fast delivery to your doorstep',
        searchPlaceholder: 'Search for restaurants or foods',
        orderButton: 'Order Now',
        becomePartner: 'Become a Partner',
        delivery: 'Delivery',
        minutes: 'min',
        location: 'Your Location'
      },

      // Sections
      sections: {
        categories: 'Categories',
        featuredRestaurants: 'Featured Restaurants',
        howItWorks: 'How It Works',
        testimonials: 'What Our Customers Say',
        ourTeam: 'Our Team',
        mission: 'Our Mission',
        contactForm: 'Get In Touch',
        contactInfo: 'Contact Information'
      },

      // Categories
      categories: {
        all: 'All',
        traditional: 'Traditional',
        fastFood: 'Fast Food',
        vegetarian: 'Vegetarian',
        italian: 'Italian',
        seafood: 'Seafood',
        african: 'African'
      },

      // Restaurants
      restaurants: {
        minutes: 'min',
        order: 'Order',
        searchPlaceholder: 'Search for restaurants or dishes',
        filters: 'Filters',
        found: 'restaurants found',
        noResults: 'No restaurants match your filters',
        resetFilters: 'Reset all filters',
        title: 'Discover the Best Restaurants',
        subtitle: 'Find and order from top restaurants in your city',
        refineSearch: 'Refine Your Search',
        allCategories: 'All Categories',
        allZones: 'All Zones',
        allDistricts: 'All Districts',
        allPrices: 'All Prices',
        anyTime: 'Any Time',
        anyFee: 'Any Fee',
        featured: 'Featured',
        loading: 'Loading restaurants...',
        noComments: 'No comments yet',
        writeReview: 'Write your review...',
        writeReply: 'Write your reply...',
        send: 'Send',
        leaveReview: 'Leave a Review',
        popularDishes: 'Popular Dishes',
        deliveryFee: 'delivery fee',
        minOrder: 'Min. order',
        tryAdjusting: 'Try adjusting your search or filters',
        category: 'Category',
        zone: 'Zone',
        district: 'District',
        priceRange: 'Price Range',
        maxDeliveryTime: 'Max Delivery Time',
        maxDeliveryFee: 'Max Delivery Fee',
        menu: 'Menu',
        reviews: 'Reviews',
        reply: 'Reply',
        like: 'Like',
        dislike: 'Dislike'
      },

      // How It Works
      howItWorks: {
        description: 'Simple and easy way to order your food',
        step1Title: 'Choose Restaurant',
        step1Description: 'Select from our diverse range of restaurants',
        step2Title: 'Select Food',
        step2Description: 'Browse menus and select your favorite meals',
        step3Title: 'Fast Delivery',
        step3Description: 'Enjoy prompt delivery to your doorstep'
      },

      // About
      about: {
        title: 'About Eatfast',
        subtitle: 'Revolutionizing food delivery in Cameroon',
        description: 'Eatfast is a pioneering food delivery platform connecting customers with their favorite local restaurants.',
        slogan: 'Fast. Fresh. Delivered.',
        missionTitle: 'Our Mission',
        missionText: 'To connect people with the food they love through innovative technology.',
        visionTitle: 'Our Vision',
        visionText: 'To become Cameroon\'s most trusted food delivery platform.'
      },

      // Team
      team: {
        ceo: 'CEO & Founder',
        seniorDev: 'Senior Developer',
        juniorDev: 'Junior Developer',
        uiUx: 'UI/UX Designer'
      },

      // Testimonials
      testimonials: {
        customer1: 'Eatfast has transformed my lunch breaks!',
        customer2: 'The 30-minute delivery guarantee is real!',
        customer3: 'As a restaurant owner, Eatfast has helped me reach new customers.'
      },

      // Contact
      contact: {
        title: 'Contact Us',
        subtitle: 'Get in touch with us',
        description: 'Have questions? We\'d love to hear from you.',
        form: {
          name: 'Full Name',
          email: 'Email Address',
          phone: 'Phone Number',
          message: 'Message',
          send: 'Send Message'
        },
        info: {
          address: 'Address',
          phone: 'Phone',
          email: 'Email',
          hours: 'Business Hours'
        }
      }
    }
  },
  fr: {
    translation: {
      ...restaurantTranslations.fr,
      ...frTranslation,
      // Navigation
      nav: {
        home: 'Accueil',
        restaurants: 'Restaurants',
        about: 'À propos',
        contact: 'Contact',
        account: 'Compte',
        cart: 'Panier'
      },

      // Hero Section
      hero: {
        title: 'Commandez de la Nourriture Délicieuse',
        subtitle: 'Livraison rapide à votre porte',
        searchPlaceholder: 'Rechercher des restaurants ou des plats',
        orderButton: 'Commander Maintenant',
        becomePartner: 'Devenir Partenaire',
        delivery: 'Livraison',
        minutes: 'min',
        location: 'Votre Localisation'
      },

      // Sections
      sections: {
        categories: 'Catégories',
        featuredRestaurants: 'Restaurants en Vedette',
        howItWorks: 'Comment ça Marche',
        testimonials: 'Ce que Disent Nos Clients',
        ourTeam: 'Notre Équipe',
        mission: 'Notre Mission',
        contactForm: 'Nous Contacter',
        contactInfo: 'Informations de Contact'
      },

      // Categories
      categories: {
        all: 'Tous',
        traditional: 'Traditionnel',
        fastFood: 'Fast Food',
        vegetarian: 'Végétarien',
        italian: 'Italien',
        seafood: 'Fruits de mer',
        african: 'Africain'
      },

      // Restaurants
      restaurants: {
        minutes: 'min',
        order: 'Commander',
        searchPlaceholder: 'Rechercher des restaurants ou des plats',
        filters: 'Filtres',
        found: 'restaurants trouvés',
        noResults: 'Aucun restaurant ne correspond à vos filtres',
        resetFilters: 'Réinitialiser tous les filtres',
        title: 'Découvrez les Meilleurs Restaurants',
        subtitle: 'Trouvez et commandez dans les meilleurs restaurants de votre ville',
        refineSearch: 'Affiner Votre Recherche',
        allCategories: 'Toutes les Catégories',
        allZones: 'Toutes les Zones',
        allDistricts: 'Tous les Districts',
        allPrices: 'Tous les Prix',
        anyTime: 'N\'importe Quand',
        anyFee: 'N\'importe Quel Frais',
        featured: 'En Vedette',
        loading: 'Chargement des restaurants...',
        noComments: 'Aucun commentaire pour le moment',
        writeReview: 'Écrire votre avis...',
        writeReply: 'Écrire votre réponse...',
        send: 'Envoyer',
        leaveReview: 'Laisser un Avis',
        popularDishes: 'Plats Populaires',
        deliveryFee: 'frais de livraison',
        minOrder: 'Commande min.',
        tryAdjusting: 'Essayez d\'ajuster votre recherche ou vos filtres',
        category: 'Catégorie',
        zone: 'Zone',
        district: 'District',
        priceRange: 'Fourchette de Prix',
        maxDeliveryTime: 'Temps de Livraison Max',
        maxDeliveryFee: 'Frais de Livraison Max',
        menu: 'Menu',
        reviews: 'Avis',
        reply: 'Répondre',
        like: 'J\'aime',
        dislike: 'Je n\'aime pas'
      },

      // How It Works
      howItWorks: {
        description: 'Moyen simple et facile de commander votre nourriture',
        step1Title: 'Choisir un Restaurant',
        step1Description: 'Sélectionnez parmi notre gamme diversifiée de restaurants',
        step2Title: 'Sélectionner la Nourriture',
        step2Description: 'Parcourez les menus et sélectionnez vos plats préférés',
        step3Title: 'Livraison Rapide',
        step3Description: 'Profitez d\'une livraison rapide à votre porte'
      },

      // About
      about: {
        title: 'À Propos d\'Eatfast',
        subtitle: 'Révolutionner la livraison de nourriture au Cameroun',
        description: 'Eatfast est une plateforme de livraison de nourriture pionnière qui connecte les clients avec leurs restaurants locaux préférés.',
        slogan: 'Rapide. Frais. Livré.',
        missionTitle: 'Notre Mission',
        missionText: 'Connecter les gens avec la nourriture qu\'ils aiment grâce à une technologie innovante.',
        visionTitle: 'Notre Vision',
        visionText: 'Devenir la plateforme de livraison de nourriture la plus fiable du Cameroun.'
      },

      // Team
      team: {
        ceo: 'PDG & Fondateur',
        seniorDev: 'Développeur Senior',
        juniorDev: 'Développeur Junior',
        uiUx: 'Designer UI/UX'
      },

      // Testimonials
      testimonials: {
        customer1: 'Eatfast a transformé mes pauses déjeuner !',
        customer2: 'La garantie de livraison en 30 minutes est réelle !',
        customer3: 'En tant que propriétaire de restaurant, Eatfast m\'a aidé à atteindre de nouveaux clients.'
      },

      // Contact
      contact: {
        title: 'Contactez-nous',
        subtitle: 'Entrez en contact avec nous',
        description: 'Des questions ? Nous aimerions avoir de vos nouvelles.',
        form: {
          name: 'Nom Complet',
          email: 'Adresse Email',
          phone: 'Numéro de Téléphone',
          message: 'Message',
          send: 'Envoyer le Message'
        },
        info: {
          address: 'Adresse',
          phone: 'Téléphone',
          email: 'Email',
          hours: 'Heures d\'Ouverture'
        }
      }
    }
  }
};

// Initialize i18n with error handling
const initI18n = async () => {
  try {
    await i18n
      .use(LanguageDetector)
      .use(initReactI18next)
      .init({
        resources,
        fallbackLng: 'fr',
        debug: false,
        interpolation: {
          escapeValue: false,
        },
        detection: {
          order: ['localStorage', 'navigator', 'htmlTag'],
          caches: ['localStorage'],
        },
        react: {
          useSuspense: false,
        },
      });
  } catch (error) {
    console.error('Failed to initialize i18n:', error);
    // Fallback initialization
    i18n.init({
      resources,
      lng: 'fr',
      fallbackLng: 'fr',
      interpolation: {
        escapeValue: false,
      },
      react: {
        useSuspense: false,
      },
    });
  }
};

// Initialize immediately
initI18n();

export default i18n;