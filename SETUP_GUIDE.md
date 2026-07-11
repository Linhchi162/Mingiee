# 📖 Quick Setup Guide

## Step 1: Create Supabase Account & Project

1. Visit [supabase.com](https://supabase.com)
2. Sign up or log in
3. Click "New Project"
4. Fill in project details:
   - **Name**: Your project name
   - **Database Password**: Strong password
   - **Region**: Choose closest to you

5. Wait for project to initialize (~2 minutes)

## Step 2: Get Your API Keys

1. Go to **Settings** → **API**
2. Copy these values:
   - **Project URL** 
   - **Anon (public) Key**

## Step 3: Configure Environment Variables

1. Open `.env.local` in the project root
2. Replace placeholders:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_url_here
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key_here
   ```

## Step 4: Run the Development Server

```bash
npm run dev
```

Visit http://localhost:3000 in your browser.

## Step 5: Enable Authentication

1. In Supabase Dashboard → **Authentication**
2. Go to **Providers** tab
3. Ensure **Email** is enabled (toggle to ON)
4. Save

## Step 6: Test Authentication

1. Go to http://localhost:3000/login
2. Create an account with:
   - Email: test@example.com
   - Password: Any password

3. After login, you'll be redirected to dashboard

## Common Tasks

### Add a New Component

```bash
npx shadcn@latest add button
npx shadcn@latest add input
```

Then use in your component:
```tsx
import { Button } from '@/components/ui/button'
```

### Create a Database Table

Go to Supabase → **SQL Editor** and run:

```sql
CREATE TABLE tasks (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  title TEXT NOT NULL,
  description TEXT,
  completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Fetch Data from Database

```typescript
const { data, error } = await supabase
  .from('tasks')
  .select('*')
  .eq('user_id', userId)
```

### Add a New Page

1. Create folder: `app/mypage/`
2. Create file: `app/mypage/page.tsx`
3. Add component:
   ```tsx
   export default function MyPage() {
     return <h1>My Page</h1>
   }
   ```

## Troubleshooting

| Issue | Solution |
|-------|----------|
| "Environment variables not loaded" | Restart dev server after updating `.env.local` |
| "Supabase connection failed" | Verify URL and Key in `.env.local` |
| "Styles not applying" | Clear `.next` folder and restart server |
| "Cannot find module" | Run `npm install` again |

## Next Steps

1. ✅ Create Supabase project
2. ✅ Configure environment variables
3. ✅ Run development server
4. ✅ Test authentication
5. → Create your first feature
6. → Deploy to Vercel

## Deployment Checklist

- [ ] Push code to GitHub
- [ ] Import repo to Vercel
- [ ] Add environment variables in Vercel
- [ ] Deploy
- [ ] Visit your live site

Happy coding! 🚀
