'use client';

import React from 'react';
import Image from 'next/image';
import ImageComponent from './ImageComponent';
import getImgProps from '../utils/get-img-props';

/**
 * Example component demonstrating different ways to use the image utilities
 */
const ExampleImageUsage: React.FC = () => {
  // Example image URLs
  const dynamicImageUrl = 'https://example.com/image.jpg';
  const localImageUrl = '/images/placeholder-property.jpg';
  
  // 1. Using the ImageComponent wrapper (recommended)
  const renderWithImageComponent = () => (
    <div className="mb-8">
      <h2 className="text-xl font-bold mb-4">Using ImageComponent</h2>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="mb-2">Dynamic image URL:</p>
          <ImageComponent
            src={dynamicImageUrl}
            alt="Example dynamic image"
            width={400}
            height={300}
            wrapperClassName="h-64"
          />
        </div>
        <div>
          <p className="mb-2">Local image URL:</p>
          <ImageComponent
            src={localImageUrl}
            alt="Example local image"
            width={400}
            height={300}
            wrapperClassName="h-64"
          />
        </div>
      </div>
    </div>
  );
  
  // 2. Using getImgProps utility directly with Next.js Image
  const renderWithGetImgProps = () => {
    const dynamicImageProps = getImgProps({
      src: dynamicImageUrl,
      alt: 'Example dynamic image',
      props: {
        width: 400,
        height: 300,
      },
    });
    
    const localImageProps = getImgProps({
      src: localImageUrl,
      alt: 'Example local image',
      props: {
        width: 400,
        height: 300,
      },
    });
    
    return (
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4">Using getImgProps utility</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="mb-2">Dynamic image URL:</p>
            <div className="relative h-64">
              <Image {...dynamicImageProps} />
            </div>
          </div>
          <div>
            <p className="mb-2">Local image URL:</p>
            <div className="relative h-64">
              <Image {...localImageProps} />
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Image Utilities Examples</h1>
      {renderWithImageComponent()}
      {renderWithGetImgProps()}
    </div>
  );
};

export default ExampleImageUsage; 