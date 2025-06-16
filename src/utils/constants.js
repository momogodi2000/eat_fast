// src/utils/constants.js

// Partner Types
export const PARTNER_TYPES = {
  RESTAURANT: 'restaurant',
  DELIVERY_AGENT: 'delivery-agent',
  INVESTOR: 'investor',
  OTHER: 'other'
};

// Application Status
export const APPLICATION_STATUS = {
  PENDING: 'pending',
  IN_REVIEW: 'in_review',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  REQUIRES_DOCUMENTS: 'requires_documents'
};

// Legal Status Options
export const LEGAL_STATUS_OPTIONS = [
  { value: 'sole_proprietor', label: 'Entreprise individuelle' },
  { value: 'llc', label: 'Société à responsabilité limitée' },
  { value: 'corporation', label: 'Corporation' }
];

// Vehicle Type Options
export const VEHICLE_TYPE_OPTIONS = [
  { value: 'motorcycle', label: 'Moto' },
  { value: 'bicycle', label: 'Vélo' },
  { value: 'car', label: 'Voiture' },
  { value: 'scooter', label: 'Scooter' }
];

// Investment Type Options
export const INVESTMENT_TYPE_OPTIONS = [
  { value: 'franchise', label: 'Franchise' },
  { value: 'equity', label: 'Participation au capital' },
  { value: 'debt', label: 'Financement par dette' }
];

// Service Type Options
export const SERVICE_TYPE_OPTIONS = [
  { value: 'consulting', label: 'Services de conseil' },
  { value: 'technology', label: 'Services technologiques' },
  { value: 'marketing', label: 'Services marketing' },
  { value: 'logistics', label: 'Services logistiques' }
];

// Utility Functions
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const formatCurrency = (amount, currency = 'FCFA') => {
  return new Intl.NumberFormat('fr-FR').format(amount) + ' ' + currency;
};

export const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('fr-FR');
};

export const getPartnerTypeIcon = (type) => {
  const icons = {
    restaurant: '🍽️',
    'delivery-agent': '🚚',
    investor: '💰',
    other: '🏢'
  };
  return icons[type] || '📄';
};

export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isValidPhone = (phone) => {
  const phoneRegex = /^[\+]?[\d\s\-\(\)]{8,}$/;
  return phoneRegex.test(phone);
};

export const getFieldLabel = (fieldName) => {
  const labels = {
    businessName: 'Nom de l\'entreprise',
    contactName: 'Nom du contact',
    email: 'Email',
    phone: 'Téléphone',
    address: 'Adresse',
    city: 'Ville',
    cuisineType: 'Type de cuisine',
    capacity: 'Capacité',
    openingHours: 'Heures d\'ouverture',
    legalStatus: 'Statut juridique',
    taxId: 'Numéro fiscal',
    vehicleType: 'Type de véhicule',
    drivingLicense: 'Permis de conduire',
    investmentAmount: 'Montant d\'investissement',
    investmentType: 'Type d\'investissement',
    businessExperience: 'Expérience commerciale',
    serviceType: 'Type de service',
    healthCertificate: 'Certificat de santé',
    idDocument: 'Pièce d\'identité',
    menu: 'Menu',
    drivingLicenseDoc: 'Permis de conduire',
    vehicleRegistration: 'Carte grise',
    businessPlan: 'Plan d\'affaires',
    financialStatements: 'États financiers',
    photos: 'Photos'
  };
  return labels[fieldName] || fieldName;
};

export const isFieldRequired = (fieldName, partnerType) => {
  const requiredFields = {
    restaurant: [
      'businessName', 'contactName', 'email', 'phone', 'address', 'city',
      'cuisineType', 'capacity', 'openingHours', 'legalStatus', 'taxId'
    ],
    'delivery-agent': [
      'contactName', 'email', 'phone', 'address', 'city', 
      'vehicleType', 'drivingLicense'
    ],
    investor: [
      'contactName', 'email', 'phone', 'investmentAmount', 
      'investmentType', 'businessExperience'
    ],
    other: [
      'contactName', 'email', 'phone', 'serviceType', 'businessExperience'
    ]
  };
  
  return requiredFields[partnerType]?.includes(fieldName) || false;
};

export const isDocumentRequired = (documentName, partnerType) => {
  const requiredDocs = {
    restaurant: ['idDocument', 'healthCertificate'],
    'delivery-agent': ['idDocument', 'drivingLicenseDoc'],
    investor: ['idDocument', 'businessPlan'],
    other: ['idDocument']
  };
  
  return requiredDocs[partnerType]?.includes(documentName) || false;
};