'use client';

import { motion } from 'framer-motion';
import { FaHandshake, FaMapMarkedAlt, FaSchool, FaUserShield } from 'react-icons/fa';
import { MdSecurity, MdVerifiedUser, MdCompareArrows, MdOutlineRateReview } from 'react-icons/md';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const features = [
  {
    icon: <MdVerifiedUser className="w-12 h-12 text-blue-500" />,
    title: "Verified Properties",
    description: "All properties are verified by our team to ensure quality and safety standards are met"
  },
  {
    icon: <FaHandshake className="w-12 h-12 text-blue-500" />,
    title: "Direct Communication",
    description: "Connect directly with landlords and schedule viewings without intermediary delays"
  },
  {
    icon: <MdSecurity className="w-12 h-12 text-blue-500" />,
    title: "Secure Booking",
    description: "Safe and secure booking process with payment protection for peace of mind"
  },
  {
    icon: <FaMapMarkedAlt className="w-12 h-12 text-blue-500" />,
    title: "Interactive Maps",
    description: "Explore properties with our interactive maps to find the perfect location near your university"
  },
  {
    icon: <MdCompareArrows className="w-12 h-12 text-blue-500" />,
    title: "Property Comparison",
    description: "Compare multiple properties side by side to make informed decisions"
  },
  {
    icon: <FaSchool className="w-12 h-12 text-blue-500" />,
    title: "University Proximity",
    description: "Filter properties by distance to your specific university or campus"
  },
  {
    icon: <MdOutlineRateReview className="w-12 h-12 text-blue-500" />,
    title: "Verified Reviews",
    description: "Read authentic reviews from students who have lived in the properties"
  },
  {
    icon: <FaUserShield className="w-12 h-12 text-blue-500" />,
    title: "Tenant Protection",
    description: "Resources and support for tenants' rights and dispute resolution"
  }
];

export default function FeaturesSection() {
  const pathname = usePathname();
  const locale = pathname.split('/')[1] || 'en';
  
  return (
    <section className="py-20 bg-gray-50" id="features">
      <div className="container mx-auto px-4">
        <motion.h2 
          className="text-3xl font-bold text-center mb-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          Why Choose RoomZoom?
        </motion.h2>
        
        <motion.p
          className="text-center text-gray-600 max-w-2xl mx-auto mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          viewport={{ once: true }}
        >
          Our platform offers a comprehensive suite of tools and safeguards to ensure you find
          the perfect student accommodation with confidence and ease.
        </motion.p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="bg-white p-6 rounded-lg shadow-lg text-center hover:shadow-xl transition-shadow"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <div className="flex justify-center mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </motion.div>
          ))}
        </div>
        
        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          viewport={{ once: true }}
        >
          <Link href={`/${locale}/properties`}>
            <motion.button
              className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors shadow-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Explore All Properties
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
