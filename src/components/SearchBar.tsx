'use client';
import { useState, useEffect, useRef } from 'react';
import { FaSearch, FaMapMarkerAlt, FaPoundSign, FaBed } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { MdExpandMore } from 'react-icons/md';

// Predefined options
const locations = [
  { label: 'Greenwich', value: 'Greenwich' },
  { label: 'Camden', value: 'Camden' },
  { label: 'Westminster', value: 'Westminster' },
  { label: 'Kensington', value: 'Kensington' },
  { label: 'Hackney', value: 'Hackney' },
  { label: 'Islington', value: 'Islington' },
  { label: 'Lambeth', value: 'Lambeth' },
  { label: 'Tower Hamlets', value: 'Tower Hamlets' },
  { label: 'Southwark', value: 'Southwark' },
  { label: 'Newham', value: 'Newham' },
];

const priceRanges = [
  { label: 'Any Price', value: 'any', min: null, max: null },
  { label: 'Under £500', value: '0-500', min: 0, max: 500 },
  { label: '£500 - £1000', value: '500-1000', min: 500, max: 1000 },
  { label: '£1000 - £1500', value: '1000-1500', min: 1000, max: 1500 },
  { label: '£1500 - £2000', value: '1500-2000', min: 1500, max: 2000 },
  { label: '£2000 - £2500', value: '2000-2500', min: 2000, max: 2500 },
  { label: 'Over £2500', value: '2500+', min: 2500, max: null },
];

const bedroomOptions = [
  { label: 'Any', value: 'any' },
  { label: '1+', value: '1' },
  { label: '2+', value: '2' },
  { label: '3+', value: '3' },
  { label: '4+', value: '4' },
  { label: '5+', value: '5' },
];

