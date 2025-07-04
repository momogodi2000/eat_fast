// src/services/UserService.js - Complete Frontend Integration

import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';

class UserService {
    constructor() {
        this.api = axios.create({
            baseURL: API_BASE_URL,
            headers: {
                'Content-Type': 'application/json',
            },
        });

        // Request interceptor to add auth token
        this.api.interceptors.request.use((config) => {
            const token = localStorage.getItem('access_token');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        });

        // Response interceptor to handle token refresh
        this.api.interceptors.response.use(
            (response) => response,
            async (error) => {
                if (error.response?.status === 401) {
                    await this.handleTokenRefresh();
                }
                return Promise.reject(error);
            }
        );
    }

    // Token management
    async handleTokenRefresh() {
        const refreshToken = localStorage.getItem('refresh_token');
        if (!refreshToken) {
            this.clearTokens();
            window.location.href = '/login';
            return;
        }

        try {
            const response = await axios.post(`${API_BASE_URL}/token/refresh/`, {
                refresh: refreshToken
            });
            
            localStorage.setItem('access_token', response.data.access);
            return response.data.access;
        } catch (error) {
            this.clearTokens();
            window.location.href = '/login';
        }
    }

    clearTokens() {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
    }

    // Authentication methods
    async register(userData) {
        try {
            const response = await this.api.post('/auth/register/', userData);
            return {
                success: true,
                data: response.data,
                message: response.data.message
            };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Registration failed',
                errors: error.response?.data?.errors
            };
        }
    }

    async login(credentials) {
        try {
            const response = await this.api.post('/auth/login/', credentials);
            
            if (response.data.requires_2fa) {
                return {
                    success: true,
                    requires2FA: true,
                    userId: response.data.user_id,
                    message: response.data.message
                };
            }

            // Store tokens and user data
            localStorage.setItem('access_token', response.data.access);
            localStorage.setItem('refresh_token', response.data.refresh);
            localStorage.setItem('user', JSON.stringify(response.data.user));

            return {
                success: true,
                user: response.data.user,
                message: 'Login successful'
            };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Login failed'
            };
        }
    }

    async verify2FA(userId, token) {
        try {
            const response = await this.api.post('/auth/verify-2fa/', {
                user_id: userId,
                token: token
            });

            // Store tokens and user data
            localStorage.setItem('access_token', response.data.access);
            localStorage.setItem('refresh_token', response.data.refresh);
            localStorage.setItem('user', JSON.stringify(response.data.user));

            return {
                success: true,
                user: response.data.user,
                message: response.data.message
            };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || '2FA verification failed'
            };
        }
    }

    async logout() {
        try {
            await this.api.post('/auth/logout/');
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            this.clearTokens();
        }
    }

    async forgotPassword(email) {
        try {
            const response = await this.api.post('/auth/forgot-password/', { email });
            return {
                success: true,
                message: response.data.message
            };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Password reset request failed'
            };
        }
    }

    async resetPassword(token, newPassword) {
        try {
            const response = await this.api.post('/auth/reset-password/', {
                token,
                new_password: newPassword
            });
            return {
                success: true,
                message: response.data.message
            };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Password reset failed'
            };
        }
    }

    async changePassword(currentPassword, newPassword) {
        try {
            const response = await this.api.post('/auth/change-password/', {
                current_password: currentPassword,
                new_password: newPassword,
                new_password_confirm: newPassword
            });
            return {
                success: true,
                message: response.data.message
            };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Password change failed',
                errors: error.response?.data?.errors
            };
        }
    }

    // Social authentication
    async googleAuth(accessToken) {
        try {
            const response = await this.api.post('/auth/auth/google/', {
                access_token: accessToken
            });

            localStorage.setItem('access_token', response.data.access);
            localStorage.setItem('refresh_token', response.data.refresh);
            localStorage.setItem('user', JSON.stringify(response.data.user));

            return {
                success: true,
                user: response.data.user,
                message: response.data.message
            };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Google authentication failed'
            };
        }
    }

    async appleAuth(identityToken, userData) {
        try {
            const response = await this.api.post('/auth/auth/apple/', {
                identity_token: identityToken,
                user_data: userData
            });

            localStorage.setItem('access_token', response.data.access);
            localStorage.setItem('refresh_token', response.data.refresh);
            localStorage.setItem('user', JSON.stringify(response.data.user));

            return {
                success: true,
                user: response.data.user,
                message: response.data.message
            };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Apple authentication failed'
            };
        }
    }

    // Profile management
    async getProfile() {
        try {
            const response = await this.api.get('/auth/profile/');
            return {
                success: true,
                user: response.data.user
            };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Failed to fetch profile'
            };
        }
    }

    async updateProfile(profileData) {
        try {
            const response = await this.api.put('/auth/profile/update/', profileData);
            
            // Update stored user data
            localStorage.setItem('user', JSON.stringify(response.data.user));
            
            return {
                success: true,
                user: response.data.user,
                message: response.data.message
            };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Profile update failed',
                errors: error.response?.data?.errors
            };
        }
    }

    // Two-factor authentication
    async enable2FA(method) {
        try {
            const response = await this.api.post('/auth/enable-2fa/', { method });
            return {
                success: true,
                message: response.data.message,
                method: response.data.method
            };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || '2FA enablement failed'
            };
        }
    }

    async verify2FASetup(token, method) {
        try {
            const response = await this.api.post('/auth/verify-2fa-setup/', {
                token,
                method
            });
            return {
                success: true,
                message: response.data.message
            };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || '2FA setup verification failed'
            };
        }
    }

    async disable2FA(password) {
        try {
            const response = await this.api.post('/auth/disable-2fa/', { password });
            return {
                success: true,
                message: response.data.message
            };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || '2FA disable failed'
            };
        }
    }

    // Session management
    async getSessions() {
        try {
            const response = await this.api.get('/auth/sessions/');
            return {
                success: true,
                sessions: response.data.sessions
            };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Failed to fetch sessions'
            };
        }
    }

    async terminateSession(sessionId) {
        try {
            const response = await this.api.post('/auth/sessions/terminate/', {
                session_id: sessionId
            });
            return {
                success: true,
                message: response.data.message
            };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Session termination failed'
            };
        }
    }

    // User management methods (for admins)
    async getAllUsers(params = {}) {
        try {
            const response = await this.api.get('/admin/users/', { params });
            return {
                success: true,
                data: response.data
            };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Failed to fetch users'
            };
        }
    }

    async getUserInfo(userId) {
        try {
            const response = await this.api.get(`/admin/users/${userId}/`);
            return {
                success: true,
                user: response.data.user,
                documents: response.data.documents,
                activities: response.data.recent_activities
            };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Failed to fetch user details'
            };
        }
    }

    async updateUserInfo(userId, userData) {
        try {
            const response = await this.api.put(`/admin/users/${userId}/update/`, userData);
            return {
                success: true,
                user: response.data.user,
                message: response.data.message
            };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'User update failed',
                errors: error.response?.data?.errors
            };
        }
    }

    async deleteUserInfo(userId) {
        try {
            const response = await this.api.delete(`/admin/users/${userId}/delete/`);
            return {
                success: true,
                message: response.data.message
            };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'User deletion failed'
            };
        }
    }

    async approveRejectUser(userId, action, reason = '') {
        try {
            const response = await this.api.post(`/admin/users/${userId}/approve/`, {
                action,
                reason
            });
            return {
                success: true,
                user: response.data.user,
                message: response.data.message
            };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'User approval/rejection failed'
            };
        }
    }

    // Document management
    async uploadDocument(formData) {
        try {
            const response = await this.api.post('/documents/upload/', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            return {
                success: true,
                document: response.data.document,
                message: response.data.message
            };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Document upload failed',
                errors: error.response?.data?.errors
            };
        }
    }

    async getUserDocuments() {
        try {
            const response = await this.api.get('/documents/my-documents/');
            return {
                success: true,
                documents: response.data.documents
            };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Failed to fetch documents'
            };
        }
    }

    async deleteDocument(documentId) {
        try {
            const response = await this.api.delete(`/documents/${documentId}/delete/`);
            return {
                success: true,
                message: response.data.message
            };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Document deletion failed'
            };
        }
    }

    async getDocumentRequirements(role) {
        try {
            const response = await this.api.get(`/documents/requirements/${role}/`);
            return {
                success: true,
                requirements: response.data.requirements
            };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Failed to fetch requirements'
            };
        }
    }

    // Admin dashboard
    async getDashboardStats() {
        try {
            const response = await this.api.get('/admin/dashboard/stats/');
            return {
                success: true,
                stats: response.data.stats
            };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Failed to fetch dashboard stats'
            };
        }
    }

    async getPendingDocuments(params = {}) {
        try {
            const response = await this.api.get('/admin/documents/pending/', { params });
            return {
                success: true,
                data: response.data
            };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Failed to fetch pending documents'
            };
        }
    }

    async reviewDocument(documentId, action, notes = '') {
        try {
            const response = await this.api.post(`/admin/documents/${documentId}/review/`, {
                action,
                notes
            });
            return {
                success: true,
                document: response.data.document,
                message: response.data.message
            };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Document review failed'
            };
        }
    }

    async exportUsers(filters = {}) {
        try {
            const response = await this.api.get('/admin/users/export/', {
                params: filters,
                responseType: 'blob'
            });
            
            // Create download link
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `users_export_${new Date().toISOString().slice(0, 10)}.csv`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            
            return {
                success: true,
                message: 'Export completed successfully'
            };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Export failed'
            };
        }
    }

    async sendBulkNotification(userIds, title, message, type = 'system_message') {
        try {
            const response = await this.api.post('/admin/notifications/bulk/', {
                user_ids: userIds,
                title,
                message,
                notification_type: type
            });
            return {
                success: true,
                message: response.data.message
            };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Bulk notification failed'
            };
        }
    }

    async getSystemHealth() {
        try {
            const response = await this.api.get('/admin/system/health/');
            return {
                success: true,
                health: response.data.health
            };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Failed to fetch system health'
            };
        }
    }

    async resetUserPassword(userId, newPassword) {
        try {
            const response = await this.api.post(`/admin/users/${userId}/reset-password/`, {
                new_password: newPassword
            });
            return {
                success: true,
                message: response.data.message
            };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Password reset failed',
                errors: error.response?.data?.errors
            };
        }
    }

    async impersonateUser(userId) {
        try {
            const response = await this.api.post(`/admin/users/${userId}/impersonate/`);
            
            // Store new tokens for impersonated user
            localStorage.setItem('access_token', response.data.access);
            localStorage.setItem('refresh_token', response.data.refresh);
            localStorage.setItem('user', JSON.stringify(response.data.user));
            localStorage.setItem('impersonating', 'true');
            
            return {
                success: true,
                user: response.data.user,
                message: response.data.message
            };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Impersonation failed'
            };
        }
    }

    // Utility methods
    isAuthenticated() {
        return !!localStorage.getItem('access_token');
    }

    getCurrentUser() {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    }

    hasRole(role) {
        const user = this.getCurrentUser();
        return user?.role === role;
    }

    hasPermission(permission) {
        const user = this.getCurrentUser();
        // This would need to be implemented based on your permission system
        return user?.permissions?.includes(permission) || false;
    }

    isAdmin() {
        return this.hasRole('admin');
    }

    isImpersonating() {
        return localStorage.getItem('impersonating') === 'true';
    }

    stopImpersonation() {
        localStorage.removeItem('impersonating');
        // You would need to implement logic to restore original admin session
    }

    // User creation method for admin
    async createUser(userData) {
        try {
            const response = await this.api.post('/admin/users/create/', userData);
            return {
                success: true,
                user: response.data.user,
                message: response.data.message
            };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'User creation failed',
                errors: error.response?.data?.errors
            };
        }
    }

    // Get user activities
    async getUserActivities(userId, params = {}) {
        try {
            const response = await this.api.get(`/admin/users/${userId}/activities/`, { params });
            return {
                success: true,
                data: response.data
            };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Failed to fetch user activities'
            };
        }
    }
}

