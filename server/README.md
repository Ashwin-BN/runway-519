# Runway Inventory - Backend API

The backend API server for the Runway Inventory Management System, built with Express.js and MongoDB.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB Atlas account
- Firebase project
- Cloudinary account

### Installation
```bash
npm install
```

### Environment Setup
Create a `.env` file with required environment variables (see main README).

### Development
```bash
node index.js
```
Server runs on `http://localhost:5000`

## 🏗 Architecture

### Tech Stack
- **Node.js** - JavaScript runtime
- **Express.js 5.2.1** - Web framework
- **MongoDB + Mongoose** - Database and ODM
- **Firebase Admin SDK** - Authentication
- **Cloudinary** - Image storage
- **Multer** - File upload handling

### Key Features
- 🔐 JWT-based authentication with Firebase
- 📊 RESTful API design
- 🖼️ Multi-image upload with Cloudinary
- 👥 Role-based access control
- 🔍 Advanced search with regex filtering

## 📚 API Endpoints

### Authentication Routes (`/auth`)
```
POST /auth/register  - Register new user
POST /auth/login     - User login
GET  /auth/verify    - Verify JWT token
```

### Item Routes (`/items`)
```
GET  /items          - Get items with filtering
POST /items          - Create new item (multipart/form-data)
PUT  /items/:id/sold - Mark item as sold
PUT  /items/:id/markdown - Set markdown price (admin)
```

### Admin Routes (`/admin`)
```
GET  /admin/users          - Get all users
PUT  /admin/users/:id/role - Update user role
```

## 🔍 Search Parameters

The `/items` GET endpoint supports advanced filtering:

- `brand` - Case-insensitive regex search
- `styleNumber` - Case-insensitive regex search
- `department` - Exact department match
- `priceMin` - Minimum price filter
- `priceMax` - Maximum price filter
- `markdown` - "true" for markdown items only
- `limit` - Result limit

Example: `GET /items?brand=nike&priceMin=50&priceMax=200`

## 🗄 Data Models

### Item Schema
```javascript
{
  brand: String,           // Required
  price: Number,           // Required
  department: String,      // Required (2-digit)
  category: String,        // Required (4-digit)
  styleNumber: String,     // Required (6-digit)
  imageUrl: String,        // Primary image
  imageUrls: [String],     // Multiple images
  status: String,          // 'available' | 'sold'
  markdownPrice: Number,   // Optional
  createdAt: Date
}
```

### User Schema
```javascript
{
  email: String,           // Required, unique
  role: String,            // 'user' | 'admin'
  createdAt: Date
}
```

## 🔐 Authentication

Uses Firebase Admin SDK for token verification:
- Validates JWT tokens from frontend
- Extracts user information and roles
- Protects routes with middleware

## 📸 Image Upload

- **Multer**: Handles multipart/form-data
- **Cloudinary**: Stores and optimizes images
- **Multiple Images**: Support for up to 2 images per item
- **URL Storage**: Secure URLs stored in database

## 🛠 Development

### Available Scripts
- `node index.js` - Start development server
- `npm test` - Run tests (when implemented)

### Middleware
- `auth.js` - JWT verification
- `admin.js` - Admin role checking

### File Structure
```
server/
├── config/
│   └── cloudinary.js      # Image service config
├── middleware/
│   ├── auth.js           # Authentication
│   └── admin.js          # Admin authorization
├── models/
│   ├── Item.js           # Item schema
│   └── User.js           # User schema
├── routes/
│   ├── auth.js           # Auth endpoints
│   ├── admin.js          # Admin endpoints
│   └── items.js          # Item CRUD
├── uploads/              # Temp file storage
├── index.js              # Server entry
└── package.json
```

## 🚀 Deployment

### Production Considerations
- Set `NODE_ENV=production`
- Use PM2 for process management
- Configure reverse proxy (nginx)
- Set up SSL certificates
- Monitor logs and performance

### Environment Variables
See main project README for complete list of required environment variables.

## 🧪 Testing

### Manual Testing
- Use tools like Postman or Insomnia
- Test all CRUD operations
- Verify authentication flows
- Check file upload functionality

### API Testing Checklist
- [ ] User registration/login
- [ ] JWT token validation
- [ ] Item creation with images
- [ ] Search filtering
- [ ] Admin operations
- [ ] Error handling

## 📚 Related Documentation

- [Main Project README](../README.md) - Complete project overview
- [Frontend Client](../client/README.md) - Client-side documentation
- [Express.js Documentation](https://expressjs.com/) - Framework reference
- [Mongoose Documentation](https://mongoosejs.com/) - ODM reference</content>
<parameter name="filePath">c:\CPP\Job\runway-519\server\README.md