import React, {useContext, useEffect} from 'react'
import { Routes, Route, Navigate, useLocation} from 'react-router-dom'
import { ToastContainer, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AnimatePresence, motion } from 'framer-motion';

import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import Settings from './pages/Settings'
import PublicProfile from './pages/PublicProfile'
import Navbar from './components/Navbar'
import Login from './components/Login'
import { AppContext } from './context/AppContext'
import Footer from './components/Footer'
import AddPlatform from './pages/AddPlatform'
import NavigationLoader from './components/NavigationLoader'
import NotFound from './pages/NotFound'

const App = () => {
  const {showLogin, setShowLogin, isAuthenticated} = useContext(AppContext);
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  const isHomePage = pathname === '/';
  const isPublicProfile = pathname.startsWith('/u/') || pathname.startsWith('/profile/');
  const hassidebar = !isHomePage && !isPublicProfile;

  return (
    <>
    <AnimatePresence>
      {showLogin && <Login onClose={() => setShowLogin(false)} />}
    </AnimatePresence>
    <div className={`min-h-screen ${hassidebar || isPublicProfile ? 'bg-black' : 'bg-gradient-to-b from-teal-50 to-orange-50'}`}> 
    <ToastContainer
      position="bottom-right"
      autoClose={3000}
      hideProgressBar={true}
      newestOnTop={true}
      closeOnClick={true}
      pauseOnHover={false}
      pauseOnFocusLoss={false}
      draggable={false}
      closeButton={false}
      theme="dark"
      transition={Slide}
      icon={({ type }) => {
        if (type === 'error') {
          return (
            <svg className="w-3.5 h-3.5 text-rose-400 mt-0.5 flex-shrink-0" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
              <path d="M3 3l10 10M13 3L3 13" />
            </svg>
          );
        }
        if (type === 'success') {
          return (
            <svg className="w-3.5 h-3.5 text-emerald-400 mt-0.5 flex-shrink-0" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
              <path d="M2.5 8.5l3.5 3.5 7.5-8" />
            </svg>
          );
        }
        if (type === 'warning') {
          return (
            <svg className="w-3.5 h-3.5 text-amber-400 mt-0.5 flex-shrink-0" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
              <path d="M8 3v6M8 12.5h.01" />
            </svg>
          );
        }
        return (
          <svg className="w-3.5 h-3.5 text-blue-400 mt-0.5 flex-shrink-0" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
            <path d="M8 7v5M8 4h.01" />
          </svg>
        );
      }}
      style={{ zIndex: 99999 }}
    />
    {/* Global top progress & navigation loader */}
    <NavigationLoader />

    {isHomePage && <Navbar />}
      <motion.div
        key={pathname}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.22, ease: 'easeOut' }}
      >
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/dashboard' element={isAuthenticated ? <Dashboard /> : <Navigate to="/" replace />} />
          <Route path='/addPlatform' element={isAuthenticated ? <AddPlatform /> : <Navigate to="/" replace />} />
          <Route path='/settings' element={isAuthenticated ? <Settings /> : <Navigate to="/" replace />} />
          <Route path='/u/:username' element={<PublicProfile />} />
          <Route path='/profile/:username' element={<PublicProfile />} />
          <Route path='*' element={<NotFound />} />
        </Routes>
      </motion.div>
      {!isPublicProfile && <Footer />}
    </div>
    </>
  )
}

export default App
