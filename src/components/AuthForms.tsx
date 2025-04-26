'use client';

import React, { useState } from 'react';
import { useRouter, useParams } from 'next/navigation'; // Use next/navigation for App Router
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

// --- Register Form Component ---

const RegisterForm: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<'STUDENT' | 'LANDLORD'>('STUDENT');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const params = useParams();
  const locale = params?.locale as string || '';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      // Registration successful, redirect to login with locale if available
      const loginPath = locale ? `/${locale}/login?registered=true` : '/login?registered=true';
      router.push(loginPath); 

    } catch (err: any) {
      setError(err.message || 'An error occurred during registration.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4" aria-label="Registration Form">
      {error && <p className="text-red-500 text-sm" role="alert">{error}</p>}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name (Optional)</label>
        <input
          id="name"
          type="text"
          autoComplete="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>
      <div>
        <label htmlFor="email-register" className="block text-sm font-medium text-gray-700">Email</label>
        <input
          id="email-register"
          type="email"
          autoComplete="email"
          required
          aria-required="true"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>
      <div>
        <label htmlFor="password-register" className="block text-sm font-medium text-gray-700">Password</label>
        <input
          id="password-register"
          type="password"
          autoComplete="new-password"
          required
          aria-required="true"
          minLength={8}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          aria-describedby="password-hint-register"
        />
      </div>
      <div>
        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Confirm Password</label>
        <input
          id="confirmPassword"
          type="password"
          autoComplete="new-password"
          required
          aria-required="true"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Account Type</label>
        <div className="mt-2 grid grid-cols-2 gap-2">
          <button 
            type="button" 
            onClick={() => setRole('STUDENT')}
            className={`py-2 px-4 rounded-lg text-sm font-medium focus:outline-none ${
              role === 'STUDENT' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
            }`}
          >
            Student
          </button>
          <button 
            type="button" 
            onClick={() => setRole('LANDLORD')}
            className={`py-2 px-4 rounded-lg text-sm font-medium focus:outline-none ${
              role === 'LANDLORD' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
            }`}
          >
            Landlord
          </button>
        </div>
        <p className="mt-1 text-xs text-gray-500">
          {role === 'STUDENT' 
            ? 'Register as a student to browse and favorite properties.' 
            : 'Register as a landlord to list your properties.'}
        </p>
      </div>
      <button 
        type="submit" 
        disabled={isLoading}
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        aria-live="polite"
        aria-busy={isLoading}
      >
        {isLoading ? 'Registering...' : 'Register'}
      </button>
    </form>
  );
};

// --- Login Form Component ---

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { login, checkAuthStatus } = useAuth(); // Get login and checkAuthStatus from context
  const router = useRouter();
  const params = useParams();
  const locale = params?.locale as string || '';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Login failed');
      }
      
      // Update auth context with user data
      login(data.user);
      
      // Check authentication status to ensure context is updated
      await checkAuthStatus();
      
      // Redirect based on role with locale if available
      const { role } = data.user;
      const basePath = locale ? `/${locale}` : '';
      
      if (role === 'LANDLORD') {
        router.push(`${basePath}/dashboard`);
      } else if (role === 'ADMIN') {
        router.push(`${basePath}/admin`);
      } else {
        router.push(`${basePath}/profile`);
      }

    } catch (err: any) {
      setError(err.message || 'An error occurred during login.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4" aria-label="Login Form">
      {error && <p className="text-red-500 text-sm" role="alert">{error}</p>}
      <div>
        <label htmlFor="email-login" className="block text-sm font-medium text-gray-700">Email</label>
        <input
          id="email-login"
          type="email"
          autoComplete="email"
          required
          aria-required="true"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>
      <div>
        <label htmlFor="password-login" className="block text-sm font-medium text-gray-700">Password</label>
        <input
          id="password-login"
          type="password"
          autoComplete="current-password"
          required
          aria-required="true"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>
      <button 
        type="submit" 
        disabled={isLoading}
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        aria-live="polite"
        aria-busy={isLoading}
      >
        {isLoading ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
};

// Export the components correctly
export { RegisterForm, LoginForm }; 