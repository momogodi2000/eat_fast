// i18n.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      nav: {
        home: 'Home',
        restaurants: 'Restaurants',
        about: 'About',
        contact: 'Contact',
        account: 'Account',
        cart: 'Cart'
      },
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
      categories: {
        all: 'All',
        traditional: 'Traditional',
        fastFood: 'Fast Food',
        vegetarian: 'Vegetarian',
        italian: 'Italian',
        seafood: 'Seafood',
        african: 'African'
      },
      restaurants: {
        minutes: 'min',
        order: 'Order',
        searchPlaceholder: 'Search for restaurants or dishes',
        filters: 'Filters',
        found: 'restaurants found',
        noResults: 'No restaurants match your filters',
        resetFilters: 'Reset all filters',
        categories: {
          title: 'Categories',
          all: 'All',
          african: 'African',
          traditional: 'Traditional',
          fastFood: 'Fast Food',
          vegetarian: 'Vegetarian'
        },
        cities: {
          all: 'All Cities'
        },
        zones: {
          all: 'All Zones',
          centre: 'Centre',
          north: 'North',
          littoral: 'Littoral',
          west: 'West'
        },
        sort: {
          title: 'Sort By',
          by: 'Sort by',
          popularity: 'Popularity',
          rating: 'Rating',
          deliveryTime: 'Delivery Time',
          priceLow: 'Price: Low to High',
          priceHigh: 'Price: High to Low'
        },
        priceRange: 'Price Range',
        location: 'Location',
        city: 'City',
        zone: 'Zone',
        minOrder: 'Min. Order',
        deliveryFee: 'Delivery Fee',
        viewMenu: 'View Menu',
        addToCart: 'Add to Cart',
        comments: 'Reviews',
        noComments: 'No reviews yet. Be the first to review!',
        addComment: 'Add a Review',
        commentPlaceholder: 'Share your experience with this restaurant...',
        submitComment: 'Submit Review',
        reply: 'Reply',
        share: 'Share',
        like: 'Like',
        dislike: 'Dislike',
        menu: 'Menu',
        popularDishes: 'Popular Dishes'
      },
      howItWorks: {
        description: 'Simple and easy way to order your food',
        step1Title: 'Choose Restaurant',
        step1Description: 'Select from our diverse range of restaurants',
        step2Title: 'Select Food',
        step2Description: 'Browse menus and select your favorite meals',
        step3Title: 'Fast Delivery',
        step3Description: 'Enjoy prompt delivery to your doorstep'
      },
      about: {
        title: 'About Eatfast',
        subtitle: 'Revolutionizing food delivery in Cameroon',
        description: 'Eatfast is a pioneering food delivery platform connecting customers with their favorite local restaurants. Launched in 2025 with our pilot in Yaoundé, we are expanding across Cameroon to bring fast, reliable food delivery to every corner of the country.',
        slogan: 'Fast. Fresh. Delivered.',
        missionTitle: 'Our Mission',
        missionText: 'To connect people with the food they love through innovative technology while supporting local businesses and creating employment opportunities.',
        visionTitle: 'Our Vision',
        visionText: 'To become Cameroon\'s most trusted food delivery platform, known for our speed, reliability, and commitment to local culinary traditions.'
      },
      team: {
        ceo: 'CEO & Founder',
        seniorDev: 'Senior Developer',
        juniorDev: 'Junior Developer',
        uiUx: 'UI/UX Designer'
      },
      testimonials: {
        customer1: 'Eatfast has transformed my lunch breaks! I can now enjoy meals from my favorite restaurants without leaving the office.',
        customer2: 'The 30-minute delivery guarantee is real! I\'m impressed by their service and the quality of food.',
        customer3: 'As a restaurant owner, Eatfast has helped me reach new customers and increase my sales by 40%.'
      },
      contact: {
        title: 'Contact Us',
        subtitle: 'We\'d love to hear from you',
        form: {
          name: 'Your Name',
          email: 'Email Address',
          phone: 'Phone Number',
          subject: 'Subject',
          message: 'Your Message',
          send: 'Send Message',
          success: 'Thank you! Your message has been sent successfully.',
          error: 'There was an error sending your message. Please try again.'
        },
        topics: {
          general: 'General Inquiry',
          partnership: 'Partnership',
          support: 'Customer Support',
          careers: 'Careers',
          other: 'Other'
        }
      },
      app: {
        title: 'Download Our Mobile App',
        description: 'Get exclusive app-only offers and faster ordering',
        downloadOn: 'Download on',
        getItOn: 'Get it on'
      },
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
      // New translations for login page
      login: {
        title: 'Login to Your Account',
        subtitle: 'Welcome back! Please enter your details',
        email: 'Email',
        emailPlaceholder: 'Enter your email',
        password: 'Password',
        passwordPlaceholder: 'Enter your password',
        rememberMe: 'Remember me',
        forgotPassword: 'Forgot password?',
        submitButton: 'Sign In',
        noAccount: "Don't have an account?",
        register: 'Sign up',
        welcomeTitle: 'Welcome Back!',
        welcomeMessage: 'Login to access your favorite restaurants and dishes',
        feature1: 'Track your order history and favorites',
        feature2: 'Get personalized recommendations',
        feature3: 'Enjoy faster checkout with saved details',
        footerText: 'By continuing, you agree to our Terms of Service and Privacy Policy'
      },

      // New translations for register page
      register: {
        title: 'Create Your Account',
        subtitle: 'Join our community and start ordering now',
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
        confirmPasswordPlaceholder: 'Re-enter your password',
        acceptTerms: 'I agree to the',
        termsLink: 'Terms and Conditions',
        submitButton: 'Create Account',
        alreadyHaveAccount: 'Already have an account?',
        loginLink: 'Log in',
        welcomeTitle: 'Join EatFast Today!',
        welcomeMessage: 'Create an account to enjoy these benefits:',
        feature1: 'Fast delivery to your doorstep',
        feature2: 'Exclusive deals and discounts',
        feature3: 'Personalized recommendations',
        footerText: 'By creating an account, you agree to our Terms of Service and Privacy Policy',
        backToHome: 'Back to home'
      },

      // Common form translations
      form: {
        requiredField: 'This field is required',
        invalidEmail: 'Please enter a valid email',
        passwordLength: 'Password must be at least 8 characters',
        passwordMatch: 'Passwords must match',
        invalidPhone: 'Please enter a valid phone number'
      },
      dashboard: {
        dashboard: 'Dashboard',
        total_orders: 'Total Orders',
        active_restaurants: 'Active Restaurants',
        total_revenue: 'Total Revenue',
        registered_users: 'Registered Users',
        avg_delivery_time: 'Average Delivery Time',
        pending_deliveries: 'Pending Deliveries',
        from_last_month: 'from last month',
        new_this_month: 'new this month',
        new_users: 'new users',
        from_yesterday: 'from yesterday',
        monthly_orders: 'Monthly Orders',
        restaurants_by_category: 'Restaurants by Category',
        recent_activity: 'Recent Activity',
        new_order: 'New Order',
        restaurant_name: 'Example Restaurant',
        delivery_to: 'delivery to',
        customer_name: 'Example Customer',
        minutes_ago: 'minutes ago',
        theme_changed: 'Theme changed',
        language_changed: 'Language changed'
      },
      // Admin navigation translations
      users: 'Users',
      delivery: 'Delivery',
      orders: 'Orders',
      messages: 'Messages',
      contactMessages: 'Contact Messages',  
      statistics: 'Statistics',
      promotions: 'Promotions',
      settings: 'Settings',
      logout: 'Logout'
    }
  },
  fr: {
    translation: {
      nav: {
        home: 'Accueil',
        restaurants: 'Restaurants',
        about: 'À Propos',
        contact: 'Contact',
        account: 'Compte',
        cart: 'Panier'
      },
      hero: {
        title: 'Commandez des Plats Délicieux Avec',
        subtitle: 'Livraison rapide à votre porte',
        searchPlaceholder: 'Rechercher des restaurants ou des plats',
        orderButton: 'Commander Maintenant',
        becomePartner: 'Devenir Partenaire',
        delivery: 'Livraison',
        minutes: 'min',
        location: 'Votre Emplacement'
      },
      sections: {
        categories: 'Catégories',
        featuredRestaurants: 'Restaurants en Vedette',
        howItWorks: 'Comment Ça Marche',
        testimonials: 'Ce Que Disent Nos Clients',
        ourTeam: 'Notre Équipe',
        mission: 'Notre Mission',
        contactForm: 'Contactez-Nous',
        contactInfo: 'Informations de Contact'
      },
      categories: {
        all: 'Tous',
        traditional: 'Traditionnel',
        fastFood: 'Fast Food',
        vegetarian: 'Végétarien',
        italian: 'Italien',
        seafood: 'Fruits de Mer',
        african: 'Africain'
      },
      restaurants: {
        minutes: 'min',
        order: 'Commander',
        searchPlaceholder: 'Rechercher des restaurants ou des plats',
        filters: 'Filtres',
        found: 'restaurants trouvés',
        noResults: 'Aucun restaurant ne correspond à vos filtres',
        resetFilters: 'Réinitialiser tous les filtres',
        categories: {
          title: 'Catégories',
          all: 'Toutes',
          african: 'Africain',
          traditional: 'Traditionnel',
          fastFood: 'Fast Food',
          vegetarian: 'Végétarien'
        },
        cities: {
          all: 'Toutes les Villes'
        },
        zones: {
          all: 'Toutes les Zones',
          centre: 'Centre',
          north: 'Nord',
          littoral: 'Littoral',
          west: 'Ouest'
        },
        sort: {
          title: 'Trier Par',
          by: 'Trier par',
          popularity: 'Popularité',
          rating: 'Évaluation',
          deliveryTime: 'Temps de Livraison',
          priceLow: 'Prix: Croissant',
          priceHigh: 'Prix: Décroissant'
        },
        priceRange: 'Gamme de Prix',
        location: 'Emplacement',
        city: 'Ville',
        zone: 'Zone',
        minOrder: 'Commande Min.',
        deliveryFee: 'Frais de Livraison',
        viewMenu: 'Voir le Menu',
        addToCart: 'Ajouter au Panier',
        comments: 'Avis',
        noComments: 'Pas encore d\'avis. Soyez le premier à donner votre avis!',
        addComment: 'Ajouter un Avis',
        commentPlaceholder: 'Partagez votre expérience avec ce restaurant...',
        submitComment: 'Soumettre l\'Avis',
        reply: 'Répondre',
        share: 'Partager',
        like: 'J\'aime',
        dislike: 'Je n\'aime pas',
        menu: 'Menu',
        popularDishes: 'Plats Populaires'
      },
      howItWorks: {
        description: 'Façon simple et facile de commander votre nourriture',
        step1Title: 'Choisir un Restaurant',
        step1Description: 'Sélectionnez parmi notre gamme variée de restaurants',
        step2Title: 'Sélectionner les Plats',
        step2Description: 'Parcourez les menus et sélectionnez vos repas préférés',
        step3Title: 'Livraison Rapide',
        step3Description: 'Profitez d\'une livraison rapide à votre porte'
      },
      about: {
        title: 'À Propos de Eatfast',
        subtitle: 'Révolutionner la livraison de repas au Cameroun',
        description: 'Eatfast est une plateforme pionnière de livraison de repas qui connecte les clients avec leurs restaurants locaux préférés. Lancée en 2025 avec notre pilote à Yaoundé, nous nous développons à travers le Cameroun pour apporter une livraison rapide et fiable dans tous les coins du pays.',
        slogan: 'Rapide. Frais. Livré.',
        missionTitle: 'Notre Mission',
        missionText: 'Connecter les gens à la nourriture qu\'ils aiment grâce à une technologie innovante tout en soutenant les entreprises locales et en créant des opportunités d\'emploi.',
        visionTitle: 'Notre Vision',
        visionText: 'Devenir la plateforme de livraison de repas la plus fiable du Cameroun, reconnue pour notre rapidité, notre fiabilité et notre engagement envers les traditions culinaires locales.'
      },
      team: {
        ceo: 'PDG & Fondateur',
        seniorDev: 'Développeur Senior',
        juniorDev: 'Développeur Junior',
        uiUx: 'Designer UI/UX'
      },
      testimonials: {
        customer1: 'Eatfast a transformé mes pauses déjeuner! Je peux maintenant déguster des repas de mes restaurants préférés sans quitter le bureau.',
        customer2: 'La garantie de livraison en 30 minutes est réelle! Je suis impressionné par leur service et la qualité de la nourriture.',
        customer3: 'En tant que propriétaire de restaurant, Eatfast m\'a aidé à atteindre de nouveaux clients et à augmenter mes ventes de 40%.'
      },
      contact: {
        title: 'Contactez-Nous',
        subtitle: 'Nous serions ravis d\'avoir de vos nouvelles',
        form: {
          name: 'Votre Nom',
          email: 'Adresse Email',
          phone: 'Numéro de Téléphone',
          subject: 'Sujet',
          message: 'Votre Message',
          send: 'Envoyer le Message',
          success: 'Merci! Votre message a été envoyé avec succès.',
          error: 'Une erreur s\'est produite lors de l\'envoi de votre message. Veuillez réessayer.'
        },
        topics: {
          general: 'Demande Générale',
          partnership: 'Partenariat',
          support: 'Support Client',
          careers: 'Carrières',
          other: 'Autre'
        }
      },
      app: {
        title: 'Téléchargez Notre Application Mobile',
        description: 'Obtenez des offres exclusives et des commandes plus rapides',
        downloadOn: 'Télécharger sur',
        getItOn: 'Disponible sur'
      },
      footer: {
        description: 'Eatfast est votre application de livraison de repas de référence au Cameroun.',
        quickLinks: 'Liens Rapides',
        aboutUs: 'À Propos de Nous',
        restaurants: 'Restaurants',
        becomePartner: 'Devenir Partenaire',
        careers: 'Carrières',
        contactUs: 'Contactez-Nous',
        legal: 'Mentions Légales',
        terms: 'Conditions Générales',
        privacy: 'Politique de Confidentialité',
        cookies: 'Politique des Cookies',
        licensing: 'Licences',
        contact: 'Contact',
        newsletter: 'Newsletter',
        emailPlaceholder: 'Votre email',
        subscribe: 'S\'abonner',
        allRightsReserved: 'Tous droits réservés.'
      },
      login: {
        title: 'Connectez-vous à votre compte',
        subtitle: 'Content de vous revoir! Veuillez entrer vos coordonnées',
        email: 'Email',
        emailPlaceholder: 'Entrez votre email',
        password: 'Mot de passe',
        passwordPlaceholder: 'Entrez votre mot de passe',
        rememberMe: 'Se souvenir de moi',
        forgotPassword: 'Mot de passe oublié?',
        submitButton: 'Se connecter',
        noAccount: "Vous n'avez pas de compte?",
        register: "S'inscrire",
        welcomeTitle: 'Content de vous revoir!',
        welcomeMessage: 'Connectez-vous pour accéder à vos restaurants et plats préférés',
        feature1: 'Suivez votre historique de commandes et favoris',
        feature2: 'Recevez des recommandations personnalisées',
        feature3: 'Profitez d\'un paiement plus rapide avec vos détails enregistrés',
        footerText: 'En continuant, vous acceptez nos Conditions d\'utilisation et notre Politique de confidentialité'
      },

      // New translations for register page
      register: {
        title: 'Créez votre compte',
        subtitle: 'Rejoignez notre communauté et commencez à commander dès maintenant',
        firstName: 'Prénom',
        firstNamePlaceholder: 'Entrez votre prénom',
        lastName: 'Nom',
        lastNamePlaceholder: 'Entrez votre nom',
        email: 'Email',
        emailPlaceholder: 'Entrez votre email',
        phone: 'Numéro de téléphone',
        phonePlaceholder: 'Entrez votre numéro de téléphone',
        password: 'Mot de passe',
        passwordPlaceholder: 'Créez un mot de passe',
        confirmPassword: 'Confirmez le mot de passe',
        confirmPasswordPlaceholder: 'Entrez à nouveau votre mot de passe',
        acceptTerms: 'J\'accepte les',
        termsLink: 'Conditions générales',
        submitButton: 'Créer un compte',
        alreadyHaveAccount: 'Vous avez déjà un compte?',
        loginLink: 'Connectez-vous',
        welcomeTitle: 'Rejoignez EatFast dès aujourd\'hui!',
        welcomeMessage: 'Créez un compte pour profiter de ces avantages:',
        feature1: 'Livraison rapide à votre porte',
        feature2: 'Offres et réductions exclusives',
        feature3: 'Recommandations personnalisées',
        footerText: 'En créant un compte, vous acceptez nos Conditions d\'utilisation et notre Politique de confidentialité',
        backToHome: 'Retour à l\'accueil'
      },
      
      // Common form translations
      form: {
        requiredField: 'Ce champ est obligatoire',
        invalidEmail: 'Veuillez entrer un email valide',
        passwordLength: 'Le mot de passe doit comporter au moins 8 caractères',
        passwordMatch: 'Les mots de passe doivent correspondre',
        invalidPhone: 'Veuillez entrer un numéro de téléphone valide'
      },
      dashboard: {
        dashboard: 'Tableau de bord',
        total_orders: 'Commandes totales',
        active_restaurants: 'Restaurants actifs',
        total_revenue: 'Revenu total',
        registered_users: 'Utilisateurs enregistrés',
        avg_delivery_time: 'Temps de livraison moyen',
        pending_deliveries: 'Livraisons en attente',
        from_last_month: 'par rapport au mois dernier',
        new_this_month: 'nouveaux ce mois-ci',
        new_users: 'nouveaux utilisateurs',
        from_yesterday: 'par rapport à hier',
        monthly_orders: 'Commandes mensuelles',
        restaurants_by_category: 'Restaurants par catégorie',
        recent_activity: 'Activité récente',
        new_order: 'Nouvelle commande',
        restaurant_name: 'Restaurant Exemple',
        delivery_to: 'livraison à',
        customer_name: 'Client Exemple',
        minutes_ago: 'minutes',
        theme_changed: 'Thème changé',
        language_changed: 'Langue changée'
      },
      // Admin navigation translations  
      users: 'Utilisateurs',
      delivery: 'Livraison',
      orders: 'Commandes',
      messages: 'Messages',
      contactMessages: 'Messages de Contact',
      statistics: 'Statistiques',
      promotions: 'Promotions',
      settings: 'Paramètres',
      logout: 'Déconnexion'
    }
  }
};

const initOptions = {
  resources,
  lng: 'en',
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false
  },
  react: {
    useSuspense: false
  }
};

const i18nService = {
  init: () => {
    return i18n
      .use(initReactI18next)
      .init(initOptions)
      .then(() => console.log('i18n initialized successfully'))
      .catch(error => console.error('Error initializing i18n:', error));
  },
  changeLanguage: (lng) => {
    return i18n.changeLanguage(lng);
  },
  getCurrentLanguage: () => {
    return i18n.language;
  }
};

export default i18nService;