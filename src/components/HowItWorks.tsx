'use client';
import { motion } from 'framer-motion';
import { FaSearch, FaCalendarAlt, FaKey, FaHome } from 'react-icons/fa';

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
  return (
    <section className="py-20 bg-white">
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
            Finding your perfect student accommodation has never been easier
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
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-blue-200 transform -translate-x-1/2" />

          {/* Steps */}
          <div className="space-y-12 relative">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className={`flex flex-col md:flex-row ${
                  index % 2 === 0 ? 'md:flex-row-reverse' : ''
                } items-center gap-8`}
              >
                {/* Content */}
                <div className={`md:w-1/2 ${index % 2 === 0 ? 'md:text-right' : ''}`}>
                  <h3 className="text-2xl font-semibold mb-4">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>

                {/* Icon */}
                <div className="md:w-1/2 flex justify-center">
                  <div className="relative">
                    <motion.div
                      className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center"
                      whileHover={{ scale: 1.1 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      {step.icon}
                    </motion.div>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                      <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">
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
          <button className="bg-blue-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-blue-700 transition-colors">
            Start Your Search
          </button>
        </motion.div>
      </div>
    </section>
  );
}
