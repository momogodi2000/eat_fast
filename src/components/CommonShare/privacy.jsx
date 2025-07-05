import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Shield,
  Lock,
  Eye,
  Database,
  UserCheck,
  Globe,
  Sun,
  Moon,
  Sparkles,
  AlertCircle,
  CheckCircle,
  Key,
  Smartphone
} from 'lucide-react';

const PrivacyPolicy = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState('fr');
  const [activeSection, setActiveSection] = useState('introduction');

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
    { id: 'introduction', title: language === 'fr' ? 'Introduction' : 'Introduction', icon: Shield },
    { id: 'collection', title: language === 'fr' ? 'Collecte des données' : 'Data Collection', icon: Database },
    { id: 'usage', title: language === 'fr' ? 'Utilisation' : 'Usage', icon: Eye },
    { id: 'sharing', title: language === 'fr' ? 'Partage' : 'Sharing', icon: UserCheck },
    { id: 'security', title: language === 'fr' ? 'Sécurité' : 'Security', icon: Lock },
    { id: 'retention', title: language === 'fr' ? 'Conservation' : 'Retention', icon: Database },
    { id: 'rights', title: language === 'fr' ? 'Vos droits' : 'Your Rights', icon: Key },
    { id: 'cookies', title: language === 'fr' ? 'Cookies' : 'Cookies', icon: Smartphone },
    { id: 'children', title: language === 'fr' ? 'Mineurs' : 'Children', icon: Shield },
    { id: 'changes', title: language === 'fr' ? 'Modifications' : 'Changes', icon: AlertCircle },
    { id: 'contact', title: language === 'fr' ? 'Contact' : 'Contact', icon: Globe }
  ];

  const content = {
    fr: {
      title: "Politique de confidentialité",
      subtitle: "Dernière mise à jour : " + new Date().toLocaleDateString('fr-FR'),
      
      introduction: {
        title: "1. Introduction",
        content: `Chez EatFast, nous respectons votre vie privée et nous nous engageons à protéger vos données personnelles. Cette politique de confidentialité explique comment nous collectons, utilisons, partageons et protégeons vos informations lorsque vous utilisez notre plateforme de livraison de nourriture.

Cette politique s'applique à :
• Notre site web (www.eatfast.cm)
• Notre application mobile EatFast
• Tous nos services de livraison
• Nos communications avec vous

En utilisant nos services, vous acceptez les pratiques décrites dans cette politique.`
      },
      
      collection: {
        title: "2. Informations que nous collectons",
        content: `Nous collectons différents types d'informations :

📱 Informations que vous nous fournissez :
• Nom, prénom, numéro de téléphone
• Adresse email et adresses de livraison
• Informations de paiement Mobile Money
• Préférences alimentaires et allergies
• Photos de profil (optionnel)

📊 Informations collectées automatiquement :
• Adresse IP et données de géolocalisation
• Type d'appareil et système d'exploitation
• Données d'utilisation de l'application
• Historique des commandes et préférences
• Cookies et technologies similaires

🚚 Informations des partenaires :
• Statut de livraison des restaurants
• Évaluations et commentaires
• Photos des plats commandés`
      },
      
      usage: {
        title: "3. Comment nous utilisons vos données",
        content: `Nous utilisons vos informations pour :

🍽️ Traitement des commandes :
• Traiter et livrer vos commandes
• Communiquer avec vous sur le statut
• Gérer les paiements Mobile Money
• Résoudre les problèmes de service

📈 Amélioration du service :
• Personnaliser votre expérience
• Recommander des restaurants et plats
• Analyser les tendances d'utilisation
• Développer de nouvelles fonctionnalités

📢 Communications :
• Envoyer des confirmations de commande
• Notifications push importantes
• Offres promotionnelles (avec votre accord)
• Support client et assistance

🔒 Sécurité et conformité :
• Prévenir la fraude et les abus
• Respecter nos obligations légales
• Protéger nos droits et propriété`
      },
      
      sharing: {
        title: "4. Partage de vos informations",
        content: `Nous partageons vos données uniquement dans les cas suivants :

🤝 Partenaires de service :
• Restaurants pour traiter vos commandes
• Livreurs pour effectuer la livraison
• Prestataires de paiement Mobile Money
• Services de support technique

⚖️ Obligations légales :
• Réponse aux demandes des autorités
• Conformité aux lois camerounaises
• Protection de nos droits légaux
• Prévention d'activités illégales

🔄 Transferts d'entreprise :
• En cas de fusion ou acquisition
• Avec protection contractuelle des données

❌ Nous ne vendons jamais vos données :
• Aucune vente à des tiers
• Pas de publicité ciblée externe
• Contrôle strict des accès`
      },
      
      security: {
        title: "5. Sécurité de vos données",
        content: `Nous mettons en place des mesures de sécurité robustes :

🔐 Protection technique :
• Chiffrement SSL/TLS pour toutes les communications
• Stockage sécurisé avec chiffrement des données
• Accès restreint aux données sensibles
• Surveillance continue des systèmes

💳 Sécurité des paiements :
• Aucun stockage des codes PIN Mobile Money
• Partenariat avec des prestataires certifiés
• Tokenisation des données de paiement
• Conformité aux standards de sécurité

👥 Contrôles d'accès :
• Authentification à deux facteurs
• Accès limité au personnel autorisé
• Journalisation de tous les accès
• Formation régulière du personnel

🚨 Détection des incidents :
• Monitoring 24h/7j des systèmes
• Procédures de réponse aux incidents
• Notification en cas de violation
• Plans de continuité d'activité`
      },
      
      retention: {
        title: "6. Conservation des données",
        content: `Nous conservons vos données selon ces principes :

⏰ Durées de conservation :
• Données de compte : tant que le compte est actif
• Historique des commandes : 3 ans pour la comptabilité
• Données de paiement : 13 mois maximum
• Logs de sécurité : 1 an

🗑️ Suppression automatique :
• Comptes inactifs depuis 2 ans
• Données temporaires après utilisation
• Caches et cookies selon les paramètres
• Sauvegardes selon le cycle de vie

📋 Exceptions légales :
• Conservation pour obligations comptables
• Données nécessaires aux litiges en cours
• Exigences des autorités compétentes
• Archives historiques anonymisées

♻️ Processus de suppression :
• Suppression sécurisée et définitive
• Vérification de la destruction complète
• Documentation du processus
• Respect des délais légaux`
      },
      
      rights: {
        title: "7. Vos droits sur vos données",
        content: `Vous disposez des droits suivants :

👁️ Droit d'accès :
• Consulter toutes vos données personnelles
• Obtenir une copie de vos informations
• Connaître l'origine des données
• Délai de réponse : 30 jours maximum

✏️ Droit de rectification :
• Corriger les données inexactes
• Compléter les informations incomplètes
• Mise à jour en temps réel
• Notification aux tiers si nécessaire

🗑️ Droit à l'effacement :
• Suppression de votre compte
• Effacement de données non nécessaires
• Droit à l'oubli numérique
• Exceptions pour obligations légales

⛔ Droit d'opposition :
• Refuser le marketing direct
• S'opposer au profilage
• Limitation du traitement
• Portabilité des données

📞 Exercer vos droits :
• Email : privacy@eatfast.cm
• Formulaire en ligne disponible
• Justificatif d'identité requis
• Réponse gratuite et rapide`
      },
      
      cookies: {
        title: "8. Cookies et technologies similaires",
        content: `Nous utilisons des cookies pour améliorer votre expérience :

🍪 Types de cookies :
• Cookies essentiels : fonctionnement du site
• Cookies de performance : analyses d'usage
• Cookies de personnalisation : préférences
• Cookies de marketing : offres ciblées

⚙️ Gestion des cookies :
• Paramètres de votre navigateur
• Panneau de contrôle sur notre site
• Désactivation sélective possible
• Impact sur certaines fonctionnalités

📱 Technologies mobiles :
• Identifiants publicitaires
• Push notifications
• Géolocalisation (avec permission)
• Stockage local de l'application

🔄 Cookies tiers :
• Partenaires de livraison
• Services de paiement
• Analyses de trafic
• Contrôle de vos préférences

⏰ Durée de vie :
• Cookies de session : fin de visite
• Cookies persistants : selon paramètres
• Suppression automatique possible
• Renouvellement sur demande`
      },
      
      children: {
        title: "9. Protection des mineurs",
        content: `Nous prenons très au sérieux la protection des mineurs :

🔞 Âge minimum :
• Service réservé aux 18 ans et plus
• Vérification lors de l'inscription
• Autorisation parentale nécessaire pour les mineurs
• Blocage automatique des comptes non conformes

👨‍👩‍👧‍👦 Responsabilité parentale :
• Surveillance de l'utilisation par les enfants
• Contrôle parental recommandé
• Signalement de comptes de mineurs
• Accompagnement pour la suppression

🛡️ Mesures de protection :
• Aucune collecte intentionnelle de données d'enfants
• Suppression immédiate si détectée
• Procédures de vérification renforcées
• Formation du personnel sur ces enjeux

📞 Signalement :
• Email : protection-mineurs@eatfast.cm
• Traitement prioritaire des signalements
• Collaboration avec les autorités
• Information des parents concernés

🎓 Sensibilisation :
• Campagnes d'information
• Partenariats avec des associations
• Ressources pour les parents
• Promotion de l'usage responsable`
      },
      
      changes: {
        title: "10. Modifications de cette politique",
        content: `Cette politique peut être modifiée :

📅 Processus de modification :
• Révision régulière de la politique
• Consultation des parties prenantes
• Validation par notre équipe juridique
• Publication de la nouvelle version

📢 Notification des changements :
• Email à tous les utilisateurs
• Notification push dans l'application
• Bannière sur le site web
• Délai de 30 jours avant application

📋 Versions antérieures :
• Archives des versions précédentes
• Date de chaque modification
• Résumé des changements principaux
• Accès sur demande

✅ Acceptation des changements :
• Acceptation par la poursuite d'utilisation
• Possibilité de refuser et fermer le compte
• Pas d'effet rétroactif
• Droits acquis préservés

🔍 Transparence :
• Justification des modifications
• Impact sur vos droits
• Nouvelles mesures de protection
• Canal de communication dédié`
      },
      
      contact: {
        title: "11. Nous contacter",
        content: `Pour toute question sur cette politique de confidentialité :

📧 Délégué à la Protection des Données :
• Email : dpo@eatfast.cm
• Réponse sous 48h maximum
• Traitement confidentiel
• Suivi personnalisé

📞 Service Client :
• Téléphone : +237 6XX XXX XXX
• Disponible 24h/7j
• Support multilingue
• Assistance technique

📍 Adresse postale :
• EatFast Cameroun
• Service Confidentialité
• BP XXXX, Yaoundé
• Cameroun

🌐 Formulaire en ligne :
• www.eatfast.cm/privacy-contact
• Catégorisation automatique
• Accusé de réception
• Suivi du traitement

⚖️ Autorité de contrôle :
• Agence Nationale des Technologies de l'Information et de la Communication (ANTIC)
• Droit de réclamation
• Procédure de médiation
• Recours gratuit

Nous nous engageons à traiter toute demande avec diligence et transparence.`
      }
    },
    
    en: {
      title: "Privacy Policy",
      subtitle: "Last updated: " + new Date().toLocaleDateString('en-US'),
      
      introduction: {
        title: "1. Introduction",
        content: `At EatFast, we respect your privacy and are committed to protecting your personal data. This privacy policy explains how we collect, use, share, and protect your information when you use our food delivery platform.

This policy applies to:
• Our website (www.eatfast.cm)
• Our EatFast mobile application
• All our delivery services
• Our communications with you

By using our services, you accept the practices described in this policy.`
      },
      
      collection: {
        title: "2. Information We Collect",
        content: `We collect different types of information:

📱 Information you provide to us:
• First name, last name, phone number
• Email address and delivery addresses
• Mobile Money payment information
• Food preferences and allergies
• Profile photos (optional)

📊 Information collected automatically:
• IP address and geolocation data
• Device type and operating system
• Application usage data
• Order history and preferences
• Cookies and similar technologies

🚚 Information from partners:
• Delivery status from restaurants
• Reviews and comments
• Photos of ordered dishes`
      },
      
      usage: {
        title: "3. How We Use Your Data",
        content: `We use your information to:

🍽️ Order processing:
• Process and deliver your orders
• Communicate with you about status
• Manage Mobile Money payments
• Resolve service issues

📈 Service improvement:
• Personalize your experience
• Recommend restaurants and dishes
• Analyze usage trends
• Develop new features

📢 Communications:
• Send order confirmations
• Important push notifications
• Promotional offers (with your consent)
• Customer support and assistance

🔒 Security and compliance:
• Prevent fraud and abuse
• Comply with legal obligations
• Protect our rights and property`
      },
      
      sharing: {
        title: "4. Sharing Your Information",
        content: `We share your data only in the following cases:

🤝 Service partners:
• Restaurants to process your orders
• Delivery agents for delivery
• Mobile Money payment providers
• Technical support services

⚖️ Legal obligations:
• Response to authority requests
• Compliance with Cameroonian laws
• Protection of our legal rights
• Prevention of illegal activities

🔄 Business transfers:
• In case of merger or acquisition
• With contractual data protection

❌ We never sell your data:
• No sales to third parties
• No external targeted advertising
• Strict access controls`
      },
      
      security: {
        title: "5. Data Security",
        content: `We implement robust security measures:

🔐 Technical protection:
• SSL/TLS encryption for all communications
• Secure storage with data encryption
• Restricted access to sensitive data
• Continuous system monitoring

💳 Payment security:
• No storage of Mobile Money PIN codes
• Partnership with certified providers
• Payment data tokenization
• Compliance with security standards

👥 Access controls:
• Two-factor authentication
• Limited access to authorized personnel
• Logging of all access
• Regular staff training

🚨 Incident detection:
• 24/7 system monitoring
• Incident response procedures
• Notification in case of breach
• Business continuity plans`
      },
      
      retention: {
        title: "6. Data Retention",
        content: `We retain your data according to these principles:

⏰ Retention periods:
• Account data: while account is active
• Order history: 3 years for accounting
• Payment data: 13 months maximum
• Security logs: 1 year

🗑️ Automatic deletion:
• Accounts inactive for 2 years
• Temporary data after use
• Caches and cookies per settings
• Backups according to lifecycle

📋 Legal exceptions:
• Retention for accounting obligations
• Data necessary for ongoing disputes
• Requirements from competent authorities
• Anonymized historical archives

♻️ Deletion process:
• Secure and definitive deletion
• Verification of complete destruction
• Process documentation
• Compliance with legal deadlines`
      },
      
      rights: {
        title: "7. Your Data Rights",
        content: `You have the following rights:

👁️ Right of access:
• View all your personal data
• Obtain a copy of your information
• Know the origin of data
• Response time: 30 days maximum

✏️ Right of rectification:
• Correct inaccurate data
• Complete incomplete information
• Real-time updates
• Notification to third parties if necessary

🗑️ Right to erasure:
• Account deletion
• Erasure of unnecessary data
• Right to digital forgetting
• Exceptions for legal obligations

⛔ Right to object:
• Refuse direct marketing
• Object to profiling
• Limitation of processing
• Data portability

📞 Exercise your rights:
• Email: privacy@eatfast.cm
• Online form available
• Identity verification required
• Free and fast response`
      },
      
      cookies: {
        title: "8. Cookies and Similar Technologies",
        content: `We use cookies to improve your experience:

🍪 Types of cookies:
• Essential cookies: site functionality
• Performance cookies: usage analytics
• Personalization cookies: preferences
• Marketing cookies: targeted offers

⚙️ Cookie management:
• Your browser settings
• Control panel on our site
• Selective deactivation possible
• Impact on certain features

📱 Mobile technologies:
• Advertising identifiers
• Push notifications
• Geolocation (with permission)
• Local application storage

🔄 Third-party cookies:
• Delivery partners
• Payment services
• Traffic analytics
• Control your preferences

⏰ Lifespan:
• Session cookies: end of visit
• Persistent cookies: per settings
• Automatic deletion possible
• Renewal on request`
      },
      
      children: {
        title: "9. Protection of Minors",
        content: `We take the protection of minors very seriously:

🔞 Minimum age:
• Service reserved for 18 years and older
• Verification during registration
• Parental authorization required for minors
• Automatic blocking of non-compliant accounts

👨‍👩‍👧‍👦 Parental responsibility:
• Monitoring children's use
• Parental controls recommended
• Reporting minor accounts
• Assistance for deletion

🛡️ Protection measures:
• No intentional collection of children's data
• Immediate deletion if detected
• Enhanced verification procedures
• Staff training on these issues

📞 Reporting:
• Email: child-protection@eatfast.cm
• Priority treatment of reports
• Collaboration with authorities
• Information to concerned parents

🎓 Awareness:
• Information campaigns
• Partnerships with associations
• Resources for parents
• Promotion of responsible use`
      },
      
      changes: {
        title: "10. Changes to This Policy",
        content: `This policy may be modified:

📅 Modification process:
• Regular policy review
• Stakeholder consultation
• Validation by our legal team
• Publication of new version

📢 Change notification:
• Email to all users
• Push notification in the application
• Banner on the website
• 30-day notice before application

📋 Previous versions:
• Archives of previous versions
• Date of each modification
• Summary of main changes
• Access on request

✅ Acceptance of changes:
• Acceptance by continued use
• Possibility to refuse and close account
• No retroactive effect
• Acquired rights preserved

🔍 Transparency:
• Justification of modifications
• Impact on your rights
• New protection measures
• Dedicated communication channel`
      },
      
      contact: {
        title: "11. Contact Us",
        content: `For any questions about this privacy policy:

📧 Data Protection Officer:
• Email: dpo@eatfast.cm
• Response within 48h maximum
• Confidential treatment
• Personalized follow-up

📞 Customer Service:
• Phone: +237 6XX XXX XXX
• Available 24/7
• Multilingual support
• Technical assistance

📍 Postal address:
• EatFast Cameroon
• Privacy Service
• PO Box XXXX, Yaoundé
• Cameroon

🌐 Online form:
• www.eatfast.cm/privacy-contact
• Automatic categorization
• Acknowledgment of receipt
• Processing tracking

⚖️ Supervisory authority:
• National Agency for Information and Communication Technologies (ANTIC)
• Right to complaint
• Mediation procedure
• Free recourse

We are committed to handling any request with diligence and transparency.`
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
              <Shield className="w-12 h-12 text-emerald-600 mr-4" />
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
                  <Lock className="w-5 h-5 text-emerald-600 mr-2" />
                  {language === 'fr' ? 'Sommaire' : 'Table of Contents'}
                </h3>
                <nav className="space-y-2">
                  {sections.map((section) => {
                    const IconComponent = section.icon;
                    return (
                      <motion.button
                        key={section.id}
                        onClick={() => setActiveSection(section.id)}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all duration-200 flex items-center ${
                          activeSection === section.id
                            ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-200 font-medium'
                            : darkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-600'
                        }`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <IconComponent size={16} className="mr-2 flex-shrink-0" />
                        {section.title}
                      </motion.button>
                    );
                  })}
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
                ? 'bg-blue-900/20 border-blue-800'
                : 'bg-blue-50 border-blue-200'
            } border`}
            variants={itemVariants}
          >
            <div className="flex items-start space-x-3">
              <Shield className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">
                  {language === 'fr' ? 'Engagement de protection' : 'Protection Commitment'}
                </h3>
                <p className="text-blue-700 dark:text-blue-300 text-sm leading-relaxed">
                  {language === 'fr'
                    ? "Nous nous engageons à protéger vos données personnelles selon les plus hauts standards de sécurité. Cette politique est conforme à la réglementation camerounaise et aux meilleures pratiques internationales en matière de protection des données."
                    : "We are committed to protecting your personal data according to the highest security standards. This policy complies with Cameroonian regulations and international best practices for data protection."
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

export default PrivacyPolicy;