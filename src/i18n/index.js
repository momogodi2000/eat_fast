// i18n.js
import i18n from 'i18next';
import { initReactI18next, useTranslation } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translations
import enTranslation from './locales/en/translation.json';
import frTranslation from './locales/fr/translation.json';
import enAdmin from './locales/en/admin.json';
import frAdmin from './locales/fr/admin.json';

// Import restaurant translations
import { restaurantTranslations } from './restaurant_i18n_translations';

// Import Gemini translation service
import geminiTranslationService from '../Services/geminiTranslationService';

// Merge translations
const resources = {
  en: {
    translation: {
      ...restaurantTranslations.en,
      ...enTranslation,
      ...enAdmin,

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
      },

      // App
      app: {
        title: 'Download Our Mobile App',
        description: 'Get exclusive app-only offers and faster ordering',
        downloadOn: 'Download on',
        getItOn: 'Get it on'
      },

      // Footer
      footer: {
        description: 'Eatfast is your go-to food delivery app in Cameroon.',
        quickLinks: 'Quick Links',
        aboutUs: 'About Us',
        restaurants: 'Restaurants',
        becomePartner: 'Become a Partner',
        careers: 'Careers',
        contactUs: 'Contact Us',
        legal: 'Legal',
        terms: 'Terms & Conditions',
        privacy: 'Privacy Policy',
        cookies: 'Cookies Policy',
        licensing: 'Licensing',
        contact: 'Contact',
        newsletter: 'Newsletter',
        emailPlaceholder: 'Your email',
        subscribe: 'Subscribe',
        allRightsReserved: 'All rights reserved.'
      },

      // Login
      login: {
        title: 'Login to Your Account',
        subtitle: 'Welcome back! Please enter your details',
        email: 'Email',
        emailPlaceholder: 'Enter your email',
        password: 'Password',
        passwordPlaceholder: 'Enter your password',
        rememberMe: 'Remember me',
        forgotPassword: 'Forgot password?',
        loginButton: 'Sign In',
        noAccount: "Don't have an account?",
        signUp: 'Sign up',
        or: 'Or',
        continueWithGoogle: 'Continue with Google',
        continueWithFacebook: 'Continue with Facebook',
        continueWithApple: 'Continue with Apple'
      },

      // Register
      register: {
        title: 'Create Your Account',
        subtitle: 'Join thousands of food lovers',
        firstName: 'First Name',
        firstNamePlaceholder: 'Enter your first name',
        lastName: 'Last Name',
        lastNamePlaceholder: 'Enter your last name',
        email: 'Email',
        emailPlaceholder: 'Enter your email',
        phone: 'Phone Number',
        phonePlaceholder: 'Enter your phone number',
        password: 'Password',
        passwordPlaceholder: 'Create a password',
        confirmPassword: 'Confirm Password',
        confirmPasswordPlaceholder: 'Confirm your password',
        agreeToTerms: 'I agree to the',
        termsAndConditions: 'Terms & Conditions',
        and: 'and',
        privacyPolicy: 'Privacy Policy',
        registerButton: 'Create Account',
        alreadyHaveAccount: 'Already have an account?',
        signIn: 'Sign in',
        or: 'Or',
        continueWithGoogle: 'Continue with Google',
        continueWithFacebook: 'Continue with Facebook',
        continueWithApple: 'Continue with Apple'
      },

      // Forgot Password
      forgotPassword: {
        title: 'Reset Your Password',
        subtitle: 'Enter your email to receive reset instructions',
        email: 'Email',
        emailPlaceholder: 'Enter your email',
        resetButton: 'Send Reset Link',
        backToLogin: 'Back to Login',
        checkEmail: 'Check your email',
        instructionsSent: 'We\'ve sent password reset instructions to your email'
      },

      // Dashboard
      dashboard: {
        welcome: 'Welcome back',
        totalOrders: 'Total Orders',
        totalRevenue: 'Total Revenue',
        activeRestaurants: 'Active Restaurants',
        pendingDeliveries: 'Pending Deliveries',
        recentOrders: 'Recent Orders',
        viewAll: 'View All',
        orderNumber: 'Order #',
        status: {
          pending: 'Pending',
          preparing: 'Preparing',
          delivering: 'Delivering',
          completed: 'Completed',
          cancelled: 'Cancelled'
        }
      },

      // Profile
      profile: {
        title: 'My Profile',
        personalInfo: 'Personal Information',
        contactInfo: 'Contact Information',
        preferences: 'Preferences',
        security: 'Security',
        firstName: 'First Name',
        lastName: 'Last Name',
        email: 'Email',
        phone: 'Phone',
        address: 'Address',
        city: 'City',
        language: 'Language',
        currency: 'Currency',
        notifications: 'Notifications',
        emailNotifications: 'Email Notifications',
        pushNotifications: 'Push Notifications',
        smsNotifications: 'SMS Notifications',
        saveChanges: 'Save Changes',
        changePassword: 'Change Password',
        currentPassword: 'Current Password',
        newPassword: 'New Password',
        confirmNewPassword: 'Confirm New Password',
        updatePassword: 'Update Password'
      },

      // Orders
      orders: {
        title: 'My Orders',
        orderHistory: 'Order History',
        currentOrders: 'Current Orders',
        pastOrders: 'Past Orders',
        orderNumber: 'Order #',
        orderDate: 'Order Date',
        restaurant: 'Restaurant',
        items: 'Items',
        total: 'Total',
        status: 'Status',
        actions: 'Actions',
        viewDetails: 'View Details',
        reorder: 'Reorder',
        rateOrder: 'Rate Order',
        trackOrder: 'Track Order',
        estimatedDelivery: 'Estimated Delivery',
        deliveredAt: 'Delivered At',
        orderItems: 'Order Items',
        deliveryAddress: 'Delivery Address',
        paymentMethod: 'Payment Method',
        orderSummary: 'Order Summary',
        subtotal: 'Subtotal',
        deliveryFee: 'Delivery Fee',
        tax: 'Tax',
        total: 'Total'
      },

      // Cart
      cart: {
        title: 'Shopping Cart',
        items: 'Items',
        item: 'Item',
        quantity: 'Quantity',
        price: 'Price',
        total: 'Total',
        subtotal: 'Subtotal',
        deliveryFee: 'Delivery Fee',
        tax: 'Tax',
        grandTotal: 'Grand Total',
        emptyCart: 'Your cart is empty',
        addItems: 'Add some delicious items to get started',
        continueShopping: 'Continue Shopping',
        checkout: 'Proceed to Checkout',
        removeItem: 'Remove Item',
        updateQuantity: 'Update Quantity',
        clearCart: 'Clear Cart',
        saveForLater: 'Save for Later',
        applyCoupon: 'Apply Coupon',
        couponCode: 'Coupon Code',
        apply: 'Apply',
        removeCoupon: 'Remove Coupon'
      },

      // Checkout
      checkout: {
        title: 'Checkout',
        orderSummary: 'Order Summary',
        deliveryAddress: 'Delivery Address',
        paymentMethod: 'Payment Method',
        orderNotes: 'Order Notes',
        placeOrder: 'Place Order',
        backToCart: 'Back to Cart',
        addNewAddress: 'Add New Address',
        selectAddress: 'Select Address',
        addAddress: 'Add Address',
        editAddress: 'Edit Address',
        addressLine1: 'Address Line 1',
        addressLine2: 'Address Line 2 (Optional)',
        city: 'City',
        state: 'State',
        zipCode: 'Zip Code',
        country: 'Country',
        saveAddress: 'Save Address',
        paymentOptions: 'Payment Options',
        cashOnDelivery: 'Cash on Delivery',
        creditCard: 'Credit Card',
        mobileMoney: 'Mobile Money',
        cardNumber: 'Card Number',
        expiryDate: 'Expiry Date',
        cvv: 'CVV',
        cardholderName: 'Cardholder Name',
        payNow: 'Pay Now',
        orderNotesPlaceholder: 'Special instructions for delivery...',
        termsAgreement: 'I agree to the Terms & Conditions and Privacy Policy',
        orderConfirmation: 'Order Confirmation',
        orderPlaced: 'Your order has been placed successfully!',
        orderNumber: 'Order Number',
        estimatedDeliveryTime: 'Estimated Delivery Time',
        trackOrder: 'Track Order',
        continueShopping: 'Continue Shopping'
      }
    }
  },
  fr: {
    translation: {
      ...restaurantTranslations.fr,
      ...frTranslation,
      ...frAdmin,

      // Navigation
      nav: {
        home: 'Accueil',
        restaurants: 'Restaurants',
        about: 'À Propos',
        contact: 'Contact',
        account: 'Compte',
        cart: 'Panier'
      },

      // Hero Section
      hero: {
        title: 'Commandez de Délicieux Repas Avec',
        subtitle: 'Livraison rapide à votre porte',
        searchPlaceholder: 'Recherchez des restaurants ou des plats',
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
        howItWorks: 'Comment Ça Marche',
        testimonials: 'Ce Que Disent Nos Clients',
        ourTeam: 'Notre Équipe',
        mission: 'Notre Mission',
        contactForm: 'Nous Contacter',
        contactInfo: 'Informations de Contact'
      },

      // Categories
      categories: {
        all: 'Tout',
        traditional: 'Traditionnel',
        fastFood: 'Fast Food',
        vegetarian: 'Végétarien',
        italian: 'Italien',
        seafood: 'Fruits de Mer',
        african: 'Africain'
      },

      // Restaurants
      restaurants: {
        minutes: 'min',
        order: 'Commander',
        searchPlaceholder: 'Recherchez des restaurants ou des plats',
        filters: 'Filtres',
        found: 'restaurants trouvés',
        noResults: 'Aucun restaurant ne correspond à vos filtres',
        resetFilters: 'Réinitialiser tous les filtres',
        title: 'Découvrez les Meilleurs Restaurants',
        subtitle: 'Trouvez et commandez auprès des meilleurs restaurants de votre ville',
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
        writeReview: 'Écrivez votre avis...',
        writeReply: 'Écrivez votre réponse...',
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
        step1Title: 'Choisissez un Restaurant',
        step1Description: 'Sélectionnez parmi notre gamme diversifiée de restaurants',
        step2Title: 'Sélectionnez la Nourriture',
        step2Description: 'Parcourez les menus et sélectionnez vos repas préférés',
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
        title: 'Contactez-Nous',
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
      },

      // App
      app: {
        title: 'Téléchargez Notre Application Mobile',
        description: 'Obtenez des offres exclusives à l\'application et des commandes plus rapides',
        downloadOn: 'Télécharger sur',
        getItOn: 'Disponible sur'
      },

      // Footer
      footer: {
        description: 'Eatfast est votre application de livraison de nourriture au Cameroun.',
        quickLinks: 'Liens Rapides',
        aboutUs: 'À Propos de Nous',
        restaurants: 'Restaurants',
        becomePartner: 'Devenir Partenaire',
        careers: 'Carrières',
        contactUs: 'Nous Contacter',
        legal: 'Légal',
        terms: 'Conditions Générales',
        privacy: 'Politique de Confidentialité',
        cookies: 'Politique des Cookies',
        licensing: 'Licence',
        contact: 'Contact',
        newsletter: 'Newsletter',
        emailPlaceholder: 'Votre email',
        subscribe: 'S\'abonner',
        allRightsReserved: 'Tous droits réservés.'
      },

      // Login
      login: {
        title: 'Connectez-vous à Votre Compte',
        subtitle: 'Bon retour ! Veuillez entrer vos détails',
        email: 'Email',
        emailPlaceholder: 'Entrez votre email',
        password: 'Mot de Passe',
        passwordPlaceholder: 'Entrez votre mot de passe',
        rememberMe: 'Se souvenir de moi',
        forgotPassword: 'Mot de passe oublié ?',
        loginButton: 'Se Connecter',
        noAccount: 'Vous n\'avez pas de compte ?',
        signUp: 'S\'inscrire',
        or: 'Ou',
        continueWithGoogle: 'Continuer avec Google',
        continueWithFacebook: 'Continuer avec Facebook',
        continueWithApple: 'Continuer avec Apple'
      },

      // Register
      register: {
        title: 'Créez Votre Compte',
        subtitle: 'Rejoignez des milliers d\'amateurs de nourriture',
        firstName: 'Prénom',
        firstNamePlaceholder: 'Entrez votre prénom',
        lastName: 'Nom',
        lastNamePlaceholder: 'Entrez votre nom',
        email: 'Email',
        emailPlaceholder: 'Entrez votre email',
        phone: 'Numéro de Téléphone',
        phonePlaceholder: 'Entrez votre numéro de téléphone',
        password: 'Mot de Passe',
        passwordPlaceholder: 'Créez un mot de passe',
        confirmPassword: 'Confirmer le Mot de Passe',
        confirmPasswordPlaceholder: 'Confirmez votre mot de passe',
        agreeToTerms: 'J\'accepte les',
        termsAndConditions: 'Conditions Générales',
        and: 'et la',
        privacyPolicy: 'Politique de Confidentialité',
        registerButton: 'Créer un Compte',
        alreadyHaveAccount: 'Vous avez déjà un compte ?',
        signIn: 'Se connecter',
        or: 'Ou',
        continueWithGoogle: 'Continuer avec Google',
        continueWithFacebook: 'Continuer avec Facebook',
        continueWithApple: 'Continuer avec Apple'
      },

      // Forgot Password
      forgotPassword: {
        title: 'Réinitialisez Votre Mot de Passe',
        subtitle: 'Entrez votre email pour recevoir les instructions de réinitialisation',
        email: 'Email',
        emailPlaceholder: 'Entrez votre email',
        resetButton: 'Envoyer le Lien de Réinitialisation',
        backToLogin: 'Retour à la Connexion',
        checkEmail: 'Vérifiez votre email',
        instructionsSent: 'Nous avons envoyé les instructions de réinitialisation de mot de passe à votre email'
      },

      // Dashboard
      dashboard: {
        welcome: 'Bon retour',
        totalOrders: 'Total Commandes',
        totalRevenue: 'Total Revenus',
        activeRestaurants: 'Restaurants Actifs',
        pendingDeliveries: 'Livraisons en Attente',
        recentOrders: 'Commandes Récentes',
        viewAll: 'Voir Tout',
        orderNumber: 'Commande #',
        status: {
          pending: 'En Attente',
          preparing: 'En Préparation',
          delivering: 'En Livraison',
          completed: 'Terminée',
          cancelled: 'Annulée'
        }
      },

      // Profile
      profile: {
        title: 'Mon Profil',
        personalInfo: 'Informations Personnelles',
        contactInfo: 'Informations de Contact',
        preferences: 'Préférences',
        security: 'Sécurité',
        firstName: 'Prénom',
        lastName: 'Nom',
        email: 'Email',
        phone: 'Téléphone',
        address: 'Adresse',
        city: 'Ville',
        language: 'Langue',
        currency: 'Devise',
        notifications: 'Notifications',
        emailNotifications: 'Notifications Email',
        pushNotifications: 'Notifications Push',
        smsNotifications: 'Notifications SMS',
        saveChanges: 'Enregistrer les Modifications',
        changePassword: 'Changer le Mot de Passe',
        currentPassword: 'Mot de Passe Actuel',
        newPassword: 'Nouveau Mot de Passe',
        confirmNewPassword: 'Confirmer le Nouveau Mot de Passe',
        updatePassword: 'Mettre à Jour le Mot de Passe'
      },

      // Orders
      orders: {
        title: 'Mes Commandes',
        orderHistory: 'Historique des Commandes',
        currentOrders: 'Commandes en Cours',
        pastOrders: 'Commandes Passées',
        orderNumber: 'Commande #',
        orderDate: 'Date de Commande',
        restaurant: 'Restaurant',
        items: 'Articles',
        total: 'Total',
        status: 'Statut',
        actions: 'Actions',
        viewDetails: 'Voir les Détails',
        reorder: 'Recommander',
        rateOrder: 'Évaluer la Commande',
        trackOrder: 'Suivre la Commande',
        estimatedDelivery: 'Livraison Estimée',
        deliveredAt: 'Livré à',
        orderItems: 'Articles Commandés',
        deliveryAddress: 'Adresse de Livraison',
        paymentMethod: 'Méthode de Paiement',
        orderSummary: 'Résumé de la Commande',
        subtotal: 'Sous-total',
        deliveryFee: 'Frais de Livraison',
        tax: 'Taxe',
        total: 'Total'
      },

      // Cart
      cart: {
        title: 'Panier d\'Achats',
        items: 'Articles',
        item: 'Article',
        quantity: 'Quantité',
        price: 'Prix',
        total: 'Total',
        subtotal: 'Sous-total',
        deliveryFee: 'Frais de Livraison',
        tax: 'Taxe',
        grandTotal: 'Total Général',
        emptyCart: 'Votre panier est vide',
        addItems: 'Ajoutez quelques délicieux articles pour commencer',
        continueShopping: 'Continuer les Achats',
        checkout: 'Procéder au Paiement',
        removeItem: 'Supprimer l\'Article',
        updateQuantity: 'Mettre à Jour la Quantité',
        clearCart: 'Vider le Panier',
        saveForLater: 'Sauvegarder pour Plus Tard',
        applyCoupon: 'Appliquer un Coupon',
        couponCode: 'Code Coupon',
        apply: 'Appliquer',
        removeCoupon: 'Supprimer le Coupon'
      },

      // Checkout
      checkout: {
        title: 'Paiement',
        orderSummary: 'Résumé de la Commande',
        deliveryAddress: 'Adresse de Livraison',
        paymentMethod: 'Méthode de Paiement',
        orderNotes: 'Notes de Commande',
        placeOrder: 'Passer la Commande',
        backToCart: 'Retour au Panier',
        addNewAddress: 'Ajouter une Nouvelle Adresse',
        selectAddress: 'Sélectionner une Adresse',
        addAddress: 'Ajouter une Adresse',
        editAddress: 'Modifier l\'Adresse',
        addressLine1: 'Ligne d\'Adresse 1',
        addressLine2: 'Ligne d\'Adresse 2 (Optionnel)',
        city: 'Ville',
        state: 'État',
        zipCode: 'Code Postal',
        country: 'Pays',
        saveAddress: 'Sauvegarder l\'Adresse',
        paymentOptions: 'Options de Paiement',
        cashOnDelivery: 'Paiement à la Livraison',
        creditCard: 'Carte de Crédit',
        mobileMoney: 'Mobile Money',
        cardNumber: 'Numéro de Carte',
        expiryDate: 'Date d\'Expiration',
        cvv: 'CVV',
        cardholderName: 'Nom du Titulaire',
        payNow: 'Payer Maintenant',
        orderNotesPlaceholder: 'Instructions spéciales pour la livraison...',
        termsAgreement: 'J\'accepte les Conditions Générales et la Politique de Confidentialité',
        orderConfirmation: 'Confirmation de Commande',
        orderPlaced: 'Votre commande a été passée avec succès !',
        orderNumber: 'Numéro de Commande',
        estimatedDeliveryTime: 'Temps de Livraison Estimé',
        trackOrder: 'Suivre la Commande',
        continueShopping: 'Continuer les Achats'
      }
    }
  }
};

