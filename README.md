# RoomZoom

A modern platform designed to help students find and review housing options in London. RoomZoom simplifies the property search process with map-based exploration, detailed listings, and user reviews.

## Features

- **Property Listings**: Browse detailed information about student accommodations
- **Interactive Map Search**: Find properties near universities and transport links
- **User Reviews**: Read and write authentic reviews for properties
- **Multiple User Roles**: Student, Landlord, and Admin interfaces
- **Multi-language Support**: English, French, and Arabic interfaces
- **Property Verification System**: Verified badges for legitimate listings

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React, TailwindCSS
- **Backend**: Next.js API Routes
- **Database**: Prisma ORM with SQLite (default) or PostgreSQL
- **Maps**: React Leaflet for interactive maps
- **Internationalization**: next-intl
- **Authentication**: JWT-based auth with role-based access control

## Quick Start

### Development Setup

1. **Clone and Install**
   ```bash
   git clone https://github.com/yourusername/rz.git
   cd rz
   npm install
   ```

2. **Environment Setup**
   ```bash
   # Copy example env file and update JWT_SECRET
   cp .env.example .env.local
   ```

3. **Database Setup (SQLite - Default)**
   ```bash
   npx prisma generate
   npx prisma db push
   npx prisma db seed
   ```

4. **Start Development Server**
   ```bash
   npm run dev
   ```

