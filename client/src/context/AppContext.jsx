import React, { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from 'axios'
import { useNavigate } from "react-router-dom";
export const AppContext = createContext();

const AppContextProvider = (props) => {
    const [user, setUser] = useState(null);
    const [showLogin, setShowLogin] = useState(false);
    const [token, setToken] = useState(localStorage.getItem('token'))


    const backendUrl = import.meta.env.VITE_BASE_URL

    const navigate = useNavigate()

    const isAuthenticated = !!token;


    const logout = () => {
        localStorage.removeItem('token')
        setToken('')
        setUser(null)
        navigate('/')


    }

    useEffect(() => {
        if (token) {
        }
    }, [token])

    const value = {
        user, setUser, showLogin, setShowLogin, backendUrl, token, setToken, logout, isAuthenticated
    }

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    );
};

export default AppContextProvider;