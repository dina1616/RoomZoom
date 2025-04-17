'use client';
import { useState } from 'react';
import { FaSearch, FaMapMarkerAlt, FaPoundSign } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const locations = [
  'Camden',
  'Greenwich',
  'Hackney',
  'Islington',
  'Westminster',
  'Southwark',
  'Tower Hamlets',
];

const priceRanges = [
  { label: 'Up to £800', value: '0-800' },
  { label: '£800 - £1,200', value: '800-1200' },
  { label: '£1,200 - £1,600', value: '1200-1600' },
  { label: '£1,600+', value: '1600-999999' },
];

export default function SearchBar() {
  const [location, setLocation] = useState('');
  const [priceRange, setPriceRange] = useState('');
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [showPriceDropdown, setShowPriceDropdown] = useState(false);

  const handleSearch = () => {
    // Implement search functionality
    const searchParams = new URLSearchParams();
    if (location) searchParams.append('location', location);
    if (priceRange) searchParams.append('priceRange', priceRange);
    
    window.location.href = `/search?${searchParams.toString()}`;
  };

  return (
    <div className="relative w-full max-w-4xl mx-auto">
      <motion.div 
        className="flex flex-col md:flex-row gap-4 bg-white p-4 rounded-lg shadow-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        {/* Location Input */}
        <div className="relative flex-1">
          <div
            className="flex items-center border rounded-lg p-3 cursor-pointer hover:border-blue-500"
            onClick={() => setShowLocationDropdown(!showLocationDropdown)}
          >
            <FaMapMarkerAlt className="text-gray-400 mr-2" />
            <input
              type="text"
              placeholder="Location"
              className="w-full outline-none"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              onFocus={() => setShowLocationDropdown(true)}
            />
          </div>

          <AnimatePresence>
            {showLocationDropdown && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute z-10 w-full mt-2 bg-white rounded-lg shadow-lg"
              >
                {locations
                  .filter(loc => 
                    loc.toLowerCase().includes(location.toLowerCase())
                  )
                  .map((loc) => (
                    <div
                      key={loc}
                      className="p-3 hover:bg-gray-100 cursor-pointer"
                      onClick={() => {
                        setLocation(loc);
                        setShowLocationDropdown(false);
                      }}
                    >
                      {loc}
                    </div>
                  ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Price Range Input */}
        <div className="relative flex-1">
          <div
            className="flex items-center border rounded-lg p-3 cursor-pointer hover:border-blue-500"
            onClick={() => setShowPriceDropdown(!showPriceDropdown)}
          >
            <FaPoundSign className="text-gray-400 mr-2" />
            <input
              type="text"
              placeholder="Price Range"
              className="w-full outline-none"
              value={priceRanges.find(range => range.value === priceRange)?.label || ''}
              readOnly
            />
          </div>

          <AnimatePresence>
            {showPriceDropdown && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute z-10 w-full mt-2 bg-white rounded-lg shadow-lg"
              >
                {priceRanges.map((range) => (
                  <div
                    key={range.value}
                    className="p-3 hover:bg-gray-100 cursor-pointer"
                    onClick={() => {
                      setPriceRange(range.value);
                      setShowPriceDropdown(false);
                    }}
                  >
                    {range.label}
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Search Button */}
        <button
          onClick={handleSearch}
          className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center"
        >
          <FaSearch className="mr-2" />
          Search
        </button>
      </motion.div>
    </div>
  );
}
