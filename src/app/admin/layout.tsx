'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { FaHome, FaUserCheck, FaBuilding, FaUsers, FaChartBar } from 'react-icons/fa';

// Force dynamic rendering for all admin routes
export const dynamic = 'force-dynamic';

// This page group is protected by middleware for ADMIN role
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const navItems = [
    { name: 'Dashboard', href: '/admin', icon: <FaHome size={20} /> },
    { name: 'Verify Properties', href: '/admin/verify', icon: <FaUserCheck size={20} /> },
    { name: 'Manage Properties', href: '/admin/properties', icon: <FaBuilding size={20} /> },
    { name: 'Users', href: '/admin/users', icon: <FaUsers size={20} /> },
    { name: 'Analytics', href: '/admin/analytics', icon: <FaChartBar size={20} /> },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Admin Sidebar */}
      <motion.div 
        className="w-64 bg-gradient-to-b from-blue-800 to-blue-900 text-white shadow-xl"
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <div className="p-6">
          <motion.div 
            className="text-2xl font-bold tracking-tight flex items-center space-x-2"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <span className="bg-white text-blue-800 p-1 rounded">RZ</span>
            <span>Admin</span>
          </motion.div>
        </div>
        <nav className="mt-6">
          {navItems.map((item, index) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
            >
              <Link
                href={item.href}
                className="flex items-center px-6 py-3 text-gray-100 hover:bg-blue-700 transition-colors duration-200 ease-in-out group"
              >
                <span className="mr-3 text-gray-300 group-hover:text-white transition-colors duration-200">
                  {item.icon}
                </span>
                <span>{item.name}</span>
              </Link>
            </motion.div>
          ))}
        </nav>
      </motion.div>

      {/* Main Content */}
      <div className="flex-1 overflow-x-hidden">
        <motion.div 
          className="p-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <motion.h1 
            className="text-3xl font-bold mb-6 pb-2 border-b border-gray-200 flex items-center text-blue-800"
            initial={{ y: -20 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <span className="bg-blue-800 text-white p-1 rounded mr-2">RZ</span> Admin Area
          </motion.h1>
          
          <motion.div
            className="bg-white rounded-lg shadow-lg p-6"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            {children}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
