'use client';

import Image, { ImageProps } from 'next/image';
import React from 'react';
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
  const [error, setError] = React.useState(false);
  
  // Get the appropriate image props based on the src type
  const imageProps = getImgProps({
    src: error ? fallbackSrc : src,
    alt,
    props,
  });

  // Ensure we always have a valid src for the Image component
  if (!imageProps.src) {
    imageProps.src = fallbackSrc;
  }

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