'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import toast from 'react-hot-toast';
import InquiryModal from './InquiryModal';
import { motion } from 'framer-motion';

interface PropertyDetailWrapperProps {
  propertyId: string;
  propertyTitle: string;
  isAuthenticated: boolean;
  userEmail?: string;
}

export default function PropertyDetailWrapper({
  propertyId,
  propertyTitle,
  isAuthenticated,
  userEmail
}: PropertyDetailWrapperProps) {
  const t = useTranslations('Property');
  const router = useRouter();
  const [isInquiryModalOpen, setIsInquiryModalOpen] = useState(false);
  const [isButtonHovered, setIsButtonHovered] = useState(false);

  const handleContactClick = () => {
    if (!isAuthenticated) {
      toast.error(t('loginRequired'));
      // Redirect to login page with return URL
      router.push(`/login?returnUrl=/property/${propertyId}`);
      return;
    }
    
    setIsInquiryModalOpen(true);
  };

  return (
    <>
      <div className="mt-8">
        <motion.button 
          onClick={handleContactClick}
          className="relative w-full bg-blue-600 text-white font-semibold py-3 px-4 rounded-lg overflow-hidden"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
          onHoverStart={() => setIsButtonHovered(true)}
          onHoverEnd={() => setIsButtonHovered(false)}
          aria-label={t('contactLandlord')}
        >
          {/* Animated background effect */}
          <motion.div 
            className="absolute inset-0 bg-blue-500" 
            initial={false}
            animate={{ 
              x: isButtonHovered ? ["0%", "100%", "0%"] : "0%",
            }}
            transition={{ 
              repeat: Infinity, 
              repeatType: "mirror", 
              duration: isButtonHovered ? 1.5 : 0,
              ease: "easeInOut"
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-700 opacity-90" />
          <div className="relative flex items-center justify-center gap-2">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-5 w-5" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" 
              />
            </svg>
            {t('contactLandlord')}
          </div>
        </motion.button>

        {/* Additional property actions */}
        <div className="flex justify-center gap-2 mt-4">
          <motion.button
            className="text-sm text-gray-600 hover:text-blue-600 flex items-center gap-1 px-2 py-1 rounded-md hover:bg-blue-50 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
            Share
          </motion.button>
          <motion.button
            className="text-sm text-gray-600 hover:text-blue-600 flex items-center gap-1 px-2 py-1 rounded-md hover:bg-blue-50 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            Save
          </motion.button>
          <motion.button
            className="text-sm text-gray-600 hover:text-blue-600 flex items-center gap-1 px-2 py-1 rounded-md hover:bg-blue-50 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
            Book Viewing
          </motion.button>
        </div>
      </div>
      
      <InquiryModal
        isOpen={isInquiryModalOpen}
        onClose={() => setIsInquiryModalOpen(false)}
        propertyId={propertyId}
        propertyTitle={propertyTitle}
        isAuthenticated={isAuthenticated}
        userEmail={userEmail}
      />
    </>
  );
} 