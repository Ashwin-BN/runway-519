# Runway Inventory - Frontend Client

The frontend client for the Runway Inventory Management System, built with Next.js 16 and modern React patterns.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation
```bash
npm install
```

### Development
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the application.

### Build for Production
```bash
npm run build
npm start
```

## 🏗 Architecture

### Tech Stack
- **Next.js 16.2.3** - React framework with App Router
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS 4.0** - Utility-first CSS framework
- **Firebase Auth** - Authentication and user management

### Key Components

#### Pages
- `/` - Dashboard with navigation
- `/login` - User authentication
- `/search` - Inventory search interface
- `/admin` - User management (admin only)

#### Components
- `AddItemForm` - Item creation with image upload
- `SearchItems` - Advanced search and filtering

### Features
- 📱 Responsive design for mobile and desktop
- 📷 Camera integration for image capture
- 🔍 Real-time search with multiple filters
- 👤 Role-based UI components
- 🎨 Modern UI with Tailwind CSS

## 🔧 Configuration

### Environment Variables
Create a `.env.local` file with:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef123456
```

## 📱 Mobile Support

The application is optimized for mobile devices with:
- Touch-friendly interface
- Camera API integration
- Responsive grid layouts
- Mobile-first design approach

## 🔗 API Integration

Communicates with the Express.js backend API:
- Base URL: `http://localhost:5000`
- Authentication: Firebase JWT tokens
- Endpoints: Items CRUD, user management, search

## 🧪 Development

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Code Style
- ESLint configuration included
- TypeScript for type safety
- Component-based architecture
- Custom hooks for state management

## 🚀 Deployment

### Vercel (Recommended)
1. Connect GitHub repository
2. Set environment variables
3. Automatic deployments on push

### Manual Deployment
```bash
npm run build
npm start
```

## 📚 Related Documentation

- [Main Project README](../README.md) - Complete project documentation
- [Backend API](../server/README.md) - Server-side documentation
- [Next.js Documentation](https://nextjs.org/docs) - Framework reference
