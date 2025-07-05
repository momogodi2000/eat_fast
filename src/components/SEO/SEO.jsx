import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';

/**
 * SEO Component for Eat Fast Platform
 * Handles meta tags, Open Graph, Twitter Cards, and structured data
 */
const SEO = ({
  title = 'Eat Fast - Livraison de Nourriture au Cameroun',
  description = 'Commandez de la nourriture délicieuse et recevez-la rapidement à votre porte. Plus de 500 restaurants partenaires au Cameroun. Livraison en 30 minutes garantie.',
  keywords = 'livraison nourriture, restaurant cameroun, commande en ligne, ndolé, eru, koki, yaoundé, douala, mobile money, livraison rapide',
  image = '/public/Doc/logo1.png',
  url = '',
  type = 'website',
  locale = 'fr_FR',
  alternateLocales = ['en_US'],
  author = 'Eat Fast',
  publishedTime = '',
  modifiedTime = '',
  section = 'Food Delivery',
  tags = ['food delivery', 'restaurant', 'cameroon', 'yaounde', 'douala'],
  structuredData = null,
  noindex = false,
  nofollow = false,
  canonical = '',
  children
}) => {
  const siteName = 'Eat Fast';
  const siteUrl = 'https://eatfast.cm'; // Replace with your actual domain
  const fullUrl = url ? `${siteUrl}${url}` : siteUrl;
  const fullImageUrl = image.startsWith('http') ? image : `${siteUrl}${image}`;

  // Default structured data for the website
  const defaultStructuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": siteName,
    "url": siteUrl,
    "description": description,
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": `${siteUrl}/search?q={search_term_string}`
      },
      "query-input": "required name=search_term_string"
    },
    "sameAs": [
      "https://facebook.com/eatfastcm",
      "https://twitter.com/eatfastcm",
      "https://instagram.com/eatfastcm"
    ]
  };

  // Organization structured data
  const organizationStructuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": siteName,
    "url": siteUrl,
    "logo": `${siteUrl}/public/Doc/logo1.png`,
    "description": "Plateforme de livraison de nourriture au Cameroun",
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "CM",
      "addressLocality": "Yaoundé",
      "addressRegion": "Centre"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+237-XXX-XXX-XXX",
      "contactType": "customer service",
      "availableLanguage": ["French", "English"]
    },
    "sameAs": [
      "https://facebook.com/eatfastcm",
      "https://twitter.com/eatfastcm",
      "https://instagram.com/eatfastcm"
    ]
  };

  // Local Business structured data
  const localBusinessStructuredData = {
    "@context": "https://schema.org",
    "@type": "FoodEstablishment",
    "name": siteName,
    "description": "Plateforme de livraison de nourriture traditionnelle camerounaise",
    "url": siteUrl,
    "telephone": "+237-XXX-XXX-XXX",
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "CM",
      "addressLocality": "Yaoundé",
      "addressRegion": "Centre"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 3.8480,
      "longitude": 11.5021
    },
    "openingHours": "Mo-Su 06:00-23:00",
    "priceRange": "$$",
    "servesCuisine": ["Cameroonian", "African", "Traditional"],
    "menu": `${siteUrl}/menu`,
    "deliveryAvailable": true,
    "areaServed": [
      {
        "@type": "City",
        "name": "Yaoundé"
      },
      {
        "@type": "City",
        "name": "Douala"
      }
    ]
  };

  // Breadcrumb structured data
  const breadcrumbStructuredData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Accueil",
        "item": siteUrl
      }
    ]
  };

  useEffect(() => {
    // Add breadcrumb items based on current page
    const pathSegments = window.location.pathname.split('/').filter(Boolean);
    if (pathSegments.length > 0) {
      breadcrumbStructuredData.itemListElement = [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Accueil",
          "item": siteUrl
        },
        ...pathSegments.map((segment, index) => ({
          "@type": "ListItem",
          "position": index + 2,
          "name": segment.charAt(0).toUpperCase() + segment.slice(1).replace('-', ' '),
          "item": `${siteUrl}/${pathSegments.slice(0, index + 1).join('/')}`
        }))
      ];
    }
  }, [url]);

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content={author} />
      <meta name="robots" content={noindex ? 'noindex' : 'index'} />
      {nofollow && <meta name="robots" content="nofollow" />}
      
      {/* Canonical URL */}
      {canonical && <link rel="canonical" href={canonical} />}
      
      {/* Language and Locale */}
      <html lang={locale.split('_')[0]} />
      <meta property="og:locale" content={locale} />
      {alternateLocales.map(locale => (
        <meta key={locale} property="og:locale:alternate" content={locale} />
      ))}

      {/* Open Graph Meta Tags */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={fullImageUrl} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:site_name" content={siteName} />
      {publishedTime && <meta property="article:published_time" content={publishedTime} />}
      {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}
      {section && <meta property="article:section" content={section} />}
      {tags.map(tag => (
        <meta key={tag} property="article:tag" content={tag} />
      ))}

      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullImageUrl} />
      <meta name="twitter:site" content="@eatfastcm" />
      <meta name="twitter:creator" content="@eatfastcm" />

      {/* Additional Meta Tags */}
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="theme-color" content="#10b981" />
      <meta name="msapplication-TileColor" content="#10b981" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="apple-mobile-web-app-title" content={siteName} />
      <meta name="application-name" content={siteName} />

      {/* Favicon and App Icons */}
      <link rel="icon" type="image/x-icon" href="/favicon.ico" />
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      <link rel="manifest" href="/site.webmanifest" />

      {/* Preconnect to external domains for performance */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link rel="preconnect" href="https://www.google-analytics.com" />
      <link rel="preconnect" href="https://maps.googleapis.com" />

      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(defaultStructuredData)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(organizationStructuredData)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(localBusinessStructuredData)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(breadcrumbStructuredData)}
      </script>
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}

      {/* Additional SEO Meta Tags */}
      <meta name="geo.region" content="CM" />
      <meta name="geo.placename" content="Yaoundé, Cameroun" />
      <meta name="geo.position" content="3.8480;11.5021" />
      <meta name="ICBM" content="3.8480, 11.5021" />
      
      {/* Mobile App Meta Tags */}
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="format-detection" content="telephone=no" />
      
      {/* Security Meta Tags */}
      <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
      <meta name="referrer" content="strict-origin-when-cross-origin" />

      {children}
    </Helmet>
  );
};

export default SEO; 