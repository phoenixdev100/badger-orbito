import React, {useContext, useEffect} from 'react'
import { Routes, Route, Navigate, useLocation} from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify';

import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import Navbar from './components/Navbar'
import Login from './components/Login'
import { AppContext } from './context/AppContext'
import Footer from './components/Footer'
import AddPlatform from './pages/AddPlatform'

const App = () => {
  const {showLogin, isAuthenticated} = useContext(AppContext);
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  const isHomePage = pathname === '/';
  const isDashboard = pathname === '/dashboard';
  const hassidebar = !isHomePage;

  return (
    <>
    {showLogin && <Login />}
    <div className={`min-h-screen ${hassidebar ? 'bg-black' : 'bg-gradient-to-b from-teal-50 to-orange-50'}`}> 
    <ToastContainer position='bottom-right'/>
    {isHomePage && <Navbar />}
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/dashboard' element={isAuthenticated ? <Dashboard /> : <Navigate to="/" replace />} />
        <Route path='/addPlatform' element={isAuthenticated ? <AddPlatform /> : <Navigate to="/" replace />} />
      </Routes>
      <Footer />
    </div>
    </>
  )
}

export default App
