'use client';

import { motion } from 'framer-motion';
import SearchBar from './SearchBar';

export default function HeroSection() {
  return (
    <div className="relative h-[80vh] flex items-center justify-center bg-gradient-to-r from-blue-600 to-blue-400">
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
        <motion.h1 
          className="text-5xl md:text-6xl font-bold mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Find Your Perfect Student Home
        </motion.h1>
        <motion.p 
          className="text-xl md:text-2xl mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          RoomZoom helps students find verified accommodations near their university
        </motion.p>
        <SearchBar />
      </div>
    </div>
  );
}
