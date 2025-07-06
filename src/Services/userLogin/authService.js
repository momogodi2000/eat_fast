import { baseURI } from "../db_connection";

const postFunction = (userData) => {
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  };

  return options;
};

class AuthService {
  constructor() {
    //this.apiClient = dbConnection;
    this.baseEndpoint = `${baseURI}/auth`; // Updated to use menu endpoints
    this.partnerEndPoint = `${baseURI}/partner-application`;
  }

  async createUser(userData) {
    try {
      // Si delivery ou restaurant_manager avec documents → route partner
      if (
        ["delivery", "restaurant_manager"].includes(userData.user_type) &&
        userData.documents?.length > 0
      ) {
        return await this.submitPartnerApplication(userData);
      }
      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      };
      const response = await fetch(`${this.baseEndpoint}/register`, options);

      const responseData = await response.json();
      return responseData;
    } catch (error) {
      throw error;
    }
  }

  // Vérifier si les documents requis sont présents
  hasRequiredDocuments(userData) {
    if (userData.user_type === "delivery") {
      return (
        userData.documents.id_document && userData.documents.driving_license
      );
    }

    if (userData.user_type === "restaurant_manager") {
      return (
        userData.documents.id_document &&
        userData.documents.business_license &&
        userData.documents.health_certificate
      );
    }

    return false;
  }

  async submitPartnerApplication(userData) {
    const formData = new FormData();

    // Mapper vos données vers le format partner
    formData.append(
      "contact_name",
      `${userData.first_name} ${userData.last_name}`
    );
    formData.append("email", userData.email);
    formData.append("phone", userData.phone_number);
    formData.append("terms_accepted", "true");

    // Type de partenaire
    if (userData.user_type === "delivery") {
      formData.append("partner_type", "delivery-agent");
      formData.append("address", "À compléter");
      formData.append("city", "Yaoundé");
      formData.append("vehicle_type", "motorcycle");
      formData.append("driving_license", "Voir documents");
    } else if (userData.user_type === "restaurant_manager") {
      formData.append("partner_type", "restaurant");
      formData.append("business_name", `Restaurant ${userData.first_name}`);
      formData.append("cuisine_type", "Local");
      formData.append("capacity", "50");
      formData.append("opening_hours", "08:00-22:00");
      formData.append("address", "À compléter");
      formData.append("city", "Yaoundé");
      formData.append("legal_status", "sole_proprietor");
      formData.append("tax_id", "À fournir");
    }

    // Ajouter les fichiers
    userData.documents.forEach((file, index) => {
      if (index === 0) {
        formData.append("id_document", file);
      } else if (index === 1) {
        formData.append("health_certificate", file);
      } else {
        formData.append("photos", file);
      }
    });

    const response = await fetch(this.partnerEndPoint, {
      method: "POST",
      body: formData,
    });

    const responseData = await response.json();

    if (!response.ok) {
      throw new Error(responseData.message || "Erreur soumission");
    }

    // Retourner format attendu par votre frontend
    return {
      first_name: userData.first_name,
      last_name: userData.last_name,
      email: userData.email,
      phone_number: userData.phone_number,
      user_type: userData.user_type,
      id: responseData.data?.id,
      status: "inactive",
    };
  }

  async submitPartnerApplication(userData) {
    const formData = new FormData();

    // Mapper les données de base
    formData.append(
      "contact_name",
      `${userData.first_name} ${userData.last_name}`
    );
    formData.append("email", userData.email);
    formData.append("phone", userData.phone_number);
    formData.append("terms_accepted", "true");

    // Mapper selon le type d'utilisateur
    if (userData.user_type === "delivery") {
      formData.append("partner_type", "delivery-agent");
      formData.append("address", userData.address);
      formData.append("city", userData.city);
      formData.append("vehicle_type", userData.vehicle_type);
      formData.append("driving_license", "Voir document joint");

      // MAPPER LES DOCUMENTS SPÉCIFIQUES vers les champs attendus par votre backend
      if (userData.documents.id_document) {
        formData.append("id_document", userData.documents.id_document);
      }

      // Votre backend attend peut-être 'health_certificate' même pour delivery
      // On peut utiliser le permis de conduire comme "certificat"
      if (userData.documents.driving_license) {
        formData.append(
          "health_certificate",
          userData.documents.driving_license
        );
      }

      // Si assurance présente, l'ajouter comme photo supplémentaire
      if (userData.documents.insurance) {
        formData.append("photos", userData.documents.insurance);
      }
    } else if (userData.user_type === "restaurant_manager") {
      formData.append("partner_type", "restaurant");
      formData.append("business_name", `Restaurant ${userData.first_name}`);
      formData.append("cuisine_type", "Cuisine locale");
      formData.append("capacity", "50");
      formData.append("opening_hours", "08:00-22:00");
      formData.append("address", userData.address);
      formData.append("city", userData.city);
      formData.append("legal_status", "sole_proprietor");
      formData.append("tax_id", "À fournir lors de l'activation");

      // MAPPER LES DOCUMENTS SPÉCIFIQUES
      if (userData.documents.id_document) {
        formData.append("id_document", userData.documents.id_document);
      }

      if (userData.documents.health_certificate) {
        formData.append(
          "health_certificate",
          userData.documents.health_certificate
        );
      }

      // Business license peut aller comme photo ou document supplémentaire
      if (userData.documents.business_license) {
        formData.append("photos", userData.documents.business_license);
      }

      // Menu optionnel
      if (userData.documents.menu) {
        formData.append("menu", userData.documents.menu);
      }
    }

    // Appeler votre route partner-application existante
    const response = await fetch(this.partnerEndpoint, {
      method: "POST",
      body: formData,
    });

    const responseData = await response.json();

    if (!response.ok) {
      throw new Error(responseData.message || "Erreur lors de la soumission");
    }

    // Retourner le format attendu par votre frontend
    return {
      first_name: userData.first_name,
      last_name: userData.last_name,
      email: userData.email,
      phone_number: userData.phone_number,
      user_type: userData.user_type,
      id: responseData.data?.id,
      status: "pending",
      partner_application_id: responseData.data?.id,
    };
  }

  // Méthode pour obtenir la liste des documents requis (pour affichage)
  getRequiredDocuments(userType) {
    const requirements = {
      delivery: [
        {
          key: "id_document",
          label: "Pièce d'identité (CNI ou Passeport)",
          required: true,
          description: "Document d'identité officiel en cours de validité",
        },
        {
          key: "driving_license",
          label: "Permis de conduire",
          required: true,
          description: "Permis de conduire valide pour véhicule à moteur",
        },
        {
          key: "insurance",
          label: "Assurance véhicule",
          required: false,
          description: "Attestation d'assurance de votre véhicule (recommandé)",
        },
      ],
      restaurant_manager: [
        {
          key: "id_document",
          label: "Pièce d'identité du gérant",
          required: true,
          description: "Document d'identité du responsable du restaurant",
        },
        {
          key: "business_license",
          label: "Licence commerciale",
          required: true,
          description: "Registre du commerce ou licence d'exploitation",
        },
        {
          key: "health_certificate",
          label: "Certificat sanitaire",
          required: true,
          description: "Autorisation d'hygiène et de salubrité",
        },
        {
          key: "menu",
          label: "Menu du restaurant",
          required: false,
          description: "Carte des plats et prix (optionnel)",
        },
      ],
    };

    return requirements[userType] || [];
  }

  // Méthode pour valider les documents côté client
  validateDocuments(userType, documents) {
    const errors = {};
    const requirements = this.getRequiredDocuments(userType);

    requirements.forEach((req) => {
      if (req.required && !documents[req.key]) {
        errors[req.key] = `${req.label} est requis`;
      }
    });

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  }

  async getUserByLogin(userData) {
    try {
      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      };

      const response = await fetch(`${this.baseEndpoint}/login`, options);

      const responseData = await response.json();

      if (!response.ok) {
        // Erreurs spécifiques selon le code de statut
        switch (response.status) {
          case 404:
            throw new Error(responseData.error || "Utilisateur non trouvé");
          case 401:
            throw new Error(responseData.error || "Mot de passe incorrect");
          case 500:
            throw new Error(
              responseData.error || "Erreur de connexion au serveur"
            );
          default:
            throw new Error(responseData.error || "Erreur de connexion");
        }
      }

      // Succès - retourner les données
      return {
        success: true,
        message: responseData.message,
        firebase_uid: responseData.firebase_uid,
        requiresMFA: true, // Indique qu'une vérification 2FA est nécessaire
      };
    } catch (error) {
      // Gérer les erreurs réseau ou autres
      if (error.name === "TypeError" && error.message.includes("fetch")) {
        throw new Error(
          "Problème de connexion réseau. Vérifiez votre connexion internet."
        );
      }

      // Propager l'erreur avec un message utilisateur-friendly
      throw new Error(error.message || "Erreur de connexion");
    }
  }
}

const AuthServices = new AuthService();

export { AuthServices };