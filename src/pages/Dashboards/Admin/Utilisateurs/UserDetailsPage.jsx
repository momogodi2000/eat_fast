import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiX, FiUser, FiMail, FiPhone, FiMapPin, FiShield, FiFileText,
  FiEdit2, FiCalendar, FiPackage, FiStar, FiActivity, FiCheckCircle,
  FiXCircle, FiAlertTriangle, FiInfo, FiDownload, FiEye, FiTrash2,
  FiArrowLeft, FiClock, FiTrendingUp, FiTrendingDown, FiZap
} from 'react-icons/fi';

// Constants
const USER_ROLES = {
  CLIENT: 'client',
  AGENT_SUPPORT: 'agent_support', 
  ADMINISTRATOR: 'administrator',
  RESTAURANT_MANAGER: 'restaurant_manager',
  DELIVERY_AGENT: 'delivery_agent'
};

const USER_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive', 
  PENDING: 'pending',
  SUSPENDED: 'suspended',
  REJECTED: 'rejected'
};

const DOCUMENT_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved', 
  REJECTED: 'rejected',
  NEEDS_REVIEW: 'needs_review'
};

// Role Configuration
const getRoleConfig = (role) => {
  const configs = {
    [USER_ROLES.CLIENT]: {
      icon: FiUser,
      color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      label: 'Client',
      documentsRequired: [],
      canManage: ['profile']
    },
    [USER_ROLES.AGENT_SUPPORT]: {
      icon: FiShield,
      color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
      label: 'Agent Support',
      documentsRequired: ['education_certificate', 'language_proficiency'],
      canManage: ['clients', 'tickets']
    },
    [USER_ROLES.ADMINISTRATOR]: {
      icon: FiShield,
      color: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20',
      label: 'Administrateur',
      documentsRequired: [],
      canManage: ['all']
    },
    [USER_ROLES.RESTAURANT_MANAGER]: {
      icon: FiPackage,
      color: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
      bgColor: 'bg-orange-50 dark:bg-orange-900/20',
      label: 'Gestionnaire Restaurant',
      documentsRequired: ['business_license', 'health_certificate', 'menu', 'id_document'],
      canManage: ['restaurant', 'orders', 'menu']
    },
    [USER_ROLES.DELIVERY_AGENT]: {
      icon: FiActivity,
      color: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200',
      bgColor: 'bg-indigo-50 dark:bg-indigo-900/20',
      label: 'Agent Livreur',
      documentsRequired: ['driving_license', 'vehicle_registration', 'id_document'],
      canManage: ['deliveries', 'profile']
    }
  };
  return configs[role] || configs[USER_ROLES.CLIENT];
};

// Document Requirements by Role
const getDocumentRequirements = (role) => {
  const requirements = {
    [USER_ROLES.AGENT_SUPPORT]: [
      { key: 'education_certificate', label: 'Certificat d\'éducation', required: true, description: 'Diplôme ou certificat d\'études' },
      { key: 'language_proficiency', label: 'Preuve de maîtrise Français/Anglais', required: true, description: 'Certificat de compétence linguistique' }
    ],
    [USER_ROLES.RESTAURANT_MANAGER]: [
      { key: 'business_license', label: 'Licence commerciale', required: true, description: 'Autorisation d\'exploitation commerciale' },
      { key: 'health_certificate', label: 'Certificat de santé', required: true, description: 'Certificat sanitaire valide' },
      { key: 'menu', label: 'Menu/Liste de prix', required: true, description: 'Menu actuel avec prix' },
      { key: 'id_document', label: 'Pièce d\'identité', required: true, description: 'Carte d\'identité ou passeport' }
    ],
    [USER_ROLES.DELIVERY_AGENT]: [
      { key: 'driving_license', label: 'Permis de conduire', required: true, description: 'Permis de conduire valide' },
      { key: 'vehicle_registration', label: 'Carte grise', required: true, description: 'Carte grise du véhicule' },
      { key: 'id_document', label: 'Pièce d\'identité', required: true, description: 'Carte d\'identité ou passeport' }
    ]
  };
  return requirements[role] || [];
};

// User Status Badge Component
const UserStatusBadge = ({ status }) => {
  const getStatusConfig = (status) => {
    switch (status) {
      case USER_STATUS.ACTIVE:
        return {
          bg: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
          icon: FiCheckCircle,
          label: 'Actif'
        };
      case USER_STATUS.PENDING:
        return {
          bg: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
          icon: FiClock,
          label: 'En attente'
        };
      case USER_STATUS.SUSPENDED:
        return {
          bg: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
          icon: FiAlertTriangle,
          label: 'Suspendu'
        };
      case USER_STATUS.REJECTED:
        return {
          bg: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
          icon: FiXCircle,
          label: 'Rejeté'
        };
      default:
        return {
          bg: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
          icon: FiUser,
          label: 'Inactif'
        };
    }
  };

  const config = getStatusConfig(status);
  const Icon = config.icon;

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${config.bg}`}>
      <Icon size={14} className="mr-1" />
      {config.label}
    </span>
  );
};

// Document Status Badge Component
const DocumentStatusBadge = ({ status }) => {
  const getStatusConfig = (status) => {
    switch (status) {
      case DOCUMENT_STATUS.APPROVED:
        return {
          bg: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
          icon: FiCheckCircle,
          label: 'Approuvé'
        };
      case DOCUMENT_STATUS.REJECTED:
        return {
          bg: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
          icon: FiXCircle,
          label: 'Rejeté'
        };
      case DOCUMENT_STATUS.NEEDS_REVIEW:
        return {
          bg: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
          icon: FiAlertTriangle,
          label: 'Nécessite révision'
        };
      default:
        return {
          bg: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
          icon: FiClock,
          label: 'En attente'
        };
    }
  };

  const config = getStatusConfig(status);
  const Icon = config.icon;

  return (
    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${config.bg}`}>
      <Icon size={12} className="mr-1" />
      {config.label}
    </span>
  );
};

