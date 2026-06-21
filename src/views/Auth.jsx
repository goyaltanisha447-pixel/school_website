import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Mail, Lock, User, Phone, CheckCircle, AlertTriangle, Eye, EyeOff } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useCartStore } from '../store/cartStore';
import { useToastStore } from '../store/toastStore';

// Validation Schemas
const loginSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }),
  password: z.string().min(5, { message: 'Password must be at least 5 characters' }),
});

const registerSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  email: z.string().email({ message: 'Please enter a valid email address' }),
  phone: z.string().regex(/^[0-9]{10}$/, { message: 'Phone must be a valid 10-digit number' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
});

const forgotPasswordSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }),
});

export default function Auth() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login, register, isAuthenticated } = useAuthStore();
  const { syncCart } = useCartStore();
  const { addToast } = useToastStore();

  const [mode, setMode] = useState('login'); // login | register | forgot
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState('');
  const [authSuccess, setAuthSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirection handling
  const redirect = searchParams.get('redirect') || '';

  useEffect(() => {
    if (isAuthenticated) {
      navigate(redirect ? `/${redirect}` : '/');
    }
  }, [isAuthenticated, navigate, redirect]);

  // Form hooks
  const {
    register: loginRegister,
    handleSubmit: handleLoginSubmit,
    formState: { errors: loginErrors },
    reset: resetLoginForm,
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const {
    register: regRegister,
    handleSubmit: handleRegSubmit,
    formState: { errors: regErrors },
    reset: resetRegForm,
  } = useForm({
    resolver: zodResolver(registerSchema),
  });

  const {
    register: forgotRegister,
    handleSubmit: handleForgotSubmit,
    formState: { errors: forgotErrors },
    reset: resetForgotForm,
  } = useForm({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onLogin = async (data) => {
    setIsSubmitting(true);
    setAuthError('');
    try {
      await login(data.email, data.password);
      await syncCart(); // sync local cart with database
      addToast('Login successful!', 'success');
      navigate(redirect ? `/${redirect}` : '/');
    } catch (err) {
      setAuthError(err.message || 'Invalid email or password');
      addToast('Login failed', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const onRegister = async (data) => {
    setIsSubmitting(true);
    setAuthError('');
    try {
      await register(data.name, data.email, data.phone, data.password);
      await syncCart();
      addToast('Account created successfully!', 'success');
      navigate(redirect ? `/${redirect}` : '/');
    } catch (err) {
      setAuthError(err.message || 'Email already exists');
      addToast('Registration failed', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const onForgot = async (data) => {
    setIsSubmitting(true);
    setAuthError('');
    setAuthSuccess('');
    try {
      // Mock API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setAuthSuccess(`Password reset instructions sent to ${data.email}`);
      addToast('Reset instructions sent', 'success');
      resetForgotForm();
    } catch (err) {
      setAuthError('Failed to send reset instructions');
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleMode = (newMode) => {
    setAuthError('');
    setAuthSuccess('');
    setMode(newMode);
    resetLoginForm();
    resetRegForm();
    resetForgotForm();
  };

  // Shake animation helper for form errors
  const shakeVariants = {
    shake: {
      x: [0, -10, 10, -10, 10, -5, 5, 0],
      transition: { duration: 0.4 },
    },
  };

  return (
    <div className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-50 relative overflow-hidden">
      {/* Mesh gradients for aesthetics */}
      <div className="absolute top-10 left-10 w-72 h-72 bg-blue-500/5 rounded-full blur-[80px] z-0" />
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-teal-500/5 rounded-full blur-[80px] z-0" />

      <div className="max-w-md w-full bg-white p-8 border border-slate-100 rounded-3xl shadow-xl z-10 space-y-6">
        
        {/* Toggle selectors */}
        <div className="flex border-b border-slate-100 pb-3">
          <button
            onClick={() => toggleMode('login')}
            className={`w-1/2 text-center pb-2 text-sm font-bold transition-all ${
              mode === 'login' ? 'text-[#0A2A6B] border-b-2 border-brand-blue' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => toggleMode('register')}
            className={`w-1/2 text-center pb-2 text-sm font-bold transition-all ${
              mode === 'register' ? 'text-[#0A2A6B] border-b-2 border-brand-blue' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Global Error Notice */}
        {authError && (
          <motion.div
            variants={shakeVariants}
            animate="shake"
            className="bg-rose-50 border border-rose-200 text-rose-800 p-4 rounded-xl text-xs font-semibold flex gap-2 items-center"
          >
            <AlertTriangle className="h-4 w-4 text-rose-500 flex-shrink-0" />
            <span>{authError}</span>
          </motion.div>
        )}

        {/* Global Success Notice */}
        {authSuccess && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-xl text-xs font-semibold flex gap-2 items-center">
            <CheckCircle className="h-4 w-4 text-emerald-500 flex-shrink-0" />
            <span>{authSuccess}</span>
          </div>
        )}

        <AnimatePresence mode="wait">
          {/* ==========================================
              LOGIN FORM
             ========================================== */}
          {mode === 'login' && (
            <motion.form
              key="login"
              onSubmit={handleLoginSubmit(onLogin)}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.2 }}
              className="space-y-4"
            >
              <div>
                <label className="text-xs font-bold text-slate-500 block mb-1">Email Address</label>
                <div className="relative">
                  <input
                    type="email"
                    placeholder="name@company.com"
                    {...loginRegister('email')}
                    className={`w-full text-sm border p-3 pl-10 rounded-xl bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 transition-all ${
                      loginErrors.email ? 'border-rose-300 focus:ring-rose-500/10' : 'border-slate-200 focus:ring-blue-500/10 focus:border-blue-500'
                    }`}
                  />
                  <Mail className="absolute left-3 top-3.5 h-4.5 w-4.5 text-slate-400" />
                </div>
                {loginErrors.email && (
                  <p className="text-[10px] text-rose-500 font-semibold mt-1">{loginErrors.email.message}</p>
                )}
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-bold text-slate-500">Password</label>
                  <button
                    type="button"
                    onClick={() => toggleMode('forgot')}
                    className="text-xs font-bold text-blue-500 hover:text-blue-700"
                  >
                    Forgot?
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter password"
                    {...loginRegister('password')}
                    className={`w-full text-sm border p-3 pl-10 pr-10 rounded-xl bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 transition-all ${
                      loginErrors.password ? 'border-rose-300 focus:ring-rose-500/10' : 'border-slate-200 focus:ring-blue-500/10 focus:border-blue-500'
                    }`}
                  />
                  <Lock className="absolute left-3 top-3.5 h-4.5 w-4.5 text-slate-400" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3.5 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
                  </button>
                </div>
                {loginErrors.password && (
                  <p className="text-[10px] text-rose-500 font-semibold mt-1">{loginErrors.password.message}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#0A2A6B] hover:bg-blue-800 text-white py-3.5 rounded-xl font-bold transition-all shadow-md flex items-center justify-center gap-2 active:scale-[0.99] disabled:opacity-50 mt-6"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span>Signing In...</span>
                  </>
                ) : (
                  <span>Sign In</span>
                )}
              </button>
            </motion.form>
          )}

          {/* ==========================================
              REGISTER FORM
             ========================================== */}
          {mode === 'register' && (
            <motion.form
              key="register"
              onSubmit={handleRegSubmit(onRegister)}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-4"
            >
              <div>
                <label className="text-xs font-bold text-slate-500 block mb-1">Company / Full Name</label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Enter name"
                    {...regRegister('name')}
                    className={`w-full text-sm border p-3 pl-10 rounded-xl bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 transition-all ${
                      regErrors.name ? 'border-rose-300 focus:ring-rose-500/10' : 'border-slate-200 focus:ring-blue-500/10 focus:border-blue-500'
                    }`}
                  />
                  <User className="absolute left-3 top-3.5 h-4.5 w-4.5 text-slate-400" />
                </div>
                {regErrors.name && (
                  <p className="text-[10px] text-rose-500 font-semibold mt-1">{regErrors.name.message}</p>
                )}
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500 block mb-1">Email Address</label>
                <div className="relative">
                  <input
                    type="email"
                    placeholder="name@company.com"
                    {...regRegister('email')}
                    className={`w-full text-sm border p-3 pl-10 rounded-xl bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 transition-all ${
                      regErrors.email ? 'border-rose-300 focus:ring-rose-500/10' : 'border-slate-200 focus:ring-blue-500/10 focus:border-blue-500'
                    }`}
                  />
                  <Mail className="absolute left-3 top-3.5 h-4.5 w-4.5 text-slate-400" />
                </div>
                {regErrors.email && (
                  <p className="text-[10px] text-rose-500 font-semibold mt-1">{regErrors.email.message}</p>
                )}
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500 block mb-1">Phone Number</label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="10-digit number"
                    {...regRegister('phone')}
                    className={`w-full text-sm border p-3 pl-10 rounded-xl bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 transition-all ${
                      regErrors.phone ? 'border-rose-300 focus:ring-rose-500/10' : 'border-slate-200 focus:ring-blue-500/10 focus:border-blue-500'
                    }`}
                  />
                  <Phone className="absolute left-3 top-3.5 h-4.5 w-4.5 text-slate-400" />
                </div>
                {regErrors.phone && (
                  <p className="text-[10px] text-rose-500 font-semibold mt-1">{regErrors.phone.message}</p>
                )}
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500 block mb-1">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Choose password"
                    {...regRegister('password')}
                    className={`w-full text-sm border p-3 pl-10 pr-10 rounded-xl bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 transition-all ${
                      regErrors.password ? 'border-rose-300 focus:ring-rose-500/10' : 'border-slate-200 focus:ring-blue-500/10 focus:border-blue-500'
                    }`}
                  />
                  <Lock className="absolute left-3 top-3.5 h-4.5 w-4.5 text-slate-400" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3.5 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
                  </button>
                </div>
                {regErrors.password && (
                  <p className="text-[10px] text-rose-500 font-semibold mt-1">{regErrors.password.message}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3.5 rounded-xl font-bold transition-all shadow-md flex items-center justify-center gap-2 active:scale-[0.99] disabled:opacity-50 mt-6"
              >
                {isSubmitting ? 'Creating Account...' : 'Create Account'}
              </button>
            </motion.form>
          )}

          {/* ==========================================
              FORGOT PASSWORD FORM
             ========================================== */}
          {mode === 'forgot' && (
            <motion.form
              key="forgot"
              onSubmit={handleForgotSubmit(onForgot)}
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 5 }}
              transition={{ duration: 0.2 }}
              className="space-y-4"
            >
              <p className="text-xs text-slate-500 leading-relaxed font-sans mb-4">
                Enter your registered email below, and we will send instructions to reset your account password.
              </p>
              <div>
                <label className="text-xs font-bold text-slate-500 block mb-1">Email Address</label>
                <div className="relative">
                  <input
                    type="email"
                    placeholder="name@company.com"
                    {...forgotRegister('email')}
                    className={`w-full text-sm border p-3 pl-10 rounded-xl bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 transition-all ${
                      forgotErrors.email ? 'border-rose-300 focus:ring-rose-500/10' : 'border-slate-200 focus:ring-blue-500/10 focus:border-blue-500'
                    }`}
                  />
                  <Mail className="absolute left-3 top-3.5 h-4.5 w-4.5 text-slate-400" />
                </div>
                {forgotErrors.email && (
                  <p className="text-[10px] text-rose-500 font-semibold mt-1">{forgotErrors.email.message}</p>
                )}
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => toggleMode('login')}
                  className="w-1/2 border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold py-3.5 rounded-xl text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-1/2 bg-[#0A2A6B] hover:bg-blue-800 text-white font-bold py-3.5 rounded-xl text-sm shadow-md disabled:opacity-50"
                >
                  {isSubmitting ? 'Sending...' : 'Send Reset Link'}
                </button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
