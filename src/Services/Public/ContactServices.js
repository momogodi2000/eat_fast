// src/Services/Public/ContactServices.js
/**
 * Contact Services
 * Handles contact form functionality and validation.
 */

import contactService from './contactService';

// Contact form configuration
export const getContactFormConfig = () => ({
  fields: [
    {
      name: 'name',
      label: 'Nom complet',
      type: 'text',
      required: true,
      placeholder: 'Votre nom complet',
      validation: {
        minLength: 2,
        maxLength: 100
      }
    },
    {
      name: 'email',
      label: 'Adresse email',
      type: 'email',
      required: true,
      placeholder: 'votre@email.com',
      validation: {
        pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      }
    },
    {
      name: 'phone',
      label: 'Numéro de téléphone',
      type: 'tel',
      required: false,
      placeholder: '+237 6XX XXX XXX',
      validation: {
        pattern: /^\+?[0-9\s\-\(\)]{8,}$/
      }
    },
    {
      name: 'subject',
      label: 'Sujet',
      type: 'select',
      required: true,
      options: [
        { value: 'general', label: 'Question générale' },
        { value: 'support', label: 'Support technique' },
        { value: 'partnership', label: 'Partenariat' },
        { value: 'complaint', label: 'Réclamation' },
        { value: 'suggestion', label: 'Suggestion' },
        { value: 'other', label: 'Autre' }
      ]
    },
    {
      name: 'message',
      label: 'Message',
      type: 'textarea',
      required: true,
      placeholder: 'Décrivez votre demande...',
      validation: {
        minLength: 10,
        maxLength: 1000
      }
    }
  ],
  // Additional configuration for dropdowns
  subjects: [
    { value: 'general', label: 'Question générale' },
    { value: 'support', label: 'Support technique' },
    { value: 'partnership', label: 'Partenariat' },
    { value: 'complaint', label: 'Réclamation' },
    { value: 'suggestion', label: 'Suggestion' },
    { value: 'other', label: 'Autre' }
  ],
  contactMethods: [
    { value: 'email', label: 'Email' },
    { value: 'phone', label: 'Téléphone' },
    { value: 'whatsapp', label: 'WhatsApp' },
    { value: 'sms', label: 'SMS' }
  ],
  maxMessageLength: 1000,
  minMessageLength: 10
});

// Validation functions
export const isValidEmail = (email) => {
  if (!email) return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isValidPhone = (phone) => {
  if (!phone) return true; // Phone is optional
  const phoneRegex = /^\+?[0-9\s\-\(\)]{8,}$/;
  return phoneRegex.test(phone);
};

export const isValidUrl = (url) => {
  if (!url) return true; // URL is optional
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

// Contact form validation
export const validateContactForm = (formData) => {
  const errors = {};
  const config = getContactFormConfig();

  config.fields.forEach(field => {
    const value = formData[field.name];
    
    // Required field validation
    if (field.required && (!value || value.trim() === '')) {
      errors[field.name] = `${field.label} est requis`;
      return;
    }

    // Skip validation for empty optional fields
    if (!field.required && (!value || value.trim() === '')) {
      return;
    }

    // Email validation
    if (field.name === 'email' && !isValidEmail(value)) {
      errors[field.name] = 'Adresse email invalide';
    }

    // Phone validation
    if (field.name === 'phone' && !isValidPhone(value)) {
      errors[field.name] = 'Numéro de téléphone invalide';
    }

    // Length validation
    if (field.validation?.minLength && value.length < field.validation.minLength) {
      errors[field.name] = `${field.label} doit contenir au moins ${field.validation.minLength} caractères`;
    }

    if (field.validation?.maxLength && value.length > field.validation.maxLength) {
      errors[field.name] = `${field.label} ne peut pas dépasser ${field.validation.maxLength} caractères`;
    }

    // Pattern validation
    if (field.validation?.pattern && !field.validation.pattern.test(value)) {
      errors[field.name] = `${field.label} n'est pas au bon format`;
    }
  });

  return errors;
};

// Format error messages
export const formatErrorMessages = (errors) => {
  return Object.values(errors).join('\n');
};

// Get character count for text areas
export const getCharacterCount = (text, maxLength) => {
  const count = text ? text.length : 0;
  return {
    count,
    remaining: maxLength - count,
    isOverLimit: count > maxLength
  };
};

// Contact services wrapper
const contactServices = {
  // Submit contact form
  submitContact: async (formData) => {
    try {
      // Validate form data
      const errors = validateContactForm(formData);
      if (Object.keys(errors).length > 0) {
        throw new Error(formatErrorMessages(errors));
      }

      // Submit to backend
      const response = await contactService.submit(formData);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Submit contact form (alias for compatibility)
  submitContactForm: async (formData) => {
    return contactServices.submitContact(formData);
  },

  // Check service health
  checkServiceHealth: async () => {
    try {
      const response = await contactService.health();
      return { success: true, data: response };
    } catch (error) {
      return { success: false, message: 'Service indisponible' };
    }
  },

  // Get contact form configuration
  getFormConfig: getContactFormConfig,

  // Validate form data
  validateForm: validateContactForm,

  // Validation helpers
  isValidEmail,
  isValidPhone,
  isValidUrl,

  // Utility functions
  formatErrorMessages,
  getCharacterCount
};

export default contactServices; 