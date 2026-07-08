# Prescription App

A patient-only healthcare MVP for managing appointments and prescriptions.

## Tech Stack

- **Frontend**: Next.js 15 (App Router), TypeScript, React, Tailwind CSS
- **Backend**: Next.js Route Handlers
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js (Auth.js) with JWT sessions
- **File Storage**: AWS S3 (or S3-compatible)
- **Validation**: Zod
- **Forms**: React Hook Form

## Getting Started

### Prerequisites

- Node.js 18+ installed
- PostgreSQL database
- AWS S3 bucket (or S3-compatible storage)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` with your actual values:
- `DATABASE_URL`: Your PostgreSQL connection string
- `NEXTAUTH_SECRET`: Generate a random secret key
- `NEXTAUTH_URL`: Your app URL (http://localhost:3000 for development)
- AWS credentials for S3 storage

3. Set up the database:
```bash
npx prisma migrate dev --name init
```

4. Generate Prisma client:
```bash
npx prisma generate
```

5. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/
│   ├── (auth)/          # Authentication pages
│   │   ├── login/
│   │   └── register/
│   ├── (dashboard)/     # Protected dashboard pages
│   │   ├── profile/
│   │   ├── appointments/
│   │   └── layout.tsx
│   ├── api/             # API routes
│   └── layout.tsx
├── components/
│   ├── ui/              # Reusable UI components
│   ├── forms/           # Form components
│   ├── appointments/    # Appointment-specific components
│   └── profile/         # Profile-specific components
├── lib/
│   ├── auth.ts          # NextAuth configuration
│   └── prisma.ts        # Prisma client
├── prisma/
│   └── schema.prisma    # Database schema
├── types/               # TypeScript type definitions
└── utils/               # Utility functions
```

## Database Schema

- **User**: Authentication and user data
- **Profile**: Patient profile (1:1 with User)
- **Appointment**: Patient appointments (1:N with User)
- **Prescription**: Prescription files (1:N with Appointment)

## Features

### MVP Features

- User registration and login
- Profile management
- Appointment CRUD operations
- Prescription upload (PDF, JPG, PNG)
- Protected routes with authentication

### Future Enhancements

- Doctor accounts
- Admin dashboard
- Payment integration
- Messaging system
- Notifications
- Advanced scheduling

## Security

- All input validated with Zod
- Passwords hashed with bcrypt
- Protected API routes
- User data isolation
- Secure file uploads

## Deployment

This project is designed for deployment on Vercel.

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

## License

MIT
