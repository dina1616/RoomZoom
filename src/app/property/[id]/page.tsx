import React from 'react';
import { notFound } from 'next/navigation'; // For handling 404
import { PrismaClient } from '@prisma/client'; // Direct import might be needed here
// Import client components
import PropertyImageGallery from '@/components/PropertyImageGallery';
import PropertyMapView from '@/components/PropertyMapView';
import ReviewSection from '@/components/ReviewSection';
import SimilarProperties from '@/components/SimilarProperties';

const prisma = new PrismaClient(); // Consider moving client instantiation to a lib file

// Manually define the detailed property type based on API/DB fetch
interface PropertyDetails {
  id: string;
  title: string;
  description: string;
  price: number;
  addressString: string;
  borough: string | null;
  latitude: number;
  longitude: number;
  tubeStation: string | null;
  propertyType: string;
  bedrooms: number;
  bathrooms: number;
  available: string | Date; // Allow Date or string initially
  verified: boolean;
  createdAt: string | Date;
  updatedAt: string | Date;
  ownerId: string;
  externalId: string | null;
  addressId: string | null;
  media: { id: string; url: string; type: string; order: number | null }[];
  address: { id: string; street: string; city: string; state: string | null; postalCode: string; country: string } | null;
  amenities: { id: string; name: string }[];
  owner: {
    id: string;
    name: string | null;
    email: string;
    landlordProfile: { companyName?: string | null; phoneNumber?: string | null; isVerified?: boolean } | null;
  };
  reviews: { 
    id: string; // Include review ID for keys
    rating: number; 
    comment: string; 
    createdAt: string | Date; // Allow Date or string
    user: { id: string; name: string | null }
  }[];
  averageRating: number;
}

// Function to fetch data (can be extracted)
async function getPropertyDetails(id: string): Promise<PropertyDetails | null> {
  try {
    // Direct DB fetch in Server Component (alternative to calling API route)
    const property = await prisma.property.findUnique({
      where: { id: id },
      include: {
        media: true,
        address: true,
        amenities: true,
        owner: {
          select: { 
            id: true, 
            name: true, 
            email: true,
            landlordProfile: true
          }
        },
        reviews: {
          orderBy: { createdAt: 'desc' },
          include: {
            user: { select: { id: true, name: true } }
          }
        }
      },
    });

    if (!property) {
      return null;
    }

    // Calculate average rating
    const totalRating = property.reviews.reduce((sum: number, review: { rating: number }) => sum + review.rating, 0);
    const averageRating = property.reviews.length > 0 ? parseFloat((totalRating / property.reviews.length).toFixed(1)) : 0;

    // Return data matching the manual PropertyDetails type
    // Ensure date types are handled if needed (e.g., convert to string)
    return { 
      ...property, 
      available: property.available, // Keep as Date or convert: .toISOString(), 
      createdAt: property.createdAt,
      updatedAt: property.updatedAt,
      reviews: property.reviews.map((r: { createdAt: Date }) => ({...r, createdAt: r.createdAt})), // Assuming reviews have createdAt as Date
      averageRating 
    } as unknown as PropertyDetails; // Use type assertion as structure matches

  } catch (error) {
    console.error(`Failed to fetch property details for ${id}:`, error);
    return null; // Return null on error
  } finally {
    await prisma.$disconnect();
  }
}

