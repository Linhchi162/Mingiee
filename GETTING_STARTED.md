# 🎯 Getting Started with Your Next.js + Shadcn UI + Tailwind + Supabase Template

Congratulations! Your full-stack web application template is ready to go! 🎉

## 📂 Project Location

Your project is located at: `d:\Mingoo\nextjs-app`

## ⚡ Quick Start (3 steps)

### Step 1: Set Up Supabase

1. Go to [supabase.com](https://supabase.com) and create a free account
2. Create a new project
3. Copy your **Project URL** and **Anon Key** from Settings → API
4. Paste them into `.env.local`:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   ```

### Step 2: Start Development Server

```bash
cd d:\Mingoo\nextjs-app
npm run dev
```

### Step 3: Visit Your App

Open http://localhost:3000 in your browser

---

## 📝 What's Included

### Pages
- **Home** (`/`) - Welcome page with feature overview
- **Login** (`/login`) - Authentication with Supabase
- **Dashboard** (`/dashboard`) - Protected user dashboard

### Components
- **LoginComponent** - Email/password authentication form
- **DashboardComponent** - User dashboard with logout button
- **Shadcn UI Button** - Reusable UI component

### Utilities
- **lib/supabase.ts** - Supabase client configuration
- **lib/utils.ts** - Tailwind CSS utilities

### Configuration Files
- **tailwind.config.ts** - Tailwind CSS configuration
- **components.json** - Shadcn UI configuration
- **.env.local** - Environment variables (placeholder)
- **tsconfig.json** - TypeScript configuration

---

## 🛠️ Common Development Tasks

### Add More Shadcn Components

```bash
# Navigate to project folder
cd d:\Mingoo\nextjs-app

# Add a component
npx shadcn@latest add card
npx shadcn@latest add input
npx shadcn@latest add dialog

# Use in your code
import { Card } from '@/components/ui/card'
```

### Create a New Page

```bash
# Create folder
mkdir -p app/newpage

# Create file: app/newpage/page.tsx
export default function NewPage() {
  return <h1>New Page</h1>
}
```

### Query Database with Supabase

```typescript
import { supabase } from '@/lib/supabase'

// Fetch data
const { data, error } = await supabase
  .from('your_table')
  .select('*')

// Insert data
const { data, error } = await supabase
  .from('your_table')
  .insert([{ column: 'value' }])

// Update data
const { data, error } = await supabase
  .from('your_table')
  .update({ column: 'new_value' })
  .eq('id', 1)
```

### Create Database Table in Supabase

1. Go to Supabase Dashboard → SQL Editor
2. Run query:
   ```sql
   CREATE TABLE tasks (
     id BIGSERIAL PRIMARY KEY,
     user_id UUID REFERENCES auth.users(id),
     title TEXT NOT NULL,
     created_at TIMESTAMP DEFAULT NOW()
   );
   ```

---

## 📚 Project Structure

```
nextjs-app/
├── app/                          # App Router pages
│   ├── page.tsx                 # Home page
│   ├── login/
│   │   └── page.tsx             # Login page
│   ├── dashboard/
│   │   └── page.tsx             # Dashboard page
│   ├── layout.tsx               # Root layout
│   └── globals.css              # Global styles
├── components/
│   ├── ui/                      # Shadcn UI components
│   │   └── button.tsx
│   ├── LoginComponent.tsx       # Login form
│   └── DashboardComponent.tsx   # Dashboard UI
├── lib/
│   ├── supabase.ts              # Supabase client
│   └── utils.ts                 # Utility functions
├── public/                       # Static assets
├── .env.local                   # Environment variables
├── tailwind.config.ts           # Tailwind config
├── tsconfig.json                # TypeScript config
├── next.config.ts               # Next.js config
├── package.json                 # Dependencies
└── README.md                    # Documentation
```

---

## 🔐 Authentication Flow

1. User goes to `/login`
2. Enters email and password
3. Clicks "Sign In"
4. Supabase authenticates the user
5. User redirected to `/dashboard`
6. Dashboard fetches user info and displays it

---

## 🚀 Deployment to Vercel

### Prerequisites
- GitHub account
- GitHub repository with your code
- Vercel account

### Steps

1. Push to GitHub:
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. Go to [vercel.com](https://vercel.com)

3. Click "New Project"

4. Import your GitHub repository

5. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

6. Click "Deploy"

Your site is now live! 🎉

---

## 📖 Resources & Documentation

### Official Documentation
- [Next.js Docs](https://nextjs.org/docs)
- [Shadcn/ui Components](https://ui.shadcn.com)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Supabase Docs](https://supabase.com/docs)

### Guides
- [Setup Guide](./SETUP_GUIDE.md) - Detailed setup instructions
- [README.md](./README.md) - Full project documentation

### Helpful Links
- [Next.js App Router](https://nextjs.org/docs/app)
- [Supabase Authentication](https://supabase.com/docs/guides/auth)
- [Tailwind CSS Utility Classes](https://tailwindcss.com/docs/utility-first)
- [React Hooks](https://react.dev/reference/react)

---

## 🐛 Troubleshooting

| Problem | Solution |
|---------|----------|
| Port 3000 already in use | Change port: `npm run dev -- -p 3001` |
| Styles not showing | Restart dev server: `npm run dev` |
| Build fails | Clear .next folder: `rm -r .next` then rebuild |
| "Cannot find module" | Run `npm install` again |
| Supabase connection error | Check `.env.local` for correct credentials |
| Authentication not working | Verify Email provider is enabled in Supabase |

---

## 💡 Tips & Best Practices

1. **Use TypeScript** - Define interfaces for type safety
2. **Leverage Shadcn Components** - Pre-built, accessible components
3. **Keep components small** - Single responsibility principle
4. **Use API routes** - Create `/app/api/` for backend logic
5. **Environment variables** - Never commit secrets to git
6. **Testing** - Add tests before deployment

---

## 🎓 Learning Path

1. **Week 1**: Learn Next.js basics and create your first page
2. **Week 2**: Add Shadcn UI components and style your app
3. **Week 3**: Connect to Supabase and implement authentication
4. **Week 4**: Build features and deploy to Vercel

---

## 🤝 Need Help?

- Check the [SETUP_GUIDE.md](./SETUP_GUIDE.md) for detailed steps
- Review the [README.md](./README.md) for comprehensive documentation
- Visit official documentation links above
- Check browser console for error messages (F12)

---

## ✅ Checklist Before Going Live

- [ ] Set up Supabase account and project
- [ ] Configure `.env.local` with Supabase credentials
- [ ] Test authentication flow (login/logout)
- [ ] Test database queries
- [ ] Add more Shadcn components as needed
- [ ] Style your app with Tailwind CSS
- [ ] Test on mobile devices
- [ ] Set up GitHub repository
- [ ] Deploy to Vercel
- [ ] Set up custom domain (optional)

---

## 🎉 You're All Set!

Your Next.js + Shadcn UI + Tailwind + Supabase template is ready to use. 

Start building amazing web applications! 🚀

**Happy coding!**
