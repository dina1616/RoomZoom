const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function seedProperties() {
  console.log('Seeding properties...');

  try {
    // Create some sample properties
    const properties = [
      {
        title: 'Modern Studio in Camden',
        description: 'A bright and airy studio apartment in the heart of Camden with great natural light and modern furnishings. Perfect for students or young professionals.',
        price: 1200,
        address: '123 Camden High Street, London, NW1 7JE',
        borough: 'Camden',
        latitude: 51.5388,
        longitude: -0.1374,
        tubeStation: 'Camden Town',
        propertyType: 'Studio',
        bedrooms: 1,
        bathrooms: 1,
        available: new Date('2024-10-01'),
        images: '/images/properties/rz1.avif'
      },
      {
        title: 'Spacious 2-Bed in Greenwich',
        description: 'Beautiful 2 bedroom apartment with views of Greenwich Park. Recently renovated with modern kitchen and bathroom fixtures.',
        price: 1800,
        address: '45 Greenwich High Road, London, SE10 8JL',
        borough: 'Greenwich',
        latitude: 51.4769,
        longitude: -0.0147,
        tubeStation: 'Greenwich',
        propertyType: 'Apartment',
        bedrooms: 2,
        bathrooms: 1,
        available: new Date('2024-09-15'),
        images: '/images/properties/rz2.avif'
      },
      {
        title: 'Cozy Room in Shared House',
        description: 'Comfortable room in a friendly shared house, all bills included. Shared kitchen and living room with 3 other tenants.',
        price: 800,
        address: '78 Islington Park Street, London, N1 1PX',
        borough: 'Islington',
        latitude: 51.5432,
        longitude: -0.1041,
        tubeStation: 'Angel',
        propertyType: 'Room',
        bedrooms: 1,
        bathrooms: 1,
        available: new Date('2024-08-01'),
        images: '/images/properties/rz3.avif'
      },
      {
        title: 'Luxury 3-Bedroom Penthouse',
        description: 'Stunning penthouse apartment with panoramic views of London. Features include a private terrace, high-end appliances, and floor-to-ceiling windows.',
        price: 3500,
        address: '15 Canary Wharf, London, E14 5AB',
        borough: 'Tower Hamlets',
        latitude: 51.5055,
        longitude: -0.0246,
        tubeStation: 'Canary Wharf',
        propertyType: 'Penthouse',
        bedrooms: 3,
        bathrooms: 2,
        available: new Date('2024-11-01'),
        images: '/images/properties/rz1.avif'
      },
      {
        title: 'Charming Victorian House',
        description: 'Beautiful Victorian house with original features, garden, and modern amenities. Located in a quiet street but close to shops and transport.',
        price: 2800,
        address: '42 Clapham Common, London, SW4 7AB',
        borough: 'Lambeth',
        latitude: 51.4613,
        longitude: -0.1392,
        tubeStation: 'Clapham Common',
        propertyType: 'House',
        bedrooms: 4,
        bathrooms: 2,
        available: new Date('2024-09-01'),
        images: '/images/properties/rz2.avif'
      },
      {
        title: 'Modern Loft in Shoreditch',
        description: 'Stylish loft apartment in the heart of Shoreditch. Industrial design with exposed brick walls and large windows. Perfect for creatives.',
        price: 1600,
        address: '8 Brick Lane, London, E1 6RF',
        borough: 'Tower Hamlets',
        latitude: 51.5246,
        longitude: -0.0714,
        tubeStation: 'Shoreditch High Street',
        propertyType: 'Loft',
        bedrooms: 1,
        bathrooms: 1,
        available: new Date('2024-08-15'),
        images: '/images/properties/rz3.avif'
      },
      {
        title: 'Riverfront Apartment',
        description: 'Stunning apartment with direct river views. Floor-to-ceiling windows, balcony, and high-end finishes throughout.',
        price: 2200,
        address: '25 Thames Path, London, SE1 2TY',
        borough: 'Southwark',
        latitude: 51.5078,
        longitude: -0.0870,
        tubeStation: 'London Bridge',
        propertyType: 'Apartment',
        bedrooms: 2,
        bathrooms: 2,
        available: new Date('2024-10-15'),
        images: '/images/properties/rz1.avif'
      },
      {
        title: 'Cozy Studio near UCL',
        description: 'Compact but well-designed studio apartment, perfect for students. Just 5 minutes walk from UCL and close to all amenities.',
        price: 1100,
        address: '33 Gower Street, London, WC1E 6HH',
        borough: 'Camden',
        latitude: 51.5234,
        longitude: -0.1305,
        tubeStation: 'Goodge Street',
        propertyType: 'Studio',
        bedrooms: 1,
        bathrooms: 1,
        available: new Date('2024-09-01'),
        images: '/images/properties/rz2.avif'
      }
    ];

    // Find a user to associate as the owner (first one found)
    const user = await prisma.user.findFirst();
    
    if (!user) {
      console.log('No users found in the database. Creating a test user...');
      // Create a test user if none exists
      const testUser = await prisma.user.create({
        data: {
          email: 'test@example.com',
          name: 'Test User',
          password: 'password123',
          role: 'LANDLORD'
        }
      });
      
      console.log('Created test user:', testUser);
      
      // Add the user ID to all properties
      for (const property of properties) {
        property.ownerId = testUser.id;
      }
    } else {
      console.log('Using existing user as property owner:', user.id);
      // Add the user ID to all properties
      for (const property of properties) {
        property.ownerId = user.id;
      }
    }

    // Create the properties in the database
    for (const propertyData of properties) {
      await prisma.property.create({
        data: propertyData
      });
    }

    console.log(`Successfully seeded ${properties.length} properties!`);
  } catch (error) {
    console.error('Error seeding properties:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedProperties(); 