// Dynamic Page Component
export default async function PropertyDetailPage({ params }: { params: { id: string } }) {
  const id = params.id;
  const property = await getPropertyDetails(id);

  if (!property) {
    notFound(); // Trigger 404 page
  }

  // Helper to format address
  const formatAddress = (addr: PropertyDetails['address'], borough: string | null) => {
      if (!addr) return property.addressString;
      return `${addr.street}, ${addr.city}, ${addr.postalCode}${borough ? `, ${borough}` : ''}`;
  }

  return (
    <article className="container mx-auto px-4 py-8" aria-labelledby="property-title">
      {/* Header Section (Title, Price, Rating) */}
      <header className="mb-6 pb-4 border-b">
        <h1 id="property-title" className="text-3xl md:text-4xl font-bold mb-2">{property.title}</h1>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-gray-600">
          <span>{formatAddress(property.address, property.borough)}</span>
          {property.averageRating > 0 && (
             <span className="flex items-center" aria-label={`Average rating: ${property.averageRating} out of 5 stars based on ${property.reviews.length} reviews`}>
               <span className="text-yellow-400 mr-1" aria-hidden="true">★</span> 
               {property.averageRating} ({property.reviews.length} reviews)
             </span>
          )}
        </div>
        <p className="text-2xl font-semibold mt-2">£{property.price.toLocaleString()} pcm</p>
         {property.verified && <span className="inline-block bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-green-900 dark:text-green-300 ml-2" role="status">Verified</span>}
      </header>

      {/* Image Gallery (Client Component) */}
      <section aria-label="Property Images" className="mb-8">
         <PropertyImageGallery media={property.media} />
      </section>

      {/* Main Content (Grid: Details & Map) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
         {/* Left Column: Details */}
        <section aria-labelledby="details-heading" className="md:col-span-2 space-y-6">
          {/* Description */}
          <section aria-labelledby="description-heading">
            <h2 id="description-heading" className="text-xl font-semibold mb-2">Description</h2>
            <p className="text-gray-700 whitespace-pre-wrap">{property.description}</p>
          </section>

          {/* Key Details (Beds, Baths, Type, Available) */}
          <section aria-labelledby="key-details-heading">
             <h2 id="key-details-heading" className="text-xl font-semibold mb-2">Property Details</h2>
             <div className="grid grid-cols-2 gap-2 text-gray-700">
                <span>Bedrooms: {property.bedrooms}</span>
                <span>Bathrooms: {property.bathrooms}</span>
                <span>Type: {property.propertyType}</span>
                <span>Available from: <time dateTime={new Date(property.available).toISOString()}>{new Date(property.available).toLocaleDateString()}</time></span>
                {/* Add Tube Station if available */} 
                {property.tubeStation && <span>Nearest Tube: {property.tubeStation}</span>}
             </div>
          </section>

          {/* Amenities */}
          {property.amenities.length > 0 && (
            <section aria-labelledby="amenities-heading">
              <h2 id="amenities-heading" className="text-xl font-semibold mb-2">Amenities</h2>
              <ul className="list-disc list-inside grid grid-cols-2 gap-x-4 gap-y-1 text-gray-700">
                {property.amenities.map(amenity => <li key={amenity.id}>{amenity.name}</li>)}
              </ul>
            </section>
          )}

           {/* Owner Info */}
           <section aria-labelledby="owner-heading">
              <h2 id="owner-heading" className="text-xl font-semibold mb-2">Listed By</h2>
              <p className="text-gray-700">{property.owner.name || 'Private Landlord'}
                {property.owner.landlordProfile?.isVerified && <span role="status" className="inline-block bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300 ml-2">Verified Landlord</span>}
              </p>
              {/* Optionally display company name, verification status from landlordProfile */} 
           </section>
        </section>

        {/* Right Column: Map (Client Component) */}
        <aside aria-labelledby="location-heading" className="md:col-span-1">
            <h2 id="location-heading" className="text-xl font-semibold mb-2">Location</h2>
           <PropertyMapView 
              latitude={property.latitude} 
              longitude={property.longitude} 
              title={property.title} 
            />
        </aside>
      </div>

      {/* Review Section (Client Component) */}
      <ReviewSection id={id} initialReviews={property.reviews} />

      {/* Similar Properties Recommendations */}
      <section className="mt-12">
        <h2 className="text-2xl font-semibold mb-4">Similar Properties</h2>
        <SimilarProperties
          currentPropertyId={id}
          borough={property.borough}
          propertyType={property.propertyType}
          priceRange={[property.price * 0.75, property.price * 1.25]}
        />
      </section>

    </article>
  );
}

// Helper function to generate static paths if needed (for SSG)
// export async function generateStaticParams() { ... }
