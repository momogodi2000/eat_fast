import {
  Shield,
  Heart,
  Award,
  Clock,
  Zap,
  Users,
  Smartphone,
  Gift,
} from "lucide-react";

export const FLOATING_PARTICLES_COUNT = 20;

// Enhanced translations with more content
export const translations = {
  en: {
    title: "Create Your Account",
    subtitle: "Join thousands of food lovers across Cameroon",
    firstName: "First Name",
    firstNamePlaceholder: "Enter your first name",
    lastName: "Last Name",
    lastNamePlaceholder: "Enter your last name",
    email: "Email Address",
    emailPlaceholder: "Enter your email address",
    phone: "Phone Number",
    phonePlaceholder: "+237 6XX XXX XXX",
    password: "Password",
    passwordPlaceholder: "Create a strong password",
    confirmPassword: "Confirm Password",
    confirmPasswordPlaceholder: "Re-enter your password",
    acceptTerms: "I agree to the",
    termsLink: "Terms and Conditions",
    privacyLink: "Privacy Policy",
    submitButton: "Create Account",
    creating: "Creating your account...",
    alreadyHaveAccount: "Already have an account?",
    loginLink: "Sign in here",
    welcomeTitle: "Join EatFast Today!",
    welcomeSubtitle:
      "Discover authentic Cameroonian flavors and join our growing community",
    validation: {
      required: "This field is required",
      invalidEmail: "Please enter a valid email address",
      passwordLength: "Password must be at least 8 characters",
      passwordMatch: "Passwords do not match",
      invalidPhone: "Please enter a valid Cameroonian phone number",
    },
    features: {
      feature1: "Fast delivery to your doorstep",
      feature2: "Exclusive deals and discounts",
      feature3: "Wide variety of local restaurants",
      feature4: "Secure mobile money payments",
    },
    benefits: {
      benefit1: "30-minute delivery guarantee",
      benefit2: "MTN & Orange Money support",
      benefit3: "1,200+ restaurant partners",
      benefit4: "24/7 customer support",
    },
    success:
      "Account created successfully! Please check your email to verify your account.",
    error: "Something went wrong. Please try again.",
    or: "Or",
  },
  fr: {
    title: "Créez votre compte",
    subtitle:
      "Rejoignez des milliers d'amateurs de cuisine à travers le Cameroun",
    firstName: "Prénom",
    firstNamePlaceholder: "Entrez votre prénom",
    lastName: "Nom",
    lastNamePlaceholder: "Entrez votre nom",
    email: "Adresse email",
    emailPlaceholder: "Entrez votre adresse email",
    phone: "Numéro de téléphone",
    phonePlaceholder: "+237 6XX XXX XXX",
    password: "Mot de passe",
    passwordPlaceholder: "Créez un mot de passe fort",
    confirmPassword: "Confirmez le mot de passe",
    confirmPasswordPlaceholder: "Entrez à nouveau votre mot de passe",
    acceptTerms: "J'accepte les",
    termsLink: "Conditions d'utilisation",
    privacyLink: "Politique de confidentialité",
    submitButton: "Créer un compte",
    creating: "Création de votre compte...",
    alreadyHaveAccount: "Vous avez déjà un compte?",
    loginLink: "Connectez-vous ici",
    welcomeTitle: "Rejoignez EatFast dès aujourd'hui!",
    welcomeSubtitle:
      "Découvrez les saveurs authentiques du Cameroun et rejoignez notre communauté grandissante",
    validation: {
      required: "Ce champ est requis",
      invalidEmail: "Veuillez entrer une adresse email valide",
      passwordLength: "Le mot de passe doit contenir au moins 8 caractères",
      passwordMatch: "Les mots de passe ne correspondent pas",
      invalidPhone: "Veuillez entrer un numéro de téléphone camerounais valide",
    },
    features: {
      feature1: "Livraison rapide à votre porte",
      feature2: "Offres exclusives et remises",
      feature3: "Grande variété de restaurants locaux",
      feature4: "Paiements mobile money sécurisés",
    },
    benefits: {
      benefit1: "Garantie de livraison en 30 minutes",
      benefit2: "Support MTN & Orange Money",
      benefit3: "1,200+ partenaires restaurants",
      benefit4: "Support client 24h/7j",
    },
    success:
      "Compte créé avec succès! Veuillez vérifier votre email pour activer votre compte.",
    error: "Une erreur s'est produite. Veuillez réessayer.",
    or: "Ou",

    user_type: "Rôle",
    selectuser_typePlaceholder: "Sélectionnez votre rôle",
    user_typeCustomer: "Client",
    user_typeDelivery: "Livreur",
    user_typeRestaurantManager: "Gérant de restaurant",
    requiredDocuments: "Documents requis",
    dragDropDocuments: "Glissez-déposez vos documents ici ou",
    browseFiles: "parcourir vos fichiers",
    deliveryDocumentsHint:
      "Permis de conduire et carte d'identité requis (PDF, JPG, PNG)",
    managerDocumentsHint:
      "Document d'identification et justificatif requis (PDF, JPG, PNG)",
    city: "Ville  ",
    vehicle_type: "Type de  Vehicule *",
    vehicle_motor: "Moto",
    vehicle_scooter: "Scooter",
    vehicle_bicycle: "Vélo",
    vehicle_car: "Voiture",
    address: "Addresse  du",
  },
};

// Feature data for welcome section
export const FEATURES_DATA = [
  { icon: Clock, key: "feature1", color: "text-emerald-500" },
  { icon: Gift, key: "feature2", color: "text-red-500" },
  { icon: Users, key: "feature3", color: "text-yellow-500" },
  { icon: Shield, key: "feature4", color: "text-emerald-500" },
];

// Benefits data for stats
export const BENEFITS_DATA = [
  { icon: Zap, key: "benefit1", color: "emerald" },
  { icon: Smartphone, key: "benefit2", color: "yellow" },
  { icon: Award, key: "benefit3", color: "red" },
  { icon: Heart, key: "benefit4", color: "emerald" },
];
