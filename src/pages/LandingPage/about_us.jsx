import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Moon, ChevronDown, User, ShoppingBag, Menu, X, Quote, Award, Rocket, Users, Languages } from 'lucide-react';
import { Link } from 'react-router-dom';

// Importation des images (simulations)
import fina from '../../assets/avartar/avartar.jpeg';
import alian from '../../assets/avartar/avatar2.jpg';
import momo from '../../assets/avartar/avatar3.png';
import yvan from '../../assets/avartar/avartar.jpeg';
import logo from '../../assets/logo/eat_fast.png';

const AboutPage = () => {
  const { t, i18n } = useTranslation();
  const [darkMode, setDarkMode] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setDarkMode(isDarkMode);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    localStorage.setItem('language', lng);
  };

  const teamMembers = [
    {
      id: 1,
      name: 'Madame Fina',
      role: t('team.ceo'),
      image: fina,
      description: 'Visionary leader with 10+ years in the food industry, passionate about connecting people with great food.'
    },
    {
      id: 2,
      name: 'Monsieur Alain',
      role: t('team.seniorDev'),
      image: alian,
      description: 'Experienced developer specializing in scalable food delivery platforms.'
    },
    {
      id: 3,
      name: 'Monsieur Momo Yvan',
      role: t('team.juniorDev'),
      image: momo,
      description: 'Up-and-coming developer focused on creating seamless user experiences.'
    },
    {
      id: 4,
      name: 'Madame Sarah',
      role: t('team.uiUx'),
      image: yvan,
      description: 'Creative designer ensuring our platform is beautiful and intuitive.'
    }
  ];

  const testimonials = [
    {
      id: 1,
      quote: t('testimonials.customer1'),
      author: 'Jean, Yaoundé'
    },
    {
      id: 2,
      quote: t('testimonials.customer2'),
      author: 'Amina, Douala'
    },
    {
      id: 3,
      quote: t('testimonials.customer3'),
      author: 'Chef Paul, Restaurant Owner'
    }
  ];

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'dark bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      {/* Navigation (same as home page) */}
      <header className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'py-2 shadow-lg' : 'py-4'} ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="container mx-auto px-4 flex justify-between items-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center"
          >
            <span className="text-2xl font-bold bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 bg-clip-text text-transparent">
              EatFast
            </span>
          </motion.div>

          <div className="hidden md:flex items-center space-x-6">
            <nav className="flex items-center space-x-6">
              <a href="/" className="font-medium hover:text-green-500 transition-colors">
                {t('nav.home')}
              </a>
              <a href="/restaurants" className="font-medium hover:text-green-500 transition-colors">
                {t('nav.restaurants')}
              </a>
              <a href="/about" className="font-medium text-green-500 transition-colors">
                {t('nav.about')}
              </a>
              <a href="/contact" className="font-medium hover:text-green-500 transition-colors">
                {t('nav.contact')}
              </a>
            </nav>
            
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => changeLanguage(i18n.language === 'en' ? 'fr' : 'en')}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center gap-1"
                title={i18n.language === 'en' ? 'Switch to French' : 'Passer en Anglais'}
              >
                <Languages size={20} />
                <span className="text-sm font-medium">{i18n.language === 'en' ? 'FR' : 'EN'}</span>
              </button>
              
              <button 
                onClick={toggleDarkMode} 
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                {darkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>
                        
              <Link 
                to="/login" 
                className="flex items-center space-x-2 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
              >
                <User size={20} />
                <span>{t('nav.account')}</span>
              </Link>
              
              <button className="relative p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                <ShoppingBag size={20} />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                  2
                </span>
              </button>
            </div>
          </div>
          
          <div className="md:hidden flex items-center">
            <button 
              onClick={() => changeLanguage(i18n.language === 'en' ? 'fr' : 'en')}
              className="p-2 mr-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              title={i18n.language === 'en' ? 'Switch to French' : 'Passer en Anglais'}
            >
              <span className="text-sm font-medium">{i18n.language === 'en' ? 'FR' : 'EN'}</span>
            </button>
            <button 
              onClick={toggleDarkMode} 
              className="p-2 mr-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button 
              onClick={toggleMenu}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu (same as home page) */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className={`fixed top-16 left-0 right-0 z-40 ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}
          >
            <nav className="container mx-auto px-4 py-4 flex flex-col space-y-4">
              <a href="/" className="font-medium p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors">
                {t('nav.home')}
              </a>
              <a href="/restaurants" className="font-medium p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors">
                {t('nav.restaurants')}
              </a>
              <a href="/about" className="font-medium p-2 bg-green-100 dark:bg-green-900 rounded transition-colors">
                {t('nav.about')}
              </a>
              <a href="/contact" className="font-medium p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors">
                {t('nav.contact')}
              </a>
              <div className="flex items-center justify-between pt-2 border-t dark:border-gray-700">
                <button 
                  onClick={() => changeLanguage(i18n.language === 'en' ? 'fr' : 'en')}
                  className="flex items-center space-x-2 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                >
                  <Languages size={20} />
                  <span>{i18n.language === 'en' ? 'Français' : 'English'}</span>
                </button>
                <div className="flex items-center space-x-4">
                  <Link 
                    to="/login" 
                    className="flex items-center space-x-2 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                  >
                    <User size={20} />
                    <span>{t('nav.account')}</span>
                  </Link>
                  <button className="relative flex items-center space-x-2 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors">
                    <ShoppingBag size={20} />
                    <span>{t('nav.cart')}</span>
                    <span className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                      2
                    </span>
                  </button>
                </div>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <section className="pt-24 md:pt-32 pb-16 relative overflow-hidden">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {t('about.title')}
            </h1>
            <p className="text-xl md:text-2xl mb-6 dark:text-gray-300">
              {t('about.subtitle')}
            </p>
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="inline-block bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-2 rounded-full"
            >
              {t('about.slogan')}
            </motion.div>
          </motion.div>
        </div>
        
        {/* Background decorations */}
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-green-500 opacity-10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-yellow-500 opacity-10 rounded-full blur-3xl"></div>
      </section>

      {/* About Content */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-12 mb-16">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="w-full md:w-1/2"
            >
              <img 
                src={logo} 
                alt="EatFast Team" 
                className="w-full h-auto rounded-2xl shadow-xl"
              />
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="w-full md:w-1/2"
            >
              <h2 className="text-3xl font-bold mb-6">{t('about.title')}</h2>
              <p className="text-lg mb-6 dark:text-gray-300">
                {t('about.description')}
              </p>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-full ${darkMode ? 'bg-green-900' : 'bg-green-100'}`}>
                    <Rocket className="text-green-500" size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">{t('about.missionTitle')}</h3>
                    <p className="dark:text-gray-300">{t('about.missionText')}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-full ${darkMode ? 'bg-yellow-900' : 'bg-yellow-100'}`}>
                    <Award className="text-yellow-500" size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">{t('about.visionTitle')}</h3>
                    <p className="dark:text-gray-300">{t('about.visionText')}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Our Team */}
      <section className={`py-12 ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4">{t('sections.ourTeam')}</h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Meet the passionate team behind EatFast
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`rounded-xl overflow-hidden shadow-lg ${darkMode ? 'bg-gray-700' : 'bg-white'} hover:shadow-xl transition-shadow`}
              >
                <div className="relative h-64">
                  <img 
                    src={member.image} 
                    alt={member.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-1">{member.name}</h3>
                  <p className="text-green-500 font-medium mb-3">{member.role}</p>
                  <p className="text-gray-600 dark:text-gray-400">{member.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4">{t('sections.testimonials')}</h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Hear what our customers and partners say about us
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}
              >
                <div className="mb-4 text-yellow-500">
                  <Quote size={24} />
                </div>
                <p className="text-lg italic mb-6">"{testimonial.quote}"</p>
                <p className="font-medium text-gray-600 dark:text-gray-400">— {testimonial.author}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer (same as home page) */}
      <footer className={`py-12 ${darkMode ? 'bg-gray-900 text-gray-300' : 'bg-gray-100 text-gray-700'}`}>
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-lg font-bold mb-4 flex items-center">
                <span className="bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 bg-clip-text text-transparent">
                  EatFast
                </span>
              </h3>
              <p className="mb-4 text-sm">
                {t('footer.description')}
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition">
                  <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 3.093 1.6-.019 3.138.568 4.291 1.615-1.112-.034-2.238.344-2.447 1.176-.126.508.099 1.16.873 1.478-.87.017-1.691-.302-2.202-.765-.057 1.024.561 1.986 1.677 2.202-.731.202-1.533.137-2.055-.124.282.849.857 1.464 1.879 1.468-1.347.568-2.678.666-4.123.456 1.263.810 2.76 1.282 4.368 1.282 5.344 0 8.342-4.421 8.158-8.38l.009-.38z" /></svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition">
                  <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073z" /><path d="M12 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4z" /></svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition">
                  <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" /></svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition">
                  <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>
                </a>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-bold mb-4">{t('footer.quickLinks')}</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="/about" className="hover:text-green-500 transition-colors">{t('footer.aboutUs')}</a></li>
                <li><a href="/restaurants" className="hover:text-green-500 transition-colors">{t('footer.restaurants')}</a></li>
                <li><a href="#" className="hover:text-green-500 transition-colors">{t('footer.becomePartner')}</a></li>
                <li><a href="#" className="hover:text-green-500 transition-colors">{t('footer.careers')}</a></li>
                <li><a href="/contact" className="hover:text-green-500 transition-colors">{t('footer.contactUs')}</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-bold mb-4">{t('footer.legal')}</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-green-500 transition-colors">{t('footer.terms')}</a></li>
                <li><a href="#" className="hover:text-green-500 transition-colors">{t('footer.privacy')}</a></li>
                <li><a href="#" className="hover:text-green-500 transition-colors">{t('footer.cookies')}</a></li>
                <li><a href="#" className="hover:text-green-500 transition-colors">{t('footer.licensing')}</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-bold mb-4">{t('footer.contact')}</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 text-green-500"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                  <span>Yaoundé, Cameroun</span>
                </li>
                <li className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 text-green-500"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                  <span>+237 123 456 789</span>
                </li>
                <li className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 text-green-500"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                  <span>info@eatfast.com</span>
                </li>
              </ul>
              <div className="mt-4">
                <h4 className="font-medium mb-2">{t('footer.newsletter')}</h4>
                <div className="flex">
                  <input 
                    type="email" 
                    placeholder={t('footer.emailPlaceholder')}
                    className={`px-4 py-2 rounded-l-lg w-full text-sm ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-300'} border focus:outline-none focus:ring-1 focus:ring-green-500`}
                  />
                  <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-r-lg transition">
                    {t('footer.subscribe')}
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          <div className="pt-8 border-t border-gray-200 dark:border-gray-800 text-center text-sm">
            <p>&copy; {new Date().getFullYear()} EatFast. {t('footer.allRightsReserved')}</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AboutPage;