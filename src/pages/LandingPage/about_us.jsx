import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { 
  Sun, Moon, ChevronDown, User, ShoppingBag, Menu, X, Quote, Award, Rocket, 
  Users, Languages, MapPin, Phone, Mail, Globe, Heart, Star, Truck, Shield,
  Target, Eye, Lightbulb, Zap, Clock, CheckCircle, TrendingUp, Coffee,
  Calendar, Camera, Play
} from 'lucide-react';
import Footer from '../../components/CommonShare/Footer';


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
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e) => setDarkMode(e.matches);
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return { darkMode, toggleTheme };
};

const useScrollEffects = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const { scrollYProgress } = useScroll();
  const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
  
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return { isScrolled, backgroundY, scrollYProgress };
};

// Real Navigation
const useNavigation = () => {
  const navigate = (path) => {
    // Real navigation - this will actually redirect to the routes
    window.location.href = path;
  };

  return { navigate };
};

// Animation Variants
const animations = {
  fadeInUp: {
    hidden: { opacity: 0, y: 40 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.8, ease: "easeOut" }
    }
  },
  slideInLeft: {
    hidden: { opacity: 0, x: -60 },
    visible: { 
      opacity: 1, 
      x: 0, 
      transition: { duration: 0.8, ease: "easeOut" }
    }
  },
  slideInRight: {
    hidden: { opacity: 0, x: 60 },
    visible: { 
      opacity: 1, 
      x: 0, 
      transition: { duration: 0.8, ease: "easeOut" }
    }
  },
  stagger: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  },
  scaleIn: {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { 
        type: "spring", 
        stiffness: 100, 
        damping: 15 
      }
    }
  }
};

