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
    FiChevronDown, FiUser, FiEdit3, FiHeadphones
} from 'react-icons/fi';
import SupportAgentLayout from "@/layouts/agent_support_layout.jsx";
import {FileX2Icon, Trash2} from "lucide-react";
import {HiOutlineMoon, HiOutlineSun} from "react-icons/hi";

// Disputes Page Component
const SupportDisputesPage = () => {
    const [darkMode, setDarkMode] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState('tous');
    const [currentTime, setCurrentTime] = useState(new Date());
    const [priorityFilter, setPriorityFilter] = useState('toutes');

    // Sample disputes data
    const [disputes] = useState([
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
            description: 'Client affirme ne pas avoir reçu sa commande malgré statut "livré"'
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
            description: 'Demande de remboursement pour commande annulée après paiement'
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
            description: 'Nourriture froide à la livraison, client mécontent'
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
            description: 'Livreur introuvable après avoir pris la commande'
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
            description: 'Facturé deux fois pour la même commande'
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
        resolu: disputes.filter(d => d.statut === 'Résolu').length
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
                <div
                    className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 space-y-4 sm:space-y-0">
                    <div className="flex items-center">
                        <FiAlertCircle className="mr-2 text-green-600 dark:text-yellow-400" size={24}/>
                        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-green-600 via-yellow-500 to-red-600 bg-clip-text text-transparent">
                            Gestion des Litiges
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
                {/* Statistics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-green-500 p-6 rounded-lg text-white">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-green-100">Total Litiges</p>
                                <p className="text-3xl font-bold">{stats.total}</p>
                            </div>
                            <div
                                className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                                <FiAlertCircle size={24}/>
                            </div>
                        </div>
                    </div>

                    <div className="bg-red-500 p-6 rounded-lg text-white">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-red-100">Nouveaux</p>
                                <p className="text-3xl font-bold">{stats.nouveau}</p>
                            </div>
                            <div
                                className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                                <FiClock size={24}/>
                            </div>
                        </div>
                    </div>

                    <div className="bg-yellow-500 p-6 rounded-lg text-white">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-yellow-100">En Cours</p>
                                <p className="text-3xl font-bold">{stats.enCours}</p>
                            </div>
                            <div
                                className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                                <FiEdit size={24}/>
                            </div>
                        </div>
                    </div>

                    <div className="bg-green-600 p-6 rounded-lg text-white">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-green-100">Résolus</p>
                                <p className="text-3xl font-bold">{stats.resolu}</p>
                            </div>
                            <div
                                className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                                <FiCheck size={24}/>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filters and Search */}
                <div className={`rounded-lg shadow-md p-6`}>
                    <div className="flex flex-col lg:flex-row gap-4">
                        <div className="flex-1">
                            <div className="relative">
                                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                                          size={20}/>
                                <input
                                    type="text"
                                    placeholder="Rechercher un litige..."
                                    className={`w-full pl-10 pr-4 py-3 rounded-lg border focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200`}
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <select
                                className={`px-4 py-3 rounded-lg border focus:ring-2 focus:ring-green-500 transition-all duration-200`}
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                            >
                                <option value="tous">Tous les statuts</option>
                                <option value="nouveau">Nouveau</option>
                                <option value="en cours">En cours</option>
                                <option value="résolu">Résolu</option>
                            </select>

                            <select
                                className={`px-4 py-3 rounded-lg border focus:ring-2 focus:ring-green-500 transition-all duration-200`}
                                value={priorityFilter}
                                onChange={(e) => setPriorityFilter(e.target.value)}
                            >
                                <option value="toutes">Toutes priorités</option>
                                <option value="haute">Haute</option>
                                <option value="moyenne">Moyenne</option>
                                <option value="basse">Basse</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Disputes Table */}
                <div className={`rounded-lg shadow-md overflow-hidden`}>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className={``}>
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    Litige
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    Client
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    Statut
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    Priorité
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    Date
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                            </thead>
                            <tbody>
                            {filteredDisputes.map((dispute, index) => (
                                <tr key={dispute.id} className={`hover: transition-colors duration-200`}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div>
                                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                {dispute.id}
                                            </div>
                                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                                {dispute.type}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div
                                                className="h-8 w-8 md:h-10 md:w-10 rounded-full bg-gradient-to-r from-green-600 via-yellow-500 to-red-600 flex items-center justify-center flex-shrink-0">
                                                <span className="text-white font-medium text-sm">
                                                    <FiUser className="text-white" size={14}/>
                                                </span>
                                            </div>
                                            <div className="ml-2 md:ml-3 min-w-0 flex-1">
                                                <div
                                                    className="text-xs md:text-sm font-medium text-gray-900 dark:text-white truncate">
                                                    {dispute.customer.name}
                                                </div>
                                                <div
                                                    className="text-[11px] md:text-xs text-gray-500 dark:text-gray-400 truncate">
                                                    {dispute.customer.email}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                            <span
                                                className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(dispute.statut)}`}>
                                                {dispute.statut}
                                            </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                            <span
                                                className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(dispute.priorite)}`}>
                                                {dispute.priorite}
                                            </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                        {new Date(dispute.dateCreation).toLocaleDateString('fr-FR')}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <div className="flex space-x-2">
                                            <button
                                                className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 transition-colors duration-200">
                                                <FiEdit3 size={18}/>
                                            </button>
                                            <button
                                                className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 transition-colors duration-200">
                                                <Trash2 size={18}/>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div
                        className="px-6 py-4 flex items-center justify-between border-t border-gray-200 dark:border-gray-700">
                        <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                            <span>Affichage de {filteredDisputes.length} sur {disputes.length} litiges</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <button
                                className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
                                Précédent
                            </button>
                            <button
                                className="px-3 py-1 text-sm bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors duration-200">
                                1
                            </button>
                            <button
                                className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
                                2
                            </button>
                            <button
                                className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
                                Suivant
                            </button>
                        </div>
                    </div>
                </div>

                {/* Quick Actions Panel */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Recent Activity */}
                    <div className={`rounded-lg shadow-md p-6`}>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold">Activité Récente</h3>
                            <button
                                className="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300">
                                <FiMoreVertical size={20}/>
                            </button>
                        </div>
                        <div className="space-y-4">
                            <div className="flex items-start space-x-3">
                                <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                                <div className="flex-1">
                                    <p className="text-sm font-medium">Litige LIT-2024-001 résolu</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Il y a 2 heures</p>
                                </div>
                            </div>
                            <div className="flex items-start space-x-3">
                                <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                                <div className="flex-1">
                                    <p className="text-sm font-medium">Nouveau litige assigné</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Il y a 4 heures</p>
                                </div>
                            </div>
                            <div className="flex items-start space-x-3">
                                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                                <div className="flex-1">
                                    <p className="text-sm font-medium">Mise à jour statut LIT-2024-003</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Il y a 6 heures</p>
                                </div>
                            </div>
                            <div className="flex items-start space-x-3">
                                <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                                <div className="flex-1">
                                    <p className="text-sm font-medium">Litige haute priorité créé</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Il y a 8 heures</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className={`rounded-lg shadow-md p-6`}>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold">Actions Rapides</h3>
                        </div>
                        <div className="space-y-3">
                            <button
                                className="w-full flex items-center justify-between p-3 bg-green-50 dark:bg-green-900 rounded-lg hover:bg-green-100 dark:hover:bg-green-800 transition-colors duration-200">
                                <div className="flex items-center space-x-3">
                                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                                        <FiCheck className="text-white" size={16}/>
                                    </div>
                                    <span
                                        className="font-medium text-green-700 dark:text-green-300">Résoudre un litige</span>
                                </div>
                                <FiChevronDown className="text-green-600 dark:text-green-400" size={16}/>
                            </button>

                            <button
                                className="w-full flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-800 transition-colors duration-200">
                                <div className="flex items-center space-x-3">
                                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                                        <FiMail className="text-white" size={16}/>
                                    </div>
                                    <span
                                        className="font-medium text-blue-700 dark:text-blue-300">Contacter client</span>
                                </div>
                                <FiChevronDown className="text-blue-600 dark:text-blue-400" size={16}/>
                            </button>

                            <button
                                className="w-full flex items-center justify-between p-3 bg-yellow-50 dark:bg-yellow-900 rounded-lg hover:bg-yellow-100 dark:hover:bg-yellow-800 transition-colors duration-200">
                                <div className="flex items-center space-x-3">
                                    <div
                                        className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                                        <FiEdit className="text-white" size={16}/>
                                    </div>
                                    <span className="font-medium text-yellow-700 dark:text-yellow-300">Mettre à jour statut</span>
                                </div>
                                <FiChevronDown className="text-yellow-600 dark:text-yellow-400" size={16}/>
                            </button>

                            <button
                                className="w-full flex items-center justify-between p-3 bg-purple-50 dark:bg-purple-900 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-800 transition-colors duration-200">
                                <div className="flex items-center space-x-3">
                                    <div
                                        className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                                        <FiFileText className="text-white" size={16}/>
                                    </div>
                                    <span
                                        className="font-medium text-purple-700 dark:text-purple-300">Générer rapport</span>
                                </div>
                                <FiChevronDown className="text-purple-600 dark:text-purple-400" size={16}/>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Performance Metrics */}
                <div className={`rounded-lg shadow-md p-6`}>
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-semibold">Métriques de Performance</h3>
                        <select
                            className={`px-3 py-2 rounded-md border focus:ring-2 focus:ring-green-500 transition-all duration-200`}>
                            <option>7 derniers jours</option>
                            <option>30 derniers jours</option>
                            <option>3 derniers mois</option>
                        </select>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="text-center">
                            <div className="text-3xl font-bold text-green-600 dark:text-green-400">94%</div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">Taux de résolution</div>
                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-2">
                                <div className="bg-green-600 h-2 rounded-full" style={{width: '94%'}}></div>
                            </div>
                        </div>

                        <div className="text-center">
                            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">2.4h</div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">Temps moyen résolution</div>
                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-2">
                                <div className="bg-blue-600 h-2 rounded-full" style={{width: '75%'}}></div>
                            </div>
                        </div>

                        <div className="text-center">
                            <div className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">4.8</div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">Note satisfaction</div>
                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-2">
                                <div className="bg-yellow-600 h-2 rounded-full" style={{width: '96%'}}></div>
                            </div>
                        </div>

                        <div className="text-center">
                            <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">28</div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">Litiges cette semaine</div>
                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-2">
                                <div className="bg-purple-600 h-2 rounded-full" style={{width: '70%'}}></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Priority Alerts */}
                <div className={`rounded-lg shadow-md p-6`}>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold flex items-center">
                            <FiAlertCircle className="text-red-500 mr-2" size={20}/>
                            Alertes Prioritaires
                        </h3>
                        <span
                            className="px-2 py-1 bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 rounded-full text-xs font-medium">
                            2 alertes
                        </span>
                    </div>
                    <div className="space-y-3">
                        <div
                            className="flex items-center p-3 bg-red-50 dark:bg-red-900 rounded-lg border-l-4 border-red-500">
                            <div className="flex-1">
                                <p className="font-medium text-red-800 dark:text-red-200">Litige LIT-2024-001 - Délai
                                    dépassé</p>
                                <p className="text-sm text-red-600 dark:text-red-300">Ce litige n'a pas été traité
                                    depuis plus de 24h</p>
                            </div>
                            <button
                                className="px-3 py-1 bg-red-600 text-white rounded-md text-sm hover:bg-red-700 transition-colors duration-200">
                                Traiter
                            </button>
                        </div>

                        <div
                            className="flex items-center p-3 bg-yellow-50 dark:bg-yellow-900 rounded-lg border-l-4 border-yellow-500">
                            <div className="flex-1">
                                <p className="font-medium text-yellow-800 dark:text-yellow-200">Litige LIT-2024-004 -
                                    Priorité haute</p>
                                <p className="text-sm text-yellow-600 dark:text-yellow-300">Client VIP avec problème
                                    urgent nécessitant attention immédiate</p>
                            </div>
                            <button
                                className="px-3 py-1 bg-yellow-600 text-white rounded-md text-sm hover:bg-yellow-700 transition-colors duration-200">
                                Voir
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </SupportAgentLayout>
    );
};

export default SupportDisputesPage;