'use client';

import Image, { ImageProps, StaticImageData } from 'next/image';
import React, { useState, useEffect } from 'react';
import getImgProps, { ImageSource } from '../utils/get-img-props';

interface ImageComponentProps extends Omit<ImageProps, 'src'> {
  src: ImageSource;
  fallbackSrc?: string;
  wrapperClassName?: string;
}

/**
 * A reusable image component that handles various image source types
 * and provides fallback options
 */
const ImageComponent: React.FC<ImageComponentProps> = ({
  src,
  alt = '',
  fallbackSrc = '/images/placeholder-property.jpg',
  wrapperClassName = '',
  ...props
}) => {
  const [error, setError] = useState(false);
  const [imageSrc, setImageSrc] = useState<string | StaticImageData>(
    typeof src === 'string' ? src : (src as any)?.src || fallbackSrc
  );
  
  useEffect(() => {
    // Reset error state when src changes
    setError(false);
    
    // Update imageSrc when src changes
    if (typeof src === 'string') {
      setImageSrc(src);
    } else if ((src as any)?.src) {
      setImageSrc((src as any).src);
    }
  }, [src]);
  
  // When error occurs, switch to fallback
  useEffect(() => {
    if (error) {
      setImageSrc(fallbackSrc);
    }
  }, [error, fallbackSrc]);
  
  // Normalize the image path to ensure it works
  const normalizedSrc = typeof imageSrc === 'string' && !imageSrc.startsWith('http') && !imageSrc.startsWith('/')
    ? `/${imageSrc}`
    : imageSrc;
  
  // Get the appropriate image props based on the src type
  const imageProps = getImgProps({
    src: normalizedSrc,
    alt,
    props,
  });

  return (
    <div className={`relative ${wrapperClassName}`}>
      <Image
        {...imageProps as ImageProps}
        onError={() => setError(true)}
      />
    </div>
  );
};

export default ImageComponent; 