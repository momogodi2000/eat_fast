import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiX, FiUser, FiMail, FiPhone, FiMapPin, FiShield, FiFileText,
  FiUpload, FiCheck, FiAlertCircle, FiInfo, FiCamera, FiImage,
  FiFile, FiCheckCircle, FiXCircle, FiArrowLeft, FiSave
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

// File Upload Component
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
  const [uploadProgress, setUploadProgress] = useState(0);

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
    // Simulate file upload
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 10;
      });
    }, 100);

    // Simulate API call
    setTimeout(() => {
      onChange({ target: { name, value: file } });
      setUploadProgress(0);
    }, 1000);
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
      <div
        className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          isDragOver
            ? 'border-indigo-400 bg-indigo-50 dark:bg-indigo-900/20'
            : error
            ? 'border-red-300 bg-red-50 dark:bg-red-900/20'
            : 'border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {currentFile ? (
          <div className="space-y-2">
            <div className="flex items-center justify-center">
              <FiFile className="text-indigo-500" size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {currentFile.name}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {formatFileSize(currentFile.size)}
              </p>
            </div>
            {uploadProgress > 0 && uploadProgress < 100 && (
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            )}
            <button
              type="button"
              onClick={() => onChange({ target: { name, value: null } })}
              className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-200 text-sm"
            >
              Supprimer
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            <FiUpload className="mx-auto text-gray-400" size={24} />
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Glissez-déposez un fichier ici ou{' '}
                <label className="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300 cursor-pointer">
                  <span>browse</span>
                  <input
                    type="file"
                    name={name}
                    accept={accept}
                    onChange={(e) => handleFileUpload(e.target.files[0])}
                    className="hidden"
                  />
                </label>
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {description}
              </p>
            </div>
          </div>
        )}
      </div>
      {error && (
        <p className="text-sm text-red-600 dark:text-red-400 flex items-center">
          <FiAlertCircle className="mr-1" size={14} />
          {error}
        </p>
      )}
    </div>
  );
};

