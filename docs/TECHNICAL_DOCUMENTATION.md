# StreamControl Technical Documentation

## Table of Contents
1. [Architecture Overview](#architecture-overview)
2. [Technology Stack](#technology-stack)
3. [Database Schema](#database-schema)
4. [API Reference](#api-reference)
5. [Component Architecture](#component-architecture)
6. [State Management](#state-management)
7. [Real-time Communication](#real-time-communication)
8. [Development Guidelines](#development-guidelines)
9. [Deployment Guide](#deployment-guide)
10. [Performance Optimization](#performance-optimization)

## Architecture Overview

StreamControl follows a modern full-stack architecture with the following layers:

```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend (Next.js)                       │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────┐ │
│  │   React     │ │  TypeScript │ │  Tailwind   │ │ shadcn/ui│ │
│  │ Components  │ │             │ │     CSS     │ │         │ │
│  └─────────────┘ └─────────────┘ └─────────────┘ └─────────┘ │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ HTTP/WebSocket
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                   Backend (Node.js)                         │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────┐ │
│  │   Express   │ │ Socket.IO   │ │   Prisma    │ │ FFmpeg  │ │
│  │   Server    │ │ Real-time   │ │     ORM     │ │ Process │ │
│  └─────────────┘ └─────────────┘ └─────────────┘ └─────────┘ │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ Database
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    Database (SQLite)                        │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────┐ │
│  │   Users     │ │   Channels  │ │ SCTE-35     │ │  Logs   │ │
│  │             │ │             │ │  Events     │ │         │ │
│  └─────────────┘ └─────────────┘ └─────────────┘ └─────────┘ │
└─────────────────────────────────────────────────────────────┘
```

### Key Architectural Principles

1. **Separation of Concerns**: Clear separation between UI, business logic, and data layers
2. **Real-time First**: WebSocket-based real-time communication for live updates
3. **Type Safety**: Full TypeScript implementation for better development experience
4. **Modular Design**: Component-based architecture for maintainability
5. **Scalable Database**: Prisma ORM with SQLite for development, PostgreSQL for production

## Technology Stack

### Frontend
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4
- **UI Components**: shadcn/ui
- **State Management**: React useState/useEffect, Zustand (for complex state)
- **Real-time**: Socket.IO Client
- **Icons**: Lucide React

### Backend
- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Real-time**: Socket.IO
- **Database ORM**: Prisma
- **Process Management**: Child Process (FFmpeg)
- **Validation**: Zod

### Database
- **Development**: SQLite
- **Production**: PostgreSQL
- **Schema Management**: Prisma Migrations

### Development Tools
- **Package Manager**: npm
- **Build Tool**: Next.js
- **Development Server**: nodemon
- **Linting**: ESLint
- **Type Checking**: TypeScript

## Database Schema

### Prisma Schema Overview

```prisma
// User Management
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String?
  role      UserRole @default(USER)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

// Channel Management
model StreamingChannel {
  id             String        @id @default(cuid())
  name           String
  description    String?
  inputUrl       String
  outputUrl      String
  status         ChannelStatus @default(OFFLINE)
  bitrate        Int           @default(8000)
  resolution     String        @default("1920x1080")
  fps            Int           @default(30)
  audioChannels  Int           @default(2)
  viewers        Int           @default(0)
  uptime         Int           @default(0)
  categoryId     String
  isActive       Boolean       @default(true)
  scte35Enabled  Boolean       @default(true)
  scte35Pid      Int           @default(500)
  tags           String[]
  createdAt      DateTime      @default(now())
  updatedAt      DateTime      @updatedAt
  
  // Relations
  events         SCTE35Event[]
  configurations StreamConfiguration[]
  logs           StreamLog[]
}

// SCTE-35 Event Management
model SCTE35Event {
  id          String           @id @default(cuid())
  channelId   String
  type        SCTE35CommandType
  startTime   DateTime
  endTime     DateTime?
  duration    Int?
  description String?
  status      ScheduleStatus   @default(PENDING)
  createdAt   DateTime         @default(now())
  updatedAt   DateTime         @updatedAt
  
  // Relations
  channel     StreamingChannel @relation(fields: [channelId], references: [id])
}

// Stream Configuration
model StreamConfiguration {
  id          String @id @default(cuid())
  channelId   String
  name        String
  config      Json
  isActive    Boolean @default(false)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  // Relations
  channel     StreamingChannel @relation(fields: [channelId], references: [id])
}

// Event Schedule
model EventSchedule {
  id          String         @id @default(cuid())
  eventId     String
  scheduledAt DateTime
  status      ScheduleStatus @default(PENDING)
  createdAt   DateTime       @default(now())
  updatedAt   DateTime       @updatedAt
}

// Stream Logs
model StreamLog {
  id        String   @id @default(cuid())
  channelId String
  level     LogLevel
  message   String
  metadata  Json?
  timestamp DateTime @default(now())
  
  // Relations
  channel   StreamingChannel @relation(fields: [channelId], references: [id])
}

// Enums
enum UserRole {
  ADMIN
  OPERATOR
  USER
}

enum ChannelStatus {
  ONLINE
  OFFLINE
  STARTING
  STOPPING
  ERROR
}

enum SCTE35CommandType {
  INSERT
  DELETE
  TIME_SIGNAL
  SPLICE_NULL
  SPLICE_SCHEDULE
}

enum ScheduleStatus {
  PENDING
  RUNNING
  COMPLETED
  FAILED
  CANCELLED
}

enum LogLevel {
  DEBUG
  INFO
  WARN
  ERROR
  FATAL
}
```

## API Reference

### REST API Endpoints

#### Channel Management

```typescript
// Get all channels
GET /api/channels
Response: StreamingChannel[]

// Get channel by ID
GET /api/channels/:id
Response: StreamingChannel

// Create new channel
POST /api/channels
Body: {
  name: string
  description?: string
  inputUrl: string
  outputUrl: string
  bitrate?: number
  resolution?: string
  fps?: number
  audioChannels?: number
  categoryId: string
  isActive?: boolean
  scte35Enabled?: boolean
  scte35Pid?: number
  tags?: string[]
}
Response: StreamingChannel

// Update channel
PUT /api/channels/:id
Body: Partial<StreamingChannel>
Response: StreamingChannel

// Delete channel
DELETE /api/channels/:id
Response: { success: boolean }

// Start channel
POST /api/channels/:id/start
Response: { success: boolean, status: ChannelStatus }

// Stop channel
POST /api/channels/:id/stop
Response: { success: boolean, status: ChannelStatus }
```

#### SCTE-35 Events

```typescript
// Get all events
GET /api/events
Response: SCTE35Event[]

// Get event by ID
GET /api/events/:id
Response: SCTE35Event

// Create new event
POST /api/events
Body: {
  channelId: string
  type: SCTE35CommandType
  startTime: string
  endTime?: string
  duration?: number
  description?: string
}
Response: SCTE35Event

// Update event
PUT /api/events/:id
Body: Partial<SCTE35Event>
Response: SCTE35Event

// Delete event
DELETE /api/events/:id
Response: { success: boolean }
```

#### Stream Logs

```typescript
// Get channel logs
GET /api/channels/:id/logs
Query: { level?: LogLevel, limit?: number, offset?: number }
Response: StreamLog[]

// Create log entry
POST /api/logs
Body: {
  channelId: string
  level: LogLevel
  message: string
  metadata?: object
}
Response: StreamLog
```

### WebSocket Events

#### Client to Server

```typescript
// Join channel room
socket.emit('join-channel', { channelId: string })

// Leave channel room
socket.emit('leave-channel', { channelId: string })

// Request channel status
socket.emit('get-channel-status', { channelId: string })

// Start channel
socket.emit('start-channel', { channelId: string })

// Stop channel
socket.emit('stop-channel', { channelId: string })
```

#### Server to Client

```typescript
// Channel status update
socket.on('channel-status-update', (data: {
  channelId: string
  status: ChannelStatus
  viewers: number
  uptime: number
  bitrate: number
}))

// Channel error
socket.on('channel-error', (data: {
  channelId: string
  error: string
  timestamp: string
}))

// SCTE-35 event triggered
socket.on('scte35-event', (data: {
  channelId: string
  eventId: string
  type: SCTE35CommandType
  timestamp: string
}))

// System notification
socket.on('system-notification', (data: {
  type: 'info' | 'warning' | 'error'
  message: string
  timestamp: string
}))
```

## Component Architecture

### Frontend Component Structure

```
src/
├── app/
│   ├── layout.tsx              # Root layout
│   ├── page.tsx                # Main dashboard
│   └── globals.css             # Global styles
├── components/
│   ├── ui/                     # shadcn/ui components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   └── ...
│   ├── ChannelManager.tsx      # Channel management
│   ├── RealTimeMonitor.tsx     # Real-time monitoring
│   ├── FFmpegIntegration.tsx   # FFmpeg tools
│   ├── SCTE35Events.tsx        # SCTE-35 management
│   └── ClientOnly.tsx          # Client-side wrapper
├── lib/
│   ├── utils.ts                # Utility functions
│   ├── socket.ts               # Socket.IO client
│   └── store.ts                # Zustand store
└── types/
    └── index.ts                # TypeScript definitions
```

### Component Communication

```typescript
// Parent-Child Communication
interface ChannelManagerProps {
  onChannelCreate?: (channel: Channel) => void
  onChannelUpdate?: (channel: Channel) => void
  onChannelDelete?: (channelId: string) => void
  onChannelStart?: (channelId: string) => void
  onChannelStop?: (channelId: string) => void
}

// Event Handling
const handleChannelCreate = (channel: Channel) => {
  // Update local state
  setChannels(prev => [...prev, channel])
  
  // Emit to server
  socket.emit('create-channel', channel)
  
  // Call parent callback
  onChannelCreate?.(channel)
}
```

## State Management

### Local State (useState/useEffect)

```typescript
// Channel state management
const [channels, setChannels] = useState<Channel[]>([])
const [selectedChannel, setSelectedChannel] = useState<string | null>(null)
const [isLoading, setIsLoading] = useState(false)

// Real-time updates
useEffect(() => {
  const interval = setInterval(() => {
    setChannels(prev => prev.map(channel => ({
      ...channel,
      viewers: channel.status === 'ONLINE' 
        ? Math.max(0, channel.viewers + Math.floor(Math.random() * 10) - 5)
        : channel.viewers,
      uptime: channel.status === 'ONLINE' ? channel.uptime + 1 : channel.uptime
    })))
  }, 5000)

  return () => clearInterval(interval)
}, [])
```

### Global State (Zustand)

```typescript
// Store definition
interface AppState {
  // State
  channels: Channel[]
  categories: ChannelCategory[]
  currentUser: User | null
  systemStatus: SystemStatus
  
  // Actions
  setChannels: (channels: Channel[]) => void
  addChannel: (channel: Channel) => void
  updateChannel: (id: string, updates: Partial<Channel>) => void
  deleteChannel: (id: string) => void
  setSystemStatus: (status: SystemStatus) => void
}

// Store implementation
export const useAppStore = create<AppState>((set, get) => ({
  channels: [],
  categories: [],
  currentUser: null,
  systemStatus: 'healthy',
  
  setChannels: (channels) => set({ channels }),
  addChannel: (channel) => set(state => ({ 
    channels: [...state.channels, channel] 
  })),
  updateChannel: (id, updates) => set(state => ({
    channels: state.channels.map(channel =>
      channel.id === id ? { ...channel, ...updates } : channel
    )
  })),
  deleteChannel: (id) => set(state => ({
    channels: state.channels.filter(channel => channel.id !== id)
  })),
  setSystemStatus: (status) => set({ systemStatus: status })
}))
```

## Real-time Communication

### Socket.IO Implementation

```typescript
// Server-side socket handling
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id)
  
  // Join channel room
  socket.on('join-channel', ({ channelId }) => {
    socket.join(`channel-${channelId}`)
    console.log(`Client ${socket.id} joined channel ${channelId}`)
  })
  
  // Leave channel room
  socket.on('leave-channel', ({ channelId }) => {
    socket.leave(`channel-${channelId}`)
    console.log(`Client ${socket.id} left channel ${channelId}`)
  })
  
  // Handle channel start
  socket.on('start-channel', async ({ channelId }) => {
    try {
      const channel = await prisma.streamingChannel.findUnique({
        where: { id: channelId }
      })
      
      if (!channel) {
        socket.emit('error', { message: 'Channel not found' })
        return
      }
      
      // Start FFmpeg process
      const ffmpegProcess = await startFFmpegProcess(channel)
      
      // Update channel status
      await prisma.streamingChannel.update({
        where: { id: channelId },
        data: { status: 'STARTING' }
      })
      
      // Broadcast status update
      io.to(`channel-${channelId}`).emit('channel-status-update', {
        channelId,
        status: 'STARTING',
        timestamp: new Date().toISOString()
      })
      
    } catch (error) {
      socket.emit('error', { message: error.message })
    }
  })
  
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id)
  })
})
```

### Client-side Socket Management

```typescript
// Socket client setup
import { io, Socket } from 'socket.io-client'

class SocketManager {
  private socket: Socket | null = null
  private reconnectAttempts = 0
  private maxReconnectAttempts = 5
  
  connect() {
    this.socket = io('/', {
      path: '/api/socketio',
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: this.maxReconnectAttempts,
      reconnectionDelay: 1000
    })
    
    this.setupEventListeners()
  }
  
  private setupEventListeners() {
    if (!this.socket) return
    
    this.socket.on('connect', () => {
      console.log('Connected to server')
      this.reconnectAttempts = 0
    })
    
    this.socket.on('disconnect', () => {
      console.log('Disconnected from server')
    })
    
    this.socket.on('connect_error', (error) => {
      console.error('Connection error:', error)
      this.reconnectAttempts++
    })
    
    this.socket.on('channel-status-update', (data) => {
      // Update local state
      useAppStore.getState().updateChannel(data.channelId, {
        status: data.status,
        viewers: data.viewers,
        uptime: data.uptime,
        bitrate: data.bitrate
      })
    })
  }
  
  emit(event: string, data: any) {
    if (this.socket) {
      this.socket.emit(event, data)
    }
  }
  
  on(event: string, callback: (data: any) => void) {
    if (this.socket) {
      this.socket.on(event, callback)
    }
  }
  
  disconnect() {
    if (this.socket) {
      this.socket.disconnect()
      this.socket = null
    }
  }
}

export const socketManager = new SocketManager()
```

## Development Guidelines

### Code Style

#### TypeScript
- Use strict TypeScript configuration
- Define interfaces for all data structures
- Use type guards for runtime type checking
- Prefer `interface` over `type` for object shapes

#### React Components
- Use functional components with hooks
- Implement proper prop validation
- Use React.memo for performance optimization
- Follow the single responsibility principle

#### State Management
- Use local state for component-specific data
- Use global state for shared application data
- Implement proper error boundaries
- Handle loading and error states

### File Organization

```
src/
├── components/          # Reusable components
│   ├── ui/             # UI components (shadcn/ui)
│   ├── forms/          # Form components
│   └── layout/         # Layout components
├── hooks/              # Custom React hooks
├── lib/                # Utility libraries
├── types/              # TypeScript type definitions
├── stores/             # State management
└── api/                # API client functions
```

### Error Handling

```typescript
// Error boundary component
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props)
    this.state = { hasError: false }
  }
  
  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error }
  }
  
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo)
  }
  
  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <h2>Something went wrong</h2>
          <button onClick={() => this.setState({ hasError: false })}>
            Try again
          </button>
        </div>
      )
    }
    
    return this.props.children
  }
}
```

### Testing

```typescript
// Component testing example
import { render, screen, fireEvent } from '@testing-library/react'
import { ChannelManager } from '../ChannelManager'

describe('ChannelManager', () => {
  it('should create a new channel', async () => {
    render(<ChannelManager />)
    
    // Click add channel button
    fireEvent.click(screen.getByText('Add Channel'))
    
    // Fill form
    fireEvent.change(screen.getByLabelText('Channel Name'), {
      target: { value: 'Test Channel' }
    })
    
    fireEvent.change(screen.getByLabelText('Input URL'), {
      target: { value: 'srt://test:9000' }
    })
    
    // Submit form
    fireEvent.click(screen.getByText('Create Channel'))
    
    // Verify channel was created
    expect(screen.getByText('Test Channel')).toBeInTheDocument()
  })
})
```

## Deployment Guide

### Development Environment

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration

# Set up database
npm run db:push

# Start development server
npm run dev
```

### Production Environment

#### Docker Deployment

```dockerfile
# Dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm ci --only=production

# Copy source code
COPY . .

# Build application
RUN npm run build

# Expose port
EXPOSE 3000

# Start application
CMD ["npm", "start"]
```

```yaml
# docker-compose.yml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://user:password@db:5432/streamcontrol
    depends_on:
      - db
    volumes:
      - ./logs:/app/logs
  
  db:
    image: postgres:15
    environment:
      - POSTGRES_DB=streamcontrol
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=password
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

#### Environment Variables

```bash
# .env.production
NODE_ENV=production
DATABASE_URL=postgresql://user:password@localhost:5432/streamcontrol
JWT_SECRET=your-jwt-secret
SOCKET_SECRET=your-socket-secret
FFMPEG_PATH=/usr/bin/ffmpeg
LOG_LEVEL=info
```

### Monitoring and Logging

```typescript
// Logging configuration
import winston from 'winston'

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' })
  ]
})

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }))
}
```

## Performance Optimization

### Frontend Optimization

```typescript
// React.memo for expensive components
const ChannelList = React.memo(({ channels, onChannelClick }) => {
  return (
    <div className="channel-list">
      {channels.map(channel => (
        <ChannelItem
          key={channel.id}
          channel={channel}
          onClick={() => onChannelClick(channel.id)}
        />
      ))}
    </div>
  )
})

// Custom hooks for data fetching
const useChannelData = (channelId: string) => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/channels/${channelId}`)
        const result = await response.json()
        setData(result)
      } catch (err) {
        setError(err)
      } finally {
        setLoading(false)
      }
    }
    
    fetchData()
  }, [channelId])
  
  return { data, loading, error }
}
```

### Backend Optimization

```typescript
// Database query optimization
const getChannelsWithStats = async () => {
  return await prisma.streamingChannel.findMany({
    include: {
      _count: {
        select: {
          events: true,
          logs: true
        }
      },
      events: {
        where: {
          status: 'PENDING',
          startTime: {
            gte: new Date()
          }
        },
        take: 5
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  })
}

// Caching with Redis
import Redis from 'ioredis'

const redis = new Redis(process.env.REDIS_URL)

const getCachedChannelData = async (channelId: string) => {
  const cached = await redis.get(`channel:${channelId}`)
  if (cached) {
    return JSON.parse(cached)
  }
  
  const data = await prisma.streamingChannel.findUnique({
    where: { id: channelId }
  })
  
  await redis.setex(`channel:${channelId}`, 300, JSON.stringify(data))
  return data
}
```

### FFmpeg Process Management

```typescript
// Process pool for FFmpeg
class FFmpegProcessPool {
  private processes = new Map<string, ChildProcess>()
  private maxProcesses = 10
  
  async startProcess(channelId: string, config: FFmpegConfig) {
    if (this.processes.size >= this.maxProcesses) {
      throw new Error('Maximum number of processes reached')
    }
    
    const process = spawn('ffmpeg', this.buildFFmpegArgs(config))
    
    this.processes.set(channelId, process)
    
    process.on('exit', (code) => {
      this.processes.delete(channelId)
      console.log(`FFmpeg process for channel ${channelId} exited with code ${code}`)
    })
    
    process.on('error', (error) => {
      this.processes.delete(channelId)
      console.error(`FFmpeg process error for channel ${channelId}:`, error)
    })
    
    return process
  }
  
  stopProcess(channelId: string) {
    const process = this.processes.get(channelId)
    if (process) {
      process.kill('SIGTERM')
      this.processes.delete(channelId)
    }
  }
  
  private buildFFmpegArgs(config: FFmpegConfig): string[] {
    return [
      '-i', config.inputUrl,
      '-c:v', 'libx264',
      '-preset', 'fast',
      '-crf', '23',
      '-c:a', 'aac',
      '-b:a', '128k',
      '-f', 'mpegts',
      config.outputUrl
    ]
  }
}
```

---

*This technical documentation provides a comprehensive overview of the StreamControl architecture and development guidelines. For specific implementation details, refer to the source code and API documentation.*
