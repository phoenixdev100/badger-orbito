import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Loader from './Loader';

const IconUser = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4.5 20.25a8.25 8.25 0 1 1 15 0v.75H4.5v-.75Z" />
  </svg>
);

const IconMail = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 8.25l8.25 5.5a1.5 1.5 0 0 0 1.5 0L21 8.25M4.5 6h15A1.5 1.5 0 0 1 21 7.5v9A1.5 1.5 0 0 1 19.5 18h-15A1.5 1.5 0 0 1 3 16.5v-9A1.5 1.5 0 0 1 4.5 6Z" />
  </svg>
);

const IconLock = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16.5 10.5V7.5a4.5 4.5 0 1 0-9 0v3M6.75 10.5h10.5A1.75 1.75 0 0 1 19 12.25v6A1.75 1.75 0 0 1 17.25 20H6.75A1.75 1.75 0 0 1 5 18.25v-6A1.75 1.75 0 0 1 6.75 10.5Z" />
  </svg>
);

// Simple Google "G" icon (multi-color)
const IconGoogle = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="w-5 h-5">
    <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303C33.826 31.91 29.277 35 24 35c-7.18 0-13-5.82-13-13s5.82-13 13-13c3.313 0 6.318 1.234 8.606 3.262l5.657-5.657C34.676 3.053 29.566 1 24 1 11.85 1 2 10.85 2 23s9.85 22 22 22 22-9.85 22-22c0-1.341-.138-2.651-.389-3.917z"/>
    <path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.69 15.108 18.994 12 24 12c3.313 0 6.318 1.234 8.606 3.262l5.657-5.657C34.676 3.053 29.566 1 24 1 15.317 1 7.844 5.54 3.69 12.327l2.616 2.364z"/>
    <path fill="#4CAF50" d="M24 45c5.163 0 9.86-1.977 13.413-5.197l-6.197-5.238C29.054 36.741 26.66 37.6 24 37.6c-5.243 0-9.7-3.343-11.301-8.001l-6.49 5.005C9.315 41.648 16.106 45 24 45z"/>
    <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303c-1.037 3.095-3.23 5.583-5.89 7.014l.001-.001 6.197 5.238C38.052 38.337 42 31 42 23c0-1.341-.138-2.651-.389-3.917z"/>
  </svg>
);

const Login = ({ onClose }) => {
  const [state, setState] = useState('Login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call - replace with real auth later
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    console.log(`[${state}]`, { name, email, password });
    setIsLoading(false);
    onClose?.();
  };

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    const navbar = document.getElementById('nav-bar');
    if (navbar) navbar.style.opacity = 0.05;
    return () => {
      document.body.style.overflow = 'unset';
      if (navbar) navbar.style.opacity = 1;
    };
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 bottom-0 z-[9999] backdrop-blur-sm bg-black/30 flex justify-center items-center">
      {isLoading ? (
        <div className="flex justify-center items-center">
          <Loader />
        </div>
      ) : (
        <motion.form
          onSubmit={onSubmitHandler}
          initial={{ opacity: 0.2, y: 50 }}
          transition={{ duration: 0.3 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative bg-black p-10 rounded-xl text-white shadow-xl w-[90%] max-w-md"
        >
        <h1 className="text-center text-2xl text-white font-medium">{state}</h1>
        <p className="text-sm text-center">Welcome back! Please sign in to continue</p>

        {state !== 'Login' && (
          <div className="border px-6 py-2 flex items-center gap-2 rounded-full mt-5">
            <IconUser />
            <input
              onChange={(e) => setName(e.target.value)}
              value={name}
              type="text"
              className="outline-none text-sm flex-1 bg-transparent"
              placeholder="Full Name"
              required
            />
          </div>
        )}

        <div className="border px-6 py-2 flex items-center gap-2 rounded-full mt-4">
          <IconMail />
          <input
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            type="email"
            className="outline-none text-sm flex-1 bg-transparent"
            placeholder="Email id"
            required
          />
        </div>

        <div className="border px-6 py-2 flex items-center gap-2 rounded-full mt-4">
          <IconLock />
          <input
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            type="password"
            className="outline-none text-sm flex-1 bg-transparent"
            placeholder="Password"
            required
          />
        </div>

        <p className="text-sm text-blue-600 my-4 cursor-pointer">Forgot password?</p>

        <button type="submit" className="bg-blue-600 w-full text-white py-2 rounded-full">
          {state === 'Login' ? 'Login' : 'Create Account'}
        </button>

        <button
          type="button"
          className="mt-3 w-full border border-white/30 text-white py-2 rounded-full flex items-center justify-center gap-2 hover:bg-white/10"
          aria-label="Continue with Google"
        >
          <IconGoogle />
          <span>Continue with Google</span>
        </button>

        {state === 'Login' ? (
          <p className="mt-5 text-center">
            Don't have an account?{' '}
            <span className="text-blue-600 cursor-pointer" onClick={() => setState('Sign Up')}>
              Sign Up
            </span>
          </p>
        ) : (
          <p className="mt-5 text-center">
            Already have an account?{' '}
            <span className="text-blue-600 cursor-pointer" onClick={() => setState('Login')}>
              Login
            </span>
          </p>
        )}

        <button
          type="button"
          onClick={() => onClose?.()}
          className="absolute top-5 right-5 cursor-pointer text-slate-500 hover:text-slate-700"
          aria-label="Close"
          title="Close"
        >
          ✕
        </button>
      </motion.form>
      )}
    </div>
  );
};

export default Login;
