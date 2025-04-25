
# HomerConnect Frontend

This is the frontend application for HomerConnect, a community calendar application for Homer, Alaska. Built with Next.js, React, TypeScript, and Tailwind CSS.

## Getting Started

First, install dependencies:

```bash
npm install
```

Then, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Environment Setup

Create a `.env.local` file in the root of the frontend application with the following variables:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Font System

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Inter](https://fonts.google.com/specimen/Inter), a clean and modern sans-serif font.

The font is configured in `layout.tsx` and applied via Tailwind CSS:

```typescript
// layout.tsx
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

// tailwind.config.js
theme: {
  extend: {
    fontFamily: {
      sans: ['var(--font-inter)'],
    },
  },
},
```

## Image Optimization

All images use the Next.js Image component for optimization:

- Always include width and height attributes to prevent layout shift
- Use the `h-auto` class to maintain aspect ratios
- Add the `priority` attribute for above-the-fold images

## Supabase Integration

The frontend connects to Supabase for data storage. The client is configured in `/src/utils/supabase/client.ts`.

## Building and Deployment

To build the application:

```bash
npm run build
```

To start the production server:

```bash
npm start
```

The recommended way to deploy your Next.js app is to use Replit's Deployment feature, which provides automated builds and deployments.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.
