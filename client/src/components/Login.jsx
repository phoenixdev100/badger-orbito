import React, { useContext, useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion';
import Loader from './Loader';
import axios from 'axios'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'

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
  const { setShowLogin, backendUrl, setToken, setUser } = useContext(AppContext);
  const [state, setState] = useState('Login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [twoFATemp, setTwoFATemp] = useState(null);
  const [twoFACode, setTwoFACode] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const submitBtnRef = useRef(null);
  const lastRenderedWidthRef = useRef(0);
  const lastRenderedStateRef = useRef('');

  // Calculate the exact width matching the submit button (never wider)
  const getExactButtonWidth = () => {
    if (submitBtnRef.current) {
      const w = Math.floor(submitBtnRef.current.offsetWidth);
      if (w >= 200 && w <= 400) return w;
    }
    const btn = document.getElementById('google-login-button');
    if (btn) {
      const w = Math.floor(btn.offsetWidth);
      if (w >= 200 && w <= 400) return w;
    }
    return 326; // Exact content width of max-w-[390px] modal on sm:px-8 screens (390 - 64 = 326)
  };

  const renderGoogleButton = () => {
    if (window.google?.accounts?.id) {
      const btn = document.getElementById('google-login-button');
      if (btn) {
        const targetWidth = getExactButtonWidth();

        // Avoid unnecessary re-rendering if dimensions and state are already identical
        if (
          lastRenderedWidthRef.current === targetWidth &&
          lastRenderedStateRef.current === state &&
          btn.children.length > 0
        ) {
          return;
        }

        lastRenderedWidthRef.current = targetWidth;
        lastRenderedStateRef.current = state;

        btn.innerHTML = '';
        window.google.accounts.id.renderButton(btn, {
          theme: 'outline',
          size: 'large',
          shape: 'pill',
          width: targetWidth,
          text: state === 'Login' ? 'signin_with' : 'signup_with',
          logo_alignment: 'left',
        });
      }
    }
  };
  const handleCredentialLogin = (response) => {
    console.log('GIS response:', response);

    if (response?.credential) {
      // Store token under "user" key as requested and also keep existing token behavior
      localStorage.setItem(
        'user',
        JSON.stringify({ isLogin: true, token: response.credential })
      );

      // Optionally, you could exchange this token with your backend here.
      // For now, just close modal and redirect to dashboard.
      setShowLogin(false);
      onClose?.();
      toast.success('Welcome to Orbito!');
      navigate('/dashboard');
    }
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {

      if (twoFATemp) {
        const { data } = await axios.post(backendUrl + '/api/user/2fa/verify-login', {
          tempToken: twoFATemp,
          code: twoFACode,
        });
        if (data.success) {
          setToken(data.token)
          setUser(data.user)
          localStorage.setItem('token', data.token)
          setTwoFATemp(null);
          setTwoFACode('');
          setShowLogin(false)
          onClose?.();
          toast.success(`Welcome back, ${data.user?.name || 'Developer'}!`);
          navigate('/dashboard')
        } else {
          toast.error(data.message)
        }
        return;
      }

      if (state === 'Login') {
        const { data } = await axios.post(backendUrl + '/api/user/login', { email, password })

        if (data.success) {
          if (data.requires2FA) {
            setTwoFATemp(data.tempToken);
            setTwoFACode('');
            setIsLoading(false);
            return;
          }
          setToken(data.token)
          setUser(data.user)
          localStorage.setItem('token', data.token)
          window.scrollTo({ top: 0, behavior: 'smooth' });
          setShowLogin(false)
          onClose?.();
          toast.success(`Welcome back, ${data.user?.name || 'Developer'}!`);
          navigate('/dashboard')
        } else {
          toast.error(data.message)
        }

      } else {
        const { data } = await axios.post(backendUrl + '/api/user/register', { name, email, password })

        if (data.success) {
          setToken(data.token)
          setUser(data.user)
          localStorage.setItem('token', data.token)
          setShowLogin(false)
          onClose?.();
          toast.success(`Welcome to Orbito, ${data.user?.name || 'Developer'}!`);
          navigate('/dashboard')
        } else {
          toast.error(data.message)
        }

      }

    } catch (error) {
      toast.error(error.message)
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    const navbar = document.getElementById('nav-bar');
    if (navbar) navbar.style.opacity = 0.05;

    const initGsi = () => {
      if (window.google?.accounts?.id) {
        window.google.accounts.id.initialize({
          client_id: '517052691762-j2j6ukfg3oobksvfobj7sh4u18fi5vin.apps.googleusercontent.com',
          callback: handleCredentialLogin,
        });
        renderGoogleButton();
      }
    };

    if (window.google?.accounts?.id) {
      initGsi();
    } else {
      const timer = setInterval(() => {
        if (window.google?.accounts?.id) {
          clearInterval(timer);
          initGsi();
        }
      }, 100);
      return () => {
        clearInterval(timer);
        document.body.style.overflow = 'unset';
        if (navbar) navbar.style.opacity = 1;
      };
    }

    return () => {
      document.body.style.overflow = 'unset';
      if (navbar) navbar.style.opacity = 1;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- GSI init is intentionally mount-only
  }, []);

  // Re-render Google button dynamically whenever switching between Login & Sign Up
  useEffect(() => {
    const t = setTimeout(renderGoogleButton, 50);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- re-render only on auth mode change
  }, [state]);

  // Keep Google button width strictly equal to the submit button at all times
  useEffect(() => {
    const submitEl = submitBtnRef.current;
    if (!submitEl) return;

    let timeoutId;
    const observer = new ResizeObserver(() => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        renderGoogleButton();
      }, 30);
    });

    observer.observe(submitEl);
    return () => {
      clearTimeout(timeoutId);
      observer.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- observer setup is intentionally mount-only
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="fixed inset-0 z-[9999] backdrop-blur-md bg-black/70 flex justify-center items-center px-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          setShowLogin(false);
          onClose?.();
        }
      }}
    >
      <motion.form
        layout
        onSubmit={onSubmitHandler}
        initial={{ opacity: 0, scale: 0.94, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 15 }}
        transition={{ type: "spring", duration: 0.35, bounce: 0.12 }}
        className="relative bg-zinc-950/95 border border-white/15 px-6 py-7 sm:px-8 sm:py-8 rounded-2xl text-white shadow-2xl shadow-indigo-950/40 w-full max-w-[390px] backdrop-blur-xl"
      >
        <button
          type="button"
          onClick={() => {
            setShowLogin(false);
            onClose?.();
          }}
          className="absolute top-4 right-4 w-7 h-7 rounded-full flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer text-sm"
          aria-label="Close"
          title="Close"
        >
          ✕
        </button>

        <AnimatePresence mode="wait">
          <motion.div
            key={state}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18 }}
            className="text-center mb-5"
          >
            <h1 className="text-2xl sm:text-[26px] font-semibold text-white tracking-tight">
              {state === 'Login' ? 'Welcome Back' : 'Create an Account'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              {state === 'Login'
                ? 'Sign in to access your unified developer achievements'
                : 'Join Orbito and verify your coding badges effortlessly'}
            </p>
          </motion.div>
        </AnimatePresence>

        <AnimatePresence initial={false}>
          {state !== 'Login' && (
            <motion.div
              key="name-field"
              initial={{ opacity: 0, height: 0, marginBottom: 0 }}
              animate={{ opacity: 1, height: 'auto', marginBottom: 12 }}
              exit={{ opacity: 0, height: 0, marginBottom: 0 }}
              transition={{ duration: 0.22, ease: 'easeInOut' }}
              className="overflow-hidden"
            >
              <div className="border border-white/20 focus-within:border-cyan-400 bg-white/5 focus-within:bg-white/10 px-4 py-2 flex items-center gap-2.5 rounded-full transition-colors">
                <span className="text-slate-400">
                  <IconUser />
                </span>
                <input
                  onChange={(e) => setName(e.target.value)}
                  value={name}
                  type="text"
                  className="outline-none text-sm flex-1 bg-transparent text-white placeholder-slate-400"
                  placeholder="Full Name"
                  required={state !== 'Login'}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {twoFATemp ? (
          <div className="space-y-3">
            <p className="text-xs text-slate-400 text-center">
              Two-factor authentication is enabled. Enter the 6-digit code from your authenticator app.
            </p>
            <div className="border border-white/20 focus-within:border-cyan-400 bg-white/5 focus-within:bg-white/10 px-4 py-2 flex items-center gap-2.5 rounded-full transition-colors">
              <span className="text-slate-400"><IconLock /></span>
              <input
                onChange={(e) => setTwoFACode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                value={twoFACode}
                type="text"
                inputMode="numeric"
                className="outline-none text-sm flex-1 bg-transparent text-white placeholder-slate-400 text-center tracking-[0.5em] font-mono"
                placeholder="000000"
                required
              />
            </div>
            <button
              type="button"
              onClick={() => { setTwoFATemp(null); setTwoFACode(''); }}
              className="w-full text-xs text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              ← Back to login
            </button>
          </div>
        ) : (
        <div className="space-y-3">
          <div className="border border-white/20 focus-within:border-cyan-400 bg-white/5 focus-within:bg-white/10 px-4 py-2 flex items-center gap-2.5 rounded-full transition-colors">
            <span className="text-slate-400">
              <IconMail />
            </span>
            <input
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              type="email"
              className="outline-none text-sm flex-1 bg-transparent text-white placeholder-slate-400"
              placeholder="Email Address"
              required
            />
          </div>

          <div className="border border-white/20 focus-within:border-cyan-400 bg-white/5 focus-within:bg-white/10 px-4 py-2 flex items-center gap-2.5 rounded-full transition-colors">
            <span className="text-slate-400">
              <IconLock />
            </span>
            <input
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              type="password"
              className="outline-none text-sm flex-1 bg-transparent text-white placeholder-slate-400"
              placeholder="Password"
              required
            />
          </div>
        </div>
        )}

        <div className="flex justify-end my-2.5">
          <button
            type="button"
            onClick={() => toast.info('Password recovery link sent if email exists.')}
            className="text-xs text-cyan-400 hover:text-cyan-300 hover:underline font-medium transition-colors cursor-pointer"
          >
            Forgot password?
          </button>
        </div>

        {/* ── Submit button with full width & proportional height ── */}
        <motion.button
          ref={submitBtnRef}
          type="submit"
          disabled={isLoading}
          whileHover={isLoading ? {} : { scale: 1.015 }}
          whileTap={isLoading ? {} : { scale: 0.985 }}
          className="relative w-full h-10 rounded-full font-semibold text-sm text-white shadow-md overflow-hidden flex items-center justify-center gap-2 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
          style={{
            background: 'linear-gradient(135deg, #0284c7 0%, #6366f1 50%, #d946ef 100%)',
            boxShadow: '0 4px 16px rgba(99, 102, 241, 0.4)',
          }}
        >
          {isLoading ? (
            <>
              <span className="inline-block w-3.5 h-3.5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
              <span>{state === 'Login' ? 'Signing in…' : 'Creating account…'}</span>
            </>
          ) : (
            <span className="tracking-wide">{state === 'Login' ? 'Login' : 'Create Account'}</span>
          )}
        </motion.button>

        {/* Google Identity Services button container (exact width matching submit button) */}
        <div className="mt-3.5 w-full flex justify-center">
          <div
            id="google-login-button"
            className="w-full flex justify-center min-h-[40px] overflow-hidden"
          />
        </div>

        <div className="mt-4 text-center text-xs sm:text-sm text-slate-300">
          {state === 'Login' ? (
            <p>
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => setState('Sign Up')}
                className="text-cyan-400 hover:text-cyan-300 font-semibold hover:underline cursor-pointer transition-colors ml-1"
              >
                Sign Up
              </button>
            </p>
          ) : (
            <p>
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => setState('Login')}
                className="text-cyan-400 hover:text-cyan-300 font-semibold hover:underline cursor-pointer transition-colors ml-1"
              >
                Login
              </button>
            </p>
          )}
        </div>
      </motion.form>
    </motion.div>
  );
};

export default Login;