// Initialize Gemini translation service
const initializeGeminiService = async () => {
  try {
    // Get API key from environment or localStorage
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY || localStorage.getItem('gemini_api_key');
    if (apiKey) {
      await geminiTranslationService.initialize(apiKey);
    }
  } catch (error) {
    console.warn('Failed to initialize Gemini service:', error);
  }
};

// Initialize i18n
i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
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

// Initialize Gemini service after i18n is ready
initializeGeminiService();

// Export the i18n instance
export { i18n };

// Enhanced translation function with Gemini AI support
export const translateWithGemini = async (key, options = {}) => {
  const { lng = i18n.language, fallbackLng = 'en', useGemini = true } = options;
  
  // First try to get translation from i18n
  let translation = i18n.t(key, { lng });
  
  // If translation is the same as key (not found) and Gemini is enabled
  if (translation === key && useGemini && geminiTranslationService.isInitialized) {
    try {
      // Try to translate the key as text
      const geminiTranslation = await geminiTranslationService.translateText(
        key, 
        lng, 
        fallbackLng
      );
      
      if (geminiTranslation && geminiTranslation !== key) {
        // Store the new translation in i18n resources
        if (!i18n.store.data[lng]) {
          i18n.store.data[lng] = { translation: {} };
        }
        
        // Set nested key
        const keys = key.split('.');
        let current = i18n.store.data[lng].translation;
        for (let i = 0; i < keys.length - 1; i++) {
          if (!current[keys[i]]) {
            current[keys[i]] = {};
          }
          current = current[keys[i]];
        }
        current[keys[keys.length - 1]] = geminiTranslation;
        
        return geminiTranslation;
      }
    } catch (error) {
      console.warn('Gemini translation failed:', error);
    }
  }
  
  return translation;
};

