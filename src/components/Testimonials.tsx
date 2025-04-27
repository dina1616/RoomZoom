'use client';
import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { FaQuoteLeft, FaStar } from 'react-icons/fa';

const testimonials = [
  {
    id: 1,
    name: "Emma Thompson",
    university: "University College London",
    image: "https://i.pravatar.cc/150?img=10",
    text: "RoomZoom made finding my student accommodation so easy! The verified properties gave me peace of mind, and I found a great place near my university.",
    rating: 5,
  },
  {
    id: 2,
    name: "James Wilson",
    university: "King's College London",
    image: "https://i.pravatar.cc/150?img=11",
    text: "The platform is incredibly user-friendly, and the virtual tours saved me so much time. I found my perfect flat within a week!",
    rating: 5,
  },
  {
    id: 3,
    name: "Sarah Chen",
    university: "Imperial College London",
    image: "https://i.pravatar.cc/150?img=19",
    text: "What I love about RoomZoom is how transparent everything is. The reviews from other students helped me make an informed decision.",
    rating: 4,
  },
];

export default function Testimonials() {
  const [activeIndex, setActiveIndex] = useState(0);
  
  // Memoize testimonials length to prevent unnecessary re-renders
  const testimonialsLength = useMemo(() => testimonials.length, []);
  
  useEffect(() => {
    // Don't set up timer if no testimonials
    if (testimonialsLength === 0) return;
    
    const timer = setInterval(() => {
      setActiveIndex((current) => 
        current === testimonialsLength - 1 ? 0 : current + 1
      );
    }, 5000);

    return () => clearInterval(timer);
  }, [testimonialsLength]);

  // If no testimonials, don't render anything
  if (testimonialsLength === 0) {
    return null;
  }

  return (
    <div className="relative max-w-5xl mx-auto">
      <div className="overflow-hidden relative h-[400px]"> 
        <div className="relative h-full"> 
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              className={`absolute w-full ${index === activeIndex ? 'z-10' : 'z-0'}`}
              initial={{ opacity: 0, x: 100 }}
              animate={{
                opacity: index === activeIndex ? 1 : 0,
                x: index === activeIndex ? 0 : -100,
              }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            >
              <div className="bg-white rounded-xl shadow-lg p-8 md:p-12">
                <div className="flex flex-col md:flex-row items-center gap-8">
                  {/* Profile Image */}
                  <div className="w-24 h-24 md:w-32 md:h-32 relative shrink-0"> 
                    <div className="absolute -top-4 -left-4 text-blue-500 text-4xl">
                      <FaQuoteLeft />
                    </div>
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-full h-full object-cover rounded-full"
                    />
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <FaStar key={i} className="text-yellow-400 w-5 h-5" />
                      ))}
                    </div>
                    <p className="text-gray-600 text-lg mb-4 italic">
                      "{testimonial.text}"
                    </p>
                    <div>
                      <h4 className="font-semibold text-lg">{testimonial.name}</h4>
                      <p className="text-gray-500">{testimonial.university}</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Navigation Dots */}
      <div className="flex justify-center mt-8 space-x-2">
        {testimonials.map((_, index) => (
          <button
            key={index}
            onClick={() => setActiveIndex(index)}
            className={`w-3 h-3 rounded-full transition-colors ${
              index === activeIndex ? 'bg-blue-500' : 'bg-gray-300'
            }`}
            aria-label={`Go to testimonial ${index + 1}`}
            title={`View testimonial ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
