# Runway Inventory Frontend

The frontend application for the Runway Inventory Management System. Built with Next.js, Tailwind CSS, and Firebase Authentication.

## Overview

The client provides a responsive inventory interface with:

- Login and protected pages
- Item creation with image upload
- Search and filter inventory
- Modern modal item details
- Role-aware actions for admins and managers

## Quick Start

### Install

```bash
cd client
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Build

```bash
npm run build
npm start
```

## Environment

Create `client/.env.local` with:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=1234567890
NEXT_PUBLIC_FIREBASE_APP_ID=1:1234567890:web:abcdef123456
NEXT_PUBLIC_API_URL=http://localhost:5000
```

## Pages

- `/` — dashboard landing page
- `/login` — authentication page
- `/search` — inventory search and results
- `/add-item` — add new item form
- `/admin` — admin control panel

## Components

- `AddItemForm` — item creation form, including count and image upload
- `ItemModal` — responsive item detail view with labels and quantity
- `SearchItems` — inventory search UI with filters
- `Navbar` — navigation and auth status

## Important Notes

- `NEXT_PUBLIC_API_URL` should target the backend API.
- Authentication is handled via Firebase; only authenticated users can interact with inventory routes.
- Image upload uses multipart form data and the server routes defined in `server/routes/items.js`.

## Scripts

- `npm run dev` — run development server
- `npm run build` — build for production
- `npm start` — start production server
- `npm run lint` — lint source files

## Deployment

For production deployment:

1. Build the app with `npm run build`
2. Deploy to Vercel, Netlify, or a static host supporting Next.js
3. Set environment variables in the hosting dashboard
4. Confirm API URL points to the production backend

## Local development workflow

- Start the backend first
- Then run the frontend
- Keep `NEXT_PUBLIC_API_URL` pointed to the backend URL

## Helpful Links

- [Next.js docs](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Firebase Auth](https://firebase.google.com/docs/auth)
