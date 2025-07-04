import React from "react";
import { CheckCircle, AlertCircle, Info } from "lucide-react";

const DocumentRequirements = ({ userType }) => {
  const getRequiredDocuments = (type) => {
    const requirements = {
      delivery: [
        {
          key: "id_document",
          label: "Pièce d'identité",
          required: true,
          description: "CNI ou Passeport en cours de validité",
          icon: "🆔",
        },
        {
          key: "driving_license",
          label: "Permis de conduire",
          required: true,
          description: "Permis valide pour véhicule à moteur",
          icon: "🚗",
        },
        {
          key: "insurance",
          label: "Assurance véhicule",
          required: false,
          description: "Attestation d'assurance (recommandé)",
          icon: "📄",
        },
      ],
      restaurant_manager: [
        {
          key: "id_document",
          label: "Pièce d'identité",
          required: true,
          description: "Document d'identité du gérant",
          icon: "🆔",
        },
        {
          key: "business_license",
          label: "Licence commerciale",
          required: true,
          description: "Registre du commerce ou autorisation",
          icon: "🏢",
        },
        {
          key: "health_certificate",
          label: "Certificat sanitaire",
          required: true,
          description: "Autorisation d'hygiène alimentaire",
          icon: "🏥",
        },
        {
          key: "menu",
          label: "Menu restaurant",
          required: false,
          description: "Carte des plats et prix",
          icon: "📋",
        },
      ],
    };

    return requirements[type] || [];
  };

  const documents = getRequiredDocuments(userType);

  if (!userType || documents.length === 0) {
    return null;
  }

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
      <div className="flex items-center mb-3">
        <Info className="text-blue-600 mr-2" size={20} />
        <h3 className="font-semibold text-blue-900">
          Documents requis pour{" "}
          {userType === "delivery" ? "livreur" : "gérant de restaurant"}
        </h3>
      </div>

      <div className="space-y-2">
        {documents.map((doc) => (
          <div key={doc.key} className="flex items-start">
            <span className="mr-2 text-lg">{doc.icon}</span>
            <div className="flex-1">
              <div className="flex items-center">
                <span className="font-medium text-gray-900">{doc.label}</span>
                {doc.required ? (
                  <span className="ml-2 text-red-500 text-sm font-semibold">
                    *
                  </span>
                ) : (
                  <span className="ml-2 text-gray-500 text-sm">
                    (optionnel)
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-600">{doc.description}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-3 text-xs text-blue-700">
        <strong>Formats acceptés:</strong> PDF, JPG, PNG •{" "}
        <strong>Taille max:</strong> 10MB par fichier
      </div>
    </div>
  );
};

export default DocumentRequirements;

// {(formData.user_type === "delivery" || formData.user_type === "restaurant_manager") && (
//   <DocumentRequirements userType={formData.user_type} />
// )}
