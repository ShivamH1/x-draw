# 🎨 X-Draw - Real-time Collaborative Drawing Application

X-Draw is a modern, real-time collaborative drawing application built with Next.js, TypeScript, and WebSocket technology. Users can create and join drawing rooms to collaborate on digital canvases with multiple drawing tools and shapes.

## ✨ Features

### 🎯 Core Features
- **Real-time Collaboration**: Multiple users can draw simultaneously on shared canvases
- **Multiple Drawing Tools**: Pointer, hand/pan, rectangle, circle, line, arrow, and diamond.
- **Shape Management**: Create, select, and delete various geometric shapes
- **Canvas Controls**: Zoom in/out and pan across the canvas
- **Room System**: Create private rooms with unique slugs for collaboration
- **User Authentication**: Secure signup/signin with JWT tokens
- **Persistent Storage**: All drawings are saved and synchronized across sessions

### 🖼️ Drawing Capabilities
- **Shape Types**: Rectangle, Circle, Line, Arrow, Diamond, Text annotations
- **Interactive Canvas**: HTML5 Canvas with responsive mouse interactions
- **Visual Feedback**: Real-time preview while drawing, selection highlighting
- **Smart Hit Detection**: Precise shape selection and interaction
- **Professional Rendering**: Anti-aliased shapes with consistent styling

### 🌐 Real-time Features
- **WebSocket Integration**: Instant updates across all connected clients
- **Live Cursors**: See other users' drawing activities in real-time
- **Conflict Resolution**: Seamless handling of concurrent operations
- **Room-based Isolation**: Each drawing room operates independently

## 🏗️ Architecture

### 📂 Monorepo Structure
```
x-draw/
├── apps/
│   ├── x-draw-frontend/      # Main Next.js frontend application
│   ├── web/                  # Alternative web interface  
│   ├── http-backend/         # Express.js REST API server
│   └── ws-backend/           # WebSocket server for real-time features
├── packages/
│   ├── db/                   # Prisma database package
│   ├── ui/                   # Shared UI components
│   ├── common/               # Shared TypeScript types
│   ├── backend-common/       # Backend utilities
│   ├── typescript-config/    # Shared TypeScript configurations
│   └── eslint-config/        # Shared ESLint configurations
```

### 🛠️ Technology Stack

#### Frontend
- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript 5.8
- **UI Library**: React 19, Tailwind CSS 4
- **Icons**: Lucide React
- **HTTP Client**: Axios
- **Real-time**: WebSocket API

#### Backend
- **HTTP Server**: Express.js 5 with TypeScript
- **WebSocket**: ws library for real-time communication
- **Authentication**: JWT tokens with bcrypt password hashing
- **API Documentation**: Swagger/OpenAPI with swagger-ui-express
- **CORS**: Configured for cross-origin requests

#### Database
- **Database**: PostgreSQL
- **ORM**: Prisma with generated TypeScript client
- **Migrations**: Automated database migrations
- **Schema**: Users, Rooms, and Chat entities

#### Development Tools
- **Monorepo**: Turborepo for efficient build orchestration
- **Package Manager**: pnpm with workspaces
- **Code Quality**: ESLint, Prettier, TypeScript strict mode
- **Build System**: TypeScript compilation with watch mode

## 🚀 Getting Started

