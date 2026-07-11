# Next.js + Shadcn UI + Tailwind + Supabase Template

A modern, production-ready full-stack web application template combining Next.js, Shadcn UI, Tailwind CSS, and Supabase.

## 🚀 Tech Stack

- **Next.js 16+** - React framework with App Router
- **Shadcn/ui** - Beautiful, accessible React components
- **Tailwind CSS** - Utility-first CSS framework
- **Supabase** - PostgreSQL database with authentication
- **TypeScript** - Type safety across the project

## 📋 Prerequisites

- Node.js 18+ and npm/yarn
- A Supabase account (free tier available at https://supabase.com)

## 🔧 Initial Setup

### 1. Create a Supabase Project

1. Go to https://supabase.com and sign up
2. Create a new project
3. In the project settings, copy:
   - Project URL (NEXT_PUBLIC_SUPABASE_URL)
   - Anon Key (NEXT_PUBLIC_SUPABASE_ANON_KEY)

### 2. Configure Environment Variables

Update `.env.local` with your Supabase credentials:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see your app.

## 📁 Project Structure

```
├── app/
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Home page
│   ├── login/
│   │   └── page.tsx        # Login page
│   └── dashboard/
│       └── page.tsx        # Dashboard page
├── components/
│   ├── ui/                 # Shadcn UI components
│   ├── LoginComponent.tsx  # Login form component
│   └── DashboardComponent.tsx  # Dashboard component
├── lib/
│   ├── supabase.ts         # Supabase client
│   └── utils.ts            # Utility functions
├── .env.local              # Environment variables
├── tailwind.config.ts      # Tailwind configuration
└── tsconfig.json           # TypeScript configuration
```

## 🔐 Authentication Setup

### Enable Email/Password Auth in Supabase

1. Go to your Supabase Dashboard
2. Click on **Authentication** in the left sidebar
3. Go to **Providers** and ensure **Email** is enabled
4. (Optional) Enable other providers: Google, GitHub, etc.

## 🎨 Adding Shadcn Components

Add new components using the CLI:

```bash
npx shadcn@latest add card
npx shadcn@latest add input
npx shadcn@latest add dialog
```

## 💾 Database: Tables & Queries

### Create a Table in Supabase

Go to SQL Editor and run:

```sql
CREATE TABLE users_profile (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Query Data with Supabase Client

```typescript
import { supabase } from '@/lib/supabase'

// Fetch data
const { data, error } = await supabase
  .from('users_profile')
  .select('*')

// Insert data
const { data, error } = await supabase
  .from('users_profile')
  .insert([{ email, full_name }])
```

## 📦 Available Scripts

```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run start      # Start production server
npm run lint       # Run ESLint
```

## 🚀 Deployment on Vercel

1. Push your code to GitHub
2. Import the repository in Vercel
3. Add environment variables:
   - NEXT_PUBLIC_SUPABASE_URL
   - NEXT_PUBLIC_SUPABASE_ANON_KEY
4. Deploy

## 📚 Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Shadcn/ui Components](https://ui.shadcn.com)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Supabase Documentation](https://supabase.com/docs)
