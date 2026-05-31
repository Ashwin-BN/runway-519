# Runway Inventory Backend

This backend API powers the Runway Inventory Management System. It is built with Express, MongoDB, Mongoose, Firebase Admin, Cloudinary, and Multer.

## Overview

The server exposes REST endpoints for:

- User authentication verification
- Item creation and search
- Item status updates
- Markdown pricing
- Admin user role management

## Quick Start

### Install

```bash
cd server
npm install
```

### Start

```bash
npm start
```

The backend listens on `http://localhost:5000` by default.

## Environment

Create `server/.env` with the required credentials:

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

## Available Scripts

- `npm start` — start the server
- `npm test` — placeholder test script

## API Endpoints

### Authentication
- `POST /auth/register`
- `POST /auth/login`
- `GET /auth/verify`

### Item routes
- `GET /items`
- `POST /items`
- `PUT /items/:id/sold`
- `PUT /items/:id/markdown`

### Admin routes
- `GET /admin/users`
- `PUT /admin/users/:id/role`

## Request Details

### `POST /items`

Accepts `multipart/form-data` with fields:
- `brand`
- `price`
- `count`
- `department`
- `category`
- `styleNumber`
- `images` (up to 2 files)

### `GET /items`

Supports query parameters:
- `brand`
- `styleNumber`
- `department`
- `priceMin`
- `priceMax`
- `markdown=true`
- `limit`

## Data Models

### Item schema

- `brand` — required string
- `price` — required number
- `count` — number, default `1`
- `department` — required 2-digit string
- `category` — required 4-digit string
- `styleNumber` — required 6-digit string
- `imageUrl` — string
- `imageUrls` — array of strings
- `status` — `available` or `sold`
- `markdownPrice` — optional number
- `createdAt` — timestamp

### User schema

- `email` — string
- `role` — `user`, `management`, or `admin`
- `createdAt` — timestamp

## Authentication

The backend verifies Firebase ID tokens on protected routes using `verifyUser` middleware. Admin-only routes also use `isManagementOrAdmin` middleware.

## Upload Handling

- `Multer` processes uploaded image files
- Cloudinary uploads images and returns secure URLs
- Temporary local files are stored in `server/uploads/`

## Deployment Notes

- Use environment variables for MongoDB, Firebase, and Cloudinary credentials
- Deploy with a process manager like `pm2` or a container platform
- Configure HTTPS and domain-specific API URL
- Keep service account JSON and sensitive keys private

## Project Layout

```
server/
├── config/
│   └── cloudinary.js
├── middleware/
│   ├── admin.js
│   └── auth.js
├── models/
│   └── Item.js
├── routes/
│   ├── admin.js
│   ├── auth.js
│   └── items.js
├── uploads/
├── firebase-admin.json
├── index.js
└── package.json
```

## Best Practices

- Validate all required fields before creating items
- Sanitize user input and trim strings
- Protect sensitive routes with Firebase token verification
- Log errors for production monitoring

## Related Documentation

- [Main project README](../README.md)
- [Firebase Admin SDK docs](https://firebase.google.com/docs/admin/setup)
- [Express documentation](https://expressjs.com/)
- [Mongoose documentation](https://mongoosejs.com/)
