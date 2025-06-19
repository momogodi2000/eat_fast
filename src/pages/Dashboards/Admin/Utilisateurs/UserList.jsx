import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import AdminLayout from '../../../../layouts/admin_layout';
import { 
  FiEdit2, FiTrash2, FiSearch, FiUserPlus, FiFilter, FiDownload, 
  FiEye, FiChevronLeft, FiChevronRight, FiRefreshCw, FiMoreVertical,
  FiUsers, FiShield, FiTruck, FiHome, FiHeadphones, FiCheck, FiX,
  FiClock, FiAlertTriangle, FiFileText, FiUpload, FiWifi, FiWifiOff,
  FiPhone, FiMail, FiMapPin, FiCalendar, FiPackage, FiStar, FiActivity,
  FiUser, FiLock, FiCamera, FiImage, FiFile, FiCheckCircle, FiXCircle,
  FiAlertCircle, FiInfo, FiTrendingUp, FiTrendingDown, FiZap, FiGlobe
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

// PWA Service Worker Registration
const registerServiceWorker = () => {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js')
      .then(registration => console.log('SW registered:', registration))
      .catch(error => console.log('SW registration failed:', error));
  }
};

// Offline Status Hook
const useOnlineStatus = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  
  return isOnline;
};

// Notification Hook
const useNotification = () => {
  const [notification, setNotification] = useState(null);

  const showNotification = useCallback((message, type = 'info', duration = 5000) => {
    setNotification({ message, type, id: Date.now() });
    if (duration > 0) {
      setTimeout(() => setNotification(null), duration);
    }
  }, []);

  const hideNotification = useCallback(() => {
    setNotification(null);
  }, []);

  return { notification, showNotification, hideNotification };
};

// Role Configuration
const getRoleConfig = (role) => {
  const configs = {
    [USER_ROLES.CLIENT]: {
      icon: FiUsers,
      color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      label: 'Client',
      documentsRequired: [],
      canManage: ['profile']
    },
    [USER_ROLES.AGENT_SUPPORT]: {
      icon: FiHeadphones,
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
      icon: FiHome,
      color: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
      bgColor: 'bg-orange-50 dark:bg-orange-900/20',
      label: 'Gestionnaire Restaurant',
      documentsRequired: ['business_license', 'health_certificate', 'menu', 'id_document'],
      canManage: ['restaurant', 'orders', 'menu']
    },
    [USER_ROLES.DELIVERY_AGENT]: {
      icon: FiTruck,
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

// Enhanced Notification Component
const NotificationComponent = ({ notification, onClose }) => {
  if (!notification) return null;

  const getNotificationConfig = (type) => {
    switch (type) {
      case 'success':
        return { bg: 'bg-green-500', icon: FiCheckCircle, title: 'Succès' };
      case 'error':
        return { bg: 'bg-red-500', icon: FiXCircle, title: 'Erreur' };
      case 'warning':
        return { bg: 'bg-yellow-500', icon: FiAlertTriangle, title: 'Attention' };
      default:
        return { bg: 'bg-blue-500', icon: FiInfo, title: 'Information' };
    }
  };

  const config = getNotificationConfig(notification.type);
  const Icon = config.icon;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: -20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: -20 }}
        className={`fixed top-4 right-4 z-50 ${config.bg} text-white rounded-xl shadow-2xl max-w-md overflow-hidden`}
      >
        <div className="p-4">
          <div className="flex items-start space-x-3">
            <Icon size={24} className="flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h4 className="font-semibold text-sm">{config.title}</h4>
              <p className="text-sm opacity-90 mt-1">{notification.message}</p>
            </div>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white transition-colors"
            >
              <FiX size={20} />
            </button>
          </div>
        </div>
        <motion.div
          initial={{ width: '100%' }}
          animate={{ width: '0%' }}
          transition={{ duration: 5 }}
          className="h-1 bg-white/30"
        />
      </motion.div>
    </AnimatePresence>
  );
};

// Enhanced File Upload Component
const FileUploadComponent = ({ 
  name, 
  label, 
  description, 
  required, 
  currentFile, 
  onChange, 
  error,
  accept = ".pdf,.doc,.docx,.jpg,.jpeg,.png"
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      await handleFileUpload(files[0]);
    }
  };

  const handleFileUpload = async (file) => {
    setUploading(true);
    
    // Simulate upload delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    onChange({ target: { name, value: file } });
    setUploading(false);
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      
      {currentFile ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative group"
        >
          <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-900/20 border-2 border-green-200 dark:border-green-800 rounded-xl">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                <FiFile className="text-green-600 dark:text-green-400" size={20} />
              </div>
              <div>
                <p className="text-sm font-medium text-green-800 dark:text-green-200">
                  {currentFile.name}
                </p>
                <p className="text-xs text-green-600 dark:text-green-400">
                  {formatFileSize(currentFile.size)}
                </p>
              </div>
            </div>
            <button
              onClick={() => onChange({ target: { name, value: null } })}
              className="text-red-500 hover:text-red-700 transition-colors opacity-0 group-hover:opacity-100"
            >
              <FiX size={20} />
            </button>
          </div>
        </motion.div>
      ) : (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`relative border-2 border-dashed rounded-xl p-6 transition-all duration-200 ${
            isDragOver 
              ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20' 
              : error 
                ? 'border-red-300 bg-red-50 dark:border-red-600 dark:bg-red-900/20' 
                : 'border-gray-300 dark:border-gray-600 hover:border-indigo-400 hover:bg-gray-50 dark:hover:bg-gray-700'
          }`}
        >
          <input
            type="file"
            name={name}
            accept={accept}
            onChange={(e) => e.target.files[0] && handleFileUpload(e.target.files[0])}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            disabled={uploading}
          />
          
          <div className="text-center">
            {uploading ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-12 h-12 mx-auto mb-4"
              >
                <FiRefreshCw className="w-full h-full text-indigo-500" />
              </motion.div>
            ) : (
              <div className={`w-12 h-12 mx-auto mb-4 rounded-full flex items-center justify-center ${
                isDragOver ? 'bg-indigo-100 dark:bg-indigo-900' : 'bg-gray-100 dark:bg-gray-700'
              }`}>
                <FiUpload className={`${isDragOver ? 'text-indigo-600' : 'text-gray-400'}`} size={24} />
              </div>
            )}
            
            <p className="text-sm font-medium text-gray-900 dark:text-white mb-2">
              {uploading ? 'Téléchargement...' : 'Glissez un fichier ici ou cliquez pour sélectionner'}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              PDF, DOC, JPG, PNG - Max 10MB
            </p>
          </div>
        </div>
      )}
      
      {description && (
        <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>
      )}
      
      {error && (
        <p className="text-red-500 text-sm flex items-center space-x-1">
          <FiAlertCircle size={14} />
          <span>{error}</span>
        </p>
      )}
    </div>
  );
};

