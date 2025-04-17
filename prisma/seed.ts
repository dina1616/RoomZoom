import { PrismaClient } from '@prisma/client';

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
  console.log(`Seeded ${await prisma.amenity.count()} amenities`);

  // Seed Users (Landlord and Student)
  // NOTE: In a real app, passwords should be properly hashed!
  const landlordUser = await prisma.user.upsert({
    where: { email: 'landlord@example.com' },
    update: {},
    create: {
      email: 'landlord@example.com',
      name: 'Test Landlord',
      password: 'password123', // HASH THIS in real app
      role: 'LANDLORD',
      landlordProfile: {
        create: {
            companyName: 'Test Properties Ltd.',
            phoneNumber: '01234567890',
            isVerified: true
        }
      }
    },
     include: { landlordProfile: true }
  });

  const studentUser = await prisma.user.upsert({
    where: { email: 'student@example.com' },
    update: {},
    create: {
      email: 'student@example.com',
      name: 'Test Student',
      password: 'password123', // HASH THIS in real app
      role: 'STUDENT',
    },
  });
  console.log(`Seeded ${await prisma.user.count()} users`);

  // Seed Addresses
  const address1 = await prisma.address.create({
      data: {
          street: '10 Downing Street',
          city: 'London',
          postalCode: 'SW1A 2AA',
          country: 'UK'
      }
  });
   const address2 = await prisma.address.create({
      data: {
          street: '221B Baker Street',
          city: 'London',
          postalCode: 'NW1 6XE',
          country: 'UK'
      }
  });
  console.log(`Seeded ${await prisma.address.count()} addresses`);

  // Seed Properties
  const prop1 = await prisma.property.create({
    data: {
      title: 'Modern Studio near UCL',
      description: 'A fantastic studio apartment perfect for students, close to university campus.',
      price: 1400,
      addressString: '10 Gower Street, London, WC1E 6DP', // Simple string address
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
      addressId: address1.id, // Link to structured address
      amenities: {
        connect: [{ id: wifi.id }, { id: kitchen.id }, { id: laundry.id }],
      },
      media: {
        create: [
          { url: '/images/properties/seed/prop1_1.jpg', type: 'IMAGE', order: 1 },
          { url: '/images/properties/seed/prop1_2.jpg', type: 'IMAGE', order: 2 },
        ],
      },
    },
  });

  const prop2 = await prisma.property.create({
    data: {
      title: '2 Bed Flat in South Kensington',
      description: 'Spacious flat ideal for sharing, near Imperial College and museums.',
      price: 2500,
      addressString: 'Exhibition Road, London, SW7 2BX', // Simple string address
      borough: 'Kensington and Chelsea',
      latitude: 51.4985,
      longitude: -0.1749,
      tubeStation: 'South Kensington',
      propertyType: 'Apartment',
      bedrooms: 2,
      bathrooms: 1,
      available: new Date('2025-08-15'),
      verified: true,
      ownerId: landlordUser.id,
      addressId: address2.id,
      amenities: {
        connect: [{ id: wifi.id }, { id: parking.id }, { id: kitchen.id }, {id: petFriendly.id}],
      },
       media: {
        create: [
          { url: '/images/properties/seed/prop2_1.jpg', type: 'IMAGE', order: 1 },
        ],
      },
    },
  });

  // Add more properties as needed...

  console.log(`Seeded ${await prisma.property.count()} properties`);

  // Seed Reviews
  await prisma.review.create({
      data: {
          rating: 5,
          comment: 'Great place, highly recommend!',
          userId: studentUser.id,
          propertyId: prop1.id
      }
  });
   await prisma.review.create({
      data: {
          rating: 4,
          comment: 'Good location, reasonable price.',
          userId: studentUser.id, // Same student reviewing another property
          propertyId: prop2.id
      }
  });
  console.log(`Seeded ${await prisma.review.count()} reviews`);

  // Seed Universities
  await prisma.university.upsert({
      where: { name: 'University College London (UCL)' },
      update: {},
      create: { name: 'University College London (UCL)', latitude: 51.5246, longitude: -0.1339, address: 'Gower St, London WC1E 6BT'}
  });
  await prisma.university.upsert({
      where: { name: 'Imperial College London' },
      update: {},
      create: { name: 'Imperial College London', latitude: 51.4988, longitude: -0.1749, address: 'Exhibition Rd, South Kensington, London SW7 2BX'}
  });
  console.log(`Seeded ${await prisma.university.count()} universities`);

  // Seed Transport Nodes
  await prisma.transportNode.upsert({
      where: { name: 'Goodge Street Station'}, // Use a unique constraint if defined, otherwise might need more complex upsert logic
      update: {},
      create: { name: 'Goodge Street Station', type: 'TUBE_STATION', latitude: 51.5207, longitude: -0.1341, lines: 'Northern' }
  });
   await prisma.transportNode.upsert({
      where: { name: 'South Kensington Station'},
      update: {},
      create: { name: 'South Kensington Station', type: 'TUBE_STATION', latitude: 51.4941, longitude: -0.1737, lines: 'District, Circle, Piccadilly' }
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
