import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Shield,
  Thermometer,
  Clock,
  AlertTriangle,
  CheckCircle,
  Users,
  Globe,
  Sun,
  Moon,
  Sparkles,
  Truck,
  ChefHat,
  FileCheck,
  Phone,
  Utensils
} from 'lucide-react';

const FoodSafety = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState('fr');
  const [activeSection, setActiveSection] = useState('commitment');

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
    { id: 'commitment', title: language === 'fr' ? 'Notre engagement' : 'Our Commitment', icon: Shield },
    { id: 'standards', title: language === 'fr' ? 'Standards' : 'Standards', icon: FileCheck },
    { id: 'preparation', title: language === 'fr' ? 'Préparation' : 'Preparation', icon: ChefHat },
    { id: 'temperature', title: language === 'fr' ? 'Température' : 'Temperature', icon: Thermometer },
    { id: 'delivery', title: language === 'fr' ? 'Livraison' : 'Delivery', icon: Truck },
    { id: 'packaging', title: language === 'fr' ? 'Emballage' : 'Packaging', icon: Utensils },
    { id: 'hygiene', title: language === 'fr' ? 'Hygiène' : 'Hygiene', icon: Users },
    { id: 'monitoring', title: language === 'fr' ? 'Surveillance' : 'Monitoring', icon: Clock },
    { id: 'emergency', title: language === 'fr' ? 'Urgences' : 'Emergency', icon: AlertTriangle },
    { id: 'contact', title: language === 'fr' ? 'Contact' : 'Contact', icon: Phone }
  ];

  const content = {
    fr: {
      title: "Sécurité alimentaire",
      subtitle: "Votre santé est notre priorité absolue",
      
      commitment: {
        title: "1. Notre engagement sécurité",
        content: `Chez EatFast, la sécurité alimentaire est au cœur de nos préoccupations. Nous nous engageons à offrir des aliments sûrs, frais et de qualité à tous nos clients.

🛡️ Nos principes fondamentaux :
• Sélection rigoureuse de nos restaurants partenaires
• Formation continue de notre équipe de livraison
• Respect strict des normes d'hygiène camerounaises
• Surveillance constante de la chaîne du froid
• Traçabilité complète de chaque commande

✅ Certifications et agréments :
• Conformité aux normes HACCP
• Certification du Ministère de la Santé Publique
• Agréments sanitaires de tous nos partenaires
• Audits qualité trimestriels
• Formation certifiante de notre personnel

🔍 Contrôle qualité permanent :
• Inspections surprise dans nos restaurants partenaires
• Tests de température lors des livraisons
• Vérification de l'état des emballages
• Suivi des délais de livraison
• Retours clients analysés quotidiennement

🚨 Système d'alerte rapide :
En cas de problème détecté, nous activons immédiatement notre protocole d'urgence pour protéger la santé de nos clients.`
      },
      
      standards: {
        title: "2. Standards et réglementations",
        content: `Nous appliquons les standards les plus élevés en matière de sécurité alimentaire :

🇨🇲 Réglementation camerounaise :
• Respect des lois sanitaires nationales
• Conformité aux arrêtés ministériels
• Application des normes CEMAC
• Respect du Code de la santé publique
• Mise en œuvre des guides de bonnes pratiques

🌍 Standards internationaux :
• Principes HACCP (Hazard Analysis Critical Control Points)
• Normes ISO 22000 (Système de management de la sécurité alimentaire)
• Recommandations OMS/FAO
• Bonnes pratiques de l'industrie alimentaire
• Standards de traçabilité alimentaire

📋 Documentation obligatoire :
• Certificats sanitaires de tous les restaurants
• Registres de température
• Plans de nettoyage et désinfection
• Procédures de gestion des non-conformités
• Dossiers de formation du personnel

🔬 Analyses et contrôles :
• Analyses microbiologiques périodiques
• Contrôles de pesticides et contaminants
• Vérifications des dates de péremption
• Tests de qualité de l'eau
• Analyses des surfaces de contact

⚖️ Responsabilité légale :
• Assurance responsabilité civile professionnelle
• Couverture des risques alimentaires
• Protocoles de gestion de crise
• Procédures de rappel de produits
• Coopération avec les autorités sanitaires`
      },
      
      preparation: {
        title: "3. Préparation des aliments",
        content: `Nos restaurants partenaires respectent des protocoles stricts de préparation :

👨‍🍳 Personnel qualifié :
• Formation obligatoire à l'hygiène alimentaire
• Certificat médical d'aptitude renouvelé annuellement
• Port d'équipements de protection (gants, charlotte, tablier)
• Lavage des mains selon protocole strict
• Interdiction de fumer et manger en cuisine

🧽 Nettoyage et désinfection :
• Nettoyage des surfaces toutes les 2 heures minimum
• Désinfection des ustensiles après chaque utilisation
• Changement des planches à découper par type d'aliment
• Nettoyage approfondi quotidien des équipements
• Utilisation de produits désinfectants agréés

🍖 Séparation des aliments :
• Zones distinctes pour viandes crues et cuites
• Séparation stricte végétarien/non-végétarien
• Stockage séparé des allergènes
• Ustensiles dédiés par type d'aliment
• Prévention de la contamination croisée

⏰ Gestion du temps :
• Préparation juste avant la livraison
• Respect des durées maximales de préparation
• Rotation "Premier entré, premier sorti"
• Surveillance des temps d'attente
• Rejet des préparations trop anciennes

📝 Traçabilité complète :
• Enregistrement de l'heure de préparation
• Identification du cuisinier responsable
• Suivi des ingrédients utilisés
• Documentation des températures de cuisson
• Archivage des données pendant 6 mois`
      },
      
      temperature: {
        title: "4. Contrôle des températures",
        content: `Le respect de la chaîne du froid est crucial pour votre sécurité :

🌡️ Températures de stockage :
• Produits surgelés : -18°C minimum
• Produits réfrigérés : 0°C à 4°C
• Légumes frais : 8°C à 10°C
• Produits secs : température ambiante contrôlée
• Contrôles automatiques avec alarmes

🔥 Températures de cuisson :
• Viandes : 63°C à cœur minimum
• Volailles : 75°C à cœur minimum
• Poissons : 60°C à cœur minimum
• Légumes : cuisson adaptée selon le type
• Vérification systématique au thermomètre

❄️ Refroidissement rapide :
• Descente de température sous 10°C en 2h
• Refroidissement à 4°C maximum en 6h
• Utilisation de cellules de refroidissement
• Surveillance continue des températures
• Respect strict des protocoles

🚚 Transport réfrigéré :
• Sacs isothermes pour toutes les livraisons
• Pains de glace renouvelés régulièrement
• Thermomètres dans chaque sac de livraison
• Formation des livreurs aux bonnes pratiques
• Contrôles aléatoires de température

📊 Monitoring en continu :
• Enregistreurs de température automatiques
• Alertes en cas de dépassement
• Rapports quotidiens de température
• Maintenance préventive des équipements
• Calibrage régulier des thermomètres

⚠️ Actions correctives :
• Procédures d'urgence en cas de rupture
• Élimination immédiate des produits défaillants
• Investigation des causes de dépassement
• Renforcement des contrôles
• Formation complémentaire si nécessaire`
      },
      
      delivery: {
        title: "5. Sécurité pendant la livraison",
        content: `Notre équipe de livraison garantit la sécurité jusqu'à votre porte :

🏍️ Équipement de livraison :
• Sacs isothermes professionnels certifiés
• Séparation chaud/froid dans les contenants
• Protection contre les chocs et vibrations
• Étanchéité garantie contre la pluie
• Nettoyage et désinfection quotidiens

👨‍💼 Formation des livreurs :
• Formation hygiène alimentaire obligatoire
• Sensibilisation aux bonnes pratiques
• Protocoles de manipulation des aliments
• Gestion des situations d'urgence
• Mise à jour continue des connaissances

⏱️ Respect des délais :
• Livraison dans les 45 minutes maximum
• Priorité aux plats chauds et surgelés
• Optimisation des tournées de livraison
• Système GPS pour suivi en temps réel
• Communication client en cas de retard

🧤 Hygiène personnelle :
• Port de gants jetables pour la manipulation
• Masque de protection si nécessaire
• Lavage des mains avant chaque livraison
• Tenue propre et professionnelle
• Contrôle sanitaire régulier

📱 Traçabilité de livraison :
• Géolocalisation en temps réel
• Horodatage de chaque étape
• Photo de la livraison si demandée
• Signature électronique du client
• Archivage des données de livraison

🆘 Protocole d'urgence :
• Procédure en cas d'accident de livraison
• Contact immédiat du service client
• Remplacement de la commande si nécessaire
• Déclaration aux autorités si requis
• Suivi médical si contamination suspectée`
      },
      
      packaging: {
        title: "6. Emballage sécurisé",
        content: `Nos emballages garantissent la sécurité et la qualité :

📦 Matériaux approuvés :
• Emballages alimentaires certifiés FDA/CE
• Absence de bisphénol A (BPA) et phtalates
• Matériaux recyclables et écologiques
• Résistance aux températures extrêmes
• Tests de migration réguliers

🔒 Étanchéité et protection :
• Fermeture hermétique de tous les contenants
• Protection contre les contaminations externes
• Séparation des sauces et accompagnements
• Emballage individuel des couverts
• Film plastique de protection si nécessaire

🏷️ Étiquetage complet :
• Nom du restaurant et du plat
• Liste complète des ingrédients
• Allergènes clairement identifiés
• Date et heure de préparation
• Instructions de conservation et consommation

♨️ Adaptation thermique :
• Emballages adaptés aux plats chauds
• Isolation thermique renforcée
• Évents pour évacuation de la vapeur
• Protection contre la condensation
• Maintien de la texture des aliments

🌱 Respect de l'environnement :
• Emballages biodégradables privilégiés
• Réduction des déchets plastiques
• Programme de recyclage des contenants
• Sensibilisation des clients au tri
• Innovation continue vers le zéro déchet

🔍 Contrôle qualité :
• Inspection visuelle de chaque emballage
• Vérification de l'intégrité avant livraison
• Tests d'étanchéité réguliers
• Contrôle de la propreté des contenants
• Traçabilité des lots d'emballages`
      },
      
      hygiene: {
        title: "7. Hygiène et formation",
        content: `L'hygiène est une priorité absolue pour tous nos collaborateurs :

🎓 Formation obligatoire :
• Formation hygiène de 14 heures pour tous
• Recyclage annuel des connaissances
• Évaluations pratiques régulières
• Certificat d'aptitude à l'hygiène alimentaire
• Formation continue aux nouveaux protocoles

🩺 Suivi médical :
• Visite médicale d'embauche obligatoire
• Contrôle de santé annuel
• Vaccination contre l'hépatite A recommandée
• Déclaration obligatoire des maladies infectieuses
• Arrêt de travail en cas de symptômes

🧼 Protocoles de lavage :
• Lavage des mains minimum 20 secondes
• Désinfection hydroalcoolique disponible partout
• Douche avant prise de poste en cuisine
• Changement de vêtements de travail quotidien
• Nettoyage des équipements de protection

👔 Tenue professionnelle :
• Vêtements de travail fournis et lavés
• Charlotte obligatoire en cuisine
• Chaussures de sécurité antidérapantes
• Gants jetables renouvelés fréquemment
• Tabliers étanches pour certains postes

🚫 Règles strictes :
• Interdiction de bijoux en cuisine
• Ongles courts et propres obligatoires
• Interdiction de fumer dans l'enceinte
• Pas d'animaux domestiques dans les locaux
• Consommation d'alcool strictement interdite

📋 Registres et contrôles :
• Carnet de santé du personnel
• Registre des formations effectuées
• Contrôles d'hygiène hebdomadaires
• Audit externe annuel
• Documentation mise à jour en permanence`
      },
      
      monitoring: {
        title: "8. Surveillance et contrôles",
        content: `Système de surveillance continue pour garantir la sécurité :

📊 Monitoring en temps réel :
• Surveillance 24h/7j des températures
• Alertes automatiques en cas d'anomalie
• Tableaux de bord en temps réel
• Rapports automatisés quotidiens
• Historique complet des données

🔍 Inspections régulières :
• Audit qualité mensuel de chaque restaurant
• Inspections surprises hebdomadaires
• Contrôles des livreurs en cours de service
• Vérification des procédures d'hygiène
• Évaluation de la satisfaction client

🧪 Analyses laboratoire :
• Prélèvements microbiologiques trimestriels
• Tests de surface et d'environnement
• Analyses d'eau et de matières premières
• Contrôles des résidus de nettoyage
• Recherche de pathogènes spécifiques

📈 Indicateurs de performance :
• Taux de conformité des températures
• Nombre d'incidents déclarés
• Délais moyens de livraison
• Satisfaction client sur la qualité
• Pourcentage de formations réalisées

🚨 Système d'alerte :
• Notification immédiate des responsables
• Escalade automatique selon la gravité
• Procédures d'urgence activées
• Communication vers les parties prenantes
• Traçabilité complète des actions

📝 Documentation complète :
• Dossiers d'inspection archivés 5 ans
• Rapports d'analyse conservés
• Registres de maintenance équipements
• Historique des formations du personnel
• Base de données des incidents`
      },
      
      emergency: {
        title: "9. Gestion d'urgence",
        content: `Procédures d'urgence pour protéger votre santé :

🚨 Détection d'incidents :
• Signalement client 24h/7j
• Détection automatique d'anomalies
• Surveillance des réseaux sociaux
• Alertes des autorités sanitaires
• Remontées des restaurants partenaires

⚡ Réaction immédiate :
• Activation du plan d'urgence en 15 minutes
• Isolement des produits suspects
• Arrêt temporaire des livraisons si nécessaire
• Information immédiate des clients concernés
• Coordination avec les autorités compétentes

🔬 Investigation rapide :
• Équipe d'enquête mobilisée sous 2h
• Prélèvements et analyses d'urgence
• Identification de la source du problème
• Évaluation des risques pour la santé
• Détermination de l'étendue de la contamination

📢 Communication de crise :
• Information transparente des clients
• Communication vers les médias si nécessaire
• Mise à jour régulière sur nos canaux
• Collaboration avec les autorités
• Gestion de la réputation et de la confiance

🏥 Support médical :
• Orientation vers les services de santé
• Prise en charge des frais médicaux si responsabilité
• Suivi médical des victimes
• Collaboration avec les médecins traitants
• Support psychologique si nécessaire

🔄 Retour d'expérience :
• Analyse complète des causes
• Mise à jour des procédures
• Formation complémentaire des équipes
• Renforcement des contrôles
• Prévention de la récidive

📋 Plan de continuité :
• Maintien du service avec partenaires sûrs
• Réapprovisionnement d'urgence
• Communication rassurante aux clients
• Reconstruction de la confiance
• Amélioration continue des processus`
      },
      
      contact: {
        title: "10. Contact sécurité alimentaire",
        content: `Contactez-nous pour toute préoccupation de sécurité alimentaire :

🆘 Urgence sécurité alimentaire :
• Hotline 24h/7j : +237 6XX XXX XXX
• Email urgent : securite@eatfast.cm
• Réponse immédiate garantie
• Escalade automatique vers le responsable
• Activation du protocole d'urgence

👨‍⚕️ Responsable sécurité alimentaire :
• Dr. Jean KAMGA - Vétérinaire sanitaire
• Email : dr.kamga@eatfast.cm
• Téléphone direct : +237 6XX XXX XXX
• Bureau : Yaoundé, Quartier Administratif
• Consultation sur rendez-vous

📧 Signalement de problèmes :
• hygiene@eatfast.cm pour questions générales
• incident@eatfast.cm pour signaler un problème
• suggestion@eatfast.cm pour améliorer nos pratiques
• Formation continue de nos équipes
• Retour client pris en compte systématiquement

📱 Application mobile :
• Section "Sécurité alimentaire"
• Signalement direct d'incidents
• Upload de photos facilité
• Géolocalisation automatique
• Suivi en temps réel de votre signalement

🏢 Partenariats institutionnels :
• Ministère de la Santé Publique du Cameroun
• Direction de l'Hygiène et de l'Assainissement
• Laboratoire National de Santé Publique
• Organisation Mondiale de la Santé (OMS)
• Centres de contrôle des maladies

🌐 Transparence totale :
• Rapports de sécurité alimentaire publiés
• Statistiques mensuelles disponibles
• Accès aux certificats et agréments
• Historique des incidents et résolutions
• Politique de porte ouverte

📚 Ressources éducatives :
• Guides de bonnes pratiques clients
• Conseils conservation des aliments
• Information sur les allergènes
• Sensibilisation aux risques alimentaires
• Formations ouvertes au public

⚖️ Médiation et recours :
• Service de médiation indépendant
• Procédure de réclamation formelle
• Recours auprès des autorités sanitaires
• Assistance juridique si nécessaire
• Indemnisation selon responsabilité établie`
      }
    },
    
    en: {
      title: "Food Safety",
      subtitle: "Your health is our absolute priority",
      
      commitment: {
        title: "1. Our Safety Commitment",
        content: `At EatFast, food safety is at the heart of our concerns. We are committed to providing safe, fresh, and quality food to all our customers.

🛡️ Our fundamental principles:
• Rigorous selection of our partner restaurants
• Continuous training of our delivery team
• Strict compliance with Cameroonian hygiene standards
• Constant monitoring of the cold chain
• Complete traceability of each order

✅ Certifications and approvals:
• HACCP standards compliance
• Ministry of Public Health certification
• Sanitary approvals of all our partners
• Quarterly quality audits
• Certified training of our staff

🔍 Permanent quality control:
• Surprise inspections at our partner restaurants
• Temperature tests during deliveries
• Packaging condition verification
• Delivery time monitoring
• Customer feedback analyzed daily

🚨 Rapid alert system:
In case of detected problems, we immediately activate our emergency protocol to protect our customers' health.`
      },
      
      standards: {
        title: "2. Standards and Regulations",
        content: `We apply the highest standards in food safety:

🇨🇲 Cameroonian regulations:
• Compliance with national health laws
• Conformity to ministerial decrees
• Application of CEMAC standards
• Respect for Public Health Code
• Implementation of good practice guides

🌍 International standards:
• HACCP principles (Hazard Analysis Critical Control Points)
• ISO 22000 standards (Food Safety Management System)
• WHO/FAO recommendations
• Food industry best practices
• Food traceability standards

📋 Mandatory documentation:
• Sanitary certificates from all restaurants
• Temperature records
• Cleaning and disinfection plans
• Non-conformity management procedures
• Staff training files

🔬 Analyses and controls:
• Periodic microbiological analyses
• Pesticide and contaminant controls
• Expiration date verifications
• Water quality tests
• Contact surface analyses

⚖️ Legal responsibility:
• Professional liability insurance
• Food risk coverage
• Crisis management protocols
• Product recall procedures
• Cooperation with health authorities`
      },
      
      preparation: {
        title: "3. Food Preparation",
        content: `Our partner restaurants follow strict preparation protocols:

👨‍🍳 Qualified personnel:
• Mandatory food hygiene training
• Annual medical fitness certificate
• Wearing protective equipment (gloves, hair net, apron)
• Hand washing according to strict protocol
• No smoking or eating in kitchen

🧽 Cleaning and disinfection:
• Surface cleaning every 2 hours minimum
• Utensil disinfection after each use
• Cutting board changes by food type
• Daily thorough equipment cleaning
• Use of approved disinfectants

🍖 Food separation:
• Distinct areas for raw and cooked meats
• Strict vegetarian/non-vegetarian separation
• Separate allergen storage
• Dedicated utensils by food type
• Cross-contamination prevention

⏰ Time management:
• Preparation just before delivery
• Respect for maximum preparation times
• "First in, first out" rotation
• Wait time monitoring
• Rejection of too old preparations

📝 Complete traceability:
• Recording of preparation time
• Identification of responsible cook
• Tracking of ingredients used
• Cooking temperature documentation
• Data archiving for 6 months`
      },
      
      temperature: {
        title: "4. Temperature Control",
        content: `Respecting the cold chain is crucial for your safety:

🌡️ Storage temperatures:
• Frozen products: -18°C minimum
• Refrigerated products: 0°C to 4°C
• Fresh vegetables: 8°C to 10°C
• Dry products: controlled room temperature
• Automatic controls with alarms

🔥 Cooking temperatures:
• Meats: 63°C at core minimum
• Poultry: 75°C at core minimum
• Fish: 60°C at core minimum
• Vegetables: cooking adapted by type
• Systematic thermometer verification

❄️ Rapid cooling:
• Temperature drop below 10°C in 2h
• Cooling to 4°C maximum in 6h
• Use of cooling cells
• Continuous temperature monitoring
• Strict protocol compliance

🚚 Refrigerated transport:
• Insulated bags for all deliveries
• Ice packs renewed regularly
• Thermometers in each delivery bag
• Driver training in good practices
• Random temperature checks

📊 Continuous monitoring:
• Automatic temperature recorders
• Alerts in case of exceedance
• Daily temperature reports
• Preventive equipment maintenance
• Regular thermometer calibration

⚠️ Corrective actions:
• Emergency procedures in case of breakdown
• Immediate elimination of defective products
• Investigation of exceedance causes
• Control reinforcement
• Additional training if necessary`
      },
      
      delivery: {
        title: "5. Safety During Delivery",
        content: `Our delivery team ensures safety to your door:

🏍️ Delivery equipment:
• Certified professional insulated bags
• Hot/cold separation in containers
• Protection against shocks and vibrations
• Guaranteed waterproofing against rain
• Daily cleaning and disinfection

👨‍💼 Driver training:
• Mandatory food hygiene training
• Good practice awareness
• Food handling protocols
• Emergency situation management
• Continuous knowledge updates

⏱️ Deadline compliance:
• Delivery within 45 minutes maximum
• Priority to hot and frozen dishes
• Delivery route optimization
• GPS system for real-time tracking
• Customer communication if delayed

🧤 Personal hygiene:
• Disposable gloves for handling
• Protective mask if necessary
• Hand washing before each delivery
• Clean and professional attire
• Regular health check

📱 Delivery traceability:
• Real-time geolocation
• Time stamping of each step
• Delivery photo if requested
• Customer electronic signature
• Delivery data archiving

🆘 Emergency protocol:
• Procedure in case of delivery accident
• Immediate customer service contact
• Order replacement if necessary
• Authority declaration if required
• Medical follow-up if contamination suspected`
      },
      
      packaging: {
        title: "6. Secure Packaging",
        content: `Our packaging guarantees safety and quality:

📦 Approved materials:
• FDA/CE certified food packaging
• BPA and phthalate free
• Recyclable and ecological materials
• Extreme temperature resistance
• Regular migration tests

🔒 Sealing and protection:
• Hermetic closure of all containers
• Protection against external contamination
• Separation of sauces and accompaniments
• Individual cutlery packaging
• Protective plastic film if necessary

🏷️ Complete labeling:
• Restaurant and dish name
• Complete ingredient list
• Clearly identified allergens
• Preparation date and time
• Storage and consumption instructions

♨️ Thermal adaptation:
• Packaging adapted to hot dishes
• Reinforced thermal insulation
• Vents for vapor evacuation
• Condensation protection
• Food texture maintenance

🌱 Environmental respect:
• Biodegradable packaging preferred
• Plastic waste reduction
• Container recycling program
• Customer awareness of sorting
• Continuous innovation towards zero waste

🔍 Quality control:
• Visual inspection of each package
• Integrity verification before delivery
• Regular sealing tests
• Container cleanliness control
• Packaging batch traceability`
      },
      
      hygiene: {
        title: "7. Hygiene and Training",
        content: `Hygiene is an absolute priority for all our collaborators:

🎓 Mandatory training:
• 14-hour hygiene training for everyone
• Annual knowledge refresher
• Regular practical evaluations
• Food hygiene aptitude certificate
• Continuous training on new protocols

🩺 Medical monitoring:
• Mandatory pre-employment medical examination
• Annual health check
• Hepatitis A vaccination recommended
• Mandatory declaration of infectious diseases
• Sick leave in case of symptoms

🧼 Washing protocols:
• Hand washing minimum 20 seconds
• Hydroalcoholic disinfection available everywhere
• Shower before kitchen duty
• Daily work clothing change
• Protective equipment cleaning

👔 Professional attire:
• Work clothes provided and washed
• Mandatory hair net in kitchen
• Non-slip safety shoes
• Disposable gloves frequently renewed
• Waterproof aprons for certain positions

🚫 Strict rules:
• No jewelry in kitchen
• Short and clean nails mandatory
• No smoking on premises
• No pets in facilities
• Alcohol consumption strictly forbidden

📋 Registers and controls:
• Staff health record
• Training log
• Weekly hygiene checks
• Annual external audit
• Documentation continuously updated`
      },
      
      monitoring: {
        title: "8. Monitoring and Controls",
        content: `Continuous monitoring system to guarantee safety:

📊 Real-time monitoring:
• 24/7 temperature surveillance
• Automatic alerts in case of anomaly
• Real-time dashboards
• Daily automated reports
• Complete data history

🔍 Regular inspections:
• Monthly quality audit of each restaurant
• Weekly surprise inspections
• Driver checks during service
• Hygiene procedure verification
• Customer satisfaction evaluation

🧪 Laboratory analyses:
• Quarterly microbiological sampling
• Surface and environment tests
• Water and raw material analyses
• Cleaning residue controls
• Specific pathogen research

📈 Performance indicators:
• Temperature compliance rate
• Number of reported incidents
• Average delivery times
• Customer satisfaction on quality
• Percentage of completed training

🚨 Alert system:
• Immediate notification of managers
• Automatic escalation by severity
• Emergency procedures activated
• Communication to stakeholders
• Complete action traceability

📝 Complete documentation:
• Inspection files archived 5 years
• Analysis reports kept
• Equipment maintenance registers
• Staff training history
• Incident database`
      },
      
      emergency: {
        title: "9. Emergency Management",
        content: `Emergency procedures to protect your health:

🚨 Incident detection:
• 24/7 customer reporting
• Automatic anomaly detection
• Social media monitoring
• Health authority alerts
• Partner restaurant reports

⚡ Immediate reaction:
• Emergency plan activation in 15 minutes
• Suspect product isolation
• Temporary delivery stop if necessary
• Immediate information to concerned customers
• Coordination with competent authorities

🔬 Rapid investigation:
• Investigation team mobilized within 2h
• Emergency sampling and analyses
• Problem source identification
• Health risk assessment
• Contamination extent determination

📢 Crisis communication:
• Transparent customer information
• Media communication if necessary
• Regular updates on our channels
• Collaboration with authorities
• Reputation and trust management

🏥 Medical support:
• Orientation to health services
• Medical expense coverage if responsible
• Victim medical follow-up
• Collaboration with treating physicians
• Psychological support if necessary

🔄 Feedback:
• Complete cause analysis
• Procedure updates
• Additional team training
• Control reinforcement
• Recurrence prevention

📋 Continuity plan:
• Service maintenance with safe partners
• Emergency restocking
• Reassuring customer communication
• Trust rebuilding
• Continuous process improvement`
      },
      
      contact: {
        title: "10. Food Safety Contact",
        content: `Contact us for any food safety concern:

🆘 Food safety emergency:
• 24/7 hotline: +237 6XX XXX XXX
• Urgent email: safety@eatfast.cm
• Immediate response guaranteed
• Automatic escalation to manager
• Emergency protocol activation

👨‍⚕️ Food safety manager:
• Dr. Jean KAMGA - Veterinary health officer
• Email: dr.kamga@eatfast.cm
• Direct phone: +237 6XX XXX XXX
• Office: Yaoundé, Administrative Quarter
• Consultation by appointment

📧 Problem reporting:
• hygiene@eatfast.cm for general questions
• incident@eatfast.cm to report a problem
• suggestion@eatfast.cm to improve our practices
• Continuous training of our teams
• Customer feedback systematically considered

📱 Mobile application:
• "Food Safety" section
• Direct incident reporting
• Easy photo upload
• Automatic geolocation
• Real-time tracking of your report

🏢 Institutional partnerships:
• Ministry of Public Health of Cameroon
• Directorate of Hygiene and Sanitation
• National Public Health Laboratory
• World Health Organization (WHO)
• Disease Control Centers

🌐 Total transparency:
• Published food safety reports
• Monthly statistics available
• Access to certificates and approvals
• Incident and resolution history
• Open door policy

📚 Educational resources:
• Customer good practice guides
• Food storage advice
• Allergen information
• Food risk awareness
• Public training available

⚖️ Mediation and recourse:
• Independent mediation service
• Formal complaint procedure
• Recourse to health authorities
• Legal assistance if necessary
• Compensation according to established responsibility`
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
                  <Shield className="w-5 h-5 text-emerald-600 mr-2" />
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

          {/* Safety Guarantee Card */}
          <motion.div
            className={`mt-12 p-6 rounded-2xl ${
              darkMode
                ? 'bg-emerald-900/20 border-emerald-800'
                : 'bg-emerald-50 border-emerald-200'
            } border`}
            variants={itemVariants}
          >
            <div className="flex items-start space-x-3">
              <Shield className="w-6 h-6 text-emerald-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-emerald-800 dark:text-emerald-200 mb-2">
                  {language === 'fr' ? 'Garantie sécurité' : 'Safety Guarantee'}
                </h3>
                <p className="text-emerald-700 dark:text-emerald-300 text-sm leading-relaxed">
                  {language === 'fr'
                    ? "Nous garantissons la sécurité alimentaire de tous nos produits. En cas de problème de santé lié à une commande EatFast, nous prenons en charge les frais médicaux et garantissons une indemnisation rapide selon notre responsabilité."
                    : "We guarantee the food safety of all our products. In case of health problems related to an EatFast order, we cover medical costs and guarantee rapid compensation according to our responsibility."
                  }
                </p>
              </div>
            </div>
          </motion.div>

          {/* Certification Display */}
          <motion.div
            className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4"
            variants={containerVariants}
          >
            {[
              { name: 'HACCP', icon: FileCheck },
              { name: 'ISO 22000', icon: Shield },
              { name: language === 'fr' ? 'Min. Santé' : 'Health Min.', icon: CheckCircle },
              { name: 'OMS/WHO', icon: Globe }
            ].map((cert, index) => (
              <motion.div
                key={cert.name}
                variants={itemVariants}
                className={`p-4 rounded-xl text-center ${
                  darkMode
                    ? 'bg-gray-800/30 border-gray-700'
                    : 'bg-white/30 border-gray-200'
                } border backdrop-blur-sm`}
                whileHover={{ scale: 1.05, y: -5 }}
              >
                <cert.icon className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
                <p className="text-sm font-semibold">{cert.name}</p>
                <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  {language === 'fr' ? 'Certifié' : 'Certified'}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default FoodSafety;