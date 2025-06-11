import React, { useState, useEffect } from 'react';
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
    <div className="relative bg-gradient-to-br from-green-600 via-red-500 to-yellow-500 p-4 sm:p-6 md:p-8 rounded-2xl mb-4 sm:mb-6 md:mb-8 overflow-hidden">
      {/* Cameroon flag pattern overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-green-600/20 via-red-500/20 to-yellow-500/20"></div>
      
      <div className="relative flex flex-col items-center gap-3 sm:gap-4 md:gap-6">
        <div className="relative group">
          <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 rounded-full bg-white p-1 shadow-lg sm:shadow-xl md:shadow-2xl transform transition-all duration-300 group-hover:scale-105">
            <img 
              src={profileData.profileImage} 
              alt="Profile" 
              className="w-full h-full rounded-full object-cover"
            />
            <button className="absolute bottom-1 right-1 sm:bottom-2 sm:right-2 bg-white rounded-full p-1 sm:p-1.5 md:p-2 shadow-md hover:shadow-lg transform transition-all duration-300 hover:scale-110 hover:bg-green-50">
              <Camera className="w-3 h-3 sm:w-4 sm:h-4 text-green-600" />
            </button>
          </div>
        </div>
        
        <div className="flex-1 text-center text-white">
          <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold mb-1 sm:mb-2 animate-fade-in">
            {profileData.firstName} {profileData.lastName}
          </h1>
          <p className="text-white/90 mb-3 sm:mb-4 flex items-center justify-center gap-1 sm:gap-2 text-xs sm:text-sm md:text-base">
            <Mail className="w-3 h-3 sm:w-4 sm:h-4" />
            {profileData.email}
          </p>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-1 sm:gap-2 md:gap-3 lg:gap-4 mt-3 sm:mt-4 md:mt-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-1 sm:p-2 md:p-3 text-center transform transition-all duration-300 hover:bg-white/20">
              <div className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl font-bold">{profileData.stats.totalOrders}</div>
              <div className="text-[10px] xs:text-xs sm:text-sm text-white/80">Commandes</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-1 sm:p-2 md:p-3 text-center transform transition-all duration-300 hover:bg-white/20">
              <div className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl font-bold">{profileData.stats.favoriteRestaurants}</div>
              <div className="text-[10px] xs:text-xs sm:text-sm text-white/80">Favoris</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-1 sm:p-2 md:p-3 text-center transform transition-all duration-300 hover:bg-white/20">
              <div className="flex items-center justify-center gap-1 text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl font-bold">
                {profileData.stats.averageRating}
                <Star className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 fill-yellow-400 text-yellow-400" />
              </div>
              <div className="text-[10px] xs:text-xs sm:text-sm text-white/80">Note moyenne</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-1 sm:p-2 md:p-3 text-center transform transition-all duration-300 hover:bg-white/20">
              <div className="flex items-center justify-center gap-1 text-xs sm:text-sm md:text-base lg:text-lg font-bold">
                <Award className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 text-yellow-400" />
                VIP
              </div>
              <div className="text-[10px] xs:text-xs sm:text-sm text-white/80">Statut</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const TabNavigation = () => (
    <div className="mb-4 sm:mb-6 md:mb-8">
      {/* Mobile Tab Navigation - Horizontal Scroll */}
      <div className="sm:hidden">
        <div className="flex gap-1 px-2 py-1 bg-white rounded-lg sm:rounded-xl shadow-md overflow-x-auto scrollbar-hide">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex flex-col items-center gap-1 px-2 py-1 sm:px-3 sm:py-2 rounded-md sm:rounded-lg font-medium transition-all duration-300 whitespace-nowrap min-w-0 ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-green-500 to-yellow-500 text-white shadow-md'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Icon className={`w-3 h-3 sm:w-4 h-4 transition-all duration-300 ${
                  activeTab === tab.id ? 'animate-bounce' : ''
                }`} />
                <span className="text-[10px] xs:text-xs">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Desktop/Tablet Tab Navigation */}
      <div className="hidden sm:flex flex-wrap gap-1 sm:gap-2 bg-white rounded-lg sm:rounded-xl p-1 sm:p-2 shadow-md">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-3 md:px-4 py-1 sm:py-2 md:py-3 rounded-md sm:rounded-lg font-medium transition-all duration-300 transform hover:scale-105 ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-green-500 to-yellow-500 text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Icon className={`w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 transition-all duration-300 ${
                activeTab === tab.id ? 'animate-bounce' : ''
              }`} />
              <span className="text-xs sm:text-sm md:text-base">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );

  const ProfileTab = () => (
    <div className="bg-white rounded-xl sm:rounded-2xl shadow-md sm:shadow-lg md:shadow-xl p-3 sm:p-4 md:p-6 lg:p-8 transform transition-all duration-300 hover:shadow-lg sm:hover:shadow-xl">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-3 md:gap-4 mb-4 sm:mb-6">
        <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 flex items-center gap-1 sm:gap-2">
          <User className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-green-600" />
          <span className="text-sm sm:text-base md:text-lg lg:text-xl">Informations personnelles</span>
        </h2>
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center justify-center gap-1 sm:gap-2 bg-gradient-to-r from-green-500 to-yellow-500 text-white px-3 py-1 sm:px-4 sm:py-2 rounded-md sm:rounded-lg hover:shadow-md transform transition-all duration-300 hover:scale-105 w-full sm:w-auto text-xs sm:text-sm md:text-base"
          >
            <Edit3 className="w-3 h-3 sm:w-4 sm:h-4" />
            Modifier
          </button>
        ) : (
          <div className="flex flex-col sm:flex-row gap-1 sm:gap-2 w-full sm:w-auto">
            <button
              onClick={handleSave}
              className="flex items-center justify-center gap-1 sm:gap-2 bg-green-600 text-white px-3 py-1 sm:px-4 sm:py-2 rounded-md sm:rounded-lg hover:bg-green-700 transform transition-all duration-300 hover:scale-105 text-xs sm:text-sm md:text-base"
            >
              <Save className="w-3 h-3 sm:w-4 sm:h-4" />
              Sauvegarder
            </button>
            <button
              onClick={handleCancel}
              className="flex items-center justify-center gap-1 sm:gap-2 bg-gray-500 text-white px-3 py-1 sm:px-4 sm:py-2 rounded-md sm:rounded-lg hover:bg-gray-600 transform transition-all duration-300 hover:scale-105 text-xs sm:text-sm md:text-base"
            >
              <X className="w-3 h-3 sm:w-4 sm:h-4" />
              Annuler
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 sm:gap-3 md:gap-4">
        <div className="space-y-2 sm:space-y-3 md:space-y-4">
          <div className="form-group">
            <label className="block text-xs sm:text-sm md:text-base font-medium text-gray-700 mb-1 sm:mb-2">
              Prénom
            </label>
            <input
              type="text"
              value={isEditing ? formData.firstName : profileData.firstName}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              disabled={!isEditing}
              className="w-full px-2 sm:px-3 md:px-4 py-1 sm:py-2 md:py-3 border border-gray-300 rounded-md sm:rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 disabled:bg-gray-50 text-xs sm:text-sm md:text-base"
            />
          </div>
          
          <div className="form-group">
            <label className="block text-xs sm:text-sm md:text-base font-medium text-gray-700 mb-1 sm:mb-2">
              Nom de famille
            </label>
            <input
              type="text"
              value={isEditing ? formData.lastName : profileData.lastName}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              disabled={!isEditing}
              className="w-full px-2 sm:px-3 md:px-4 py-1 sm:py-2 md:py-3 border border-gray-300 rounded-md sm:rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 disabled:bg-gray-50 text-xs sm:text-sm md:text-base"
            />
          </div>

          <div className="form-group">
            <label className="block text-xs sm:text-sm md:text-base font-medium text-gray-700 mb-1 sm:mb-2">
              Email
            </label>
            <input
              type="email"
              value={isEditing ? formData.email : profileData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              disabled={!isEditing}
              className="w-full px-2 sm:px-3 md:px-4 py-1 sm:py-2 md:py-3 border border-gray-300 rounded-md sm:rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 disabled:bg-gray-50 text-xs sm:text-sm md:text-base"
            />
          </div>
        </div>

        <div className="space-y-2 sm:space-y-3 md:space-y-4">
          <div className="form-group">
            <label className="block text-xs sm:text-sm md:text-base font-medium text-gray-700 mb-1 sm:mb-2">
              Téléphone
            </label>
            <input
              type="tel"
              value={isEditing ? formData.phone : profileData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              disabled={!isEditing}
              className="w-full px-2 sm:px-3 md:px-4 py-1 sm:py-2 md:py-3 border border-gray-300 rounded-md sm:rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 disabled:bg-gray-50 text-xs sm:text-sm md:text-base"
            />
          </div>

          <div className="form-group">
            <label className="block text-xs sm:text-sm md:text-base font-medium text-gray-700 mb-1 sm:mb-2">
              Date de naissance
            </label>
            <input
              type="date"
              value={isEditing ? formData.dateOfBirth : profileData.dateOfBirth}
              onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
              disabled={!isEditing}
              className="w-full px-2 sm:px-3 md:px-4 py-1 sm:py-2 md:py-3 border border-gray-300 rounded-md sm:rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 disabled:bg-gray-50 text-xs sm:text-sm md:text-base"
            />
          </div>

          <div className="form-group">
            <label className="block text-xs sm:text-sm md:text-base font-medium text-gray-700 mb-1 sm:mb-2">
              Genre
            </label>
            <select
              value={isEditing ? formData.gender : profileData.gender}
              onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
              disabled={!isEditing}
              className="w-full px-2 sm:px-3 md:px-4 py-1 sm:py-2 md:py-3 border border-gray-300 rounded-md sm:rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 disabled:bg-gray-50 text-xs sm:text-sm md:text-base"
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
    <div className="bg-white rounded-xl sm:rounded-2xl shadow-md sm:shadow-lg md:shadow-xl p-3 sm:p-4 md:p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-3 md:gap-4 mb-4 sm:mb-6">
        <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 flex items-center gap-1 sm:gap-2">
          <MapPin className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-green-600" />
          <span className="text-sm sm:text-base md:text-lg lg:text-xl">Mes adresses</span>
        </h2>
        <button
          onClick={addAddress}
          className="flex items-center justify-center gap-1 sm:gap-2 bg-gradient-to-r from-green-500 to-yellow-500 text-white px-3 py-1 sm:px-4 sm:py-2 rounded-md sm:rounded-lg hover:shadow-md transform transition-all duration-300 hover:scale-105 w-full sm:w-auto text-xs sm:text-sm md:text-base"
        >
          <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
          Ajouter une adresse
        </button>
      </div>

      <div className="space-y-2 sm:space-y-3 md:space-y-4">
        {formData.addresses.map((address) => (
          <div
            key={address.id}
            className="border border-gray-200 rounded-lg sm:rounded-xl p-2 sm:p-3 md:p-4 lg:p-6 hover:shadow-md transition-all duration-300 transform hover:scale-[1.01]"
          >
            <div className="flex justify-between items-start mb-2 sm:mb-3 md:mb-4">
              <div className="flex items-center gap-2 sm:gap-3 flex-1">
                <div className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full flex-shrink-0 ${address.isDefault ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold text-xs sm:text-sm md:text-base lg:text-lg capitalize truncate">{address.name || address.type}</h3>
                  {address.isDefault && (
                    <span className="text-[10px] xs:text-xs sm:text-sm text-green-600 font-medium">Adresse par défaut</span>
                  )}
                </div>
              </div>
              <button
                onClick={() => removeAddress(address.id)}
                className="text-red-500 hover:text-red-700 transform transition-all duration-300 hover:scale-110 p-1"
              >
                <Trash2 className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" />
              </button>
            </div>
            <p className="text-gray-600 mb-2 sm:mb-3 md:mb-4 text-xs sm:text-sm md:text-base break-words">{address.address}</p>
            <div className="flex flex-col sm:flex-row gap-1 sm:gap-2">
              <button className="text-[10px] xs:text-xs sm:text-sm text-blue-600 hover:text-blue-800 font-medium text-left">
                Modifier
              </button>
              <button className="text-[10px] xs:text-xs sm:text-sm text-green-600 hover:text-green-800 font-medium text-left">
                Définir par défaut
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const PreferencesTab = () => (
    <div className="bg-white rounded-xl sm:rounded-2xl shadow-md sm:shadow-lg md:shadow-xl p-3 sm:p-4 md:p-6 lg:p-8">
      <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 flex items-center gap-1 sm:gap-2 mb-4 sm:mb-6">
        <Settings className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-green-600" />
        <span className="text-sm sm:text-base md:text-lg lg:text-xl">Préférences</span>
      </h2>

      <div className="space-y-4 sm:space-y-5 md:space-y-6 lg:space-y-8">
        <div>
          <h3 className="text-xs sm:text-sm md:text-base lg:text-lg font-semibold mb-2 sm:mb-3 md:mb-4 text-gray-800">Cuisines préférées</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-1 sm:gap-2 md:gap-3">
            {['Camerounaise', 'Européenne', 'Asiatique', 'Africaine', 'Française', 'Italienne'].map((cuisine) => (
              <label key={cuisine} className="flex items-center gap-1 sm:gap-2 cursor-pointer p-1 sm:p-2 hover:bg-gray-50 rounded-md sm:rounded-lg">
                <input
                  type="checkbox"
                  checked={profileData.preferences.cuisine.includes(cuisine)}
                  className="w-3 h-3 sm:w-4 sm:h-4 text-green-600 rounded focus:ring-green-500"
                />
                <span className="text-gray-700 text-xs sm:text-sm md:text-base">{cuisine}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-xs sm:text-sm md:text-base lg:text-lg font-semibold mb-2 sm:mb-3 md:mb-4 text-gray-800">Restrictions alimentaires</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-1 sm:gap-2 md:gap-3">
            {['Halal', 'Végétarien', 'Végan', 'Sans gluten', 'Casher'].map((dietary) => (
              <label key={dietary} className="flex items-center gap-1 sm:gap-2 cursor-pointer p-1 sm:p-2 hover:bg-gray-50 rounded-md sm:rounded-lg">
                <input
                  type="checkbox"
                  checked={profileData.preferences.dietary.includes(dietary)}
                  className="w-3 h-3 sm:w-4 sm:h-4 text-green-600 rounded focus:ring-green-500"
                />
                <span className="text-gray-700 text-xs sm:text-sm md:text-base">{dietary}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-xs sm:text-sm md:text-base lg:text-lg font-semibold mb-2 sm:mb-3 md:mb-4 text-gray-800">Notifications</h3>
          <div className="space-y-2 sm:space-y-3 md:space-y-4">
            <label className="flex items-center justify-between p-2 sm:p-3 md:p-4 border border-gray-200 rounded-md sm:rounded-lg hover:bg-gray-50 cursor-pointer">
              <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                <Bell className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 text-gray-600 flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <div className="font-medium text-xs sm:text-sm md:text-base">Commandes</div>
                  <div className="text-[10px] xs:text-xs sm:text-sm text-gray-500">Notifications sur l'état de vos commandes</div>
                </div>
              </div>
              <input
                type="checkbox"
                checked={profileData.preferences.notifications.orders}
                className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 text-green-600 rounded focus:ring-green-500 flex-shrink-0"
              />
            </label>

            <label className="flex items-center justify-between p-2 sm:p-3 md:p-4 border border-gray-200 rounded-md sm:rounded-lg hover:bg-gray-50 cursor-pointer">
              <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                <Heart className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 text-gray-600 flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <div className="font-medium text-xs sm:text-sm md:text-base">Promotions</div>
                  <div className="text-[10px] xs:text-xs sm:text-sm text-gray-500">Offres spéciales et réductions</div>
                </div>
              </div>
              <input
                type="checkbox"
                checked={profileData.preferences.notifications.promotions}
                className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 text-green-600 rounded focus:ring-green-500 flex-shrink-0"
              />
            </label>
          </div>
        </div>

        <div>
          <h3 className="text-xs sm:text-sm md:text-base lg:text-lg font-semibold mb-2 sm:mb-3 md:mb-4 text-gray-800">Langue</h3>
          <select className="w-full sm:w-48 md:w-64 px-2 sm:px-3 md:px-4 py-1 sm:py-2 md:py-3 border border-gray-300 rounded-md sm:rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-xs sm:text-sm md:text-base">
            <option value="fr">Français</option>
            <option value="en">English</option>
            <option value="local">Langues locales</option>
          </select>
        </div>
      </div>
    </div>
  );

  const SecurityTab = () => (
    <div className="bg-white rounded-xl sm:rounded-2xl shadow-md sm:shadow-lg md:shadow-xl p-3 sm:p-4 md:p-6 lg:p-8">
      <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 flex items-center gap-1 sm:gap-2 mb-4 sm:mb-6">
        <Shield className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-green-600" />
        <span className="text-sm sm:text-base md:text-lg lg:text-xl">Sécurité</span>
      </h2>

      <div className="space-y-4 sm:space-y-5 md:space-y-6">
        <div className="border border-gray-200 rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-6">
          <h3 className="text-xs sm:text-sm md:text-base lg:text-lg font-semibold mb-2 sm:mb-3 md:mb-4">Changer le mot de passe</h3>
          <div className="space-y-2 sm:space-y-3 md:space-y-4">
            <div>
              <label className="block text-xs sm:text-sm md:text-base font-medium text-gray-700 mb-1 sm:mb-2">
                Mot de passe actuel
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  className="w-full px-2 sm:px-3 md:px-4 py-1 sm:py-2 md:py-3 border border-gray-300 rounded-md sm:rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent pr-8 sm:pr-10 md:pr-12 text-xs sm:text-sm md:text-base"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-1 sm:right-2 md:right-3 top-1 sm:top-2 md:top-3 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" /> : <Eye className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" />}
                </button>
              </div>
            </div>
            
            <div>
              <label className="block text-xs sm:text-sm md:text-base font-medium text-gray-700 mb-1 sm:mb-2">
                Nouveau mot de passe
              </label>
              <input
                type="password"
                className="w-full px-2 sm:px-3 md:px-4 py-1 sm:py-2 md:py-3 border border-gray-300 rounded-md sm:rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-xs sm:text-sm md:text-base"
              />
            </div>
            
            <div>
              <label className="block text-xs sm:text-sm md:text-base font-medium text-gray-700 mb-1 sm:mb-2">
                Confirmer le nouveau mot de passe
              </label>
              <input
                type="password"
                className="w-full px-2 sm:px-3 md:px-4 py-1 sm:py-2 md:py-3 border border-gray-300 rounded-md sm:rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-xs sm:text-sm md:text-base"
              />
            </div>
            
            <button className="w-full sm:w-auto bg-green-600 text-white px-3 sm:px-4 md:px-6 py-1 sm:py-2 md:py-3 rounded-md sm:rounded-lg hover:bg-green-700 transform transition-all duration-300 hover:scale-105 text-xs sm:text-sm md:text-base">
              Mettre à jour le mot de passe
            </button>
          </div>
        </div>

        <div className="border border-gray-200 rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-6">
          <h3 className="text-xs sm:text-sm md:text-base lg:text-lg font-semibold mb-2 sm:mb-3 md:mb-4">Authentification à deux facteurs</h3>
          <p className="text-gray-600 mb-2 sm:mb-3 md:mb-4 text-xs sm:text-sm md:text-base">
            Ajoutez une couche de sécurité supplémentaire à votre compte
          </p>
          <button className="w-full sm:w-auto bg-blue-600 text-white px-3 sm:px-4 md:px-6 py-1 sm:py-2 md:py-3 rounded-md sm:rounded-lg hover:bg-blue-700 transform transition-all duration-300 hover:scale-105 text-xs sm:text-sm md:text-base">
            Activer 2FA
          </button>
        </div>
      </div>
    </div>
  );

  const PaymentTab = () => (
    <div className="bg-white rounded-xl sm:rounded-2xl shadow-md sm:shadow-lg md:shadow-xl p-3 sm:p-4 md:p-6 lg:p-8">
      <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 flex items-center gap-1 sm:gap-2 mb-4 sm:mb-6">
        <CreditCard className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-green-600" />
        <span className="text-sm sm:text-base md:text-lg lg:text-xl">Paiement</span>
      </h2>

      <div className="space-y-4 sm:space-y-5 md:space-y-6">
        <div className="border border-gray-200 rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-6">
          <h3 className="text-xs sm:text-sm md:text-base lg:text-lg font-semibold mb-2 sm:mb-3 md:mb-4">Méthodes de paiement</h3>
          <div className="space-y-2 sm:space-y-3 md:space-y-4">
            <div className="flex items-center justify-between p-2 sm:p-3 md:p-4 border border-gray-200 rounded-md sm:rounded-lg">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-100 rounded-md sm:rounded-lg flex items-center justify-center">
                  <CreditCard className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600" />
                </div>
                <div>
                  <div className="font-medium text-xs sm:text-sm md:text-base">**** **** **** 1234</div>
                  <div className="text-[10px] xs:text-xs sm:text-sm text-gray-500">Visa - Expire 12/26</div>
                </div>
              </div>
              <button className="text-red-500 hover:text-red-700">
                <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
              </button>
            </div>
            
            <div className="flex items-center justify-between p-2 sm:p-3 md:p-4 border border-gray-200 rounded-md sm:rounded-lg">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-green-100 rounded-md sm:rounded-lg flex items-center justify-center">
                  <Phone className="w-3 h-3 sm:w-4 sm:h-4 text-green-600" />
                </div>
                <div>
                  <div className="font-medium text-xs sm:text-sm md:text-base">Mobile Money</div>
                  <div className="text-[10px] xs:text-xs sm:text-sm text-gray-500">+237 6XX XXX XXX</div>
                </div>
              </div>
              <button className="text-red-500 hover:text-red-700">
                <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
              </button>
            </div>
          </div>
          
          <button className="w-full sm:w-auto mt-2 sm:mt-3 md:mt-4 bg-gradient-to-r from-green-500 to-yellow-500 text-white px-3 sm:px-4 md:px-6 py-1 sm:py-2 md:py-3 rounded-md sm:rounded-lg hover:shadow-md transform transition-all duration-300 hover:scale-105 text-xs sm:text-sm md:text-base">
            Ajouter une méthode de paiement
          </button>
        </div>

        <div className="border border-gray-200 rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-6">
          <h3 className="text-xs sm:text-sm md:text-base lg:text-lg font-semibold mb-2 sm:mb-3 md:mb-4">Historique des transactions</h3>
          <div className="space-y-2 sm:space-y-3">
            <div className="flex items-center justify-between p-2 sm:p-3 bg-gray-50 rounded-md sm:rounded-lg">
              <div>
                <div className="font-medium text-xs sm:text-sm md:text-base">Commande #12345</div>
                <div className="text-[10px] xs:text-xs sm:text-sm text-gray-500">15 Mai 2024</div>
              </div>
              <div className="text-right">
                <div className="font-semibold text-xs sm:text-sm md:text-base">15,500 FCFA</div>
                <div className="text-[10px] xs:text-xs sm:text-sm text-green-600">Payé</div>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-2 sm:p-3 bg-gray-50 rounded-md sm:rounded-lg">
              <div>
                <div className="font-medium text-xs sm:text-sm md:text-base">Commande #12344</div>
                <div className="text-[10px] xs:text-xs sm:text-sm text-gray-500">12 Mai 2024</div>
              </div>
              <div className="text-right">
                <div className="font-semibold text-xs sm:text-sm md:text-base">8,750 FCFA</div>
                <div className="text-[10px] xs:text-xs sm:text-sm text-green-600">Payé</div>
              </div>
            </div>
          </div>
          
          <button className="w-full sm:w-auto mt-2 sm:mt-3 md:mt-4 text-blue-600 hover:text-blue-800 font-medium text-xs sm:text-sm md:text-base">
            Voir tout l'historique
          </button>
        </div>
      </div>
    </div>
  );

  const renderActiveTab = () => {
    switch(activeTab) {
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-2 sm:p-3 md:p-4 lg:p-6 xl:p-8">
      <div className="max-w-6xl mx-auto">
        <ProfileHeader />
        <TabNavigation />
        {renderActiveTab()}
      </div>
    </div>
  );
};

export default ClientsProfilePage;