// Enhanced useTranslation hook
export const useEnhancedTranslation = () => {
  const { t, i18n: i18nInstance } = useTranslation();
  
  const enhancedT = async (key, options = {}) => {
    return await translateWithGemini(key, { ...options, lng: i18nInstance.language });
  };
  
  return {
    t: enhancedT,
    i18n: i18nInstance,
    ready: i18nInstance.isInitialized,
  };
};

// Export the enhanced translation function
export { translateWithGemini as t };

// Language detection and management functions
export const detectInitialLanguage = () => {
  try {
    const storedLang = localStorage.getItem('i18nextLng');
    if (storedLang) return storedLang;
    
    const browserLang = navigator.language || navigator.userLanguage || 'en';
    const primaryLang = browserLang.split('-')[0];
    
    const supportedLanguages = ['en', 'fr', 'es'];
    return supportedLanguages.includes(primaryLang) ? primaryLang : 'en';
  } catch (error) {
    console.warn('Error detecting initial language:', error);
    return 'en';
  }
};

export const changeLanguage = (lng) => {
  return i18n.changeLanguage(lng);
};

export const getCurrentLanguage = () => {
  return i18n.language;
};

export const getAvailableLanguages = () => {
  return Object.keys(resources);
};

export const isLanguageSupported = (lng) => {
  try {
    return Object.keys(resources).includes(lng);
  } catch (error) {
    console.warn('Error checking language support:', error);
    return false;
  }
};

// Document title update function
export const updateDocumentTitle = (lng) => {
  try {
    const title = i18n.t('app.title', { lng });
    if (title && title !== 'app.title') {
      document.title = title;
    }
  } catch (error) {
    console.warn('Error updating document title:', error);
  }
};

// Check if i18n is ready
export const isI18nReady = () => {
  return i18n.isInitialized;
};

// Default export
export default i18n;
