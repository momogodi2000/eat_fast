import React, { useState, useEffect } from 'react';
import {
    FiHeadphones,
    FiClock,
    FiUser,
    FiMail,
    FiPhone,
    FiAlertCircle,
    FiCheckCircle,
    FiX,
    FiMessageSquare,
    FiFilter,
    FiSearch,
    FiEye,
    FiEdit3,
    FiTrash2,
    FiPlus
} from 'react-icons/fi';
import { HiOutlineMoon, HiOutlineSun } from 'react-icons/hi';
import { motion } from 'framer-motion';
import SupportAgentLayout from '@/layouts/agent_support_layout.jsx';

const SupportTicketsPage = () => {
    const [darkMode, setDarkMode] = useState(false);
    const [currentTime, setCurrentTime] = useState(new Date());
    const [isLoading, setIsLoading] = useState(true);
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [filterStatus, setFilterStatus] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [newTicket, setNewTicket] = useState({
        subject: '',
        category: 'delivery',
        priority: 'medium',
        description: '',
        customer: {
            name: '',
            email: '',
            phone: ''
        }
    });

    // Sample tickets data
    const [tickets, setTickets] = useState([
        {
            id: 1,
            ticketNumber: 'TICK-2024-001',
            subject: 'Problème de livraison',
            customer: {
                name: 'Emma Mensah',
                email: 'emma.mensah@gmail.com',
                phone: '+237 6XX XXX XXX'
            },
            status: 'open',
            priority: 'high',
            category: 'delivery',
            createdAt: new Date('2024-01-15T10:30:00'),
            lastUpdate: new Date('2024-01-15T14:20:00'),
            description: 'Ma commande n\'est pas arrivée et le livreur ne répond pas au téléphone. J\'ai payé 15,000 FCFA pour cette commande.',
            messages: [
                {
                    id: 1,
                    sender: 'customer',
                    message: 'Bonjour, ma commande #1001 n\'est toujours pas arrivée.',
                    timestamp: new Date('2024-01-15T10:30:00')
                },
                {
                    id: 2,
                    sender: 'support',
                    message: 'Bonjour Emma, je vais vérifier le statut de votre commande immédiatement.',
                    timestamp: new Date('2024-01-15T11:00:00')
                }
            ]
        },
        {
            id: 2,
            ticketNumber: 'TICK-2024-002',
            subject: 'Remboursement demandé',
            customer: {
                name: 'John Doe',
                email: 'john.doe@email.com',
                phone: '+237 6XX XXX XXX'
            },
            status: 'in_progress',
            priority: 'medium',
            category: 'payment',
            createdAt: new Date('2024-01-14T16:45:00'),
            lastUpdate: new Date('2024-01-15T09:30:00'),
            description: 'Je demande un remboursement pour ma commande annulée par le restaurant.',
            messages: []
        },
        {
            id: 3,
            ticketNumber: 'TICK-2024-003',
            subject: 'Compte bloqué',
            customer: {
                name: 'Marie Ateba',
                email: 'marie.ateba@yahoo.fr',
                phone: '+237 6XX XXX XXX'
            },
            status: 'resolved',
            priority: 'low',
            category: 'account',
            createdAt: new Date('2024-01-13T08:20:00'),
            lastUpdate: new Date('2024-01-14T12:15:00'),
            description: 'Mon compte a été bloqué sans raison apparente.',
            messages: []
        },
        {
            id: 4,
            ticketNumber: 'TICK-2024-004',
            subject: 'Application ne fonctionne pas',
            customer: {
                name: 'Samuel Etoo',
                email: 'samuel.etoo@gmail.com',
                phone: '+237 6XX XXX XXX'
            },
            status: 'open',
            priority: 'high',
            category: 'technical',
            createdAt: new Date('2024-01-15T13:10:00'),
            lastUpdate: new Date('2024-01-15T13:10:00'),
            description: 'L\'application crash à chaque fois que j\'essaie de passer une commande.',
            messages: []
        }
    ]);

    const stats = {
        totalTickets: tickets.length,
        openTickets: tickets.filter(t => t.status === 'open').length,
        inProgressTickets: tickets.filter(t => t.status === 'in_progress').length,
        resolvedToday: tickets.filter(t => t.status === 'resolved' &&
            new Date(t.lastUpdate).toDateString() === new Date().toDateString()).length
    };

    // Load theme from localStorage
    useEffect(() => {
        const savedTheme = localStorage.getItem('supportTheme');
        if (savedTheme) {
            setDarkMode(savedTheme === 'dark');
        } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            setDarkMode(true);
        }

        // Update time every minute
        const timer = setInterval(() => setCurrentTime(new Date()), 60000);

        // Simulate loading
        const loadingTimer = setTimeout(() => {
            setIsLoading(false);
        }, 1000);

        return () => {
            clearInterval(timer);
            clearTimeout(loadingTimer);
        };
    }, []);

    // Update theme when darkMode changes
    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
        localStorage.setItem('supportTheme', darkMode ? 'dark' : 'light');
    }, [darkMode]);

    const toggleTheme = () => {
        setDarkMode(!darkMode);
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'open': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
            case 'in_progress': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
            case 'resolved': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
            default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
        }
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'high': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
            case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
            case 'low': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
            default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case 'open': return 'Ouvert';
            case 'in_progress': return 'En cours';
            case 'resolved': return 'Résolu';
            default: return status;
        }
    };

    const getPriorityText = (priority) => {
        switch (priority) {
            case 'high': return 'Élevée';
            case 'medium': return 'Moyenne';
            case 'low': return 'Faible';
            default: return priority;
        }
    };

    const getCategoryText = (category) => {
        switch (category) {
            case 'delivery': return 'Livraison';
            case 'payment': return 'Paiement';
            case 'account': return 'Compte';
            case 'technical': return 'Technique';
            default: return category;
        }
    };

    const getCategoryIcon = (category) => {
        switch (category) {
            case 'delivery': return '🚚';
            case 'payment': return '💳';
            case 'account': return '👤';
            case 'technical': return '🛠️';
            default: return '📌';
        }
    };

    const filteredTickets = tickets.filter(ticket => {
        const matchesStatus = filterStatus === 'all' || ticket.status === filterStatus;
        const matchesSearch = ticket.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
            ticket.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            ticket.ticketNumber.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesStatus && matchesSearch;
    });

    const updateTicketStatus = (ticketId, newStatus) => {
        setTickets(tickets.map(ticket =>
            ticket.id === ticketId
                ? { ...ticket, status: newStatus, lastUpdate: new Date() }
                : ticket
        ));
    };

    const formatTimeAgo = (date) => {
        const now = new Date();
        const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));

        if (diffInHours < 1) {
            const diffInMinutes = Math.floor((now - date) / (1000 * 60));
            return `il y a ${diffInMinutes} min`;
        } else if (diffInHours < 24) {
            return `il y a ${diffInHours}h`;
        } else {
            const diffInDays = Math.floor(diffInHours / 24);
            return `il y a ${diffInDays}j`;
        }
    };

    const handleCreateTicket = () => {
        const newId = Math.max(...tickets.map(t => t.id)) + 1;
        const today = new Date();
        
        // Auto-assign priority based on category
        let priority = 'medium';
        if (newTicket.category === 'delivery' || newTicket.category === 'technical') {
            priority = 'high';
        } else if (newTicket.category === 'account') {
            priority = 'low';
        }
        
        const ticket = {
            id: newId,
            ticketNumber: `TICK-${today.getFullYear()}-${String(newId).padStart(3, '0')}`,
            subject: newTicket.subject,
            customer: newTicket.customer,
            status: 'open',
            priority: priority,
            category: newTicket.category,
            createdAt: today,
            lastUpdate: today,
            description: newTicket.description,
            messages: []
        };
        
        setTickets([...tickets, ticket]);
        setNewTicket({
            subject: '',
            category: 'delivery',
            priority: 'medium',
            description: '',
            customer: {
                name: '',
                email: '',
                phone: ''
            }
        });
        setShowModal(false);
    };

    if (isLoading) {
        return (
            <SupportAgentLayout>
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
            </SupportAgentLayout>
        );
    }

    return (
        <SupportAgentLayout>
            <div className="container mx-auto px-2 sm:px-4 lg:px-6 py-4 sm:py-6 max-w-7xl">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 space-y-4 sm:space-y-0">
                    <div className="flex items-center">
                        <motion.div
                            animate={{ rotate: [0, 10, -10, 0] }}
                            transition={{ duration: 1, repeat: Infinity, repeatType: "reverse" }}
                        >
                            <FiHeadphones className="mr-2 text-green-600 dark:text-yellow-400" size={24}/>
                        </motion.div>
                        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-green-600 via-yellow-500 to-red-600 bg-clip-text text-transparent">
                            Gestion des Tickets
                        </h1>
                    </div>

                    <div className="flex items-center space-x-2 sm:space-x-4">
                        <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                            {currentTime.toLocaleTimeString('fr-FR', {hour: '2-digit', minute: '2-digit'})}
                        </span>
                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none transition-colors duration-200"
                        >
                            {darkMode ? (
                                <HiOutlineSun className="text-yellow-400" size={20}/>
                            ) : (
                                <HiOutlineMoon className="text-gray-600" size={20}/>
                            )}
                        </button>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8">
                    <motion.div
                        whileHover={{ scale: 1.03 }}
                        className="bg-gradient-to-r from-green-600 to-green-500 rounded-xl shadow-lg p-3 sm:p-4 lg:p-6 text-white"
                    >
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="text-xs sm:text-sm font-medium opacity-90">Total Tickets</p>
                                <p className="text-lg sm:text-2xl lg:text-3xl font-bold">{stats.totalTickets}</p>
                            </div>
                            <div className="p-2 sm:p-3 rounded-full bg-white bg-opacity-20">
                                <FiHeadphones size={16} className="sm:w-5 sm:h-5 lg:w-6 lg:h-6"/>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        whileHover={{ scale: 1.03 }}
                        className="bg-gradient-to-r from-red-600 to-red-500 rounded-xl shadow-lg p-3 sm:p-4 lg:p-6 text-white"
                    >
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="text-xs sm:text-sm font-medium opacity-90">Tickets Ouverts</p>
                                <p className="text-lg sm:text-2xl lg:text-3xl font-bold">{stats.openTickets}</p>
                            </div>
                            <div className="p-2 sm:p-3 rounded-full bg-white bg-opacity-20">
                                <FiAlertCircle size={16} className="sm:w-5 sm:h-5 lg:w-6 lg:h-6"/>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        whileHover={{ scale: 1.03 }}
                        className="bg-gradient-to-r from-yellow-500 to-yellow-400 rounded-xl shadow-lg p-3 sm:p-4 lg:p-6 text-white"
                    >
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="text-xs sm:text-sm font-medium opacity-90">En Cours</p>
                                <p className="text-lg sm:text-2xl lg:text-3xl font-bold">{stats.inProgressTickets}</p>
                            </div>
                            <div className="p-2 sm:p-3 rounded-full bg-white bg-opacity-20">
                                <FiClock size={16} className="sm:w-5 sm:h-5 lg:w-6 lg:h-6"/>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        whileHover={{ scale: 1.03 }}
                        className="bg-gradient-to-r from-green-600 to-green-500 rounded-xl shadow-lg p-3 sm:p-4 lg:p-6 text-white col-span-2 lg:col-span-1"
                    >
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="text-xs sm:text-sm font-medium opacity-90">Résolus Aujourd'hui</p>
                                <p className="text-lg sm:text-2xl lg:text-3xl font-bold">{stats.resolvedToday}</p>
                            </div>
                            <div className="p-2 sm:p-3 rounded-full bg-white bg-opacity-20">
                                <FiCheckCircle size={16} className="sm:w-5 sm:h-5 lg:w-6 lg:h-6"/>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Filters and Search */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 sm:p-6 mb-6 sm:mb-8 border border-gray-200 dark:border-gray-700">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1">
                            <div className="relative">
                                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20}/>
                                <input
                                    type="text"
                                    placeholder="Rechercher un ticket..."
                                    className="w-full pl-10 pr-4 py-2 sm:py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-200"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="flex items-center space-x-4">
                            <FiFilter className="text-gray-500 hidden sm:block" size={20}/>
                            <select
                                className="px-3 py-2 sm:py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white transition-all duration-200 min-w-[140px]"
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                            >
                                <option value="all">Tous les statuts</option>
                                <option value="open">Ouverts</option>
                                <option value="in_progress">En cours</option>
                                <option value="resolved">Résolus</option>
                            </select>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setShowModal(true)}
                                className="flex items-center gap-2 px-4 py-2 sm:py-3 bg-gradient-to-r from-green-600 to-green-500 text-white rounded-lg hover:from-green-700 hover:to-green-600 transition-all duration-200"
                            >
                                <FiPlus size={18} />
                                <span className="hidden sm:inline">Nouveau Ticket</span>
                            </motion.button>
                        </div>
                    </div>
                </div>

                {/* Tickets Table */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[600px] md:min-w-[700px] lg:min-w-[800px]">
                            <thead className="bg-gray-50 dark:bg-gray-700">
                            <tr>
                                <th className="px-2 md:px-4 lg:px-6 py-2 md:py-3 text-left text-[11px] md:text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    Ticket
                                </th>
                                <th className="px-2 md:px-4 lg:px-6 py-2 md:py-3 text-left text-[11px] md:text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    Client
                                </th>
                                <th className="px-2 md:px-4 lg:px-6 py-2 md:py-3 text-left text-[11px] md:text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    Statut
                                </th>
                                <th className="px-2 md:px-4 lg:px-6 py-2 md:py-3 text-left text-[11px] md:text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    Priorité
                                </th>
                                <th className="px-2 md:px-4 lg:px-6 py-2 md:py-3 text-left text-[11px] md:text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    Dernière MAJ
                                </th>
                                <th className="px-2 md:px-4 lg:px-6 py-2 md:py-3 text-left text-[11px] md:text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                            </thead>
                            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                            {filteredTickets.map((ticket) => (
                                <motion.tr 
                                    key={ticket.id} 
                                    whileHover={{ scale: 1.005 }}
                                    className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                                >
                                    <td className="px-2 md:px-4 lg:px-6 py-2 md:py-4 whitespace-nowrap">
                                        <div>
                                            <div className="text-xs md:text-sm font-medium text-gray-900 dark:text-white">
                                                {ticket.ticketNumber}
                                            </div>
                                            <div className="text-[11px] md:text-xs text-gray-500 dark:text-gray-400 truncate max-w-[160px] md:max-w-xs">
                                                {ticket.subject}
                                            </div>
                                            <div className="flex items-center mt-1">
                                                <span className="text-[10px] mr-1">{getCategoryIcon(ticket.category)}</span>
                                                <span className="text-[10px] text-gray-400 dark:text-gray-500">
                                                    {getCategoryText(ticket.category)}
                                                </span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-2 md:px-4 lg:px-6 py-2 md:py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="h-8 w-8 md:h-10 md:w-10 rounded-full bg-gradient-to-r from-green-600 via-yellow-500 to-red-600 flex items-center justify-center flex-shrink-0">
                                                <FiUser className="text-white" size={14}/>
                                            </div>
                                            <div className="ml-2 md:ml-3 min-w-0 flex-1">
                                                <div className="text-xs md:text-sm font-medium text-gray-900 dark:text-white truncate">
                                                    {ticket.customer.name}
                                                </div>
                                                <div className="text-[11px] md:text-xs text-gray-500 dark:text-gray-400 truncate">
                                                    {ticket.customer.email}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-2 md:px-4 lg:px-6 py-2 md:py-4 whitespace-nowrap">
                                        <span className={`inline-flex px-2 py-0.5 text-[11px] md:text-xs font-semibold rounded-full ${getStatusColor(ticket.status)}`}>
                                            {getStatusText(ticket.status)}
                                        </span>
                                    </td>
                                    <td className="px-2 md:px-4 lg:px-6 py-2 md:py-4 whitespace-nowrap">
                                        <span className={`inline-flex px-2 py-0.5 text-[11px] md:text-xs font-semibold rounded-full ${getPriorityColor(ticket.priority)}`}>
                                            {getPriorityText(ticket.priority)}
                                        </span>
                                    </td>
                                    <td className="px-2 md:px-4 lg:px-6 py-2 md:py-4 whitespace-nowrap text-[11px] md:text-xs text-gray-500 dark:text-gray-400">
                                        {formatTimeAgo(ticket.lastUpdate)}
                                    </td>
                                    <td className="px-2 md:px-4 lg:px-6 py-2 md:py-4 whitespace-nowrap text-xs font-medium">
                                        <div className="flex space-x-1 md:space-x-2">
                                            <motion.button
                                                whileHover={{ scale: 1.2 }}
                                                whileTap={{ scale: 0.9 }}
                                                onClick={() => setSelectedTicket(ticket)}
                                                className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300 transition-colors p-1"
                                                title="Voir détails"
                                            >
                                                <FiEye size={16}/>
                                            </motion.button>
                                            <motion.button
                                                whileHover={{ scale: 1.2 }}
                                                whileTap={{ scale: 0.9 }}
                                                onClick={() => updateTicketStatus(ticket.id, 'in_progress')}
                                                className="text-yellow-600 hover:text-yellow-900 dark:text-yellow-400 dark:hover:text-yellow-300 transition-colors p-1"
                                                disabled={ticket.status === 'resolved'}
                                                title="Prendre en charge"
                                            >
                                                <FiEdit3 size={16}/>
                                            </motion.button>
                                            <motion.button
                                                whileHover={{ scale: 1.2 }}
                                                whileTap={{ scale: 0.9 }}
                                                onClick={() => updateTicketStatus(ticket.id, 'resolved')}
                                                className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300 transition-colors p-1"
                                                disabled={ticket.status === 'resolved'}
                                                title="Marquer résolu"
                                            >
                                                <FiCheckCircle size={16}/>
                                            </motion.button>
                                        </div>
                                    </td>
                                </motion.tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Create Ticket Modal */}
                {showModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
                        <motion.div 
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl bg-white shadow-2xl dark:bg-gray-800"
                        >
                            {/* Header */}
                            <div className="flex items-center justify-between border-b border-gray-200 p-6 dark:border-gray-700">
                                <h2 className="text-xl font-bold dark:text-white">
                                    Créer un Nouveau Ticket
                                </h2>
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="text-gray-500 transition hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                                >
                                    <FiX size={24} />
                                </button>
                            </div>

                            {/* Body */}
                            <div className="p-6 space-y-6">
                                <div className="grid grid-cols-1 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Sujet du Ticket
                                        </label>
                                        <input
                                            type="text"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white dark:border-gray-600"
                                            value={newTicket.subject}
                                            onChange={(e) => setNewTicket({...newTicket, subject: e.target.value})}
                                            placeholder="Décrivez brièvement le problème"
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                Catégorie
                                            </label>
                                            <select
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white dark:border-gray-600"
                                                value={newTicket.category}
                                                onChange={(e) => setNewTicket({...newTicket, category: e.target.value})}
                                            >
                                                <option value="delivery">Livraison</option>
                                                <option value="payment">Paiement</option>
                                                <option value="account">Compte</option>
                                                <option value="technical">Technique</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                Priorité (auto-déterminée)
                                            </label>
                                            <input
                                                type="text"
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 dark:bg-gray-700 dark:text-white dark:border-gray-600 cursor-not-allowed"
                                                value={
                                                    newTicket.category === 'delivery' || newTicket.category === 'technical' 
                                                    ? 'Élevée' 
                                                    : newTicket.category === 'account' 
                                                    ? 'Faible' 
                                                    : 'Moyenne'
                                                }
                                                readOnly
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Description
                                        </label>
                                        <textarea
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white dark:border-gray-600"
                                            rows="4"
                                            value={newTicket.description}
                                            onChange={(e) => setNewTicket({...newTicket, description: e.target.value})}
                                            placeholder="Décrivez en détail le problème rencontré..."
                                        ></textarea>
                                    </div>

                                    <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                                        <h3 className="text-lg font-semibold dark:text-white mb-4">Informations Client</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                    Nom Complet
                                                </label>
                                                <input
                                                    type="text"
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white dark:border-gray-600"
                                                    value={newTicket.customer.name}
                                                    onChange={(e) => setNewTicket({
                                                        ...newTicket,
                                                        customer: {...newTicket.customer, name: e.target.value}
                                                    })}
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                    Email
                                                </label>
                                                <input
                                                    type="email"
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white dark:border-gray-600"
                                                    value={newTicket.customer.email}
                                                    onChange={(e) => setNewTicket({
                                                        ...newTicket,
                                                        customer: {...newTicket.customer, email: e.target.value}
                                                    })}
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                    Téléphone
                                                </label>
                                                <input
                                                    type="tel"
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white dark:border-gray-600"
                                                    value={newTicket.customer.phone}
                                                    onChange={(e) => setNewTicket({
                                                        ...newTicket,
                                                        customer: {...newTicket.customer, phone: e.target.value}
                                                    })}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex justify-end space-x-3 pt-4">
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => setShowModal(false)}
                                        className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                    >
                                        Annuler
                                    </motion.button>
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={handleCreateTicket}
                                        disabled={!newTicket.subject || !newTicket.description}
                                        className={`px-4 py-2 rounded-lg text-white transition-colors ${
                                            !newTicket.subject || !newTicket.description
                                                ? 'bg-gray-400 cursor-not-allowed'
                                                : 'bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600'
                                        }`}
                                    >
                                        Créer Ticket
                                    </motion.button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}

                {/* Ticket Detail Modal */}
                {selectedTicket && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
                        <motion.div 
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-xl bg-white shadow-2xl dark:bg-gray-800"
                        >
                            {/* Header */}
                            <div className="flex items-center justify-between border-b border-gray-200 p-6 dark:border-gray-700">
                                <h2 className="text-xl font-bold dark:text-white">
                                    Détails du Ticket - {selectedTicket.ticketNumber}
                                </h2>
                                <button
                                    onClick={() => setSelectedTicket(null)}
                                    className="text-gray-500 transition hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                                >
                                    <FiX size={24} />
                                </button>
                            </div>

                            {/* Body */}
                            <div className="p-6 space-y-6">
                                {/* Info Section */}
                                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                    {/* Customer Info */}
                                    <div>
                                        <h3 className="mb-4 text-lg font-semibold dark:text-white">Informations Client</h3>
                                        <div className="space-y-3 text-sm text-gray-800 dark:text-gray-300">
                                            <div className="flex items-center">
                                                <FiUser className="mr-2 text-gray-500" size={16} />
                                                {selectedTicket.customer.name}
                                            </div>
                                            <div className="flex items-center">
                                                <FiMail className="mr-2 text-gray-500" size={16} />
                                                {selectedTicket.customer.email}
                                            </div>
                                            <div className="flex items-center">
                                                <FiPhone className="mr-2 text-gray-500" size={16} />
                                                {selectedTicket.customer.phone}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Ticket Info */}
                                    <div>
                                        <h3 className="mb-4 text-lg font-semibold dark:text-white">Détails du Ticket</h3>
                                        <div className="space-y-3 text-sm dark:text-gray-300">
                                            <div>
                                                <span className="font-medium">Statut : </span>
                                                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedTicket.status)}`}>
                                                    {getStatusText(selectedTicket.status)}
                                                </span>
                                            </div>
                                            <div>
                                                <span className="font-medium">Priorité : </span>
                                                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(selectedTicket.priority)}`}>
                                                    {getPriorityText(selectedTicket.priority)}
                                                </span>
                                            </div>
                                            <div>
                                                <span className="font-medium">Catégorie : </span>
                                                <span>{getCategoryText(selectedTicket.category)}</span>
                                            </div>
                                            <div>
                                                <span className="font-medium">Créé le : </span>
                                                <span>{selectedTicket.createdAt.toLocaleDateString('fr-FR')}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Description */}
                                <div>
                                    <h3 className="mb-3 text-lg font-semibold dark:text-white">Description</h3>
                                    <p className="rounded-lg bg-gray-50 p-4 text-gray-700 dark:bg-gray-700 dark:text-gray-300">
                                        {selectedTicket.description}
                                    </p>
                                </div>

                                {/* Conversation */}
                                {selectedTicket.messages.length > 0 && (
                                    <div>
                                        <h3 className="mb-3 text-lg font-semibold dark:text-white">Conversation</h3>
                                        <div className="max-h-60 space-y-3 overflow-y-auto">
                                            {selectedTicket.messages.map((message) => (
                                                <motion.div
                                                    key={message.id}
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    className={`rounded-lg p-3 text-sm ${
                                                        message.sender === 'customer'
                                                            ? 'bg-blue-100 dark:bg-blue-900 mr-12'
                                                            : 'bg-green-100 dark:bg-green-900 ml-12'
                                                    }`}
                                                >
                                                    <div className="mb-1 flex items-start justify-between">
                                                        <span className="font-medium">
                                                            {message.sender === 'customer' ? 'Client' : 'Support'}
                                                        </span>
                                                        <span className="text-xs text-gray-500">
                                                            {message.timestamp.toLocaleTimeString('fr-FR')}
                                                        </span>
                                                    </div>
                                                    <p>{message.message}</p>
                                                </motion.div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* New Message */}
                                <div>
                                    <h3 className="mb-3 text-lg font-semibold dark:text-white">Ajouter une réponse</h3>
                                    <textarea
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white dark:border-gray-600"
                                        rows="3"
                                        placeholder="Écrivez votre réponse ici..."
                                    ></textarea>
                                    <div className="mt-2 flex justify-end">
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            className="px-4 py-2 bg-gradient-to-r from-green-600 to-green-500 text-white rounded-lg hover:from-green-700 hover:to-green-600 transition-colors"
                                        >
                                            Envoyer
                                        </motion.button>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex justify-end space-x-3 pt-4">
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => updateTicketStatus(selectedTicket.id, 'in_progress')}
                                        className="rounded-lg bg-yellow-500 px-4 py-2 text-white transition hover:bg-yellow-600 disabled:opacity-50"
                                        disabled={selectedTicket.status === 'resolved'}
                                    >
                                        Prendre en charge
                                    </motion.button>
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => {
                                            updateTicketStatus(selectedTicket.id, 'resolved');
                                            setSelectedTicket(null);
                                        }}
                                        className="rounded-lg bg-green-500 px-4 py-2 text-white transition hover:bg-green-600 disabled:opacity-50"
                                        disabled={selectedTicket.status === 'resolved'}
                                    >
                                        Marquer comme résolu
                                    </motion.button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </div>
        </SupportAgentLayout>
    );
};

export default SupportTicketsPage;