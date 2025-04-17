'use client';

import { motion } from 'framer-motion';
import { FaHandshake } from 'react-icons/fa';
import { MdSecurity, MdVerifiedUser } from 'react-icons/md';

const features = [
  {
    icon: <MdVerifiedUser className="w-12 h-12 text-blue-500" />,
    title: "Verified Properties",
    description: "All properties are verified by our team to ensure quality and safety"
  },
  {
    icon: <FaHandshake className="w-12 h-12 text-blue-500" />,
    title: "Direct Communication",
    description: "Connect directly with landlords and schedule viewings"
  },
  {
    icon: <MdSecurity className="w-12 h-12 text-blue-500" />,
    title: "Secure Booking",
    description: "Safe and secure booking process with payment protection"
  }
];

export default function FeaturesSection() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <motion.h2 
          className="text-3xl font-bold text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          Why Choose RoomZoom?
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="bg-white p-6 rounded-lg shadow-lg text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              viewport={{ once: true }}
            >
              <div className="flex justify-center mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
