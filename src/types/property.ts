import { Property as PrismaProperty, Review as PrismaReview, User } from '@prisma/client';

export interface ReviewUser {
  name: string;
}

export interface Review {
  id: string;
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  propertyId: string;
  user: ReviewUser;
}

export interface PropertyAmenities {
  wifi: boolean;
  laundry: boolean;
  kitchen: boolean;
  waterBills: boolean;
  petsAllowed: boolean;
  heating: boolean;
  parking: boolean;
  security: boolean;
  airConditioning: boolean;
  furnished: boolean;
  billsIncluded: boolean;
  studentFriendly: boolean;
  fireAlarm: boolean;
  balcony: boolean;
  elevator: boolean;
  cableTv: boolean;
  cleaning: boolean;
  [key: string]: boolean;
}

export interface PropertyOwner {
  name: string;
  email: string;
}

export interface RawPropertyReview extends PrismaReview {
  user?: {
    name: string | null;
  };
}

export interface RawProperty {
  id: string;
  title: string;
  description: string;
  price: number;
  address: string;
  borough: string | null;
  latitude: number;
  longitude: number;
  tubeStation: string | null;
  propertyType: string;
  bedrooms: number;
  bathrooms: number;
  available: string | Date;
  images: string | string[];
  createdAt: string | Date;
  updatedAt: string | Date;
  ownerId: string;
  externalId: string | null;
  owner: PropertyOwner;
  reviews: RawPropertyReview[];
  averageRating: number | null;
  amenities?: Partial<PropertyAmenities>;
}

export interface PropertyWithDetails {
  id: string;
  title: string;
  description: string;
  price: number;
  address: string;
  borough: string | null;
  latitude: number;
  longitude: number;
  tubeStation: string | null;
  propertyType: string;
  bedrooms: number;
  bathrooms: number;
  available: Date;
  images: string[];
  createdAt: string;
  updatedAt: string;
  ownerId: string;
  externalId: string | null;
  owner: PropertyOwner;
  reviews: Review[];
  averageRating: number | undefined;
  reviewCount: number;
  amenities: PropertyAmenities;
} 