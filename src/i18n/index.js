// i18n.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
<<<<<<< HEAD
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
=======
import { restaurantTranslations } from './restaurant_i18n_translations';


const resources = {
  en: {
    translation: {
            ...restaurantTranslations.en,

>>>>>>> 753220f0986fa4338251ff890c029766f035deec
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
<<<<<<< HEAD
        dislike: 'Dislike'
=======
        dislike: 'Dislike',
        restaurantDescriptions: {
          foufouDelice: 'A traditional Cameroonian restaurant offering authentic dishes prepared with fresh local ingredients.',
          mamiNyanga: 'Specializing in traditional dishes from western Cameroon, Mami Nyanga offers a unique culinary experience.',
          saveursAfrique: 'A fusion of African flavors offering dishes from different countries across the continent in a warm atmosphere.',
          kwaboRestaurant: 'Kwabo means "welcome" in Pidgin, and that\'s exactly how you\'ll feel in this friendly restaurant.'
        },
        dishDescriptions: {
          ndole: 'Traditional Cameroonian dish made with bitter leaves and shrimp',
          pouletDG: 'Fried chicken with ripe plantains and vegetables',
          eru: 'Traditional dish made with eru leaves and cassava paste',
          poissonBraise: 'Fresh grilled fish served with grilled plantains',
          thieboudienne: 'Fish rice dish typical of Senegalese cuisine',
          mafe: 'Stew made with peanut sauce and beef',
          jollofRice: 'Spicy rice typical of West Africa',
          achuSoup: 'Traditional Cameroonian yellow soup with taro paste'
        },
        comments: {
          comment1: 'The DG chicken was delicious, fast delivery!',
          comment2: 'Excellent traditional cuisine, but delivery was a bit long',
          comment3: 'The Thieboudienne was authentic and tasty!',
          comment4: 'Generous portions and excellent value for money',
          reply1: 'Thank you for your positive feedback!'
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
>>>>>>> 753220f0986fa4338251ff890c029766f035deec
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
<<<<<<< HEAD
        description: 'Eatfast is a pioneering food delivery platform connecting customers with their favorite local restaurants.',
        slogan: 'Fast. Fresh. Delivered.',
        missionTitle: 'Our Mission',
        missionText: 'To connect people with the food they love through innovative technology.',
        visionTitle: 'Our Vision',
        visionText: 'To become Cameroon\'s most trusted food delivery platform.'
=======
        description: 'Eatfast is a pioneering food delivery platform connecting customers with their favorite local restaurants. Launched in 2025 with our pilot in Yaoundé, we are expanding across Cameroon to bring fast, reliable food delivery to every corner of the country.',
        slogan: 'Fast. Fresh. Delivered.',
        missionTitle: 'Our Mission',
        missionText: 'To connect people with the food they love through innovative technology while supporting local businesses and creating employment opportunities.',
        visionTitle: 'Our Vision',
        visionText: 'To become Cameroon\'s most trusted food delivery platform, known for our speed, reliability, and commitment to local culinary traditions.'
>>>>>>> 753220f0986fa4338251ff890c029766f035deec
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
<<<<<<< HEAD
        customer1: 'Eatfast has transformed my lunch breaks!',
        customer2: 'The 30-minute delivery guarantee is real!',
        customer3: 'As a restaurant owner, Eatfast has helped me reach new customers.'
=======
        customer1: 'Eatfast has transformed my lunch breaks! I can now enjoy meals from my favorite restaurants without leaving the office.',
        customer2: 'The 30-minute delivery guarantee is real! I\'m impressed by their service and the quality of food.',
        customer3: 'As a restaurant owner, Eatfast has helped me reach new customers and increase my sales by 40%.'
>>>>>>> 753220f0986fa4338251ff890c029766f035deec
      },

      // Contact
      contact: {
        title: 'Contact Us',
<<<<<<< HEAD
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
=======
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

      // Register
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

      // Form
      form: {
        requiredField: 'This field is required',
        invalidEmail: 'Please enter a valid email',
        passwordLength: 'Password must be at least 8 characters',
        passwordMatch: 'Passwords must match',
        invalidPhone: 'Please enter a valid phone number'
      },

      // Dashboard
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

      // Admin Navigation
      users: 'Users',
      delivery: 'Delivery',
      orders: 'Orders',
      messages: 'Messages',
      contactMessages: 'Contact Messages',  
      statistics: 'Statistics',
      promotions: 'Promotions',
      settings: 'Settings',
      logout: 'Logout',

      // User Management
      userManagement: {
        title: 'User Management',
        addUser: 'Add User',
        editUser: 'Edit User',
        deleteUser: 'Delete',
        deleteUserConfirmation: 'Are you sure you want to delete this user?',
        search: 'Search users...',
        statusAll: 'All Statuses',
        statusActive: 'Active',
        statusInactive: 'Inactive',
        roles: {
          admin: 'Admin',
          livreur: 'Delivery',
          client: 'Client'
        },
        id: 'ID',
        name: 'Name',
        email: 'Email',
        role: 'Role',
        status: 'Status',
        registered: 'Registered',
        actions: 'Actions',
        showing: 'Showing',
        to: 'to',
        of: 'of',
        results: 'results',
        previous: 'Previous',
        next: 'Next',
        noUsers: 'No users found',
        export: 'Export to CSV',
        refresh: 'Refresh',
        filters: 'Filters',
        createdAt: 'Created At',
        lastLogin: 'Last Login',
        phone: 'Phone',
        address: 'Address',
        orders: 'Orders'
      },

      // User Form
      userForm: {
        createTitle: 'Create New User',
        editTitle: 'Edit User',
        name: 'Full Name',
        namePlaceholder: 'Enter full name',
        email: 'Email',
        emailPlaceholder: 'Enter email address',
        phone: 'Phone',
        phonePlaceholder: 'Enter phone number',
        role: 'Role',
        status: 'Status',
        address: 'Address',
        addressPlaceholder: 'Enter full address',
        password: 'Password',
        passwordPlaceholder: 'Enter password',
        confirmPassword: 'Confirm Password',
        confirmPasswordPlaceholder: 'Re-enter password',
        cancel: 'Cancel',
        create: 'Create',
        update: 'Update',
        saving: 'Saving...',
        errors: {
          nameRequired: 'Name is required',
          emailRequired: 'Email is required',
          emailInvalid: 'Please enter a valid email',
          phoneRequired: 'Phone is required',
          passwordRequired: 'Password is required',
          passwordLength: 'Password must be at least 6 characters',
          passwordMatch: 'Passwords must match',
          addressRequired: 'Address is required'
        },
        statuses: {
          active: 'Active',
          inactive: 'Inactive'
        },
        roles: {
          admin: 'Admin',
          livreur: 'Delivery',
          client: 'Client'
        }
      },

      // User Detail
      userDetail: {
        fullName: 'Full Name',
        email: 'Email',
        phone: 'Phone',
        address: 'Address',
        registered: 'Registered',
        lastLogin: 'Last Login',
        neverLoggedIn: 'Never logged in',
        totalOrders: 'Total Orders',
        editButton: 'Edit',
        closeButton: 'Close'
      },

      // Partner Page
      partner: {
        heroTitle: 'Become a Partner with',
        heroSubtitle: 'Join our network of restaurants and food businesses to reach more customers',
        fastOnboarding: 'Fast Onboarding',
        days: 'days',
        location: 'Location',
        applyNow: 'Apply Now',
        whyJoin: 'Why Join Our Platform?',
        whyJoinSubtitle: 'Discover the benefits of partnering with us',
        benefit1Title: 'Increased Visibility',
        benefit1Desc: 'Get discovered by thousands of hungry customers in your area',
        benefit2Title: 'Marketing Support',
        benefit2Desc: 'We promote your business through our marketing channels',
        benefit3Title: 'Easy Management',
        benefit3Desc: 'Simple tools to manage your menu, orders, and payments',
        requirementsTitle: 'Partner Requirements',
        requirementsSubtitle: 'What you need to join our platform',
        legalRequirements: 'Legal Requirements',
        requirement1: 'Valid business registration',
        requirement2: 'Tax identification number',
        requirement3: 'Health and safety certification',
        requirement4: 'Food handling permits',
        requirement5: 'Compliance with local regulations',
        operationalRequirements: 'Operational Requirements',
        operational1: 'Ability to handle online orders',
        operational2: 'Reliable food preparation capacity',
        operational3: 'Commitment to quality standards',
        operational4: 'Willingness to use our platform tools',
        operational5: 'Adherence to delivery timelines',
        noteTitle: 'Important Note',
        noteContent: 'Requirements may vary slightly depending on your location and business type',
        applicationFormTitle: 'Partner Application',
        applicationFormSubtitle: 'Fill out the form below to start your application process',
        businessInfo: 'Business Information',
        businessName: 'Business Name',
        cuisineType: 'Cuisine Type',
        capacity: 'Seating Capacity',
        openingHours: 'Opening Hours',
        contactInfo: 'Contact Information',
        contactName: 'Contact Person',
        email: 'Email Address',
        phone: 'Phone Number',
        locationInfo: 'Location Information',
        address: 'Street Address',
        city: 'City',
        legalInfo: 'Legal Information',
        legalStatus: 'Legal Status',
        selectOption: 'Select an option',
        soleProprietor: 'Sole Proprietor',
        llc: 'LLC',
        corporation: 'Corporation',
        other: 'Other',
        taxId: 'Tax ID Number',
        documentUploads: 'Document Uploads',
        healthCertificate: 'Health Certificate',
        healthCertificateDesc: 'Upload your valid health certificate',
        idDocument: 'ID Document',
        idDocumentDesc: 'Upload owner/manager ID (passport or national ID)',
        menu: 'Menu PDF',
        menuDesc: 'Upload your current menu in PDF format',
        restaurantPhotos: 'Restaurant Photos',
        photosDesc: 'Upload 3-5 photos of your establishment (max 5)',
        agreeToTerms1: 'I agree to the',
        terms: 'Terms of Service',
        and: 'and',
        privacyPolicy: 'Privacy Policy',
        agreeToTerms2: 'of Eat-Fast platform',
        submitApplication: 'Submit Application',
        processing: 'Processing...',
        successTitle: 'Application Submitted!',
        successMessage: 'Thank you for your application. Our team will review your information and contact you within 3-5 business days.',
        submitAnother: 'Submit Another Application',
        processTitle: 'Application Process',
        processSubtitle: 'Here\'s what happens after you submit your application',
        step1Title: 'Application Review',
        step1Desc: 'Our team will review your application and documents',
        step2Title: 'Onboarding Call',
        step2Desc: 'We\'ll schedule a call to discuss partnership details',
        step3Title: 'Account Setup',
        step3Desc: 'We\'ll create your partner account and train your team',
        step4Title: 'Go Live!',
        step4Desc: 'Your restaurant will be live on our platform',
        faqTitle: 'Frequently Asked Questions',
        faq1Question: 'How long does the approval process take?',
        faq1Answer: 'Typically 3-5 business days after we receive all required documents.',
        faq2Question: 'Is there a fee to join the platform?',
        faq2Answer: 'We charge a small commission on orders, with no upfront fees.',
        faq3Question: 'Can I update my menu after joining?',
        faq3Answer: 'Yes, you can update your menu anytime through your partner dashboard.',
        faq4Question: 'How do I receive payments?',
        faq4Answer: 'We process payments weekly via bank transfer or mobile money.',
        faq5Question: 'What support do you provide?',
        faq5Answer: '24/7 customer support and dedicated account manager for all partners.',
        restaurant: 'Restaurant',
        cloudKitchen: 'Cloud Kitchen',
        caterer: 'Catering Service'
>>>>>>> 753220f0986fa4338251ff890c029766f035deec
      }
    }
  },
  fr: {
    translation: {
      ...restaurantTranslations.fr,
<<<<<<< HEAD
      ...frTranslation,
=======
>>>>>>> 753220f0986fa4338251ff890c029766f035deec
      // Navigation
      nav: {
        home: 'Accueil',
        restaurants: 'Restaurants',
<<<<<<< HEAD
        about: 'À propos',
=======
        about: 'À Propos',
>>>>>>> 753220f0986fa4338251ff890c029766f035deec
        contact: 'Contact',
        account: 'Compte',
        cart: 'Panier'
      },

      // Hero Section
      hero: {
<<<<<<< HEAD
        title: 'Commandez de la Nourriture Délicieuse',
=======
        title: 'Commandez des Plats Délicieux Avec',
>>>>>>> 753220f0986fa4338251ff890c029766f035deec
        subtitle: 'Livraison rapide à votre porte',
        searchPlaceholder: 'Rechercher des restaurants ou des plats',
        orderButton: 'Commander Maintenant',
        becomePartner: 'Devenir Partenaire',
        delivery: 'Livraison',
        minutes: 'min',
<<<<<<< HEAD
        location: 'Votre Localisation'
=======
        location: 'Votre Emplacement'
>>>>>>> 753220f0986fa4338251ff890c029766f035deec
      },

      // Sections
      sections: {
        categories: 'Catégories',
        featuredRestaurants: 'Restaurants en Vedette',
<<<<<<< HEAD
        howItWorks: 'Comment ça Marche',
        testimonials: 'Ce que Disent Nos Clients',
        ourTeam: 'Notre Équipe',
        mission: 'Notre Mission',
        contactForm: 'Nous Contacter',
=======
        howItWorks: 'Comment Ça Marche',
        testimonials: 'Ce Que Disent Nos Clients',
        ourTeam: 'Notre Équipe',
        mission: 'Notre Mission',
        contactForm: 'Contactez-Nous',
>>>>>>> 753220f0986fa4338251ff890c029766f035deec
        contactInfo: 'Informations de Contact'
      },

      // Categories
      categories: {
        all: 'Tous',
        traditional: 'Traditionnel',
        fastFood: 'Fast Food',
        vegetarian: 'Végétarien',
        italian: 'Italien',
<<<<<<< HEAD
        seafood: 'Fruits de mer',
=======
        seafood: 'Fruits de Mer',
>>>>>>> 753220f0986fa4338251ff890c029766f035deec
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
<<<<<<< HEAD
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
=======
        refineSearch: 'Affiner votre recherche',
        allCategories: 'Toutes les catégories',
        allZones: 'Toutes les zones',
        allDistricts: 'Tous les quartiers',
        allPrices: 'Tous les prix',
        anyTime: 'N\'importe quand',
        anyFee: 'Frais quelconques',
        featured: 'En vedette',
        loading: 'Chargement des restaurants...',
        noComments: 'Pas encore de commentaires',
        writeReview: 'Écrivez votre avis...',
        writeReply: 'Écrivez votre réponse...',
        send: 'Envoyer',
        leaveReview: 'Laisser un avis',
        popularDishes: 'Plats populaires',
>>>>>>> 753220f0986fa4338251ff890c029766f035deec
        deliveryFee: 'frais de livraison',
        minOrder: 'Commande min.',
        tryAdjusting: 'Essayez d\'ajuster votre recherche ou vos filtres',
        category: 'Catégorie',
        zone: 'Zone',
<<<<<<< HEAD
        district: 'District',
        priceRange: 'Fourchette de Prix',
        maxDeliveryTime: 'Temps de Livraison Max',
        maxDeliveryFee: 'Frais de Livraison Max',
=======
        district: 'Quartier',
        priceRange: 'Gamme de prix',
        maxDeliveryTime: 'Temps de livraison max',
        maxDeliveryFee: 'Frais de livraison max',
>>>>>>> 753220f0986fa4338251ff890c029766f035deec
        menu: 'Menu',
        reviews: 'Avis',
        reply: 'Répondre',
        like: 'J\'aime',
<<<<<<< HEAD
        dislike: 'Je n\'aime pas'
=======
        dislike: 'Je n\'aime pas',
        restaurantDescriptions: {
          foufouDelice: 'Un restaurant traditionnel camerounais offrant des plats authentiques préparés avec des ingrédients locaux frais.',
          mamiNyanga: 'Spécialisé dans les plats traditionnels de l\'ouest Cameroun, Mami Nyanga offre une expérience culinaire unique.',
          saveursAfrique: 'Une fusion de saveurs africaines proposant des plats de différents pays du continent dans une ambiance chaleureuse.',
          kwaboRestaurant: 'Kwabo signifie "bienvenue" en pidgin, et c\'est exactement ce que vous ressentirez dans ce restaurant convivial.'
        },
        dishDescriptions: {
          ndole: 'Plat traditionnel camerounais à base de feuilles amères et crevettes',
          pouletDG: 'Poulet frit avec plantains mûrs et légumes',
          eru: 'Plat traditionnel à base de feuilles d\'eru et pâte de manioc',
          poissonBraise: 'Poisson frais braisé servi avec des plantains grillés',
          thieboudienne: 'Plat de riz au poisson typique de la cuisine sénégalaise',
          mafe: 'Ragoût à base de sauce arachide et viande de bœuf',
          jollofRice: 'Riz épicé typique de l\'Afrique de l\'Ouest',
          achuSoup: 'Soupe jaune traditionnelle camerounaise avec pâte de taro'
        },
        comments: {
          comment1: 'Le poulet DG était délicieux, livraison rapide!',
          comment2: 'Excellente cuisine traditionnelle, mais livraison un peu longue',
          comment3: 'Le Thieboudienne était authentique et savoureux!',
          comment4: 'Portions généreuses et excellent rapport qualité-prix',
          reply1: 'Merci pour votre retour positif!'
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
>>>>>>> 753220f0986fa4338251ff890c029766f035deec
      },

      // How It Works
      howItWorks: {
<<<<<<< HEAD
        description: 'Moyen simple et facile de commander votre nourriture',
        step1Title: 'Choisir un Restaurant',
        step1Description: 'Sélectionnez parmi notre gamme diversifiée de restaurants',
        step2Title: 'Sélectionner la Nourriture',
        step2Description: 'Parcourez les menus et sélectionnez vos plats préférés',
=======
        description: 'Façon simple et facile de commander votre nourriture',
        step1Title: 'Choisir un Restaurant',
        step1Description: 'Sélectionnez parmi notre gamme variée de restaurants',
        step2Title: 'Sélectionner les Plats',
        step2Description: 'Parcourez les menus et sélectionnez vos repas préférés',
>>>>>>> 753220f0986fa4338251ff890c029766f035deec
        step3Title: 'Livraison Rapide',
        step3Description: 'Profitez d\'une livraison rapide à votre porte'
      },

      // About
      about: {
<<<<<<< HEAD
        title: 'À Propos d\'Eatfast',
        subtitle: 'Révolutionner la livraison de nourriture au Cameroun',
        description: 'Eatfast est une plateforme de livraison de nourriture pionnière qui connecte les clients avec leurs restaurants locaux préférés.',
        slogan: 'Rapide. Frais. Livré.',
        missionTitle: 'Notre Mission',
        missionText: 'Connecter les gens avec la nourriture qu\'ils aiment grâce à une technologie innovante.',
        visionTitle: 'Notre Vision',
        visionText: 'Devenir la plateforme de livraison de nourriture la plus fiable du Cameroun.'
=======
        title: 'À Propos de Eatfast',
        subtitle: 'Révolutionner la livraison de repas au Cameroun',
        description: 'Eatfast est une plateforme pionnière de livraison de repas qui connecte les clients avec leurs restaurants locaux préférés. Lancée en 2025 avec notre pilote à Yaoundé, nous nous développons à travers le Cameroun pour apporter une livraison rapide et fiable dans tous les coins du pays.',
        slogan: 'Rapide. Frais. Livré.',
        missionTitle: 'Notre Mission',
        missionText: 'Connecter les gens à la nourriture qu\'ils aiment grâce à une technologie innovante tout en soutenant les entreprises locales et en créant des opportunités d\'emploi.',
        visionTitle: 'Notre Vision',
        visionText: 'Devenir la plateforme de livraison de repas la plus fiable du Cameroun, reconnue pour notre rapidité, notre fiabilité et notre engagement envers les traditions culinaires locales.'
>>>>>>> 753220f0986fa4338251ff890c029766f035deec
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
<<<<<<< HEAD
        customer1: 'Eatfast a transformé mes pauses déjeuner !',
        customer2: 'La garantie de livraison en 30 minutes est réelle !',
        customer3: 'En tant que propriétaire de restaurant, Eatfast m\'a aidé à atteindre de nouveaux clients.'
=======
        customer1: 'Eatfast a transformé mes pauses déjeuner! Je peux maintenant déguster des repas de mes restaurants préférés sans quitter le bureau.',
        customer2: 'La garantie de livraison en 30 minutes est réelle! Je suis impressionné par leur service et la qualité de la nourriture.',
        customer3: 'En tant que propriétaire de restaurant, Eatfast m\'a aidé à atteindre de nouveaux clients et à augmenter mes ventes de 40%.'
>>>>>>> 753220f0986fa4338251ff890c029766f035deec
      },

      // Contact
      contact: {
<<<<<<< HEAD
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
=======
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

      // App
      app: {
        title: 'Téléchargez Notre Application Mobile',
        description: 'Obtenez des offres exclusives et des commandes plus rapides',
        downloadOn: 'Télécharger sur',
        getItOn: 'Disponible sur'
      },

      // Footer
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

      // Login
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

      // Register
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

      // Form
      form: {
        requiredField: 'Ce champ est obligatoire',
        invalidEmail: 'Veuillez entrer un email valide',
        passwordLength: 'Le mot de passe doit comporter au moins 8 caractères',
        passwordMatch: 'Les mots de passe doivent correspondre',
        invalidPhone: 'Veuillez entrer un numéro de téléphone valide'
      },

      // Dashboard
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

      // Admin Navigation
      users: 'Utilisateurs',
      delivery: 'Livraison',
      orders: 'Commandes',
      messages: 'Messages',
      contactMessages: 'Messages de Contact',
      statistics: 'Statistiques',
      promotions: 'Promotions',
      settings: 'Paramètres',
      logout: 'Déconnexion',

      // User Management
      userManagement: {
        title: 'Gestion des Utilisateurs',
        addUser: 'Ajouter Utilisateur',
        editUser: 'Modifier Utilisateur',
        deleteUser: 'Supprimer',
        deleteUserConfirmation: 'Êtes-vous sûr de vouloir supprimer cet utilisateur?',
        search: 'Rechercher des utilisateurs...',
        statusAll: 'Tous les statuts',
        statusActive: 'Actif',
        statusInactive: 'Inactif',
        roles: {
          admin: 'Admin',
          livreur: 'Livreur',
          client: 'Client'
        },
        id: 'ID',
        name: 'Nom',
        email: 'Email',
        role: 'Rôle',
        status: 'Statut',
        registered: 'Inscrit',
        actions: 'Actions',
        showing: 'Affichage',
        to: 'à',
        of: 'sur',
        results: 'résultats',
        previous: 'Précédent',
        next: 'Suivant',
        noUsers: 'Aucun utilisateur trouvé',
        export: 'Exporter en CSV',
        refresh: 'Rafraîchir',
        filters: 'Filtres',
        createdAt: 'Créé le',
        lastLogin: 'Dernière connexion',
        phone: 'Téléphone',
        address: 'Adresse',
        orders: 'Commandes'
      },

      // User Form
      userForm: {
        createTitle: 'Créer un Nouvel Utilisateur',
        editTitle: 'Modifier Utilisateur',
        name: 'Nom Complet',
        namePlaceholder: 'Entrez le nom complet',
        email: 'Email',
        emailPlaceholder: 'Entrez l\'adresse email',
        phone: 'Téléphone',
        phonePlaceholder: 'Entrez le numéro de téléphone',
        role: 'Rôle',
        status: 'Statut',
        address: 'Adresse',
        addressPlaceholder: 'Entrez l\'adresse complète',
        password: 'Mot de passe',
        passwordPlaceholder: 'Entrez le mot de passe',
        confirmPassword: 'Confirmer le Mot de Passe',
        confirmPasswordPlaceholder: 'Entrez à nouveau le mot de passe',
        cancel: 'Annuler',
        create: 'Créer',
        update: 'Mettre à jour',
        saving: 'Enregistrement...',
        errors: {
          nameRequired: 'Le nom est requis',
          emailRequired: 'L\'email est requis',
          emailInvalid: 'Veuillez entrer un email valide',
          phoneRequired: 'Le téléphone est requis',
          passwordRequired: 'Le mot de passe est requis',
          passwordLength: 'Le mot de passe doit contenir au moins 6 caractères',
          passwordMatch: 'Les mots de passe doivent correspondre',
          addressRequired: 'L\'adresse est requise'
        },
        statuses: {
          active: 'Actif',
          inactive: 'Inactif'
        },
        roles: {
          admin: 'Admin',
          livreur: 'Livreur',
          client: 'Client'
        }
      },

      // User Detail
      userDetail: {
        fullName: 'Nom Complet',
        email: 'Email',
        phone: 'Téléphone',
        address: 'Adresse',
        registered: 'Inscrit',
        lastLogin: 'Dernière Connexion',
        neverLoggedIn: 'Jamais connecté',
        totalOrders: 'Commandes Totales',
        editButton: 'Modifier',
        closeButton: 'Fermer'
      },

      // Partner Page
      partner: {
        heroTitle: 'Devenez Partenaire avec',
        heroSubtitle: 'Rejoignez notre réseau de restaurants et entreprises alimentaires pour toucher plus de clients',
        fastOnboarding: 'Intégration Rapide',
        days: 'jours',
        location: 'Emplacement',
        applyNow: 'Postuler Maintenant',
        whyJoin: 'Pourquoi Rejoindre Notre Plateforme?',
        whyJoinSubtitle: 'Découvrez les avantages de devenir partenaire',
        benefit1Title: 'Visibilité Accrue',
        benefit1Desc: 'Soyez découvert par des milliers de clients dans votre région',
        benefit2Title: 'Support Marketing',
        benefit2Desc: 'Nous promouvons votre entreprise via nos canaux marketing',
        benefit3Title: 'Gestion Simplifiée',
        benefit3Desc: 'Outils simples pour gérer votre menu, commandes et paiements',
        requirementsTitle: 'Exigences pour les Partenaires',
        requirementsSubtitle: 'Ce dont vous avez besoin pour rejoindre notre plateforme',
        legalRequirements: 'Exigences Légales',
        requirement1: 'Enregistrement commercial valide',
        requirement2: 'Numéro d\'identification fiscale',
        requirement3: 'Certificat de santé et sécurité',
        requirement4: 'Permis de manipulation alimentaire',
        requirement5: 'Conformité aux réglementations locales',
        operationalRequirements: 'Exigences Opérationnelles',
        operational1: 'Capacité à gérer les commandes en ligne',
        operational2: 'Capacité fiable de préparation alimentaire',
        operational3: 'Engagement envers les standards de qualité',
        operational4: 'Volonté d\'utiliser nos outils de plateforme',
        operational5: 'Respect des délais de livraison',
        noteTitle: 'Note Importante',
        noteContent: 'Les exigences peuvent varier légèrement selon votre localisation et type d\'entreprise',
        applicationFormTitle: 'Demande de Partenariat',
        applicationFormSubtitle: 'Remplissez le formulaire ci-dessous pour commencer votre demande',
        businessInfo: 'Informations sur l\'Entreprise',
        businessName: 'Nom de l\'Entreprise',
        cuisineType: 'Type de Cuisine',
        capacity: 'Capacité d\'Accueil',
        openingHours: 'Heures d\'Ouverture',
        contactInfo: 'Informations de Contact',
        contactName: 'Personne de Contact',
        email: 'Adresse Email',
        phone: 'Numéro de Téléphone',
        locationInfo: 'Informations de Localisation',
        address: 'Adresse',
        city: 'Ville',
        legalInfo: 'Informations Légales',
        legalStatus: 'Statut Légal',
        selectOption: 'Sélectionnez une option',
        soleProprietor: 'Entreprise Individuelle',
        llc: 'SARL',
        corporation: 'Société',
        other: 'Autre',
        taxId: 'Numéro d\'Identification Fiscale',
        documentUploads: 'Téléchargement de Documents',
        healthCertificate: 'Certificat de Santé',
        healthCertificateDesc: 'Téléchargez votre certificat de santé valide',
        idDocument: 'Pièce d\'Identité',
        idDocumentDesc: 'Téléchargez la pièce d\'identité du propriétaire/gérant (passeport ou CNI)',
        menu: 'Menu PDF',
        menuDesc: 'Téléchargez votre menu actuel au format PDF',
        restaurantPhotos: 'Photos du Restaurant',
        photosDesc: 'Téléchargez 3-5 photos de votre établissement (max 5)',
        agreeToTerms1: 'J\'accepte les',
        terms: 'Conditions d\'Utilisation',
        and: 'et',
        privacyPolicy: 'Politique de Confidentialité',
        agreeToTerms2: 'de la plateforme Eat-Fast',
        submitApplication: 'Soumettre la Demande',
        processing: 'Traitement en cours...',
        successTitle: 'Demande Soumise!',
        successMessage: 'Merci pour votre demande. Notre équipe examinera vos informations et vous contactera dans les 3-5 jours ouvrables.',
        submitAnother: 'Soumettre une Autre Demande',
        processTitle: 'Processus de Demande',
        processSubtitle: 'Voici ce qui se passe après avoir soumis votre demande',
        step1Title: 'Examen de la Demande',
        step1Desc: 'Notre équipe examinera votre demande et documents',
        step2Title: 'Appel d\'Intégration',
        step2Desc: 'Nous programmerons un appel pour discuter des détails du partenariat',
        step3Title: 'Configuration du Compte',
        step3Desc: 'Nous créerons votre compte partenaire et formerons votre équipe',
        step4Title: 'Mise en Ligne!',
        step4Desc: 'Votre restaurant sera en ligne sur notre plateforme',
        faqTitle: 'Questions Fréquemment Posées',
        faq1Question: 'Combien de temps prend le processus d\'approbation?',
        faq1Answer: 'Généralement 3-5 jours ouvrables après réception de tous les documents requis.',
        faq2Question: 'Y a-t-il des frais pour rejoindre la plateforme?',
        faq2Answer: 'Nous prélevons une petite commission sur les commandes, sans frais initiaux.',
        faq3Question: 'Puis-je mettre à jour mon menu après avoir rejoint?',
        faq3Answer: 'Oui, vous pouvez mettre à jour votre menu à tout moment via votre tableau de bord partenaire.',
        faq4Question: 'Comment reçois-je les paiements?',
        faq4Answer: 'Nous traitons les paiements hebdomadaires par virement bancaire ou mobile money.',
        faq5Question: 'Quel support fournissez-vous?',
        faq5Answer: 'Support client 24/7 et gestionnaire de compte dédié pour tous les partenaires.',
        restaurant: 'Restaurant',
        cloudKitchen: 'Cuisine Virtuelle',
        caterer: 'Service de Traiteur'
>>>>>>> 753220f0986fa4338251ff890c029766f035deec
      }
    }
  }
};

<<<<<<< HEAD
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
=======
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
>>>>>>> 753220f0986fa4338251ff890c029766f035deec
