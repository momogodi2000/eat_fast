import React, { useState, useEffect } from 'react';
import ClientsLayout, { useAppContext, AppContext } from '../../../../layouts/clients_layout';
import { 
  User, 
  Edit3, 
  MapPin, 
  Phone, 
  Mail, 
  Calendar, 
  Settings, 
  Shield, 
  CreditCard, 
  Heart, 
  Star, 
  Camera, 
  Save, 
  X, 
  Plus,
  Trash2,
  Eye,
  EyeOff,
  Bell,
  Globe,
  Clock,
  Award
} from 'lucide-react';

const ClientsProfilePage = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [profileData, setProfileData] = useState({
    firstName: 'Ngozi',
    lastName: 'Ekweme',
    email: 'ngozi.ekweme@example.cm',
    phone: '+237 6XX XXX XXX',
    dateOfBirth: '1995-06-15',
    gender: 'female',
    profileImage: '/api/placeholder/120/120',
    addresses: [
      {
        id: 1,
        type: 'home',
        name: 'Domicile',
        address: 'Quartier Bonanjo, Rue de la Paix, Douala',
        isDefault: true
      },
      {
        id: 2,
        type: 'work',
        name: 'Bureau',
        address: 'Akwa, Centre Commercial, Douala',
        isDefault: false
      }
    ],
    preferences: {
      cuisine: ['Camerounaise', 'Européenne', 'Asiatique'],
      dietary: ['Halal'],
      notifications: {
        orders: true,
        promotions: true,
        newsletter: false
      },
      language: 'fr'
    },
    stats: {
      totalOrders: 47,
      favoriteRestaurants: 12,
      averageRating: 4.8,
      memberSince: '2024-01-15'
    }
  });

  const [formData, setFormData] = useState({ ...profileData });

  const tabs = [
    { id: 'profile', label: 'Profil', icon: User },
    { id: 'addresses', label: 'Adresses', icon: MapPin },
    { id: 'preferences', label: 'Préférences', icon: Settings },
    { id: 'security', label: 'Sécurité', icon: Shield },
    { id: 'payment', label: 'Paiement', icon: CreditCard }
  ];

  const handleSave = () => {
    setProfileData({ ...formData });
    setIsEditing(false);
    // Here you would typically make an API call to save the data
    console.log('Profile saved:', formData);
  };

  const handleCancel = () => {
    setFormData({ ...profileData });
    setIsEditing(false);
  };

  const addAddress = () => {
    const newAddress = {
      id: Date.now(),
      type: 'other',
      name: '',
      address: '',
      isDefault: false
    };
    setFormData({
      ...formData,
      addresses: [...formData.addresses, newAddress]
    });
  };

  const removeAddress = (id) => {
    setFormData({
      ...formData,
      addresses: formData.addresses.filter(addr => addr.id !== id)
    });
  };

  const ProfileHeader = () => (
    <div className="relative bg-gradient-to-br from-green-600 via-red-500 to-yellow-500 p-8 rounded-2xl mb-8 overflow-hidden">
      {/* Cameroon flag pattern overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-green-600/20 via-red-500/20 to-yellow-500/20"></div>
      
      <div className="relative flex flex-col md:flex-row items-center gap-6">
        <div className="relative group">
          <div className="w-32 h-32 rounded-full bg-white p-1 shadow-2xl transform transition-all duration-300 group-hover:scale-105">
            <img 
              src={profileData.profileImage} 
              alt="Profile" 
              className="w-full h-full rounded-full object-cover"
            />
            <button className="absolute bottom-2 right-2 bg-white rounded-full p-2 shadow-lg transform transition-all duration-300 hover:scale-110 hover:bg-green-50">
              <Camera className="w-4 h-4 text-green-600" />
            </button>
          </div>
        </div>
        
        <div className="flex-1 text-center md:text-left text-white">
          <h1 className="text-3xl font-bold mb-2 animate-fade-in">
            {profileData.firstName} {profileData.lastName}
          </h1>
          <p className="text-white/90 mb-4 flex items-center justify-center md:justify-start gap-2">
            <Mail className="w-4 h-4" />
            {profileData.email}
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-center transform transition-all duration-300 hover:bg-white/20">
              <div className="text-2xl font-bold">{profileData.stats.totalOrders}</div>
              <div className="text-sm text-white/80">Commandes</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-center transform transition-all duration-300 hover:bg-white/20">
              <div className="text-2xl font-bold">{profileData.stats.favoriteRestaurants}</div>
              <div className="text-sm text-white/80">Favoris</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-center transform transition-all duration-300 hover:bg-white/20">
              <div className="flex items-center justify-center gap-1 text-2xl font-bold">
                {profileData.stats.averageRating}
                <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
              </div>
              <div className="text-sm text-white/80">Note moyenne</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-center transform transition-all duration-300 hover:bg-white/20">
              <div className="flex items-center justify-center gap-1 text-lg font-bold">
                <Award className="w-5 h-5 text-yellow-400" />
                VIP
              </div>
              <div className="text-sm text-white/80">Statut</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const TabNavigation = () => (
    <div className="flex flex-wrap gap-2 mb-8 bg-white rounded-xl p-2 shadow-lg">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-3 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 ${
              activeTab === tab.id
                ? 'bg-gradient-to-r from-green-500 to-yellow-500 text-white shadow-lg'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Icon className={`w-5 h-5 transition-all duration-300 ${
              activeTab === tab.id ? 'animate-bounce' : ''
            }`} />
            <span className="hidden sm:block">{tab.label}</span>
          </button>
        );
      })}
    </div>
  );

  const ProfileTab = () => (
    <div className="bg-white rounded-2xl shadow-xl p-8 transform transition-all duration-300 hover:shadow-2xl">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <User className="w-6 h-6 text-green-600" />
          Informations personnelles
        </h2>
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-yellow-500 text-white px-4 py-2 rounded-lg hover:shadow-lg transform transition-all duration-300 hover:scale-105"
          >
            <Edit3 className="w-4 h-4" />
            Modifier
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transform transition-all duration-300 hover:scale-105"
            >
              <Save className="w-4 h-4" />
              Sauvegarder
            </button>
            <button
              onClick={handleCancel}
              className="flex items-center gap-2 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transform transition-all duration-300 hover:scale-105"
            >
              <X className="w-4 h-4" />
              Annuler
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="form-group">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Prénom
            </label>
            <input
              type="text"
              value={isEditing ? formData.firstName : profileData.firstName}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              disabled={!isEditing}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 disabled:bg-gray-50"
            />
          </div>
          
          <div className="form-group">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nom de famille
            </label>
            <input
              type="text"
              value={isEditing ? formData.lastName : profileData.lastName}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              disabled={!isEditing}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 disabled:bg-gray-50"
            />
          </div>

          <div className="form-group">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              value={isEditing ? formData.email : profileData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              disabled={!isEditing}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 disabled:bg-gray-50"
            />
          </div>
        </div>

        <div className="space-y-4">
          <div className="form-group">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Téléphone
            </label>
            <input
              type="tel"
              value={isEditing ? formData.phone : profileData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              disabled={!isEditing}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 disabled:bg-gray-50"
            />
          </div>

          <div className="form-group">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date de naissance
            </label>
            <input
              type="date"
              value={isEditing ? formData.dateOfBirth : profileData.dateOfBirth}
              onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
              disabled={!isEditing}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 disabled:bg-gray-50"
            />
          </div>

          <div className="form-group">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Genre
            </label>
            <select
              value={isEditing ? formData.gender : profileData.gender}
              onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
              disabled={!isEditing}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 disabled:bg-gray-50"
            >
              <option value="male">Masculin</option>
              <option value="female">Féminin</option>
              <option value="other">Autre</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );

  const AddressesTab = () => (
    <div className="bg-white rounded-2xl shadow-xl p-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <MapPin className="w-6 h-6 text-green-600" />
          Mes adresses
        </h2>
        <button
          onClick={addAddress}
          className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-yellow-500 text-white px-4 py-2 rounded-lg hover:shadow-lg transform transition-all duration-300 hover:scale-105"
        >
          <Plus className="w-4 h-4" />
          Ajouter une adresse
        </button>
      </div>

      <div className="space-y-4">
        {formData.addresses.map((address) => (
          <div
            key={address.id}
            className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300 transform hover:scale-102"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${address.isDefault ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                <div>
                  <h3 className="font-semibold text-lg capitalize">{address.name || address.type}</h3>
                  {address.isDefault && (
                    <span className="text-sm text-green-600 font-medium">Adresse par défaut</span>
                  )}
                </div>
              </div>
              <button
                onClick={() => removeAddress(address.id)}
                className="text-red-500 hover:text-red-700 transform transition-all duration-300 hover:scale-110"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
            <p className="text-gray-600 mb-4">{address.address}</p>
            <div className="flex gap-2">
              <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                Modifier
              </button>
              <button className="text-sm text-green-600 hover:text-green-800 font-medium">
                Définir par défaut
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const PreferencesTab = () => (
    <div className="bg-white rounded-2xl shadow-xl p-8">
      <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2 mb-6">
        <Settings className="w-6 h-6 text-green-600" />
        Préférences
      </h2>

      <div className="space-y-8">
        <div>
          <h3 className="text-lg font-semibold mb-4 text-gray-800">Cuisines préférées</h3>
          <div className="flex flex-wrap gap-3">
            {['Camerounaise', 'Européenne', 'Asiatique', 'Africaine', 'Française', 'Italienne'].map((cuisine) => (
              <label key={cuisine} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={profileData.preferences.cuisine.includes(cuisine)}
                  className="w-4 h-4 text-green-600 rounded focus:ring-green-500"
                />
                <span className="text-gray-700">{cuisine}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4 text-gray-800">Restrictions alimentaires</h3>
          <div className="flex flex-wrap gap-3">
            {['Halal', 'Végétarien', 'Végan', 'Sans gluten', 'Casher'].map((dietary) => (
              <label key={dietary} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={profileData.preferences.dietary.includes(dietary)}
                  className="w-4 h-4 text-green-600 rounded focus:ring-green-500"
                />
                <span className="text-gray-700">{dietary}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4 text-gray-800">Notifications</h3>
          <div className="space-y-4">
            <label className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
              <div className="flex items-center gap-3">
                <Bell className="w-5 h-5 text-gray-600" />
                <div>
                  <div className="font-medium">Commandes</div>
                  <div className="text-sm text-gray-500">Notifications sur l'état de vos commandes</div>
                </div>
              </div>
              <input
                type="checkbox"
                checked={profileData.preferences.notifications.orders}
                className="w-5 h-5 text-green-600 rounded focus:ring-green-500"
              />
            </label>

            <label className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
              <div className="flex items-center gap-3">
                <Heart className="w-5 h-5 text-gray-600" />
                <div>
                  <div className="font-medium">Promotions</div>
                  <div className="text-sm text-gray-500">Offres spéciales et réductions</div>
                </div>
              </div>
              <input
                type="checkbox"
                checked={profileData.preferences.notifications.promotions}
                className="w-5 h-5 text-green-600 rounded focus:ring-green-500"
              />
            </label>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4 text-gray-800">Langue</h3>
          <select className="w-full md:w-64 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent">
            <option value="fr">Français</option>
            <option value="en">English</option>
            <option value="local">Langues locales</option>
          </select>
        </div>
      </div>
    </div>
  );

  const SecurityTab = () => (
    <div className="bg-white rounded-2xl shadow-xl p-8">
      <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2 mb-6">
        <Shield className="w-6 h-6 text-green-600" />
        Sécurité
      </h2>

      <div className="space-y-6">
        <div className="border border-gray-200 rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-4">Changer le mot de passe</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mot de passe actuel
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nouveau mot de passe
              </label>
              <input
                type="password"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirmer le nouveau mot de passe
              </label>
              <input
                type="password"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            
            <button className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transform transition-all duration-300 hover:scale-105">
              Mettre à jour le mot de passe
            </button>
          </div>
        </div>

        <div className="border border-gray-200 rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-4">Authentification à deux facteurs</h3>
          <p className="text-gray-600 mb-4">
            Ajoutez une couche de sécurité supplémentaire à votre compte
          </p>
          <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transform transition-all duration-300 hover:scale-105">
            Activer 2FA
          </button>
        </div>
      </div>
    </div>
  );

  const PaymentTab = () => (
    <div className="bg-white rounded-2xl shadow-xl p-8">
      <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2 mb-6">
        <CreditCard className="w-6 h-6 text-green-600" />
        Méthodes de paiement
      </h2>

      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-green-500 transition-all duration-300 cursor-pointer transform hover:scale-105">
            <Plus className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-600">Ajouter une carte</p>
          </div>
          
          <div className="bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-xl p-6 transform transition-all duration-300 hover:scale-105">
            <div className="flex justify-between items-start mb-4">
              <div className="text-sm font-medium">Orange Money</div>
              <div className="w-8 h-8 bg-white/20 rounded-full"></div>
            </div>
            <div className="text-lg font-mono">****** 1234</div>
            <div className="text-sm opacity-80 mt-2">Wallet principal</div>
          </div>
          
          <div className="bg-gradient-to-r from-yellow-500 to-orange-600 text-white rounded-xl p-6 transform transition-all duration-300 hover:scale-105">
            <div className="flex justify-between items-start mb-4">
              <div className="text-sm font-medium">MTN Mobile Money</div>
              <div className="w-8 h-8 bg-white/20 rounded-full"></div>
            </div>
            <div className="text-lg font-mono">****** 5678</div>
            <div className="text-sm opacity-80 mt-2">Wallet secondaire</div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return <ProfileTab />;
      case 'addresses':
        return <AddressesTab />;
      case 'preferences':
        return <PreferencesTab />;
      case 'security':
        return <SecurityTab />;
      case 'payment':
        return <PaymentTab />;
      default:
        return <ProfileTab />;
    }
  };

  return (
    <ClientsLayout>
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-red-50 to-yellow-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <ProfileHeader />
          <TabNavigation />
          {renderTabContent()}
        </div>
      </div>
    </ClientsLayout>
  );
};

export default ClientsProfilePage;