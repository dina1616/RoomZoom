'use client';

import React from 'react';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { FaHome, FaMapMarkedAlt, FaInfoCircle, FaSearch, FaUserCircle, FaBars, FaTimes } from 'react-icons/fa';
import { useAuth } from '@/context/AuthContext';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const t = useTranslations('Navigation');
  
  // Extract the current locale from pathname
  const locale = pathname.split('/')[1];
  
  // Add scroll listener to change navbar appearance on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  const navigation = [
    { name: t('home'), href: `/${locale}`, icon: <FaHome /> },
    { name: t('properties'), href: `/${locale}/properties`, icon: <FaSearch /> },
    { name: t('map'), href: `/${locale}/map`, icon: <FaMapMarkedAlt /> },
    { name: t('about'), href: `/${locale}/about`, icon: <FaInfoCircle /> },
  ];

  return (
    <motion.nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-white shadow-md py-2' 
          : 'bg-transparent py-4'
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Link 
              href={`/${locale}`} 
              className="flex items-center space-x-2"
            >
              <motion.div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  scrolled ? 'bg-blue-600' : 'bg-blue-500'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="text-white font-bold text-xl">RZ</span>
              </motion.div>
              <motion.span 
                className={`font-bold text-xl ${
                  scrolled ? 'text-blue-600' : 'text-blue-500'
                }`}
                initial={{ opacity: 0, x: -5 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                RoomZoom
              </motion.span>
            </Link>
            <div className="hidden md:flex md:ml-10 md:space-x-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                    pathname === item.href
                      ? 'text-blue-600 bg-blue-50'
                      : 'text-gray-500 hover:text-blue-600 hover:bg-blue-50'
                  }`}
                >
                  <span className="mr-1.5">{item.icon}</span>
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
          <div className="hidden md:flex md:items-center md:space-x-3">
            {isAuthenticated ? (
              <>
                {user?.role === 'LANDLORD' && (
                  <Link href={`/${locale}/dashboard`} className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md transition-colors duration-200">
                    {t('dashboard')}
                  </Link>
                )}
                {user?.role === 'STUDENT' && (
                  <Link href={`/${locale}/profile`} className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md transition-colors duration-200">
                    {t('profile')}
                  </Link>
                )}
                {user?.role === 'ADMIN' && (
                  <Link href={`/${locale}/admin`} className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md transition-colors duration-200">
                    {t('admin')}
                  </Link>
                )}
                <button onClick={logout} className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md transition-colors duration-200">
                  {t('logout')}
                </button>
              </>
            ) : (
              <>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    href={`/${locale}/login`}
                    className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md transition-colors duration-200"
                  >
                    {t('login')}
                  </Link>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    href={`/${locale}/register`}
                    className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 rounded-md shadow-sm transition-all duration-200 hover:shadow"
                  >
                    {t('register')}
                  </Link>
                </motion.div>
              </>
            )}
          </div>
          <div className="flex md:hidden">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`p-2 rounded-md ${
                isMenuOpen 
                  ? 'bg-gray-200 text-gray-800' 
                  : 'text-gray-500 hover:text-gray-800 hover:bg-gray-100'
              } focus:outline-none transition-colors duration-200`}
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? (
                <FaTimes className="h-6 w-6" />
              ) : (
                <FaBars className="h-6 w-6" />
              )}
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            className="md:hidden bg-white shadow-lg"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navigation.map((item, index) => (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.3 }}
                >
                  <Link
                    href={item.href}
                    className={`flex items-center px-3 py-2 rounded-md text-base font-medium ${
                      pathname === item.href
                        ? 'text-white bg-gradient-to-r from-blue-600 to-blue-500'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <span className="mr-3">{item.icon}</span>
                    {item.name}
                  </Link>
                </motion.div>
              ))}
            </div>
            <div className="pt-4 pb-3 border-t border-gray-200">
              <motion.div 
                className="flex flex-col space-y-2 px-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.3 }}
              >
                <Link
                  href={`/${locale}/login`}
                  className="px-4 py-2 text-center text-base font-medium text-gray-700 hover:bg-gray-100 rounded-md"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span className="flex items-center justify-center">
                    <FaUserCircle className="mr-2" />
                    {t('login')}
                  </span>
                </Link>
                <Link
                  href={`/${locale}/register`}
                  className="px-4 py-2 text-center text-base font-medium text-white bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 rounded-md shadow-sm"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {t('register')}
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