5. **Access the Application**
   - Open [http://localhost:3000](http://localhost:3000) in your browser

### PostgreSQL Setup (Optional)

1. **Update Database Configuration**
   - In `prisma/schema.prisma`: Change provider to `postgresql`
   - Update DATABASE_URL in `.env.local`

2. **Run with Docker**
   ```bash
   docker-compose up -d
   docker-compose exec web npx prisma migrate dev
   docker-compose exec web npx prisma db seed
   ```

## Production Deployment

```bash
# Build and start production containers
docker-compose -f docker-compose.production.yml up -d

# Run migrations
docker-compose -f docker-compose.production.yml exec web npx prisma migrate deploy
```

## Comprehensive Project Structure

### Core Directories

```
rz/
├── src/                   # Application source code
│   ├── app/               # Next.js App Router pages
│   ├── components/        # Reusable React components
│   ├── lib/               # Core functionality and utilities
│   ├── hooks/             # Custom React hooks
│   ├── context/           # React Context providers
│   ├── messages/          # Internationalization files
│   ├── providers/         # Provider components
│   ├── types/             # TypeScript type definitions
│   ├── utils/             # Helper functions
│   ├── i18n/              # i18n configuration
│   ├── i18n.ts            # i18n setup
│   ├── globals.css        # Global CSS styles
│   └── middleware.ts      # Next.js middleware
├── prisma/                # Database setup and migrations
│   ├── schema.prisma      # Database schema
│   ├── seed.ts            # Seed data
│   └── migrations/        # Database migrations
├── public/                # Static assets
├── scripts/               # Utility scripts
└── docker-compose files   # Docker configurations
```

### Key Application Routes

- **`src/app/[locale]/page.tsx`**: Homepage with featured listings
- **`src/app/[locale]/property/[id]/page.tsx`**: Property details page
- **`src/app/[locale]/search/page.tsx`**: Search interface with map view
- **`src/app/[locale]/login/page.tsx`**: User login page
- **`src/app/[locale]/register/page.tsx`**: User registration page
- **`src/app/[locale]/profile/page.tsx`**: User profile page
- **`src/app/[locale]/dashboard/page.tsx`**: Landlord dashboard
- **`src/app/[locale]/dashboard/add-property/page.tsx`**: Add new property form
- **`src/app/[locale]/dashboard/edit-property/[id]/page.tsx`**: Edit existing property
- **`src/app/[locale]/admin/page.tsx`**: Admin dashboard

### Core Components

- **`src/components/PropertyCard.tsx`**: Display property summary in listings
- **`src/components/Map.tsx`**: Interactive map for property location
- **`src/components/ReviewForm.tsx`**: Submit property reviews
- **`src/components/PropertyDetails.tsx`**: Detailed property view
- **`src/components/SearchFilters.tsx`**: Filter controls for property search
- **`src/components/ImageGallery.tsx`**: Property images display
- **`src/components/Navbar.tsx`**: Main navigation component
- **`src/components/AuthForms/`**: Authentication-related forms
- **`src/components/PropertyForm.tsx`**: Form for creating and editing property listings
- **`src/components/LoadingSpinner.tsx`**: Reusable loading spinner component

### API Structure

- **`src/app/api/auth/`**: Authentication endpoints
  - **`login/route.ts`**: User login
  - **`register/route.ts`**: User registration
- **`src/app/api/properties/`**: Property management
  - **`route.ts`**: List/create properties
  - **`[id]/route.ts`**: Get/update/delete specific property
  - **`verify/[id]/route.ts`**: Property verification
- **`src/app/api/landlord/`**: Landlord-specific operations
  - **`properties/route.ts`**: Landlord's property listings
- **`src/app/api/reviews/`**: Review management
- **`src/app/api/users/`**: User management
- **`src/app/api/media/`**: Media file handling

### Database Models (from prisma/schema.prisma)

- **`User`**: User accounts with role-based access
- **`Property`**: Housing listings with details and location
- **`Review`**: User reviews for properties
- **`Amenity`**: Property features and facilities
- **`Address`**: Property location information
- **`LandlordProfile`**: Extended landlord information
- **`University`**: University location data
- **`Media`**: Property images and videos
- **`TransportNode`**: Transportation points like tube stations

### Authentication System

- **`src/lib/authUtils.ts`**: JWT token handling
- **`middleware.ts`**: Route protection and role-based access
- **`src/context/AuthContext.tsx`**: Authentication state management
- **`src/hooks/useAuth.tsx`**: Authentication hook for components

### User Roles and Permissions

#### Student Role
- **Permission Level**: Basic
- **Access**: Browse properties, save favorites, submit reviews
- **Key Routes**: /, /search, /property/[id], /profile
- **Protected Actions**: Adding reviews, saving favorites

#### Landlord Role
- **Permission Level**: Intermediate
- **Access**: All student permissions + property management
- **Key Routes**: /dashboard, /dashboard/properties, /dashboard/properties/new
- **Protected Actions**: Property creation, editing, responding to reviews

#### Admin Role
- **Permission Level**: Advanced
- **Access**: Full system access
- **Key Routes**: /admin, /admin/users, /admin/properties, /admin/reviews
- **Protected Actions**: User management, property verification, content moderation

### Internationalization Structure

- **`src/messages/`**: Translation files by language
  - **`en.json`**: English translations
  - **`fr.json`**: French translations
  - **`ar.json`**: Arabic translations
- **`src/i18n/`**: Configuration for language support
- **`src/app/[locale]/`**: Locale-specific route groups

### Docker Configuration

- **`docker-compose.yml`**: Development environment
  - Web service (Next.js application)
  - PostgreSQL database
- **`docker-compose.production.yml`**: Production setup
  - Optimized build settings
  - Volume persistence
  - Health checks

### Testing Structure

- **`jest.config.js`**: Jest configuration
- **`cypress.config.ts`**: Cypress configuration
- **`__tests__/`**: Unit and integration tests
- **`cypress/`**: End-to-end tests

## User Roles

- **Students**: Browse listings, write reviews, save favorites
- **Landlords**: Create and manage property listings
- **Admins**: Verify properties, manage users and content

## Environment Variables

- `DATABASE_URL`: Database connection string
- `JWT_SECRET`: Secret for authentication tokens
- `MAPBOX_API_KEY` (optional): For enhanced map features

## Docker Commands

```bash
# Development
docker-compose up -d               # Start services
docker-compose logs -f             # View logs
docker-compose down                # Stop services

# Production
docker-compose -f docker-compose.production.yml up -d
docker-compose -f docker-compose.production.yml down
```

## Running Tests

```bash
npm test                           # Run Jest tests
npm run cypress                    # Run Cypress E2E tests
```

## License

[MIT](LICENSE)
