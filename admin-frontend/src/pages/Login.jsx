import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Eye, EyeOff, AlertCircle, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Login = () => {
  const [email, setEmail] = useState('admin@agroshield.in');
  const [password, setPassword] = useState('admin123');
  const [role, setRole] = useState('Admin');
  const [showPassword, setShowPassword] = useState(false);

  const [errors, setErrors] = useState({});
  const [bannerError, setBannerError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};
    if (!email.trim()) {
      newErrors.email = 'Email address is required.';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.trim())) {
        newErrors.email = 'Enter a valid email address.';
      }
    }

    if (!password) {
      newErrors.password = 'Password is required.';
    }

    if (!role) {
      newErrors.role = 'Role selection is required.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setBannerError('');

    if (!validateForm()) return;

    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);

      // 1. Role Gate Check - STRICT
      if (role !== 'Admin') {
        setBannerError('This portal is for admin accounts only.');
        return;
      }

      // 2. Credentials Check
      if (email.trim().toLowerCase() === 'admin@agroshield.in' && password === 'admin123') {
        login({
          email: 'admin@agroshield.in',
          name: 'Priya Raman',
          role: 'Admin',
        });
        navigate('/dashboard');
      } else {
        setBannerError('Incorrect email or password.');
      }
    }, 600);
  };

  return (
    <div className="min-h-screen bg-[#F8FAF9] flex flex-col justify-center items-center px-4 py-12">
      {/* Brand Header */}
      <div className="flex flex-col items-center mb-8 text-center">
        <div className="p-3 bg-[#DCFCE7] text-[#15803D] rounded-xl shadow-sm mb-3">
          <Shield className="w-8 h-8 fill-current" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">AgroShield</h1>
        <p className="text-sm font-medium text-gray-500 mt-1">Insurance officer portal</p>
      </div>

      {/* Login Card Container */}
      <div className="w-full max-w-[420px] bg-white rounded-lg border border-gray-200 p-8 shadow-sm">
        {/* Banner Alert Message */}
        {bannerError && (
          <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200 flex items-start space-x-3 text-red-800 text-sm">
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <span className="font-medium">{bannerError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
          {/* Email Address Input */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
              Email address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@agroshield.in"
              className={`w-full px-3.5 py-2.5 text-sm bg-white border ${
                errors.email ? 'border-red-500 ring-1 ring-red-500' : 'border-gray-300'
              } rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#15803D] focus:border-transparent`}
            />
            {errors.email && (
              <p className="mt-1 text-xs text-red-600">{errors.email}</p>
            )}
          </div>

          {/* Password Input with Eye Toggle */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1.5">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className={`w-full px-3.5 py-2.5 pr-10 text-sm bg-white border ${
                  errors.password ? 'border-red-500 ring-1 ring-red-500' : 'border-gray-300'
                } rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#15803D] focus:border-transparent`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1 text-xs text-red-600">{errors.password}</p>
            )}
          </div>

          {/* Role Selector Dropdown */}
          <div>
            <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1.5">
              Role
            </label>
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#15803D] focus:border-transparent"
            >
              <option value="Admin">Admin</option>
              <option value="Field Officer">Field Officer</option>
              <option value="Farmer">Farmer</option>
            </select>
            {errors.role && (
              <p className="mt-1 text-xs text-red-600">{errors.role}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-11 bg-[#15803D] hover:bg-[#166534] text-white font-medium text-sm rounded-lg shadow-sm transition-colors flex items-center justify-center space-x-2 disabled:opacity-75"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Signing in...</span>
              </>
            ) : (
              <span>Sign in</span>
            )}
          </button>
        </form>

        {/* Demo Credentials Helper */}
        <div className="mt-6 pt-5 border-t border-gray-100 text-center">
          <p className="text-xs text-gray-500">
            <span className="font-semibold text-gray-700">Demo:</span> admin@agroshield.in / admin123
          </p>
        </div>
      </div>
    </div>
  );
};
