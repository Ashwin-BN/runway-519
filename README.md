# Runway Inventory Management System

A comprehensive full-stack inventory management solution designed for fashion retail operations. Built with modern web technologies to streamline item tracking, user management, and inventory control for runway fashion businesses.

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Environment Setup](#-environment-setup)
- [Usage](#-usage)
- [API Documentation](#-api-documentation)
- [Project Structure](#-project-structure)
- [Database Schema](#-database-schema)
- [Authentication](#-authentication)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [Documentation](#-documentation)
- [License](#-license)

## ✨ Features

### 🏪 Inventory Management
- **Item Creation**: Add new fashion items with detailed specifications
- **Image Upload**: Support for multiple product images with Cloudinary integration
- **Camera Integration**: Direct camera capture for mobile devices
- **Advanced Search**: Multi-criteria filtering (brand, department, style, price range)
- **Real-time Updates**: Live inventory status tracking

### 👥 User Management
- **Role-based Access**: User, Management, and Admin permissions
- **Firebase Authentication**: Secure user authentication and authorization
- **User Profiles**: Role-based dashboard access

### 🔍 Search & Filtering
- **Case-insensitive Search**: Brand and style number search with partial matching
- **Price Range Filtering**: Min/max price filtering
- **Department Filtering**: Category-based organization
- **Markdown Items**: Special filtering for discounted items

### 📊 Admin Features
- **User Role Management**: Promote/demote users to Management or Admin status
- **Inventory Oversight**: Full access to all inventory items
- **Status Management**: Mark items as sold or available
- **Markdown Pricing**: Set discounted prices (Management & Admin only)

## 🛠 Tech Stack

### Frontend
- **Framework**: Next.js 16.2.3 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4.0
- **Authentication**: Firebase Authentication
- **State Management**: React Hooks

### Backend
- **Runtime**: Node.js with ES6 modules
- **Framework**: Express.js 5.2.1
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: Firebase Admin SDK
- **File Upload**: Multer with Cloudinary integration

### Infrastructure
- **Database**: MongoDB Atlas
- **Image Storage**: Cloudinary
- **Authentication**: Firebase
- **Deployment**: Ready for Vercel/Netlify (frontend) and Railway/Render (backend)

## 📋 Prerequisites

Before running this application, ensure you have the following installed:

- **Node.js** (v18 or higher)
- **npm** or **yarn** package manager
- **MongoDB Atlas** account and cluster
- **Firebase** project with Authentication enabled
- **Cloudinary** account for image storage

## 🚀 Installation

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/runway-inventory.git
cd runway-inventory
```

### 2. Install Dependencies

#### Frontend Setup
```bash
cd client
npm install
```

#### Backend Setup
```bash
cd ../server
npm install
```

### 3. Environment Configuration
See [Environment Setup](#-environment-setup) section below.

### 4. Start Development Servers

#### Terminal 1: Backend Server
```bash
cd server
node index.js
```
Server will run on `http://localhost:5000`

#### Terminal 2: Frontend Client
```bash
cd client
npm run dev
```
Client will run on `http://localhost:3000`

## 🔧 Environment Setup

### Backend Environment Variables (.env)
Create a `.env` file in the `server/` directory:

```env
# MongoDB Configuration
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/runway_inventory

# Firebase Admin Configuration
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY\n-----END PRIVATE KEY-----"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# JWT Secret (optional, for custom tokens)
JWT_SECRET=your-jwt-secret-key
```

### Frontend Environment Variables (.env.local)
Create a `.env.local` file in the `client/` directory:

```env
# Firebase Client Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef123456
```

## 📖 Usage

### User Registration & Login
1. Navigate to `http://localhost:3000/login`
2. Register a new account or login with existing credentials
3. Upon successful authentication, you'll be redirected to the dashboard

### Adding Inventory Items
1. From the dashboard, click "Add New Item"
2. Fill in item details:
   - Brand name
   - Price
   - Department (2-digit code)
   - Category (4-digit code)
   - Style Number (6-digit code)
3. Upload images using camera or file picker
4. Submit the form to add the item to inventory

### Searching Inventory
1. Navigate to the Search page
2. Use filters to find specific items:
   - **Brand**: Case-insensitive partial matching
   - **Department**: Exact department code
   - **Style Number**: Partial style number matching
   - **Price Range**: Min/max price filtering
   - **Markdown Only**: Show only discounted items
3. Click "Search" to filter results

### Admin Functions
1. Login with an admin account
2. Access the Admin panel to manage user roles
3. Mark items as sold from the inventory list

## 📚 API Documentation

### Authentication Endpoints
```
POST /auth/register - User registration
POST /auth/login - User login
GET /auth/verify - Verify JWT token
```

### Item Management Endpoints
```
GET /items - Get filtered items (authenticated)
POST /items - Create new item (authenticated, file upload)
PUT /items/:id/sold - Mark item as sold (authenticated)
PUT /items/:id/markdown - Set markdown price (admin only)
```

### Admin Endpoints
```
GET /admin/users - Get all users (admin only)
PUT /admin/users/:id/role - Update user role (admin only)
```

### Query Parameters for Item Search
- `brand`: Case-insensitive regex search
- `styleNumber`: Case-insensitive regex search
- `department`: Exact department match
- `priceMin`: Minimum price filter
- `priceMax`: Maximum price filter
- `markdown`: Set to "true" for markdown items only
- `limit`: Limit number of results

## 📁 Project Structure

```
runway-inventory/
├── client/                          # Next.js Frontend
│   ├── app/
│   │   ├── admin/                   # Admin pages
│   │   ├── components/              # React components
│   │   │   ├── AddItemForm.js       # Item creation form
│   │   │   └── SearchItems.js       # Search interface
│   │   ├── login/                   # Authentication page
│   │   ├── search/                  # Search page
│   │   ├── globals.css              # Global styles
│   │   ├── layout.tsx               # Root layout
│   │   └── page.js                  # Dashboard
│   ├── lib/
│   │   └── firebase.js              # Firebase configuration
│   ├── public/                      # Static assets
│   └── package.json
├── server/                          # Express.js Backend
│   ├── config/
│   │   └── cloudinary.js            # Cloudinary configuration
│   ├── middleware/
│   │   ├── admin.js                 # Admin role middleware
│   │   └── auth.js                  # Authentication middleware
│   ├── models/
│   │   ├── Item.js                  # Item data model
│   │   └── User.js                  # User data model
│   ├── routes/
│   │   ├── admin.js                 # Admin routes
│   │   ├── auth.js                  # Authentication routes
│   │   └── items.js                 # Item CRUD routes
│   ├── uploads/                     # Temporary file uploads
│   ├── firebase-admin.json          # Firebase service account
│   ├── index.js                     # Server entry point
│   └── package.json
├── .gitignore                       # Git ignore rules
└── README.md                        # Project documentation
```

## 🗄 Database Schema

### Item Model
```javascript
{
  brand: String (required),
  price: Number (required),
  department: String (required),     // 2-digit code
  category: String (required),       // 4-digit code
  styleNumber: String (required),    // 6-digit code
  imageUrl: String,                  // Primary image URL
  imageUrls: [String],               // Array of image URLs
  status: String (enum: ['available', 'sold'], default: 'available'),
  markdownPrice: Number,             // Optional markdown price
  createdAt: Date (default: now)
}
```

### User Model
```javascript
{
  email: String (required, unique),
  role: String (enum: ['user', 'management', 'admin'], default: 'user'),
  createdAt: Date (default: now)
}
```

## 🔐 Authentication

The application uses Firebase Authentication with custom claims for role-based access control:

- **Regular Users**: Can view available items, add new items, search inventory, mark items as sold
- **Management Users**: All user permissions plus markdown pricing capabilities
- **Admin Users**: Full access including user management and all item operations

JWT tokens are issued by Firebase and verified on the backend using Firebase Admin SDK.

## 🚀 Deployment

### Frontend Deployment (Vercel)
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Backend Deployment (Railway/Render)
1. Create a new service on Railway or Render
2. Connect your GitHub repository
3. Set environment variables
4. Configure build and start commands
5. Deploy

### Environment Variables for Production
Ensure all production environment variables are set in your deployment platform's dashboard.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow ESLint configuration for code style
- Write descriptive commit messages
- Test API endpoints thoroughly
- Update documentation for new features

## � Documentation

### Project Documentation
- **[API Reference](docs/API_REFERENCE.md)** - Complete API endpoint documentation
- **[Deployment Guide](docs/DEPLOYMENT.md)** - Step-by-step deployment instructions
- **[Contributing Guide](docs/CONTRIBUTING.md)** - Development and contribution guidelines

### Component Documentation
- **[Frontend Client](client/README.md)** - Next.js client documentation
- **[Backend API](server/README.md)** - Express.js server documentation

### Additional Resources
- [Next.js Documentation](https://nextjs.org/docs) - Framework reference
- [Express.js Documentation](https://expressjs.com/) - API framework reference
- [MongoDB Documentation](https://docs.mongodb.com/) - Database reference
- [Firebase Documentation](https://firebase.google.com/docs) - Authentication reference

## �📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

For support or questions, please open an issue on GitHub or contact the development team.

---

**Built with ❤️ for fashion retail operations**