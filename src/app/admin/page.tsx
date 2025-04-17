'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { FaUserCheck, FaBuilding, FaUsers, FaChartBar, FaCalendarAlt, FaFileInvoiceDollar } from 'react-icons/fa';

// Placeholder for the main admin page dashboard
export default function AdminHomePage() {
  // Animation variants for staggered animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  const statCards = [
    { title: 'Total Properties', value: '568', icon: <FaBuilding size={24} />, color: 'bg-blue-500' },
    { title: 'Active Users', value: '1,247', icon: <FaUsers size={24} />, color: 'bg-green-500' },
    { title: 'Pending Verifications', value: '37', icon: <FaUserCheck size={24} />, color: 'bg-yellow-500' },
    { title: 'Monthly Bookings', value: '216', icon: <FaCalendarAlt size={24} />, color: 'bg-purple-500' },
  ];

  const recentActions = [
    { id: 1, action: 'Property verified', property: 'Sunset Apartments #204', time: '10 minutes ago' },
    { id: 2, action: 'New user registered', property: 'John Doe (Student)', time: '1 hour ago' },
    { id: 3, action: 'Booking confirmed', property: 'Campus View #102', time: '3 hours ago' },
    { id: 4, action: 'Property listed', property: 'Urban Heights #506', time: '5 hours ago' },
  ];

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex justify-between items-center mb-6"
      >
        <h2 className="text-2xl font-bold text-gray-800">Admin Dashboard</h2>
        <div className="text-sm text-gray-500">Last updated: {new Date().toLocaleString()}</div>
      </motion.div>

      {/* Stats Overview */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {statCards.map((card, index) => (
          <motion.div
            key={card.title}
            variants={itemVariants}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
          >
            <div className={`${card.color} h-2`}></div>
            <div className="p-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-gray-500 text-sm">{card.title}</p>
                  <p className="text-2xl font-bold mt-1">{card.value}</p>
                </div>
                <div className={`${card.color} text-white p-3 rounded-full`}>
                  {card.icon}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Main Content Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <motion.div
          className="bg-white rounded-lg shadow-md overflow-hidden lg:col-span-1"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <div className="border-b px-6 py-4">
            <h3 className="font-semibold text-lg">Quick Actions</h3>
          </div>
          <div className="p-6 space-y-4">
            <Link href="/admin/verify" className="flex items-center p-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors duration-200">
              <FaUserCheck className="mr-3" />
              Verify Properties
            </Link>
            <Link href="/admin/properties" className="flex items-center p-3 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors duration-200">
              <FaBuilding className="mr-3" />
              Manage Properties
            </Link>
            <Link href="/admin/users" className="flex items-center p-3 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors duration-200">
              <FaUsers className="mr-3" />
              Manage Users
            </Link>
            <Link href="/admin/analytics" className="flex items-center p-3 bg-yellow-50 text-yellow-700 rounded-lg hover:bg-yellow-100 transition-colors duration-200">
              <FaChartBar className="mr-3" />
              View Analytics
            </Link>
            <Link href="/admin/finance" className="flex items-center p-3 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors duration-200">
              <FaFileInvoiceDollar className="mr-3" />
              Financial Reports
            </Link>
          </div>
        </motion.div>

        {/* Recent Activities */}
        <motion.div
          className="bg-white rounded-lg shadow-md overflow-hidden lg:col-span-2"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <div className="border-b px-6 py-4">
            <h3 className="font-semibold text-lg">Recent Activities</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recentActions.map((action, index) => (
                <motion.div 
                  key={action.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 + (index * 0.1), duration: 0.3 }}
                  className="flex items-center p-3 border-b border-gray-100 last:border-0"
                >
                  <div className="w-2 h-2 rounded-full bg-blue-500 mr-3"></div>
                  <div>
                    <p className="font-medium">{action.action}</p>
                    <p className="text-sm text-gray-500">{action.property}</p>
                  </div>
                  <div className="ml-auto text-xs text-gray-400">{action.time}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
} 