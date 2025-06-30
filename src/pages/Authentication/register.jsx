import {
  useState,
  useEffect,
  useCallback,
  useMemo,
  createContext,
  useContext,
} from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sun,
  Moon,
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  Phone,
  ChevronRight,
  ShoppingBag,
  Star,
  Sparkles,
  Shield,
  UserPlus,
  CheckCircle,
  AlertCircle,
  Globe,
  Smartphone,
  CreditCard,
  Upload,
} from "lucide-react";
import { AuthServices } from "../../Services/userLogin/authService";

import { CAMEROON_COLORS, ANIMATION_DELAY_BASE } from "./const";

import {
  FLOATING_PARTICLES_COUNT,
  FEATURES_DATA,
  BENEFITS_DATA,
  translations,
} from "./const_register";

import { userContextInformation } from "./const_provider";
// export const userContextRegister = createContext();

// export const userInformationRegister = {
//   first_name: " ",
//   last_name: " ",
//   email: " ",
//   phone_number: " ",
// };

const Register = () => {
  // State management
  const [uiState, setUiState] = useState({
    darkMode: false,
    isScrolled: false,
    language: "fr",
    focusedField: "",
    mousePosition: { x: 0, y: 0 },
  });

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
    password: "",
    confirmPassword: "",
    user_type: "",
    documents: [],
    is_verified: false,
    is_active: false,
    status: "inactive",
    acceptTerms: false,
    delivery_documents: {
      id_document: null,
      driving_license: null,
      insurance: null, // optionnel
    },
    restaurant_documents: {
      id_document: null,
      business_license: null,
      health_certificate: null,
      menu: null, // optionnel
      photos: [], // optionnel
    },
    city: " ",
    vehicle_type: " ",
    address: " ",
  });

  const [formState, setFormState] = useState({
    showPassword: false,
    showConfirmPassword: false,
    isLoading: false,
    errors: {},
    success: false,
    apiError: "",
  });

  const [particles, setParticles] = useState([]);

  const { setUserInformation } = useContext(userContextInformation);

  const navigate = useNavigate();

  // Memoized translations
  const t = useMemo(() => translations[uiState.language], [uiState.language]);

  // Initialize particles
  useEffect(() => {
    const newParticles = Array.from(
      { length: FLOATING_PARTICLES_COUNT },
      (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 4 + 2,
        duration: Math.random() * 20 + 10,
        delay: Math.random() * 5,
      })
    );
    setParticles(newParticles);
  }, []);

  // Initialize dark mode from system preference
  useEffect(() => {
    const darkModeQuery = window.matchMedia("(prefers-color-scheme: dark)");
    setUiState((prev) => ({ ...prev, darkMode: darkModeQuery.matches }));

    const handleChange = (e) => {
      setUiState((prev) => ({ ...prev, darkMode: e.matches }));
    };

    darkModeQuery.addEventListener("change", handleChange);
    return () => darkModeQuery.removeEventListener("change", handleChange);
  }, []);

  // Mouse tracking for 3D effects
  useEffect(() => {
    let timeoutId;
    const handleMouseMove = (e) => {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setUiState((prev) => ({
          ...prev,
          mousePosition: {
            x: (e.clientX / window.innerWidth - 0.5) * 2,
            y: (e.clientY / window.innerHeight - 0.5) * 2,
          },
        }));
      }, 16); // ~60fps
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, []);

  // Scroll listener
  useEffect(() => {
    const handleScroll = () => {
      setUiState((prev) => ({
        ...prev,
        isScrolled: window.scrollY > 20,
      }));
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Event handlers
  const toggleDarkMode = useCallback(() => {
    setUiState((prev) => ({ ...prev, darkMode: !prev.darkMode }));
  }, []);

  const toggleLanguage = useCallback(() => {
    setUiState((prev) => ({
      ...prev,
      language: prev.language === "en" ? "fr" : "en",
    }));
  }, []);

  const validateField = useCallback(
    (name, value) => {
      const errors = { ...formState.errors };

      switch (name) {
        case "first_name":
        case "last_name":
          if (!value.trim()) {
            errors[name] = t.validation.required;
          } else if (value.length < 2) {
            errors[name] = "Must be at least 2 characters";
          } else {
            delete errors[name];
          }
          break;
        case "email":
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!value.trim()) {
            errors.email = t.validation.required;
          } else if (!emailRegex.test(value)) {
            errors.email = t.validation.invalidEmail;
          } else {
            delete errors.email;
          }
          break;
        case "phone_number":
          const phoneRegex = /^(\+237)?[6-9]\d{8}$/;
          if (!value.trim()) {
            errors.phone_number = t.validation.required;
          } else if (!phoneRegex.test(value.replace(/\s/g, ""))) {
            errors.phone_number = t.validation.invalidPhone;
          } else {
            delete errors.phone_number;
          }
          break;
        case "password":
          if (!value) {
            errors.password = t.validation.required;
          } else if (value.length < 8) {
            errors.password = t.validation.passwordLength;
          } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(value)) {
            errors.password =
              "Password must contain uppercase, lowercase, and numbers";
          } else {
            delete errors.password;
          }
          break;
        case "confirmPassword":
          if (!value) {
            errors.confirmPassword = t.validation.required;
          } else if (value !== formData.password) {
            errors.confirmPassword = t.validation.passwordMatch;
          } else {
            delete errors.confirmPassword;
          }
          break;
        case "city":
          if (!value.trim()) {
            errors.city = t.validation.required;
          } else if (value.length < 2) {
            errors.city =
              "Le nom de la ville doit contenir au moins 2 caractères";
          } else {
            delete errors.city;
          }
          break;

        case "address":
          if (!value.trim()) {
            errors.address = t.validation.required;
          } else if (value.length < 10) {
            errors.address = "L'adresse doit être plus précise";
          } else {
            delete errors.address;
          }
          break;
        default:
          break;
      }

      setFormState((prev) => ({ ...prev, errors }));
    },
    [formState.errors, formData.password, t.validation]
  );

  const handleChange = useCallback(
    (e) => {
      const { name, value, type, checked } = e.target;
      const newValue = type === "checkbox" ? checked : value;

      setFormData((prev) => ({
        ...prev,
        [name]: newValue,
      }));

      if (type !== "checkbox") {
        validateField(name, newValue);
      }
    },
    [validateField]
  );

  const handleFocus = useCallback((fieldName) => {
    setUiState((prev) => ({ ...prev, focusedField: fieldName }));
  }, []);

  const handleBlur = useCallback(() => {
    setUiState((prev) => ({ ...prev, focusedField: "" }));
  }, []);

  const validateForm = useCallback(() => {
    const errors = {};
    Object.keys(formData).forEach((key) => {
      // Validation des documents spécifiques

      // Validation des champs communs
      if (!formData.city) errors.city = "La ville est requise";
      if (!formData.address) errors.address = "L'adresse est requise";
      if (formData.user_type === "delivery") {
        if (!formData.vehicle_type)
          errors.vehicle_type = "Le type de véhicule est requis";
        if (!formData.delivery_documents.id_document) {
          errors.id_document = "Pièce d'identité requise";
        }
        if (!formData.delivery_documents.driving_license) {
          errors.driving_license = "Permis de conduire requis";
        }
      }

      if (formData.user_type === "restaurant_manager") {
        if (!formData.restaurant_documents.id_document) {
          errors.restaurant_id_document = "Pièce d'identité requise";
        }
        if (!formData.restaurant_documents.business_license) {
          errors.business_license = "Licence commerciale requise";
        }
        if (!formData.restaurant_documents.health_certificate) {
          errors.health_certificate = "Certificat sanitaire requis";
        }
      }

      if (key !== "acceptTerms") {
        validateField(key, formData[key]);
      }
    });

    if (!formData.acceptTerms) {
      errors.acceptTerms = "You must accept the terms and conditions";
    }

    return (
      Object.keys(formState.errors).length === 0 &&
      Object.keys(errors).length === 0
    );
  }, [formData, formState.errors, validateField]);

  const handleSubmit = useCallback(async () => {
    if (!validateForm()) {
      return;
    }

    setFormState((prev) => ({
      ...prev,
      isLoading: true,
      apiError: "",
      success: false,
    }));

    try {
      // // Simulate API call
      // await new Promise(resolve => setTimeout(resolve, 2500));

      // setFormState(prev => ({
      //   ...prev,
      //   isLoading: false,
      //   success: true
      // }));

      // Reset form after success
      // setTimeout(() => {
      //   setFormData({
      //     first_name: '',
      //     last_name: '',
      //     email: '',
      //     phone_number: '',
      //     password: '',
      //     confirmPassword: '',
      //     acceptTerms: false
      //   });
      //   setFormState(prev => ({ ...prev, success: false }));

      formData.is_verified = formData.user_type === "client" ? true : false;

      formData.is_active = formData.user_type === "client" ? true : false;

      formData.status = formData.is_active ? "active" : "inactive";

      const userInfo = { ...formData };

      // const user = await UserServices.createUser(userInfo);

      const newUser = await AuthServices.createUser(userInfo);
      // }, 3000);
      setFormData({
        first_name: "",
        last_name: "",
        email: "",
        phone_number: "",
        password: "",
        confirmPassword: "",
        user_type: "",
        delivery_documents: {
          id_document: null,
          driving_license: null,
          insurance: null,
        },
        restaurant_documents: {
          id_document: null,
          business_license: null,
          health_certificate: null,
          menu: null,
          photos: [],
        },
        acceptTerms: false,
      });

      // // setUserInformationRegister(newUser);
      // const { first_name, email, last_name, phone_number } = newUser;

      // userInformationRegister.first_name = first_name;
      // userInformationRegister.last_name = last_name;
      // userInformationRegister.email = email;
      // userInformationRegister.phone_number = phone_number;

      // userInformationRegister = { ...newUser };

      // console.log(userInformationRegister);

      const userInformationDataBase = {
        first_name: newUser.first_name,
        last_name: newUser.last_name,
        email: newUser.email,
        phone_number: newUser.phone_number,
      };

      setUserInformation(userInformationDataBase);

      setFormState((prev) => ({
        ...prev,
        isLoading: false,
        success: true,
      }));

      setFormState((prev) => ({ ...prev, success: false }));

      if (newUser.user_type === "client") {
        navigate("/clients");
      } else {
        alert(
          "Inscription réussie ! Vos documents sont en cours de vérification."
        );
        navigate("/");
      }
    } catch (error) {
      setFormState((prev) => ({
        ...prev,
        isLoading: false,
        apiError: t.error,
      }));
    }
  }, [validateForm, t.error, navigate, setUserInformation]);

  const handleLogoClick = useCallback(() => {
    window.location.href = "/";
  }, []);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.8,
        when: "beforeChildren",
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  const floatingVariants = {
    animate: {
      y: [-10, 10, -10],
      rotate: [0, 5, -5, 0],
      transition: {
        duration: 6,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  // const handleDocumentUpload = (e) => {
  //   const files = Array.from(e.target.files);
  //   setFormData((prev) => ({
  //     ...prev,
  //     documents: [...(prev.documents || []), ...files],
  //   }));
  // };

  // const removeDocument = (index) => {
  //   setFormData((prev) => ({
  //     ...prev,
  //     documents: prev.documents.filter((_, i) => i !== index),
  //   }));
  // };

  const inputFocusVariants = {
    focus: {
      scale: 1.02,
      boxShadow: `0 0 20px ${CAMEROON_COLORS.green}40`,
      transition: { duration: 0.2 },
    },
    blur: {
      scale: 1,
      boxShadow: "0 0 0px rgba(0,0,0,0)",
      transition: { duration: 0.2 },
    },
  };

  const handleSpecificDocumentUpload = (userType, documentType, file) => {
    if (!file) return;

    // Valider le fichier
    const maxSize = 10 * 1024 * 1024; // 10MB
    const allowedTypes = [
      "application/pdf",
      "image/jpeg",
      "image/png",
      "image/jpg",
    ];

    if (file.size > maxSize) {
      alert("Fichier trop volumineux. Maximum 10MB.");
      return;
    }

    if (!allowedTypes.includes(file.mimetype)) {
      alert("Type de fichier non autorisé. Utilisez PDF, JPG ou PNG.");
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [`${userType}_documents`]: {
        ...prev[`${userType}_documents`],
        [documentType]: file,
      },
    }));

    // Supprimer l'erreur pour ce champ
    setFormState((prev) => ({
      ...prev,
      errors: {
        ...prev.errors,
        [documentType]: undefined,
        [`${userType}_${documentType}`]: undefined,
      },
    }));
  };

  const removeSpecificDocument = (userType, documentType) => {
    setFormData((prev) => ({
      ...prev,
      [`${userType}_documents`]: {
        ...prev[`${userType}_documents`],
        [documentType]: null,
      },
    }));
  };

  return (
    <div
      className={`min-h-screen relative overflow-hidden transition-all duration-500 ${
        uiState.darkMode
          ? "bg-gradient-to-br from-gray-900 via-gray-800 to-emerald-900 text-white"
          : "bg-gradient-to-br from-emerald-50 via-yellow-50 to-red-50 text-gray-900"
      }`}
    >
      {/* Enhanced Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Primary gradient orbs */}
        <motion.div
          className="absolute top-20 left-10 w-96 h-96 rounded-full bg-gradient-to-r from-emerald-500/20 to-yellow-500/20 blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
            x: [0, 50, 0],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute top-40 right-20 w-80 h-80 rounded-full bg-gradient-to-r from-yellow-500/20 to-red-500/20 blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [360, 180, 0],
            x: [0, -40, 0],
            y: [0, 40, 0],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-20 left-20 w-72 h-72 rounded-full bg-gradient-to-r from-red-500/20 to-emerald-500/20 blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            x: [0, 60, 0],
            y: [0, -50, 0],
          }}
          transition={{
            duration: 22,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Enhanced floating particles */}
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute rounded-full bg-gradient-to-r from-emerald-400 to-yellow-400 opacity-30"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
            }}
            animate={{
              y: [0, -100, 0],
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
              rotate: [0, 360, 0],
            }}
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              delay: particle.delay,
              ease: "easeInOut",
            }}
          />
        ))}

        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%2310B981%22%20fill-opacity%3D%220.03%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')] opacity-40" />
      </div>

      {/* Enhanced Navigation */}
      <motion.header
        className={`fixed w-full z-50 transition-all duration-500 backdrop-blur-xl ${
          uiState.isScrolled ? "py-2 shadow-2xl bg-opacity-90" : "py-4"
        } ${
          uiState.darkMode
            ? "bg-gray-900/90 shadow-emerald-500/10 border-b border-gray-700"
            : "bg-white/90 shadow-emerald-500/10 border-b border-gray-200"
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div className="container mx-auto px-4 flex justify-between items-center">
          {/* Enhanced Logo */}
          <motion.div
            onClick={handleLogoClick}
            className="flex items-center space-x-2 cursor-pointer group"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.div
              className="relative"
              variants={floatingVariants}
              animate="animate"
            >
              <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 via-yellow-500 to-red-500 rounded-xl flex items-center justify-center shadow-lg">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <motion.div
                className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [1, 0.7, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                }}
              />
            </motion.div>
            <span className="text-2xl font-bold bg-gradient-to-r from-emerald-600 via-yellow-600 to-red-600 bg-clip-text text-transparent">
              EatFast
            </span>
          </motion.div>

          {/* Navigation Controls */}
          <div className="flex items-center space-x-3">
            {/* Language Toggle */}
            <motion.button
              onClick={toggleLanguage}
              className={`p-3 rounded-xl transition-all duration-300 ${
                uiState.darkMode
                  ? "hover:bg-gray-700 bg-gray-800 shadow-lg"
                  : "hover:bg-gray-100 bg-white shadow-lg"
              }`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Globe size={20} className="text-emerald-600" />
            </motion.button>

            {/* Dark Mode Toggle */}
            <motion.button
              onClick={toggleDarkMode}
              className={`p-3 rounded-xl transition-all duration-300 ${
                uiState.darkMode
                  ? "hover:bg-gray-700 bg-gray-800 shadow-lg"
                  : "hover:bg-gray-100 bg-white shadow-lg"
              }`}
              whileHover={{ scale: 1.1, rotate: 180 }}
              whileTap={{ scale: 0.9 }}
            >
              <AnimatePresence mode="wait">
                {uiState.darkMode ? (
                  <motion.div
                    key="sun"
                    initial={{ rotate: -180, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 180, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Sun size={20} className="text-yellow-500" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="moon"
                    initial={{ rotate: -180, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 180, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Moon size={20} className="text-blue-600" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>

            {/* Login Link */}
            <motion.button
              onClick={() => (window.location.href = "/login")}
              className={`p-3 rounded-xl transition-all duration-300 ${
                uiState.darkMode
                  ? "hover:bg-gray-700 bg-gray-800 shadow-lg"
                  : "hover:bg-gray-100 bg-white shadow-lg"
              }`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <User size={20} className="text-emerald-600" />
            </motion.button>

            {/* Shopping Bag */}
            <motion.button
              className={`relative p-3 rounded-xl transition-all duration-300 ${
                uiState.darkMode
                  ? "hover:bg-gray-700 bg-gray-800 shadow-lg"
                  : "hover:bg-gray-100 bg-white shadow-lg"
              }`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <ShoppingBag size={20} className="text-yellow-600" />
              <motion.span
                className="absolute -top-2 -right-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold shadow-lg"
                animate={{
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                }}
              >
                0
              </motion.span>
            </motion.button>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <div className="pt-32 pb-16 relative z-10">
        <div className="container mx-auto px-4">
          <motion.div
            className="flex flex-col lg:flex-row items-center justify-center min-h-[calc(100vh-12rem)] gap-12"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            {/* Enhanced Welcome Section */}
            <motion.div
              className="hidden lg:block flex-1 max-w-lg"
              variants={itemVariants}
            >
              <motion.div
                className="text-center space-y-8"
                variants={floatingVariants}
                animate="animate"
                style={{
                  transform: `perspective(1000px) rotateY(${
                    uiState.mousePosition.x * 2
                  }deg) rotateX(${uiState.mousePosition.y * -2}deg)`,
                }}
              >
                {/* Hero Icon */}
                <motion.div
                  className="relative mx-auto w-32 h-32 mb-8"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 via-yellow-500 to-red-500 rounded-3xl blur-lg opacity-50" />
                  <div className="relative bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-6 h-full flex items-center justify-center">
                    <motion.div
                      animate={{ rotate: [0, 360] }}
                      transition={{
                        duration: 20,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    >
                      <UserPlus size={48} className="text-emerald-600" />
                    </motion.div>
                  </div>
                </motion.div>

                {/* Welcome Text */}
                <motion.h2
                  className="text-4xl font-bold bg-gradient-to-r from-emerald-600 via-yellow-600 to-red-600 bg-clip-text text-transparent"
                  variants={itemVariants}
                >
                  {t.welcomeTitle}
                </motion.h2>

                <motion.p
                  className={`text-lg leading-relaxed ${
                    uiState.darkMode ? "text-gray-300" : "text-gray-600"
                  }`}
                  variants={itemVariants}
                >
                  {t.welcomeSubtitle}
                </motion.p>

                {/* Features Grid */}
                <motion.div
                  className="grid grid-cols-2 gap-4 mb-8"
                  variants={containerVariants}
                >
                  {FEATURES_DATA.map((feature, index) => (
                    <motion.div
                      key={feature.key}
                      variants={itemVariants}
                      className={`p-4 rounded-xl ${
                        uiState.darkMode ? "bg-gray-800/50" : "bg-white/50"
                      } backdrop-blur-sm border ${
                        uiState.darkMode ? "border-gray-700" : "border-gray-200"
                      } hover:shadow-lg transition-all duration-300`}
                      whileHover={{ scale: 1.05, y: -5 }}
                    >
                      <feature.icon
                        size={24}
                        className={`${feature.color} mb-2 mx-auto`}
                      />
                      <p className="text-sm font-medium">
                        {t.features[feature.key]}
                      </p>
                    </motion.div>
                  ))}
                </motion.div>

                {/* Benefits */}
                <motion.div className="space-y-3" variants={containerVariants}>
                  {BENEFITS_DATA.map((benefit, index) => (
                    <motion.div
                      key={benefit.key}
                      variants={itemVariants}
                      className={`flex items-center p-3 rounded-lg ${
                        uiState.darkMode ? "bg-gray-800/30" : "bg-white/30"
                      } backdrop-blur-sm border ${
                        uiState.darkMode
                          ? "border-gray-700/50"
                          : "border-gray-200/50"
                      }`}
                      whileHover={{ scale: 1.02, x: 5 }}
                    >
                      <benefit.icon
                        size={20}
                        className={`mr-3 text-${benefit.color}-500`}
                      />
                      <span className="text-sm font-medium">
                        {t.benefits[benefit.key]}
                      </span>
                    </motion.div>
                  ))}
                </motion.div>

                {/* Animated Stars */}
                <motion.div
                  className="flex justify-center space-x-2"
                  variants={itemVariants}
                >
                  {[...Array(5)].map((_, i) => (
                    <motion.div
                      key={i}
                      animate={{
                        rotate: [0, 360],
                        scale: [1, 1.2, 1],
                      }}
                      transition={{
                        duration: 3,
                        delay: i * 0.2,
                        repeat: Infinity,
                        repeatDelay: 2,
                      }}
                    >
                      <Star
                        size={24}
                        className="text-yellow-500 fill-current"
                      />
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>
            </motion.div>

            {/* Enhanced Register Form */}
            <motion.div
              className="w-full max-w-md relative"
              variants={itemVariants}
            >
              {/* 3D Card Effect Background */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-emerald-500 via-yellow-500 to-red-500 rounded-3xl blur-xl opacity-20"
                animate={{
                  scale: [1, 1.05, 1],
                  rotate: [0, 1, -1, 0],
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />

              <motion.div
                className={`relative p-8 rounded-3xl shadow-2xl backdrop-blur-xl border ${
                  uiState.darkMode
                    ? "bg-gray-800/90 border-gray-700/50"
                    : "bg-white/90 border-white/50"
                } transform-gpu`}
                style={{
                  transformStyle: "preserve-3d",
                  transform: `perspective(1000px) rotateY(${
                    uiState.mousePosition.x * -1
                  }deg) rotateX(${uiState.mousePosition.y * 1}deg)`,
                }}
                whileHover={{
                  scale: 1.02,
                  transition: { duration: 0.3 },
                }}
              >
                {/* Header */}
                <motion.div
                  className="text-center mb-8"
                  variants={itemVariants}
                >
                  <motion.div
                    className="inline-flex items-center space-x-2 mb-4"
                    whileHover={{ scale: 1.05 }}
                  >
                    <Shield className="w-8 h-8 text-emerald-600" />
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 via-yellow-600 to-red-600 bg-clip-text text-transparent">
                      {t.title}
                    </h1>
                  </motion.div>
                  <p
                    className={`${
                      uiState.darkMode ? "text-gray-300" : "text-gray-600"
                    }`}
                  >
                    {t.subtitle}
                  </p>
                </motion.div>

                {/* Status Messages */}
                <AnimatePresence>
                  {formState.success && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="mb-6 p-4 bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 rounded-xl flex items-center"
                    >
                      <CheckCircle size={20} className="mr-3 flex-shrink-0" />
                      <span className="font-medium text-sm">{t.success}</span>
                    </motion.div>
                  )}

                  {formState.apiError && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="mb-6 p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-200 rounded-xl flex items-center"
                    >
                      <AlertCircle size={20} className="mr-3 flex-shrink-0" />
                      <span className="font-medium text-sm">
                        {formState.apiError}
                      </span>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Registration Form */}
                <div className="space-y-6">
                  {/* Name inputs */}
                  <motion.div
                    className="grid grid-cols-2 gap-4"
                    variants={itemVariants}
                  >
                    {/* First Name */}
                    <div>
                      <label
                        className={`block text-sm font-semibold mb-2 ${
                          uiState.darkMode ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        {t.first_name}
                      </label>
                      <motion.div
                        className="relative"
                        variants={inputFocusVariants}
                        animate={
                          uiState.focusedField === "first_name"
                            ? "focus"
                            : "blur"
                        }
                      >
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <User
                            size={18}
                            className={`${
                              uiState.focusedField === "first_name"
                                ? "text-emerald-500"
                                : uiState.darkMode
                                ? "text-gray-400"
                                : "text-gray-500"
                            } transition-colors`}
                          />
                        </div>
                        <input
                          type="text"
                          name="first_name"
                          value={formData.first_name}
                          onChange={handleChange}
                          onFocus={() => handleFocus("first_name")}
                          onBlur={handleBlur}
                          className={`block w-full pl-12 pr-4 py-4 border-0 rounded-2xl focus:ring-2 focus:outline-none transition-all duration-300 ${
                            uiState.darkMode
                              ? "bg-gray-700/50 text-white focus:ring-emerald-500 placeholder-gray-400"
                              : "bg-gray-50/50 text-gray-900 focus:ring-emerald-500 placeholder-gray-500"
                          } ${
                            formState.errors.first_name
                              ? "ring-2 ring-red-500"
                              : ""
                          }`}
                          placeholder={t.firstNamePlaceholder}
                          disabled={formState.isLoading}
                          required
                        />
                        {formState.errors.first_name && (
                          <motion.p
                            className="text-red-500 text-xs mt-1 flex items-center"
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                          >
                            <AlertCircle size={12} className="mr-1" />
                            {formState.errors.first_name}
                          </motion.p>
                        )}
                      </motion.div>
                    </div>

                    {/* Last Name */}
                    <div>
                      <label
                        className={`block text-sm font-semibold mb-2 ${
                          uiState.darkMode ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        {t.last_name}
                      </label>
                      <motion.div
                        className="relative"
                        variants={inputFocusVariants}
                        animate={
                          uiState.focusedField === "last_name"
                            ? "focus"
                            : "blur"
                        }
                      >
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <User
                            size={18}
                            className={`${
                              uiState.focusedField === "last_name"
                                ? "text-emerald-500"
                                : uiState.darkMode
                                ? "text-gray-400"
                                : "text-gray-500"
                            } transition-colors`}
                          />
                        </div>
                        <input
                          type="text"
                          name="last_name"
                          value={formData.last_name}
                          onChange={handleChange}
                          onFocus={() => handleFocus("last_name")}
                          onBlur={handleBlur}
                          className={`block w-full pl-12 pr-4 py-4 border-0 rounded-2xl focus:ring-2 focus:outline-none transition-all duration-300 ${
                            uiState.darkMode
                              ? "bg-gray-700/50 text-white focus:ring-emerald-500 placeholder-gray-400"
                              : "bg-gray-50/50 text-gray-900 focus:ring-emerald-500 placeholder-gray-500"
                          } ${
                            formState.errors.last_name
                              ? "ring-2 ring-red-500"
                              : ""
                          }`}
                          placeholder={t.lastNamePlaceholder}
                          disabled={formState.isLoading}
                          required
                        />
                        {formState.errors.last_name && (
                          <motion.p
                            className="text-red-500 text-xs mt-1 flex items-center"
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                          >
                            <AlertCircle size={12} className="mr-1" />
                            {formState.errors.last_name}
                          </motion.p>
                        )}
                      </motion.div>
                    </div>
                  </motion.div>

                  {/* Email input */}
                  <motion.div variants={itemVariants}>
                    <label
                      className={`block text-sm font-semibold mb-2 ${
                        uiState.darkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      {t.email}
                    </label>
                    <motion.div
                      className="relative"
                      variants={inputFocusVariants}
                      animate={
                        uiState.focusedField === "email" ? "focus" : "blur"
                      }
                    >
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Mail
                          size={18}
                          className={`${
                            uiState.focusedField === "email"
                              ? "text-emerald-500"
                              : uiState.darkMode
                              ? "text-gray-400"
                              : "text-gray-500"
                          } transition-colors`}
                        />
                      </div>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        onFocus={() => handleFocus("email")}
                        onBlur={handleBlur}
                        className={`block w-full pl-12 pr-4 py-4 border-0 rounded-2xl focus:ring-2 focus:outline-none transition-all duration-300 ${
                          uiState.darkMode
                            ? "bg-gray-700/50 text-white focus:ring-emerald-500 placeholder-gray-400"
                            : "bg-gray-50/50 text-gray-900 focus:ring-emerald-500 placeholder-gray-500"
                        } ${
                          formState.errors.email ? "ring-2 ring-red-500" : ""
                        }`}
                        placeholder={t.emailPlaceholder}
                        disabled={formState.isLoading}
                        required
                      />
                      {formState.errors.email && (
                        <motion.p
                          className="text-red-500 text-xs mt-1 flex items-center"
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                        >
                          <AlertCircle size={12} className="mr-1" />
                          {formState.errors.email}
                        </motion.p>
                      )}
                    </motion.div>
                  </motion.div>

                  {/* Phone input */}
                  <motion.div variants={itemVariants}>
                    <label
                      className={`block text-sm font-semibold mb-2 ${
                        uiState.darkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      {t.phone_number}
                    </label>
                    <motion.div
                      className="relative"
                      variants={inputFocusVariants}
                      animate={
                        uiState.focusedField === "phone_number"
                          ? "focus"
                          : "blur"
                      }
                    >
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Phone
                          size={18}
                          className={`${
                            uiState.focusedField === "phone_number"
                              ? "text-emerald-500"
                              : uiState.darkMode
                              ? "text-gray-400"
                              : "text-gray-500"
                          } transition-colors`}
                        />
                      </div>
                      <input
                        type="tel"
                        name="phone_number"
                        value={formData.phone_number}
                        onChange={handleChange}
                        onFocus={() => handleFocus("phone_number")}
                        onBlur={handleBlur}
                        className={`block w-full pl-12 pr-4 py-4 border-0 rounded-2xl focus:ring-2 focus:outline-none transition-all duration-300 ${
                          uiState.darkMode
                            ? "bg-gray-700/50 text-white focus:ring-emerald-500 placeholder-gray-400"
                            : "bg-gray-50/50 text-gray-900 focus:ring-emerald-500 placeholder-gray-500"
                        } ${
                          formState.errors.phone_number
                            ? "ring-2 ring-red-500"
                            : ""
                        }`}
                        placeholder={t.phonePlaceholder}
                        disabled={formState.isLoading}
                        required
                      />
                      {formState.errors.phone_number && (
                        <motion.p
                          className="text-red-500 text-xs mt-1 flex items-center"
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                        >
                          <AlertCircle size={12} className="mr-1" />
                          {formState.errors.phone_number}
                        </motion.p>
                      )}
                    </motion.div>
                  </motion.div>

                  {/* Password input */}
                  <motion.div variants={itemVariants}>
                    <label
                      className={`block text-sm font-semibold mb-2 ${
                        uiState.darkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      {t.password}
                    </label>
                    <motion.div
                      className="relative"
                      variants={inputFocusVariants}
                      animate={
                        uiState.focusedField === "password" ? "focus" : "blur"
                      }
                    >
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Lock
                          size={18}
                          className={`${
                            uiState.focusedField === "password"
                              ? "text-emerald-500"
                              : uiState.darkMode
                              ? "text-gray-400"
                              : "text-gray-500"
                          } transition-colors`}
                        />
                      </div>
                      <input
                        type={formState.showPassword ? "text" : "password"}
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        onFocus={() => handleFocus("password")}
                        onBlur={handleBlur}
                        className={`block w-full pl-12 pr-12 py-4 border-0 rounded-2xl focus:ring-2 focus:outline-none transition-all duration-300 ${
                          uiState.darkMode
                            ? "bg-gray-700/50 text-white focus:ring-emerald-500 placeholder-gray-400"
                            : "bg-gray-50/50 text-gray-900 focus:ring-emerald-500 placeholder-gray-500"
                        } ${
                          formState.errors.password ? "ring-2 ring-red-500" : ""
                        }`}
                        placeholder={t.passwordPlaceholder}
                        disabled={formState.isLoading}
                        required
                      />
                      <motion.button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-4 flex items-center"
                        onClick={() =>
                          setFormState((prev) => ({
                            ...prev,
                            showPassword: !prev.showPassword,
                          }))
                        }
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        disabled={formState.isLoading}
                      >
                        {formState.showPassword ? (
                          <EyeOff
                            size={18}
                            className={`${
                              uiState.darkMode
                                ? "text-gray-400"
                                : "text-gray-500"
                            } hover:text-emerald-500 transition-colors`}
                          />
                        ) : (
                          <Eye
                            size={18}
                            className={`${
                              uiState.darkMode
                                ? "text-gray-400"
                                : "text-gray-500"
                            } hover:text-emerald-500 transition-colors`}
                          />
                        )}
                      </motion.button>
                      {formState.errors.password && (
                        <motion.p
                          className="text-red-500 text-xs mt-1 flex items-center"
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                        >
                          <AlertCircle size={12} className="mr-1" />
                          {formState.errors.password}
                        </motion.p>
                      )}
                    </motion.div>
                  </motion.div>

                  {/* Confirm Password input */}
                  <motion.div variants={itemVariants}>
                    <label
                      className={`block text-sm font-semibold mb-2 ${
                        uiState.darkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      {t.confirmPassword}
                    </label>
                    <motion.div
                      className="relative"
                      variants={inputFocusVariants}
                      animate={
                        uiState.focusedField === "confirmPassword"
                          ? "focus"
                          : "blur"
                      }
                    >
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Lock
                          size={18}
                          className={`${
                            uiState.focusedField === "confirmPassword"
                              ? "text-emerald-500"
                              : uiState.darkMode
                              ? "text-gray-400"
                              : "text-gray-500"
                          } transition-colors`}
                        />
                      </div>
                      <input
                        type={
                          formState.showConfirmPassword ? "text" : "password"
                        }
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        onFocus={() => handleFocus("confirmPassword")}
                        onBlur={handleBlur}
                        className={`block w-full pl-12 pr-12 py-4 border-0 rounded-2xl focus:ring-2 focus:outline-none transition-all duration-300 ${
                          uiState.darkMode
                            ? "bg-gray-700/50 text-white focus:ring-emerald-500 placeholder-gray-400"
                            : "bg-gray-50/50 text-gray-900 focus:ring-emerald-500 placeholder-gray-500"
                        } ${
                          formState.errors.confirmPassword
                            ? "ring-2 ring-red-500"
                            : ""
                        }`}
                        placeholder={t.confirmPasswordPlaceholder}
                        disabled={formState.isLoading}
                        required
                      />
                      <motion.button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-4 flex items-center"
                        onClick={() =>
                          setFormState((prev) => ({
                            ...prev,
                            showConfirmPassword: !prev.showConfirmPassword,
                          }))
                        }
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        disabled={formState.isLoading}
                      >
                        {formState.showConfirmPassword ? (
                          <EyeOff
                            size={18}
                            className={`${
                              uiState.darkMode
                                ? "text-gray-400"
                                : "text-gray-500"
                            } hover:text-emerald-500 transition-colors`}
                          />
                        ) : (
                          <Eye
                            size={18}
                            className={`${
                              uiState.darkMode
                                ? "text-gray-400"
                                : "text-gray-500"
                            } hover:text-emerald-500 transition-colors`}
                          />
                        )}
                      </motion.button>
                      {formState.errors.confirmPassword && (
                        <motion.p
                          className="text-red-500 text-xs mt-1 flex items-center"
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                        >
                          <AlertCircle size={12} className="mr-1" />
                          {formState.errors.confirmPassword}
                        </motion.p>
                      )}
                    </motion.div>
                  </motion.div>

                  {/* user_type selection */}
                  <motion.div variants={itemVariants}>
                    <label
                      className={`block text-sm font-semibold mb-2 ${
                        uiState.darkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      {t.user_type}
                    </label>
                    <motion.div
                      className="relative"
                      variants={inputFocusVariants}
                      animate={
                        uiState.focusedField === "user_type" ? "focus" : "blur"
                      }
                    >
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <UserPlus
                          size={18}
                          className={`${
                            uiState.focusedField === "user_type"
                              ? "text-emerald-500"
                              : uiState.darkMode
                              ? "text-gray-400"
                              : "text-gray-500"
                          } transition-colors`}
                        />
                      </div>
                      <select
                        name="user_type"
                        value={formData.user_type}
                        onChange={handleChange}
                        onFocus={() => handleFocus("user_type")}
                        onBlur={handleBlur}
                        className={`block w-full pl-12 pr-4 py-4 border-0 rounded-2xl focus:ring-2 focus:outline-none transition-all duration-300 appearance-none ${
                          uiState.darkMode
                            ? "bg-gray-700/50 text-white focus:ring-emerald-500 placeholder-gray-400"
                            : "bg-gray-50/50 text-gray-900 focus:ring-emerald-500 placeholder-gray-500"
                        } ${
                          formState.errors.user_type
                            ? "ring-2 ring-red-500"
                            : ""
                        }`}
                        disabled={formState.isLoading}
                        required
                      >
                        <option value="">{t.selectuser_typePlaceholder}</option>
                        <option value="client">{t.user_typeCustomer}</option>
                        <option value="delivery">{t.user_typeDelivery}</option>
                        <option value="restaurant_manager">
                          {t.user_typeRestaurantManager}
                        </option>
                      </select>
                      {formState.errors.user_type && (
                        <motion.p
                          className="text-red-500 text-xs mt-1 flex items-center"
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                        >
                          <AlertCircle size={12} className="mr-1" />
                          {formState.errors.user_type}
                        </motion.p>
                      )}
                    </motion.div>
                  </motion.div>

                  {/* Conditional document upload based on user_type */}

                  {(formData.user_type === "delivery" ||
                    formData.user_type === "restaurant_manager") && (
                    <motion.div
                      variants={itemVariants}
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="mb-4">
                        <label
                          className={`block text-sm font-medium mb-2 ${
                            uiState.darkMode ? "text-gray-400" : "text-gray-600"
                          }`}
                        >
                          {translations.fr.city}
                          {formData.user_type === "delivery"
                            ? " de livraison"
                            : " du restaurant"}
                        </label>
                        <input
                          type="text"
                          value={formData.city || ""}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              city: e.target.value,
                            })
                          }
                          className={`w-full px-3 py-2 rounded-lg border ${
                            uiState.darkMode
                              ? "bg-gray-700 border-gray-600 text-white"
                              : "bg-white border-gray-300"
                          } ${formState.errors.city ? "border-red-500" : ""}`}
                          placeholder="Dans quelle ville allez-vous livrer ?"
                        />
                        {formState.errors.city && (
                          <p className="text-red-500 text-xs mt-1 flex items-center">
                            <AlertCircle size={12} className="mr-1" />
                            {formState.errors.city}
                          </p>
                        )}
                      </div>

                      {/* Adresse du livreur ou Restaurant */}
                      <div className="mb-4">
                        <label
                          className={`block text-sm font-medium mb-2 ${
                            uiState.darkMode ? "text-gray-400" : "text-gray-600"
                          }`}
                        >
                          {translations.fr.address}
                          {formData.user_type === "delivery"
                            ? " Livreur"
                            : " Restaurant"}
                        </label>
                        <input
                          type="text"
                          value={formData.address || ""}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              address: e.target.value,
                            })
                          }
                          className={`w-full px-3 py-2 rounded-lg border ${
                            uiState.darkMode
                              ? "bg-gray-700 border-gray-600 text-white"
                              : "bg-white border-gray-300"
                          } ${
                            formState.errors.address ? "border-red-500" : ""
                          }`}
                          placeholder="Votre adresse complète"
                        />
                        {formState.errors.address && (
                          <p className="text-red-500 text-xs mt-1 flex items-center">
                            <AlertCircle size={12} className="mr-1" />
                            {formState.errors.address}
                          </p>
                        )}
                      </div>
                    </motion.div>
                  )}

                  {formData.user_type === "delivery" && (
                    <motion.div
                      variants={itemVariants}
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      transition={{ duration: 0.3 }}
                    >
                      {/* Type de véhicule */}
                      <div className="mb-4">
                        <label
                          className={`block text-sm font-medium mb-2 ${
                            uiState.darkMode ? "text-gray-400" : "text-gray-600"
                          }`}
                        >
                          {translations.fr.vehicle_type}
                        </label>
                        <select
                          value={formData.vehicle_type || ""}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              vehicle_type: e.target.value,
                            })
                          }
                          className={`w-full px-3 py-2 rounded-lg border ${
                            uiState.darkMode
                              ? "bg-gray-700 border-gray-600 text-white"
                              : "bg-white border-gray-300"
                          } ${
                            formState.errors.vehicle_type
                              ? "border-red-500"
                              : ""
                          }`}
                        >
                          <option value="">Sélectionnez votre véhicule</option>
                          <option value="motorcycle">
                            {translations.fr.vehicle_motor}
                          </option>
                          <option value="scooter">
                            {translations.fr.vehicle_scooter}
                          </option>
                          <option value="bicycle">
                            {translations.fr.vehicle_bicycle}
                          </option>
                          <option value="car">
                            {translations.fr.vehicle_car}
                          </option>
                        </select>
                        {formState.errors.vehicle_type && (
                          <p className="text-red-500 text-xs mt-1 flex items-center">
                            <AlertCircle size={12} className="mr-1" />
                            {formState.errors.vehicle_type}
                          </p>
                        )}
                      </div>
                      <label
                        className={`block text-sm font-semibold mb-4 ${
                          uiState.darkMode ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        Documents requis pour livreur
                      </label>

                      {/* Pièce d'identité - OBLIGATOIRE */}
                      <div className="mb-4">
                        <label
                          className={`block text-sm font-medium mb-2 ${
                            uiState.darkMode ? "text-gray-400" : "text-gray-600"
                          }`}
                        >
                          Pièce d'identité (CNI ou Passeport) *
                        </label>
                        <motion.div
                          className={`border-2 border-dashed rounded-xl p-4 text-center ${
                            uiState.darkMode
                              ? "border-gray-600 bg-gray-700/30 hover:border-emerald-500"
                              : "border-gray-300 bg-gray-50/50 hover:border-emerald-500"
                          } transition-colors ${
                            formState.errors.id_document ? "border-red-500" : ""
                          }`}
                          whileHover={{ scale: 1.005 }}
                        >
                          <input
                            type="file"
                            id="delivery-id-document"
                            className="hidden"
                            onChange={(e) =>
                              handleSpecificDocumentUpload(
                                "delivery",
                                "id_document",
                                e.target.files[0]
                              )
                            }
                            accept=".pdf,.jpg,.jpeg,.png"
                          />
                          <label
                            htmlFor="delivery-id-document"
                            className="cursor-pointer"
                          >
                            {formData.delivery_documents.id_document ? (
                              <div className="flex items-center justify-between">
                                <span className="text-green-600 font-medium">
                                  ✓{" "}
                                  {formData.delivery_documents.id_document.name}
                                </span>
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    removeSpecificDocument(
                                      "delivery",
                                      "id_document"
                                    );
                                  }}
                                  className="text-red-500 hover:text-red-600"
                                >
                                  ✗
                                </button>
                              </div>
                            ) : (
                              <div className="flex flex-col items-center space-y-2">
                                <Upload
                                  size={24}
                                  className={
                                    uiState.darkMode
                                      ? "text-gray-400"
                                      : "text-gray-500"
                                  }
                                />
                                <p
                                  className={`text-sm ${
                                    uiState.darkMode
                                      ? "text-gray-300"
                                      : "text-gray-600"
                                  }`}
                                >
                                  Cliquez pour ajouter votre pièce d'identité
                                </p>
                                <p
                                  className={`text-xs ${
                                    uiState.darkMode
                                      ? "text-gray-400"
                                      : "text-gray-500"
                                  }`}
                                >
                                  PDF, JPG, PNG (max 10MB)
                                </p>
                              </div>
                            )}
                          </label>
                        </motion.div>
                        {formState.errors.id_document && (
                          <p className="text-red-500 text-xs mt-1 flex items-center">
                            <AlertCircle size={12} className="mr-1" />
                            {formState.errors.id_document}
                          </p>
                        )}
                      </div>

                      {/* Permis de conduire - OBLIGATOIRE */}
                      <div className="mb-4">
                        <label
                          className={`block text-sm font-medium mb-2 ${
                            uiState.darkMode ? "text-gray-400" : "text-gray-600"
                          }`}
                        >
                          Permis de conduire *
                        </label>
                        <motion.div
                          className={`border-2 border-dashed rounded-xl p-4 text-center ${
                            uiState.darkMode
                              ? "border-gray-600 bg-gray-700/30 hover:border-emerald-500"
                              : "border-gray-300 bg-gray-50/50 hover:border-emerald-500"
                          } transition-colors ${
                            formState.errors.driving_license
                              ? "border-red-500"
                              : ""
                          }`}
                          whileHover={{ scale: 1.005 }}
                        >
                          <input
                            type="file"
                            id="delivery-driving-license"
                            className="hidden"
                            onChange={(e) =>
                              handleSpecificDocumentUpload(
                                "delivery",
                                "driving_license",
                                e.target.files[0]
                              )
                            }
                            accept=".pdf,.jpg,.jpeg,.png"
                          />
                          <label
                            htmlFor="delivery-driving-license"
                            className="cursor-pointer"
                          >
                            {formData.delivery_documents.driving_license ? (
                              <div className="flex items-center justify-between">
                                <span className="text-green-600 font-medium">
                                  ✓{" "}
                                  {
                                    formData.delivery_documents.driving_license
                                      .name
                                  }
                                </span>
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    removeSpecificDocument(
                                      "delivery",
                                      "driving_license"
                                    );
                                  }}
                                  className="text-red-500 hover:text-red-600"
                                >
                                  ✗
                                </button>
                              </div>
                            ) : (
                              <div className="flex flex-col items-center space-y-2">
                                <Upload
                                  size={24}
                                  className={
                                    uiState.darkMode
                                      ? "text-gray-400"
                                      : "text-gray-500"
                                  }
                                />
                                <p
                                  className={`text-sm ${
                                    uiState.darkMode
                                      ? "text-gray-300"
                                      : "text-gray-600"
                                  }`}
                                >
                                  Cliquez pour ajouter votre permis de conduire
                                </p>
                                <p
                                  className={`text-xs ${
                                    uiState.darkMode
                                      ? "text-gray-400"
                                      : "text-gray-500"
                                  }`}
                                >
                                  PDF, JPG, PNG (max 10MB)
                                </p>
                              </div>
                            )}
                          </label>
                        </motion.div>
                        {formState.errors.driving_license && (
                          <p className="text-red-500 text-xs mt-1 flex items-center">
                            <AlertCircle size={12} className="mr-1" />
                            {formState.errors.driving_license}
                          </p>
                        )}
                      </div>

                      {/* Assurance véhicule - OPTIONNEL */}
                      <div className="mb-4">
                        <label
                          className={`block text-sm font-medium mb-2 ${
                            uiState.darkMode ? "text-gray-400" : "text-gray-600"
                          }`}
                        >
                          Assurance véhicule (optionnel)
                        </label>
                        <motion.div
                          className={`border-2 border-dashed rounded-xl p-4 text-center ${
                            uiState.darkMode
                              ? "border-gray-600 bg-gray-700/30 hover:border-emerald-500"
                              : "border-gray-300 bg-gray-50/50 hover:border-emerald-500"
                          } transition-colors`}
                          whileHover={{ scale: 1.005 }}
                        >
                          <input
                            type="file"
                            id="delivery-insurance"
                            className="hidden"
                            onChange={(e) =>
                              handleSpecificDocumentUpload(
                                "delivery",
                                "insurance",
                                e.target.files[0]
                              )
                            }
                            accept=".pdf,.jpg,.jpeg,.png"
                          />
                          <label
                            htmlFor="delivery-insurance"
                            className="cursor-pointer"
                          >
                            {formData.delivery_documents.insurance ? (
                              <div className="flex items-center justify-between">
                                <span className="text-green-600 font-medium">
                                  ✓ {formData.delivery_documents.insurance.name}
                                </span>
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    removeSpecificDocument(
                                      "delivery",
                                      "insurance"
                                    );
                                  }}
                                  className="text-red-500 hover:text-red-600"
                                >
                                  ✗
                                </button>
                              </div>
                            ) : (
                              <div className="flex flex-col items-center space-y-2">
                                <Upload
                                  size={24}
                                  className={
                                    uiState.darkMode
                                      ? "text-gray-400"
                                      : "text-gray-500"
                                  }
                                />
                                <p
                                  className={`text-sm ${
                                    uiState.darkMode
                                      ? "text-gray-300"
                                      : "text-gray-600"
                                  }`}
                                >
                                  Cliquez pour ajouter votre assurance
                                  (recommandé)
                                </p>
                              </div>
                            )}
                          </label>
                        </motion.div>
                      </div>
                    </motion.div>
                  )}

                  {formData.user_type === "restaurant_manager" && (
                    <motion.div
                      variants={itemVariants}
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      transition={{ duration: 0.3 }}
                    >
                      <label
                        className={`block text-sm font-semibold mb-4 ${
                          uiState.darkMode ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        Documents requis pour gérant de restaurant
                      </label>

                      {/* Pièce d'identité - OBLIGATOIRE */}
                      <div className="mb-4">
                        <label
                          className={`block text-sm font-medium mb-2 ${
                            uiState.darkMode ? "text-gray-400" : "text-gray-600"
                          }`}
                        >
                          Pièce d'identité du gérant *
                        </label>
                        <motion.div
                          className={`border-2 border-dashed rounded-xl p-4 text-center ${
                            uiState.darkMode
                              ? "border-gray-600 bg-gray-700/30 hover:border-emerald-500"
                              : "border-gray-300 bg-gray-50/50 hover:border-emerald-500"
                          } transition-colors ${
                            formState.errors.restaurant_id_document
                              ? "border-red-500"
                              : ""
                          }`}
                          whileHover={{ scale: 1.005 }}
                        >
                          <input
                            type="file"
                            id="restaurant-id-document"
                            className="hidden"
                            onChange={(e) =>
                              handleSpecificDocumentUpload(
                                "restaurant",
                                "id_document",
                                e.target.files[0]
                              )
                            }
                            accept=".pdf,.jpg,.jpeg,.png"
                          />
                          <label
                            htmlFor="restaurant-id-document"
                            className="cursor-pointer"
                          >
                            {formData.restaurant_documents.id_document ? (
                              <div className="flex items-center justify-between">
                                <span className="text-green-600 font-medium">
                                  ✓{" "}
                                  {
                                    formData.restaurant_documents.id_document
                                      .name
                                  }
                                </span>
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    removeSpecificDocument(
                                      "restaurant",
                                      "id_document"
                                    );
                                  }}
                                  className="text-red-500 hover:text-red-600"
                                >
                                  ✗
                                </button>
                              </div>
                            ) : (
                              <div className="flex flex-col items-center space-y-2">
                                <Upload
                                  size={24}
                                  className={
                                    uiState.darkMode
                                      ? "text-gray-400"
                                      : "text-gray-500"
                                  }
                                />
                                <p
                                  className={`text-sm ${
                                    uiState.darkMode
                                      ? "text-gray-300"
                                      : "text-gray-600"
                                  }`}
                                >
                                  Pièce d'identité du gérant
                                </p>
                              </div>
                            )}
                          </label>
                        </motion.div>
                      </div>

                      {/* Licence commerciale - OBLIGATOIRE */}
                      <div className="mb-4">
                        <label
                          className={`block text-sm font-medium mb-2 ${
                            uiState.darkMode ? "text-gray-400" : "text-gray-600"
                          }`}
                        >
                          Licence commerciale ou Registre du commerce *
                        </label>
                        <motion.div
                          className={`border-2 border-dashed rounded-xl p-4 text-center ${
                            uiState.darkMode
                              ? "border-gray-600 bg-gray-700/30 hover:border-emerald-500"
                              : "border-gray-300 bg-gray-50/50 hover:border-emerald-500"
                          } transition-colors ${
                            formState.errors.business_license
                              ? "border-red-500"
                              : ""
                          }`}
                          whileHover={{ scale: 1.005 }}
                        >
                          <input
                            type="file"
                            id="restaurant-business-license"
                            className="hidden"
                            onChange={(e) =>
                              handleSpecificDocumentUpload(
                                "restaurant",
                                "business_license",
                                e.target.files[0]
                              )
                            }
                            accept=".pdf,.jpg,.jpeg,.png"
                          />
                          <label
                            htmlFor="restaurant-business-license"
                            className="cursor-pointer"
                          >
                            {formData.restaurant_documents.business_license ? (
                              <div className="flex items-center justify-between">
                                <span className="text-green-600 font-medium">
                                  ✓{" "}
                                  {
                                    formData.restaurant_documents
                                      .business_license.name
                                  }
                                </span>
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    removeSpecificDocument(
                                      "restaurant",
                                      "business_license"
                                    );
                                  }}
                                  className="text-red-500 hover:text-red-600"
                                >
                                  ✗
                                </button>
                              </div>
                            ) : (
                              <div className="flex flex-col items-center space-y-2">
                                <Upload
                                  size={24}
                                  className={
                                    uiState.darkMode
                                      ? "text-gray-400"
                                      : "text-gray-500"
                                  }
                                />
                                <p
                                  className={`text-sm ${
                                    uiState.darkMode
                                      ? "text-gray-300"
                                      : "text-gray-600"
                                  }`}
                                >
                                  Licence commerciale du restaurant
                                </p>
                              </div>
                            )}
                          </label>
                        </motion.div>
                      </div>

                      {/* Certificat sanitaire - OBLIGATOIRE */}
                      <div className="mb-4">
                        <label
                          className={`block text-sm font-medium mb-2 ${
                            uiState.darkMode ? "text-gray-400" : "text-gray-600"
                          }`}
                        >
                          Certificat sanitaire ou autorisation d'hygiène *
                        </label>
                        <motion.div
                          className={`border-2 border-dashed rounded-xl p-4 text-center ${
                            uiState.darkMode
                              ? "border-gray-600 bg-gray-700/30 hover:border-emerald-500"
                              : "border-gray-300 bg-gray-50/50 hover:border-emerald-500"
                          } transition-colors ${
                            formState.errors.health_certificate
                              ? "border-red-500"
                              : ""
                          }`}
                          whileHover={{ scale: 1.005 }}
                        >
                          <input
                            type="file"
                            id="restaurant-health-certificate"
                            className="hidden"
                            onChange={(e) =>
                              handleSpecificDocumentUpload(
                                "restaurant",
                                "health_certificate",
                                e.target.files[0]
                              )
                            }
                            accept=".pdf,.jpg,.jpeg,.png"
                          />
                          <label
                            htmlFor="restaurant-health-certificate"
                            className="cursor-pointer"
                          >
                            {formData.restaurant_documents
                              .health_certificate ? (
                              <div className="flex items-center justify-between">
                                <span className="text-green-600 font-medium">
                                  ✓{" "}
                                  {
                                    formData.restaurant_documents
                                      .health_certificate.name
                                  }
                                </span>
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    removeSpecificDocument(
                                      "restaurant",
                                      "health_certificate"
                                    );
                                  }}
                                  className="text-red-500 hover:text-red-600"
                                >
                                  ✗
                                </button>
                              </div>
                            ) : (
                              <div className="flex flex-col items-center space-y-2">
                                <Upload
                                  size={24}
                                  className={
                                    uiState.darkMode
                                      ? "text-gray-400"
                                      : "text-gray-500"
                                  }
                                />
                                <p
                                  className={`text-sm ${
                                    uiState.darkMode
                                      ? "text-gray-300"
                                      : "text-gray-600"
                                  }`}
                                >
                                  Certificat sanitaire du restaurant
                                </p>
                              </div>
                            )}
                          </label>
                        </motion.div>
                      </div>

                      {/* Menu - OPTIONNEL */}
                      <div className="mb-4">
                        <label
                          className={`block text-sm font-medium mb-2 ${
                            uiState.darkMode ? "text-gray-400" : "text-gray-600"
                          }`}
                        >
                          Menu du restaurant (optionnel)
                        </label>
                        <motion.div
                          className={`border-2 border-dashed rounded-xl p-4 text-center ${
                            uiState.darkMode
                              ? "border-gray-600 bg-gray-700/30 hover:border-emerald-500"
                              : "border-gray-300 bg-gray-50/50 hover:border-emerald-500"
                          } transition-colors`}
                          whileHover={{ scale: 1.005 }}
                        >
                          <input
                            type="file"
                            id="restaurant-menu"
                            className="hidden"
                            onChange={(e) =>
                              handleSpecificDocumentUpload(
                                "restaurant",
                                "menu",
                                e.target.files[0]
                              )
                            }
                            accept=".pdf,.jpg,.jpeg,.png"
                          />
                          <label
                            htmlFor="restaurant-menu"
                            className="cursor-pointer"
                          >
                            {formData.restaurant_documents.menu ? (
                              <div className="flex items-center justify-between">
                                <span className="text-green-600 font-medium">
                                  ✓ {formData.restaurant_documents.menu.name}
                                </span>
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    removeSpecificDocument(
                                      "restaurant",
                                      "menu"
                                    );
                                  }}
                                  className="text-red-500 hover:text-red-600"
                                >
                                  ✗
                                </button>
                              </div>
                            ) : (
                              <div className="flex flex-col items-center space-y-2">
                                <Upload
                                  size={24}
                                  className={
                                    uiState.darkMode
                                      ? "text-gray-400"
                                      : "text-gray-500"
                                  }
                                />
                                <p
                                  className={`text-sm ${
                                    uiState.darkMode
                                      ? "text-gray-300"
                                      : "text-gray-600"
                                  }`}
                                >
                                  Menu ou carte des plats (recommandé)
                                </p>
                              </div>
                            )}
                          </label>
                        </motion.div>
                      </div>
                    </motion.div>
                  )}

                  {/* Terms checkbox */}
                  <motion.div
                    className="flex items-start space-x-3"
                    variants={itemVariants}
                  >
                    <input
                      type="checkbox"
                      name="acceptTerms"
                      checked={formData.acceptTerms}
                      onChange={handleChange}
                      className={`w-5 h-5 rounded-md focus:ring-emerald-500 border-2 transition-all duration-200 ${
                        uiState.darkMode
                          ? "bg-gray-700 border-gray-600 text-emerald-500"
                          : "bg-gray-100 border-gray-300 text-emerald-500"
                      }`}
                      disabled={formState.isLoading}
                      required
                    />
                    <label
                      className={`text-sm leading-relaxed ${
                        uiState.darkMode ? "text-gray-300" : "text-gray-600"
                      }`}
                    >
                      {t.acceptTerms}{" "}
                      <a
                        href="/terms"
                        className="text-emerald-600 hover:text-emerald-500 font-medium underline transition-colors"
                      >
                        {t.termsLink}
                      </a>{" "}
                      et la{" "}
                      <a
                        href="/privacy"
                        className="text-emerald-600 hover:text-emerald-500 font-medium underline transition-colors"
                      >
                        {t.privacyLink}
                      </a>
                    </label>
                  </motion.div>

                  {/* Submit button */}
                  <motion.button
                    type="button"
                    onClick={handleSubmit}
                    className={`w-full py-4 px-6 rounded-2xl font-semibold text-lg transition-all duration-300 flex items-center justify-center space-x-2 ${
                      formState.isLoading
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 shadow-lg hover:shadow-emerald-500/30 transform hover:scale-105"
                    } text-white`}
                    disabled={formState.isLoading}
                    whileTap={{ scale: formState.isLoading ? 1 : 0.95 }}
                    variants={itemVariants}
                  >
                    {formState.isLoading ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{
                            duration: 1,
                            repeat: Infinity,
                            ease: "linear",
                          }}
                          className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                        />
                        <span>{t.creating}</span>
                      </>
                    ) : (
                      <>
                        <span>{t.submitButton}</span>
                        <ChevronRight size={20} />
                      </>
                    )}
                  </motion.button>
                  {/* Restaurant Input For Delivery 
                  {formData.user_type === "delivery" && (
                    <motion.div
                      variants={itemVariants}
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      transition={{ duration: 0.3 }}
                    >
                      <label
                        className={`block text-sm font-semibold mb-2 ${
                          uiState.darkMode ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        {t.restaurantAffiliation}
                      </label>
                      <motion.div
                        className="relative"
                        variants={inputFocusVariants}
                        animate={
                          uiState.focusedField === "restaurantId"
                            ? "focus"
                            : "blur"
                        }
                      >
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <Utensils
                            size={18}
                            className={`${
                              uiState.focusedField === "restaurantId"
                                ? "text-emerald-500"
                                : uiState.darkMode
                                ? "text-gray-400"
                                : "text-gray-500"
                            } transition-colors`}
                          />
                        </div>
                        <select
                          name="restaurantId"
                          value={formData.restaurantId || ""}
                          onChange={handleChange}
                          onFocus={() => handleFocus("restaurantId")}
                          onBlur={handleBlur}
                          className={`block w-full pl-12 pr-4 py-4 border-0 rounded-2xl focus:ring-2 focus:outline-none transition-all duration-300 appearance-none ${
                            uiState.darkMode
                              ? "bg-gray-700/50 text-white focus:ring-emerald-500 placeholder-gray-400"
                              : "bg-gray-50/50 text-gray-900 focus:ring-emerald-500 placeholder-gray-500"
                          } ${
                            formState.errors.restaurantId
                              ? "ring-2 ring-red-500"
                              : ""
                          }`}
                          disabled={formState.isLoading}
                          required={formData.user_type === "delivery"}
                        >
                          <option value="">
                            {t.selectRestaurantPlaceholder}
                          </option>
                          {restaurants.map((restaurant) => (
                            <option key={restaurant.id} value={restaurant.id}>
                              {restaurant.name}
                            </option>
                          ))}
                        </select>
                      </motion.div>
                    </motion.div>
                  )} */}

                  {/* Mobile Money Options */}
                  <motion.div className="mt-6" variants={itemVariants}>
                    <div className="relative mb-4">
                      <div className="absolute inset-0 flex items-center">
                        <div
                          className={`w-full border-t ${
                            uiState.darkMode
                              ? "border-gray-600"
                              : "border-gray-300"
                          }`}
                        />
                      </div>
                      <div className="relative flex justify-center text-sm">
                        <span
                          className={`px-2 ${
                            uiState.darkMode
                              ? "bg-gray-800 text-gray-400"
                              : "bg-white text-gray-500"
                          }`}
                        >
                          {t.or}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <motion.button
                        className={`flex items-center justify-center p-3 rounded-xl border transition-all duration-300 ${
                          uiState.darkMode
                            ? "bg-gray-700 hover:bg-gray-600 border-gray-600"
                            : "bg-gray-50 hover:bg-gray-100 border-gray-300"
                        }`}
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        disabled={formState.isLoading}
                      >
                        <Smartphone
                          size={20}
                          className="text-yellow-500 mr-2"
                        />
                        <span className="text-sm font-medium">MTN</span>
                      </motion.button>

                      <motion.button
                        className={`flex items-center justify-center p-3 rounded-xl border transition-all duration-300 ${
                          uiState.darkMode
                            ? "bg-gray-700 hover:bg-gray-600 border-gray-600"
                            : "bg-gray-50 hover:bg-gray-100 border-gray-300"
                        }`}
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        disabled={formState.isLoading}
                      >
                        <CreditCard
                          size={20}
                          className="text-orange-500 mr-2"
                        />
                        <span className="text-sm font-medium">Orange</span>
                      </motion.button>
                    </div>
                  </motion.div>

                  {/* Login link */}
                  <motion.div className="text-center" variants={itemVariants}>
                    <p
                      className={`text-sm ${
                        uiState.darkMode ? "text-gray-300" : "text-gray-600"
                      }`}
                    >
                      {t.alreadyHaveAccount}{" "}
                      <motion.button
                        onClick={() => (window.location.href = "/login")}
                        className="text-emerald-600 font-semibold hover:text-emerald-500 underline transition-colors"
                        whileHover={{ scale: 1.05 }}
                      >
                        {t.loginLink}
                      </motion.button>
                    </p>
                  </motion.div>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Enhanced Footer */}
      <motion.footer
        className={`py-12 relative z-10 backdrop-blur-xl ${
          uiState.darkMode
            ? "bg-gray-900/80 text-gray-300 border-t border-gray-700"
            : "bg-white/80 text-gray-700 border-t border-gray-200"
        }`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.8 }}
      >
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* Company Info */}
            <motion.div variants={itemVariants}>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 via-yellow-500 to-red-500 rounded-lg flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-emerald-600 via-yellow-600 to-red-600 bg-clip-text text-transparent">
                  EatFast
                </span>
              </div>
              <p className="text-sm leading-relaxed mb-4">
                {uiState.language === "fr"
                  ? "Votre passerelle vers les délices culinaires du Cameroun. Savourez l'authenticité, une commande à la fois."
                  : "Your gateway to Cameroon's culinary delights. Taste authenticity, one order at a time."}
              </p>
              <div className="flex space-x-2">
                <span className="text-xs bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200 px-2 py-1 rounded-full">
                  MTN Money
                </span>
                <span className="text-xs bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200 px-2 py-1 rounded-full">
                  Orange Money
                </span>
              </div>
            </motion.div>

            {/* Quick Links */}
            <motion.div variants={itemVariants}>
              <h3 className="text-lg font-bold mb-4">
                {uiState.language === "fr" ? "Liens rapides" : "Quick Links"}
              </h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a
                    href="/about"
                    className="hover:text-emerald-500 transition-colors"
                  >
                    {uiState.language === "fr" ? "À propos" : "About"}
                  </a>
                </li>
                <li>
                  <a
                    href="/restaurants"
                    className="hover:text-emerald-500 transition-colors"
                  >
                    {uiState.language === "fr" ? "Restaurants" : "Restaurants"}
                  </a>
                </li>
                <li>
                  <a
                    href="/contact"
                    className="hover:text-emerald-500 transition-colors"
                  >
                    {uiState.language === "fr" ? "Contact" : "Contact"}
                  </a>
                </li>
                <li>
                  <a
                    href="/help"
                    className="hover:text-emerald-500 transition-colors"
                  >
                    {uiState.language === "fr" ? "Aide" : "Help"}
                  </a>
                </li>
              </ul>
            </motion.div>

            {/* Support */}
            <motion.div variants={itemVariants}>
              <h3 className="text-lg font-bold mb-4">
                {uiState.language === "fr" ? "Support" : "Support"}
              </h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a
                    href="/terms"
                    className="hover:text-emerald-500 transition-colors"
                  >
                    {uiState.language === "fr" ? "Conditions" : "Terms"}
                  </a>
                </li>
                <li>
                  <a
                    href="/privacy"
                    className="hover:text-emerald-500 transition-colors"
                  >
                    {uiState.language === "fr" ? "Confidentialité" : "Privacy"}
                  </a>
                </li>
                <li>
                  <a
                    href="/faq"
                    className="hover:text-emerald-500 transition-colors"
                  >
                    FAQ
                  </a>
                </li>
                <li>
                  <a
                    href="/partner"
                    className="hover:text-emerald-500 transition-colors"
                  >
                    {uiState.language === "fr" ? "Partenaire" : "Partner"}
                  </a>
                </li>
              </ul>
            </motion.div>

            {/* Contact */}
            <motion.div variants={itemVariants}>
              <h3 className="text-lg font-bold mb-4">Contact</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center">
                  <div className="w-3 h-3 bg-emerald-500 rounded-full mr-2"></div>
                  <span>+237 6XX XXX XXX</span>
                </li>
                <li className="flex items-center">
                  <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                  <span>support@eatfast.cm</span>
                </li>
                <li className="flex items-center">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
                  <span>Yaoundé, Cameroun</span>
                </li>
              </ul>
            </motion.div>
          </div>

          <div className="pt-8 border-t border-gray-200 dark:border-gray-700 text-center text-sm">
            <p>
              &copy; {new Date().getFullYear()} EatFast Cameroun.{" "}
              {uiState.language === "fr"
                ? "Tous droits réservés."
                : "All rights reserved."}
            </p>
          </div>
        </div>
      </motion.footer>
    </div>
  );
};

export default Register;

// export const UserInformationRegisterProvider = ({ children }) => {
//   const [userInformation, setUserInformation] = useState({
//     first_name: "",
//     last_name: "",
//     email: "",
//     phone_number: "",
//   });

//   const updateUserInformation = (newData) => {
//     setUserInformation((prev) => ({ ...prev, ...newData }));
//   };
//   return (
//     <userContextRegister.Provider
//       value={{ userInformation, setUserInformation, updateUserInformation }}
//     >
//       {children}
//     </userContextRegister.Provider>
//   );
// };