const UserFormPage = ({ user, isOpen, onClose, onSubmit, showNotification }) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone_number: '',
    password: '',
    confirm_password: '',
    role: USER_ROLES.CLIENT,
    status: USER_STATUS.PENDING,
    city: '',
    address: '',
    documents: {}
  });
  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const totalSteps = 3;

  useEffect(() => {
    if (user) {
      setFormData({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        email: user.email || '',
        phone_number: user.phone_number || '',
        password: '',
        confirm_password: '',
        role: user.role || USER_ROLES.CLIENT,
        status: user.status || USER_STATUS.PENDING,
        city: user.city || '',
        address: user.address || '',
        documents: user.documents || {}
      });
    } else {
      setFormData({
        first_name: '',
        last_name: '',
        email: '',
        phone_number: '',
        password: '',
        confirm_password: '',
        role: USER_ROLES.CLIENT,
        status: USER_STATUS.PENDING,
        city: '',
        address: '',
        documents: {}
      });
    }
    setCurrentStep(1);
    setErrors({});
  }, [user, isOpen]);

  const validateStep = (step) => {
    const newErrors = {};

    if (step === 1) {
      if (!formData.first_name.trim()) newErrors.first_name = 'Le prénom est requis';
      if (!formData.last_name.trim()) newErrors.last_name = 'Le nom est requis';
      if (!formData.email.trim()) {
        newErrors.email = 'L\'email est requis';
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = 'Format d\'email invalide';
      }
      if (!formData.phone_number.trim()) newErrors.phone_number = 'Le numéro de téléphone est requis';
    }

    if (step === 2) {
      if (!user && !formData.password) {
        newErrors.password = 'Le mot de passe est requis';
      } else if (formData.password && formData.password.length < 6) {
        newErrors.password = 'Le mot de passe doit contenir au moins 6 caractères';
      }
      if (formData.password !== formData.confirm_password) {
        newErrors.confirm_password = 'Les mots de passe ne correspondent pas';
      }
      if (!formData.city.trim()) newErrors.city = 'La ville est requise';
    }

    if (step === 3) {
      const documentRequirements = getDocumentRequirements(formData.role);
      documentRequirements.forEach(doc => {
        if (doc.required && !formData.documents[doc.key]) {
          newErrors[`documents.${doc.key}`] = `${doc.label} est requis`;
        }
      });
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(Math.min(currentStep + 1, totalSteps));
    }
  };

  const handlePrevious = () => {
    setCurrentStep(Math.max(currentStep - 1, 1));
  };

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
      onClose();
    } catch (error) {
      showNotification(error.message, 'error');
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
    const [section, key] = name.split('.');
    
    if (section === 'documents') {
      setFormData(prev => ({
        ...prev,
        documents: {
          ...prev.documents,
          [key]: value
        }
      }));
    }
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  if (!isOpen) return null;

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
            className="inline-block w-full max-w-4xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white dark:bg-gray-800 shadow-xl rounded-2xl"
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
                    {user ? 'Modifier l\'utilisateur' : 'Nouvel utilisateur'}
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Étape {currentStep} sur {totalSteps}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
              >
                <FiX size={24} />
              </button>
            </div>

            {/* Progress Bar */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-2">
                {[1, 2, 3].map(step => (
                  <div key={step} className="flex items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      step <= currentStep
                        ? 'bg-indigo-600 text-white'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                    }`}>
                      {step < currentStep ? <FiCheck size={16} /> : step}
                    </div>
                    {step < 3 && (
                      <div className={`w-16 h-1 mx-2 ${
                        step < currentStep ? 'bg-indigo-600' : 'bg-gray-200 dark:bg-gray-700'
                      }`} />
                    )}
                  </div>
                ))}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
                {currentStep === 1 && 'Informations personnelles'}
                {currentStep === 2 && 'Sécurité et localisation'}
                {currentStep === 3 && 'Documents requis'}
              </div>
            </div>

            {/* Form Content */}
            <div className="space-y-6">
              {currentStep === 1 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-6"
                >
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Prénom <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="first_name"
                      value={formData.first_name}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors dark:bg-gray-700 dark:text-white ${
                        errors.first_name ? 'border-red-300' : 'border-gray-300 dark:border-gray-600'
                      }`}
                      placeholder="Prénom"
                    />
                    {errors.first_name && (
                      <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.first_name}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Nom <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="last_name"
                      value={formData.last_name}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors dark:bg-gray-700 dark:text-white ${
                        errors.last_name ? 'border-red-300' : 'border-gray-300 dark:border-gray-600'
                      }`}
                      placeholder="Nom"
                    />
                    {errors.last_name && (
                      <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.last_name}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors dark:bg-gray-700 dark:text-white ${
                        errors.email ? 'border-red-300' : 'border-gray-300 dark:border-gray-600'
                      }`}
                      placeholder="email@exemple.com"
                    />
                    {errors.email && (
                      <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.email}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Téléphone <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      name="phone_number"
                      value={formData.phone_number}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors dark:bg-gray-700 dark:text-white ${
                        errors.phone_number ? 'border-red-300' : 'border-gray-300 dark:border-gray-600'
                      }`}
                      placeholder="+237 XXX XXX XXX"
                    />
                    {errors.phone_number && (
                      <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.phone_number}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Rôle <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="role"
                      value={formData.role}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors dark:bg-gray-700 dark:text-white"
                    >
                      <option value={USER_ROLES.CLIENT}>Client</option>
                      <option value={USER_ROLES.AGENT_SUPPORT}>Agent Support</option>
                      <option value={USER_ROLES.ADMINISTRATOR}>Administrateur</option>
                      <option value={USER_ROLES.RESTAURANT_MANAGER}>Gestionnaire Restaurant</option>
                      <option value={USER_ROLES.DELIVERY_AGENT}>Agent Livreur</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Statut <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors dark:bg-gray-700 dark:text-white"
                    >
                      <option value={USER_STATUS.ACTIVE}>Actif</option>
                      <option value={USER_STATUS.PENDING}>En attente</option>
                      <option value={USER_STATUS.SUSPENDED}>Suspendu</option>
                      <option value={USER_STATUS.REJECTED}>Rejeté</option>
                      <option value={USER_STATUS.INACTIVE}>Inactif</option>
                    </select>
                  </div>
                </motion.div>
              )}

              {currentStep === 2 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-6"
                >
                  {!user && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Mot de passe <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="password"
                          name="password"
                          value={formData.password}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors dark:bg-gray-700 dark:text-white ${
                            errors.password ? 'border-red-300' : 'border-gray-300 dark:border-gray-600'
                          }`}
                          placeholder="Mot de passe"
                        />
                        {errors.password && (
                          <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.password}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Confirmer le mot de passe <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="password"
                          name="confirm_password"
                          value={formData.confirm_password}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors dark:bg-gray-700 dark:text-white ${
                            errors.confirm_password ? 'border-red-300' : 'border-gray-300 dark:border-gray-600'
                          }`}
                          placeholder="Confirmer le mot de passe"
                        />
                        {errors.confirm_password && (
                          <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.confirm_password}</p>
                        )}
                      </div>
                    </>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Ville <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors dark:bg-gray-700 dark:text-white ${
                        errors.city ? 'border-red-300' : 'border-gray-300 dark:border-gray-600'
                      }`}
                      placeholder="Ville"
                    />
                    {errors.city && (
                      <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.city}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Adresse
                    </label>
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors dark:bg-gray-700 dark:text-white"
                      placeholder="Adresse complète"
                    />
                  </div>
                </motion.div>
              )}

              {currentStep === 3 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                  <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                      <FiInfo className="text-blue-500 mt-0.5" size={20} />
                      <div>
                        <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200">
                          Documents requis pour {formData.role}
                        </h3>
                        <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                          Veuillez télécharger les documents requis pour ce type d'utilisateur.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {getDocumentRequirements(formData.role).map(doc => (
                      <FileUploadComponent
                        key={doc.key}
                        name={`documents.${doc.key}`}
                        label={doc.label}
                        description={doc.description}
                        required={doc.required}
                        currentFile={formData.documents[doc.key]}
                        onChange={handleDocumentChange}
                        error={errors[`documents.${doc.key}`]}
                      />
                    ))}
                  </div>
                </motion.div>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
              <div className="flex space-x-3">
                {currentStep > 1 && (
                  <button
                    onClick={handlePrevious}
                    className="px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    Précédent
                  </button>
                )}
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={onClose}
                  className="px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Annuler
                </button>

                {currentStep < totalSteps ? (
                  <button
                    onClick={handleNext}
                    className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
                  >
                    Suivant
                  </button>
                ) : (
                  <button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-lg transition-colors flex items-center space-x-2"
                  >
                    <FiSave size={16} />
                    <span>{isSubmitting ? 'Enregistrement...' : 'Enregistrer'}</span>
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default UserFormPage; 