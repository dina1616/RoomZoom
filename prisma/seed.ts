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

  console.log(`Seeded ${await prisma.address.count()} addresses`);

  // Enhanced Property Image URLs with realistic images
  const propertyImages = {
    'studio': [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2'
    ],
    'flat1bed': [
      'https://images.unsplash.com/photo-1560185893-a55cbc8c57e8',
      'https://images.unsplash.com/photo-1560185007-c5ca9d2c014d',
      'https://images.unsplash.com/photo-1564078516393-cf04bd966897'
    ],
    'flat2bed': [
      'https://images.unsplash.com/photo-1560448204-603b3fc33ddc',
      'https://images.unsplash.com/photo-1567767292278-a4f21aa2d36e',
      'https://images.unsplash.com/photo-1533090161767-e6ffed986c88'
    ],
    'house3bed': [
      'https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83',
      'https://images.unsplash.com/photo-1560184897-ae75f418493e',
      'https://images.unsplash.com/photo-1560185008-a33f5c736a5d'
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
    where: { name: 'Queen Mary University of London' },
    update: {},
    create: { 
      name: 'Queen Mary University of London', 
      latitude: 51.5246, 
      longitude: -0.0414, 
      address: 'Mile End Rd, London E1 4NS'
    }
  });

  console.log(`Seeded ${await prisma.university.count()} universities`);

  // Seed Transport Nodes with more London tube stations
  await prisma.transportNode.upsert({
    where: { id: 'goodge-street' },
    update: {},
    create: { 
      id: 'goodge-street',
      name: 'Goodge Street Station', 
      type: 'TUBE_STATION', 
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
      name: 'South Kensington Station', 
      type: 'TUBE_STATION', 
      latitude: 51.4941, 
      longitude: -0.1737, 
      lines: 'District, Circle, Piccadilly' 
    }
  });

  await prisma.transportNode.upsert({
    where: { id: 'kings-cross' },
    update: {},
    create: { 
      id: 'kings-cross',
      name: 'King\'s Cross St. Pancras', 
      type: 'TUBE_STATION', 
      latitude: 51.5308, 
      longitude: -0.1238, 
      lines: 'Circle, Hammersmith & City, Metropolitan, Northern, Piccadilly, Victoria' 
    }
  });

  await prisma.transportNode.upsert({
    where: { id: 'old-street' },
    update: {},
    create: { 
      id: 'old-street',
      name: 'Old Street Station', 
      type: 'TUBE_STATION', 
      latitude: 51.5255, 
      longitude: -0.0887, 
      lines: 'Northern' 
    }
  });

  await prisma.transportNode.upsert({
    where: { id: 'camden-town' },
    update: {},
    create: { 
      id: 'camden-town',
      name: 'Camden Town Station', 
      type: 'TUBE_STATION', 
      latitude: 51.5392, 
      longitude: -0.1426, 
      lines: 'Northern' 
    }
  });

  await prisma.transportNode.upsert({
    where: { id: 'holborn' },
    update: {},
    create: { 
      id: 'holborn',
      name: 'Holborn Station', 
      type: 'TUBE_STATION', 
      latitude: 51.5174, 
      longitude: -0.1196, 
      lines: 'Central, Piccadilly' 
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