// Mock Data - Enhanced
const mockData = {
  teamMembers: [
    {
      id: 1,
      name: 'Madame Fina Nguenang',
      role: 'CEO & Fondatrice',
      image: 'https://images.unsplash.com/photo-1494790108755-2616b612b0e1?w=300&h=300&fit=crop&crop=face',
      description: 'Visionnaire passionnée avec plus de 10 ans d\'expérience dans l\'industrie alimentaire et la technologie.',
      linkedin: '#',
      email: 'fina@eatfast.cm',
      achievements: ['Forbes 30 Under 30', 'Tech Leader Award 2023'],
      quote: "Notre mission est de connecter chaque camerounais à ses saveurs préférées."
    },
    {
      id: 2,
      name: 'Monsieur Alain Talla',
      role: 'CTO & Co-fondateur',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face',
      description: 'Expert en développement logiciel spécialisé dans les plateformes de livraison évolutives.',
      linkedin: '#',
      email: 'alain@eatfast.cm',
      achievements: ['Google Developer Expert', 'AWS Solutions Architect'],
      quote: "La technologie doit servir l'humain, pas l'inverse."
    },
    {
      id: 3,
      name: 'Monsieur Momo Yvan',
      role: 'Lead Developer',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face',
      description: 'Développeur talentueux spécialisé dans l\'expérience utilisateur et les interfaces modernes.',
      linkedin: '#',
      email: 'yvan@eatfast.cm',
      achievements: ['React Expert', 'UI/UX Certification'],
      quote: "Chaque ligne de code doit améliorer la vie de nos utilisateurs."
    },
    {
      id: 4,
      name: 'Madame Sarah Fokam',
      role: 'Head of Design',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop&crop=face',
      description: 'Designer créative garantissant que notre plateforme soit à la fois belle et intuitive.',
      linkedin: '#',
      email: 'sarah@eatfast.cm',
      achievements: ['Adobe Certified Expert', 'Design Thinking Master'],
      quote: "Le design c'est résoudre des problèmes avec beauté."
    }
  ],

  stats: [
    { number: '10K+', label: 'Clients Satisfaits', icon: <Users className="text-blue-500" size={32} /> },
    { number: '500+', label: 'Restaurants Partenaires', icon: <Coffee className="text-green-500" size={32} /> },
    { number: '50K+', label: 'Commandes Livrées', icon: <Truck className="text-purple-500" size={32} /> },
    { number: '5', label: 'Villes Couvertes', icon: <MapPin className="text-red-500" size={32} /> }
  ],

  milestones: [
    {
      year: '2022',
      title: 'Fondation d\'EatFast',
      description: 'Lancement de l\'idée avec une équipe de 4 passionnés',
      icon: <Lightbulb className="text-yellow-500" size={24} />
    },
    {
      year: '2023',
      title: 'Premier Restaurant Partenaire',
      description: 'Signature du premier contrat avec Le Foufou Délice',
      icon: <Rocket className="text-blue-500" size={24} />
    },
    {
      year: '2023',
      title: '100 Restaurants',
      description: 'Franchissement du cap des 100 restaurants partenaires',
      icon: <Target className="text-green-500" size={24} />
    },
    {
      year: '2024',
      title: 'Expansion Nationale',
      description: 'Lancement dans 5 villes du Cameroun',
      icon: <Globe className="text-purple-500" size={24} />
    },
    {
      year: '2024',
      title: '10K Clients',
      description: 'Atteinte de 10 000 clients actifs sur la plateforme',
      icon: <Heart className="text-red-500" size={24} />
    }
  ],

  values: [
    {
      title: 'Authenticité',
      description: 'Nous préservons et célébrons les saveurs traditionnelles camerounaises',
      icon: <Heart className="text-red-500" size={28} />,
      color: 'from-red-500 to-pink-500'
    },
    {
      title: 'Innovation',
      description: 'Nous utilisons la technologie pour améliorer l\'expérience culinaire',
      icon: <Zap className="text-yellow-500" size={28} />,
      color: 'from-yellow-500 to-orange-500'
    },
    {
      title: 'Rapidité',
      description: 'Livraison ultra-rapide sans compromis sur la qualité',
      icon: <Clock className="text-blue-500" size={28} />,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      title: 'Qualité',
      description: 'Standards élevés pour tous nos restaurants partenaires',
      icon: <Shield className="text-green-500" size={28} />,
      color: 'from-green-500 to-emerald-500'
    }
  ],

  testimonials: [
    {
      id: 1,
      quote: "EatFast a révolutionné ma façon de commander. Je retrouve enfin les goûts de mon enfance !",
      author: 'Jean-Baptiste Nkomo',
      role: 'Client fidèle',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
      rating: 5,
      location: 'Yaoundé'
    },
    {
      id: 2,
      quote: "Grâce à EatFast, mon restaurant a triplé ses ventes. L\'équipe est professionnelle et à l\'écoute.",
      author: 'Aminata Kouakou',
      role: 'Propriétaire de restaurant',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b0e1?w=100&h=100&fit=crop&crop=face',
      rating: 5,
      location: 'Douala'
    },
    {
      id: 3,
      quote: "Interface intuitive, livraison rapide, plats délicieux. EatFast dépasse toutes mes attentes !",
      author: 'Paul Mbarga',
      role: 'Chef Cuisinier',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
      rating: 5,
      location: 'Bafoussam'
    }
  ]
};

// Components
const Logo = ({ className = "text-2xl" }) => (
  <span className={`${className} font-bold bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 bg-clip-text text-transparent`}>
    EatFast
  </span>
);

const Badge = ({ children, variant = "default" }) => {
  const variants = {
    default: "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300",
    success: "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300",
    primary: "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300"
  };
  
  return (
    <span className={`px-3 py-1 text-xs rounded-full font-medium ${variants[variant]}`}>
      {children}
    </span>
  );
};

