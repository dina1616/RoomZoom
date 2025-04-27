import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

// Helper function to generate a random date within the next few months
function getRandomFutureDate() {
  const today = new Date();
  const futureDate = new Date(today);
  futureDate.setDate(today.getDate() + Math.floor(Math.random() * 90) + 10); // Random date between 10-100 days in future
  return futureDate;
}

// Helper function to get a random element from an array
function getRandomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

// Helper function to get random subset of array elements
function getRandomSubset<T>(array: T[], min = 1, max?: number): T[] {
  const maxItems = max || array.length;
  const count = Math.floor(Math.random() * (maxItems - min + 1)) + min;
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

// Create property statistics after property creation
async function createPropertyStats(propertyId: string) {
  try {
    // Generate random stats
    const viewCount = Math.floor(Math.random() * 200);
    const inquiryCount = Math.floor(Math.random() * 30);
    const favoriteCount = Math.floor(Math.random() * 50);
    
    // Create statistics with raw SQL
    await prisma.$executeRaw`
      INSERT INTO "PropertyStat" (
        "id", 
        "propertyId", 
        "viewCount", 
        "inquiryCount", 
        "favoriteCount", 
        "lastViewed", 
        "createdAt", 
        "updatedAt"
      )
      VALUES (
        ${crypto.randomUUID()}, 
        ${propertyId}, 
        ${viewCount}, 
        ${inquiryCount}, 
        ${favoriteCount}, 
        ${new Date()},
        ${new Date()},
        ${new Date()}
      )
    `;
  } catch (error) {
    console.error(`Error creating stats for property ${propertyId}:`, error);
  }
}

async function main() {
  console.log(`Start seeding ...`);

  // Seed Amenities
  const wifi = await prisma.amenity.upsert({
    where: { name: 'WiFi' },
    update: {},
    create: { name: 'WiFi' },
  });
  const gym = await prisma.amenity.upsert({
    where: { name: 'Gym' },
    update: {},
    create: { name: 'Gym' },
  });
  const parking = await prisma.amenity.upsert({
    where: { name: 'Parking' },
    update: {},
    create: { name: 'Parking' },
  });
  const petFriendly = await prisma.amenity.upsert({
    where: { name: 'Pet Friendly' },
    update: {},
    create: { name: 'Pet Friendly' },
  });
  const laundry = await prisma.amenity.upsert({
    where: { name: 'Laundry' },
    update: {},
    create: { name: 'Laundry' },
  });
  const kitchen = await prisma.amenity.upsert({
    where: { name: 'Kitchen' },
    update: {},
    create: { name: 'Kitchen' },
  });
  const billsIncluded = await prisma.amenity.upsert({
    where: { name: 'Bills Included' },
    update: {},
    create: { name: 'Bills Included' },
  });
  const smartTv = await prisma.amenity.upsert({
    where: { name: 'Smart TV' },
    update: {},
    create: { name: 'Smart TV' },
  });
  const studyDesk = await prisma.amenity.upsert({
    where: { name: 'Study Desk' },
    update: {},
    create: { name: 'Study Desk' },
  });
  const balcony = await prisma.amenity.upsert({
    where: { name: 'Balcony' },
    update: {},
    create: { name: 'Balcony' },
  });
  // Additional amenities
  const dishwasher = await prisma.amenity.upsert({
    where: { name: 'Dishwasher' },
    update: {},
    create: { name: 'Dishwasher' },
  });
  const airConditioning = await prisma.amenity.upsert({
    where: { name: 'Air Conditioning' },
    update: {},
    create: { name: 'Air Conditioning' },
  });
  const securitySystem = await prisma.amenity.upsert({
    where: { name: 'Security System' },
    update: {},
    create: { name: 'Security System' },
  });
  const furnished = await prisma.amenity.upsert({
    where: { name: 'Furnished' },
    update: {},
    create: { name: 'Furnished' },
  });
  const roofTerrace = await prisma.amenity.upsert({
    where: { name: 'Roof Terrace' },
    update: {},
    create: { name: 'Roof Terrace' },
  });
  const communalGarden = await prisma.amenity.upsert({
    where: { name: 'Communal Garden' },
    update: {},
    create: { name: 'Communal Garden' },
  });
  const bicycleStorage = await prisma.amenity.upsert({
    where: { name: 'Bicycle Storage' },
    update: {},
    create: { name: 'Bicycle Storage' },
  });
  const concierge = await prisma.amenity.upsert({
    where: { name: 'Concierge' },
    update: {},
    create: { name: 'Concierge' },
  });
  console.log(`Seeded ${await prisma.amenity.count()} amenities`);

  // Seed Users with proper password hashing
  const hashedPassword = await hash('password123', 12);

  // Landlord User
  const landlordUser = await prisma.user.upsert({
    where: { email: 'landlord@example.com' },
    update: {},
    create: {
      email: 'landlord@example.com',
      name: 'London Properties Ltd',
      password: hashedPassword,
      role: 'LANDLORD',
      landlordProfile: {
        create: {
          companyName: 'London Properties Ltd.',
          phoneNumber: '07700900123',
          isVerified: true
        }
      }
    },
    include: { landlordProfile: true }
  });

  // Individual Landlord
  const individualLandlord = await prisma.user.upsert({
    where: { email: 'sarah@example.com' },
    update: {},
    create: {
      email: 'sarah@example.com',
      name: 'Sarah Johnson',
      password: hashedPassword,
      role: 'LANDLORD',
      landlordProfile: {
        create: {
          phoneNumber: '07700900456',
          isVerified: true
        }
      }
    },
    include: { landlordProfile: true }
  });

  // Additional Landlords
  const premiumLandlord = await prisma.user.upsert({
    where: { email: 'premium@example.com' },
    update: {},
    create: {
      email: 'premium@example.com',
      name: 'Premium London Properties',
      password: hashedPassword,
      role: 'LANDLORD',
      landlordProfile: {
        create: {
          companyName: 'Premium London Properties Ltd.',
          phoneNumber: '07700900789',
          isVerified: true
        }
      }
    },
    include: { landlordProfile: true }
  });

  const davidLandlord = await prisma.user.upsert({
    where: { email: 'david@example.com' },
    update: {},
    create: {
      email: 'david@example.com',
      name: 'David Williams',
      password: hashedPassword,
      role: 'LANDLORD',
      landlordProfile: {
        create: {
          phoneNumber: '07700900321',
          isVerified: true
        }
      }
    },
    include: { landlordProfile: true }
  });

  const oakTreeLandlord = await prisma.user.upsert({
    where: { email: 'oaktree@example.com' },
    update: {},
    create: {
      email: 'oaktree@example.com',
      name: 'Oak Tree Lettings',
      password: hashedPassword,
      role: 'LANDLORD',
      landlordProfile: {
        create: {
          companyName: 'Oak Tree Lettings Ltd.',
          phoneNumber: '07700900654',
          isVerified: true
        }
      }
    },
    include: { landlordProfile: true }
  });

  // Student Users
  const studentUser = await prisma.user.upsert({
    where: { email: 'student@example.com' },
    update: {},
    create: {
      email: 'student@example.com',
      name: 'Alex Thompson',
      password: hashedPassword,
      role: 'STUDENT',
    },
  });

  const internationalStudent = await prisma.user.upsert({
    where: { email: 'international@example.com' },
    update: {},
    create: {
      email: 'international@example.com',
      name: 'Mei Zhang',
      password: hashedPassword,
      role: 'STUDENT',
    },
  });

  // Additional Student Users
  const gradStudent = await prisma.user.upsert({
    where: { email: 'grad@example.com' },
    update: {},
    create: {
      email: 'grad@example.com',
      name: 'James Peterson',
      password: hashedPassword,
      role: 'STUDENT',
    },
  });

  const medStudent = await prisma.user.upsert({
    where: { email: 'med@example.com' },
    update: {},
    create: {
      email: 'med@example.com',
      name: 'Sofia Rodriguez',
      password: hashedPassword,
      role: 'STUDENT',
    },
  });

  const csStudent = await prisma.user.upsert({
    where: { email: 'cs@example.com' },
    update: {},
    create: {
      email: 'cs@example.com',
      name: 'Raj Patel',
      password: hashedPassword,
      role: 'STUDENT',
    },
  });

  const artStudent = await prisma.user.upsert({
    where: { email: 'art@example.com' },
    update: {},
    create: {
      email: 'art@example.com',
      name: 'Emma Wilson',
      password: hashedPassword,
      role: 'STUDENT',
    },
  });

  console.log(`Seeded ${await prisma.user.count()} users`);

  // Seed Addresses (major London areas near universities)
  const camdenAddress = await prisma.address.create({
    data: {
      street: '27 Camden High Street',
      city: 'London',
      postalCode: 'NW1 7JE',
      country: 'UK'
    }
  });

  const kingsCrossAddress = await prisma.address.create({
    data: {
      street: '15 Pentonville Road',
      city: 'London',
      postalCode: 'N1 9JN',
      country: 'UK'
    }
  });

  const southKensingtonAddress = await prisma.address.create({
    data: {
      street: '45 Old Brompton Road',
      city: 'London',
      postalCode: 'SW7 3JP',
      country: 'UK'
    }
  });

  const shoreditchAddress = await prisma.address.create({
    data: {
      street: '88 Curtain Road',
      city: 'London',
      postalCode: 'EC2A 3AA',
      country: 'UK'
    }
  });

  const bloomsburyAddress = await prisma.address.create({
    data: {
      street: '23 Gower Street',
      city: 'London',
      postalCode: 'WC1E 6HJ',
      country: 'UK'
    }
  });

  // Additional London addresses
  const batterseaAddress = await prisma.address.create({
    data: {
      street: '52 Battersea Park Road',
      city: 'London',
      postalCode: 'SW11 4JP',
      country: 'UK'
    }
  });

  const greenwichAddress = await prisma.address.create({
    data: {
      street: '18 Greenwich High Road',
      city: 'London',
      postalCode: 'SE10 8NN',
      country: 'UK'
    }
  });

  const hackneyAddress = await prisma.address.create({
    data: {
      street: '63 Mare Street',
      city: 'London',
      postalCode: 'E8 4RG',
      country: 'UK'
    }
  });

  const fulhamAddress = await prisma.address.create({
    data: {
      street: '29 Fulham Broadway',
      city: 'London',
      postalCode: 'SW6 1EP',
      country: 'UK'
    }
  });

  const islingtonAddress = await prisma.address.create({
    data: {
      street: '114 Upper Street',
      city: 'London',
      postalCode: 'N1 1QP',
      country: 'UK'
    }
  });

  const clerkenwellAddress = await prisma.address.create({
    data: {
      street: '48 Exmouth Market',
      city: 'London',
      postalCode: 'EC1R 4QE',
      country: 'UK'
    }
  });

  const bayswaterAddress = await prisma.address.create({
    data: {
      street: '76 Westbourne Grove',
      city: 'London',
      postalCode: 'W2 5SH',
      country: 'UK'
    }
  });

  console.log(`Seeded ${await prisma.address.count()} addresses`);

  // Collection of all landlord users for random assignment to properties
  const landlords = [
    landlordUser, 
    individualLandlord, 
    premiumLandlord, 
    davidLandlord, 
    oakTreeLandlord
  ];

  // London neighborhood data for randomization
  const londonNeighborhoods = [
    { name: 'Camden', borough: 'Camden', latitude: 51.5390, longitude: -0.1426, tubeStation: 'Camden Town' },
    { name: 'Islington', borough: 'Islington', latitude: 51.5416, longitude: -0.1028, tubeStation: 'Angel' },
    { name: 'Shoreditch', borough: 'Hackney', latitude: 51.5229, longitude: -0.0777, tubeStation: 'Shoreditch High Street' },
    { name: 'Brixton', borough: 'Lambeth', latitude: 51.4626, longitude: -0.1159, tubeStation: 'Brixton' },
    { name: 'Greenwich', borough: 'Greenwich', latitude: 51.4826, longitude: -0.0096, tubeStation: 'Greenwich' },
    { name: 'Hampstead', borough: 'Camden', latitude: 51.5559, longitude: -0.1781, tubeStation: 'Hampstead' },
    { name: 'Notting Hill', borough: 'Kensington & Chelsea', latitude: 51.5139, longitude: -0.1969, tubeStation: 'Notting Hill Gate' },
    { name: 'Fulham', borough: 'Hammersmith & Fulham', latitude: 51.4734, longitude: -0.2216, tubeStation: 'Fulham Broadway' },
    { name: 'Clapham', borough: 'Lambeth', latitude: 51.4620, longitude: -0.1389, tubeStation: 'Clapham Common' },
    { name: 'Wimbledon', borough: 'Merton', latitude: 51.4214, longitude: -0.2051, tubeStation: 'Wimbledon' }
  ];

  // Property types for variety
  const propertyTypes = [
    'Studio', 
    'Apartment', 
    'House', 
    'Flat', 
    'Room in Shared House', 
    'Duplex'
  ];

  // Image URLs for properties (placeholder images)
  const propertyImages = [
    'https://images.unsplash.com/photo-1580587771525-78b9dba3b914',
    'https://images.unsplash.com/photo-1567496898669-ee935f5f647a',
    'https://images.unsplash.com/photo-1571939228382-b2f2b585ce15',
    'https://images.unsplash.com/photo-1484154218962-a197022b5858',
    'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267'
  ];

  // Collection of all amenity IDs for random assignment
  const allAmenities = [
    wifi, gym, parking, petFriendly, laundry, kitchen, billsIncluded, 
    smartTv, studyDesk, balcony, dishwasher, airConditioning, 
    securitySystem, furnished, roofTerrace, communalGarden, bicycleStorage, concierge
  ];

  // Seed Properties with enhanced details
  // Property 1 - Studio near UCL
  const prop1 = await prisma.property.create({
    data: {
      title: 'Modern Studio near UCL',
      description: 'A bright and contemporary studio apartment perfect for UCL students. Features include high-speed internet, fully equipped kitchen, and study area. Located just a 5-minute walk from UCL main campus and 2 minutes from Goodge Street station.',
      price: 1400,
      addressString: '23 Gower Street, London, WC1E 6HJ',
      borough: 'Camden',
      latitude: 51.5219,
      longitude: -0.1308,
      tubeStation: 'Goodge Street',
      propertyType: 'Studio',
      bedrooms: 1,
      bathrooms: 1,
      available: new Date('2025-09-01'),
      verified: true,
      ownerId: landlordUser.id,
      addressId: bloomsburyAddress.id,
      amenities: {
        connect: [
          { id: wifi.id }, 
          { id: kitchen.id }, 
          { id: laundry.id },
          { id: billsIncluded.id },
          { id: studyDesk.id }
        ],
      },
      media: {
        create: propertyImages.map((url, index) => ({
          url,
          type: 'IMAGE',
          order: index + 1
        }))
      },
    },
  });

  // Property 2 - South Kensington apartment
  const prop2 = await prisma.property.create({
    data: {
      title: 'Luxury 2 Bed Flat in South Kensington',
      description: 'Elegant and spacious two-bedroom apartment in the heart of South Kensington. Perfect for Imperial College students with its proximity to campus. Features include high ceilings, modern fixtures, designer furniture, and a private balcony overlooking a garden square. Walking distance to museums and South Kensington tube station.',
      price: 2800,
      addressString: '45 Old Brompton Road, London, SW7 3JP',
      borough: 'Kensington and Chelsea',
      latitude: 51.4985,
      longitude: -0.1749,
      tubeStation: 'South Kensington',
      propertyType: 'Apartment',
      bedrooms: 2,
      bathrooms: 2,
      available: new Date('2025-08-15'),
      verified: true,
      ownerId: landlordUser.id,
      addressId: southKensingtonAddress.id,
      amenities: {
        connect: [
          { id: wifi.id }, 
          { id: parking.id }, 
          { id: kitchen.id }, 
          { id: petFriendly.id },
          { id: smartTv.id },
          { id: balcony.id }
        ],
      },
      media: {
        create: propertyImages.map((url, index) => ({
          url,
          type: 'IMAGE',
          order: index + 1
        }))
      },
    },
  });

  // Property 3 - King's Cross one-bedroom
  const prop3 = await prisma.property.create({
    data: {
      title: 'Stylish 1 Bed Apartment near King\'s Cross',
      description: 'Contemporary one-bedroom apartment in the vibrant King\'s Cross area. Recently renovated with modern amenities including a fully fitted kitchen, spacious living area, and study corner. Ideal for students at Central Saint Martins or King\'s College London. Just 3 minutes from King\'s Cross St. Pancras with excellent transport links across London and to Europe.',
      price: 1950,
      addressString: '15 Pentonville Road, London, N1 9JN',
      borough: 'Islington',
      latitude: 51.5312,
      longitude: -0.1203,
      tubeStation: 'King\'s Cross',
      propertyType: 'Apartment',
      bedrooms: 1,
      bathrooms: 1,
      available: new Date('2025-09-15'),
      verified: true,
      ownerId: individualLandlord.id,
      addressId: kingsCrossAddress.id,
      amenities: {
        connect: [
          { id: wifi.id },
          { id: laundry.id },
          { id: kitchen.id },
          { id: studyDesk.id },
          { id: smartTv.id }
        ],
      },
      media: {
        create: propertyImages.map((url, index) => ({
          url,
          type: 'IMAGE',
          order: index + 1
        }))
      },
    },
  });

  // Property 4 - Shoreditch creative space
  const prop4 = await prisma.property.create({
    data: {
      title: 'Creative Loft Studio in Shoreditch',
      description: 'Unique loft-style studio in the heart of trendy Shoreditch. This bright and airy space features exposed brick walls, high ceilings, and large windows. Perfect for creative students at London College of Fashion or Guildhall School of Music & Drama. Surrounded by galleries, cafes, and the famous Brick Lane market. Fast bus routes to central London universities.',
      price: 1650,
      addressString: '88 Curtain Road, London, EC2A 3AA',
      borough: 'Hackney',
      latitude: 51.5244,
      longitude: -0.0806,
      tubeStation: 'Old Street',
      propertyType: 'Studio',
      bedrooms: 1,
      bathrooms: 1,
      available: new Date('2025-07-30'),
      verified: true,
      ownerId: individualLandlord.id,
      addressId: shoreditchAddress.id,
      amenities: {
        connect: [
          { id: wifi.id },
          { id: kitchen.id },
          { id: laundry.id },
          { id: billsIncluded.id }
        ],
      },
      media: {
        create: propertyImages.map((url, index) => ({
          url,
          type: 'IMAGE',
          order: index + 1
        }))
      },
    },
  });

  // Property 5 - Camden townhouse
  const prop5 = await prisma.property.create({
    data: {
      title: '3 Bedroom Townhouse in Camden',
      description: 'Spacious three-bedroom townhouse in vibrant Camden, ideal for student sharing. This fully furnished property spans three floors with modern kitchen, two bathrooms, and a small private garden. Perfect for UCL, SOAS, or Central Saint Martins students. Located close to Camden Market with great nightlife and music venues. Camden Town tube station just 5 minutes away.',
      price: 3200,
      addressString: '27 Camden High Street, London, NW1 7JE',
      borough: 'Camden',
      latitude: 51.5388,
      longitude: -0.1374,
      tubeStation: 'Camden Town',
      propertyType: 'House',
      bedrooms: 3,
      bathrooms: 2,
      available: new Date('2025-08-20'),
      verified: true,
      ownerId: landlordUser.id,
      addressId: camdenAddress.id,
      amenities: {
        connect: [
          { id: wifi.id },
          { id: kitchen.id },
          { id: laundry.id },
          { id: gym.id },
          { id: smartTv.id },
          { id: studyDesk.id }
        ],
      },
      media: {
        create: propertyImages.map((url, index) => ({
          url,
          type: 'IMAGE',
          order: index + 1
        }))
      },
    },
  });

  // Additional Properties
  
  // Notting Hill property
  const prop6 = await prisma.property.create({
    data: {
      title: 'Charming 2 Bed Apartment in Notting Hill',
      description: 'Experience the charm of Notting Hill in this beautifully renovated two-bedroom apartment. Located on a quiet tree-lined street, this property features a large open-plan kitchen/living area with high ceilings and original Victorian features. Both bedrooms are spacious with ample storage. Perfect for students at Imperial College or University of Westminster. Just a 7-minute walk to Notting Hill Gate tube station with easy access to Central, District, and Circle lines.',
      price: 2400,
      addressString: '76 Westbourne Grove, London, W2 5SH',
      borough: 'Kensington and Chelsea',
      latitude: 51.5147,
      longitude: -0.1959,
      tubeStation: 'Notting Hill Gate',
      propertyType: 'Apartment',
      bedrooms: 2,
      bathrooms: 1,
      available: new Date('2025-09-10'),
      verified: true,
      ownerId: individualLandlord.id,
      addressId: bayswaterAddress.id,
      amenities: {
        connect: [
          { id: wifi.id },
          { id: kitchen.id },
          { id: laundry.id },
          { id: dishwasher.id },
          { id: furnished.id },
          { id: bicycleStorage.id }
        ],
      },
      media: {
        create: propertyImages.map((url, index) => ({
          url,
          type: 'IMAGE',
          order: index + 1
        }))
      },
    },
  });

  // Greenwich Apartment
  const prop7 = await prisma.property.create({
    data: {
      title: 'Riverside 1 Bed Apartment in Greenwich',
      description: 'Modern one-bedroom apartment with stunning views of the Thames in historic Greenwich. This south-facing property features floor-to-ceiling windows, a private balcony, and contemporary furnishings. The building offers security, a communal roof garden, and bicycle storage. Ideal for students at University of Greenwich or Ravensbourne University. Just minutes from Greenwich Market, the Royal Observatory, and excellent transport links to central London.',
      price: 1800,
      addressString: '18 Greenwich High Road, London, SE10 8NN',
      borough: 'Greenwich',
      latitude: 51.4775,
      longitude: -0.0114,
      tubeStation: 'Greenwich',
      propertyType: 'Apartment',
      bedrooms: 1,
      bathrooms: 1,
      available: new Date('2025-08-25'),
      verified: true,
      ownerId: oakTreeLandlord.id,
      addressId: greenwichAddress.id,
      amenities: {
        connect: [
          { id: wifi.id },
          { id: kitchen.id },
          { id: balcony.id },
          { id: securitySystem.id },
          { id: communalGarden.id },
          { id: furnished.id }
        ],
      },
      media: {
        create: propertyImages.map((url, index) => ({
          url,
          type: 'IMAGE',
          order: index + 1
        }))
      },
    },
  });

  // Hackney Creative Space
  const prop8 = await prisma.property.create({
    data: {
      title: 'Artistic Loft Studio in Hackney',
      description: 'Unique converted warehouse studio in the heart of Hackney\'s vibrant arts district. This industrial-style space features exposed brick walls, wooden beams, and polished concrete floors. The large open-plan layout includes a sleeping area, kitchen space, and plenty of room for a home studio or workspace. Perfect for creative students at London College of Fashion or UAL. Surrounded by independent cafes, galleries, and a thriving arts community. Great bus connections and a short walk to Hackney Central Overground.',
      price: 1750,
      addressString: '63 Mare Street, London, E8 4RG',
      borough: 'Hackney',
      latitude: 51.5387,
      longitude: -0.0575,
      tubeStation: 'Hackney Central',
      propertyType: 'Studio',
      bedrooms: 1,
      bathrooms: 1,
      available: new Date('2025-09-05'),
      verified: true,
      ownerId: davidLandlord.id,
      addressId: hackneyAddress.id,
      amenities: {
        connect: [
          { id: wifi.id },
          { id: kitchen.id },
          { id: billsIncluded.id },
          { id: furnished.id },
          { id: bicycleStorage.id }
        ],
      },
      media: {
        create: propertyImages.map((url, index) => ({
          url,
          type: 'IMAGE',
          order: index + 1
        }))
      },
    },
  });

  // Luxury Penthouse Battersea
  const prop9 = await prisma.property.create({
    data: {
      title: 'Luxury Penthouse with Thames Views in Battersea',
      description: 'Exceptional two-bedroom penthouse in the prestigious Battersea Power Station development. This premium property offers unparalleled views of the Thames and London skyline from its wraparound terrace. Features include floor-to-ceiling windows, designer kitchen with integrated appliances, marble bathrooms, and smart home technology throughout. Residents enjoy access to a 24-hour concierge, state-of-the-art gym, spa, and private cinema. Ideally located for students at the Royal College of Art or London Business School, with the new Northern Line extension providing direct access to central London.',
      price: 3500,
      addressString: '52 Battersea Park Road, London, SW11 4JP',
      borough: 'Wandsworth',
      latitude: 51.4791,
      longitude: -0.1465,
      tubeStation: 'Battersea Power Station',
      propertyType: 'Penthouse',
      bedrooms: 2,
      bathrooms: 2,
      available: new Date('2025-08-01'),
      verified: true,
      ownerId: premiumLandlord.id,
      addressId: batterseaAddress.id,
      amenities: {
        connect: [
          { id: wifi.id },
          { id: kitchen.id },
          { id: gym.id },
          { id: airConditioning.id },
          { id: securitySystem.id },
          { id: concierge.id },
          { id: balcony.id },
          { id: smartTv.id },
          { id: parking.id }
        ],
      },
      media: {
        create: propertyImages.map((url, index) => ({
          url,
          type: 'IMAGE',
          order: index + 1
        }))
      },
    },
  });

  // Clerkenwell Designer Flat
  const prop10 = await prisma.property.create({
    data: {
      title: 'Designer 1 Bed Flat in Clerkenwell',
      description: 'Stylish one-bedroom apartment in a converted Victorian factory in trendy Clerkenwell. This architect-designed space features an intelligent layout, high ceilings, and large windows. Highlights include a bespoke kitchen with stone countertops, custom built-in storage, rainfall shower, and underfloor heating. Perfectly located for students at City University or UAL Central Saint Martins. A foodie\'s paradise with Exmouth Market on your doorstep and fantastic restaurants, cafes, and bars nearby. Well-connected with multiple bus routes and Farringdon station a short walk away.',
      price: 2100,
      addressString: '48 Exmouth Market, London, EC1R 4QE',
      borough: 'Islington',
      latitude: 51.5274,
      longitude: -0.1108,
      tubeStation: 'Farringdon',
      propertyType: 'Apartment',
      bedrooms: 1,
      bathrooms: 1,
      available: new Date('2025-09-15'),
      verified: true,
      ownerId: landlordUser.id,
      addressId: clerkenwellAddress.id,
      amenities: {
        connect: [
          { id: wifi.id },
          { id: kitchen.id },
          { id: laundry.id },
          { id: smartTv.id },
          { id: dishwasher.id },
          { id: studyDesk.id },
          { id: furnished.id }
        ],
      },
      media: {
        create: propertyImages.map((url, index) => ({
          url,
          type: 'IMAGE',
          order: index + 1
        }))
      },
    },
  });

  // Islington Period House
  const prop11 = await prisma.property.create({
    data: {
      title: 'Spacious 4 Bed Victorian House in Islington',
      description: 'Stunning four-bedroom Victorian townhouse on a peaceful residential street in Islington. This beautifully preserved property spans three floors and features original fireplaces, decorative moldings, and wooden floors throughout. The ground floor offers a large double reception room and extended kitchen-diner with bifold doors opening onto a landscaped garden. Perfect for a group of 4 students at UCL, City University, or Central Saint Martins. Located just minutes from the vibrant Upper Street with its shops, restaurants, and theaters. Angel tube station is a 10-minute walk providing Northern Line connections across London.',
      price: 3800,
      addressString: '114 Upper Street, London, N1 1QP',
      borough: 'Islington',
      latitude: 51.5387,
      longitude: -0.1028,
      tubeStation: 'Angel',
      propertyType: 'House',
      bedrooms: 4,
      bathrooms: 2,
      available: new Date('2025-08-20'),
      verified: true,
      ownerId: oakTreeLandlord.id,
      addressId: islingtonAddress.id,
      amenities: {
        connect: [
          { id: wifi.id },
          { id: kitchen.id },
          { id: laundry.id },
          { id: dishwasher.id },
          { id: smartTv.id },
          { id: studyDesk.id },
          { id: communalGarden.id }
        ],
      },
      media: {
        create: propertyImages.map((url, index) => ({
          url,
          type: 'IMAGE',
          order: index + 1
        }))
      },
    },
  });

  console.log(`Seeded ${await prisma.property.count()} properties`);

  // Add property stats for each named property
  console.log('Creating property statistics for named properties...');
  const namedProperties = [prop1, prop2, prop3, prop4, prop5, prop6, prop7, prop8, prop9, prop10, prop11];
  
  for (const property of namedProperties) {
    await createPropertyStats(property.id);
  }
  
  console.log(`Created statistics for ${namedProperties.length} named properties`);

  // Create sample inquiries for properties
  const inquiryMessages = [
    "I'm interested in viewing this property. Is it still available?",
    "Could you please provide more information about the utilities included in the rent?",
    "I'm a student at UCL. Is this property available for the next academic year?",
    "Are pets allowed in this property? I have a small, well-behaved cat.",
    "Is the security deposit equal to one month's rent?",
    "Can you tell me more about the neighborhood and local amenities?",
    "Is there high-speed internet available in the property?",
    "I'd like to arrange a viewing for this weekend if possible.",
    "Are the bills included in the monthly rent?",
    "How far is the property from the nearest tube station?",
  ];
  
  // Create inquiries for first few properties
  for (const property of [prop1, prop2, prop3, prop4, prop5]) {
    // Create 3-7 inquiries per property
    const inquiryCount = Math.floor(Math.random() * 5) + 3;
    
    for (let i = 0; i < inquiryCount; i++) {
      // Randomly select a student user
      const studentUsers = [studentUser, internationalStudent, gradStudent, medStudent, csStudent, artStudent];
      const randomUser = studentUsers[Math.floor(Math.random() * studentUsers.length)];
      
      // Randomly select a message
      const randomMessage = inquiryMessages[Math.floor(Math.random() * inquiryMessages.length)];
      
      // Random status
      const statusOptions = ["PENDING", "RESPONDED", "CLOSED"];
      const randomStatus = statusOptions[Math.floor(Math.random() * statusOptions.length)];
      
      // Random creation date within last 30 days
      const createdAt = new Date(Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000));
      
      // Inquiries are stored in the Inquiry model
      await prisma.$executeRaw`
        INSERT INTO "Inquiry" ("id", "propertyId", "userId", "message", "email", "phone", "moveInDate", "status", "createdAt", "updatedAt")
        VALUES (
          ${crypto.randomUUID()},
          ${property.id},
          ${randomUser.id},
          ${randomMessage},
          ${randomUser.email},
          ${"+44" + Math.floor(Math.random() * 10000000000).toString().padStart(10, '0')},
          ${new Date(Date.now() + Math.floor(Math.random() * 60 * 24 * 60 * 60 * 1000))},
          ${randomStatus},
          ${createdAt},
          ${new Date(Math.max(createdAt.getTime(), Date.now() - Math.floor(Math.random() * 15 * 24 * 60 * 60 * 1000)))}
        )
      `;
    }
  }
  
  console.log(`Seeded property inquiries for ${[prop1, prop2, prop3, prop4, prop5].length} properties`);

  // Seed Reviews with more detailed feedback
  await prisma.review.create({
    data: {
      rating: 5,
      comment: 'Absolutely perfect location for UCL students! The studio is modern, clean, and has everything I need. The landlord is very responsive to any issues. Fast internet and great study space made a huge difference during exam periods.',
      userId: studentUser.id,
      propertyId: prop1.id
    }
  });

  await prisma.review.create({
    data: {
      rating: 4,
      comment: 'Beautiful apartment in an amazing location. South Kensington is a fantastic area with museums and cafes nearby. The property itself is spacious and well-furnished. Only giving 4 stars because of some minor maintenance issues, but the landlord was quick to address them.',
      userId: studentUser.id,
      propertyId: prop2.id
    }
  });

  await prisma.review.create({
    data: {
      rating: 5,
      comment: 'This King\'s Cross apartment is perfect for international students! Being so close to the train station made traveling around London and back home during breaks very convenient. The apartment is exactly as shown in photos and Sarah is a wonderful landlord.',
      userId: internationalStudent.id,
      propertyId: prop3.id
    }
  });

  await prisma.review.create({
    data: {
      rating: 3,
      comment: 'The Shoreditch location is amazing and the loft-style space is really cool. However, it can be quite noisy on weekends due to nearby bars. Decent value for money considering the trendy area, but be prepared for the lively atmosphere!',
      userId: internationalStudent.id,
      propertyId: prop4.id
    }
  });

  // Additional Reviews for new properties
  await prisma.review.create({
    data: {
      rating: 5,
      comment: 'This Notting Hill apartment exceeded all my expectations! The location is perfect for getting to Imperial College, and the neighborhood has so much character. The flat itself is spacious, bright, and the period features add a special charm. Sarah was an excellent landlord who responded promptly to any queries. Highly recommend!',
      userId: studentUser.id,
      propertyId: prop6.id
    }
  });

  await prisma.review.create({
    data: {
      rating: 4,
      comment: 'Living in Greenwich was a wonderful experience during my studies. The views from this apartment are truly spectacular, especially at sunset. The property is well-maintained and modern, and having the balcony was perfect for studying with a view. The only downside was occasional noise from neighboring flats, but overall a great place to live.',
      userId: medStudent.id,
      propertyId: prop7.id
    }
  });

  await prisma.review.create({
    data: {
      rating: 5,
      comment: 'As an art student, this Hackney studio was the perfect inspiration! The industrial aesthetics and spacious layout gave me plenty of room to work on projects. The area is incredibly vibrant with so many creative people and venues nearby. David was a fantastic landlord who really understood the needs of creative students. I loved my time here!',
      userId: artStudent.id,
      propertyId: prop8.id
    }
  });

  await prisma.review.create({
    data: {
      rating: 5,
      comment: 'This Battersea penthouse is truly luxurious! The panoramic views of London are breathtaking, and the apartment itself is fitted with the highest quality furnishings. As a business student, I appreciated the quiet environment for studying, and the building facilities are exceptional. Premium London Properties provides impeccable service - well worth the investment for a special student experience.',
      userId: gradStudent.id,
      propertyId: prop9.id
    }
  });

  await prisma.review.create({
    data: {
      rating: 4,
      comment: 'The Clerkenwell flat is a designer\'s dream! The thoughtful layout makes great use of space, and the quality of the renovation is obvious. I loved being able to walk to my classes at Central Saint Martins. The area has fantastic food options and a great atmosphere. The only reason for 4 stars instead of 5 is that the flat can get quite warm in summer without air conditioning, but otherwise perfect!',
      userId: csStudent.id,
      propertyId: prop10.id
    }
  });

  await prisma.review.create({
    data: {
      rating: 5,
      comment: 'Our group of 4 students had an amazing year in this Islington house! The property is spacious enough that we each had our own private space while enjoying the communal areas. The garden was perfect for BBQs in the summer, and the location is ideal for accessing multiple universities. The landlord was responsive and fair. Would definitely recommend for student groups looking for quality accommodation.',
      userId: internationalStudent.id,
      propertyId: prop11.id
    }
  });

  await prisma.review.create({
    data: {
      rating: 4,
      comment: 'I stayed in this Notting Hill flat during my masters program and really enjoyed it. The neighborhood has a great mix of cultures and cuisines. Transportation to campus was easy, and I felt very safe in the area. The property itself is well-maintained with good natural light. The landlord was professional and respectful of privacy while being available when needed.',
      userId: gradStudent.id,
      propertyId: prop6.id
    }
  });

  await prisma.review.create({
    data: {
      rating: 3,
      comment: 'The Clerkenwell apartment is beautiful and stylish, but I found it slightly impractical for student life. While the location is excellent and the design impressive, some of the bespoke fixtures were delicate and I was constantly worried about damaging something. The landlord was helpful though, and the proximity to great food options was a definite plus.',
      userId: internationalStudent.id,
      propertyId: prop10.id
    }
  });

  console.log(`Seeded ${await prisma.review.count()} reviews`);

  // Seed Universities with enhanced details
  await prisma.university.upsert({
    where: { name: 'University College London (UCL)' },
    update: {},
    create: { 
      name: 'University College London (UCL)', 
      latitude: 51.5246, 
      longitude: -0.1339, 
      address: 'Gower St, London WC1E 6BT'
    }
  });

  await prisma.university.upsert({
    where: { name: 'Imperial College London' },
    update: {},
    create: { 
      name: 'Imperial College London', 
      latitude: 51.4988, 
      longitude: -0.1749, 
      address: 'Exhibition Rd, South Kensington, London SW7 2BX'
    }
  });

  // Additional universities
  await prisma.university.upsert({
    where: { name: 'King\'s College London' },
    update: {},
    create: { 
      name: 'King\'s College London', 
      latitude: 51.5115, 
      longitude: -0.1160, 
      address: 'Strand, London WC2R 2LS'
    }
  });

  await prisma.university.upsert({
    where: { name: 'London School of Economics (LSE)' },
    update: {},
    create: { 
      name: 'London School of Economics (LSE)', 
      latitude: 51.5144, 
      longitude: -0.1165, 
      address: 'Houghton St, London WC2A 2AE'
    }
  });

  await prisma.university.upsert({
    where: { name: 'Queen Mary University of London' },
    update: {},
    create: { 
      name: 'Queen Mary University of London', 
      latitude: 51.5246, 
      longitude: -0.0384, 
      address: 'Mile End Rd, London E1 4NS'
    }
  });

  await prisma.university.upsert({
    where: { name: 'City, University of London' },
    update: {},
    create: { 
      name: 'City, University of London', 
      latitude: 51.5279, 
      longitude: -0.1025, 
      address: 'Northampton Square, London EC1V 0HB'
    }
  });

  await prisma.university.upsert({
    where: { name: 'SOAS University of London' },
    update: {},
    create: { 
      name: 'SOAS University of London', 
      latitude: 51.5223, 
      longitude: -0.1298, 
      address: 'Thornhaugh St, London WC1H 0XG'
    }
  });

  await prisma.university.upsert({
    where: { name: 'University of Greenwich' },
    update: {},
    create: { 
      name: 'University of Greenwich', 
      latitude: 51.4827, 
      longitude: -0.0096, 
      address: 'Old Royal Naval College, Park Row, London SE10 9LS'
    }
  });

  await prisma.university.upsert({
    where: { name: 'University of Westminster' },
    update: {},
    create: { 
      name: 'University of Westminster', 
      latitude: 51.5173, 
      longitude: -0.1445, 
      address: '309 Regent St, London W1B 2HW'
    }
  });

  await prisma.university.upsert({
    where: { name: 'University of the Arts London' },
    update: {},
    create: { 
      name: 'University of the Arts London', 
      latitude: 51.5176, 
      longitude: -0.1233, 
      address: '272 High Holborn, London WC1V 7EY'
    }
  });

  console.log(`Seeded ${await prisma.university.count()} universities`);

  // Seed Transport Nodes with more London tube stations
  await prisma.transportNode.upsert({
    where: { id: 'goodge-street' },
    update: {},
    create: {
      id: 'goodge-street',
      name: 'Goodge Street',
      type: 'TUBE',
      latitude: 51.5207, 
      longitude: -0.1341,
      lines: 'Northern'
    }
  });

  await prisma.transportNode.upsert({
    where: { id: 'south-kensington' },
    update: {},
    create: {
      id: 'south-kensington',
      name: 'South Kensington',
      type: 'TUBE',
      latitude: 51.4941, 
      longitude: -0.1738,
      lines: 'District, Circle, Piccadilly'
    }
  });

  await prisma.transportNode.upsert({
    where: { id: 'kings-cross' },
    update: {},
    create: {
      id: 'kings-cross',
      name: 'King\'s Cross St. Pancras',
      type: 'TUBE',
      latitude: 51.5309, 
      longitude: -0.1233,
      lines: 'Circle, Hammersmith & City, Metropolitan, Northern, Piccadilly, Victoria'
    }
  });

  await prisma.transportNode.upsert({
    where: { id: 'old-street' },
    update: {},
    create: {
      id: 'old-street',
      name: 'Old Street',
      type: 'TUBE',
      latitude: 51.5257, 
      longitude: -0.0883,
      lines: 'Northern'
    }
  });

  await prisma.transportNode.upsert({
    where: { id: 'camden-town' },
    update: {},
    create: {
      id: 'camden-town',
      name: 'Camden Town',
      type: 'TUBE',
      latitude: 51.5394, 
      longitude: -0.1425,
      lines: 'Northern'
    }
  });

  await prisma.transportNode.upsert({
    where: { id: 'angel' },
    update: {},
    create: {
      id: 'angel',
      name: 'Angel',
      type: 'TUBE',
      latitude: 51.5326, 
      longitude: -0.1051,
      lines: 'Northern'
    }
  });

  await prisma.transportNode.upsert({
    where: { id: 'oxford-circus' },
    update: {},
    create: {
      id: 'oxford-circus',
      name: 'Oxford Circus',
      type: 'TUBE',
      latitude: 51.5152, 
      longitude: -0.1418,
      lines: 'Bakerloo, Central, Victoria'
    }
  });

  await prisma.transportNode.upsert({
    where: { id: 'green-park' },
    update: {},
    create: {
      id: 'green-park',
      name: 'Green Park',
      type: 'TUBE',
      latitude: 51.5067, 
      longitude: -0.1428,
      lines: 'Jubilee, Piccadilly, Victoria'
    }
  });

  await prisma.transportNode.upsert({
    where: { id: 'notting-hill-gate' },
    update: {},
    create: {
      id: 'notting-hill-gate',
      name: 'Notting Hill Gate',
      type: 'TUBE',
      latitude: 51.5094, 
      longitude: -0.1967,
      lines: 'Central, Circle, District'
    }
  });

  await prisma.transportNode.upsert({
    where: { id: 'greenwich' },
    update: {},
    create: {
      id: 'greenwich',
      name: 'Greenwich',
      type: 'RAIL',
      latitude: 51.4781, 
      longitude: -0.0149,
      lines: 'DLR, National Rail'
    }
  });

  await prisma.transportNode.upsert({
    where: { id: 'hackney-central' },
    update: {},
    create: {
      id: 'hackney-central',
      name: 'Hackney Central',
      type: 'RAIL',
      latitude: 51.5467, 
      longitude: -0.0558,
      lines: 'Overground'
    }
  });

  await prisma.transportNode.upsert({
    where: { id: 'clapham-common' },
    update: {},
    create: {
      id: 'clapham-common',
      name: 'Clapham Common',
      type: 'TUBE',
      latitude: 51.4618, 
      longitude: -0.1384,
      lines: 'Northern'
    }
  });

  console.log(`Seeded ${await prisma.transportNode.count()} transport nodes`);

  // Generate a large number of additional randomized properties
  console.log('Creating additional sample properties...');
  const propertiesToCreate = 25; // Create 25 more properties
  const propertyPromises = [];

  // Create some property descriptions
  const propertyDescriptions = [
    "This bright and spacious accommodation is perfect for students looking for a convenient location near university facilities.",
    "A stunning property in the heart of London, offering exceptional living spaces with high-quality fixtures and fittings.",
    "Modern and stylish student accommodation with plenty of natural light and storage space.",
    "This charming property combines classic London architecture with modern interior design.",
    "Luxurious living designed with students in mind. This premium accommodation features generous living spaces.",
    "A cozy and well-maintained property perfect for student living.",
    "Contemporary student housing with an emphasis on creating ideal study environments.",
    "This exceptional accommodation offers the perfect balance between student living and sophisticated city lifestyle.",
    "Practical and efficient student living space with smart storage solutions and durable furnishings.",
    "A unique property with character and charm, offering students a distinctive living experience."
  ];

  for (let i = 0; i < propertiesToCreate; i++) {
    // Select random data from our collections
    const neighborhood = getRandomElement(londonNeighborhoods);
    const propertyType = getRandomElement(propertyTypes);
    const description = getRandomElement(propertyDescriptions);
    const randomAmenities = getRandomSubset(allAmenities, 3, 10);
    const price = Math.floor(Math.random() * 1500) + 600; // Random price between £600-£2100
    
    // Add small variations to coordinates
    const latVariation = (Math.random() - 0.5) * 0.01;
    const lngVariation = (Math.random() - 0.5) * 0.01;
    
    // Calculate bedrooms based on property type
    let bedrooms = 1;
    if (propertyType === 'Studio') {
      bedrooms = 0;
    } else if (propertyType === 'Room in Shared House') {
      bedrooms = 1;
    } else {
      bedrooms = Math.floor(Math.random() * 3) + 1; // 1-3 bedrooms
    }
    
    // Bathrooms usually fewer than bedrooms
    const bathrooms = Math.max(1, Math.min(bedrooms, Math.floor(Math.random() * 2) + 1));
    
    // Choose a random landlord
    const randomLandlord = getRandomElement(landlords);
    
    // Create the property without nested PropertyStat creation
    const propertyPromise = prisma.property.create({
      data: {
        title: `${propertyType} in ${neighborhood.name}`,
        description: description,
        price: price,
        addressString: `${Math.floor(Math.random() * 100) + 1} ${neighborhood.name} Road, London`,
        borough: neighborhood.borough,
        latitude: neighborhood.latitude + latVariation,
        longitude: neighborhood.longitude + lngVariation,
        tubeStation: neighborhood.tubeStation,
        propertyType: propertyType,
        bedrooms: bedrooms,
        bathrooms: bathrooms,
        available: getRandomFutureDate(),
        verified: Math.random() > 0.2, // 80% of properties are verified
        ownerId: randomLandlord.id,
        
        // Connect random amenities
        amenities: {
          connect: randomAmenities.map(amenity => ({ id: amenity.id }))
        },
        
        // Add random media (1-3 images)
        media: {
          createMany: {
            data: getRandomSubset(propertyImages, 1, 3).map((url, index) => ({
              url,
              type: 'IMAGE',
              order: index + 1
            }))
          }
        }
      }
    });
    
    propertyPromises.push(propertyPromise);
  }
  
  // Wait for all properties to be created
  const createdProperties = await Promise.all(propertyPromises);
  console.log(`Generated ${propertiesToCreate} additional properties with randomized data.`);

  // Create stats for each additional property
  console.log('Creating property statistics for additional properties...');
  for (const property of createdProperties) {
    await createPropertyStats(property.id);
  }
  
  console.log(`Created statistics for ${createdProperties.length} additional properties`);
  console.log(`Total properties: ${await prisma.property.count()}`);

  console.log(`Seeding completed!`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
