import {
  Star,
  Shield,
  Heart,
  Award,
  Clock,
  Zap,
  Users,
  TrendingUp,
} from "lucide-react";

export const FLOATING_ELEMENTS_COUNT = 15;

// Translations with enhanced content
export const translations = {
  en: {
    login: "Sign In",
    email: "Email Address",
    password: "Password",
    enterEmail: "Enter your email address",
    enterPassword: "Enter your password",
    rememberMe: "Remember me for 30 days",
    forgotPassword: "Forgot password?",
    noAccount: "Don't have an account?",
    register: "Create Account",
    loginTitle: "Welcome Back to EatFast",
    loginSubtitle:
      "Sign in to access your favorite restaurants and delicious meals",
    orContinueWith: "Or continue with",
    welcomeBack: "Welcome Back!",
    enjoyAuthenticFlavors:
      "Discover authentic Cameroonian flavors, one order at a time",
    mobileMoneySupport: "MTN & Orange Money Support",
    fastDelivery: "30-Minute Delivery Guarantee",
    trustedPartners: "1,200+ Trusted Restaurant Partners",
    features: {
      feature1: "Track your orders in real-time",
      feature2: "Personalized recommendations",
      feature3: "Secure mobile money payments",
      feature4: "Save your favorite restaurants",
    },
    validation: {
      emailRequired: "Email is required",
      emailInvalid: "Please enter a valid email address",
      passwordRequired: "Password is required",
      passwordMinLength: "Password must be at least 6 characters",
    },
    loginSuccess: "Login successful! Redirecting...",
    loginError: "Invalid credentials. Please try again.",
    loading: "Signing you in...",
  },
  fr: {
    login: "Se connecter",
    email: "Adresse email",
    password: "Mot de passe",
    enterEmail: "Entrez votre adresse email",
    enterPassword: "Entrez votre mot de passe",
    rememberMe: "Se souvenir de moi pendant 30 jours",
    forgotPassword: "Mot de passe oublié?",
    noAccount: "Vous n'avez pas de compte?",
    register: "Créer un compte",
    loginTitle: "Bon retour sur EatFast",
    loginSubtitle:
      "Connectez-vous pour accéder à vos restaurants favoris et délicieux repas",
    orContinueWith: "Ou continuez avec",
    welcomeBack: "Bon retour !",
    enjoyAuthenticFlavors:
      "Découvrez les saveurs authentiques du Cameroun, une commande à la fois",
    mobileMoneySupport: "Support MTN & Orange Money",
    fastDelivery: "Garantie de livraison en 30 minutes",
    trustedPartners: "1,200+ Partenaires Restaurants de Confiance",
    features: {
      feature1: "Suivez vos commandes en temps réel",
      feature2: "Recommandations personnalisées",
      feature3: "Paiements mobile money sécurisés",
      feature4: "Sauvegardez vos restaurants favoris",
    },
    validation: {
      emailRequired: "L'email est requis",
      emailInvalid: "Veuillez entrer une adresse email valide",
      passwordRequired: "Le mot de passe est requis",
      passwordMinLength: "Le mot de passe doit contenir au moins 6 caractères",
    },
    loginSuccess: "Connexion réussie ! Redirection...",
    loginError: "Identifiants invalides. Veuillez réessayer.",
    loading: "Connexion en cours...",
  },
};

// Feature data for the welcome section
export const FEATURES_DATA = [
  { icon: Clock, key: "feature1", color: "text-emerald-500" },
  { icon: Heart, key: "feature2", color: "text-red-500" },
  { icon: Shield, key: "feature3", color: "text-yellow-500" },
  { icon: Star, key: "feature4", color: "text-emerald-500" },
];

// Stats data
export const STATS_DATA = [
  { icon: Users, value: "50K+", key: "activeUsers" },
  { icon: Award, value: "1,200+", key: "restaurants" },
  { icon: TrendingUp, value: "4.8", key: "rating" },
  { icon: Zap, value: "30min", key: "delivery" },
];
