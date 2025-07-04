import React, { useState, useEffect, createContext, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    FiFileText,
    FiMail,
    FiMoreVertical,
    FiAlertCircle,
    FiSearch,
    FiEdit,
    FiCheck,
    FiX,
    FiClock,
    FiChevronDown, 
    FiUser, 
    FiEdit3, 
    FiHeadphones,
    FiPhone,
    FiMessageSquare,
    FiArrowUp,
    FiEye,
    FiSend,
    FiUserCheck,
    FiShield,
    FiZap
} from 'react-icons/fi';
import SupportAgentLayout from "@/layouts/agent_support_layout.jsx";
import {FileX2Icon, Trash2, AlertTriangle, CheckCircle, Clock, Users} from "lucide-react";
import {HiOutlineMoon, HiOutlineSun} from "react-icons/hi";


// Disputes Page Component
const SupportDisputesPage = () => {
    const [darkMode, setDarkMode] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState('tous');
    const [currentTime, setCurrentTime] = useState(new Date());
    const [priorityFilter, setPriorityFilter] = useState('toutes');
    const [selectedDispute, setSelectedDispute] = useState(null);
    const [showResolutionModal, setShowResolutionModal] = useState(false);

    // Sample disputes data
    const [disputes, setDisputes] = useState([
        {
            id: 'LIT-2024-001',
            type: 'Commande non reçue',
            customer: {
                name: 'Marie Dubois',
                email: 'marie.dubois@gmail.com',
                phone: '+237 6XX XXX XXX'
            },
            livreur: 'Jean Kamga',
            restaurant: 'Pizza Palace',
            statut: 'En cours',
            priorite: 'Haute',
            dateCreation: '2024-06-05',
            montant: '15,500 FCFA',
            description: 'Client affirme ne pas avoir reçu sa commande malgré statut "livré"',
            lastUpdate: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 heures
            escalated: false
        },
        {
            id: 'LIT-2024-002',
            type: 'Remboursement',
            customer: {
                name: 'Paul Nkomo',
                email: 'paul.nkomo@yahoo.fr',
                phone: '+237 6XX XXX XXX'
            },
            livreur: 'Alice Biya',
            restaurant: 'Burger King',
            statut: 'Nouveau',
            priorite: 'Moyenne',
            dateCreation: '2024-06-04',
            montant: '8,200 FCFA',
            description: 'Demande de remboursement pour commande annulée après paiement',
            lastUpdate: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 heures
            escalated: false
        },
        {
            id: 'LIT-2024-003',
            type: 'Problème qualité',
            customer: {
                name: 'Sophie Ateba',
                email: 'sophie.ateba@gmail.com',
                phone: '+237 6XX XXX XXX'
            },
            livreur: 'Michel Fouda',
            restaurant: 'Chicken House',
            statut: 'Résolu',
            priorite: 'Basse',
            dateCreation: '2024-06-03',
            montant: '12,000 FCFA',
            description: 'Nourriture froide à la livraison, client mécontent',
            lastUpdate: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 heures
            escalated: false
        },
        {
            id: 'LIT-2024-004',
            type: 'Livreur absent',
            customer: {
                name: 'Robert Manga',
                email: 'robert.manga@hotmail.com',
                phone: '+237 6XX XXX XXX'
            },
            livreur: 'David Essono',
            restaurant: 'Sushi Master',
            statut: 'En cours',
            priorite: 'Haute',
            dateCreation: '2024-06-02',
            montant: '25,800 FCFA',
            description: 'Livreur introuvable après avoir pris la commande',
            lastUpdate: new Date(Date.now() - 8 * 60 * 60 * 1000), // 8 heures
            escalated: true
        },
        {
            id: 'LIT-2024-005',
            type: 'Erreur facturation',
            customer: {
                name: 'Emma Nguema',
                email: 'emma.nguema@gmail.com',
                phone: '+237 6XX XXX XXX'
            },
            livreur: 'Christian Bello',
            restaurant: 'Tacos Mexico',
            statut: 'Nouveau',
            priorite: 'Moyenne',
            dateCreation: '2024-06-01',
            montant: '7,500 FCFA',
            description: 'Facturé deux fois pour la même commande',
            lastUpdate: new Date(Date.now() - 10 * 60 * 60 * 1000), // 10 heures
            escalated: false
        }
    ]);

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

    const getStatusColor = (status) => {
        switch (status.toLowerCase()) {
            case 'nouveau':
                return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
            case 'en cours':
                return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
            case 'résolu':
                return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
            default:
                return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
        }
    };

    const getPriorityColor = (priority) => {
        switch (priority.toLowerCase()) {
            case 'haute':
                return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
            case 'moyenne':
                return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
            case 'basse':
                return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
            default:
                return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
        }
    };

    const handleResolveLitigation = (resolutionData) => {
        setDisputes(prevDisputes => 
            prevDisputes.map(dispute => 
                dispute.id === resolutionData.disputeId 
                    ? { 
                        ...dispute, 
                        statut: resolutionData.escalated ? 'Escaladé' : 'Résolu',
                        resolution: resolutionData,
                        lastUpdate: new Date()
                    }
                    : dispute
            )
        );
    };

    const filteredDisputes = disputes.filter(dispute => {
        const matchesSearch = dispute.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            dispute.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            dispute.type.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = statusFilter === 'tous' || dispute.statut.toLowerCase() === statusFilter.toLowerCase();
        const matchesPriority = priorityFilter === 'toutes' || dispute.priorite.toLowerCase() === priorityFilter.toLowerCase();

        return matchesSearch && matchesStatus && matchesPriority;
    });

    const stats = {
        total: disputes.length,
        nouveau: disputes.filter(d => d.statut === 'Nouveau').length,
        enCours: disputes.filter(d => d.statut === 'En cours').length,
        resolu: disputes.filter(d => d.statut === 'Résolu').length,
        escale: disputes.filter(d => d.escalated).length
    };

    if (isLoading) {
        return (
            <SupportAgentLayout>
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gradient-to-r from-green-500 via-yellow-500 to-red-500"></div>
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
                        <div className="w-12 h-12 bg-gradient-to-r from-green-600 via-yellow-500 to-red-600 rounded-full flex items-center justify-center mr-4 transform hover:scale-110 transition-transform duration-300 shadow-lg">
                            <FiAlertCircle className="text-white animate-pulse" size={24}/>
                        </div>
                        <div>
                            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-green-600 via-yellow-500 to-red-600 bg-clip-text text-transparent">
                                Gestion des Litiges
                            </h1>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                Résolution professionnelle des réclamations clients
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center space-x-2 sm:space-x-4">
                        <div className="hidden sm:flex items-center space-x-2 text-xs sm:text-sm text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 px-3 py-2 rounded-lg shadow-md">
                            <Clock size={16} className="text-green-500" />
                            <span>{currentTime.toLocaleTimeString('fr-FR', {hour: '2-digit', minute: '2-digit'})}</span>
                        </div>
                        <button
                            onClick={toggleTheme}
                            className="p-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none transition-all duration-300 transform hover:scale-110 shadow-md bg-white dark:bg-gray-800"
                        >
                            {darkMode ? (
                                <HiOutlineSun className="text-yellow-400" size={20}/>
                            ) : (
                                <HiOutlineMoon className="text-gray-600" size={20}/>
                            )}
                        </button>
                    </div>
                </div>

                {/* Statistics Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
                    <div className="bg-gradient-to-br from-green-500 to-green-600 p-4 sm:p-6 rounded-2xl text-white shadow-lg transform hover:scale-105 transition-all duration-300">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-green-100 text-sm">Total Litiges</p>
                                <p className="text-2xl sm:text-3xl font-bold">{stats.total}</p>
                            </div>
                            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center transform hover:rotate-12 transition-transform duration-300">
                                <FiAlertCircle size={20} className="sm:text-2xl" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-red-500 to-red-600 p-4 sm:p-6 rounded-2xl text-white shadow-lg transform hover:scale-105 transition-all duration-300">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-red-100 text-sm">Nouveaux</p>
                                <p className="text-2xl sm:text-3xl font-bold">{stats.nouveau}</p>
                            </div>
                            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center transform hover:rotate-12 transition-transform duration-300">
                                <FiClock size={20} className="sm:text-2xl animate-pulse" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 p-4 sm:p-6 rounded-2xl text-white shadow-lg transform hover:scale-105 transition-all duration-300">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-yellow-100 text-sm">En Cours</p>
                                <p className="text-2xl sm:text-3xl font-bold">{stats.enCours}</p>
                            </div>
                            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center transform hover:rotate-12 transition-transform duration-300">
                                <FiEdit size={20} className="sm:text-2xl" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-green-600 to-green-700 p-4 sm:p-6 rounded-2xl text-white shadow-lg transform hover:scale-105 transition-all duration-300">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-green-100 text-sm">Résolus</p>
                                <p className="text-2xl sm:text-3xl font-bold">{stats.resolu}</p>
                            </div>
                            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center transform hover:rotate-12 transition-transform duration-300">
                                <FiCheck size={20} className="sm:text-2xl" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-4 sm:p-6 rounded-2xl text-white shadow-lg transform hover:scale-105 transition-all duration-300">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-purple-100 text-sm">Escaladés</p>
                                <p className="text-2xl sm:text-3xl font-bold">{stats.escale}</p>
                            </div>
                            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center transform hover:rotate-12 transition-transform duration-300">
                                <FiArrowUp size={20} className="sm:text-2xl" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filters and Search */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-8 border border-gray-100 dark:border-gray-700">
                    <div className="flex flex-col lg:flex-row gap-4">
                        <div className="flex-1">
                            <div className="relative">
                                <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 transition-colors duration-200"
                                          size={20}/>
                                <input
                                    type="text"
                                    placeholder="Rechercher un litige par ID, client ou type..."
                                    className="w-full pl-12 pr-4 py-4 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 transform hover:scale-105"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                                </div>
                        </div>
                        
                        <div className="flex flex-col sm:flex-row gap-4">
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                            >
                                <option value="tous">Tous les statuts</option>
                                <option value="nouveau">Nouveau</option>
                                <option value="en cours">En cours</option>
                                <option value="résolu">Résolu</option>
                            </select>
                            
                            <select
                                value={priorityFilter}
                                onChange={(e) => setPriorityFilter(e.target.value)}
                                className="px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                            >
                                <option value="toutes">Toutes priorités</option>
                                <option value="haute">Haute</option>
                                <option value="moyenne">Moyenne</option>
                                <option value="basse">Basse</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Disputes List */}
                <div className="space-y-4">
                    {filteredDisputes.length === 0 ? (
                        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-2xl shadow-lg">
                            <FileX2Icon size={64} className="mx-auto text-gray-400 mb-4" />
                            <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
                                Aucun litige trouvé
                            </h3>
                            <p className="text-gray-500 dark:text-gray-400">
                                Essayez de modifier vos critères de recherche
                            </p>
                        </div>
                    ) : (
                        filteredDisputes.map((dispute) => (
                            <div
                                key={dispute.id}
                                className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] overflow-hidden"
                            >
                                <div className="p-6">
                                    <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-4">
                                        <div className="flex items-center space-x-4 mb-4 lg:mb-0">
                                            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                                                dispute.priorite === 'Haute' ? 'bg-red-100 dark:bg-red-900' :
                                                dispute.priorite === 'Moyenne' ? 'bg-yellow-100 dark:bg-yellow-900' :
                                                'bg-green-100 dark:bg-green-900'
                                            }`}>
                                                <FiAlertCircle size={24} className={
                                                    dispute.priorite === 'Haute' ? 'text-red-600 dark:text-red-400' :
                                                    dispute.priorite === 'Moyenne' ? 'text-yellow-600 dark:text-yellow-400' :
                                                    'text-green-600 dark:text-green-400'
                                                } />
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                                                    {dispute.id}
                                                    {dispute.escalated && (
                                                        <span className="ml-2 px-2 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 text-xs rounded-full">
                                                            Escaladé
                                                        </span>
                                                    )}
                                                </h3>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                                    {dispute.type} • {formatTimeAgo(dispute.lastUpdate)}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center space-x-3">
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(dispute.priorite)}`}>
                                                {dispute.priorite}
                                            </span>
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(dispute.statut)}`}>
                                                {dispute.statut}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                                        <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-xl">
                                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Client</p>
                                            <p className="font-medium text-gray-900 dark:text-white">{dispute.customer.name}</p>
                                            <p className="text-xs text-gray-600 dark:text-gray-400">{dispute.customer.email}</p>
                                        </div>
                                        
                                        <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-xl">
                                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Restaurant</p>
                                            <p className="font-medium text-gray-900 dark:text-white">{dispute.restaurant}</p>
                                        </div>
                                        
                                        <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-xl">
                                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Livreur</p>
                                            <p className="font-medium text-gray-900 dark:text-white">{dispute.livreur}</p>
                                        </div>
                                        
                                        <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-xl">
                                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Montant</p>
                                            <p className="font-medium text-gray-900 dark:text-white">{dispute.montant}</p>
                                        </div>
                                    </div>

                                    <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-xl mb-4">
                                        <p className="text-sm text-gray-700 dark:text-gray-300">
                                            <span className="font-medium">Description: </span>
                                            {dispute.description}
                                        </p>
                                    </div>

                                    <div className="flex flex-col sm:flex-row gap-3">
                                        <button
                                            onClick={() => {
                                                setSelectedDispute(dispute);
                                                setShowResolutionModal(true);
                                            }}
                                            className="flex-1 bg-gradient-to-r from-green-600 via-yellow-600 to-red-600 text-white px-4 py-3 rounded-xl hover:from-green-700 hover:via-yellow-700 hover:to-red-700 transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2 shadow-lg"
                                        >
                                            <FiShield size={18} />
                                            <span>Résoudre</span>
                                        </button>
                                        
                                        <button className="px-4 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 flex items-center justify-center space-x-2">
                                            <FiPhone size={18} />
                                            <span>Appeler</span>
                                        </button>
                                        
                                        <button className="px-4 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 flex items-center justify-center space-x-2">
                                            <FiMail size={18} />
                                            <span>Email</span>
                                        </button>
                                        
                                        <button className="px-4 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 flex items-center justify-center space-x-2">
                                            <FiEye size={18} />
                                            <span>Détails</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Resolution Modal */}
                <LitigationResolutionModal
                    isOpen={showResolutionModal}
                    onClose={() => {
                        setShowResolutionModal(false);
                        setSelectedDispute(null);
                    }}
                    dispute={selectedDispute}
                    onResolve={handleResolveLitigation}
                />
            </div>
        </SupportAgentLayout>
    );
};

// Modal de résolution de litige
const LitigationResolutionModal = ({ isOpen, onClose, dispute, onResolve }) => {
    const [resolutionType, setResolutionType] = useState('');
    const [resolutionNotes, setResolutionNotes] = useState('');
    const [escalate, setEscalate] = useState(false);
    const [refundAmount, setRefundAmount] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);

    const resolutionOptions = [
        { id: 'refund_full', label: 'Remboursement complet', icon: '💰', color: 'text-green-600' },
        { id: 'refund_partial', label: 'Remboursement partiel', icon: '💳', color: 'text-yellow-600' },
        { id: 'redelivery', label: 'Nouvelle livraison', icon: '🚀', color: 'text-blue-600' },
        { id: 'voucher', label: 'Bon de réduction', icon: '🎟️', color: 'text-purple-600' },
        { id: 'contact_restaurant', label: 'Contacter le restaurant', icon: '🏪', color: 'text-orange-600' },
        { id: 'escalate', label: 'Escalader au superviseur', icon: '⬆️', color: 'text-red-600' }
    ];

    const handleResolve = async () => {
        setIsProcessing(true);
        // Simuler le traitement
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        onResolve({
            disputeId: dispute.id,
            type: resolutionType,
            notes: resolutionNotes,
            escalated: escalate,
            refundAmount: refundAmount
        });
        
        setIsProcessing(false);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl transform transition-all duration-300 scale-100">
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
                            <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-red-500 via-yellow-500 rounded-full flex items-center justify-center mr-3 transform hover:scale-110 transition-transform duration-300">
                                <FiShield className="text-white" size={20} />
                            </div>
                            Résolution du Litige {dispute?.id}
                        </h3>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors duration-200"
                        >
                            <FiX size={20} />
                        </button>
                    </div>
                </div>

                <div className="p-6 space-y-6">
                    {/* Informations du litige */}
                    <div className="bg-gradient-to-r from-green-50 to-red-50 via-yellow-50 dark:from-green-900 dark:to-red-900 dark:via-yellow-900 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
                        <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">Détails du Litige</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div>
                                <span className="text-gray-600 dark:text-gray-400">Type:</span>
                                <span className="ml-2 font-medium">{dispute?.type}</span>
                            </div>
                            <div>
                                <span className="text-gray-600 dark:text-gray-400">Client:</span>
                                <span className="ml-2 font-medium">{dispute?.customer?.name}</span>
                            </div>
                            <div>
                                <span className="text-gray-600 dark:text-gray-400">Montant:</span>
                                <span className="ml-2 font-medium">{dispute?.montant}</span>
                            </div>
                            <div>
                                <span className="text-gray-600 dark:text-gray-400">Restaurant:</span>
                                <span className="ml-2 font-medium">{dispute?.restaurant}</span>
                            </div>
                        </div>
                        <div className="mt-3">
                            <span className="text-gray-600 dark:text-gray-400">Description:</span>
                            <p className="mt-1 text-gray-800 dark:text-gray-200">{dispute?.description}</p>
                        </div>
                    </div>

                    {/* Options de résolution */}
                    <div>
                        <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-4">Type de Résolution</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {resolutionOptions.map((option) => (
                                <button
                                    key={option.id}
                                    onClick={() => setResolutionType(option.id)}
                                    className={`p-4 rounded-xl border-2 transition-all duration-300 transform hover:scale-105 text-left ${
                                        resolutionType === option.id
                                            ? 'border-green-500 bg-green-50 dark:bg-green-900 shadow-lg'
                                            : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                                    }`}
                                >
                                    <div className="flex items-center space-x-3">
                                        <span className="text-2xl transform hover:scale-110 transition-transform duration-200">
                                            {option.icon}
                                        </span>
                                        <div>
                                            <p className={`font-medium ${option.color}`}>{option.label}</p>
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Montant de remboursement */}
                    {(resolutionType === 'refund_full' || resolutionType === 'refund_partial') && (
                        <div className="animate-slideIn">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Montant du remboursement (FCFA)
                            </label>
                            <input
                                type="number"
                                value={refundAmount}
                                onChange={(e) => setRefundAmount(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                                placeholder="Entrez le montant"
                            />
                        </div>
                    )}

                    {/* Notes de résolution */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Notes de résolution
                        </label>
                        <textarea
                            value={resolutionNotes}
                            onChange={(e) => setResolutionNotes(e.target.value)}
                            rows={4}
                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                            placeholder="Décrivez les actions prises et la résolution..."
                        />
                    </div>

                    {/* Option d'escalade */}
                    <div className="flex items-center space-x-3 p-4 bg-yellow-50 dark:bg-yellow-900 rounded-xl border border-yellow-200 dark:border-yellow-700">
                        <input
                            type="checkbox"
                            id="escalate"
                            checked={escalate}
                            onChange={(e) => setEscalate(e.target.checked)}
                            className="w-4 h-4 text-yellow-600 bg-gray-100 border-gray-300 rounded focus:ring-yellow-500 focus:ring-2"
                        />
                        <label htmlFor="escalate" className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                            Escalader ce litige vers un superviseur pour validation
                        </label>
                    </div>

                    {/* Boutons d'action */}
                    <div className="flex flex-col sm:flex-row gap-3 pt-4">
                        <button
                            onClick={onClose}
                            className="flex-1 px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 transform hover:scale-105"
                        >
                            Annuler
                        </button>
                        <button
                            onClick={handleResolve}
                            disabled={!resolutionType || isProcessing}
                            className="flex-1 px-6 py-3 bg-gradient-to-r from-green-600 to-red-600 via-yellow-600 text-white rounded-xl hover:from-green-700 hover:to-red-700 hover:via-yellow-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2"
                        >
                            {isProcessing ? (
                                <>
                                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                                    <span>Traitement...</span>
                                </>
                            ) : (
                                <>
                                    <FiCheck size={20} />
                                    <span>Résoudre le Litige</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SupportDisputesPage;