// User Status Badge Component
const UserStatusBadge = ({ status }) => {
  const getStatusConfig = (status) => {
    switch (status) {
      case USER_STATUS.ACTIVE:
        return { 
          color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200', 
          label: 'Actif',
          icon: FiCheckCircle
        };
      case USER_STATUS.PENDING:
        return { 
          color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200', 
          label: 'En attente',
          icon: FiClock
        };
      case USER_STATUS.SUSPENDED:
        return { 
          color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200', 
          label: 'Suspendu',
          icon: FiXCircle
        };
      case USER_STATUS.REJECTED:
        return { 
          color: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200', 
          label: 'Rejeté',
          icon: FiX
        };
      default:
        return { 
          color: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200', 
          label: 'Inactif',
          icon: FiX
        };
    }
  };
  
  const config = getStatusConfig(status);
  const Icon = config.icon;
  
  return (
    <span className={`px-3 py-1 inline-flex items-center space-x-1 text-xs leading-5 font-semibold rounded-full ${config.color}`}>
      <Icon size={12} />
      <span>{config.label}</span>
    </span>
  );
};

// Document Review Modal
const DocumentReviewModal = ({ isOpen, onClose, user, onStatusUpdate, showNotification }) => {
  const [documents, setDocuments] = useState([]);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [reviewNote, setReviewNote] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (user && isOpen) {
      const mockDocuments = getDocumentRequirements(user.role).map(req => ({
        id: `doc_${req.key}`,
        type: req.key,
        label: req.label,
        status: Math.random() > 0.5 ? DOCUMENT_STATUS.PENDING : DOCUMENT_STATUS.APPROVED,
        uploadedAt: new Date(Date.now() - Math.random() * 10000000000),
        url: `https://example.com/documents/${req.key}.pdf`,
        reviewNote: '',
        size: Math.floor(Math.random() * 5000000) + 100000
      }));
      setDocuments(mockDocuments);
    }
  }, [user, isOpen]);

  const handleDocumentAction = async (documentId, status, note = '') => {
    setIsProcessing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setDocuments(prev => prev.map(doc => 
        doc.id === documentId 
          ? { ...doc, status, reviewNote: note, reviewedAt: new Date() }
          : doc
      ));
      
      onStatusUpdate?.(user.id, status);
      showNotification?.(
        `Document ${status === DOCUMENT_STATUS.APPROVED ? 'approuvé' : 'rejeté'} avec succès`,
        status === DOCUMENT_STATUS.APPROVED ? 'success' : 'warning'
      );
      
      setReviewNote('');
      setSelectedDocument(null);
    } catch (error) {
      console.error('Error updating document:', error);
      showNotification?.('Erreur lors de la mise à jour du document', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (!isOpen || !user) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-sm"
      >
        <div className="flex min-h-screen items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="w-full max-w-4xl bg-white dark:bg-gray-800 rounded-2xl shadow-2xl"
          >
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <FiFileText className="text-white" size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    Documents de {user.name}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {getRoleConfig(user.role).label} • {documents.length} document(s)
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 transition-colors"
              >
                <FiX size={24} />
              </button>
            </div>

            <div className="p-6 max-h-96 overflow-y-auto">
              {documents.length === 0 ? (
                <div className="text-center py-12">
                  <FiFileText className="mx-auto text-gray-300 dark:text-gray-600 mb-4" size={48} />
                  <p className="text-gray-500 dark:text-gray-400">
                    Aucun document requis pour ce rôle
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {documents.map((doc) => (
                    <motion.div
                      key={doc.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="group border border-gray-200 dark:border-gray-700 rounded-xl p-6 hover:shadow-lg transition-all duration-200"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-3">
                            <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                              <FiFile className="text-gray-500 dark:text-gray-400" size={20} />
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-900 dark:text-white">
                                {doc.label}
                              </h4>
                              <div className="flex items-center space-x-2 mt-1">
                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                  doc.status === DOCUMENT_STATUS.APPROVED 
                                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                                    : doc.status === DOCUMENT_STATUS.REJECTED 
                                      ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' 
                                      : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                                }`}>
                                  {doc.status === DOCUMENT_STATUS.APPROVED ? 'Approuvé' :
                                   doc.status === DOCUMENT_STATUS.REJECTED ? 'Rejeté' : 'En attente'}
                                </span>
                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                  {formatFileSize(doc.size)}
                                </span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400 mb-3">
                            <span className="flex items-center space-x-1">
                              <FiCalendar size={14} />
                              <span>Téléchargé le {doc.uploadedAt.toLocaleDateString('fr-FR')}</span>
                            </span>
                            {doc.reviewedAt && (
                              <span className="flex items-center space-x-1">
                                <FiClock size={14} />
                                <span>Examiné le {doc.reviewedAt.toLocaleDateString('fr-FR')}</span>
                              </span>
                            )}
                          </div>
                          
                          {doc.reviewNote && (
                            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 mb-3">
                              <p className="text-sm text-gray-700 dark:text-gray-300">
                                <strong>Note d'examen:</strong> {doc.reviewNote}
                              </p>
                            </div>
                          )}
                        </div>
                        
                        <div className="flex flex-col space-y-2 ml-4">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => window.open(doc.url, '_blank')}
                            className="px-4 py-2 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors text-sm font-medium"
                          >
                            <FiEye className="inline mr-1" size={14} />
                            Voir
                          </motion.button>
                          
                          {doc.status === DOCUMENT_STATUS.PENDING && (
                            <div className="flex space-x-2">
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => handleDocumentAction(doc.id, DOCUMENT_STATUS.APPROVED)}
                                disabled={isProcessing}
                                className="flex-1 px-3 py-2 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 rounded-lg hover:bg-green-200 dark:hover:bg-green-800 transition-colors disabled:opacity-50 text-sm font-medium"
                              >
                                <FiCheck className="inline mr-1" size={14} />
                                Approuver
                              </motion.button>
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setSelectedDocument(doc)}
                                disabled={isProcessing}
                                className="flex-1 px-3 py-2 bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 rounded-lg hover:bg-red-200 dark:hover:bg-red-800 transition-colors disabled:opacity-50 text-sm font-medium"
                              >
                                <FiX className="inline mr-1" size={14} />
                                Rejeter
                              </motion.button>
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {selectedDocument && (
              <div className="border-t border-gray-200 dark:border-gray-700 p-6 bg-gray-50 dark:bg-gray-900">
                <h4 className="font-semibold mb-3 text-gray-900 dark:text-white">
                  Rejeter le document: {selectedDocument.label}
                </h4>
                <textarea
                  value={reviewNote}
                  onChange={(e) => setReviewNote(e.target.value)}
                  placeholder="Précisez la raison du rejet..."
                  className="w-full p-4 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800 dark:text-white resize-none"
                  rows={4}
                />
                <div className="flex justify-end space-x-3 mt-4">
                  <button
                    onClick={() => {
                      setSelectedDocument(null);
                      setReviewNote('');
                    }}
                    className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 font-medium transition-colors"
                  >
                    Annuler
                  </button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleDocumentAction(selectedDocument.id, DOCUMENT_STATUS.REJECTED, reviewNote)}
                    disabled={isProcessing || !reviewNote.trim()}
                    className="px-6 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 disabled:opacity-50 transition-colors font-medium shadow-lg"
                  >
                    {isProcessing ? 'Traitement...' : 'Rejeter le document'}
                  </motion.button>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

// Enhanced User Form
const UserForm = ({ user, isOpen, onClose, onSubmit, showNotification }) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: USER_ROLES.CLIENT,
    status: USER_STATUS.ACTIVE,
    address: '',
    city: '',
    password: '',
    confirmPassword: '',
    documents: {}
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [documentRequirements, setDocumentRequirements] = useState([]);

  const totalSteps = 3;

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        role: user.role || USER_ROLES.CLIENT,
        status: user.status || USER_STATUS.ACTIVE,
        address: user.address || '',
        city: user.city || '',
        password: '',
        confirmPassword: '',
        documents: user.documents || {}
      });
    } else {
      setFormData({
        name: '',
        email: '',
        phone: '',
        role: USER_ROLES.CLIENT,
        status: USER_STATUS.ACTIVE,
        address: '',
        city: '',
        password: '',
        confirmPassword: '',
        documents: {}
      });
    }
    setErrors({});
    setCurrentStep(1);
  }, [user, isOpen]);

  useEffect(() => {
    setDocumentRequirements(getDocumentRequirements(formData.role));
  }, [formData.role]);

  const validateStep = (step) => {
    const newErrors = {};
    
    if (step === 1) {
      if (!formData.name.trim()) newErrors.name = 'Nom requis';
      if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = 'Email valide requis';
      }
      if (!formData.phone.trim()) newErrors.phone = 'Téléphone requis';
      if (!user && !formData.password) newErrors.password = 'Mot de passe requis';
      if (!user && formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Les mots de passe ne correspondent pas';
      }
    }
    
    if (step === 2) {
      if (!formData.address.trim()) newErrors.address = 'Adresse requise';
      if (!formData.city.trim()) newErrors.city = 'Ville requise';
    }
    
    if (step === 3) {
      documentRequirements.forEach(req => {
        if (req.required && !formData.documents[req.key]) {
          newErrors[`document_${req.key}`] = `${req.label} requis`;
        }
      });
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < totalSteps) {
        setCurrentStep(currentStep + 1);
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) return;
    
    setIsSubmitting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const userData = {
        ...formData,
        id: user?.id || Date.now(),
        createdAt: user?.createdAt || new Date(),
        lastLogin: user?.lastLogin || null,
        orders: user?.orders || 0
      };
      
      onSubmit(userData);
      showNotification?.(
        user ? 'Utilisateur modifié avec succès' : 'Nouvel utilisateur créé avec succès',
        'success'
      );
      onClose();
    } catch (error) {
      console.error('Error submitting form:', error);
      showNotification?.('Erreur lors de l\'enregistrement', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleDocumentChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      documents: {
        ...prev.documents,
        [name]: value
      }
    }));
    if (errors[`document_${name}`]) {
      setErrors(prev => ({ ...prev, [`document_${name}`]: '' }));
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-sm"
      >
        <div className="flex min-h-screen items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="w-full max-w-2xl bg-white dark:bg-gray-800 rounded-2xl shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  {user ? 'Modifier l\'utilisateur' : 'Nouvel utilisateur'}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Étape {currentStep} sur {totalSteps}
                </p>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 transition-colors"
              >
                <FiX size={24} />
              </button>
            </div>

            {/* Progress Bar */}
            <div className="px-6 py-4 bg-gray-50 dark:bg-gray-900">
              <div className="flex items-center justify-between mb-2">
                {Array.from({ length: totalSteps }).map((_, index) => (
                  <div
                    key={index}
                    className={`flex items-center ${index < totalSteps - 1 ? 'flex-1' : ''}`}
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                        index + 1 <= currentStep
                          ? 'bg-indigo-600 text-white'
                          : 'bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                      }`}
                    >
                      {index + 1}
                    </div>
                    {index < totalSteps - 1 && (
                      <div
                        className={`flex-1 h-1 mx-2 transition-colors ${
                          index + 1 < currentStep
                            ? 'bg-indigo-600'
                            : 'bg-gray-200 dark:bg-gray-700'
                        }`}
                      />
                    )}
                  </div>
                ))}
              </div>
              <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                <span>Informations</span>
                <span>Localisation</span>
                <span>Documents</span>
              </div>
            </div>

            {/* Form Content */}
            <div className="p-6">
              <AnimatePresence mode="wait">
                {/* Step 1: Basic Information */}
                {currentStep === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Nom complet *
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FiUser className="text-gray-400" size={16} />
                          </div>
                          <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                              errors.name ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                            }`}
                            placeholder="Nom complet"
                          />
                        </div>
                        {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Email *
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FiMail className="text-gray-400" size={16} />
                          </div>
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                              errors.email ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                            }`}
                            placeholder="email@exemple.com"
                          />
                        </div>
                        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Téléphone *
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FiPhone className="text-gray-400" size={16} />
                          </div>
                          <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                              errors.phone ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                            }`}
                            placeholder="+237 XXX XXX XXX"
                          />
                        </div>
                        {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Rôle *
                        </label>
                        <select
                          name="role"
                          value={formData.role}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors dark:bg-gray-700 dark:text-white"
                        >
                          {Object.values(USER_ROLES).map(role => (
                            <option key={role} value={role}>
                              {getRoleConfig(role).label}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Statut
                        </label>
                        <select
                          name="status"
                          value={formData.status}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors dark:bg-gray-700 dark:text-white"
                        >
                          {Object.values(USER_STATUS).map(status => (
                            <option key={status} value={status}>
                              {status === USER_STATUS.ACTIVE ? 'Actif' :
                               status === USER_STATUS.PENDING ? 'En attente' :
                               status === USER_STATUS.SUSPENDED ? 'Suspendu' :
                               status === USER_STATUS.REJECTED ? 'Rejeté' : 'Inactif'}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Statut
                        </label>
                        <select
                          name="status"
                          value={formData.status}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors dark:bg-gray-700 dark:text-white"
                        >
                          {Object.values(USER_STATUS).map(status => (
                            <option key={status} value={status}>
                              {status === USER_STATUS.ACTIVE ? 'Actif' :
                               status === USER_STATUS.PENDING ? 'En attente' :
                               status === USER_STATUS.SUSPENDED ? 'Suspendu' :
                               status === USER_STATUS.REJECTED ? 'Rejeté' : 'Inactif'}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {!user && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Mot de passe *
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <FiLock className="text-gray-400" size={16} />
                            </div>
                            <input
                              type="password"
                              name="password"
                              value={formData.password}
                              onChange={handleInputChange}
                              className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                                errors.password ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                              }`}
                              placeholder="Mot de passe"
                            />
                          </div>
                          {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Confirmer le mot de passe *
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <FiLock className="text-gray-400" size={16} />
                            </div>
                            <input
                              type="password"
                              name="confirmPassword"
                              value={formData.confirmPassword}
                              onChange={handleInputChange}
                              className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                                errors.confirmPassword ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                              }`}
                              placeholder="Confirmer le mot de passe"
                            />
                          </div>
                          {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}

                {/* Step 2: Location Information */}
                {currentStep === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Adresse *
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FiMapPin className="text-gray-400" size={16} />
                        </div>
                        <textarea
                          name="address"
                          value={formData.address}
                          onChange={handleInputChange}
                          rows={3}
                          className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors dark:bg-gray-700 dark:border-gray-600 dark:text-white resize-none ${
                            errors.address ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                          }`}
                          placeholder="Adresse complète"
                        />
                      </div>
                      {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Ville *
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                          errors.city ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                        }`}
                        placeholder="Yaoundé"
                      />
                      {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
                    </div>

                    {/* Role-specific information */}
                    {formData.role === USER_ROLES.RESTAURANT_MANAGER && (
                      <div className="bg-orange-50 dark:bg-orange-900/20 p-6 rounded-xl border border-orange-200 dark:border-orange-800">
                        <h4 className="font-semibold text-orange-800 dark:text-orange-200 mb-4 flex items-center">
                          <FiHome className="mr-2" size={20} />
                          Informations Restaurant
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-orange-700 dark:text-orange-300 mb-2">
                              Type de cuisine
                            </label>
                            <input
                              type="text"
                              name="cuisineType"
                              value={formData.cuisineType || ''}
                              onChange={handleInputChange}
                              className="w-full px-4 py-3 border border-orange-300 dark:border-orange-600 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors dark:bg-orange-900/20 dark:text-white"
                              placeholder="Cuisine camerounaise"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-orange-700 dark:text-orange-300 mb-2">
                              Capacité (commandes/jour)
                            </label>
                            <input
                              type="number"
                              name="capacity"
                              value={formData.capacity || ''}
                              onChange={handleInputChange}
                              className="w-full px-4 py-3 border border-orange-300 dark:border-orange-600 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors dark:bg-orange-900/20 dark:text-white"
                              placeholder="100"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {formData.role === USER_ROLES.DELIVERY_AGENT && (
                      <div className="bg-indigo-50 dark:bg-indigo-900/20 p-6 rounded-xl border border-indigo-200 dark:border-indigo-800">
                        <h4 className="font-semibold text-indigo-800 dark:text-indigo-200 mb-4 flex items-center">
                          <FiTruck className="mr-2" size={20} />
                          Informations Livraison
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-indigo-700 dark:text-indigo-300 mb-2">
                              Type de véhicule
                            </label>
                            <select
                              name="vehicleType"
                              value={formData.vehicleType || ''}
                              onChange={handleInputChange}
                              className="w-full px-4 py-3 border border-indigo-300 dark:border-indigo-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors dark:bg-indigo-900/20 dark:text-white"
                            >
                              <option value="">Sélectionner un véhicule</option>
                              <option value="moto">Moto</option>
                              <option value="vélo">Vélo</option>
                              <option value="voiture">Voiture</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-indigo-700 dark:text-indigo-300 mb-2">
                              Zone de livraison
                            </label>
                            <input
                              type="text"
                              name="deliveryZone"
                              value={formData.deliveryZone || ''}
                              onChange={handleInputChange}
                              className="w-full px-4 py-3 border border-indigo-300 dark:border-indigo-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors dark:bg-indigo-900/20 dark:text-white"
                              placeholder="Centre-ville, Yaoundé"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}

                {/* Step 3: Document Upload */}
                {currentStep === 3 && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    {documentRequirements.length === 0 ? (
                      <div className="text-center py-12">
                        <FiFileText className="mx-auto text-gray-300 dark:text-gray-600 mb-4" size={48} />
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                          Aucun document requis
                        </h3>
                        <p className="text-gray-500 dark:text-gray-400">
                          Ce rôle ne nécessite pas de documents spécifiques.
                        </p>
                      </div>
                    ) : (
                      <>
                        <div className="text-center mb-6">
                          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                            Documents requis pour {getRoleConfig(formData.role).label}
                          </h3>
                          <p className="text-gray-500 dark:text-gray-400">
                            Téléchargez les documents nécessaires pour ce rôle
                          </p>
                        </div>

                        <div className="space-y-6">
                          {documentRequirements.map((doc) => (
                            <FileUploadComponent
                              key={doc.key}
                              name={doc.key}
                              label={doc.label}
                              description={doc.description}
                              required={doc.required}
                              currentFile={formData.documents[doc.key]}
                              onChange={handleDocumentChange}
                              error={errors[`document_${doc.key}`]}
                            />
                          ))}
                        </div>
                      </>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Footer */}
            <div className="flex justify-between items-center p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
              <div className="flex space-x-3">
                {currentStep > 1 && (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handlePrevious}
                    className="px-6 py-3 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 font-medium transition-colors"
                  >
                    <FiChevronLeft className="inline mr-1" size={16} />
                    Précédent
                  </motion.button>
                )}
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={onClose}
                  className="px-6 py-3 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 font-medium transition-colors"
                >
                  Annuler
                </button>
                
                {currentStep < totalSteps ? (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleNext}
                    className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition-colors shadow-lg"
                  >
                    Suivant
                    <FiChevronRight className="inline ml-1" size={16} />
                  </motion.button>
                ) : (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white rounded-xl font-medium transition-colors shadow-lg flex items-center space-x-2"
                  >
                    {isSubmitting && (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      >
                        <FiRefreshCw size={16} />
                      </motion.div>
                    )}
                    <span>{isSubmitting ? 'Enregistrement...' : (user ? 'Mettre à jour' : 'Créer l\'utilisateur')}</span>
                  </motion.button>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

// Enhanced User Detail Modal
const UserDetailModal = ({ user, isOpen, onClose, onEdit, onDocumentReview }) => {
  const { t } = useTranslation();

  const formatDate = (date) => {
    return date ? new Intl.DateTimeFormat('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(date)) : '—';
  };

  if (!isOpen || !user) return null;

  const roleConfig = getRoleConfig(user.role);
  const RoleIcon = roleConfig.icon;
  const documentRequirements = getDocumentRequirements(user.role);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-sm"
      >
        <div className="flex min-h-screen items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="w-full max-w-2xl bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="relative p-6 bg-gradient-to-r from-indigo-500 to-purple-600">
              <button
                onClick={onClose}
                className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors"
              >
                <FiX size={24} />
              </button>
              
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                  <RoleIcon size={32} className="text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">
                    {user.name}
                  </h3>
                  <div className="flex items-center space-x-2 mt-2">
                    <span className="px-3 py-1 bg-white/20 backdrop-blur-sm text-white text-xs font-medium rounded-full">
                      {roleConfig.label}
                    </span>
                    <div className="flex items-center space-x-1">
                      <UserStatusBadge status={user.status} />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6 max-h-96 overflow-y-auto">
              {/* Contact Information */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  <FiUser className="mr-2" size={20} />
                  Informations de contact
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-xl flex items-center justify-center">
                      <FiMail className="text-blue-600 dark:text-blue-400" size={18} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Email</p>
                      <p className="text-gray-900 dark:text-white">{user.email}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-xl flex items-center justify-center">
                      <FiPhone className="text-green-600 dark:text-green-400" size={18} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Téléphone</p>
                      <p className="text-gray-900 dark:text-white">{user.phone}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900 rounded-xl flex items-center justify-center">
                      <FiMapPin className="text-purple-600 dark:text-purple-400" size={18} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Ville</p>
                      <p className="text-gray-900 dark:text-white">{user.city || '—'}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900 rounded-xl flex items-center justify-center">
                      <FiCalendar className="text-orange-600 dark:text-orange-400" size={18} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Inscrit le</p>
                      <p className="text-gray-900 dark:text-white">{formatDate(user.createdAt)}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Address */}
              {user.address && (
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900 rounded-xl flex items-center justify-center">
                    <FiMapPin className="text-indigo-600 dark:text-indigo-400" size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Adresse</p>
                    <p className="text-gray-900 dark:text-white">{user.address}</p>
                  </div>
                </div>
              )}

              {/* Activity Stats */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  <FiActivity className="mr-2" size={20} />
                  Activité
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-4 rounded-xl border border-green-200 dark:border-green-800">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-green-700 dark:text-green-300">Commandes</p>
                        <p className="text-2xl font-bold text-green-900 dark:text-green-100">{user.orders || 0}</p>
                      </div>
                      <FiPackage className="text-green-600 dark:text-green-400" size={24} />
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-4 rounded-xl border border-blue-200 dark:border-blue-800">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-blue-700 dark:text-blue-300">Note moyenne</p>
                        <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">4.8</p>
                      </div>
                      <FiStar className="text-yellow-500" size={24} />
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 p-4 rounded-xl border border-purple-200 dark:border-purple-800">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-purple-700 dark:text-purple-300">Dernière connexion</p>
                        <p className="text-sm font-semibold text-purple-900 dark:text-purple-100">
                          {user.lastLogin ? formatDate(user.lastLogin) : 'Jamais'}
                        </p>
                      </div>
                      <FiClock className="text-purple-600 dark:text-purple-400" size={24} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Role-specific information */}
              {user.role === USER_ROLES.RESTAURANT_MANAGER && (
                <div className={`${roleConfig.bgColor} p-6 rounded-xl border border-orange-200 dark:border-orange-800`}>
                  <h4 className="font-semibold text-orange-800 dark:text-orange-200 mb-4 flex items-center">
                    <FiHome className="mr-2" size={20} />
                    Informations Restaurant
                  </h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-orange-600 dark:text-orange-400 font-medium">Cuisine:</span>
                      <span className="ml-2 text-orange-800 dark:text-orange-200">{user.cuisineType || '—'}</span>
                    </div>
                    <div>
                      <span className="text-orange-600 dark:text-orange-400 font-medium">Capacité:</span>
                      <span className="ml-2 text-orange-800 dark:text-orange-200">{user.capacity || '—'} commandes/jour</span>
                    </div>
                  </div>
                </div>
              )}

              {user.role === USER_ROLES.DELIVERY_AGENT && (
                <div className={`${roleConfig.bgColor} p-6 rounded-xl border border-indigo-200 dark:border-indigo-800`}>
                  <h4 className="font-semibold text-indigo-800 dark:text-indigo-200 mb-4 flex items-center">
                    <FiTruck className="mr-2" size={20} />
                    Informations Livraison
                  </h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-indigo-600 dark:text-indigo-400 font-medium">Véhicule:</span>
                      <span className="ml-2 text-indigo-800 dark:text-indigo-200">{user.vehicleType || '—'}</span>
                    </div>
                    <div>
                      <span className="text-indigo-600 dark:text-indigo-400 font-medium">Zone:</span>
                      <span className="ml-2 text-indigo-800 dark:text-indigo-200">{user.deliveryZone || '—'}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Documents section */}
              {documentRequirements.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                      <FiFileText className="mr-2" size={20} />
                      Documents ({documentRequirements.length})
                    </h4>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => onDocumentReview?.(user)}
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors shadow-lg"
                    >
                      Examiner les documents
                    </motion.button>
                  </div>
                  <div className="space-y-3">
                    {documentRequirements.map((doc, index) => (
                      <div key={doc.key} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-xl">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-gray-200 dark:bg-gray-600 rounded-lg flex items-center justify-center">
                            <FiFile className="text-gray-500 dark:text-gray-400" size={16} />
                          </div>
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{doc.label}</span>
                        </div>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          Math.random() > 0.5 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                            : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                        }`}>
                          {Math.random() > 0.5 ? 'Approuvé' : 'En attente'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex justify-end space-x-4 p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
              <button
                onClick={onClose}
                className="px-6 py-3 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 font-medium transition-colors"
              >
                Fermer
              </button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  onClose();
                  onEdit(user);
                }}
                className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition-colors shadow-lg"
              >
                Modifier
              </motion.button>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

