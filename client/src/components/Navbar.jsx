import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useContext } from "react";
import { AppContext } from "../context/AppContext";
import Login from './Login.jsx';
import { User, Plus } from 'lucide-react';

const Navbar = () => {
  const { showLogin, setShowLogin, isAuthenticated, user } = useContext(AppContext);
  const navigate = useNavigate();
  const location = useLocation();

  const hasToken = typeof window !== 'undefined' && !!localStorage.getItem('token');
  const isDashboard = location.pathname === '/dashboard';

  const handleAuthClick = () => {
    if (hasToken && isAuthenticated) {
      navigate('/dashboard');
    } else {
      setShowLogin(true);
    }
  };

  return (
    <>
      <nav id="nav-bar" className="fixed top-0 left-0 right-0 z-50 px-4 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Dashboard Profile Section */}
          {isDashboard && (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-bold border-2 border-white/20">
                <User className="w-6 h-6" />
              </div>
              <span className="text-white font-semibold text-lg">Dashboard</span>
            </div>
          )}
          
          {/* Slide Tabs Navigation */}
          <div className={isDashboard ? '' : 'flex-1 flex justify-center'}>
            <SlideTabs 
              onAuthClick={handleAuthClick} 
              authLabel={hasToken ? 'DASHBOARD' : 'LOGIN'} 
              isDashboard={isDashboard}
            />
          </div>
          
          {/* Add Badge Button (Dashboard only) */}
          {isDashboard && (
            <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-full font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/50">
              <Plus className="w-5 h-5" />
              <span>Add Badge</span>
            </button>
          )}
        </div>
      </nav>
      {showLogin && <Login onClose={() => setShowLogin(false)} />}
    </>
  );
};

const SlideTabs = ({ onAuthClick, authLabel, isDashboard }) => {
  const [position, setPosition] = useState({
    left: 0,
    width: 0,
    opacity: 0,
  });

  return (
    <ul
      onMouseLeave={() => {
        setPosition((pv) => ({
          ...pv,
          opacity: 0,
        }));
      }}
      className="relative mx-auto flex w-fit rounded-full border-2 border-white/20 bg-white/10 backdrop-blur-sm p-1"
    >
      {isDashboard ? (
        <>
          <Tab setPosition={setPosition} to="/dashboard">HOME</Tab>
          <Tab setPosition={setPosition} to="/dashboard#features">Features</Tab>
          <Tab setPosition={setPosition} to="/dashboard#profile">Profile Settings</Tab>
        </>
      ) : (
        <>
          <Tab setPosition={setPosition} to="/#home">Home</Tab>
          <Tab setPosition={setPosition} to="/#features">Features</Tab>
          <Tab setPosition={setPosition} to="/#contact">Contact Us</Tab>
          <Tab setPosition={setPosition} onClick={onAuthClick}>{authLabel}</Tab>
        </>
      )}

      <Cursor position={position} />
    </ul>
  );
};

const Tab = ({ children, setPosition, to, onClick }) => {
  const ref = useRef(null);

  return (
    <li
      ref={ref}
      onMouseEnter={() => {
        if (!ref?.current) return;

        const { width } = ref.current.getBoundingClientRect();

        setPosition({
          left: ref.current.offsetLeft,
          width,
          opacity: 1,
        });
      }}
      className="relative z-10 block cursor-pointer px-3 py-1.5 text-xs uppercase text-white mix-blend-difference md:px-5 md:py-3 md:text-base"
    >
      {to ? (
        <Link to={to} className="block w-full h-full">
          {children}
        </Link>
      ) : (
        <button type="button" onClick={onClick} className="block w-full h-full">
          {children}
        </button>
      )}
    </li>
  );
};

const Cursor = ({ position }) => {
  return (
    <motion.li
      animate={{
        ...position,
      }}
      className="absolute z-0 h-7 rounded-full bg-white/20 md:h-12"
    />
  );
};

export default Navbar;