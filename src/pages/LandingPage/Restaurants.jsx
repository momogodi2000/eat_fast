import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sun, Moon, Search, MapPin, Clock, Star, User, ShoppingBag, Menu, X, 
  Plus, Minus, Trash2, ArrowRight, CreditCard, Smartphone, Gift,
  ChevronDown, ChevronUp, Award, CheckCircle, Heart, Share2, 
  ThumbsUp, ThumbsDown, Send, MessageCircle, Filter, Languages, Phone, Globe,
  LogIn, UserPlus, ChevronLeft, ChevronRight, Eye, Users, TrendingUp,
  Shield, Verified, Camera, Calendar, Utensils, Coffee, Building2,
  Truck, Package, ChefHat, Crown, Leaf, Zap, Target, History
} from 'lucide-react';

// Custom Hooks
const useTheme = () => {
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  const toggleTheme = useCallback(() => {
    setDarkMode(prev => !prev);
    document.documentElement.classList.toggle('dark');
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = (e) => setDarkMode(e.matches);
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, []);

  return { darkMode, toggleTheme };
};

// Enhanced Mock Data with more details
const mockData = {
  restaurants: [
    {
      id: 1,
      name: "Le Foufou Délice",
      images: [
        "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800&h=600&fit=crop"
      ],
      logo: "https://images.unsplash.com/photo-1577308856135-d96c75491ea1?w=150&h=150&fit=crop",
      category: "Camerounaise",
      deliveryTime: "20-30",
      deliveryFee: 500,
      minOrder: 2000,
      address: "Avenue Kennedy, Centre-ville",
      fullAddress: "Avenue Kennedy, Quartier Centre-ville, Yaoundé, Cameroun",
      coordinates: { lat: 3.8480, lng: 11.5021 },
      district: "Centre-ville",
      zone: "Centre",
      priceRange: "$$",
      featured: true,
      verified: true,
      partner: true,
      partnerSince: "2018-03-15",
      description: "Restaurant traditionnel authentique spécialisé dans la cuisine camerounaise depuis plus de 15 ans. Nous nous engageons à préserver les saveurs ancestrales tout en utilisant des ingrédients locaux frais et biologiques.",
      detailedDescription: "Fondé par Marie Nkomo en 2008, Le Foufou Délice est devenu une référence incontournable de la gastronomie camerounaise à Yaoundé. Notre équipe de chefs expérimentés perpétue les traditions culinaires transmises de génération en génération, en accordant une attention particulière à la qualité des ingrédients et à l'authenticité des recettes.",
      phone: "+237 677 123 456",
      email: "contact@foufoudelice.cm",
      website: "www.foufoudelice.cm",
      openingHours: {
        monday: "07:00 - 22:00",
        tuesday: "07:00 - 22:00",
        wednesday: "07:00 - 22:00",
        thursday: "07:00 - 22:00",
        friday: "07:00 - 23:00",
        saturday: "07:00 - 23:00",
        sunday: "08:00 - 22:00"
      },
      specialties: ["Ndolé aux crevettes", "Poulet DG", "Eru traditionnel", "Koki beans", "Sauce arachide", "Poisson braisé"],
      menuCategories: [
        { name: "Plats principaux", count: 15 },
        { name: "Grillades", count: 8 },
        { name: "Soupes traditionnelles", count: 6 },
        { name: "Accompagnements", count: 12 },
        { name: "Boissons", count: 20 },
        { name: "Desserts", count: 5 }
      ],
      totalOrders: 2850,
      monthlyOrders: 485,
      monthlyViews: 15420,
      establishedYear: 2008,
      staff: {
        chef: "Marie Nkomo",
        sousChef: "Paul Essomba",
        totalStaff: 12
      },
      ambiance: ["Familial", "Traditionnel", "Chaleureux", "Authentique"],
      services: ["Livraison à domicile", "Sur place", "À emporter", "Événements privés", "Traiteur", "Commandes de groupe"],
      facilities: ["WiFi gratuit", "Climatisation", "Parking", "Terrasse", "Salle privée", "Musique live le weekend"],
      certifications: ["Hygiène alimentaire", "Commerce équitable", "Produits biologiques"],
      socialMedia: {
        facebook: "@foufoudelice",
        instagram: "@foufou_delice",
        whatsapp: "+237677123456",
        youtube: "@foufoudelicecm"
      },
      achievements: [
        { title: "Meilleur restaurant traditionnel 2023", organization: "Guide Gastronomique Cameroun" },
        { title: "Certification Bio", organization: "Agriculture Biologique Cameroun" },
        { title: "Prix de l'Excellence Culinaire", organization: "Chambre de Commerce de Yaoundé" }
      ],
      sustainabilityEfforts: [
        "Utilisation d'ingrédients locaux à 90%",
        "Emballages biodégradables",
        "Réduction des déchets alimentaires",
        "Partenariats avec les producteurs locaux"
      ],
      workingWith: [
        { name: "Ferme Bio Mbalmayo", type: "Fournisseur légumes" },
        { name: "Coopérative des Pêcheurs", type: "Fournisseur poissons" },
        { name: "Producteurs de Manioc", type: "Fournisseur tubercules" }
      ]
    },
    {
      id: 2,
      name: "Saveurs d'Afrique",
      images: [
        "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1551218808-94e220e084d2?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1590846406792-0adc7f938f1d?w=800&h=600&fit=crop"
      ],
      logo: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=150&h=150&fit=crop",
      category: "Africaine Fusion",
      deliveryTime: "30-45",
      deliveryFee: 600,
      minOrder: 3000,
      address: "Boulevard du 20 Mai, Biyem-Assi",
      fullAddress: "Boulevard du 20 Mai, Quartier Biyem-Assi, Yaoundé, Cameroun",
      coordinates: { lat: 3.8366, lng: 11.5021 },
      district: "Biyem-Assi",
      zone: "Sud",
      priceRange: "$$$",
      featured: false,
      verified: true,
      partner: true,
      partnerSince: "2019-07-22",
      description: "Restaurant moderne proposant une fusion créative des saveurs de toute l'Afrique de l'Ouest avec une approche contemporaine et des techniques culinaires innovantes.",
      detailedDescription: "Saveurs d'Afrique révolutionne la cuisine africaine en mélangeant les traditions culinaires de différents pays d'Afrique de l'Ouest. Notre chef Amadou Ba, formé en France et au Sénégal, crée des plats uniques qui respectent l'authenticité tout en apportant une touche moderne et raffinée.",
      phone: "+237 655 987 321",
      email: "info@saveursafrique.cm",
      website: "www.saveursafrique.cm",
      openingHours: {
        monday: "09:00 - 22:00",
        tuesday: "09:00 - 22:00",
        wednesday: "09:00 - 22:00",
        thursday: "09:00 - 22:00",
        friday: "09:00 - 23:30",
        saturday: "09:00 - 23:30",
        sunday: "10:00 - 22:00"
      },
      specialties: ["Thieboudienne fusion", "Jollof Rice gourmet", "Attieké aux fruits de mer", "Mafé modernisé", "Couscous africain", "Yassa revisité"],
      menuCategories: [
        { name: "Fusion Créative", count: 12 },
        { name: "Classiques Revisités", count: 10 },
        { name: "Grillades Premium", count: 8 },
        { name: "Végétarien/Vegan", count: 7 },
        { name: "Boissons Artisanales", count: 15 },
        { name: "Desserts Fusion", count: 6 }
      ],
      totalOrders: 1420,
      monthlyOrders: 320,
      monthlyViews: 8950,
      establishedYear: 2015,
      staff: {
        chef: "Amadou Ba",
        sousChef: "Fatou Diallo",
        totalStaff: 18
      },
      ambiance: ["Moderne", "Cosmopolite", "Convivial", "Élégant", "Innovant"],
      services: ["Livraison premium", "Sur place", "À emporter", "Événements corporatifs", "Cours de cuisine", "Dégustation privée"],
      facilities: ["Bar à cocktails", "WiFi haut débit", "Climatisation", "Valet parking", "Terrasse panoramique", "Salle de conférence"],
      certifications: ["Restaurant Eco-responsable", "Certification Halal", "Formation continue du personnel"],
      socialMedia: {
        facebook: "@saveursafrique",
        instagram: "@saveurs_afrique",
        whatsapp: "+237655987321",
        linkedin: "@saveursafriquecm"
      },
      achievements: [
        { title: "Innovation Culinaire 2022", organization: "Festival Gastronomique International" },
        { title: "Restaurant Eco-responsable", organization: "Green Restaurant Association" },
        { title: "Chef de l'Année", organization: "Association des Chefs du Cameroun" }
      ],
      sustainabilityEfforts: [
        "Menu saisonnier avec produits locaux",
        "Compostage des déchets organiques",
        "Énergie solaire pour 40% des besoins",
        "Formation du personnel à l'éco-responsabilité"
      ],
      workingWith: [
        { name: "Coopérative Rizicole du Nord", type: "Fournisseur céréales" },
        { name: "Jardins Urbains de Yaoundé", type: "Légumes bio" },
        { name: "Brasserie Artisanale Lokale", type: "Boissons locales" }
      ]
    },
    {
      id: 3,
      name: "Chez Mama Africa",
      images: [
        "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1590846406792-0adc7f938f1d?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop"
      ],
      logo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop",
      category: "Traditionnelle Authentique",
      deliveryTime: "25-40",
      deliveryFee: 750,
      minOrder: 2500,
      address: "Carrefour Nlongkak, Nlongkak",
      fullAddress: "Carrefour Nlongkak, Quartier Nlongkak, Yaoundé, Cameroun",
      coordinates: { lat: 3.8792, lng: 11.5194 },
      district: "Nlongkak",
      zone: "Nord",
      priceRange: "$$",
      featured: true,
      verified: true,
      partner: true,
      partnerSince: "2017-01-10",
      description: "Institution familiale authentique dirigée par Mama Africa depuis plus de 20 ans, gardienne des traditions culinaires camerounaises transmises de mère en fille.",
      detailedDescription: "Chez Mama Africa, c'est bien plus qu'un restaurant, c'est un patrimoine vivant de la culture camerounaise. Mama Africa Ngono, avec ses 40 ans d'expérience culinaire, a créé un lieu où les recettes ancestrales sont préservées et transmises. Chaque plat raconte une histoire, chaque épice a sa signification culturelle.",
      phone: "+237 699 456 789",
      email: "mama@chezmamafrica.cm",
      website: "www.chezmamafrica.cm",
      openingHours: {
        monday: "06:00 - 23:00",
        tuesday: "06:00 - 23:00",
        wednesday: "06:00 - 23:00",
        thursday: "06:00 - 23:00",
        friday: "06:00 - 24:00",
        saturday: "06:00 - 24:00",
        sunday: "07:00 - 23:00"
      },
      specialties: ["Koki beans ancestral", "Eru et Water fufu", "Achu soup traditionnel", "Banga soup", "Mbongo tchobi", "Kondre"],
      menuCategories: [
        { name: "Plats Ancestraux", count: 18 },
        { name: "Soupes Traditionnelles", count: 12 },
        { name: "Grillades Locales", count: 10 },
        { name: "Petits Déjeuners", count: 8 },
        { name: "Boissons Traditionnelles", count: 25 },
        { name: "En-cas Locaux", count: 15 }
      ],
      totalOrders: 3250,
      monthlyOrders: 590,
      monthlyViews: 18750,
      establishedYear: 2004,
      staff: {
        chef: "Mama Africa Ngono",
        sousChef: "Grace Mballa",
        totalStaff: 15
      },
      ambiance: ["Familial", "Authentique", "Traditionnel", "Chaleureux", "Convivial"],
      services: ["Livraison familiale", "Sur place", "À emporter", "Traiteur traditionnel", "Événements culturels", "Formation culinaire"],
      facilities: ["Espace enfants", "Musique traditionnelle", "Climatisation naturelle", "Parking sécurisé", "Jardin d'herbes", "Boutique d'épices"],
      certifications: ["Patrimoine Culinaire Camerounais", "Commerce Équitable", "Produits du Terroir"],
      socialMedia: {
        facebook: "@chezmamafrica",
        instagram: "@mama_africa_cm",
        whatsapp: "+237699456789",
        tiktok: "@mamaafricacuisine"
      },
      achievements: [
        { title: "Gardienne du Patrimoine Culinaire", organization: "Ministère de la Culture" },
        { title: "Meilleur Restaurant Familial", organization: "Guide des Restaurants Camerounais" },
        { title: "Ambassadrice de la Cuisine Traditionnelle", organization: "Organisation du Tourisme Camerounais" }
      ],
      sustainabilityEfforts: [
        "100% ingrédients locaux et de saison",
        "Zéro plastique dans les emballages",
        "Jardin d'herbes aromatiques sur site",
        "Recyclage traditionnel des déchets organiques"
      ],
      workingWith: [
        { name: "Marchés Traditionnels Locaux", type: "Approvisionnement quotidien" },
        { name: "Coopérative des Femmes Agricultrices", type: "Légumes bio" },
        { name: "Association des Éleveurs Traditionnels", type: "Viandes locales" }
      ]
    },
    {
      id: 4,
      name: "Urban Grill House",
      images: [
        "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=800&h=600&fit=crop"
      ],
      logo: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=150&h=150&fit=crop",
      category: "Grillades Modernes",
      deliveryTime: "35-50",
      deliveryFee: 800,
      minOrder: 4000,
      address: "Bastos, Quartier Résidentiel",
      fullAddress: "Avenue Rosa Parks, Bastos, Yaoundé, Cameroun",
      coordinates: { lat: 3.8792, lng: 11.5194 },
      district: "Bastos",
      zone: "Nord",
      priceRange: "$$$",
      featured: true,
      verified: true,
      partner: true,
      partnerSince: "2020-11-08",
      description: "Restaurant haut de gamme spécialisé dans les grillades premium avec une ambiance urbaine moderne et une carte internationale sophistiquée.",
      detailedDescription: "Urban Grill House redéfinit l'art des grillades à Yaoundé. Notre concept unique combine techniques de cuisson traditionnelles et innovations modernes pour créer une expérience gastronomique exceptionnelle. Situé dans le quartier prestigieux de Bastos, nous attirons une clientèle internationale exigeante.",
      phone: "+237 622 789 456",
      email: "contact@urbangrill.cm",
      website: "www.urbangrillhouse.cm",
      openingHours: {
        monday: "11:00 - 23:00",
        tuesday: "11:00 - 23:00",
        wednesday: "11:00 - 23:00",
        thursday: "11:00 - 23:00",
        friday: "11:00 - 01:00",
        saturday: "11:00 - 01:00",
        sunday: "12:00 - 23:00"
      },
      specialties: ["Wagyu Beef Premium", "Grillades de porc ibérique", "Saumon grillé nordique", "Côtes d'agneau", "Brochettes exotiques", "Légumes grillés bio"],
      menuCategories: [
        { name: "Viandes Premium", count: 14 },
        { name: "Poissons & Fruits de Mer", count: 10 },
        { name: "Grillades Végétariennes", count: 8 },
        { name: "Accompagnements Gourmet", count: 12 },
        { name: "Vins & Spiritueux", count: 50 },
        { name: "Desserts Signature", count: 8 }
      ],
      totalOrders: 980,
      monthlyOrders: 180,
      monthlyViews: 6750,
      establishedYear: 2020,
      staff: {
        chef: "Marcus Johnson",
        sousChef: "Jean-Baptiste Kouam",
        totalStaff: 25
      },
      ambiance: ["Moderne", "Élégant", "Cosmopolite", "Raffiné", "Urbain"],
      services: ["Livraison VIP", "Service en salle", "Réservations privées", "Événements corporatifs", "Bar à vins", "Service de sommelier"],
      facilities: ["Bar panoramique", "Terrasse privée", "WiFi premium", "Valet parking", "Salon VIP", "Cave à vins climatisée"],
      certifications: ["Restaurant Gastronomique", "Certification Viandes Premium", "Service d'Excellence"],
      socialMedia: {
        facebook: "@urbangrillhouse",
        instagram: "@urban_grill_yde",
        twitter: "@urbangrillcm",
        linkedin: "@urbangrillhouse"
      },
      achievements: [
        { title: "Meilleur Restaurant Haut de Gamme 2023", organization: "Guide Michelin Afrique" },
        { title: "Excellence du Service", organization: "Hospitality Awards Cameroon" },
        { title: "Innovation Gastronomique", organization: "International Culinary Academy" }
      ],
      sustainabilityEfforts: [
        "Viandes issues d'élevages durables",
        "Poissons de pêche responsable",
        "Réduction de l'empreinte carbone",
        "Partenariat avec producteurs bio locaux"
      ],
      workingWith: [
        { name: "Importateur Viandes Premium", type: "Fournisseur international" },
        { name: "Caviste Sélection", type: "Vins et spiritueux" },
        { name: "Ferme Bio Locale", type: "Légumes premium" }
      ]
    }
  ],

  categories: [
    { id: 'tous', name: 'Tous nos Partenaires', icon: '🍽️', description: 'Découvrez tous nos restaurants partenaires' },
    { id: 'camerounaise', name: 'Cuisine Camerounaise', icon: '🇨🇲', description: 'Authentiques saveurs locales' },
    { id: 'africaine', name: 'Cuisine Africaine', icon: '🌍', description: 'Voyage culinaire à travers l\'Afrique' },
    { id: 'traditionnelle', name: 'Traditionnelle', icon: '🥘', description: 'Recettes ancestrales préservées' },
    { id: 'moderne', name: 'Cuisine Moderne', icon: '✨', description: 'Innovation et créativité culinaire' },
    { id: 'featured', name: 'Partenaires Premium', icon: '⭐', description: 'Nos partenaires d\'excellence' },
    { id: 'grillades', name: 'Grillades', icon: '🔥', description: 'Spécialistes des grillades' }
  ],

  partnershipPrograms: [
    {
      name: "Programme Diamant",
      description: "Pour les restaurants d'exception avec plus de 5 ans d'expérience",
      benefits: ["Commission réduite de 15%", "Support marketing premium", "Formation continue", "Analyse de performance"],
      color: "from-purple-500 to-pink-500"
    },
    {
      name: "Programme Or",
      description: "Pour les restaurants établis avec une forte clientèle",
      benefits: ["Commission de 18%", "Support marketing standard", "Outils d'analyse", "Assistance technique"],
      color: "from-yellow-500 to-orange-500"
    },
    {
      name: "Programme Argent",
      description: "Pour les nouveaux partenaires avec potentiel de croissance",
      benefits: ["Commission de 22%", "Formation initiale", "Support technique", "Outils de base"],
      color: "from-gray-400 to-gray-600"
    }
  ],

  stats: {
    totalRestaurants: 47,
    totalPartners: 47,
    averagePartnershipDuration: "3.2 ans",
    totalOrders: 12500,
    activeUsers: 3200,
    avgRating: 4.5,
    monthlyGrowth: "+15%",
    partnerSatisfaction: "94%"
  }
};

// Components
const Logo = ({ className = "text-2xl" }) => (
  <span className={`${className} font-bold bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 bg-clip-text text-transparent`}>
    EatFast
  </span>
);

const Badge = ({ children, variant = "default", className = "" }) => {
  const variants = {
    default: "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300",
    success: "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300",
    warning: "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-300",
    featured: "bg-gradient-to-r from-green-500 to-green-600 text-white",
    partner: "bg-gradient-to-r from-blue-500 to-purple-600 text-white",
    premium: "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
  };
  
  return (
    <span className={`px-2 py-1 text-xs rounded-full font-medium ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};

const Navigation = ({ darkMode, toggleTheme }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const handleLogin = () => {
    // Navigate to login page
    window.location.href = '/login';
  };
  
  return (
    <header className={`fixed w-full z-50 transition-all duration-300 py-3 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl shadow-lg border-b border-gray-200/20 dark:border-gray-700/20`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <motion.div 
            className="flex items-center gap-3"
            whileHover={{ scale: 1.02 }}
          >
            <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-yellow-500 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-sm">E</span>
            </div>
            <Logo />
          </motion.div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {[
              { name: 'Accueil', href: '/', active: false },
              { name: 'Partenaires', href: '/restaurants', active: true },
              { name: 'Devenir Partenaire', href: '/partner', active: false },
              { name: 'À propos', href: '/about', active: false }
            ].map((item) => (
              <a 
                key={item.name}
                href={item.href} 
                className={`font-medium transition-colors relative ${
                  item.active 
                    ? 'text-green-600 dark:text-green-400' 
                    : 'text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400'
                }`}
              >
                {item.name}
                {item.active && (
                  <motion.div 
                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-green-500"
                    layoutId="activeTab"
                  />
                )}
              </a>
            ))}
          </nav>
          
          {/* Actions */}
          <div className="flex items-center gap-3">
            <motion.button 
              onClick={toggleTheme}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </motion.button>
            
            {/* Login Button - Desktop */}
            <motion.button 
              onClick={handleLogin}
              whileHover={{ scale: 1.05 }}
              className="hidden md:flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-xl font-medium transition-colors"
            >
              <LogIn size={18} />
              Connexion
            </motion.button>
            
            <motion.button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="md:hidden p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </motion.button>
          </div>
        </div>
        
        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden mt-4 p-4 bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-200/20 dark:border-gray-700/20"
            >
              {[
                { name: 'Accueil', href: '/' },
                { name: 'Partenaires', href: '/restaurants' },
                { name: 'Devenir Partenaire', href: '/partner' },
                { name: 'À propos', href: '/about' }
              ].map((item) => (
                <a 
                  key={item.name}
                  href={item.href} 
                  className="block py-3 px-2 text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 font-medium rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  {item.name}
                </a>
              ))}
              
              {/* Login Button - Mobile */}
              <motion.button 
                onClick={handleLogin}
                whileHover={{ scale: 1.02 }}
                className="w-full mt-4 flex items-center justify-center gap-2 px-4 py-3 bg-green-500 hover:bg-green-600 text-white rounded-xl font-medium transition-colors"
              >
                <LogIn size={18} />
                Connexion
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
};

const SearchAndFilters = ({ searchQuery, setSearchQuery, selectedCategory, setSelectedCategory }) => {
  return (
    <div className="space-y-8">
      {/* Search Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative max-w-3xl mx-auto"
      >
        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400" size={22} />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Rechercher par nom, spécialité, quartier, type de cuisine..."
          className="w-full pl-16 pr-6 py-5 text-lg rounded-2xl bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 focus:border-green-500 focus:outline-none shadow-xl transition-all"
        />
      </motion.div>
      
      {/* Categories */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex justify-center"
      >
        <div className="flex overflow-x-auto pb-4 hide-scrollbar gap-4 max-w-6xl">
          {mockData.categories.map((category) => (
            <motion.button
              key={category.id}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedCategory(category.id)}
              className={`flex flex-col items-center gap-2 px-6 py-4 rounded-2xl whitespace-nowrap font-medium transition-all min-w-[140px] ${
                selectedCategory === category.id 
                  ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-xl shadow-green-500/25' 
                  : 'bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 border-2 border-gray-200 dark:border-gray-700 hover:border-green-300 shadow-lg'
              }`}
            >
              <span className="text-2xl">{category.icon}</span>
              <div className="text-center">
                <div className="font-semibold">{category.name}</div>
                <div className={`text-xs ${selectedCategory === category.id ? 'text-green-100' : 'text-gray-500 dark:text-gray-400'}`}>
                  {category.description}
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

const ImageCarousel = ({ images, restaurantName, logo }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="relative h-80 md:h-full overflow-hidden rounded-2xl">
      <AnimatePresence mode="wait">
        <motion.img
          key={currentIndex}
          src={images[currentIndex]}
          alt={`${restaurantName} - Image ${currentIndex + 1}`}
          className="w-full h-full object-cover"
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ duration: 0.6 }}
        />
      </AnimatePresence>
      
      {/* Restaurant Logo Overlay */}
      <div className="absolute top-4 left-4">
        <div className="w-16 h-16 rounded-full overflow-hidden border-4 border-white shadow-lg bg-white">
          <img src={logo} alt={`${restaurantName} logo`} className="w-full h-full object-cover" />
        </div>
      </div>
      
      {/* Navigation Arrows */}
      {images.length > 1 && (
        <>
          <button
            onClick={prevImage}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors backdrop-blur-sm"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={nextImage}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors backdrop-blur-sm"
          >
            <ChevronRight size={20} />
          </button>
        </>
      )}
      
      {/* Dots Indicator */}
      {images.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentIndex ? 'bg-white' : 'bg-white/50'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const RestaurantCard = ({ restaurant }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const partnershipYears = new Date().getFullYear() - new Date(restaurant.partnerSince).getFullYear();

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8 }}
      className="bg-white dark:bg-gray-800 rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all border border-gray-200 dark:border-gray-700"
    >
      <div className="lg:flex">
        <div className="lg:w-2/5 relative">
          <ImageCarousel 
            images={restaurant.images} 
            restaurantName={restaurant.name}
            logo={restaurant.logo}
          />
          
          <div className="absolute top-4 right-4 space-y-2">
            {restaurant.featured && (
              <Badge variant="featured">
                <Award size={12} className="mr-1" />
                Premium
              </Badge>
            )}
            {restaurant.verified && (
              <Badge variant="partner">
                <Shield size={12} className="mr-1" />
                Certifié
              </Badge>
            )}
          </div>
          
          <div className="absolute bottom-4 right-4 space-y-2">
            <motion.button
              onClick={() => setIsFavorite(!isFavorite)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className={`p-2 rounded-full backdrop-blur-sm transition-colors ${
                isFavorite 
                  ? 'bg-red-500 text-white' 
                  : 'bg-white/80 text-gray-600 hover:bg-red-500 hover:text-white'
              }`}
            >
              <Heart size={16} fill={isFavorite ? 'currentColor' : 'none'} />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              className="p-2 rounded-full bg-white/80 text-gray-600 hover:bg-gray-100 transition-colors backdrop-blur-sm"
            >
              <Share2 size={16} />
            </motion.button>
          </div>
        </div>
        
        <div className="lg:w-3/5 p-8">
          <div className="flex justify-between items-start mb-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <h3 className="text-3xl font-bold text-gray-900 dark:text-white">
                  {restaurant.name}
                </h3>
                <Verified className="text-blue-500" size={24} />
              </div>
              
              <div className="flex items-center gap-4 mb-3">
                <Badge variant="success">
                  <Crown size={12} className="mr-1" />
                  Partenaire depuis {partnershipYears} ans
                </Badge>
                <Badge>{restaurant.category}</Badge>
                <Badge>{restaurant.district}</Badge>
              </div>
              
              <div className="flex items-center gap-6 mb-4">
                <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                  <Clock size={18} />
                  <span className="font-semibold">{restaurant.deliveryTime} min</span>
                </div>
                <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
                  <Truck size={18} />
                  <span className="font-semibold">{restaurant.deliveryFee} FCFA</span>
                </div>
                <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400">
                  <Package size={18} />
                  <span className="font-semibold">{restaurant.minOrder} FCFA min</span>
                </div>
              </div>
            </div>
          </div>
          
          <p className="text-gray-600 dark:text-gray-300 mb-6 text-lg leading-relaxed">
            {restaurant.description}
          </p>
          
          {/* Quick Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
              <MapPin size={18} className="text-green-500" />
              <div>
                <div className="font-medium">{restaurant.address}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">{restaurant.zone}</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
              <Phone size={18} className="text-blue-500" />
              <div>
                <div className="font-medium">{restaurant.phone}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Contact direct</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
              <ChefHat size={18} className="text-purple-500" />
              <div>
                <div className="font-medium">Chef {restaurant.staff.chef}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">{restaurant.staff.totalStaff} employés</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
              <TrendingUp size={18} className="text-orange-500" />
              <div>
                <div className="font-medium">{restaurant.monthlyOrders} commandes/mois</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">{restaurant.totalOrders} total</div>
              </div>
            </div>
          </div>

          {/* Specialties Preview */}
          <div className="mb-6">
            <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-3 flex items-center gap-2">
              <Utensils size={18} className="text-green-500" />
              Spécialités de la maison
            </h4>
            <div className="flex flex-wrap gap-2">
              {restaurant.specialties.slice(0, 6).map((specialty, index) => (
                <span key={index} className="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300 text-sm rounded-full border border-green-200 dark:border-green-700">
                  {specialty}
                </span>
              ))}
              {restaurant.specialties.length > 6 && (
                <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-sm rounded-full">
                  +{restaurant.specialties.length - 6} autres
                </span>
              )}
            </div>
          </div>
          
          <div className="flex gap-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white py-4 px-6 rounded-xl font-semibold hover:from-green-600 hover:to-green-700 transition-all shadow-lg flex items-center justify-center gap-2"
            >
              <Eye size={20} />
              Explorer le menu
            </motion.button>
            
            <motion.button
              onClick={() => setShowDetails(!showDetails)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-6 py-4 border-2 border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center gap-2"
            >
              <span>Détails</span>
              {showDetails ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </motion.button>
          </div>
        </div>
      </div>
      
      {/* Extended Details */}
      <AnimatePresence>
        {showDetails && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t border-gray-200 dark:border-gray-700"
          >
            <div className="p-8">
              {/* Detailed Description */}
              <div className="mb-8">
                <h4 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Building2 size={20} className="text-blue-500" />
                  À propos du restaurant
                </h4>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {restaurant.detailedDescription}
                </p>
              </div>

              {/* Three Column Layout for Details */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                {/* Hours & Contact */}
                <div className="space-y-6">
                  <div>
                    <h5 className="font-bold mb-4 flex items-center gap-2">
                      <Clock size={18} className="text-green-500" />
                      Horaires d'ouverture
                    </h5>
                    <div className="space-y-2 text-sm">
                      {Object.entries(restaurant.openingHours).map(([day, hours]) => (
                        <div key={day} className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400 capitalize">{day}:</span>
                          <span className="font-medium">{hours}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h5 className="font-bold mb-4 flex items-center gap-2">
                      <Globe size={18} className="text-blue-500" />
                      Contact & Web
                    </h5>
                    <div className="space-y-3 text-sm">
                      <div className="flex items-center gap-2">
                        <Phone size={14} />
                        <span>{restaurant.phone}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Globe size={14} />
                        <span className="text-blue-500">{restaurant.website}</span>
                      </div>
                      <div className="flex gap-2 mt-3">
                        {Object.entries(restaurant.socialMedia).map(([platform, handle]) => (
                          <span key={platform} className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300 text-xs rounded-full">
                            {platform}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Menu & Services */}
                <div className="space-y-6">
                  <div>
                    <h5 className="font-bold mb-4 flex items-center gap-2">
                      <Coffee size={18} className="text-orange-500" />
                      Catégories du menu
                    </h5>
                    <div className="space-y-2">
                      {restaurant.menuCategories.map((category, index) => (
                        <div key={index} className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                          <span className="text-sm font-medium">{category.name}</span>
                          <Badge variant="default">{category.count} plats</Badge>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h5 className="font-bold mb-4 flex items-center gap-2">
                      <Zap size={18} className="text-yellow-500" />
                      Services proposés
                    </h5>
                    <div className="flex flex-wrap gap-2">
                      {restaurant.services.map((service, index) => (
                        <span key={index} className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-300 text-xs rounded-full">
                          {service}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Stats & Achievements */}
                <div className="space-y-6">
                  <div>
                    <h5 className="font-bold mb-4 flex items-center gap-2">
                      <TrendingUp size={18} className="text-green-500" />
                      Performances
                    </h5>
                    <div className="space-y-3">
                      <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">{restaurant.monthlyViews.toLocaleString()}</div>
                        <div className="text-sm text-green-600">Vues mensuelles</div>
                      </div>
                      <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">{restaurant.totalOrders.toLocaleString()}</div>
                        <div className="text-sm text-blue-600">Commandes totales</div>
                      </div>
                      <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                        <div className="text-2xl font-bold text-purple-600">{restaurant.establishedYear}</div>
                        <div className="text-sm text-purple-600">Année de création</div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h5 className="font-bold mb-4 flex items-center gap-2">
                      <Award size={18} className="text-purple-500" />
                      Certifications
                    </h5>
                    <div className="space-y-2">
                      {restaurant.certifications.map((cert, index) => (
                        <div key={index} className="flex items-center gap-2 p-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                          <CheckCircle size={14} className="text-purple-500" />
                          <span className="text-sm">{cert}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Achievements */}
              <div className="mb-8">
                <h5 className="font-bold mb-4 flex items-center gap-2">
                  <Crown size={18} className="text-yellow-500" />
                  Récompenses et distinctions
                </h5>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {restaurant.achievements.map((achievement, index) => (
                    <div key={index} className="p-4 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-xl border border-yellow-200 dark:border-yellow-700">
                      <div className="font-semibold text-yellow-800 dark:text-yellow-300 mb-1">
                        {achievement.title}
                      </div>
                      <div className="text-sm text-yellow-600 dark:text-yellow-400">
                        {achievement.organization}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sustainability */}
              <div className="mb-8">
                <h5 className="font-bold mb-4 flex items-center gap-2">
                  <Leaf size={18} className="text-green-500" />
                  Engagement environnemental
                </h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {restaurant.sustainabilityEfforts.map((effort, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-700">
                      <CheckCircle size={16} className="text-green-500" />
                      <span className="text-sm">{effort}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Partners */}
              <div>
                <h5 className="font-bold mb-4 flex items-center gap-2">
                  <Users size={18} className="text-blue-500" />
                  Partenaires et fournisseurs
                </h5>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {restaurant.workingWith.map((partner, index) => (
                    <div key={index} className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-700">
                      <div className="font-semibold text-blue-800 dark:text-blue-300 mb-1">
                        {partner.name}
                      </div>
                      <div className="text-sm text-blue-600 dark:text-blue-400">
                        {partner.type}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const StatsSection = () => {
  return (
    <section className="py-16 bg-gradient-to-r from-green-500 via-blue-500 to-purple-600">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Notre Réseau de Partenaires
          </h2>
          <p className="text-xl text-white/90 max-w-3xl mx-auto">
            Des chiffres qui témoignent de la confiance et de la qualité de nos partenariats
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white/10 backdrop-blur-sm rounded-2xl p-6"
          >
            <div className="text-4xl font-bold mb-2">{mockData.stats.totalPartners}+</div>
            <div className="text-sm opacity-90">Restaurants Partenaires</div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/10 backdrop-blur-sm rounded-2xl p-6"
          >
            <div className="text-4xl font-bold mb-2">{mockData.stats.averagePartnershipDuration}</div>
            <div className="text-sm opacity-90">Durée moyenne partenariat</div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white/10 backdrop-blur-sm rounded-2xl p-6"
          >
            <div className="text-4xl font-bold mb-2">{mockData.stats.monthlyGrowth}</div>
            <div className="text-sm opacity-90">Croissance mensuelle</div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white/10 backdrop-blur-sm rounded-2xl p-6"
          >
            <div className="text-4xl font-bold mb-2">{mockData.stats.partnerSatisfaction}</div>
            <div className="text-sm opacity-90">Satisfaction partenaires</div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const PartnershipPrograms = () => {
  return (
    <section className="py-16 bg-gray-50 dark:bg-gray-800">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Nos Programmes de Partenariat
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Découvrez les différents niveaux de partenariat et les avantages exclusifs offerts à nos restaurants partenaires
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {mockData.partnershipPrograms.map((program, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white dark:bg-gray-900 rounded-3xl p-8 shadow-xl border border-gray-200 dark:border-gray-700"
            >
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${program.color} flex items-center justify-center mb-6`}>
                <Crown size={24} className="text-white" />
              </div>
              
              <h3 className="text-2xl font-bold mb-4">{program.name}</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">{program.description}</p>
              
              <div className="space-y-3">
                <h4 className="font-semibold text-lg">Avantages inclus :</h4>
                {program.benefits.map((benefit, benefitIndex) => (
                  <div key={benefitIndex} className="flex items-center gap-3">
                    <CheckCircle size={16} className="text-green-500" />
                    <span className="text-sm">{benefit}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Footer = ({ darkMode }) => {
  return (
    <footer className="bg-gray-900 text-white py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <Logo className="text-3xl mb-4" />
            <p className="text-gray-300 mb-6">
              Votre plateforme de livraison de confiance, connectant les meilleurs restaurants avec les gourmets du Cameroun.
            </p>
            <div className="flex gap-4">
              {['facebook', 'instagram', 'twitter', 'linkedin'].map((social) => (
                <a
                  key={social}
                  href={`#${social}`}
                  className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-green-500 transition-colors"
                >
                  <Globe size={16} />
                </a>
              ))}
            </div>
          </div>
          
          <div>
            <h3 className="text-xl font-bold mb-4">Pour les Restaurants</h3>
            <ul className="space-y-2 text-gray-300">
              <li><a href="#" className="hover:text-green-400 transition-colors">Devenir Partenaire</a></li>
              <li><a href="#" className="hover:text-green-400 transition-colors">Programmes de Partenariat</a></li>
              <li><a href="#" className="hover:text-green-400 transition-colors">Outils de Gestion</a></li>
              <li><a href="#" className="hover:text-green-400 transition-colors">Support Technique</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-xl font-bold mb-4">Pour les Clients</h3>
            <ul className="space-y-2 text-gray-300">
              <li><a href="#" className="hover:text-green-400 transition-colors">Commander en ligne</a></li>
              <li><a href="#" className="hover:text-green-400 transition-colors">Application mobile</a></li>
              <li><a href="#" className="hover:text-green-400 transition-colors">Programme de fidélité</a></li>
              <li><a href="#" className="hover:text-green-400 transition-colors">Service client</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-xl font-bold mb-4">Contact</h3>
            <div className="space-y-3 text-gray-300">
              <div className="flex items-center gap-2">
                <Phone size={16} />
                <span>+237 6XX XXX XXX</span>
              </div>
              <div className="flex items-center gap-2">
                <Globe size={16} />
                <span>contact@eatfast.cm</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin size={16} />
                <span>Yaoundé, Cameroun</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
          <p>&copy; 2025 EatFast. Tous droits réservés. Fait avec ❤️ au Cameroun.</p>
        </div>
      </div>
    </footer>
  );
};

// Main Component
const RestaurantPartnershipsPage = () => {
  const { darkMode, toggleTheme } = useTheme();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('tous');

  const filteredRestaurants = useMemo(() => {
    return mockData.restaurants.filter(restaurant => {
      const matchesSearch = searchQuery === '' || 
        restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        restaurant.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        restaurant.district.toLowerCase().includes(searchQuery.toLowerCase()) ||
        restaurant.specialties.some(s => s.toLowerCase().includes(searchQuery.toLowerCase())) ||
        restaurant.staff.chef.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = selectedCategory === 'tous' || 
        (selectedCategory === 'featured' && restaurant.featured) ||
        (selectedCategory === 'grillades' && restaurant.category.toLowerCase().includes('grill')) ||
        restaurant.category.toLowerCase().includes(selectedCategory);
      
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      darkMode ? 'dark bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'
    }`}>
      <Navigation 
        darkMode={darkMode} 
        toggleTheme={toggleTheme}
      />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4 bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="container mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
              Nos Restaurants Partenaires
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto mb-8 leading-relaxed">
              Découvrez notre réseau exclusif de restaurants partenaires certifiés. Chaque établissement est soigneusement sélectionné pour vous garantir une expérience culinaire d'exception, alliant authenticité, qualité et innovation.
            </p>
            
            <div className="flex flex-wrap justify-center gap-4 mb-12">
              <Badge variant="featured" className="text-lg px-6 py-3">
                <Shield size={16} className="mr-2" />
                47 Restaurants Certifiés
              </Badge>
              <Badge variant="success" className="text-lg px-6 py-3">
                <Award size={16} className="mr-2" />
                100% Vérifiés et Contrôlés
              </Badge>
              <Badge variant="partner" className="text-lg px-6 py-3">
                <Crown size={16} className="mr-2" />
                Partenaires de Confiance
              </Badge>
            </div>
            
            <SearchAndFilters 
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
            />
          </motion.div>
        </div>
      </section>
      
      {/* Stats Section */}
      <StatsSection />
      
      {/* Partnership Programs */}
      <PartnershipPrograms />
      
      {/* Content Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-4">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Restaurants Partenaires ({filteredRestaurants.length})
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                Tous nos restaurants sont vérifiés, certifiés et partenaires exclusifs de notre plateforme
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                <Verified size={20} />
                <span className="font-medium">100% Certifiés</span>
              </div>
              <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
                <Shield size={20} />
                <span className="font-medium">Contrôle Qualité</span>
              </div>
            </div>
          </div>
          
          <div className="space-y-12">
            {filteredRestaurants.length === 0 ? (
              <div className="text-center py-20">
                <div className="text-8xl mb-8">🏪</div>
                <h3 className="text-3xl font-bold mb-6">Aucun restaurant trouvé</h3>
                <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
                  Essayez d'ajuster vos critères de recherche ou explorez d'autres catégories pour découvrir nos merveilleux restaurants partenaires
                </p>
                <motion.button 
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('tous');
                  }}
                  whileHover={{ scale: 1.05 }}
                  className="px-8 py-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all"
                >
                  Voir tous nos partenaires
                </motion.button>
              </div>
            ) : (
              filteredRestaurants.map((restaurant, index) => (
                <motion.div
                  key={restaurant.id}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <RestaurantCard restaurant={restaurant} />
                </motion.div>
              ))
            )}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-green-500 via-blue-500 to-purple-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-8">
              Rejoignez Notre Réseau d'Excellence
            </h2>
            <p className="text-xl md:text-2xl mb-12 max-w-4xl mx-auto opacity-90 leading-relaxed">
              Vous êtes restaurateur et souhaitez faire partie de notre réseau de partenaires premium ? 
              Découvrez nos programmes exclusifs et développez votre activité avec EatFast.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8">
                <TrendingUp size={40} className="mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">Augmentez vos ventes</h3>
                <p className="opacity-90">Jusqu'à +40% de chiffre d'affaires</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8">
                <Users size={40} className="mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">Touchez plus de clients</h3>
                <p className="opacity-90">Accès à notre base de 3200+ utilisateurs</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8">
                <Target size={40} className="mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">Marketing ciblé</h3>
                <p className="opacity-90">Outils de promotion et analytics</p>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-10 py-5 bg-white text-green-600 rounded-xl font-bold text-xl hover:bg-gray-100 transition-colors shadow-2xl"
              >
                Devenir Partenaire
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-10 py-5 border-2 border-white text-white rounded-xl font-bold text-xl hover:bg-white hover:text-green-600 transition-colors"
              >
                En savoir plus
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>
      
      {/* Footer */}
      <Footer darkMode={darkMode} />
    </div>
  );
};

export default RestaurantPartnershipsPage;