// Video Modal Component
const VideoModal = ({ isOpen, onClose }) => (
  <AnimatePresence>
    {isOpen && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          className="relative w-full max-w-4xl mx-4 bg-black rounded-2xl overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
          >
            <X size={24} />
          </button>
          <div className="aspect-video">
            <video
              controls
              autoPlay
              className="w-full h-full object-cover"
              poster="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=450&fit=crop"
            >
              <source src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" type="video/mp4" />
              Votre navigateur ne supporte pas la lecture de vidéos.
            </video>
          </div>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

const Navigation = ({ darkMode, toggleTheme, isScrolled }) => {
  const { navigate } = useNavigation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const navigationItems = [
    { name: 'Accueil', href: '/', active: false },
    { name: 'Restaurants', href: '/restaurants', active: false },
    { name: 'À propos', href: '/about', active: true },
    { name: 'Contact', href: '/contact', active: false }
  ];

  const handleNavigation = (href) => {
    navigate(href);
    setIsMenuOpen(false);
  };
  
  return (
    <header className={`fixed w-full z-50 transition-all duration-300 ${
      isScrolled 
        ? 'py-3 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl shadow-xl border-b border-gray-200/20 dark:border-gray-700/20' 
        : 'py-5 bg-transparent'
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => navigate('/')}
          >
            <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-yellow-500 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-sm">E</span>
            </div>
            <Logo />
          </motion.div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navigationItems.map((item) => (
              <button 
                key={item.name}
                onClick={() => handleNavigation(item.href)}
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
              </button>
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
            
            <motion.button 
              whileHover={{ scale: 1.05 }}
              className="hidden md:flex items-center gap-2 p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              onClick={() => navigate('/login')}
            >
              <User size={20} />
            </motion.button>
            
            <motion.button 
              whileHover={{ scale: 1.05 }}
              className="relative p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <ShoppingBag size={20} />
              <motion.span 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium"
              >
                2
              </motion.span>
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
              {navigationItems.map((item) => (
                <button 
                  key={item.name}
                  onClick={() => handleNavigation(item.href)}
                  className="block w-full text-left py-3 px-2 text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 font-medium rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  {item.name}
                </button>
              ))}
              {/* Mobile User Login */}
              <button 
                onClick={() => {
                  navigate('/login');
                  setIsMenuOpen(false);
                }}
                className="flex items-center gap-2 w-full py-3 px-2 text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 font-medium rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <User size={20} />
                Se connecter
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
};

const HeroSection = ({ backgroundY }) => {
  const { navigate } = useNavigation();
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  return (
    <>
      <section className="pt-24 md:pt-32 pb-20 relative overflow-hidden">
        {/* Animated Background Elements */}
        <motion.div 
          style={{ y: backgroundY }}
          className="absolute inset-0 z-0"
        >
          <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-green-400/20 to-blue-400/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-r from-yellow-400/20 to-red-400/20 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-purple-400/10 to-pink-400/10 rounded-full blur-3xl"></div>
        </motion.div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div 
            variants={animations.fadeInUp}
            initial="hidden"
            animate="visible"
            className="text-center max-w-4xl mx-auto"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
              className="inline-block mb-6"
            >
              <div className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-2 rounded-full text-sm font-medium">
                ✨ Votre passerelle vers les délices culinaires
              </div>
            </motion.div>

            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              <span className="block mb-2">À Propos</span>
              <span className="bg-gradient-to-r from-green-600 via-yellow-500 to-red-500 bg-clip-text text-transparent">
                d'EatFast
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl mb-8 text-gray-600 dark:text-gray-300 leading-relaxed">
              Nous connectons les camerounais à leurs saveurs préférées grâce à une technologie innovante 
              et un service de livraison ultra-rapide
            </p>

            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center"
              variants={animations.stagger}
              initial="hidden"
              animate="visible"
            >
              <motion.button
                variants={animations.scaleIn}
                whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(0,0,0,0.2)" }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsVideoModalOpen(true)}
                className="bg-gradient-to-r from-green-500 to-green-600 text-white px-8 py-4 rounded-full font-bold text-lg shadow-2xl flex items-center justify-center gap-2"
              >
                <Play size={20} />
                Découvrir Notre Histoire
              </motion.button>
              
              <motion.button
                variants={animations.scaleIn}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/become')}
                className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-8 py-4 rounded-full font-bold text-lg border-2 border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all flex items-center justify-center gap-2"
              >
                <Users size={20} />
                Rejoindre l'Équipe
              </motion.button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <VideoModal 
        isOpen={isVideoModalOpen} 
        onClose={() => setIsVideoModalOpen(false)} 
      />
    </>
  );
};

const StatsSection = () => (
  <section className="py-16 relative">
    <div className="container mx-auto px-4">
      <motion.div 
        variants={animations.stagger}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="grid grid-cols-2 md:grid-cols-4 gap-8"
      >
        {mockData.stats.map((stat, index) => (
          <motion.div
            key={index}
            variants={animations.scaleIn}
            whileHover={{ y: -10, scale: 1.05 }}
            className="text-center p-6 bg-white dark:bg-gray-800 rounded-3xl shadow-lg hover:shadow-2xl transition-all border border-gray-200 dark:border-gray-700"
          >
            <div className="flex justify-center mb-4">
              {stat.icon}
            </div>
            <div className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
              {stat.number}
            </div>
            <div className="text-gray-600 dark:text-gray-300 font-medium">
              {stat.label}
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  </section>
);

const MissionVisionSection = () => (
  <section className="py-20 bg-gradient-to-br from-gray-50 to-green-50 dark:from-gray-800 dark:to-gray-900">
    <div className="container mx-auto px-4">
      <div className="flex flex-col lg:flex-row items-center gap-16">
        {/* Left Content */}
        <motion.div 
          variants={animations.slideInLeft}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="w-full lg:w-1/2"
        >
          <div className="relative">
            <div className="w-full h-96 bg-gradient-to-br from-green-500 to-yellow-500 rounded-3xl overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&h=400&fit=crop"
                alt="EatFast Mission" 
                className="w-full h-full object-cover mix-blend-overlay"
              />
            </div>
            <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-white dark:bg-gray-800 rounded-2xl shadow-xl flex items-center justify-center">
              <Heart className="text-red-500" size={32} />
            </div>
          </div>
        </motion.div>
        
        {/* Right Content */}
        <motion.div 
          variants={animations.slideInRight}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="w-full lg:w-1/2"
        >
          <div className="space-y-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center">
                  <Target className="text-white" size={24} />
                </div>
                <h3 className="text-2xl font-bold">Notre Mission</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed">
                Démocratiser l'accès à la cuisine camerounaise authentique en connectant 
                chaque foyer aux meilleurs restaurants locaux grâce à une technologie 
                innovante et un service de livraison ultra-rapide.
              </p>
            </div>
            
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center">
                  <Eye className="text-white" size={24} />
                </div>
                <h3 className="text-2xl font-bold">Notre Vision</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed">
                Devenir la plateforme de référence pour la livraison de nourriture en Afrique, 
                en préservant et célébrant les traditions culinaires tout en embrassant 
                l'innovation technologique.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-6">
              <div className="text-center p-4 bg-white dark:bg-gray-700 rounded-2xl">
                <div className="text-2xl font-bold text-green-600 mb-1">2022</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Année de création</div>
              </div>
              <div className="text-center p-4 bg-white dark:bg-gray-700 rounded-2xl">
                <div className="text-2xl font-bold text-blue-600 mb-1">100%</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Made in Cameroon</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  </section>
);

const ValuesSection = () => (
  <section className="py-20">
    <div className="container mx-auto px-4">
      <motion.div
        variants={animations.fadeInUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <h2 className="text-4xl md:text-5xl font-bold mb-6">Nos Valeurs</h2>
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          Les principes fondamentaux qui guident chacune de nos décisions et actions
        </p>
      </motion.div>
      
      <motion.div 
        variants={animations.stagger}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
      >
        {mockData.values.map((value, index) => (
          <motion.div
            key={index}
            variants={animations.scaleIn}
            whileHover={{ y: -10, scale: 1.02 }}
            className="group relative"
          >
            <div className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl blur-xl -z-10"
                 style={{ background: `linear-gradient(135deg, ${value.color.split(' ')[1]}, ${value.color.split(' ')[3]})` }}
            ></div>
            <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all border border-gray-200 dark:border-gray-700 relative z-10">
              <div className="flex justify-center mb-6">
                <div className={`w-16 h-16 bg-gradient-to-br ${value.color} rounded-2xl flex items-center justify-center`}>
                  {value.icon}
                </div>
              </div>
              <h3 className="text-xl font-bold mb-4 text-center">{value.title}</h3>
              <p className="text-gray-600 dark:text-gray-300 text-center">{value.description}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  </section>
);

const TimelineSection = () => (
  <section className="py-20 bg-gray-50 dark:bg-gray-800">
    <div className="container mx-auto px-4">
      <motion.div
        variants={animations.fadeInUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <h2 className="text-4xl md:text-5xl font-bold mb-6">Notre Parcours</h2>
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          Les étapes clés qui ont marqué l'évolution d'EatFast
        </p>
      </motion.div>

      <div className="relative">
        {/* Timeline Line */}
        <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-green-500 to-red-500 rounded-full"></div>
        
        <div className="space-y-12">
          {mockData.milestones.map((milestone, index) => (
            <motion.div
              key={index}
              variants={animations.fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className={`flex items-center ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}
            >
              <div className={`w-1/2 ${index % 2 === 0 ? 'pr-8 text-right' : 'pl-8 text-left'}`}>
                <div className="bg-white dark:bg-gray-700 p-6 rounded-2xl shadow-lg">
                  <div className="flex items-center gap-3 mb-3">
                    {index % 2 === 1 && milestone.icon}
                    <span className="text-2xl font-bold text-green-600">{milestone.year}</span>
                    {index % 2 === 0 && milestone.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-2">{milestone.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300">{milestone.description}</p>
                </div>
              </div>
              
              {/* Timeline Dot */}
              <div className="relative z-10">
                <div className="w-6 h-6 bg-gradient-to-r from-green-500 to-green-600 rounded-full border-4 border-white dark:border-gray-800 shadow-lg"></div>
              </div>
              
              <div className="w-1/2"></div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

const TeamSection = () => (
  <section className="py-20">
    <div className="container mx-auto px-4">
      <motion.div
        variants={animations.fadeInUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <h2 className="text-4xl md:text-5xl font-bold mb-6">Notre Équipe</h2>
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          L'équipe passionnée qui donne vie à EatFast chaque jour
        </p>
      </motion.div>
      
      <motion.div 
        variants={animations.stagger}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
      >
        {mockData.teamMembers.map((member) => (
          <motion.div
            key={member.id}
            variants={animations.scaleIn}
            whileHover={{ y: -10 }}
            className="group relative"
          >
            <div className="bg-white dark:bg-gray-800 rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all border border-gray-200 dark:border-gray-700">
              {/* Profile Image */}
              <div className="relative h-64 overflow-hidden">
                <img 
                  src={member.image} 
                  alt={member.name} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                
                {/* Achievement Badges */}
                <div className="absolute top-4 left-4 space-y-2">
                  {member.achievements.slice(0, 1).map((achievement, i) => (
                    <Badge key={i} variant="success">{achievement}</Badge>
                  ))}
                </div>
              </div>
              
              {/* Content */}
              <div className="p-6">
                <h3 className="text-xl font-bold mb-1">{member.name}</h3>
                <p className="text-green-500 font-medium mb-3">{member.role}</p>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">{member.description}</p>
                
                {/* Quote */}
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-xl mb-4">
                  <Quote size={16} className="text-green-500 mb-2" />
                  <p className="text-sm italic">"{member.quote}"</p>
                </div>
                
                {/* Contact */}
                <div className="flex items-center justify-between">
                  <a href={`mailto:${member.email}`} 
                     className="text-green-500 hover:text-green-600 transition-colors">
                    <Mail size={18} />
                  </a>
                  <div className="flex gap-2">
                    {member.achievements.slice(1).map((achievement, i) => (
                      <Badge key={i} variant="primary">{achievement}</Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  </section>
);

const TestimonialsSection = () => (
  <section className="py-20 bg-gradient-to-br from-green-50 to-yellow-50 dark:from-gray-800 dark:to-gray-900">
    <div className="container mx-auto px-4">
      <motion.div
        variants={animations.fadeInUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <h2 className="text-4xl md:text-5xl font-bold mb-6">Ce qu'ils disent de nous</h2>
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          Les témoignages de nos clients et partenaires qui nous font confiance
        </p>
      </motion.div>
      
      <motion.div 
        variants={animations.stagger}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="grid grid-cols-1 md:grid-cols-3 gap-8"
      >
        {mockData.testimonials.map((testimonial, index) => (
          <motion.div
            key={testimonial.id}
            variants={animations.scaleIn}
            whileHover={{ y: -5, scale: 1.02 }}
            className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all border border-gray-200 dark:border-gray-700"
          >
            {/* Stars */}
            <div className="flex items-center gap-1 mb-4">
              {[...Array(testimonial.rating)].map((_, i) => (
                <Star key={i} size={16} className="text-yellow-500 fill-current" />
              ))}
            </div>
            
            {/* Quote */}
            <div className="mb-6">
              <Quote size={24} className="text-green-500 mb-4" />
              <p className="text-lg italic leading-relaxed">"{testimonial.quote}"</p>
            </div>
            
            {/* Author */}
            <div className="flex items-center gap-4">
              <img 
                src={testimonial.avatar} 
                alt={testimonial.author}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div>
                <h4 className="font-bold">{testimonial.author}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">{testimonial.role}</p>
                <p className="text-xs text-green-500 flex items-center gap-1">
                  <MapPin size={12} />
                  {testimonial.location}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  </section>
);

const CTASection = () => {
  const { navigate } = useNavigation();

  return (
    <section className="py-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-green-600 to-green-700"></div>
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-72 h-72 bg-white rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-yellow-400 rounded-full blur-3xl"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          variants={animations.fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-center text-white"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Rejoignez l'Aventure EatFast
          </h2>
          <p className="text-xl mb-8 opacity-90 max-w-3xl mx-auto">
            Que vous soyez un restaurant souhaitant rejoindre nos partenaires ou un talent 
            cherchant à révolutionner l'industrie alimentaire, nous avons une place pour vous !
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/become')}
              className="bg-white text-green-600 px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-100 transition-colors shadow-xl"
            >
              Devenir Partenaire Restaurant
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/become')}
              className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-white hover:text-green-600 transition-all"
            >
              Rejoindre Notre Équipe
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

// Main Component
const AboutPage = () => {
  const { darkMode, toggleTheme } = useTheme();
  const { isScrolled, backgroundY } = useScrollEffects();
  const { navigate } = useNavigation();

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      darkMode ? 'dark bg-gray-900 text-white' : 'bg-white text-gray-900'
    }`}>
      <Navigation darkMode={darkMode} toggleTheme={toggleTheme} isScrolled={isScrolled} />
      
      <HeroSection backgroundY={backgroundY} />
      <StatsSection />
      <MissionVisionSection />
      <ValuesSection />
      <TimelineSection />
      <TeamSection />
      <TestimonialsSection />
      <CTASection />
      
      {/* Footer */}
    <Footer darkMode={darkMode} />

    </div>
  );
};

export default AboutPage;