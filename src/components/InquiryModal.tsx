'use client';

import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslations } from 'next-intl';
import InquiryForm from './InquiryForm';

interface InquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  propertyId: string;
  propertyTitle: string;
  isAuthenticated: boolean;
  userEmail?: string;
}

export default function InquiryModal({
  isOpen,
  onClose,
  propertyId,
  propertyTitle,
  isAuthenticated,
  userEmail
}: InquiryModalProps) {
  const t = useTranslations('Modal');
  const modalRef = useRef<HTMLDivElement>(null);
  
  // Close modal when clicking outside
  const handleOutsideClick = (e: React.MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onClose();
    }
  };
  
  // Handle ESC key press
  useEffect(() => {
    const handleEscapeKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    
    document.addEventListener('keydown', handleEscapeKey);
    
    // Prevent scrolling on the background when modal is open
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, onClose]);
  
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
          {/* Backdrop with blur effect */}
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleOutsideClick}
            transition={{ duration: 0.2 }}
          />
          
          {/* Modal */}
          <motion.div
            ref={modalRef}
            className="relative z-10 bg-white rounded-xl shadow-2xl max-w-md w-full mx-auto max-h-[90vh] overflow-auto"
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 10 }}
            transition={{ 
              type: 'spring', 
              damping: 25, 
              stiffness: 300,
              duration: 0.3 
            }}
          >
            {/* Header with close button */}
            <div className="sticky top-0 bg-white px-6 py-4 border-b z-10 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-800">{t('inquireAbout')}</h2>
              <button
                className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100 transition-colors"
                onClick={onClose}
                aria-label={t('close')}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            {/* Inquiry form */}
            <div className="p-6">
              <InquiryForm
                propertyId={propertyId}
                propertyTitle={propertyTitle}
                isAuthenticated={isAuthenticated}
                userEmail={userEmail}
                onSuccess={onClose}
                onClose={onClose}
                className="shadow-none border-none p-0"
              />
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
} 