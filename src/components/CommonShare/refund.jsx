import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  RefreshCw,
  Clock,
  CreditCard,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Globe,
  Sun,
  Moon,
  Sparkles,
  DollarSign,
  Phone,
  Mail,
  Smartphone
} from 'lucide-react';

const RefundPolicy = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState('fr');
  const [activeSection, setActiveSection] = useState('overview');

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
    { id: 'overview', title: language === 'fr' ? 'Vue d\'ensemble' : 'Overview', icon: RefreshCw },
    { id: 'eligibility', title: language === 'fr' ? 'Éligibilité' : 'Eligibility', icon: CheckCircle },
    { id: 'timeframes', title: language === 'fr' ? 'Délais' : 'Timeframes', icon: Clock },
    { id: 'process', title: language === 'fr' ? 'Processus' : 'Process', icon: CreditCard },
    { id: 'cancellation', title: language === 'fr' ? 'Annulation' : 'Cancellation', icon: XCircle },
    { id: 'exceptions', title: language === 'fr' ? 'Exceptions' : 'Exceptions', icon: AlertTriangle },
    { id: 'mobile-money', title: language === 'fr' ? 'Mobile Money' : 'Mobile Money', icon: Smartphone },
    { id: 'disputes', title: language === 'fr' ? 'Litiges' : 'Disputes', icon: Phone },
    { id: 'contact', title: language === 'fr' ? 'Contact' : 'Contact', icon: Mail }
  ];

  const content = {
    fr: {
      title: "Politique de remboursement",
      subtitle: "Dernière mise à jour : " + new Date().toLocaleDateString('fr-FR'),
      
      overview: {
        title: "1. Vue d'ensemble",
        content: `Chez EatFast, nous nous engageons à offrir une expérience de livraison exceptionnelle. Cette politique de remboursement détaille les conditions dans lesquelles nous pouvons traiter les remboursements pour nos services de livraison de nourriture.

💰 Principes généraux :
• Remboursement complet en cas de problème de notre part
• Traitement rapide et transparent
• Support client dédié pour tous les cas
• Respect des délais annoncés

🔄 Types de remboursement :
• Remboursement intégral (100%)
• Remboursement partiel (selon le cas)
• Crédit sur votre compte EatFast
• Nouvelle livraison gratuite

📞 Support disponible 24h/7j :
Notre équipe est là pour vous accompagner dans toute demande de remboursement et résoudre rapidement vos préoccupations.`
      },
      
      eligibility: {
        title: "2. Conditions d'éligibilité",
        content: `Vous êtes éligible à un remboursement dans les situations suivantes :

✅ Remboursement intégral garanti :
• Commande annulée par le restaurant
• Livraison non effectuée dans les délais convenus
• Nourriture non conforme à la commande
• Problème de qualité avéré
• Erreur de facturation de notre part

⚠️ Remboursement partiel possible :
• Livraison en retard significatif (> 1h)
• Articles manquants dans la commande
• Température inappropriée des aliments
• Emballage endommagé
• Service client insatisfaisant

❌ Cas non éligibles :
• Changement d'avis après commande
• Retard dû à des conditions météorologiques extrêmes
• Adresse de livraison incorrecte fournie
• Absence du client à l'adresse indiquée
• Préférences gustatives personnelles

📋 Documentation requise :
• Photos en cas de problème de qualité
• Description détaillée du problème
• Numéro de commande obligatoire
• Signalement dans les délais impartis`
      },
      
      timeframes: {
        title: "3. Délais et échéances",
        content: `Respectez ces délais pour vos demandes de remboursement :

⏰ Délais de signalement :
• Problème de livraison : immédiatement à réception
• Qualité des aliments : dans l'heure suivant la livraison
• Articles manquants : dans les 2 heures
• Problème de facturation : dans les 24 heures
• Autres réclamations : dans les 48 heures maximum

🔄 Délais de traitement :
• Analyse de la demande : 2-4 heures
• Validation interne : 24 heures maximum
• Traitement du remboursement : 2-5 jours ouvrables
• Notification de confirmation : immédiate

📅 Délais de réception :
• MTN Mobile Money : 1-3 heures
• Orange Money : 2-6 heures
• Crédit compte EatFast : immédiat
• Nouvelle livraison : selon disponibilité

🚨 Demandes urgentes :
Pour les problèmes de sécurité alimentaire ou les erreurs graves, nous traitons les demandes en priorité dans l'heure.

⏳ Délais de prescription :
Aucune demande ne sera acceptée au-delà de 7 jours après la livraison initiale.`
      },
      
      process: {
        title: "4. Processus de remboursement",
        content: `Suivez ces étapes pour demander un remboursement :

📱 Via l'application mobile :
1. Accédez à votre historique de commandes
2. Sélectionnez la commande concernée
3. Cliquez sur "Signaler un problème"
4. Choisissez le type de problème
5. Ajoutez photos et description
6. Envoyez votre demande

☎️ Par téléphone :
• Appelez le +237 6XX XXX XXX
• Munissez-vous de votre numéro de commande
• Expliquez le problème à notre agent
• Suivez les instructions données
• Recevez un numéro de suivi

💬 Via le chat en ligne :
• Disponible 24h/7j sur notre site
• Réponse immédiate d'un agent
• Envoi de documents facilité
• Suivi en temps réel

📧 Par email :
• remboursement@eatfast.cm
• Objet : "Demande de remboursement - Commande #[numéro]"
• Joignez toutes les preuves nécessaires
• Réponse sous 6 heures maximum

🔍 Processus d'enquête :
1. Réception et accusé de réception immédiat
2. Vérification des informations fournies
3. Contact avec le restaurant si nécessaire
4. Analyse des preuves (photos, témoignages)
5. Décision et notification du résultat
6. Exécution du remboursement approuvé`
      },
      
      cancellation: {
        title: "5. Politique d'annulation",
        content: `Conditions d'annulation selon le statut de votre commande :

🟢 Commande confirmée (0-5 minutes) :
• Annulation gratuite et immédiate
• Remboursement intégral automatique
• Aucune justification requise
• Traitement en moins de 30 minutes

🟡 En préparation (5-20 minutes) :
• Annulation possible avec frais
• Remboursement de 80% du montant
• Frais de préparation retenus
• Confirmation du restaurant requise

🟠 En cours de livraison (20+ minutes) :
• Annulation très limitée
• Remboursement partiel uniquement
• Coordination avec le livreur nécessaire
• Frais de livraison non remboursés

🔴 Livré :
• Pas d'annulation possible
• Demande de remboursement pour problème qualité
• Procédure de réclamation standard
• Évaluation au cas par cas

🚫 Annulations abusives :
• Surveillance des annulations répétées
• Limitation temporaire après 3 annulations/mois
• Frais supplémentaires possibles
• Fermeture de compte en cas d'abus

💡 Conseils pour éviter l'annulation :
• Vérifiez votre commande avant validation
• Confirmez votre adresse de livraison
• Assurez-vous de votre disponibilité
• Contactez-nous en cas de doute`
      },
      
      exceptions: {
        title: "6. Exceptions et cas particuliers",
        content: `Situations particulières nécessitant un traitement spécial :

🌪️ Force majeure :
• Conditions météorologiques extrêmes
• Événements imprévisibles (accidents, manifestations)
• Pannes techniques majeures
• Situation d'urgence sanitaire
➜ Remboursement ou report de livraison offert

🍴 Allergies alimentaires :
• Signalement obligatoire lors de la commande
• Ingrédients non mentionnés par le restaurant
• Réaction allergique avérée
• Support médical si nécessaire
➜ Remboursement intégral + compensation

🏥 Urgences médicales :
• Hospitalisation soudaine
• Urgence familiale grave
• Certificat médical requis
• Délai de justification : 48h
➜ Remboursement intégral compassionnel

🔧 Problèmes techniques :
• Panne de l'application pendant la commande
• Erreur de géolocalisation
• Bug lors du paiement
• Problème de système de suivi
➜ Remboursement + bon d'achat offert

🎉 Événements spéciaux :
• Journées de forte affluence
• Promotions exceptionnelles
• Jours fériés
• Délais de livraison prolongés possibles
➜ Communication préalable + compensation si retard

⚖️ Litiges complexes :
• Désaccord sur la qualité
• Réclamations multiples
• Montants importants
• Médiation par notre service juridique
➜ Traitement personnalisé sous 7 jours`
      },
      
      'mobile-money': {
        title: "7. Remboursements Mobile Money",
        content: `Spécificités des remboursements via Mobile Money :

📱 MTN Mobile Money :
• Délai de remboursement : 1-3 heures
• Frais de transaction pris en charge par EatFast
• Vérification du numéro obligatoire
• Notification SMS de confirmation
• Limite : 500,000 FCFA par transaction

🍊 Orange Money :
• Délai de remboursement : 2-6 heures
• Traitement automatisé 24h/7j
• Aucun frais pour le client
• Accusé de réception immédiat
• Limite : 1,000,000 FCFA par transaction

🔐 Sécurité des transactions :
• Chiffrement de bout en bout
• Vérification d'identité renforcée
• Protection contre la fraude
• Historique détaillé disponible
• Support technique dédié

⚠️ Problèmes de remboursement Mobile Money :
• Numéro de téléphone inactif
• Compte Mobile Money suspendu
• Limite de réception dépassée
• Problème technique opérateur
➜ Crédit sur compte EatFast en alternative

💰 Limites et restrictions :
• Montant minimum : 500 FCFA
• Montant maximum par jour : selon opérateur
• Vérification KYC pour gros montants
• Délai supplémentaire pour montants > 100,000 FCFA

🔄 Remboursements exceptionnels :
• Virements bancaires pour très gros montants
• Chèques pour cas particuliers
• Crédit long terme sur compte
• Solutions personnalisées disponibles

📞 Support Mobile Money :
• Hotline dédiée : +237 6XX XXX XXX
• Support MTN : Option 1
• Support Orange : Option 2
• Assistance technique 24h/7j`
      },
      
      disputes: {
        title: "8. Résolution de litiges",
        content: `Processus de résolution en cas de désaccord :

🎯 Médiation interne :
• Escalade vers un superviseur
• Réévaluation du dossier
• Recherche de solution amiable
• Délai de résolution : 72 heures
• Communication transparente

👨‍⚖️ Arbitrage externe :
• Recours à un médiateur indépendant
• Procédure gratuite pour le client
• Expertise technique si nécessaire
• Décision contraignante pour EatFast
• Délai maximum : 15 jours

📋 Documentation requise :
• Historique complet des échanges
• Preuves photos/vidéos
• Témoignages de tiers si disponibles
• Factures et reçus
• Correspondances avec le support

🔍 Enquête approfondie :
• Vérification auprès du restaurant
• Interrogation du livreur
• Analyse des données de géolocalisation
• Examen des enregistrements téléphoniques
• Consultation d'experts si nécessaire

⚖️ Recours légaux :
• Information sur vos droits
• Assistance pour démarches judiciaires
• Coordination avec nos assurances
• Respect de la réglementation camerounaise
• Médiation par les autorités compétentes

🤝 Solutions alternatives :
• Bons d'achat compensatoires
• Services gratuits futurs
• Upgrade de statut client
• Partenariats privilégiés
• Solutions sur mesure

📊 Suivi et amélioration :
• Analyse des causes profondes
• Mise à jour des procédures
• Formation du personnel
• Prévention des récidives
• Retour d'expérience systématique`
      },
      
      contact: {
        title: "9. Nous contacter",
        content: `Plusieurs moyens pour nous contacter pour vos remboursements :

📞 Hotline remboursement :
• Numéro : +237 6XX XXX XXX
• Disponible 24h/7j
• Temps d'attente moyen : < 30 secondes
• Support multilingue (français, anglais)
• Escalade immédiate possible

📧 Email spécialisé :
• remboursement@eatfast.cm
• Réponse garantie sous 6h
• Accusé de réception automatique
• Suivi avec numéro de ticket
• Joindre preuves et documents

💬 Chat en ligne :
• Disponible sur site et app
• Agent dédié remboursements
• Partage de fichiers possible
• Historique des conversations
• Solution immédiate privilégiée

📱 Application mobile :
• Section "Aide et remboursement"
• Formulaire intégré
• Upload de photos facilité
• Suivi en temps réel
• Notifications push de mise à jour

🏢 Adresse postale :
• EatFast Cameroun
• Service Remboursements
• BP XXXX, Yaoundé
• Cameroun
• Délai de traitement : 5-7 jours

🌐 Réseaux sociaux :
• Facebook : @EatFastCameroun
• Twitter : @EatFastCM
• Instagram : @eatfast_cameroun
• Réponse publique sous 2h
• Message privé pour détails sensibles

⏰ Horaires de pointe :
• Lundi-Vendredi : 8h-20h (affluence normale)
• Samedi-Dimanche : 11h-22h (plus chargé)
• Jours fériés : service réduit
• Nuits : service d'urgence uniquement

🔔 Statut du service :
• Vérifiez status.eatfast.cm
• Maintenance planifiée annoncée
• Incidents techniques signalés
• Délais ajustés en conséquence`
      }
    },
    
    en: {
      title: "Refund Policy",
      subtitle: "Last updated: " + new Date().toLocaleDateString('en-US'),
      
      overview: {
        title: "1. Overview",
        content: `At EatFast, we are committed to providing an exceptional delivery experience. This refund policy details the conditions under which we can process refunds for our food delivery services.

💰 General principles:
• Full refund in case of problems on our part
• Fast and transparent processing
• Dedicated customer support for all cases
• Respect for announced deadlines

🔄 Types of refunds:
• Full refund (100%)
• Partial refund (case by case)
• Credit to your EatFast account
• New free delivery

📞 24/7 support available:
Our team is here to help you with any refund request and quickly resolve your concerns.`
      },
      
      eligibility: {
        title: "2. Eligibility Conditions",
        content: `You are eligible for a refund in the following situations:

✅ Full refund guaranteed:
• Order cancelled by restaurant
• Delivery not made within agreed timeframes
• Food not matching the order
• Proven quality issue
• Billing error on our part

⚠️ Partial refund possible:
• Significant delivery delay (> 1h)
• Missing items in order
• Inappropriate food temperature
• Damaged packaging
• Unsatisfactory customer service

❌ Non-eligible cases:
• Change of mind after ordering
• Delay due to extreme weather conditions
• Incorrect delivery address provided
• Customer absence at indicated address
• Personal taste preferences

📋 Required documentation:
• Photos in case of quality issues
• Detailed problem description
• Mandatory order number
• Reporting within deadlines`
      },
      
      timeframes: {
        title: "3. Deadlines and Timeframes",
        content: `Respect these deadlines for your refund requests:

⏰ Reporting deadlines:
• Delivery problem: immediately upon receipt
• Food quality: within the hour following delivery
• Missing items: within 2 hours
• Billing problem: within 24 hours
• Other complaints: within 48 hours maximum

🔄 Processing times:
• Request analysis: 2-4 hours
• Internal validation: 24 hours maximum
• Refund processing: 2-5 business days
• Confirmation notification: immediate

📅 Receipt times:
• MTN Mobile Money: 1-3 hours
• Orange Money: 2-6 hours
• EatFast account credit: immediate
• New delivery: according to availability

🚨 Urgent requests:
For food safety issues or serious errors, we process requests with priority within the hour.

⏳ Statute of limitations:
No request will be accepted beyond 7 days after initial delivery.`
      },
      
      process: {
        title: "4. Refund Process",
        content: `Follow these steps to request a refund:

📱 Via mobile app:
1. Access your order history
2. Select the concerned order
3. Click "Report a problem"
4. Choose the type of problem
5. Add photos and description
6. Send your request

☎️ By phone:
• Call +237 6XX XXX XXX
• Have your order number ready
• Explain the problem to our agent
• Follow given instructions
• Receive a tracking number

💬 Via online chat:
• Available 24/7 on our site
• Immediate agent response
• Easy document sending
• Real-time tracking

📧 By email:
• refund@eatfast.cm
• Subject: "Refund request - Order #[number]"
• Attach all necessary evidence
• Response within 6 hours maximum

🔍 Investigation process:
1. Receipt and immediate acknowledgment
2. Verification of provided information
3. Contact with restaurant if necessary
4. Evidence analysis (photos, testimonies)
5. Decision and result notification
6. Execution of approved refund`
      },
      
      cancellation: {
        title: "5. Cancellation Policy",
        content: `Cancellation conditions according to your order status:

🟢 Order confirmed (0-5 minutes):
• Free and immediate cancellation
• Automatic full refund
• No justification required
• Processing in less than 30 minutes

🟡 In preparation (5-20 minutes):
• Possible cancellation with fees
• 80% refund of amount
• Preparation fees retained
• Restaurant confirmation required

🟠 Being delivered (20+ minutes):
• Very limited cancellation
• Partial refund only
• Coordination with delivery person necessary
• Delivery fees not refunded

🔴 Delivered:
• No cancellation possible
• Refund request for quality issue
• Standard complaint procedure
• Case-by-case evaluation

🚫 Abusive cancellations:
• Monitoring of repeated cancellations
• Temporary limitation after 3 cancellations/month
• Possible additional fees
• Account closure in case of abuse

💡 Tips to avoid cancellation:
• Check your order before validation
• Confirm your delivery address
• Ensure your availability
• Contact us if in doubt`
      },
      
      exceptions: {
        title: "6. Exceptions and Special Cases",
        content: `Special situations requiring special treatment:

🌪️ Force majeure:
• Extreme weather conditions
• Unpredictable events (accidents, demonstrations)
• Major technical failures
• Health emergency situation
➜ Refund or free delivery postponement

🍴 Food allergies:
• Mandatory reporting when ordering
• Ingredients not mentioned by restaurant
• Proven allergic reaction
• Medical support if necessary
➜ Full refund + compensation

🏥 Medical emergencies:
• Sudden hospitalization
• Serious family emergency
• Medical certificate required
• Justification deadline: 48h
➜ Full compassionate refund

🔧 Technical problems:
• App failure during order
• Geolocation error
• Payment bug
• Tracking system problem
➜ Refund + free voucher

🎉 Special events:
• High traffic days
• Exceptional promotions
• Holidays
• Possible extended delivery times
➜ Prior communication + compensation if delay

⚖️ Complex disputes:
• Disagreement on quality
• Multiple complaints
• Large amounts
• Mediation by our legal service
➜ Personalized treatment within 7 days`
      },
      
      'mobile-money': {
        title: "7. Mobile Money Refunds",
        content: `Mobile Money refund specifics:

📱 MTN Mobile Money:
• Refund time: 1-3 hours
• Transaction fees covered by EatFast
• Number verification mandatory
• SMS confirmation notification
• Limit: 500,000 FCFA per transaction

🍊 Orange Money:
• Refund time: 2-6 hours
• Automated processing 24/7
• No fees for customer
• Immediate acknowledgment
• Limit: 1,000,000 FCFA per transaction

🔐 Transaction security:
• End-to-end encryption
• Enhanced identity verification
• Fraud protection
• Detailed history available
• Dedicated technical support

⚠️ Mobile Money refund issues:
• Inactive phone number
• Suspended Mobile Money account
• Reception limit exceeded
• Operator technical problem
➜ EatFast account credit as alternative

💰 Limits and restrictions:
• Minimum amount: 500 FCFA
• Maximum amount per day: per operator
• KYC verification for large amounts
• Additional delay for amounts > 100,000 FCFA

🔄 Exceptional refunds:
• Bank transfers for very large amounts
• Checks for special cases
• Long-term account credit
• Personalized solutions available

📞 Mobile Money support:
• Dedicated hotline: +237 6XX XXX XXX
• MTN support: Option 1
• Orange support: Option 2
• 24/7 technical assistance`
      },
      
      disputes: {
        title: "8. Dispute Resolution",
        content: `Resolution process in case of disagreement:

🎯 Internal mediation:
• Escalation to supervisor
• Case reevaluation
• Search for amicable solution
• Resolution time: 72 hours
• Transparent communication

👨‍⚖️ External arbitration:
• Recourse to independent mediator
• Free procedure for customer
• Technical expertise if necessary
• Binding decision for EatFast
• Maximum deadline: 15 days

📋 Required documentation:
• Complete exchange history
• Photo/video evidence
• Third-party testimonies if available
• Invoices and receipts
• Support correspondence

🔍 Thorough investigation:
• Restaurant verification
• Delivery person interrogation
• Geolocation data analysis
• Phone recording examination
• Expert consultation if necessary

⚖️ Legal recourse:
• Information about your rights
• Assistance for legal procedures
• Coordination with our insurance
• Compliance with Cameroonian regulation
• Mediation by competent authorities

🤝 Alternative solutions:
• Compensatory vouchers
• Free future services
• Customer status upgrade
• Privileged partnerships
• Tailor-made solutions

📊 Monitoring and improvement:
• Root cause analysis
• Procedure updates
• Staff training
• Recurrence prevention
• Systematic feedback`
      },
      
      contact: {
        title: "9. Contact Us",
        content: `Several ways to contact us for your refunds:

📞 Refund hotline:
• Number: +237 6XX XXX XXX
• Available 24/7
• Average wait time: < 30 seconds
• Multilingual support (French, English)
• Immediate escalation possible

📧 Specialized email:
• refund@eatfast.cm
• Response guaranteed within 6h
• Automatic acknowledgment
• Tracking with ticket number
• Attach evidence and documents

💬 Online chat:
• Available on site and app
• Dedicated refund agent
• File sharing possible
• Conversation history
• Immediate solution prioritized

📱 Mobile application:
• "Help and refund" section
• Integrated form
• Easy photo upload
• Real-time tracking
• Push update notifications

🏢 Postal address:
• EatFast Cameroon
• Refund Service
• PO Box XXXX, Yaoundé
• Cameroon
• Processing time: 5-7 days

🌐 Social media:
• Facebook: @EatFastCameroon
• Twitter: @EatFastCM
• Instagram: @eatfast_cameroon
• Public response within 2h
• Private message for sensitive details

⏰ Peak hours:
• Monday-Friday: 8am-8pm (normal traffic)
• Saturday-Sunday: 11am-10pm (busier)
• Holidays: reduced service
• Nights: emergency service only

🔔 Service status:
• Check status.eatfast.cm
• Planned maintenance announced
• Technical incidents reported
• Deadlines adjusted accordingly`
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
              <RefreshCw className="w-12 h-12 text-emerald-600 mr-4" />
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
                  <DollarSign className="w-5 h-5 text-emerald-600 mr-2" />
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

          {/* Emergency Contact Card */}
          <motion.div
            className={`mt-12 p-6 rounded-2xl ${
              darkMode
                ? 'bg-red-900/20 border-red-800'
                : 'bg-red-50 border-red-200'
            } border`}
            variants={itemVariants}
          >
            <div className="flex items-start space-x-3">
              <Phone className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-red-800 dark:text-red-200 mb-2">
                  {language === 'fr' ? 'Contact d\'urgence' : 'Emergency Contact'}
                </h3>
                <p className="text-red-700 dark:text-red-300 text-sm leading-relaxed">
                  {language === 'fr'
                    ? "Pour les problèmes urgents de sécurité alimentaire ou les erreurs graves, appelez immédiatement notre ligne d'urgence : +237 6XX XXX XXX (24h/7j)"
                    : "For urgent food safety issues or serious errors, immediately call our emergency line: +237 6XX XXX XXX (24/7)"
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

export default RefundPolicy;