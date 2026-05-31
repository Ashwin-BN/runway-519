# Runway Inventory Management System

A full-stack inventory management platform for fashion retail, built with Next.js, Firebase Auth, Express, MongoDB, and Cloudinary.

## Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Architecture](#project-architecture)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Environment Configuration](#environment-configuration)
- [Running Locally](#running-locally)
- [Production Build](#production-build)
- [API Reference](#api-reference)
- [Authentication & Authorization](#authentication--authorization)
- [Data Models](#data-models)
- [Deployment Notes](#deployment-notes)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [Troubleshooting](#troubleshooting)
- [License](#license)

## Overview

Runway Inventory is a fashion inventory management application that helps store managers, stylists, and administrators track product stock, pricing, sale markdowns, and item status.

The system is split into two main parts:

- `client/` — a responsive Next.js frontend with item creation, search, and role-aware UI.
- `server/` — an Express API backend with MongoDB data storage, Firebase authentication, and Cloudinary image upload.

## Features

- Add items with brand, price, department, category, style number, count, and images.
- Upload product photos via file picker or mobile camera.
- Search and filter inventory by brand, department, category, style number, price, and markdown status.
- Role-based access control for regular users, management, and admin.
- Admin and management can set markdown pricing and mark items as sold.
- Responsive UI optimized for mobile and desktop.

## Tech Stack

- Frontend: Next.js 16, React 19, Tailwind CSS 4, Firebase Auth
- Backend: Node.js, Express 5, MongoDB, Mongoose, Firebase Admin SDK, Cloudinary, Multer
- Deployment-ready: Vercel / Netlify frontend, Railway / Render / Heroku backend

## Project Architecture

This repository is organized as a monorepo with separate frontend and backend packages:

- `client/` contains the Next.js web application.
- `server/` contains the Express API server.

Both sides share a clean, maintainable structure and use RESTful communication.

## Prerequisites

Install these tools before getting started:

- Node.js 18 or newer
- npm (comes with Node.js)
- MongoDB Atlas or self-hosted MongoDB
- Firebase project with Authentication enabled
- Cloudinary account for image management

## Getting Started

### Clone the repository

```bash
git clone https://github.com/your-username/runway-519.git
cd runway-519
```

### Install dependencies

```bash
cd client
npm install
cd ../server
npm install
```

## Environment Configuration

### Backend environment (`server/.env`)

Create `server/.env` with the following values:

```env
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/runway_inventory?retryWrites=true&w=majority
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret
JWT_SECRET=your-jwt-secret
```

> Keep `FIREBASE_PRIVATE_KEY` quoted and preserve newline escapes (`\n`) exactly.

### Frontend environment (`client/.env.local`)

Create `client/.env.local` with your Firebase client configuration:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=1234567890
NEXT_PUBLIC_FIREBASE_APP_ID=1:1234567890:web:abcdef123456
NEXT_PUBLIC_API_URL=http://localhost:5000
```

## Running Locally

Open two terminal windows or tabs.

### Start server

```bash
cd server
npm start
```

Server defaults to `http://localhost:5000`.

### Start frontend

```bash
cd client
npm run dev
```

Frontend is available at `http://localhost:3000`.

## Production Build

### Frontend

```bash
cd client
npm run build
npm start
```

### Backend

```bash
cd server
npm start
```

For production deployments, use a process manager such as `pm2` or containerize the backend.

## API Reference

### Authentication

- `POST /auth/register` — register a user
- `POST /auth/login` — login and receive auth token
- `GET /auth/verify` — verify Firebase token

### Item management

- `GET /items` — fetch items with filters
- `POST /items` — create item with image upload
- `PUT /items/:id/sold` — mark item sold
- `PUT /items/:id/markdown` — set markdown price (admin/management)

### Admin routes

- `GET /admin/users` — list users
- `PUT /admin/users/:id/role` — update user role

### Item query parameters

- `brand` — partial brand match
- `styleNumber` — partial style number match
- `department` — exact 2-digit department code
- `priceMin` — minimum price
- `priceMax` — maximum price
- `markdown=true` — filter markdown items
- `limit` — maximum results count

## Authentication & Authorization

This project uses Firebase for authentication and role-based authorization.

- `user` — basic user access
- `management` — item editing and markdown control
- `admin` — full management and user control

Protected routes require a valid Firebase JWT token.

## Data Models

### Item

- `brand` — string
- `price` — number
- `count` — number (default `1`)
- `department` — string (2 digits)
- `category` — string (4 digits)
- `styleNumber` — string (6 digits)
- `imageUrl` — string
- `imageUrls` — array of strings
- `status` — `available` | `sold`
- `markdownPrice` — number | null
- `createdAt` — timestamp

### User

- `email` — string
- `role` — `user` | `management` | `admin`
- `createdAt` — timestamp

## Deployment Notes

### Frontend

- Deploy the `client/` app to Vercel or Netlify
- Set environment variables in the hosting dashboard
- Ensure `NEXT_PUBLIC_API_URL` points to the backend URL

### Backend

- Deploy `server/` to Render, Railway, Heroku, or a VPS
- Set MongoDB, Firebase, and Cloudinary environment variables
- Use HTTPS and secure headers in production

## Project Structure

```
runway-519/
├── client/                  # Next.js frontend
│   ├── app/                 # Pages and components
│   ├── components/          # Shared components
│   ├── lib/                 # Firebase setup
│   ├── public/              # Static assets
│   ├── package.json
│   └── README.md
├── server/                  # Express backend
│   ├── config/              # Cloudinary and environment config
│   ├── middleware/          # Auth and role middleware
│   ├── models/              # Mongoose schemas
│   ├── routes/              # API routes
│   ├── uploads/             # Temporary file storage
│   ├── index.js
│   ├── package.json
│   └── README.md
└── README.md
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit clearly and write meaningful messages
4. Open a pull request with a description of your changes

### Recommended workflow

```bash
git checkout -b feature/new-ui
git add .
git commit -m "Add count field to AddItemForm"
git push origin feature/new-ui
```

## Troubleshooting

### Common issues

- **Firebase login fails**: verify frontend env variables and Firebase configuration.
- **Backend cannot connect to MongoDB**: confirm `MONGO_URI` and network access.
- **Image upload errors**: verify Cloudinary credentials.
- **CORS or auth errors**: ensure `Authorization` header is sent from the frontend.

## License

This project is open source. Customize the license details in `package.json` as needed.
