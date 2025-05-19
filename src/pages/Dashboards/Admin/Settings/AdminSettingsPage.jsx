import React, { useState, useEffect } from 'react';
import AdminLayout from '../../../../layouts/admin_layout';
import { useTranslation } from 'react-i18next';
import {
  FiSettings,
  FiServer,
  FiUsers,
  FiPercent,
  FiMapPin,
  FiCreditCard,
  FiShield,
  FiCloudRain,
  FiMap,
  FiFlag,
  FiEye,
  FiCheckCircle,
  FiSave,
  FiAlertTriangle,
  FiRotateCw,
  FiCheckSquare,
  FiAlertCircle,
  FiGrid,
  FiBell,
  FiMessageSquare,
  FiFileText,
  FiEyeOff,
  FiDownloadCloud,
  FiShare2,
  FiCloud,
  FiClock,
  FiGlobe,
  FiLifeBuoy,
  FiCheck,
  FiArrowDown,
  FiArrowRight,
  FiPieChart,
  FiTruck
} from 'react-icons/fi';
import { HiOutlineTranslate, HiOutlineSparkles, HiOutlineLightBulb } from 'react-icons/hi';

const AdminSettingsPage = () => {
  const { t, i18n } = useTranslation();
  const [activeTab, setActiveTab] = useState('platform');
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [commissionRate, setCommissionRate] = useState(15);
  const [deliveryBaseFee, setDeliveryBaseFee] = useState(500);
  const [dynamicPricing, setDynamicPricing] = useState(true);
  const [weatherPricing, setWeatherPricing] = useState(true);
  const [serviceZones, setServiceZones] = useState(['Douala', 'Yaoundé']);
  const [autoModeration, setAutoModeration] = useState(true);
  const [verificationAI, setVerificationAI] = useState(true);
  const [imageModeration, setImageModeration] = useState(true);
  const [backupFrequency, setBackupFrequency] = useState('daily');
  const [analyticsConsent, setAnalyticsConsent] = useState(true);
  const [featureFlags, setFeatureFlags] = useState({
    newPaymentGateway: false,
    newUiDesign: false,
    enhancedSearch: true,
    aiRecommendations: true,
    loyaltyProgram: true
  });
  
  // Simulating a loading state when saving settings
  const handleSave = () => {
    setLoading(true);
    
    setTimeout(() => {
      setLoading(false);
      setShowSuccess(true);
      
      setTimeout(() => {
        setShowSuccess(false);
      }, 3000);
    }, 1500);
  };
  
  const handleAddZone = () => {
    // In a real app, this would open a map selection interface
    const newZone = prompt(t('settings.enterNewZone', 'Enter new zone'));
    if (newZone && !serviceZones.includes(newZone)) {
      setServiceZones([...serviceZones, newZone]);
    }
  };

  const handleToggleFeature = (feature) => {
    setFeatureFlags({
      ...featureFlags,
      [feature]: !featureFlags[feature]
    });
  };
  
  const handleRemoveZone = (zone) => {
    setServiceZones(serviceZones.filter(z => z !== zone));
  };

  // Default translations in case i18n setup is incomplete
  const getTranslation = (key, defaultText) => {
    const translated = t(key);
    return translated === key ? defaultText : translated;
  };

  const settings = {
    platform: [
      {
        id: 'commission',
        icon: <FiPercent />,
        title: getTranslation('settings.commissionRate', 'Commission Rate'),
        description: getTranslation('settings.commissionRateDesc', 'Set the platform commission rate for all transactions'),
        component: (
          <div className="flex items-center mt-2">
            <input
              type="range"
              min="5"
              max="30"
              value={commissionRate}
              onChange={(e) => setCommissionRate(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
            />
            <span className="ml-2 font-bold">{commissionRate}%</span>
          </div>
        ),
      },
      {
        id: 'deliveryFee',
        icon: <FiTruck />,
        title: getTranslation('settings.deliveryFee', 'Delivery Fee'),
        description: getTranslation('settings.deliveryFeeDesc', 'Set the base delivery fee for all orders'),
        component: (
          <div className="flex items-center mt-2">
            <input
              type="number"
              min="0"
              value={deliveryBaseFee}
              onChange={(e) => setDeliveryBaseFee(parseInt(e.target.value))}
              className="w-32 px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600"
            />
            <span className="ml-2">FCFA</span>
          </div>
        ),
      },
      {
        id: 'dynamicPricing',
        icon: <FiCloudRain />,
        title: getTranslation('settings.dynamicPricing', 'Dynamic Pricing'),
        description: getTranslation('settings.dynamicPricingDesc', 'Enable dynamic pricing based on demand and distance'),
        component: (
          <div className="flex items-center mt-2">
            <div className="relative inline-block w-12 mr-2 align-middle select-none">
              <input
                type="checkbox" 
                name="dynamicPricing" 
                id="dynamicPricing"
                checked={dynamicPricing}
                onChange={() => setDynamicPricing(!dynamicPricing)}
                className="hidden"
              />
              <label 
                htmlFor="dynamicPricing" 
                className={`block overflow-hidden h-6 rounded-full cursor-pointer ${dynamicPricing ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'}`}
              >
                <span 
                  className={`block h-6 w-6 rounded-full bg-white border-4 transform transition-transform duration-200 ease-in ${dynamicPricing ? 'translate-x-6' : 'translate-x-0'}`}
                ></span>
              </label>
            </div>
            <span className="text-sm font-medium">{dynamicPricing ? getTranslation('settings.enabled', 'Enabled') : getTranslation('settings.disabled', 'Disabled')}</span>
          </div>
        ),
      },
      {
        id: 'weatherPricing',
        icon: <FiCloudRain />,
        title: getTranslation('settings.weatherPricing', 'Weather-based Pricing'),
        description: getTranslation('settings.weatherPricingDesc', 'Adjust pricing based on weather conditions'),
        component: (
          <div className="flex items-center mt-2">
            <div className="relative inline-block w-12 mr-2 align-middle select-none">
              <input
                type="checkbox" 
                name="weatherPricing" 
                id="weatherPricing"
                checked={weatherPricing}
                onChange={() => setWeatherPricing(!weatherPricing)}
                className="hidden"
              />
              <label 
                htmlFor="weatherPricing" 
                className={`block overflow-hidden h-6 rounded-full cursor-pointer ${weatherPricing ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'}`}
              >
                <span 
                  className={`block h-6 w-6 rounded-full bg-white border-4 transform transition-transform duration-200 ease-in ${weatherPricing ? 'translate-x-6' : 'translate-x-0'}`}
                ></span>
              </label>
            </div>
            <span className="text-sm font-medium">{weatherPricing ? getTranslation('settings.enabled', 'Enabled') : getTranslation('settings.disabled', 'Disabled')}</span>
          </div>
        ),
      },
      {
        id: 'serviceZones',
        icon: <FiMapPin />,
        title: getTranslation('settings.serviceZones', 'Service Zones'),
        description: getTranslation('settings.serviceZonesDesc', 'Configure areas where your service is available'),
        component: (
          <div className="mt-2">
            <div className="flex flex-wrap gap-2">
              {serviceZones.map((zone) => (
                <div key={zone} className="flex items-center bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full">
                  <span>{zone}</span>
                  <button 
                    onClick={() => handleRemoveZone(zone)}
                    className="ml-2 text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400 transition-colors duration-200"
                  >
                    &times;
                  </button>
                </div>
              ))}
              <button 
                onClick={handleAddZone}
                className="flex items-center bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300 px-3 py-1 rounded-full hover:bg-green-200 dark:hover:bg-green-800 transition-all duration-200"
              >
                + {getTranslation('settings.addZone', 'Add Zone')}
              </button>
            </div>
          </div>
        ),
      },
    ],
    content: [
      {
        id: 'autoModeration',
        icon: <FiFlag />,
        title: getTranslation('settings.autoModeration', 'Auto Moderation'),
        description: getTranslation('settings.autoModerationDesc', 'Automatically moderate user-generated content'),
        component: (
          <div className="flex items-center mt-2">
            <div className="relative inline-block w-12 mr-2 align-middle select-none">
              <input
                type="checkbox" 
                name="autoModeration" 
                id="autoModeration"
                checked={autoModeration}
                onChange={() => setAutoModeration(!autoModeration)}
                className="hidden"
              />
              <label 
                htmlFor="autoModeration" 
                className={`block overflow-hidden h-6 rounded-full cursor-pointer ${autoModeration ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'}`}
              >
                <span 
                  className={`block h-6 w-6 rounded-full bg-white border-4 transform transition-transform duration-200 ease-in ${autoModeration ? 'translate-x-6' : 'translate-x-0'}`}
                ></span>
              </label>
            </div>
            <span className="text-sm font-medium">{autoModeration ? getTranslation('settings.enabled', 'Enabled') : getTranslation('settings.disabled', 'Disabled')}</span>
          </div>
        ),
      },
      {
        id: 'imageModeration',
        icon: <FiEye />,
        title: getTranslation('settings.imageModeration', 'Image Moderation'),
        description: getTranslation('settings.imageModerationDesc', 'Automatically filter and moderate uploaded images'),
        component: (
          <div className="flex items-center mt-2">
            <div className="relative inline-block w-12 mr-2 align-middle select-none">
              <input
                type="checkbox" 
                name="imageModeration" 
                id="imageModeration"
                checked={imageModeration}
                onChange={() => setImageModeration(!imageModeration)}
                className="hidden"
              />
              <label 
                htmlFor="imageModeration" 
                className={`block overflow-hidden h-6 rounded-full cursor-pointer ${imageModeration ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'}`}
              >
                <span 
                  className={`block h-6 w-6 rounded-full bg-white border-4 transform transition-transform duration-200 ease-in ${imageModeration ? 'translate-x-6' : 'translate-x-0'}`}
                ></span>
              </label>
            </div>
            <span className="text-sm font-medium">{imageModeration ? getTranslation('settings.enabled', 'Enabled') : getTranslation('settings.disabled', 'Disabled')}</span>
          </div>
        ),
      },
    ],
    verification: [
      {
        id: 'aiVerification',
        icon: <HiOutlineSparkles />,
        title: getTranslation('settings.aiVerification', 'AI Verification'),
        description: getTranslation('settings.aiVerificationDesc', 'Use AI to verify user identities and documents'),
        component: (
          <div className="flex items-center mt-2">
            <div className="relative inline-block w-12 mr-2 align-middle select-none">
              <input
                type="checkbox" 
                name="verificationAI" 
                id="verificationAI"
                checked={verificationAI}
                onChange={() => setVerificationAI(!verificationAI)}
                className="hidden"
              />
              <label 
                htmlFor="verificationAI" 
                className={`block overflow-hidden h-6 rounded-full cursor-pointer ${verificationAI ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'}`}
              >
                <span 
                  className={`block h-6 w-6 rounded-full bg-white border-4 transform transition-transform duration-200 ease-in ${verificationAI ? 'translate-x-6' : 'translate-x-0'}`}
                ></span>
              </label>
            </div>
            <span className="text-sm font-medium">{verificationAI ? getTranslation('settings.enabled', 'Enabled') : getTranslation('settings.disabled', 'Disabled')}</span>
          </div>
        ),
      },
    ],
    system: [
      {
        id: 'backup',
        icon: <FiDownloadCloud />,
        title: getTranslation('settings.backupFrequency', 'Backup Frequency'),
        description: getTranslation('settings.backupFrequencyDesc', 'Set how often the system creates automatic backups'),
        component: (
          <div className="mt-2">
            <select
              value={backupFrequency}
              onChange={(e) => setBackupFrequency(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600"
            >
              <option value="hourly">{getTranslation('settings.hourly', 'Hourly')}</option>
              <option value="daily">{getTranslation('settings.daily', 'Daily')}</option>
              <option value="weekly">{getTranslation('settings.weekly', 'Weekly')}</option>
              <option value="monthly">{getTranslation('settings.monthly', 'Monthly')}</option>
            </select>
          </div>
        ),
      },
      {
        id: 'analytics',
        icon: <FiPieChart />,
        title: getTranslation('settings.analyticsConsent', 'Analytics Consent'),
        description: getTranslation('settings.analyticsConsentDesc', 'Allow anonymous data collection to improve our services'),
        component: (
          <div className="flex items-center mt-2">
            <div className="relative inline-block w-12 mr-2 align-middle select-none">
              <input
                type="checkbox" 
                name="analyticsConsent" 
                id="analyticsConsent"
                checked={analyticsConsent}
                onChange={() => setAnalyticsConsent(!analyticsConsent)}
                className="hidden"
              />
              <label 
                htmlFor="analyticsConsent" 
                className={`block overflow-hidden h-6 rounded-full cursor-pointer ${analyticsConsent ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'}`}
              >
                <span 
                  className={`block h-6 w-6 rounded-full bg-white border-4 transform transition-transform duration-200 ease-in ${analyticsConsent ? 'translate-x-6' : 'translate-x-0'}`}
                ></span>
              </label>
            </div>
            <span className="text-sm font-medium">{analyticsConsent ? getTranslation('settings.enabled', 'Enabled') : getTranslation('settings.disabled', 'Disabled')}</span>
          </div>
        ),
      },
      {
        id: 'featureFlags',
        icon: <FiCheckSquare />,
        title: getTranslation('settings.featureFlags', 'Feature Flags'),
        description: getTranslation('settings.featureFlagsDesc', 'Enable or disable experimental features'),
        component: (
          <div className="mt-2 space-y-2">
            {Object.keys(featureFlags).map((flag) => (
              <div key={flag} className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{getTranslation(`settings.features.${flag}`, flag.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()))}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{getTranslation(`settings.featuresDesc.${flag}`, 'Enable or disable this feature')}</p>
                </div>
                <div className="relative inline-block w-12 align-middle select-none">
                  <input
                    type="checkbox" 
                    name={flag} 
                    id={flag}
                    checked={featureFlags[flag]}
                    onChange={() => handleToggleFeature(flag)}
                    className="hidden"
                  />
                  <label 
                    htmlFor={flag} 
                    className={`block overflow-hidden h-6 rounded-full cursor-pointer ${featureFlags[flag] ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'}`}
                  >
                    <span 
                      className={`block h-6 w-6 rounded-full bg-white border-4 transform transition-transform duration-200 ease-in ${featureFlags[flag] ? 'translate-x-6' : 'translate-x-0'}`}
                    ></span>
                  </label>
                </div>
              </div>
            ))}
          </div>
        ),
      },
    ],
  };

  const tabItems = [
    { id: 'platform', label: getTranslation('settings.tabs.platform', 'Platform'), icon: <FiServer /> },
    { id: 'content', label: getTranslation('settings.tabs.content', 'Content'), icon: <FiFileText /> },
    { id: 'verification', label: getTranslation('settings.tabs.verification', 'Verification'), icon: <FiShield /> },
    { id: 'system', label: getTranslation('settings.tabs.system', 'System'), icon: <FiSettings /> },
  ];

  return (
    <AdminLayout>
      <div className="animate-fadeIn">
        {/* Header Section */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2 flex items-center">
            <FiSettings className="mr-2" />
            {getTranslation('settings.title', 'Settings')}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">{getTranslation('settings.subtitle', 'Configure your platform settings')}</p>
        </div>

        {/* Main Content with 3D Card Effect */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl transform transition-all duration-300 hover:shadow-2xl dark:shadow-gray-900/30">
          {/* Settings Tabs */}
          <div className="flex overflow-x-auto border-b border-gray-200 dark:border-gray-700">
            {tabItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center px-4 py-4 text-sm font-medium transition-all duration-200 ease-in-out border-b-2 focus:outline-none whitespace-nowrap ${
                  activeTab === item.id 
                    ? 'border-green-500 text-green-600 dark:text-green-400' 
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                <span className="mr-2">{item.icon}</span>
                {item.label}
              </button>
            ))}
          </div>

          {/* Settings Content */}
          <div className="p-6">
            {settings[activeTab].map((setting) => (
              <div 
                key={setting.id} 
                className="mb-8 p-4 rounded-lg transition-all duration-300 hover:bg-gray-50 dark:hover:bg-gray-700/50"
              >
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/40 flex items-center justify-center text-green-600 dark:text-green-400">
                    {setting.icon}
                  </div>
                  <div className="ml-4 w-full">
                    <h3 className="text-lg font-medium">{setting.title}</h3>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">{setting.description}</p>
                    {setting.component}
                  </div>
                </div>
              </div>
            ))}

            {/* Save Button */}
            <div className="mt-12 flex justify-end">
              <button
                onClick={handleSave}
                disabled={loading}
                className={`
                  flex items-center px-6 py-3 rounded-lg text-white font-medium
                  ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'}
                  transition-all duration-200 transform hover:scale-105
                  shadow-md hover:shadow-lg
                `}
              >
                {loading ? (
                  <>
                    <FiRotateCw className="mr-2 animate-spin" />
                    {getTranslation('settings.saving', 'Saving...')}
                  </>
                ) : (
                  <>
                    <FiSave className="mr-2" />
                    {getTranslation('settings.saveChanges', 'Save Changes')}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* AI Command Center Card */}
        <div className="mt-8 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl shadow-xl overflow-hidden transform transition-all duration-300 hover:shadow-2xl text-white">
          <div className="p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 rounded-lg bg-white/20 flex items-center justify-center">
                <HiOutlineLightBulb className="w-6 h-6" />
              </div>
              <div className="ml-4">
                <h3 className="text-xl font-bold">{getTranslation('settings.aiCommandCenter', 'AI Command Center')}</h3>
                <p className="text-blue-100">{getTranslation('settings.aiCommandCenterDesc', 'Manage your AI-powered features from one place')}</p>
              </div>
            </div>
            
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
                <FiAlertCircle className="text-yellow-300 mb-2" />
                <h4 className="font-medium">{getTranslation('settings.realTimeMonitoring', 'Real-time Monitoring')}</h4>
                <p className="text-sm text-blue-100 mt-1">{getTranslation('settings.realTimeMonitoringDesc', 'Monitor platform activity as it happens')}</p>
              </div>
              <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
                <FiBell className="text-yellow-300 mb-2" />
                <h4 className="font-medium">{getTranslation('settings.smartAlerts', 'Smart Alerts')}</h4>
                <p className="text-sm text-blue-100 mt-1">{getTranslation('settings.smartAlertsDesc', 'Get notified about important events')}</p>
              </div>
              <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
                <FiClock className="text-yellow-300 mb-2" />
                <h4 className="font-medium">{getTranslation('settings.predictiveAnalysis', 'Predictive Analysis')}</h4>
                <p className="text-sm text-blue-100 mt-1">{getTranslation('settings.predictiveAnalysisDesc', 'Forecast trends based on historical data')}</p>
              </div>
            </div>
            
            <div className="mt-6 flex justify-end">
              <button className="px-4 py-2 bg-white text-blue-600 rounded-lg font-medium transform transition-all duration-200 hover:scale-105">
                {getTranslation('settings.configureAI', 'Configure AI')}
              </button>
            </div>
          </div>
        </div>

        {/* Sustainability Dashboard Preview */}
        <div className="mt-8 bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden transform transition-all duration-300 hover:shadow-2xl">
          <div className="p-6">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/40 flex items-center justify-center text-green-600 dark:text-green-400">
                <FiGlobe />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium">{getTranslation('settings.sustainabilityDashboard', 'Sustainability Dashboard')}</h3>
                <p className="text-gray-500 dark:text-gray-400">{getTranslation('settings.sustainabilityDashboardDesc', 'Monitor your environmental impact')}</p>
              </div>
            </div>
            
            <div className="mt-6 bg-gray-100 dark:bg-gray-700/50 rounded-lg p-4">
              <div className="flex justify-between items-center mb-4">
                <p className="font-medium">{getTranslation('settings.carbonFootprint', 'Carbon Footprint')}</p>
                <div className="flex items-center text-green-600 dark:text-green-400">
                  <FiArrowDown className="mr-1" />
                  <span>12% {getTranslation('settings.thisMonth', 'this month')}</span>
                </div>
              </div>
              
              <div className="h-32 bg-gray-200 dark:bg-gray-600 rounded-lg flex items-end p-2">
                {/* Simple bar chart visualization */}
                {[35, 42, 28, 65, 84, 52, 48].map((value, index) => (
                  <div 
                    key={index} 
                    className="w-full bg-green-500 dark:bg-green-600 rounded-t-sm mx-1"
                    style={{ height: `${value}%` }}
                  ></div>
                ))}
              </div>
              
              <div className="mt-4 flex justify-end">
                <button className="text-green-600 dark:text-green-400 text-sm font-medium flex items-center">
                  {getTranslation('settings.viewFullReport', 'View Full Report')}
                  <FiArrowRight className="ml-1" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Success notification */}
      {showSuccess && (
        <div className="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-3 rounded-lg shadow-lg flex items-center animate-fadeIn">
          <FiCheck className="mr-2" />
          {getTranslation('settings.savedSuccess', 'Settings saved successfully!')}
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }
      `}</style>
    </AdminLayout>
  );
};

export default AdminSettingsPage;