### Prerequisites
- **Node.js**: >= 18.0.0
- **pnpm**: >= 9.0.0
- **PostgreSQL**: Latest stable version
- **Git**: For version control

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/x-draw.git
   cd x-draw
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   # Copy example environment files
   cp apps/http-backend/.env.example apps/http-backend/.env
   cp apps/ws-backend/.env.example apps/ws-backend/.env
   cp apps/x-draw-frontend/.env.example apps/x-draw-frontend/.env.local
   ```

4. **Configure database**
   ```bash
   # Update DATABASE_URL in your .env files
   # Run Prisma migrations
   cd packages/db
   npx prisma migrate dev
   npx prisma generate
   ```

5. **Start development servers**
   ```bash
   # Start all applications in development mode
   pnpm dev
   ```

### Development URLs
- **Frontend**: http://localhost:5174
- **HTTP Backend**: http://localhost:3001
- **WebSocket Backend**: ws://localhost:8080
- **API Documentation**: http://localhost:3001/api-docs

## 📖 Usage Guide

### Creating a Room
1. Sign up or sign in to your account
2. Navigate to the rooms dashboard
3. Click "Create Room" and provide a unique room name
4. Share the room URL with collaborators

### Drawing Tools
- **Pointer** 👆: Select and manipulate existing shapes
- **Hand** ✋: Pan around the canvas
- **Rectangle** ⬜: Draw rectangular shapes
- **Circle** ⭕: Create circular shapes
- **Line** 📏: Draw straight lines
- **Arrow** ➡️: Create arrows with arrowheads
- **Diamond** 💎: Draw diamond/rhombus shapes

### Canvas Controls
- **Zoom**: Use mouse wheel or zoom controls
- **Pan**: Select hand tool and drag to move around
- **Selection**: Use pointer tool to select and highlight shapes

## 🔧 API Reference

### Authentication Endpoints
```typescript
POST /api/auth/signup    # Create new user account
POST /api/auth/signin    # Authenticate existing user
GET  /api/health         # Checks if backend is up
```

### Room Management
```typescript
GET    /api/rooms        # List user's rooms
POST   /api/rooms        # Create new room
GET    /api/rooms/:slug  # Get room details
DELETE /api/rooms/:id    # Delete room
```

### Chat/Drawing Data
```typescript
GET  /api/rooms/:id/chats  # Get room's drawing data
POST /api/rooms/:id/chats  # Save drawing data
```

### WebSocket Events
```typescript
// Connection
connect: { roomId: string, userId: string }

// Drawing updates
chat: { type: "chat", roomId: string, message: string }

// Shape operations  
shape_create: { shape: Shape, roomId: string }
shape_delete: { shapeId: string, roomId: string }
```

## 🏛️ Database Schema

```sql
-- Users table
User {
  id: String (UUID)
  email: String (unique)
  password: String (hashed)
  name: String
  photo: String?
  createdAt: DateTime
  updatedAt: DateTime
}

-- Rooms table  
Room {
  id: Int (auto-increment)
  slug: String (unique)
  createdAt: DateTime
  adminId: String (foreign key)
}

-- Chat/Drawing data
Chat {
  id: Int (auto-increment)
  message: String (JSON shape data)
  userId: String (foreign key)
  roomId: Int (foreign key)
}
```

## 🛡️ Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt with salt rounds for password security
- **CORS Protection**: Configured cross-origin resource sharing
- **Input Validation**: Request validation and sanitization
- **Room Access Control**: Only room members can access drawing data

## 🎨 Drawing System Architecture

The drawing system uses a sophisticated architecture with several key components:

### Core Components
- **DrawingManager**: Singleton pattern managing all drawing operations
- **ShapeRenderer**: Handles shape rendering and visual feedback
- **ShapeService**: Manages shape persistence and retrieval
- **Event System**: Comprehensive mouse and keyboard event handling

### Shape System
- **Extensible Design**: Easy to add new shape types
- **Hit Detection**: Precise algorithms for shape selection
- **Real-time Preview**: Live feedback during shape creation
- **Transform Support**: Zoom and pan transformations

For detailed technical documentation, see [Canvas_and_Drawing_System_Documentation.md](Canvas_and_Drawing_System_Documentation.md).

## 🚀 Deployment

### Production Build
```bash
# Build all applications
pnpm build

# Start production servers
pnpm start
```

### Environment Variables
```bash
# Backend
DATABASE_URL="postgresql://user:pass@localhost:5432/xdraw"
JWT_SECRET="your-jwt-secret"
CORS_ORIGIN="http://localhost:5174"

# Frontend  
NEXT_PUBLIC_API_URL="http://localhost:3001"
NEXT_PUBLIC_WS_URL="ws://localhost:8080"
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

### Development Workflow
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes with appropriate tests
4. Commit your changes (`git commit -m 'Add some amazing feature'`)
5. Push to the branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

### Code Standards
- **TypeScript**: Strict mode enabled
- **Linting**: ESLint with React and Next.js configs
- **Formatting**: Prettier with consistent configuration
- **Testing**: Jest and React Testing Library

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/) and [React](https://reactjs.org/)
- Real-time features powered by [WebSocket](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket)
- Database management with [Prisma](https://www.prisma.io/)
- Monorepo orchestration by [Turborepo](https://turbo.build/repo)
- UI components styled with [Tailwind CSS](https://tailwindcss.com/)

## 📞 Support

For support, please open an issue on GitHub or contact the development team.

---

**Happy Drawing! 🎨✨**