// Create and export a singleton instance
const userService = new UserService();
export default userService;


// src/hooks/useAuth.js - React Hook for Authentication
import { useState, useEffect, useContext, createContext } from 'react';
import userService from '../services/UserService';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        initializeAuth();
    }, []);

    const initializeAuth = async () => {
        try {
            if (userService.isAuthenticated()) {
                const result = await userService.getProfile();
                if (result.success) {
                    setUser(result.user);
                    setIsAuthenticated(true);
                } else {
                    userService.clearTokens();
                }
            }
        } catch (error) {
            console.error('Auth initialization error:', error);
            userService.clearTokens();
        } finally {
            setLoading(false);
        }
    };

    const login = async (credentials) => {
        setLoading(true);
        try {
            const result = await userService.login(credentials);
            if (result.success && !result.requires2FA) {
                setUser(result.user);
                setIsAuthenticated(true);
            }
            return result;
        } catch (error) {
            console.error('Login error:', error);
            return { success: false, message: 'Login failed' };
        } finally {
            setLoading(false);
        }
    };

    const register = async (userData) => {
        setLoading(true);
        try {
            const result = await userService.register(userData);
            return result;
        } catch (error) {
            console.error('Registration error:', error);
            return { success: false, message: 'Registration failed' };
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        setLoading(true);
        try {
            await userService.logout();
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            setUser(null);
            setIsAuthenticated(false);
            setLoading(false);
        }
    };

    const updateProfile = async (profileData) => {
        try {
            const result = await userService.updateProfile(profileData);
            if (result.success) {
                setUser(result.user);
            }
            return result;
        } catch (error) {
            console.error('Profile update error:', error);
            return { success: false, message: 'Profile update failed' };
        }
    };

    const verify2FA = async (userId, token) => {
        setLoading(true);
        try {
            const result = await userService.verify2FA(userId, token);
            if (result.success) {
                setUser(result.user);
                setIsAuthenticated(true);
            }
            return result;
        } catch (error) {
            console.error('2FA verification error:', error);
            return { success: false, message: '2FA verification failed' };
        } finally {
            setLoading(false);
        }
    };

    const hasRole = (role) => {
        return user?.role === role;
    };

    const hasPermission = (permission) => {
        // Implement your permission logic here
        return user?.permissions?.includes(permission) || false;
    };

    const isAdmin = () => {
        return hasRole('admin');
    };

    const value = {
        user,
        loading,
        isAuthenticated,
        login,
        register,
        logout,
        updateProfile,
        verify2FA,
        hasRole,
        hasPermission,
        isAdmin,
        refreshProfile: initializeAuth
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};


// src/components/ProtectedRoute.jsx - Route Protection Component
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const ProtectedRoute = ({ 
    children, 
    requiredRole = null, 
    requiredPermission = null,
    redirectTo = '/login' 
}) => {
    const { isAuthenticated, user, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to={redirectTo} state={{ from: location }} replace />;
    }

    if (requiredRole && user?.role !== requiredRole) {
        return <Navigate to="/unauthorized" replace />;
    }

    if (requiredPermission && !user?.permissions?.includes(requiredPermission)) {
        return <Navigate to="/unauthorized" replace />;
    }

    return children;
};

export default ProtectedRoute;