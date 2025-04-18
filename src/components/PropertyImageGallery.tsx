'use client';

import React, { useState } from 'react';
import ImageComponent from './ImageComponent';
// Consider using a proper gallery library like react-image-gallery or similar

interface MediaItem {
    id: string;
    url: string;
    type: string;
    // order?: number | null;
}

interface PropertyImageGalleryProps {
    media: MediaItem[];
}

const PropertyImageGallery: React.FC<PropertyImageGalleryProps> = ({ media }) => {
    const [selectedIndex, setSelectedIndex] = useState(0);

    if (!media || media.length === 0) {
        return <div className="h-[400px] bg-gray-200 flex items-center justify-center text-gray-500 rounded">No Images Available</div>;
    }

    const images = media.filter(item => item.type === 'IMAGE'); // Filter for images
    const currentImage = images[selectedIndex];

    if (images.length === 0) {
         return <div className="h-[400px] bg-gray-200 flex items-center justify-center text-gray-500 rounded">No Images Available</div>;
    }

    // TODO: Add support for video/3D tours if needed based on item.type

    return (
        <div className="grid grid-cols-1 gap-4">
            {/* Main Image Display */}
            <div className="relative h-[400px] md:h-[500px] w-full bg-gray-100 rounded overflow-hidden">
                <ImageComponent 
                    src={currentImage.url}
                    alt={`Property Image ${selectedIndex + 1}`}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover"
                    priority
                />
            </div>

            {/* Thumbnails */}
            <div className="flex space-x-2 overflow-x-auto p-1">
                {images.map((img, index) => (
                    <button 
                        key={img.id} 
                        onClick={() => setSelectedIndex(index)} 
                        className={`flex-shrink-0 w-20 h-16 rounded border-2 ${selectedIndex === index ? 'border-indigo-500' : 'border-transparent'} overflow-hidden`}
                    >
                        <ImageComponent
                            src={img.url}
                            alt={`Thumbnail ${index + 1}`}
                            fill
                            sizes="80px"
                            className="object-cover"
                            wrapperClassName="w-full h-full"
                        />
                    </button>
                ))}
            </div>
        </div>
    );
};

export default PropertyImageGallery; 