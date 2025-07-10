# replit.md

## Overview

This is a full-stack e-commerce application built with React, Express, and PostgreSQL. The application features a clean, minimalist tech store frontend with product browsing, cart functionality, and a secure admin panel for product management. The admin panel is protected with access code "admin123" and allows administrators to add, edit, and delete products. The architecture follows a monorepo structure with shared schemas and TypeScript throughout.

## User Preferences

Preferred communication style: Simple, everyday language.
Design preferences: Minimalist design, clean interface without unnecessary images or promotional banners.
Contact information: Phone number 0555332133

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript
- **Styling**: Tailwind CSS with shadcn/ui component library
- **State Management**: Zustand for client-side state, TanStack Query for server state
- **Routing**: Wouter for lightweight client-side routing
- **Build Tool**: Vite with custom configuration for development and production

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **API Style**: RESTful APIs with JSON responses
- **Middleware**: Custom logging, error handling, and request parsing
- **Development**: Hot reload with Vite integration in development mode

### Database Layer
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Database**: PostgreSQL (configured for Neon Database)
- **Migrations**: Drizzle Kit for schema management
- **Connection**: Neon serverless driver for database connectivity

## Key Components

### Shared Schema (`shared/schema.ts`)
- Centralized database schema definitions using Drizzle ORM
- Type-safe data models for Products, Cart Items, Orders, and Order Items
- Zod validation schemas derived from database schemas
- Supports product variants, colors, stock management, and order tracking

### Storage Layer (`server/storage.ts`)
- Abstract storage interface (`IStorage`) for data operations
- In-memory implementation (`MemStorage`) for development/testing
- CRUD operations for products, cart management, and order processing
- Type-safe operations with full TypeScript integration

### Frontend State Management
- **Global Store**: Zustand store with persistence for cart and UI state
- **Server State**: TanStack Query for API data fetching and caching
- **Local State**: React hooks for component-level state

### UI Components
- shadcn/ui component library with Radix UI primitives
- Responsive design with mobile-first approach
- Consistent design system with CSS variables for theming
- Accessible components following ARIA guidelines

## Data Flow

### Product Management
1. Products are defined in the shared schema with full metadata
2. Admin panel allows CRUD operations on products via REST API
3. Frontend displays products with filtering, searching, and categorization
4. Product modals show detailed information with variant selection

### Shopping Cart
1. Cart items are managed both client-side (Zustand) and server-side (storage)
2. Real-time synchronization between client and server state
3. Persistent cart state across browser sessions
4. Quantity updates and item removal with optimistic UI updates

### Order Processing
1. Orders are created from cart items with customer information
2. Order history is maintained with detailed item tracking
3. Status management for order lifecycle

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: PostgreSQL connection for Neon Database
- **drizzle-orm**: Type-safe ORM with PostgreSQL support
- **@tanstack/react-query**: Server state management and caching
- **zustand**: Lightweight state management for React
- **wouter**: Minimalist routing library

### UI Dependencies
- **@radix-ui/***: Accessible UI primitives
- **tailwindcss**: Utility-first CSS framework
- **class-variance-authority**: Type-safe CSS class variants
- **lucide-react**: Icon library

### Development Dependencies
- **vite**: Fast build tool and development server
- **typescript**: Type safety and development experience
- **drizzle-kit**: Database schema management and migrations

## Deployment Strategy

### Build Process
1. **Frontend**: Vite builds React application to `dist/public`
2. **Backend**: esbuild bundles Express server to `dist/index.js`
3. **Database**: Drizzle migrations applied via `db:push` command

### Environment Configuration
- Database URL configured via `DATABASE_URL` environment variable
- Development mode with hot reload and error overlays
- Production mode with optimized builds and static file serving

### Development Workflow
- `npm run dev`: Starts development server with hot reload
- `npm run build`: Creates production builds for both frontend and backend
- `npm run start`: Runs production server
- `npm run db:push`: Applies database schema changes

### Hosting Considerations
- Backend serves both API routes and static frontend files
- Database migrations need to be run before deployment
- Environment variables required for database connectivity
- Static assets served from Express in production mode