const UserDetailsPage = ({ user, isOpen, onClose, onEdit, onDocumentReview }) => {
  const [activeTab, setActiveTab] = useState('overview');

  const formatDate = (date) => {
    if (!date) return 'Non spécifié';
    return new Date(date).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (!isOpen || !user) return null;

  const roleConfig = getRoleConfig(user.role);
  const documentRequirements = getDocumentRequirements(user.role);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 overflow-y-auto"
      >
        <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
            onClick={onClose}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="inline-block w-full max-w-6xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white dark:bg-gray-800 shadow-xl rounded-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <button
                  onClick={onClose}
                  className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                >
                  <FiArrowLeft size={20} />
                </button>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Détails de l'utilisateur
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    ID: {user.id}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => onEdit(user)}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors flex items-center space-x-2"
                >
                  <FiEdit2 size={16} />
                  <span>Modifier</span>
                </button>
                <button
                  onClick={onClose}
                  className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                >
                  <FiX size={24} />
                </button>
              </div>
            </div>

            {/* User Info Header */}
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-xl p-6 mb-6">
              <div className="flex items-center space-x-6">
                <div className="w-20 h-20 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center">
                  <span className="text-white font-bold text-xl">
                    {user.first_name?.charAt(0)}{user.last_name?.charAt(0)}
                  </span>
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {user.first_name} {user.last_name}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-2">
                    {user.email}
                  </p>
                  <div className="flex items-center space-x-4">
                    <UserStatusBadge status={user.status} />
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${roleConfig.color}`}>
                      {roleConfig.label}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Membre depuis</p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {formatDate(user.createdAt)}
                  </p>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
              <nav className="flex space-x-8">
                {[
                  { id: 'overview', label: 'Aperçu', icon: FiUser },
                  { id: 'documents', label: 'Documents', icon: FiFileText },
                  { id: 'activity', label: 'Activité', icon: FiActivity }
                ].map(tab => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                        activeTab === tab.id
                          ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                          : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                      }`}
                    >
                      <Icon size={16} />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Tab Content */}
            <div className="min-h-[400px]">
              {activeTab === 'overview' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="grid grid-cols-1 lg:grid-cols-2 gap-6"
                >
                  {/* Personal Information */}
                  <div className="bg-white dark:bg-gray-700 rounded-xl p-6 border border-gray-200 dark:border-gray-600">
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                      <FiUser className="mr-2" size={20} />
                      Informations personnelles
                    </h4>
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span className="text-gray-500 dark:text-gray-400">Prénom</span>
                        <span className="font-medium text-gray-900 dark:text-white">{user.first_name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500 dark:text-gray-400">Nom</span>
                        <span className="font-medium text-gray-900 dark:text-white">{user.last_name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500 dark:text-gray-400">Email</span>
                        <span className="font-medium text-gray-900 dark:text-white">{user.email}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500 dark:text-gray-400">Téléphone</span>
                        <span className="font-medium text-gray-900 dark:text-white">{user.phone_number}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500 dark:text-gray-400">Ville</span>
                        <span className="font-medium text-gray-900 dark:text-white">{user.city || 'Non spécifié'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500 dark:text-gray-400">Adresse</span>
                        <span className="font-medium text-gray-900 dark:text-white">{user.address || 'Non spécifiée'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Account Information */}
                  <div className="bg-white dark:bg-gray-700 rounded-xl p-6 border border-gray-200 dark:border-gray-600">
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                      <FiShield className="mr-2" size={20} />
                      Informations du compte
                    </h4>
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span className="text-gray-500 dark:text-gray-400">Statut</span>
                        <UserStatusBadge status={user.status} />
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500 dark:text-gray-400">Rôle</span>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${roleConfig.color}`}>
                          {roleConfig.label}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500 dark:text-gray-400">Date d'inscription</span>
                        <span className="font-medium text-gray-900 dark:text-white">{formatDate(user.createdAt)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500 dark:text-gray-400">Dernière connexion</span>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {user.lastLoginAt ? formatDate(user.lastLoginAt) : 'Jamais connecté'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500 dark:text-gray-400">Email vérifié</span>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {user.emailVerified ? 'Oui' : 'Non'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Statistics */}
                  <div className="bg-white dark:bg-gray-700 rounded-xl p-6 border border-gray-200 dark:border-gray-600">
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                      <FiTrendingUp className="mr-2" size={20} />
                      Statistiques
                    </h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                          {user.totalOrders || 0}
                        </div>
                        <div className="text-sm text-blue-600 dark:text-blue-400">Commandes</div>
                      </div>
                      <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                        <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                          {user.totalSpent || 0}€
                        </div>
                        <div className="text-sm text-green-600 dark:text-green-400">Total dépensé</div>
                      </div>
                      <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                        <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                          {user.rating || 0}
                        </div>
                        <div className="text-sm text-purple-600 dark:text-purple-400">Note moyenne</div>
                      </div>
                      <div className="text-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                        <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                          {user.daysActive || 0}
                        </div>
                        <div className="text-sm text-orange-600 dark:text-orange-400">Jours actifs</div>
                      </div>
                    </div>
                  </div>

                  {/* Recent Activity */}
                  <div className="bg-white dark:bg-gray-700 rounded-xl p-6 border border-gray-200 dark:border-gray-600">
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                      <FiActivity className="mr-2" size={20} />
                      Activité récente
                    </h4>
                    <div className="space-y-3">
                      {user.recentActivity ? (
                        user.recentActivity.map((activity, index) => (
                          <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-600 rounded-lg">
                            <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                            <div className="flex-1">
                              <p className="text-sm text-gray-900 dark:text-white">{activity.description}</p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">{formatDate(activity.timestamp)}</p>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                          Aucune activité récente
                        </p>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'documents' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  {documentRequirements.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {documentRequirements.map(doc => {
                        const document = user.documents?.[doc.key];
                        return (
                          <div key={doc.key} className="bg-white dark:bg-gray-700 rounded-xl p-6 border border-gray-200 dark:border-gray-600">
                            <div className="flex items-center justify-between mb-4">
                              <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                                {doc.label}
                              </h4>
                              {document && <DocumentStatusBadge status={document.status} />}
                            </div>
                            
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                              {doc.description}
                            </p>

                            {document ? (
                              <div className="space-y-3">
                                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-600 rounded-lg">
                                  <div className="flex items-center space-x-3">
                                    <FiFile className="text-indigo-500" size={20} />
                                    <div>
                                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                                        {document.name}
                                      </p>
                                      <p className="text-xs text-gray-500 dark:text-gray-400">
                                        {formatFileSize(document.size)}
                                      </p>
                                    </div>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <button
                                      onClick={() => window.open(document.url, '_blank')}
                                      className="p-2 text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-200 transition-colors"
                                      title="Voir le document"
                                    >
                                      <FiEye size={16} />
                                    </button>
                                    <button
                                      onClick={() => window.open(document.url, '_blank')}
                                      className="p-2 text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-200 transition-colors"
                                      title="Télécharger"
                                    >
                                      <FiDownload size={16} />
                                    </button>
                                  </div>
                                </div>
                                
                                {document.uploadedAt && (
                                  <p className="text-xs text-gray-500 dark:text-gray-400">
                                    Téléchargé le {formatDate(document.uploadedAt)}
                                  </p>
                                )}
                              </div>
                            ) : (
                              <div className="text-center py-8">
                                <FiFileText className="mx-auto text-gray-300 dark:text-gray-600" size={48} />
                                <p className="text-gray-500 dark:text-gray-400 mt-2">
                                  Aucun document téléchargé
                                </p>
                              </div>
                            )}

                            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
                              <button
                                onClick={() => onDocumentReview(user)}
                                className="w-full px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
                              >
                                Examiner les documents
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <FiFileText className="mx-auto text-gray-300 dark:text-gray-600" size={64} />
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mt-4">
                        Aucun document requis
                      </h3>
                      <p className="text-gray-500 dark:text-gray-400 mt-2">
                        Ce type d'utilisateur ne nécessite pas de documents spécifiques.
                      </p>
                    </div>
                  )}
                </motion.div>
              )}

              {activeTab === 'activity' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  <div className="bg-white dark:bg-gray-700 rounded-xl p-6 border border-gray-200 dark:border-gray-600">
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      Historique des activités
                    </h4>
                    <div className="space-y-4">
                      {user.activityHistory ? (
                        user.activityHistory.map((activity, index) => (
                          <div key={index} className="flex items-start space-x-4 p-4 bg-gray-50 dark:bg-gray-600 rounded-lg">
                            <div className={`w-3 h-3 rounded-full mt-2 ${
                              activity.type === 'login' ? 'bg-green-500' :
                              activity.type === 'order' ? 'bg-blue-500' :
                              activity.type === 'update' ? 'bg-yellow-500' : 'bg-gray-500'
                            }`}></div>
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-900 dark:text-white">
                                {activity.title}
                              </p>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                {activity.description}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                {formatDate(activity.timestamp)}
                              </p>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                          Aucune activité enregistrée
                        </p>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default UserDetailsPage; 