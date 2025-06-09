import React, { useState, useEffect } from 'react';
import RestaurantLayout from '../../../../layouts/restaurants_layout';
import { 
  FiStar, 
  FiSearch, 
  FiFilter, 
  FiDownload, 
  FiRefreshCw, 
  FiMessageSquare, 
  FiFlag, 
  FiCheck, 
  FiThumbsUp, 
  FiMoreVertical,
  FiChevronDown,
  FiChevronLeft,
  FiChevronRight,
  FiCalendar,
  FiClock,
  FiUser,
  FiTrendingUp,
  FiTrendingDown,
  FiMinus,
  FiX,
  FiAlertCircle,
  FiSend
} from 'react-icons/fi';

/**
 * Restaurant Reviews Management Component
 * Provides comprehensive review management for restaurant owners
 */
const RestaurantReviews = () => {
  // State Management
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRating, setSelectedRating] = useState('all');
  const [selectedDate, setSelectedDate] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [selectedReviews, setSelectedReviews] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [showSupportModal, setShowSupportModal] = useState(false);
  const [supportIssue, setSupportIssue] = useState('');
  const [selectedReviewForSupport, setSelectedReviewForSupport] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [replyingTo, setReplyingTo] = useState(null);
  
  const reviewsPerPage = 10;

  // Sample Data - In real app, this would come from API
  const generateSampleReviews = () => {
    const sampleReviews = [
      {
        id: 1,
        customerName: "Marie Kouam",
        rating: 5,
        reviewText: "Excellent service ! Le poulet DG était délicieux et la livraison très rapide. Je recommande vivement ce restaurant.",
        date: "2025-06-02",
        orderItems: ["Poulet DG", "Riz sauté", "Coca-Cola"],
        deliveryTime: "25 min",
        sentiment: "positive",
        isAnswered: true,
        isResolved: true,
        helpfulVotes: 12,
        tags: ["service", "rapidité", "qualité"],
        reply: "Merci beaucoup Marie ! Nous sommes ravis que vous ayez apprécié votre commande."
      },
      {
        id: 2,
        customerName: "Paul Mballa",
        rating: 2,
        reviewText: "La nourriture était froide à l'arrivée et le livreur était en retard de 45 minutes. Très déçu du service.",
        date: "2025-06-01",
        orderItems: ["Ndolé", "Plantain frit"],
        deliveryTime: "75 min",
        sentiment: "negative",
        isAnswered: false,
        isResolved: false,
        helpfulVotes: 8,
        tags: ["retard", "température", "livraison"],
        reply: null
      },
      {
        id: 3,
        customerName: "Fatima Ngono",
        rating: 4,
        reviewText: "Bonne qualité des plats traditionnels. Le goût était authentique, juste quelques petits détails à améliorer sur la présentation.",
        date: "2025-05-31",
        orderItems: ["Eru", "Bobolo", "Jus de gingembre"],
        deliveryTime: "30 min",
        sentiment: "positive",
        isAnswered: true,
        isResolved: true,
        helpfulVotes: 6,
        tags: ["authenticité", "tradition", "présentation"],
        reply: "Merci pour vos commentaires constructifs Fatima !"
      },
      {
        id: 4,
        customerName: "Jean Fotso",
        rating: 1,
        reviewText: "Commande incorrecte, plats manquants et service client inexistant. Une expérience vraiment décevante.",
        date: "2025-05-30",
        orderItems: ["Koki", "Poisson braisé"],
        deliveryTime: "60 min",
        sentiment: "negative",
        isAnswered: false,
        isResolved: false,
        helpfulVotes: 15,
        tags: ["erreur", "service", "manquant"],
        reply: null
      },
      {
        id: 5,
        customerName: "Sandrine Onana",
        rating: 5,
        reviewText: "Parfait ! Les saveurs camerounaises sont au rendez-vous. Continuez comme ça !",
        date: "2025-05-29",
        orderItems: ["Achu", "Porc au four"],
        deliveryTime: "20 min",
        sentiment: "positive",
        isAnswered: true,
        isResolved: true,
        helpfulVotes: 9,
        tags: ["saveur", "camerounais", "parfait"],
        reply: "Vous nous faites très plaisir Sandrine !"
      }
    ];
    return sampleReviews;
  };

  // Initialize reviews
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setReviews(generateSampleReviews());
      setLoading(false);
    }, 1000);
  }, []);

  // Analytics Data
  const analytics = {
    averageRating: 3.4,
    totalReviews: 127,
    monthlyChange: -8.2,
    responseRate: 68,
    sentimentBreakdown: {
      positive: 45,
      neutral: 25,
      negative: 30
    },
    ratingDistribution: {
      5: 32,
      4: 18,
      3: 15,
      2: 20,
      1: 15
    },
    commonTags: [
      { name: "service", count: 45 },
      { name: "rapidité", count: 38 },
      { name: "qualité", count: 35 },
      { name: "livraison", count: 28 },
      { name: "température", count: 22 },
      { name: "retard", count: 20 }
    ]
  };

  // Filter and sort reviews
  const filteredReviews = reviews.filter(review => {
    const matchesSearch = review.reviewText.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         review.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         review.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesRating = selectedRating === 'all' || review.rating.toString() === selectedRating;
    
    const matchesDate = selectedDate === 'all' || (() => {
      const reviewDate = new Date(review.date);
      const today = new Date();
      const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
      const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
      
      switch(selectedDate) {
        case 'today': return reviewDate.toDateString() === today.toDateString();
        case 'week': return reviewDate >= weekAgo;
        case 'month': return reviewDate >= monthAgo;
        default: return true;
      }
    })();
    
    return matchesSearch && matchesRating && matchesDate;
  }).sort((a, b) => {
    switch(sortBy) {
      case 'newest': return new Date(b.date) - new Date(a.date);
      case 'oldest': return new Date(a.date) - new Date(b.date);
      case 'highest': return b.rating - a.rating;
      case 'lowest': return a.rating - b.rating;
      case 'unanswered': return a.isAnswered - b.isAnswered;
      default: return 0;
    }
  });

  const totalPages = Math.ceil(filteredReviews.length / reviewsPerPage);
  const currentReviews = filteredReviews.slice(
    (currentPage - 1) * reviewsPerPage,
    currentPage * reviewsPerPage
  );

  // Utility Functions
  const handleSelectReview = (reviewId) => {
    setSelectedReviews(prev => 
      prev.includes(reviewId) 
        ? prev.filter(id => id !== reviewId)
        : [...prev, reviewId]
    );
  };

  const handleSelectAll = () => {
    if (selectedReviews.length === currentReviews.length) {
      setSelectedReviews([]);
    } else {
      setSelectedReviews(currentReviews.map(review => review.id));
    }
  };

  const handleBulkMarkResolved = () => {
    setReviews(prev => prev.map(review => 
      selectedReviews.includes(review.id) 
        ? { ...review, isResolved: true }
        : review
    ));
    setSelectedReviews([]);
  };

  const handleExportReviews = () => {
    const csvContent = reviews.map(review => ({
      Customer: review.customerName,
      Rating: review.rating,
      Review: review.reviewText,
      Date: review.date,
      Answered: review.isAnswered ? 'Yes' : 'No',
      Reply: review.reply || 'No reply'
    }));
    
    console.log('Exporting:', csvContent);
    // In real app, convert to CSV and download
  };

  const handleReply = (reviewId) => {
    if (replyText.trim()) {
      setReviews(prev => prev.map(review => 
        review.id === reviewId 
          ? { ...review, reply: replyText, isAnswered: true }
          : review
      ));
      setReplyText('');
      setReplyingTo(null);
    }
  };

  const handleFlag = (reviewId) => {
    setReviews(prev => prev.map(review => 
      review.id === reviewId 
        ? { ...review, isFlagged: !review.isFlagged }
        : review
    ));
  };

  const handleMarkResolved = (reviewId) => {
    setReviews(prev => prev.map(review => 
      review.id === reviewId 
        ? { ...review, isResolved: !review.isResolved }
        : review
    ));
  };

  const handleSupportSubmit = () => {
    if (supportIssue.trim()) {
      console.log('Support ticket:', {
        review: selectedReviewForSupport,
        issue: supportIssue
      });
      setShowSupportModal(false);
      setSupportIssue('');
      setSelectedReviewForSupport(null);
    }
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <FiStar
        key={i}
        className={`w-4 h-4 ${
          i < rating 
            ? 'text-yellow-400 fill-current' 
            : 'text-gray-300 dark:text-gray-600'
        }`}
      />
    ));
  };

  const getSentimentColor = (sentiment) => {
    switch(sentiment) {
      case 'positive': return 'text-green-600 bg-green-100 dark:bg-green-900 dark:text-green-300';
      case 'negative': return 'text-red-600 bg-red-100 dark:bg-red-900 dark:text-red-300';
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  if (loading) {
    return (
      // <RestaurantLayout>
      <>
        <div className="p-6 max-w-7xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
              ))}
            </div>
            <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
        </div>
        </>
      // </RestaurantLayout>
    );
  }

  return (
    // <RestaurantLayout>
    <>
      <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
              Gestion des Avis
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-1">
              Gérez et répondez aux avis de vos clients
            </p>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <button
              onClick={handleExportReviews}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
            >
              <FiDownload className="w-4 h-4 mr-2" />
              Exporter
            </button>
            
            <button
              onClick={() => setLoading(true)}
              className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200"
            >
              <FiRefreshCw className="w-4 h-4 mr-2" />
              Actualiser
            </button>
          </div>
        </div>

        {/* Analytics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Note Moyenne</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{analytics.averageRating}</p>
              </div>
              <div className="flex items-center text-yellow-400">
                <FiStar className="w-8 h-8 fill-current" />
              </div>
            </div>
            <div className="flex items-center mt-2">
              <FiTrendingDown className="w-4 h-4 text-red-500 mr-1" />
              <span className="text-sm text-red-500">{Math.abs(analytics.monthlyChange)}% ce mois</span>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Total Avis</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{analytics.totalReviews}</p>
              </div>
              <div className="flex items-center text-blue-400">
                <FiMessageSquare className="w-8 h-8" />
              </div>
            </div>
            <div className="flex items-center mt-2">
              <FiTrendingUp className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-sm text-green-500">+12% ce mois</span>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Taux de Réponse</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{analytics.responseRate}%</p>
              </div>
              <div className="flex items-center text-green-400">
                <FiCheck className="w-8 h-8" />
              </div>
            </div>
            <div className="flex items-center mt-2">
              <FiTrendingUp className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-sm text-green-500">+5% ce mois</span>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Sentiment Positif</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{analytics.sentimentBreakdown.positive}%</p>
              </div>
              <div className="flex items-center text-green-400">
                <FiThumbsUp className="w-8 h-8" />
              </div>
            </div>
            <div className="flex items-center mt-2">
              <FiMinus className="w-4 h-4 text-gray-500 mr-1" />
              <span className="text-sm text-gray-500">Stable</span>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white dark:bg-gray-800 p-4 md:p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Rechercher par avis, client ou tags..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-2">
              <select
                value={selectedRating}
                onChange={(e) => setSelectedRating(e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="all">Toutes les notes</option>
                <option value="5">5 étoiles</option>
                <option value="4">4 étoiles</option>
                <option value="3">3 étoiles</option>
                <option value="2">2 étoiles</option>
                <option value="1">1 étoile</option>
              </select>

              <select
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="all">Toutes les dates</option>
                <option value="today">Aujourd'hui</option>
                <option value="week">Cette semaine</option>
                <option value="month">Ce mois</option>
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="newest">Plus récents</option>
                <option value="oldest">Plus anciens</option>
                <option value="highest">Note la plus haute</option>
                <option value="lowest">Note la plus basse</option>
                <option value="unanswered">Non répondus</option>
              </select>
            </div>
          </div>

          {/* Bulk Actions */}
          {selectedReviews.length > 0 && (
            <div className="flex items-center justify-between mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <span className="text-sm text-blue-700 dark:text-blue-300">
                {selectedReviews.length} avis sélectionné(s)
              </span>
              <div className="flex gap-2">
                <button
                  onClick={handleBulkMarkResolved}
                  className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition-colors duration-200"
                >
                  Marquer comme résolus
                </button>
                <button
                  onClick={() => setSelectedReviews([])}
                  className="px-3 py-1 bg-gray-600 text-white text-sm rounded hover:bg-gray-700 transition-colors duration-200"
                >
                  Annuler
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Reviews List */}
        <div className="space-y-4">
          {currentReviews.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 p-12 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 text-center">
              <FiMessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Aucun avis trouvé
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Ajustez vos filtres pour voir plus d'avis.
              </p>
            </div>
          ) : (
            currentReviews.map((review) => (
              <div
                key={review.id}
                className="bg-white dark:bg-gray-800 p-4 md:p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow duration-200"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start space-x-4">
                    <input
                      type="checkbox"
                      checked={selectedReviews.includes(review.id)}
                      onChange={() => handleSelectReview(review.id)}
                      className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500 mt-1"
                    />
                    
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-gradient-to-r from-green-600 to-yellow-600 rounded-full flex items-center justify-center text-white font-semibold">
                        {review.customerName.charAt(0)}
                      </div>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                        <div>
                          <h3 className="font-semibold text-gray-900 dark:text-white">
                            {review.customerName}
                          </h3>
                          <div className="flex items-center space-x-3 mt-1">
                            <div className="flex items-center">
                              {renderStars(review.rating)}
                            </div>
                            <span className={`px-2 py-1 text-xs rounded-full ${getSentimentColor(review.sentiment)}`}>
                              {review.sentiment === 'positive' ? 'Positif' : 
                               review.sentiment === 'negative' ? 'Négatif' : 'Neutre'}
                            </span>
                          </div>
                        </div>
                        
                        <div className="flex flex-col sm:items-end text-sm text-gray-500 dark:text-gray-400">
                          <div className="flex items-center">
                            <FiCalendar className="w-4 h-4 mr-1" />
                            {new Date(review.date).toLocaleDateString('fr-FR')}
                          </div>
                          <div className="flex items-center mt-1">
                            <FiClock className="w-4 h-4 mr-1" />
                            Livré en {review.deliveryTime}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Review Content */}
                <div className="ml-14 space-y-4">
                  <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                    <p className="text-gray-800 dark:text-gray-200 leading-relaxed">
                      {review.reviewText}
                    </p>
                  </div>

                  {/* Order Details */}
                  <div className="flex flex-wrap items-center gap-2 text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Commande:</span>
                    {review.orderItems.map((item, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full text-xs"
                      >
                        {item}
                      </span>
                    ))}
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Tags:</span>
                    {review.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-xs cursor-pointer hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors duration-200"
                        onClick={() => setSearchTerm(tag)}
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>

                  {/* Reply Section */}
                  {review.reply && (
                    <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border-l-4 border-green-500">
                      <div className="flex items-center mb-2">
                        <FiUser className="w-4 h-4 text-green-600 mr-2" />
                        <span className="text-sm font-medium text-green-800 dark:text-green-200">
                          Votre réponse:
                        </span>
                      </div>
                      <p className="text-gray-700 dark:text-gray-300">{review.reply}</p>
                    </div>
                  )}

                  {/* Reply Form */}
                  {replyingTo === review.id && (
                    <div className="space-y-3">
                      <textarea
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        placeholder="Rédigez votre réponse..."
                        rows={3}
                        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                      />
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => {
                            setReplyingTo(null);
                            setReplyText('');
                          }}
                          className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 transition-colors duration-200"
                        >
                          Annuler
                        </button>
                        <button
                          onClick={() => handleReply(review.id)}
                          disabled={!replyText.trim()}
                          className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                        
                          >
                            <FiSend className="w-4 h-4 mr-2" />
                          Publier
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-gray-200 dark:border-gray-600">
                    <div className="flex items-center space-x-4">
                      <span className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                        <FiThumbsUp className="w-4 h-4 mr-1" />
                        {review.helpfulVotes} personnes ont trouvé cet avis utile
                      </span>
                      
                      <div className="flex items-center space-x-2">
                        {review.isAnswered && (
                          <span className="flex items-center text-sm text-green-600 dark:text-green-400">
                            <FiCheck className="w-4 h-4 mr-1" />
                            Répondu
                          </span>
                        )}
                        
                        {review.isResolved && (
                          <span className="flex items-center text-sm text-blue-600 dark:text-blue-400">
                            <FiCheck className="w-4 h-4 mr-1" />
                            Résolu
                          </span>
                        )}
                        
                        {review.isFlagged && (
                          <span className="flex items-center text-sm text-red-600 dark:text-red-400">
                            <FiFlag className="w-4 h-4 mr-1" />
                            Signalé
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      {!review.reply && (
                        <button
                          onClick={() => {
                            setReplyingTo(review.id);
                            setReplyText('');
                          }}
                          className="flex items-center px-3 py-1 text-sm text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors duration-200"
                        >
                          <FiMessageSquare className="w-4 h-4 mr-1" />
                          Répondre
                        </button>
                      )}
                      
                      <button
                        onClick={() => handleMarkResolved(review.id)}
                        className={`flex items-center px-3 py-1 text-sm rounded-lg transition-colors duration-200 ${
                          review.isResolved
                            ? 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                            : 'text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20'
                        }`}
                      >
                        <FiCheck className="w-4 h-4 mr-1" />
                        {review.isResolved ? 'Marquer non résolu' : 'Marquer résolu'}
                      </button>
                      
                      <button
                        onClick={() => handleFlag(review.id)}
                        className={`flex items-center px-3 py-1 text-sm rounded-lg transition-colors duration-200 ${
                          review.isFlagged
                            ? 'text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20'
                            : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                        }`}
                      >
                        <FiFlag className="w-4 h-4 mr-1" />
                        {review.isFlagged ? 'Retirer signalement' : 'Signaler'}
                      </button>
                      
                      <button
                        onClick={() => {
                          setSelectedReviewForSupport(review);
                          setShowSupportModal(true);
                        }}
                        className="flex items-center px-3 py-1 text-sm text-orange-600 dark:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-900/20 rounded-lg transition-colors duration-200"
                      >
                        <FiAlertCircle className="w-4 h-4 mr-1" />
                        Support
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600 dark:text-gray-300">
                Affichage {((currentPage - 1) * reviewsPerPage) + 1} à {Math.min(currentPage * reviewsPerPage, filteredReviews.length)} sur {filteredReviews.length} avis
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="flex items-center px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                >
                  <FiChevronLeft className="w-4 h-4 mr-1" />
                  Précédent
                </button>
                
                <div className="flex items-center space-x-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`w-8 h-8 text-sm rounded-lg transition-colors duration-200 ${
                        currentPage === page
                          ? 'bg-green-600 text-white'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>
                
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="flex items-center px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                >
                  Suivant
                  <FiChevronRight className="w-4 h-4 ml-1" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Support Modal */}
        {showSupportModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-xl max-w-md w-full p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Contacter le Support
                </h3>
                <button
                  onClick={() => setShowSupportModal(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <FiX className="w-6 h-6" />
                </button>
              </div>
              
              {selectedReviewForSupport && (
                <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                    Avis concerné:
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {selectedReviewForSupport.customerName} - {selectedReviewForSupport.rating} étoiles
                  </p>
                </div>
              )}

              <textarea
                value={supportIssue}
                onChange={(e) => setSupportIssue(e.target.value)}
                placeholder="Décrivez votre problème ou votre question..."
                rows={4}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
              />

              <div className="flex justify-end space-x-3 mt-4">
                <button
                  onClick={() => setShowSupportModal(false)}
                  className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 transition-colors duration-200"
                >
                  Annuler
                </button>
                <button
                  onClick={handleSupportSubmit}
                  disabled={!supportIssue.trim()}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                >
                  Envoyer
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Quick Stats Summary */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Résumé Rapide
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Rating Distribution */}
            <div>
              <h4 className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-3">
                Distribution des Notes
              </h4>
              <div className="space-y-2">
                {Object.entries(analytics.ratingDistribution).reverse().map(([rating, percentage]) => (
                  <div key={rating} className="flex items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-300 w-8">
                      {rating}★
                    </span>
                    <div className="flex-1 mx-2 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-green-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-600 dark:text-gray-300 w-8">
                      {percentage}%
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Sentiment Analysis */}
            <div>
              <h4 className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-3">
                Analyse de Sentiment
              </h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-green-600 dark:text-green-400">Positif</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {analytics.sentimentBreakdown.positive}%
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Neutre</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {analytics.sentimentBreakdown.neutral}%
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-red-600 dark:text-red-400">Négatif</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {analytics.sentimentBreakdown.negative}%
                  </span>
                </div>
              </div>
            </div>

            {/* Common Tags */}
            <div>
              <h4 className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-3">
                Tags Populaires
              </h4>
              <div className="space-y-2">
                {analytics.commonTags.slice(0, 6).map((tag, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span 
                      className="text-sm text-blue-600 dark:text-blue-400 cursor-pointer hover:underline"
                      onClick={() => setSearchTerm(tag.name)}
                    >
                      #{tag.name}
                    </span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {tag.count}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      </>
    // </RestaurantLayout>
  );
};

export default RestaurantReviews;