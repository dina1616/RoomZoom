'use client';
import { motion } from 'framer-motion';
import { FaSearch, FaCalendarAlt, FaKey, FaHome, FaRegStar, FaRegComments } from 'react-icons/fa';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const steps = [
  {
    icon: <FaSearch className="w-12 h-12 text-blue-500" />,
    title: "Search & Filter",
    description: "Browse through verified properties and use filters to find your perfect match based on location, budget, and preferences.",
  },
  {
    icon: <FaCalendarAlt className="w-12 h-12 text-blue-500" />,
    title: "Schedule Viewings",
    description: "Book property viewings directly through our platform at times that suit both you and the landlord.",
  },
  {
    icon: <FaRegStar className="w-12 h-12 text-blue-500" />,
    title: "Save Favorites",
    description: "Create a shortlist of your favorite properties to compare and share with friends or family.",
  },
  {
    icon: <FaRegComments className="w-12 h-12 text-blue-500" />,
    title: "Communicate",
    description: "Chat with landlords, ask questions, and negotiate directly through our secure messaging system.",
  },
  {
    icon: <FaKey className="w-12 h-12 text-blue-500" />,
    title: "Secure Your Home",
    description: "Complete the booking process securely through our platform with verified landlords and protected payments.",
  },
  {
    icon: <FaHome className="w-12 h-12 text-blue-500" />,
    title: "Move In",
    description: "Get your keys and move into your new student home with peace of mind, knowing everything is properly arranged.",
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.3,
    },
  },
};

const itemVariants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
};

export default function HowItWorks() {
  const pathname = usePathname();
  const locale = pathname.split('/')[1] || 'en';
  
  return (
    <section className="py-20 bg-white" id="how-it-works">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl font-bold mb-4">How RoomZoom Works</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Finding your perfect student accommodation has never been easier. Follow these simple steps to secure your ideal home.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="relative"
        >
          {/* Timeline Line */}
          <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-1 bg-blue-200 transform -translate-x-1/2" />

          {/* Steps */}
          <div className="space-y-16 relative">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className={`flex flex-col lg:flex-row ${
                  index % 2 === 0 ? 'lg:flex-row-reverse' : ''
                } items-center gap-8`}
              >
                {/* Content */}
                <div className={`lg:w-1/2 ${index % 2 === 0 ? 'lg:text-right' : ''}`}>
                  <h3 className="text-2xl font-semibold mb-4">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>

                {/* Icon */}
                <div className="lg:w-1/2 flex justify-center">
                  <div className="relative">
                    <motion.div
                      className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center shadow-md"
                      whileHover={{ scale: 1.1, backgroundColor: "#EBF5FF" }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      {step.icon}
                    </motion.div>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                      <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold shadow-lg">
                        {index + 1}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <Link href={`/${locale}/properties`}>
            <motion.button 
              className="bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-lg"
              whileHover={{ scale: 1.05, boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.5)" }}
              whileTap={{ scale: 0.95 }}
            >
              Start Your Search Today
            </motion.button>
          </Link>
          
          <div className="mt-8 flex justify-center space-x-8">
            <Link href={`/${locale}/register`}>
              <motion.button 
                className="text-blue-600 hover:text-blue-800 font-medium flex items-center"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span>Create Account</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </motion.button>
            </Link>
            
            <Link href={`/${locale}/about`}>
              <motion.button 
                className="text-gray-600 hover:text-gray-800 font-medium flex items-center"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span>Learn More</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
