'use client';

import { useState, FormEvent, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

interface InquiryFormProps {
  propertyId: string;
  propertyTitle: string;
  isAuthenticated?: boolean;
  userEmail?: string;
  onSuccess?: () => void;
  onClose?: () => void;
  className?: string;
}

export default function InquiryForm({
  propertyId,
  propertyTitle,
  isAuthenticated = false,
  userEmail = '',
  onSuccess,
  onClose,
  className = ''
}: InquiryFormProps) {
  const t = useTranslations('Property');
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    message: '',
    email: userEmail || '',
    phone: '',
    moveInDate: ''
  });

  // Form errors
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Update email when userEmail prop changes
  useEffect(() => {
    if (userEmail) {
      setFormData(prev => ({ ...prev, email: userEmail }));
    }
  }, [userEmail]);

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.message.trim()) {
      newErrors.message = t('inquiryMessageRequired');
    } else if (formData.message.length < 5) {
      newErrors.message = t('inquiryMessageTooShort');
    }
    
    if (!formData.email.trim()) {
      newErrors.email = t('emailRequired');
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = t('invalidEmail');
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      toast.error(t('loginRequired'));
      router.push('/login');
      return;
    }
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/inquiries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          propertyId,
          message: formData.message,
          email: formData.email,
          phone: formData.phone,
          moveInDate: formData.moveInDate ? new Date(formData.moveInDate).toISOString() : undefined,
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong');
      }
      
      toast.success(t('inquirySent'));
      
      // Reset form
      setFormData({
        message: '',
        email: userEmail || '',
        phone: '',
        moveInDate: ''
      });
      
      // Call success callback if provided
      if (onSuccess) {
        onSuccess();
      }
      
      // Close form if needed
      if (onClose) {
        onClose();
      }
    } catch (error) {
      console.error('Error sending inquiry:', error);
      toast.error(t('inquiryError'));
    } finally {
      setIsSubmitting(false);
    }
  };

  // Form field animation variants
  const formVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.4,
        ease: "easeOut"
      }
    })
  };

  return (
    <div className={`bg-white rounded-lg ${className}`}>
      <form onSubmit={handleSubmit} className="space-y-5">
        <motion.div 
          className="mb-4"
          initial="hidden"
          animate="visible"
          custom={0}
          variants={formVariants}
        >
          <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
            {t('message')} <span className="text-red-500">*</span>
          </label>
          <textarea
            id="message"
            name="message"
            rows={4}
            className={`w-full px-3 py-2 border rounded-md focus:ring focus:ring-blue-200 transition-all ${errors.message ? 'border-red-500' : 'border-gray-300'}`}
            placeholder={t('inquiryMessagePlaceholder')}
            value={formData.message}
            onChange={handleChange}
            disabled={!isAuthenticated || isSubmitting}
          />
          {errors.message && (
            <motion.p 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-1 text-sm text-red-500"
            >
              {errors.message}
            </motion.p>
          )}
        </motion.div>
        
        <motion.div 
          className="mb-4"
          initial="hidden"
          animate="visible"
          custom={1}
          variants={formVariants}
        >
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            {t('email')} <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            id="email"
            name="email"
            className={`w-full px-3 py-2 border rounded-md focus:ring focus:ring-blue-200 transition-all ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
            placeholder={t('emailPlaceholder')}
            value={formData.email}
            onChange={handleChange}
            disabled={!isAuthenticated || isSubmitting}
          />
          {errors.email && (
            <motion.p 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-1 text-sm text-red-500"
            >
              {errors.email}
            </motion.p>
          )}
        </motion.div>
        
        <motion.div 
          className="mb-4"
          initial="hidden"
          animate="visible"
          custom={2}
          variants={formVariants}
        >
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
            {t('phone')}
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-200 transition-all"
            placeholder={t('phonePlaceholder')}
            value={formData.phone}
            onChange={handleChange}
            disabled={!isAuthenticated || isSubmitting}
          />
        </motion.div>
        
        <motion.div 
          className="mb-6"
          initial="hidden"
          animate="visible"
          custom={3}
          variants={formVariants}
        >
          <label htmlFor="moveInDate" className="block text-sm font-medium text-gray-700 mb-1">
            {t('preferredMoveInDate')}
          </label>
          <input
            type="date"
            id="moveInDate"
            name="moveInDate"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-200 transition-all"
            value={formData.moveInDate}
            onChange={handleChange}
            min={new Date().toISOString().split('T')[0]}
            disabled={!isAuthenticated || isSubmitting}
          />
        </motion.div>
        
        <motion.div 
          className="flex justify-end gap-3"
          initial="hidden"
          animate="visible"
          custom={4}
          variants={formVariants}
        >
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
              disabled={isSubmitting}
            >
              {t('cancel')}
            </button>
          )}
          
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors relative"
            disabled={!isAuthenticated || isSubmitting}
          >
            {isSubmitting ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {t('sending')}
              </span>
            ) : t('sendInquiry')}
          </button>
        </motion.div>
      </form>
    </div>
  );
} 