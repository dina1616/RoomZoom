import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

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

  // Enhanced Property Image URLs with realistic images
  const propertyImages = {
    'studio': [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2',
      'https://images.unsplash.com/photo-1536376072261-38c75010e6c9',
      'https://images.unsplash.com/photo-1630699144867-37acec97df5a'
    ],
    'flat1bed': [
      'https://images.unsplash.com/photo-1560185893-a55cbc8c57e8',
      'https://images.unsplash.com/photo-1560185007-c5ca9d2c014d',
      'https://images.unsplash.com/photo-1564078516393-cf04bd966897',
      'https://images.unsplash.com/photo-1574362848149-11496d93a7c7',
      'https://images.unsplash.com/photo-1598928636135-d146006ff4be'
    ],
    'flat2bed': [
      'https://images.unsplash.com/photo-1560448204-603b3fc33ddc',
      'https://images.unsplash.com/photo-1567767292278-a4f21aa2d36e',
      'https://images.unsplash.com/photo-1533090161767-e6ffed986c88',
      'https://images.unsplash.com/photo-1556912167-f556f1f39fdf',
      'https://images.unsplash.com/photo-1560185127-6ed189bf02f4'
    ],
    'house3bed': [
      'https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83',
      'https://images.unsplash.com/photo-1560184897-ae75f418493e',
      'https://images.unsplash.com/photo-1560185008-a33f5c736a5d',
      'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf',
      'https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6'
    ],
    'penthouse': [
      'https://images.unsplash.com/photo-1600607686527-6fb886090705',
      'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d',
      'https://images.unsplash.com/photo-1600607687644-aac76f1583e2',
      'https://images.unsplash.com/photo-1613977257363-707ba9348227',
      'https://images.unsplash.com/photo-1602872030490-4a484a7b3ba6'
    ],
    'luxury': [
      'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0',
      'https://images.unsplash.com/photo-1600585154084-4e5fe7c39198',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c',
      'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea',
      'https://images.unsplash.com/photo-1600607687126-a2f994c74c63'
    ]
  };

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
        create: propertyImages.studio.map((url, index) => ({
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
        create: propertyImages.flat2bed.map((url, index) => ({
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
        create: propertyImages.flat1bed.map((url, index) => ({
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
        create: propertyImages.studio.map((url, index) => ({
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
        create: propertyImages.house3bed.map((url, index) => ({
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
        create: propertyImages.flat2bed.map((url, index) => ({
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
        create: propertyImages.flat1bed.map((url, index) => ({
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
        create: propertyImages.studio.map((url, index) => ({
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
        create: propertyImages.luxury.map((url, index) => ({
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
        create: propertyImages.flat1bed.map((url, index) => ({
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
        create: propertyImages.house3bed.map((url, index) => ({
          url,
          type: 'IMAGE',
          order: index + 1
        }))
      },
    },
  });

  console.log(`Seeded ${await prisma.property.count()} properties`);

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

  console.log(`Seeding finished.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
