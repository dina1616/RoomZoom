'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

interface CTASectionProps {
  locale: string;
}

export default function CTASection({ locale }: CTASectionProps) {
  return (
    <section
      className="py-20 bg-blue-600 text-white text-center"
      aria-labelledby="cta-heading"
    >
      <div className="container mx-auto px-4">
        <h2 id="cta-heading" className="text-3xl font-bold mb-6">
          Ready to Find Your New Home?
        </h2>
        <p className="text-xl mb-8 max-w-2xl mx-auto">
          Join thousands of students who found their ideal London accommodation through
          RoomZoom. With comprehensive property information and a focus on 
          student-friendly locations, we help you discover the perfect spot 
          that fits both your budget and lifestyle.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link href={`/${locale}/register`}>
            <motion.button
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold
                      transition-colors duration-300 hover:bg-blue-50 hover:ring-4
                      hover:ring-offset-2 hover:ring-blue-300 shadow-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Register Now"
            >
              Register Now
            </motion.button>
          </Link>
          
          <Link href={`/${locale}/login`}>
            <motion.button
              className="bg-blue-500 text-white border-2 border-white px-8 py-3 rounded-lg font-semibold
                      transition-colors duration-300 hover:bg-blue-700 shadow-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Log In"
            >
              Log In
            </motion.button>
          </Link>
          
          <Link href={`/${locale}/properties`}>
            <motion.button
              className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-lg font-semibold
                      transition-colors duration-300 hover:bg-white hover:text-blue-600 shadow-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Browse Properties"
            >
              Browse Properties
            </motion.button>
          </Link>
        </div>
        
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="bg-blue-700 p-5 rounded-lg shadow-lg hover:bg-blue-800 transition-colors">
            <h3 className="font-bold text-xl mb-2">For Students</h3>
            <p className="mb-4">Find verified properties near your university and connect with trusted landlords.</p>
            <Link href={`/${locale}/register?role=STUDENT`} className="text-blue-200 hover:text-white inline-flex items-center">
              Get Started
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </Link>
          </div>
          
          <div className="bg-blue-700 p-5 rounded-lg shadow-lg hover:bg-blue-800 transition-colors">
            <h3 className="font-bold text-xl mb-2">For Landlords</h3>
            <p className="mb-4">List your properties and connect with verified students looking for accommodation.</p>
            <Link href={`/${locale}/register?role=LANDLORD`} className="text-blue-200 hover:text-white inline-flex items-center">
              List Properties
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </Link>
          </div>
          
          <div className="bg-blue-700 p-5 rounded-lg shadow-lg hover:bg-blue-800 transition-colors">
            <h3 className="font-bold text-xl mb-2">Need Help?</h3>
            <p className="mb-4">Get assistance with finding properties, booking viewings, or resolving disputes.</p>
            <Link href={`/${locale}/support`} className="text-blue-200 hover:text-white inline-flex items-center">
              Contact Support
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
} 