// Main User List Page Component
const UserListPage = () => {
  const { t } = useTranslation();
  const isOnline = useOnlineStatus();
  const { notification, showNotification, hideNotification } = useNotification();
  
  // State management
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(10);
  const [selectedRole, setSelectedRole] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [sortConfig, setSortConfig] = useState({ key: 'createdAt', direction: 'desc' });
  
  // Modal states
  const [selectedUser, setSelectedUser] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isDocumentModalOpen, setIsDocumentModalOpen] = useState(false);

  // Initialize PWA
  useEffect(() => {
    registerServiceWorker();
  }, []);

  // Mock data generation
  const generateMockUsers = useCallback(() => {
    const mockUsers = [];
    const roles = Object.values(USER_ROLES);
    const statuses = Object.values(USER_STATUS);
    const cities = ['Yaoundé', 'Douala', 'Bamenda', 'Bafoussam', 'Garoua'];
    
    for (let i = 1; i <= 50; i++) {
      const role = roles[Math.floor(Math.random() * roles.length)];
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      
      mockUsers.push({
        id: i,
        name: `Utilisateur ${i}`,
        email: `user${i}@exemple.com`,
        phone: `+237 6${Math.floor(Math.random() * 90000000) + 10000000}`,
        role,
        status,
        city: cities[Math.floor(Math.random() * cities.length)],
        address: `Quartier ${Math.floor(Math.random() * 10) + 1}, ${cities[Math.floor(Math.random() * cities.length)]}`,
        createdAt: new Date(Date.now() - Math.floor(Math.random() * 10000000000)),
        lastLogin: Math.random() > 0.3 ? new Date(Date.now() - Math.floor(Math.random() * 1000000000)) : null,
        orders: Math.floor(Math.random() * 100),
        cuisineType: role === USER_ROLES.RESTAURANT_MANAGER ? ['Camerounaise', 'Française', 'Italienne', 'Chinoise'][Math.floor(Math.random() * 4)] : null,
        capacity: role === USER_ROLES.RESTAURANT_MANAGER ? Math.floor(Math.random() * 200) + 50 : null,
        vehicleType: role === USER_ROLES.DELIVERY_AGENT ? ['Moto', 'Vélo', 'Voiture'][Math.floor(Math.random() * 3)] : null,
        deliveryZone: role === USER_ROLES.DELIVERY_AGENT ? cities[Math.floor(Math.random() * cities.length)] : null,
        documents: {}
      });
    }
    
    return mockUsers.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, []);

  // Fetch users
  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      const mockUsers = generateMockUsers();
      setUsers(mockUsers);
      setFilteredUsers(mockUsers);
      showNotification('Utilisateurs chargés avec succès', 'success');
    } catch (error) {
      console.error('Error fetching users:', error);
      showNotification('Erreur lors du chargement des utilisateurs', 'error');
    } finally {
      setIsLoading(false);
    }
  }, [generateMockUsers, showNotification]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Filter and search users
  useEffect(() => {
    let result = [...users];
    
    // Apply role filter
    if (selectedRole !== 'all') {
      result = result.filter(user => user.role === selectedRole);
    }
    
    // Apply status filter
    if (selectedStatus !== 'all') {
      result = result.filter(user => user.status === selectedStatus);
    }
    
    // Apply search
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      result = result.filter(user =>
        user.name.toLowerCase().includes(searchLower) ||
        user.email.toLowerCase().includes(searchLower) ||
        user.phone.toLowerCase().includes(searchLower) ||
        getRoleConfig(user.role).label.toLowerCase().includes(searchLower)
      );
    }
    
    // Apply sorting
    if (sortConfig.key) {
      result.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    
    setFilteredUsers(result);
    setCurrentPage(1);
  }, [users, searchTerm, selectedRole, selectedStatus, sortConfig]);

  // Pagination
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  // Event handlers
  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const handleUserAction = (action, user) => {
    switch (action) {
      case 'view':
        setSelectedUser(user);
        setIsDetailModalOpen(true);
        break;
      case 'edit':
        setSelectedUser(user);
        setIsFormOpen(true);
        break;
      case 'documents':
        setSelectedUser(user);
        setIsDocumentModalOpen(true);
        break;
      case 'delete':
        if (window.confirm(`Êtes-vous sûr de vouloir supprimer ${user.name} ?`)) {
          setUsers(prev => prev.filter(u => u.id !== user.id));
          showNotification('Utilisateur supprimé avec succès', 'success');
        }
        break;
      case 'suspend':
        setUsers(prev => prev.map(u => 
          u.id === user.id ? { ...u, status: USER_STATUS.SUSPENDED } : u
        ));
        showNotification(`${user.name} a été suspendu`, 'warning');
        break;
      case 'activate':
        setUsers(prev => prev.map(u => 
          u.id === user.id ? { ...u, status: USER_STATUS.ACTIVE } : u
        ));
        showNotification(`${user.name} a été activé`, 'success');
        break;
    }
  };

  const handleFormSubmit = (userData) => {
    if (selectedUser) {
      setUsers(prev => prev.map(user => 
        user.id === selectedUser.id ? { ...user, ...userData } : user
      ));
    } else {
      setUsers(prev => [...prev, userData]);
    }
    setIsFormOpen(false);
    setSelectedUser(null);
  };

  const exportToCSV = () => {
    const headers = ['ID', 'Nom', 'Email', 'Téléphone', 'Rôle', 'Statut', 'Ville', 'Date création'];
    const data = filteredUsers.map(user => [
      user.id,
      user.name,
      user.email,
      user.phone,
      getRoleConfig(user.role).label,
      user.status,
      user.city,
      new Date(user.createdAt).toLocaleDateString('fr-FR')
    ]);
    
    const csvContent = [
      headers.join(','),
      ...data.map(row => row.join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `utilisateurs_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    showNotification('Export CSV réussi', 'success');
  };

  return (
    <AdminLayout>
      {/* Offline Indicator */}
      <AnimatePresence>
        {!isOnline && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-0 left-0 right-0 z-50 bg-red-500 text-white px-4 py-3 text-center shadow-lg"
          >
            <div className="flex items-center justify-center space-x-2">
              <FiWifiOff size={20} />
              <span className="font-medium">Mode hors ligne - Fonctionnalités limitées</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Notifications */}
      <NotificationComponent notification={notification} onClose={hideNotification} />

      <div className={`${!isOnline ? 'pt-16' : ''}`}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8"
        >
          <div>
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-2">
              Gestion des Utilisateurs
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Gérez tous les utilisateurs de votre plateforme • {filteredUsers.length} utilisateur(s)
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 mt-4 lg:mt-0">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                setSelectedUser(null);
                setIsFormOpen(true);
              }}
              className="flex items-center justify-center px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl font-medium shadow-lg transition-all duration-200"
            >
              <FiUserPlus className="mr-2" size={20} />
              Nouvel utilisateur
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={exportToCSV}
              className="flex items-center justify-center px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl font-medium shadow-lg transition-all duration-200"
            >
              <FiDownload className="mr-2" size={20} />
              Exporter CSV
            </motion.button>
          </div>
        </motion.div>

        {/* Statistics Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-8"
        >
          {Object.values(USER_ROLES).map(role => {
            const roleConfig = getRoleConfig(role);
            const count = users.filter(user => user.role === role).length;
            const activeCount = users.filter(user => user.role === role && user.status === USER_STATUS.ACTIVE).length;
            const RoleIcon = roleConfig.icon;
            const percentage = count > 0 ? Math.round((activeCount / count) * 100) : 0;
            
            return (
              <motion.div
                key={role}
                whileHover={{ scale: 1.02, y: -2 }}
                className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-200 border border-gray-200 dark:border-gray-700"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${roleConfig.color}`}>
                    <RoleIcon size={24} />
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {count}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {activeCount} actifs
                    </p>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                    {roleConfig.label}
                  </p>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-500 ${
                        percentage >= 80 ? 'bg-green-500' :
                        percentage >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {percentage}% actifs
                  </p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Filters and Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-8 border border-gray-200 dark:border-gray-700"
        >
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <FiSearch className="text-gray-400" size={20} />
              </div>
              <input
                type="text"
                placeholder="Rechercher par nom, email ou téléphone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors dark:bg-gray-700 dark:text-white"
              />
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex items-center space-x-2">
                <FiFilter className="text-gray-400" size={20} />
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  className="px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors dark:bg-gray-700 dark:text-white"
                >
                  <option value="all">Tous les rôles</option>
                  {Object.values(USER_ROLES).map(role => (
                    <option key={role} value={role}>
                      {getRoleConfig(role).label}
                    </option>
                  ))}
                </select>
              </div>

              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors dark:bg-gray-700 dark:text-white"
              >
                <option value="all">Tous les statuts</option>
                {Object.values(USER_STATUS).map(status => (
                  <option key={status} value={status}>
                    {status === USER_STATUS.ACTIVE ? 'Actif' :
                     status === USER_STATUS.PENDING ? 'En attente' :
                     status === USER_STATUS.SUSPENDED ? 'Suspendu' :
                     status === USER_STATUS.REJECTED ? 'Rejeté' : 'Inactif'}
                  </option>
                ))}
              </select>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={fetchUsers}
                className="p-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-xl transition-colors"
              >
                <FiRefreshCw className={`${isLoading ? 'animate-spin' : ''} text-gray-600 dark:text-gray-300`} size={20} />
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Users Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700"
        >
          {/* Mobile Card View */}
          <div className="lg:hidden">
            {isLoading ? (
              <div className="p-6 space-y-4">
                {Array(5).fill().map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="h-24 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
                  </div>
                ))}
              </div>
            ) : currentUsers.length > 0 ? (
              <div className="p-4 space-y-4">
                {currentUsers.map((user) => {
                  const roleConfig = getRoleConfig(user.role);
                  const RoleIcon = roleConfig.icon;
                  
                  return (
                    <motion.div
                      key={user.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      whileHover={{ scale: 1.02 }}
                      className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 hover:shadow-md transition-all duration-200 border border-gray-200 dark:border-gray-600"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${roleConfig.color}`}>
                            <RoleIcon size={20} />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900 dark:text-white">
                              {user.name}
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {user.email}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-500">
                              {user.phone}
                            </p>
                          </div>
                        </div>
                        <div className="flex space-x-1">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleUserAction('view', user)}
                            className="p-2 text-indigo-600 hover:bg-indigo-100 dark:hover:bg-indigo-900 rounded-lg transition-colors"
                          >
                            <FiEye size={16} />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleUserAction('edit', user)}
                            className="p-2 text-emerald-600 hover:bg-emerald-100 dark:hover:bg-emerald-900 rounded-lg transition-colors"
                          >
                            <FiEdit2 size={16} />
                          </motion.button>
                          {getDocumentRequirements(user.role).length > 0 && (
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => handleUserAction('documents', user)}
                              className="p-2 text-orange-600 hover:bg-orange-100 dark:hover:bg-orange-900 rounded-lg transition-colors"
                            >
                              <FiFileText size={16} />
                            </motion.button>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className={`px-3 py-1 text-xs font-medium rounded-full ${roleConfig.color}`}>
                            {roleConfig.label}
                          </span>
                          <UserStatusBadge status={user.status} />
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {user.city}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            ) : (
              <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                <FiUsers size={48} className="mx-auto mb-4 text-gray-300 dark:text-gray-600" />
                <p>Aucun utilisateur trouvé</p>
              </div>
            )}
          </div>

          {/* Desktop Table View */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-900">
                <tr>
                  {[
                    { key: 'id', label: 'ID' },
                    { key: 'name', label: 'Utilisateur' },
                    { key: 'email', label: 'Email' },
                    { key: 'role', label: 'Rôle' },
                    { key: 'status', label: 'Statut' },
                    { key: 'city', label: 'Ville' },
                    { key: 'createdAt', label: 'Inscription' },
                    { key: 'actions', label: 'Actions' }
                  ].map((column) => (
                    <th
                      key={column.key}
                      onClick={() => column.key !== 'actions' && handleSort(column.key)}
                      className={`px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider ${
                        column.key !== 'actions' ? 'cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors' : ''
                      }`}
                    >
                      <div className="flex items-center space-x-1">
                        <span>{column.label}</span>
                        {sortConfig.key === column.key && (
                          <span className="text-indigo-500">
                            {sortConfig.direction === 'asc' ? '↑' : '↓'}
                          </span>
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {isLoading ? (
                  Array(usersPerPage).fill().map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      {Array(8).fill().map((_, j) => (
                        <td key={j} className="px-6 py-4">
                          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                        </td>
                      ))}
                    </tr>
                  ))
                ) : currentUsers.length > 0 ? (
                  currentUsers.map((user) => {
                    const roleConfig = getRoleConfig(user.role);
                    const RoleIcon = roleConfig.icon;
                    
                    return (
                      <motion.tr
                        key={user.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        whileHover={{ backgroundColor: 'rgba(99, 102, 241, 0.05)' }}
                        className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                            #{user.id}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-3">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${roleConfig.color}`}>
                              <RoleIcon size={18} />
                            </div>
                            <div>
                              <div className="text-sm font-medium text-gray-900 dark:text-white">
                                {user.name}
                              </div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">
                                {user.phone}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 dark:text-gray-100">
                            {user.email}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-3 py-1 text-xs font-medium rounded-full ${roleConfig.color}`}>
                            {roleConfig.label}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <UserStatusBadge status={user.status} />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                          {user.city}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {new Date(user.createdAt).toLocaleDateString('fr-FR')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end space-x-2">
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => handleUserAction('view', user)}
                              className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-200 transition-colors"
                              title="Voir les détails"
                            >
                              <FiEye size={18} />
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => handleUserAction('edit', user)}
                              className="text-emerald-600 hover:text-emerald-900 dark:text-emerald-400 dark:hover:text-emerald-200 transition-colors"
                              title="Modifier"
                            >
                              <FiEdit2 size={18} />
                            </motion.button>
                            {getDocumentRequirements(user.role).length > 0 && (
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => handleUserAction('documents', user)}
                                className="text-orange-600 hover:text-orange-900 dark:text-orange-400 dark:hover:text-orange-200 transition-colors"
                                title="Examiner les documents"
                              >
                                <FiFileText size={18} />
                              </motion.button>
                            )}
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => handleUserAction('delete', user)}
                              className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-200 transition-colors"
                              title="Supprimer"
                            >
                              <FiTrash2 size={18} />
                            </motion.button>
                          </div>
                        </td>
                      </motion.tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="8" className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                      <div className="flex flex-col items-center space-y-4">
                        <FiUsers size={48} className="text-gray-300 dark:text-gray-600" />
                        <div>
                          <p className="text-lg font-medium">Aucun utilisateur trouvé</p>
                          <p className="text-sm">Essayez de modifier vos critères de recherche</p>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {filteredUsers.length > 0 && (
            <div className="bg-white dark:bg-gray-800 px-6 py-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="text-sm text-gray-700 dark:text-gray-300">
                  Affichage de <span className="font-medium">{indexOfFirstUser + 1}</span> à{' '}
                  <span className="font-medium">{Math.min(indexOfLastUser, filteredUsers.length)}</span> sur{' '}
                  <span className="font-medium">{filteredUsers.length}</span> résultats
                </div>
                
                <div className="flex items-center space-x-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <FiChevronLeft size={16} />
                  </motion.button>
                  
                  <div className="flex space-x-1">
                    {Array.from({ length: Math.min(5, totalPages) }).map((_, idx) => {
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = idx + 1;
                      } else if (currentPage <= 3) {
                        pageNum = idx + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + idx;
                      } else {
                        pageNum = currentPage - 2 + idx;
                      }
                      
                      if (pageNum > 0 && pageNum <= totalPages) {
                        return (
                          <motion.button
                            key={pageNum}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setCurrentPage(pageNum)}
                            className={`px-3 py-2 rounded-lg transition-colors text-sm font-medium ${
                              currentPage === pageNum
                                ? 'bg-indigo-600 text-white shadow-lg'
                                : 'border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                            }`}
                          >
                            {pageNum}
                          </motion.button>
                        );
                      }
                      return null;
                    })}
                  </div>
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <FiChevronRight size={16} />
                  </motion.button>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>

      {/* Modals */}
      <UserForm
        user={selectedUser}
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setSelectedUser(null);
        }}
        onSubmit={handleFormSubmit}
        showNotification={showNotification}
      />

      <UserDetailModal
        user={selectedUser}
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedUser(null);
        }}
        onEdit={(user) => {
          setIsDetailModalOpen(false);
          setSelectedUser(user);
          setIsFormOpen(true);
        }}
        onDocumentReview={(user) => {
          setIsDetailModalOpen(false);
          setSelectedUser(user);
          setIsDocumentModalOpen(true);
        }}
      />

      <DocumentReviewModal
        user={selectedUser}
        isOpen={isDocumentModalOpen}
        onClose={() => {
          setIsDocumentModalOpen(false);
          setSelectedUser(null);
        }}
        onStatusUpdate={(userId, status) => {
          setUsers(prev => prev.map(user => 
            user.id === userId ? { ...user, documentStatus: status } : user
          ));
        }}
        showNotification={showNotification}
      />
    </AdminLayout>
  );
};

export default UserListPage;