export default function SearchBar() {
  const router = useRouter();
  const [location, setLocation] = useState('');
  const [priceRange, setPriceRange] = useState('');
  const [bedrooms, setBedrooms] = useState('');
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [showPriceDropdown, setShowPriceDropdown] = useState(false);
  const [showBedroomDropdown, setShowBedroomDropdown] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  const locationRef = useRef<HTMLDivElement>(null);
  const priceRef = useRef<HTMLDivElement>(null);
  const bedroomRef = useRef<HTMLDivElement>(null);

  // Handle clicks outside of dropdowns
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (locationRef.current && !locationRef.current.contains(event.target as Node)) {
        setShowLocationDropdown(false);
      }
      if (priceRef.current && !priceRef.current.contains(event.target as Node)) {
        setShowPriceDropdown(false);
      }
      if (bedroomRef.current && !bedroomRef.current.contains(event.target as Node)) {
        setShowBedroomDropdown(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSearch = () => {
    setIsSearching(true);

    // Build search params
    const searchParams = new URLSearchParams();
    
    // Add location if selected
    if (location) {
      searchParams.append('borough', location);
    }
    
    // Add price range if selected
    const selectedPriceRange = priceRanges.find(range => range.value === priceRange);
    if (selectedPriceRange) {
      if (selectedPriceRange.min !== null) {
        searchParams.append('minPrice', selectedPriceRange.min.toString());
      }
      if (selectedPriceRange.max !== null) {
        searchParams.append('maxPrice', selectedPriceRange.max.toString());
      }
    }
    
    // Add bedrooms if selected
    if (bedrooms && bedrooms !== 'any') {
      searchParams.append('bedrooms', bedrooms);
    }
    
    // Navigate to properties page with filters
    setTimeout(() => {
      setIsSearching(false);
      router.push(`/properties?${searchParams.toString()}`);
    }, 500);
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        duration: 0.5,
        staggerChildren: 0.1 
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { type: "spring", stiffness: 100 }
    }
  };

  const dropdownVariants = {
    hidden: { opacity: 0, y: -10, height: 0 },
    visible: { 
      opacity: 1, 
      y: 0, 
      height: 'auto',
      transition: { 
        type: "spring", 
        stiffness: 300,
        damping: 24
      }
    }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="w-full max-w-5xl mx-auto"
    >
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-1 rounded-xl shadow-lg">
        <div className="bg-white p-4 rounded-lg flex flex-col md:flex-row gap-3 items-center">
          <motion.div 
            variants={itemVariants}
            ref={locationRef} 
            className="w-full md:w-1/3 relative"
          >
            <div
              onClick={() => setShowLocationDropdown(!showLocationDropdown)}
              className="flex items-center justify-between border rounded-lg p-3 cursor-pointer hover:border-blue-500 transition-colors bg-gray-50"
            >
              <div className="flex items-center">
                <FaMapMarkerAlt className="text-blue-600 mr-2" />
                <span className={location ? "text-gray-800" : "text-gray-400"}>
                  {location || "Location"}
                </span>
              </div>
              <MdExpandMore className={`text-gray-400 transition-transform duration-300 ${showLocationDropdown ? 'rotate-180' : ''}`} />
            </div>
            
            <AnimatePresence>
              {showLocationDropdown && (
                <motion.div
                  variants={dropdownVariants}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-xl max-h-60 overflow-y-auto"
                >
                  {locations.map((item) => (
                    <div
                      key={item.value}
                      onClick={() => {
                        setLocation(item.value);
                        setShowLocationDropdown(false);
                      }}
                      className={`p-3 cursor-pointer hover:bg-blue-50 transition-colors ${
                        location === item.value ? 'bg-blue-100 text-blue-700' : 'text-gray-800'
                      }`}
                    >
                      {item.label}
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          <motion.div 
            variants={itemVariants}
            ref={priceRef} 
            className="w-full md:w-1/3 relative"
          >
            <div
              onClick={() => setShowPriceDropdown(!showPriceDropdown)}
              className="flex items-center justify-between border rounded-lg p-3 cursor-pointer hover:border-blue-500 transition-colors bg-gray-50"
            >
              <div className="flex items-center">
                <FaPoundSign className="text-green-600 mr-2" />
                <span className={priceRange ? "text-gray-800" : "text-gray-400"}>
                  {priceRange ? priceRanges.find(range => range.value === priceRange)?.label : "Price Range"}
                </span>
              </div>
              <MdExpandMore className={`text-gray-400 transition-transform duration-300 ${showPriceDropdown ? 'rotate-180' : ''}`} />
            </div>
            
            <AnimatePresence>
              {showPriceDropdown && (
                <motion.div
                  variants={dropdownVariants}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-xl max-h-60 overflow-y-auto"
                >
                  {priceRanges.map((item) => (
                    <div
                      key={item.value}
                      onClick={() => {
                        setPriceRange(item.value);
                        setShowPriceDropdown(false);
                      }}
                      className={`p-3 cursor-pointer hover:bg-blue-50 transition-colors ${
                        priceRange === item.value ? 'bg-blue-100 text-green-700' : 'text-gray-800'
                      }`}
                    >
                      {item.label}
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          <motion.div 
            variants={itemVariants}
            ref={bedroomRef} 
            className="w-full md:w-1/4 relative"
          >
            <div
              onClick={() => setShowBedroomDropdown(!showBedroomDropdown)}
              className="flex items-center justify-between border rounded-lg p-3 cursor-pointer hover:border-blue-500 transition-colors bg-gray-50"
            >
              <div className="flex items-center">
                <FaBed className="text-purple-600 mr-2" />
                <span className={bedrooms ? "text-gray-800" : "text-gray-400"}>
                  {bedrooms ? `${bedrooms === 'any' ? 'Any' : bedrooms + '+'} Bedrooms` : "Bedrooms"}
                </span>
              </div>
              <MdExpandMore className={`text-gray-400 transition-transform duration-300 ${showBedroomDropdown ? 'rotate-180' : ''}`} />
            </div>
            
            <AnimatePresence>
              {showBedroomDropdown && (
                <motion.div
                  variants={dropdownVariants}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-xl max-h-60 overflow-y-auto"
                >
                  {bedroomOptions.map((item) => (
                    <div
                      key={item.value}
                      onClick={() => {
                        setBedrooms(item.value);
                        setShowBedroomDropdown(false);
                      }}
                      className={`p-3 cursor-pointer hover:bg-blue-50 transition-colors ${
                        bedrooms === item.value ? 'bg-blue-100 text-purple-700' : 'text-gray-800'
                      }`}
                    >
                      {item.label} Bedrooms
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          <motion.button
            variants={itemVariants}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSearch}
            disabled={isSearching}
            className="w-full md:w-auto px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-lg font-medium shadow-md hover:shadow-lg transition-all flex items-center justify-center"
          >
            {isSearching ? (
              <svg className="animate-spin h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <FaSearch className="mr-2" />
            )}
            <span>Search</span>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
