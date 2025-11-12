import React, {useContext, useEffect} from 'react'
import { Routes, Route, Navigate, useLocation} from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify';

import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import Navbar from './components/Navbar'
import Login from './components/Login'
import { AppContext } from './context/AppContext'
import Footer from './components/Footer'

const App = () => {
  const {showLogin, isAuthenticated} = useContext(AppContext);
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  const isDashboard = pathname === '/dashboard';

  return (
    <>
    {showLogin && <Login />}
    <div className={`min-h-screen ${isDashboard ? 'bg-black' : 'bg-gradient-to-b from-teal-50 to-orange-50'}`}> 
    <ToastContainer position='bottom-right'/>
    {!isDashboard && <Navbar />}
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/dashboard' element={isAuthenticated ? <Dashboard /> : <Navigate to="/" replace />} /> 
      </Routes>
      {!isDashboard && <Footer />}
    </div>
    </>
  )
}

export default App
