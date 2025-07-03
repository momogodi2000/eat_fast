import React, { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Sparkles, Globe, Sun, Moon, Shield, CheckCircle, FileCheck } from "lucide-react";

// Add your props if needed
const SafetyPage = ({
  language = "fr",
  darkMode = false,
  toggleLanguage = () => {},
  toggleDarkMode = () => {},
  goBack = () => {},
}) => {
  // Example state for active section and sections list
  const [activeSection, setActiveSection] = useState("commitment");
  const sections = [
    { id: "commitment", title: language === "fr" ? "Engagement sécurité" : "Safety Commitment", icon: Shield },
    { id: "standards", title: language === "fr" ? "Normes & Réglementation" : "Standards & Regulations", icon: FileCheck },
    { id: "preparation", title: language === "fr" ? "Préparation" : "Preparation", icon: Sparkles },
    { id: "temperature", title: language === "fr" ? "Températures" : "Temperature", icon: Sun },
    { id: "delivery", title: language === "fr" ? "Livraison" : "Delivery", icon: Globe },
    { id: "packaging", title: language === "fr" ? "Emballage" : "Packaging", icon: CheckCircle },
    { id: "hygiene", title: language === "fr" ? "Hygiène" : "Hygiene", icon: Shield },
    { id: "monitoring", title: language === "fr" ? "Surveillance" : "Monitoring", icon: FileCheck },
    { id: "emergency", title: language === "fr" ? "Urgence" : "Emergency", icon: Globe },
    { id: "contact", title: language === "fr" ? "Contact" : "Contact", icon: Sparkles },
  ];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.1 } },
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const currentContent = content[language];

  return (
    <div className={`min-h-screen transition-all duration-500 ${
      darkMode 
        ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-emerald-900 text-white'
        : 'bg-gradient-to-br from-emerald-50 via-yellow-50 to-red-50 text-gray-900'
    }`}>
      {/* Header */}
      <motion.header
        className={`sticky top-0 z-50 backdrop-blur-xl border-b ${
          darkMode
            ? 'bg-gray-900/90 border-gray-700'
            : 'bg-white/90 border-gray-200'
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <motion.button
                onClick={goBack}
                className={`p-2 rounded-xl transition-all duration-300 ${
                  darkMode
                    ? 'hover:bg-gray-700 bg-gray-800'
                    : 'hover:bg-gray-100 bg-white'
                }`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <ArrowLeft size={20} className="text-emerald-600" />
              </motion.button>
              
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 via-yellow-500 to-red-500 rounded-lg flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-emerald-600 via-yellow-600 to-red-600 bg-clip-text text-transparent">
                  EatFast
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <motion.button
                onClick={toggleLanguage}
                className={`p-3 rounded-xl transition-all duration-300 ${
                  darkMode
                    ? 'hover:bg-gray-700 bg-gray-800'
                    : 'hover:bg-gray-100 bg-white'
                }`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Globe size={20} className="text-emerald-600" />
              </motion.button>

              <motion.button
                onClick={toggleDarkMode}
                className={`p-3 rounded-xl transition-all duration-300 ${
                  darkMode
                    ? 'hover:bg-gray-700 bg-gray-800'
                    : 'hover:bg-gray-100 bg-white'
                }`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                {darkMode ? (
                  <Sun size={20} className="text-yellow-500" />
                ) : (
                  <Moon size={20} className="text-blue-600" />
                )}
              </motion.button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <motion.div
          className="max-w-6xl mx-auto"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          {/* Title Section */}
          <motion.div
            className="text-center mb-12"
            variants={itemVariants}
          >
            <div className="flex items-center justify-center mb-4">
              <Shield className="w-12 h-12 text-emerald-600 mr-4" />
              <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 via-yellow-600 to-red-600 bg-clip-text text-transparent">
                {currentContent.title}
              </h1>
            </div>
            <p className={`text-lg ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              {currentContent.subtitle}
            </p>
          </motion.div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Table of Contents */}
            <motion.div
              className="lg:w-1/4"
              variants={itemVariants}
            >
              <div className={`sticky top-24 p-6 rounded-2xl ${
                darkMode
                  ? 'bg-gray-800/50 border-gray-700'
                  : 'bg-white/50 border-gray-200'
              } border backdrop-blur-sm`}>
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <Shield className="w-5 h-5 text-emerald-600 mr-2" />
                  {language === 'fr' ? 'Sommaire' : 'Table of Contents'}
                </h3>
                <nav className="space-y-2">
                  {sections.map((section) => {
                    const IconComponent = section.icon;
                    return (
                      <motion.button
                        key={section.id}
                        onClick={() => setActiveSection(section.id)}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all duration-200 flex items-center ${
                          activeSection === section.id
                            ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-200 font-medium'
                            : darkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-600'
                        }`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <IconComponent size={16} className="mr-2 flex-shrink-0" />
                        {section.title}
                      </motion.button>
                    );
                  })}
                </nav>
              </div>
            </motion.div>

            {/* Content */}
            <motion.div
              className="lg:w-3/4"
              variants={itemVariants}
            >
              <div className={`p-8 rounded-2xl ${
                darkMode
                  ? 'bg-gray-800/50 border-gray-700'
                  : 'bg-white/50 border-gray-200'
              } border backdrop-blur-sm`}>
                <motion.div
                  key={activeSection}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <h2 className="text-2xl font-bold mb-6 flex items-center">
                    <CheckCircle className="w-6 h-6 text-emerald-600 mr-3" />
                    {currentContent[activeSection]?.title}
                  </h2>
                  <div className={`prose prose-lg max-w-none ${
                    darkMode ? 'prose-invert' : ''
                  }`}>
                    <div className="whitespace-pre-line leading-relaxed">
                      {currentContent[activeSection]?.content}
                    </div>
                  </div>
                </motion.div>

                {/* Navigation */}
                <div className="flex justify-between mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <motion.button
                    onClick={() => {
                      const currentIndex = sections.findIndex(s => s.id === activeSection);
                      if (currentIndex > 0) {
                        setActiveSection(sections[currentIndex - 1].id);
                      }
                    }}
                    disabled={sections.findIndex(s => s.id === activeSection) === 0}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                      sections.findIndex(s => s.id === activeSection) === 0
                        ? 'opacity-50 cursor-not-allowed'
                        : darkMode
                        ? 'hover:bg-gray-700 text-gray-300'
                        : 'hover:bg-gray-100 text-gray-600'
                    }`}
                    whileHover={{ scale: sections.findIndex(s => s.id === activeSection) === 0 ? 1 : 1.05 }}
                  >
                    <ArrowLeft size={16} />
                    <span>{language === 'fr' ? 'Précédent' : 'Previous'}</span>
                  </motion.button>

                  <motion.button
                    onClick={() => {
                      const currentIndex = sections.findIndex(s => s.id === activeSection);
                      if (currentIndex < sections.length - 1) {
                        setActiveSection(sections[currentIndex + 1].id);
                      }
                    }}
                    disabled={sections.findIndex(s => s.id === activeSection) === sections.length - 1}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                      sections.findIndex(s => s.id === activeSection) === sections.length - 1
                        ? 'opacity-50 cursor-not-allowed'
                        : darkMode
                        ? 'hover:bg-gray-700 text-gray-300'
                        : 'hover:bg-gray-100 text-gray-600'
                    }`}
                    whileHover={{ scale: sections.findIndex(s => s.id === activeSection) === sections.length - 1 ? 1 : 1.05 }}
                  >
                    <span>{language === 'fr' ? 'Suivant' : 'Next'}</span>
                    <ArrowLeft size={16} className="rotate-180" />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Safety Guarantee Card */}
          <motion.div
            className={`mt-12 p-6 rounded-2xl ${
              darkMode
                ? 'bg-emerald-900/20 border-emerald-800'
                : 'bg-emerald-50 border-emerald-200'
            } border`}
            variants={itemVariants}
          >
            <div className="flex items-start space-x-3">
              <Shield className="w-6 h-6 text-emerald-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-emerald-800 dark:text-emerald-200 mb-2">
                  {language === 'fr' ? 'Garantie sécurité' : 'Safety Guarantee'}
                </h3>
                <p className="text-emerald-700 dark:text-emerald-300 text-sm leading-relaxed">
                  {language === 'fr'
                    ? "Nous garantissons la sécurité alimentaire de tous nos produits. En cas de problème de santé lié à une commande EatFast, nous prenons en charge les frais médicaux et garantissons une indemnisation rapide selon notre responsabilité."
                    : "We guarantee the food safety of all our products. In case of health problems related to an EatFast order, we cover medical costs and guarantee rapid compensation according to our responsibility."
                  }
                </p>
              </div>
            </div>
          </motion.div>

          {/* Certification Display */}
          <motion.div
            className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4"
            variants={containerVariants}
          >
            {[
              { name: 'HACCP', icon: FileCheck },
              { name: 'ISO 22000', icon: Shield },
              { name: language === 'fr' ? 'Min. Santé' : 'Health Min.', icon: CheckCircle },
              { name: 'OMS/WHO', icon: Globe }
            ].map((cert, index) => (
              <motion.div
                key={cert.name}
                variants={itemVariants}
                className={`p-4 rounded-xl text-center ${
                  darkMode
                    ? 'bg-gray-800/30 border-gray-700'
                    : 'bg-white/30 border-gray-200'
                } border backdrop-blur-sm`}
                whileHover={{ scale: 1.05, y: -5 }}
              >
                <cert.icon className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
                <p className="text-sm font-semibold">{cert.name}</p>
                <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  {language === 'fr' ? 'Certifié' : 'Certified'}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};
export default SafetyPage;