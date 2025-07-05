import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  FileText,
  Shield,
  Clock,
  AlertCircle,
  CheckCircle,
  Users,
  Globe,
  Sun,
  Moon,
  Sparkles
} from 'lucide-react';

const TermsAndConditions = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState('fr');
  const [activeSection, setActiveSection] = useState('introduction');

  // Initialize dark mode from system preference
  useEffect(() => {
    const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setDarkMode(darkModeQuery.matches);

    const handleChange = (e) => {
      setDarkMode(e.matches);
    };

    darkModeQuery.addEventListener('change', handleChange);
    return () => darkModeQuery.removeEventListener('change', handleChange);
  }, []);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'fr' : 'en');
  };

  const goBack = () => {
    window.history.back();
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.8,
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  const sections = [
    { id: 'introduction', title: language === 'fr' ? 'Introduction' : 'Introduction' },
    { id: 'acceptance', title: language === 'fr' ? 'Acceptation' : 'Acceptance' },
    { id: 'services', title: language === 'fr' ? 'Services' : 'Services' },
    { id: 'accounts', title: language === 'fr' ? 'Comptes utilisateur' : 'User Accounts' },
    { id: 'payment', title: language === 'fr' ? 'Paiement' : 'Payment' },
    { id: 'delivery', title: language === 'fr' ? 'Livraison' : 'Delivery' },
    { id: 'cancellation', title: language === 'fr' ? 'Annulation' : 'Cancellation' },
    { id: 'liability', title: language === 'fr' ? 'Responsabilité' : 'Liability' },
    { id: 'privacy', title: language === 'fr' ? 'Confidentialité' : 'Privacy' },
    { id: 'modifications', title: language === 'fr' ? 'Modifications' : 'Modifications' },
    { id: 'contact', title: language === 'fr' ? 'Contact' : 'Contact' }
  ];

  const content = {
    fr: {
      title: "Conditions d'utilisation",
      subtitle: "Dernière mise à jour : " + new Date().toLocaleDateString('fr-FR'),
      
      introduction: {
        title: "1. Introduction",
        content: `Bienvenue sur EatFast, la plateforme de livraison de nourriture du Cameroun. Ces conditions d'utilisation régissent votre utilisation de notre service de livraison de nourriture en ligne, de notre application mobile et de notre site web.

En utilisant nos services, vous acceptez d'être lié par ces conditions. Si vous n'acceptez pas ces conditions, veuillez ne pas utiliser nos services.`
      },
      
      acceptance: {
        title: "2. Acceptation des conditions",
        content: `En créant un compte ou en utilisant nos services, vous confirmez que :
• Vous avez au moins 18 ans ou avez l'autorisation de vos parents/tuteurs
• Vous avez lu, compris et accepté ces conditions d'utilisation
• Vous fournirez des informations exactes et à jour
• Vous respecterez toutes les lois locales applicables`
      },
      
      services: {
        title: "3. Description des services",
        content: `EatFast propose :
• Une plateforme de commande en ligne pour la livraison de nourriture
• Un service de livraison à domicile et au bureau
• Un système de paiement sécurisé via Mobile Money (MTN et Orange)
• Un support client 24h/7j
• Un système de suivi des commandes en temps réel

Nous nous réservons le droit de modifier, suspendre ou interrompre tout ou partie de nos services à tout moment.`
      },
      
      accounts: {
        title: "4. Comptes utilisateur",
        content: `Pour utiliser nos services, vous devez :
• Créer un compte avec des informations exactes
• Maintenir la sécurité de votre mot de passe
• Nous notifier immédiatement de toute utilisation non autorisée
• Accepter la responsabilité de toutes les activités sous votre compte

Nous nous réservons le droit de suspendre ou fermer des comptes en cas de violation de ces conditions.`
      },
      
      payment: {
        title: "5. Paiement et facturation",
        content: `Modalités de paiement :
• Paiement via MTN Mobile Money ou Orange Money
• Les prix incluent toutes les taxes applicables
• Les frais de livraison sont clairement indiqués avant la commande
• Le paiement est traité au moment de la commande
• Aucun remboursement automatique sauf en cas d'erreur de notre part

En cas de problème de paiement, contactez notre service client dans les 24 heures.`
      },
      
      delivery: {
        title: "6. Livraison",
        content: `Politique de livraison :
• Livraison dans un rayon de 15 km de nos restaurants partenaires
• Temps de livraison estimé : 30-45 minutes
• Livraison gratuite pour les commandes supérieures à 5,000 FCFA
• Le client doit être disponible à l'adresse indiquée
• Vérification d'identité requise pour certaines commandes

Nous ne sommes pas responsables des retards dus à des circonstances indépendantes de notre volonté.`
      },
      
      cancellation: {
        title: "7. Annulation et remboursement",
        content: `Politique d'annulation :
• Annulation gratuite dans les 5 minutes suivant la commande
• Remboursement complet en cas d'annulation par le restaurant
• Pas de remboursement si la commande est déjà en préparation
• Remboursement partiel en cas de livraison non conforme
• Délai de remboursement : 3-5 jours ouvrables

Pour toute demande d'annulation, contactez immédiatement notre service client.`
      },
      
      liability: {
        title: "8. Limitation de responsabilité",
        content: `EatFast décline toute responsabilité pour :
• La qualité des aliments préparés par les restaurants partenaires
• Les allergies alimentaires non signalées par le client
• Les dommages résultant d'une utilisation inappropriée du service
• Les pertes indirectes ou consécutives
• Les interruptions de service dues à des causes techniques

Notre responsabilité est limitée au montant de la commande concernée.`
      },
      
      privacy: {
        title: "9. Protection des données",
        content: `Nous nous engageons à protéger vos données personnelles :
• Collecte limitée aux informations nécessaires au service
• Utilisation conforme à notre politique de confidentialité
• Partage limité avec nos partenaires de livraison et restaurants
• Sécurité renforcée pour les données de paiement
• Droit d'accès, de modification et de suppression de vos données

Consultez notre politique de confidentialité pour plus de détails.`
      },
      
      modifications: {
        title: "10. Modifications des conditions",
        content: `Nous nous réservons le droit de modifier ces conditions à tout moment :
• Notification par email ou via l'application
• Délai de 30 jours avant l'entrée en vigueur
• Possibilité de refuser les modifications en fermant votre compte
• Consultation des versions précédentes disponible sur demande

La poursuite de l'utilisation du service constitue une acceptation des nouvelles conditions.`
      },
      
      contact: {
        title: "11. Contact",
        content: `Pour toute question concernant ces conditions d'utilisation :

📧 Email : legal@eatfast.cm
📞 Téléphone : +237 6XX XXX XXX
📍 Adresse : Yaoundé, Cameroun
🕒 Support client : 24h/7j

Nous nous engageons à répondre dans les 48 heures.`
      }
    },
    
    en: {
      title: "Terms and Conditions",
      subtitle: "Last updated: " + new Date().toLocaleDateString('en-US'),
      
      introduction: {
        title: "1. Introduction",
        content: `Welcome to EatFast, Cameroon's food delivery platform. These terms of use govern your use of our online food delivery service, mobile application, and website.

By using our services, you agree to be bound by these terms. If you do not accept these terms, please do not use our services.`
      },
      
      acceptance: {
        title: "2. Acceptance of Terms",
        content: `By creating an account or using our services, you confirm that:
• You are at least 18 years old or have parental/guardian permission
• You have read, understood, and accepted these terms of use
• You will provide accurate and up-to-date information
• You will comply with all applicable local laws`
      },
      
      services: {
        title: "3. Service Description",
        content: `EatFast offers:
• An online ordering platform for food delivery
• Home and office delivery service
• Secure payment system via Mobile Money (MTN and Orange)
• 24/7 customer support
• Real-time order tracking system

We reserve the right to modify, suspend, or discontinue all or part of our services at any time.`
      },
      
      accounts: {
        title: "4. User Accounts",
        content: `To use our services, you must:
• Create an account with accurate information
• Maintain the security of your password
• Notify us immediately of any unauthorized use
• Accept responsibility for all activities under your account

We reserve the right to suspend or close accounts in case of violation of these terms.`
      },
      
      payment: {
        title: "5. Payment and Billing",
        content: `Payment terms:
• Payment via MTN Mobile Money or Orange Money
• Prices include all applicable taxes
• Delivery fees are clearly indicated before ordering
• Payment is processed at the time of order
• No automatic refunds except in case of our error

In case of payment issues, contact our customer service within 24 hours.`
      },
      
      delivery: {
        title: "6. Delivery",
        content: `Delivery policy:
• Delivery within a 15 km radius of our partner restaurants
• Estimated delivery time: 30-45 minutes
• Free delivery for orders over 5,000 FCFA
• Customer must be available at the indicated address
• Identity verification required for certain orders

We are not responsible for delays due to circumstances beyond our control.`
      },
      
      cancellation: {
        title: "7. Cancellation and Refunds",
        content: `Cancellation policy:
• Free cancellation within 5 minutes of ordering
• Full refund in case of cancellation by the restaurant
• No refund if the order is already being prepared
• Partial refund in case of non-conforming delivery
• Refund timeframe: 3-5 business days

For any cancellation request, contact our customer service immediately.`
      },
      
      liability: {
        title: "8. Limitation of Liability",
        content: `EatFast disclaims responsibility for:
• Quality of food prepared by partner restaurants
• Food allergies not reported by the customer
• Damages resulting from inappropriate use of the service
• Indirect or consequential losses
• Service interruptions due to technical causes

Our liability is limited to the amount of the concerned order.`
      },
      
      privacy: {
        title: "9. Data Protection",
        content: `We are committed to protecting your personal data:
• Collection limited to information necessary for the service
• Use in accordance with our privacy policy
• Limited sharing with our delivery partners and restaurants
• Enhanced security for payment data
• Right to access, modify, and delete your data

See our privacy policy for more details.`
      },
      
      modifications: {
        title: "10. Modifications to Terms",
        content: `We reserve the right to modify these terms at any time:
• Notification by email or via the application
• 30-day notice before taking effect
• Possibility to refuse modifications by closing your account
• Previous versions available for consultation upon request

Continued use of the service constitutes acceptance of new terms.`
      },
      
      contact: {
        title: "11. Contact",
        content: `For any questions regarding these terms of use:

📧 Email: legal@eatfast.cm
📞 Phone: +237 6XX XXX XXX
📍 Address: Yaoundé, Cameroon
🕒 Customer support: 24/7

We are committed to responding within 48 hours.`
      }
    }
  };

  const currentContent = content[language];

  return (
    <div className={`min-h-screen transition-all duration-500 ${
      darkMode 
        ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-emerald-900 text-white'
        : 'bg-gradient-to-br from-emerald-50 via-yellow-50 to-red-50 text-gray-900'
    }`}>
      {/* Header */}
      <motion.header
        className={`sticky top-0 z-50 backdrop-blur-xl border-b ${
          darkMode
            ? 'bg-gray-900/90 border-gray-700'
            : 'bg-white/90 border-gray-200'
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <motion.button
                onClick={goBack}
                className={`p-2 rounded-xl transition-all duration-300 ${
                  darkMode
                    ? 'hover:bg-gray-700 bg-gray-800'
                    : 'hover:bg-gray-100 bg-white'
                }`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <ArrowLeft size={20} className="text-emerald-600" />
              </motion.button>
              
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 via-yellow-500 to-red-500 rounded-lg flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-emerald-600 via-yellow-600 to-red-600 bg-clip-text text-transparent">
                  EatFast
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <motion.button
                onClick={toggleLanguage}
                className={`p-3 rounded-xl transition-all duration-300 ${
                  darkMode
                    ? 'hover:bg-gray-700 bg-gray-800'
                    : 'hover:bg-gray-100 bg-white'
                }`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Globe size={20} className="text-emerald-600" />
              </motion.button>

              <motion.button
                onClick={toggleDarkMode}
                className={`p-3 rounded-xl transition-all duration-300 ${
                  darkMode
                    ? 'hover:bg-gray-700 bg-gray-800'
                    : 'hover:bg-gray-100 bg-white'
                }`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                {darkMode ? (
                  <Sun size={20} className="text-yellow-500" />
                ) : (
                  <Moon size={20} className="text-blue-600" />
                )}
              </motion.button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <motion.div
          className="max-w-6xl mx-auto"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          {/* Title Section */}
          <motion.div
            className="text-center mb-12"
            variants={itemVariants}
          >
            <div className="flex items-center justify-center mb-4">
              <FileText className="w-12 h-12 text-emerald-600 mr-4" />
              <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 via-yellow-600 to-red-600 bg-clip-text text-transparent">
                {currentContent.title}
              </h1>
            </div>
            <p className={`text-lg ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              {currentContent.subtitle}
            </p>
          </motion.div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Table of Contents */}
            <motion.div
              className="lg:w-1/4"
              variants={itemVariants}
            >
              <div className={`sticky top-24 p-6 rounded-2xl ${
                darkMode
                  ? 'bg-gray-800/50 border-gray-700'
                  : 'bg-white/50 border-gray-200'
              } border backdrop-blur-sm`}>
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <Shield className="w-5 h-5 text-emerald-600 mr-2" />
                  {language === 'fr' ? 'Sommaire' : 'Table of Contents'}
                </h3>
                <nav className="space-y-2">
                  {sections.map((section) => (
                    <motion.button
                      key={section.id}
                      onClick={() => setActiveSection(section.id)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all duration-200 ${
                        activeSection === section.id
                          ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-200 font-medium'
                          : darkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-600'
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {section.title}
                    </motion.button>
                  ))}
                </nav>
              </div>
            </motion.div>

            {/* Content */}
            <motion.div
              className="lg:w-3/4"
              variants={itemVariants}
            >
              <div className={`p-8 rounded-2xl ${
                darkMode
                  ? 'bg-gray-800/50 border-gray-700'
                  : 'bg-white/50 border-gray-200'
              } border backdrop-blur-sm`}>
                <motion.div
                  key={activeSection}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <h2 className="text-2xl font-bold mb-6 flex items-center">
                    <CheckCircle className="w-6 h-6 text-emerald-600 mr-3" />
                    {currentContent[activeSection]?.title}
                  </h2>
                  <div className={`prose prose-lg max-w-none ${
                    darkMode ? 'prose-invert' : ''
                  }`}>
                    <div className="whitespace-pre-line leading-relaxed">
                      {currentContent[activeSection]?.content}
                    </div>
                  </div>
                </motion.div>

                {/* Navigation */}
                <div className="flex justify-between mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <motion.button
                    onClick={() => {
                      const currentIndex = sections.findIndex(s => s.id === activeSection);
                      if (currentIndex > 0) {
                        setActiveSection(sections[currentIndex - 1].id);
                      }
                    }}
                    disabled={sections.findIndex(s => s.id === activeSection) === 0}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                      sections.findIndex(s => s.id === activeSection) === 0
                        ? 'opacity-50 cursor-not-allowed'
                        : darkMode
                        ? 'hover:bg-gray-700 text-gray-300'
                        : 'hover:bg-gray-100 text-gray-600'
                    }`}
                    whileHover={{ scale: sections.findIndex(s => s.id === activeSection) === 0 ? 1 : 1.05 }}
                  >
                    <ArrowLeft size={16} />
                    <span>{language === 'fr' ? 'Précédent' : 'Previous'}</span>
                  </motion.button>

                  <motion.button
                    onClick={() => {
                      const currentIndex = sections.findIndex(s => s.id === activeSection);
                      if (currentIndex < sections.length - 1) {
                        setActiveSection(sections[currentIndex + 1].id);
                      }
                    }}
                    disabled={sections.findIndex(s => s.id === activeSection) === sections.length - 1}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                      sections.findIndex(s => s.id === activeSection) === sections.length - 1
                        ? 'opacity-50 cursor-not-allowed'
                        : darkMode
                        ? 'hover:bg-gray-700 text-gray-300'
                        : 'hover:bg-gray-100 text-gray-600'
                    }`}
                    whileHover={{ scale: sections.findIndex(s => s.id === activeSection) === sections.length - 1 ? 1 : 1.05 }}
                  >
                    <span>{language === 'fr' ? 'Suivant' : 'Next'}</span>
                    <ArrowLeft size={16} className="rotate-180" />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Footer Notice */}
          <motion.div
            className={`mt-12 p-6 rounded-2xl ${
              darkMode
                ? 'bg-yellow-900/20 border-yellow-800'
                : 'bg-yellow-50 border-yellow-200'
            } border`}
            variants={itemVariants}
          >
            <div className="flex items-start space-x-3">
              <AlertCircle className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">
                  {language === 'fr' ? 'Note importante' : 'Important Notice'}
                </h3>
                <p className="text-yellow-700 dark:text-yellow-300 text-sm leading-relaxed">
                  {language === 'fr'
                    ? "Ces conditions d'utilisation sont régies par le droit camerounais. En cas de litige, les tribunaux de Yaoundé auront compétence exclusive. Si une clause de ces conditions est déclarée invalide, les autres clauses restent en vigueur."
                    : "These terms of use are governed by Cameroonian law. In case of dispute, the courts of Yaoundé will have exclusive jurisdiction. If any clause of these terms is declared invalid, the other clauses remain in force."
                  }
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default TermsAndConditions;