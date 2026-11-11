import React, { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from 'axios'
import { useNavigate } from "react-router-dom";
export const AppContext = createContext();

const AppContextProvider = (props) => {
    const [user, setUser] = useState(() => {
        try {
            const stored = localStorage.getItem('user');
            return stored ? JSON.parse(stored) : null;
        } catch {
            return null;
        }
    });
    const [showLogin, setShowLogin] = useState(false);
    const [token, setToken] = useState(localStorage.getItem('token'))
    const [platformData, setPlatformData] = useState(null);

    const backendUrl = import.meta.env.VITE_BASE_URL

    const navigate = useNavigate()

    const isAuthenticated = !!token;

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setToken('');
        setUser(null);
        setPlatformData(null);
        navigate('/');
    }

    // Link platform username
    const linkPlatform = async (platform, username) => {
        try {
            const response = await axios.post(
                `${backendUrl}/api/platforms/link`,
                { platform, username },
                { headers: { Authorization: `Bearer ${token}` } }
            )
            
            if (response.data.success) {
                toast.success(response.data.message)
                return { 
                    success: true, 
                    verificationCode: response.data.verificationCode
                }
            } else {
                toast.error(response.data.message)
                return { success: false }
            }
        } catch (error) {
            const message = error.response?.data?.message || 'Failed to link platform'
            toast.error(message)
            return { success: false, message }
        }
    }

    // Verify platform ownership
    const verifyPlatform = async (platform) => {
        try {
            const response = await axios.post(
                `${backendUrl}/api/platforms/verify`,
                { platform },
                { headers: { Authorization: `Bearer ${token}` } }
            )
            
            if (response.data.success) {
                toast.success(response.data.message)
                return { success: true }
            } else {
                toast.error(response.data.message)
                return { success: false }
            }
        } catch (error) {
            const message = error.response?.data?.message || 'Failed to verify platform'
            toast.error(message)
            return { success: false, message }
        }
    }

    // Get user's platform status
    const getUserPlatforms = async () => {
        try {
            const response = await axios.get(
                `${backendUrl}/api/platforms/status`,
                { headers: { Authorization: `Bearer ${token}` } }
            )
            
            if (response.data.success) {
                return { success: true, platforms: response.data.platforms }
            } else {
                return { success: false }
            }
        } catch (error) {
            console.error('Failed to fetch user platforms:', error)
            return { success: false }
        }
    }

    // Delete platform connection
    const deletePlatform = async (platform) => {
        try {
            const response = await axios.post(
                `${backendUrl}/api/platforms/delete`,
                { platform },
                { headers: { Authorization: `Bearer ${token}` } }
            )
            
            if (response.data.success) {
                toast.success(response.data.message)
                return { success: true }
            } else {
                toast.error(response.data.message)
                return { success: false }
            }
        } catch (error) {
            const message = error.response?.data?.message || 'Failed to delete platform'
            toast.error(message)
            return { success: false, message }
        }
    }

    // Fetch all platforms data
    const fetchPlatformsData = async () => {
        try {
            if (!token) return { success: false };
            const response = await axios.get(
                `${backendUrl}/api/platforms/data`,
                { headers: { Authorization: `Bearer ${token}` } }
            )
            
            if (response.data.success) {
                setPlatformData(response.data.data);
                return { success: true, data: response.data.data, userPlatforms: response.data.userPlatforms }
            } else {
                toast.error(response.data.message)
                return { success: false }
            }
        } catch (error) {
            const message = error.response?.data?.message || 'Failed to fetch platform data'
            console.error('Failed to fetch platform data:', message);
            return { success: false, message }
        }
    }

    // Auto-fetch platforms data when token exists
    useEffect(() => {
        if (token) {
            fetchPlatformsData();
        }
    }, [token]);

    // Toggle platform public/private visibility
    const updatePlatformVisibility = async (platform, isPublic) => {
        try {
            const response = await axios.patch(
                `${backendUrl}/api/platforms/visibility`,
                { platform, isPublic },
                { headers: { Authorization: `Bearer ${token}` } }
            )
            if (response.data.success) {
                toast.success(response.data.message)
                return { success: true }
            } else {
                toast.error(response.data.message)
                return { success: false }
            }
        } catch (error) {
            const message = error.response?.data?.message || 'Failed to update visibility'
            toast.error(message)
            return { success: false, message }
        }
    }

    // Update user profile info
    const updateProfile = async (name, bio) => {
        try {
            const response = await axios.put(
                `${backendUrl}/api/user/profile`,
                { name, bio },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            if (response.data.success) {
                setUser(response.data.user);
                toast.success(response.data.message || 'Profile updated successfully');
                return { success: true, user: response.data.user };
            } else {
                toast.error(response.data.message || 'Failed to update profile');
                return { success: false, message: response.data.message };
            }
        } catch (error) {
            const message = error.response?.data?.message || 'Failed to update profile';
            toast.error(message);
            return { success: false, message };
        }
    };

    // Change user password
    const changePassword = async (currentPassword, newPassword) => {
        try {
            const response = await axios.put(
                `${backendUrl}/api/user/password`,
                { currentPassword, newPassword },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            if (response.data.success) {
                toast.success(response.data.message || 'Password changed successfully');
                return { success: true };
            } else {
                toast.error(response.data.message || 'Failed to change password');
                return { success: false, message: response.data.message };
            }
        } catch (error) {
            const message = error.response?.data?.message || 'Failed to change password';
            toast.error(message);
            return { success: false, message };
        }
    };

    // Update custom username with 30-day cooldown & uniqueness
    const updateUsername = async (username) => {
        try {
            const response = await axios.put(
                `${backendUrl}/api/user/username`,
                { username },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            if (response.data.success) {
                setUser(response.data.user);
                toast.success(response.data.message || 'Username updated successfully');
                return { success: true, user: response.data.user };
            } else {
                toast.error(response.data.message || 'Failed to update username');
                return { success: false, message: response.data.message };
            }
        } catch (error) {
            const message = error.response?.data?.message || 'Failed to update username';
            toast.error(message);
            return { success: false, message };
        }
    };

    // Toggle public / private profile visibility
    const updateVisibility = async (isProfilePublic) => {
        try {
            const response = await axios.put(
                `${backendUrl}/api/user/visibility`,
                { isProfilePublic },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            if (response.data.success) {
                setUser(response.data.user);
                toast.success(response.data.message || 'Visibility updated');
                return { success: true, user: response.data.user };
            } else {
                toast.error(response.data.message || 'Failed to update visibility');
                return { success: false, message: response.data.message };
            }
        } catch (error) {
            const message = error.response?.data?.message || 'Failed to update visibility';
            toast.error(message);
            return { success: false, message };
        }
    };

    // keep localStorage user in sync when setUser is called
    useEffect(() => {
        if (user) {
            localStorage.setItem('user', JSON.stringify(user));
        }
    }, [user]);

    const value = {
        user, setUser, showLogin, setShowLogin, backendUrl, token, setToken, logout, isAuthenticated,
        platformData, setPlatformData,
        linkPlatform, verifyPlatform, deletePlatform, getUserPlatforms, fetchPlatformsData,
        updatePlatformVisibility, updateProfile, changePassword, updateUsername, updateVisibility,
    };

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    );
};

export default AppContextProvider;