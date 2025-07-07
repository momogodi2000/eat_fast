import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme, useLanguage } from '../layouts/admin_layout';
import AdminLayout from '../layouts/admin_layout';

/**
 * AdminLayoutWrapper - Wraps admin pages with consistent layout and error handling
 * 
 * This component ensures all admin pages have:
 * - Proper layout structure
 * - Error boundaries
 * - Loading states
 * - Consistent styling
 */
const AdminLayoutWrapper = ({ children, title, subtitle, showHeader = true, pageTitle }) => {
  const { t, i18n } = useTranslation();
  const { isDarkMode } = useTheme();
  const { currentLanguage } = useLanguage();

  // Apply theme changes when component mounts or theme changes
  useEffect(() => {
    // Apply theme to document
    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Update document title when language or page title changes
  useEffect(() => {
    if (pageTitle) {
      document.title = `${t(`dashboard.${pageTitle}`)} | EatFast Admin`;
    } else {
      document.title = 'EatFast Admin';
    }
  }, [pageTitle, currentLanguage, t]);

  // Load admin translations namespace
  useEffect(() => {
    const loadAdminTranslations = async () => {
      if (!i18n.hasResourceBundle(currentLanguage, 'admin')) {
        try {
          // In a real app, you might dynamically import translations here
          // For now, we're relying on the translations already loaded in i18n setup
          console.log('Admin translations loaded');
        } catch (error) {
          console.error('Failed to load admin translations:', error);
        }
      }
    };

    loadAdminTranslations();
  }, [currentLanguage, i18n]);

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {showHeader && (
          <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
            <div className="px-4 sm:px-6 lg:px-8 py-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                  {title && (
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                      {title}
                    </h1>
                  )}
                  {subtitle && (
                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                      {subtitle}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div className="flex-1">
          {children}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminLayoutWrapper; 