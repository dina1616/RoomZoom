# RoomZoom - Student Housing Platform

A web application for students to find and review housing options in London.

## Getting Started

### Prerequisites

- Node.js (v18 or later)
- SQLite (included, no separate installation needed)
- Docker and Docker Compose (optional, for PostgreSQL setup)

### Installation

#### Option 1: Local Setup with SQLite (Recommended)

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/RoomZoom.git
   cd RoomZoom
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Set up environment variables
   - Copy `.env.example` to `.env.local`
   ```bash
   cp .env.example .env.local
   ```
   - Update the `JWT_SECRET` in `.env.local` with a strong random string

4. Set up the database
   ```bash
   npx prisma generate
   npx prisma db push
   npx prisma db seed
   ```

5. Start the development server
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

#### Option 2: Docker Setup with PostgreSQL (Advanced)

To use PostgreSQL instead of SQLite, you need to:

1. Update the database configuration:
   - In `prisma/schema.prisma`: Uncomment the PostgreSQL provider and comment out SQLite
   - In `.env.local`: Uncomment the PostgreSQL URL and comment out the SQLite one

2. Follow the Docker setup instructions:

   ```bash
   ./docker-setup.sh
   ```

   Or manually with Docker Compose:
   ```bash
   docker-compose up -d
   docker-compose exec web npx prisma migrate dev
   docker-compose exec web npx prisma db seed
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

### Using for Production

For production deployment with PostgreSQL:

```bash
# Build and start the production containers
docker-compose -f docker-compose.production.yml up -d

# Run migrations
docker-compose -f docker-compose.production.yml exec web npx prisma migrate deploy
```

## Features

- Property listings with detailed information
- Map-based property search
- User reviews and ratings
- Internationalization support (English, French, Arabic)
- Landlord and student accounts
- Property verification system

## Tech Stack

- Next.js 14 (App Router)
- Prisma ORM
- SQLite (default) / PostgreSQL (optional)
- React Leaflet for maps
- next-intl for internationalization
- TailwindCSS for styling

## Environment Variables

The following environment variables are required:

- `JWT_SECRET`: Secret key for JWT token generation
- `DATABASE_URL`: Database connection string (SQLite by default)

Optional variables:
- `MAPBOX_API_KEY`: For map features (if using Mapbox)

## Switching Between SQLite and PostgreSQL

### To use SQLite (default):

1. In `prisma/schema.prisma`:
   ```prisma
   datasource db {
     provider = "sqlite"
     // provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```

2. In `.env.local`:
   ```
   DATABASE_URL="file:./dev.db"
   # DATABASE_URL="postgresql://postgres:postgres@localhost:5432/roomzoom?schema=public"
   ```

3. Run migrations and seed:
   ```bash
   npx prisma migrate reset
   ```

### To use PostgreSQL:

1. In `prisma/schema.prisma`:
   ```prisma
   datasource db {
     // provider = "sqlite"
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```

2. In `.env.local`:
   ```
   # DATABASE_URL="file:./dev.db"
   DATABASE_URL="postgresql://postgres:postgres@localhost:5432/roomzoom?schema=public"
   ```

3. Start PostgreSQL (via Docker or local installation) and run migrations:
   ```bash
   npx prisma migrate reset
   ```

## Docker Container Management

### Basic Commands

```bash
# Start the development environment
docker-compose up -d

# View logs
docker-compose logs -f

# Stop containers
docker-compose down

# Access the PostgreSQL database
docker-compose exec postgres psql -U postgres -d roomzoom

# Run Prisma Studio
docker-compose exec web npx prisma studio
```

### Production Deployment

```bash
# Start production containers
docker-compose -f docker-compose.production.yml up -d

# View production logs
docker-compose -f docker-compose.production.yml logs -f

# Stop production containers
docker-compose -f docker-compose.production.yml down

# Backup the database
docker-compose -f docker-compose.production.yml exec postgres pg_dump -U postgres -d roomzoom > backup_$(date +%Y%m%d).sql
```

## License

[MIT](LICENSE)
