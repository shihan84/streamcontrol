# StreamControl API Reference

**Copyright (c) 2024 Morus Broadcasting Pvt Ltd. All rights reserved.**

This software and documentation are proprietary and confidential. Unauthorized copying, distribution, or use is strictly prohibited.

## Table of Contents
1. [Authentication](#authentication)
2. [Base URL](#base-url)
3. [Error Handling](#error-handling)
4. [Channel Management API](#channel-management-api)
5. [SCTE-35 Events API](#scte-35-events-api)
6. [Stream Logs API](#stream-logs-api)
7. [User Management API](#user-management-api)
8. [System Status API](#system-status-api)
9. [WebSocket API](#websocket-api)

## Authentication

StreamControl uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```http
Authorization: Bearer <your-jwt-token>
```

### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user123",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "ADMIN"
  }
}
```

## Base URL

- **Development**: `http://localhost:3000`
- **Production**: `https://your-domain.com`

## Error Handling

All API endpoints return consistent error responses:

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": {
      "field": "name",
      "issue": "Name is required"
    }
  }
}
```

### Common Error Codes

| Code | Description |
|------|-------------|
| `UNAUTHORIZED` | Authentication required |
| `FORBIDDEN` | Insufficient permissions |
| `NOT_FOUND` | Resource not found |
| `VALIDATION_ERROR` | Invalid input data |
| `INTERNAL_ERROR` | Server error |
| `RATE_LIMITED` | Too many requests |

## Channel Management API

### Get All Channels

```http
GET /api/channels
Authorization: Bearer <token>
```

**Query Parameters:**
- `status` (optional): Filter by status (`ONLINE`, `OFFLINE`, `STARTING`, `STOPPING`, `ERROR`)
- `category` (optional): Filter by category ID
- `search` (optional): Search in name and description
- `limit` (optional): Number of results (default: 50, max: 100)
- `offset` (optional): Number of results to skip (default: 0)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "channel123",
      "name": "Main Channel HD",
      "description": "Primary high-definition entertainment channel",
      "inputUrl": "srt://source:9000",
      "outputUrl": "srt://cdn:1234",
      "status": "ONLINE",
      "bitrate": 8000,
      "resolution": "1920x1080",
      "fps": 30,
      "audioChannels": 2,
      "viewers": 1250,
      "uptime": 9120,
      "categoryId": "cat1",
      "isActive": true,
      "scte35Enabled": true,
      "scte35Pid": 500,
      "tags": ["hd", "entertainment", "primary"],
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-15T12:45:00Z"
    }
  ],
  "pagination": {
    "total": 25,
    "limit": 50,
    "offset": 0,
    "hasMore": false
  }
}
```

### Get Channel by ID

```http
GET /api/channels/{channelId}
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "channel123",
    "name": "Main Channel HD",
    "description": "Primary high-definition entertainment channel",
    "inputUrl": "srt://source:9000",
    "outputUrl": "srt://cdn:1234",
    "status": "ONLINE",
    "bitrate": 8000,
    "resolution": "1920x1080",
    "fps": 30,
    "audioChannels": 2,
    "viewers": 1250,
    "uptime": 9120,
    "categoryId": "cat1",
    "isActive": true,
    "scte35Enabled": true,
    "scte35Pid": 500,
    "tags": ["hd", "entertainment", "primary"],
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T12:45:00Z",
    "events": [
      {
        "id": "event123",
        "type": "INSERT",
        "startTime": "2024-01-15T13:00:00Z",
        "status": "PENDING"
      }
    ],
    "logs": [
      {
        "id": "log123",
        "level": "INFO",
        "message": "Channel started successfully",
        "timestamp": "2024-01-15T10:30:00Z"
      }
    ]
  }
}
```

### Create Channel

```http
POST /api/channels
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "New Channel",
  "description": "A new streaming channel",
  "inputUrl": "srt://source:9000",
  "outputUrl": "srt://cdn:1234",
  "bitrate": 8000,
  "resolution": "1920x1080",
  "fps": 30,
  "audioChannels": 2,
  "categoryId": "cat1",
  "isActive": true,
  "scte35Enabled": true,
  "scte35Pid": 500,
  "tags": ["hd", "entertainment"]
}
```

**Validation Rules:**
- `name`: Required, string, 1-100 characters
- `inputUrl`: Required, valid URL format
- `outputUrl`: Required, valid URL format
- `bitrate`: Optional, integer, 500-50000
- `resolution`: Optional, string, valid resolution format
- `fps`: Optional, integer, 24, 25, 30, 50, or 60
- `audioChannels`: Optional, integer, 1, 2, 6, or 8
- `scte35Pid`: Optional, integer, 16-8190

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "channel456",
    "name": "New Channel",
    "description": "A new streaming channel",
    "inputUrl": "srt://source:9000",
    "outputUrl": "srt://cdn:1234",
    "status": "OFFLINE",
    "bitrate": 8000,
    "resolution": "1920x1080",
    "fps": 30,
    "audioChannels": 2,
    "viewers": 0,
    "uptime": 0,
    "categoryId": "cat1",
    "isActive": true,
    "scte35Enabled": true,
    "scte35Pid": 500,
    "tags": ["hd", "entertainment"],
    "createdAt": "2024-01-15T14:00:00Z",
    "updatedAt": "2024-01-15T14:00:00Z"
  }
}
```

### Update Channel

```http
PUT /api/channels/{channelId}
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Updated Channel Name",
  "bitrate": 10000,
  "isActive": false
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "channel123",
    "name": "Updated Channel Name",
    "description": "Primary high-definition entertainment channel",
    "inputUrl": "srt://source:9000",
    "outputUrl": "srt://cdn:1234",
    "status": "ONLINE",
    "bitrate": 10000,
    "resolution": "1920x1080",
    "fps": 30,
    "audioChannels": 2,
    "viewers": 1250,
    "uptime": 9120,
    "categoryId": "cat1",
    "isActive": false,
    "scte35Enabled": true,
    "scte35Pid": 500,
    "tags": ["hd", "entertainment", "primary"],
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T14:30:00Z"
  }
}
```

### Delete Channel

```http
DELETE /api/channels/{channelId}
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "message": "Channel deleted successfully"
}
```

### Start Channel

```http
POST /api/channels/{channelId}/start
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "channelId": "channel123",
    "status": "STARTING",
    "message": "Channel is starting",
    "estimatedTime": 30
  }
}
```

### Stop Channel

```http
POST /api/channels/{channelId}/stop
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "channelId": "channel123",
    "status": "STOPPING",
    "message": "Channel is stopping",
    "estimatedTime": 10
  }
}
```

### Duplicate Channel

```http
POST /api/channels/{channelId}/duplicate
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Copied Channel",
  "description": "A copy of the original channel"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "channel789",
    "name": "Copied Channel",
    "description": "A copy of the original channel",
    "inputUrl": "srt://source:9000-copy",
    "outputUrl": "srt://cdn:1234-copy",
    "status": "OFFLINE",
    "bitrate": 8000,
    "resolution": "1920x1080",
    "fps": 30,
    "audioChannels": 2,
    "viewers": 0,
    "uptime": 0,
    "categoryId": "cat1",
    "isActive": true,
    "scte35Enabled": true,
    "scte35Pid": 500,
    "tags": ["hd", "entertainment", "primary"],
    "createdAt": "2024-01-15T15:00:00Z",
    "updatedAt": "2024-01-15T15:00:00Z"
  }
}
```

## SCTE-35 Events API

### Get All Events

```http
GET /api/events
Authorization: Bearer <token>
```

**Query Parameters:**
- `channelId` (optional): Filter by channel ID
- `type` (optional): Filter by event type
- `status` (optional): Filter by status
- `startDate` (optional): Filter events after this date
- `endDate` (optional): Filter events before this date
- `limit` (optional): Number of results (default: 50, max: 100)
- `offset` (optional): Number of results to skip (default: 0)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "event123",
      "channelId": "channel123",
      "type": "INSERT",
      "startTime": "2024-01-15T13:00:00Z",
      "endTime": "2024-01-15T13:30:00Z",
      "duration": 1800,
      "description": "Commercial break",
      "status": "PENDING",
      "createdAt": "2024-01-15T12:00:00Z",
      "updatedAt": "2024-01-15T12:00:00Z",
      "channel": {
        "id": "channel123",
        "name": "Main Channel HD"
      }
    }
  ],
  "pagination": {
    "total": 15,
    "limit": 50,
    "offset": 0,
    "hasMore": false
  }
}
```

### Get Event by ID

```http
GET /api/events/{eventId}
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "event123",
    "channelId": "channel123",
    "type": "INSERT",
    "startTime": "2024-01-15T13:00:00Z",
    "endTime": "2024-01-15T13:30:00Z",
    "duration": 1800,
    "description": "Commercial break",
    "status": "PENDING",
    "createdAt": "2024-01-15T12:00:00Z",
    "updatedAt": "2024-01-15T12:00:00Z",
    "channel": {
      "id": "channel123",
      "name": "Main Channel HD",
      "status": "ONLINE"
    }
  }
}
```

### Create Event

```http
POST /api/events
Authorization: Bearer <token>
Content-Type: application/json

{
  "channelId": "channel123",
  "type": "INSERT",
  "startTime": "2024-01-15T13:00:00Z",
  "endTime": "2024-01-15T13:30:00Z",
  "duration": 1800,
  "description": "Commercial break"
}
```

**Validation Rules:**
- `channelId`: Required, valid channel ID
- `type`: Required, one of: `INSERT`, `DELETE`, `TIME_SIGNAL`, `SPLICE_NULL`, `SPLICE_SCHEDULE`
- `startTime`: Required, ISO 8601 datetime
- `endTime`: Optional, ISO 8601 datetime (required for INSERT/DELETE)
- `duration`: Optional, integer in seconds
- `description`: Optional, string, max 500 characters

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "event456",
    "channelId": "channel123",
    "type": "INSERT",
    "startTime": "2024-01-15T13:00:00Z",
    "endTime": "2024-01-15T13:30:00Z",
    "duration": 1800,
    "description": "Commercial break",
    "status": "PENDING",
    "createdAt": "2024-01-15T12:30:00Z",
    "updatedAt": "2024-01-15T12:30:00Z"
  }
}
```

### Update Event

```http
PUT /api/events/{eventId}
Authorization: Bearer <token>
Content-Type: application/json

{
  "startTime": "2024-01-15T14:00:00Z",
  "description": "Updated commercial break"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "event123",
    "channelId": "channel123",
    "type": "INSERT",
    "startTime": "2024-01-15T14:00:00Z",
    "endTime": "2024-01-15T13:30:00Z",
    "duration": 1800,
    "description": "Updated commercial break",
    "status": "PENDING",
    "createdAt": "2024-01-15T12:00:00Z",
    "updatedAt": "2024-01-15T13:00:00Z"
  }
}
```

### Delete Event

```http
DELETE /api/events/{eventId}
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "message": "Event deleted successfully"
}
```

### Trigger Event

```http
POST /api/events/{eventId}/trigger
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "eventId": "event123",
    "status": "RUNNING",
    "message": "Event triggered successfully",
    "timestamp": "2024-01-15T13:00:00Z"
  }
}
```

## Stream Logs API

### Get Channel Logs

```http
GET /api/channels/{channelId}/logs
Authorization: Bearer <token>
```

**Query Parameters:**
- `level` (optional): Filter by log level (`DEBUG`, `INFO`, `WARN`, `ERROR`, `FATAL`)
- `startDate` (optional): Filter logs after this date
- `endDate` (optional): Filter logs before this date
- `limit` (optional): Number of results (default: 100, max: 1000)
- `offset` (optional): Number of results to skip (default: 0)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "log123",
      "channelId": "channel123",
      "level": "INFO",
      "message": "Channel started successfully",
      "metadata": {
        "bitrate": 8000,
        "viewers": 0
      },
      "timestamp": "2024-01-15T10:30:00Z"
    },
    {
      "id": "log124",
      "channelId": "channel123",
      "level": "WARN",
      "message": "High CPU usage detected",
      "metadata": {
        "cpuUsage": 85,
        "memoryUsage": 60
      },
      "timestamp": "2024-01-15T10:35:00Z"
    }
  ],
  "pagination": {
    "total": 250,
    "limit": 100,
    "offset": 0,
    "hasMore": true
  }
}
```

### Create Log Entry

```http
POST /api/logs
Authorization: Bearer <token>
Content-Type: application/json

{
  "channelId": "channel123",
  "level": "INFO",
  "message": "Channel configuration updated",
  "metadata": {
    "bitrate": 10000,
    "resolution": "1920x1080"
  }
}
```

**Validation Rules:**
- `channelId`: Required, valid channel ID
- `level`: Required, one of: `DEBUG`, `INFO`, `WARN`, `ERROR`, `FATAL`
- `message`: Required, string, max 1000 characters
- `metadata`: Optional, JSON object

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "log456",
    "channelId": "channel123",
    "level": "INFO",
    "message": "Channel configuration updated",
    "metadata": {
      "bitrate": 10000,
      "resolution": "1920x1080"
    },
    "timestamp": "2024-01-15T14:00:00Z"
  }
}
```

### Get System Logs

```http
GET /api/logs/system
Authorization: Bearer <token>
```

**Query Parameters:**
- `level` (optional): Filter by log level
- `startDate` (optional): Filter logs after this date
- `endDate` (optional): Filter logs before this date
- `limit` (optional): Number of results (default: 100, max: 1000)
- `offset` (optional): Number of results to skip (default: 0)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "syslog123",
      "level": "INFO",
      "message": "System startup completed",
      "metadata": {
        "version": "1.0.0",
        "uptime": 3600
      },
      "timestamp": "2024-01-15T10:00:00Z"
    }
  ],
  "pagination": {
    "total": 50,
    "limit": 100,
    "offset": 0,
    "hasMore": false
  }
}
```

## User Management API

### Get Current User

```http
GET /api/auth/me
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "user123",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "ADMIN",
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-15T10:00:00Z"
  }
}
```

### Update Profile

```http
PUT /api/auth/profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "John Smith",
  "email": "john.smith@example.com"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "user123",
    "email": "john.smith@example.com",
    "name": "John Smith",
    "role": "ADMIN",
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-15T14:00:00Z"
  }
}
```

### Change Password

```http
POST /api/auth/change-password
Authorization: Bearer <token>
Content-Type: application/json

{
  "currentPassword": "oldpassword123",
  "newPassword": "newpassword123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Password changed successfully"
}
```

## System Status API

### Get System Status

```http
GET /api/system/status
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "status": "healthy",
    "uptime": 86400,
    "version": "1.0.0",
    "channels": {
      "total": 25,
      "online": 18,
      "offline": 5,
      "error": 2
    },
    "system": {
      "cpu": 45.2,
      "memory": 67.8,
      "disk": 23.1,
      "network": {
        "in": 1024,
        "out": 2048
      }
    },
    "ffmpeg": {
      "version": "4.4.2",
      "processes": 18,
      "maxProcesses": 50
    }
  }
}
```

### Get System Metrics

```http
GET /api/system/metrics
Authorization: Bearer <token>
```

**Query Parameters:**
- `period` (optional): Time period (`1h`, `6h`, `24h`, `7d`, `30d`)
- `metric` (optional): Specific metric (`cpu`, `memory`, `disk`, `network`)

**Response:**
```json
{
  "success": true,
  "data": {
    "cpu": [
      {
        "timestamp": "2024-01-15T10:00:00Z",
        "value": 45.2
      },
      {
        "timestamp": "2024-01-15T10:05:00Z",
        "value": 47.8
      }
    ],
    "memory": [
      {
        "timestamp": "2024-01-15T10:00:00Z",
        "value": 67.8
      },
      {
        "timestamp": "2024-01-15T10:05:00Z",
        "value": 68.2
      }
    ]
  }
}
```

## WebSocket API

### Connection

Connect to the WebSocket endpoint:

```javascript
const socket = io('http://localhost:3000', {
  path: '/api/socketio',
  transports: ['websocket', 'polling'],
  auth: {
    token: 'your-jwt-token'
  }
})
```

### Client Events

#### Join Channel Room
```javascript
socket.emit('join-channel', {
  channelId: 'channel123'
})
```

#### Leave Channel Room
```javascript
socket.emit('leave-channel', {
  channelId: 'channel123'
})
```

#### Request Channel Status
```javascript
socket.emit('get-channel-status', {
  channelId: 'channel123'
})
```

#### Start Channel
```javascript
socket.emit('start-channel', {
  channelId: 'channel123'
})
```

#### Stop Channel
```javascript
socket.emit('stop-channel', {
  channelId: 'channel123'
})
```

#### Create Event
```javascript
socket.emit('create-event', {
  channelId: 'channel123',
  type: 'INSERT',
  startTime: '2024-01-15T13:00:00Z',
  endTime: '2024-01-15T13:30:00Z',
  description: 'Commercial break'
})
```

### Server Events

#### Channel Status Update
```javascript
socket.on('channel-status-update', (data) => {
  console.log('Channel status updated:', data)
  // {
  //   channelId: 'channel123',
  //   status: 'ONLINE',
  //   viewers: 1250,
  //   uptime: 9120,
  //   bitrate: 8000,
  //   timestamp: '2024-01-15T14:00:00Z'
  // }
})
```

#### Channel Error
```javascript
socket.on('channel-error', (data) => {
  console.error('Channel error:', data)
  // {
  //   channelId: 'channel123',
  //   error: 'FFmpeg process failed',
  //   timestamp: '2024-01-15T14:00:00Z'
  // }
})
```

#### SCTE-35 Event Triggered
```javascript
socket.on('scte35-event', (data) => {
  console.log('SCTE-35 event triggered:', data)
  // {
  //   channelId: 'channel123',
  //   eventId: 'event123',
  //   type: 'INSERT',
  //   timestamp: '2024-01-15T13:00:00Z'
  // }
})
```

#### System Notification
```javascript
socket.on('system-notification', (data) => {
  console.log('System notification:', data)
  // {
  //   type: 'info',
  //   message: 'System maintenance scheduled',
  //   timestamp: '2024-01-15T14:00:00Z'
  // }
})
```

#### Connection Status
```javascript
socket.on('connect', () => {
  console.log('Connected to server')
})

socket.on('disconnect', () => {
  console.log('Disconnected from server')
})

socket.on('connect_error', (error) => {
  console.error('Connection error:', error)
})
```

### Error Handling

WebSocket errors are returned in the following format:

```javascript
socket.on('error', (data) => {
  console.error('WebSocket error:', data)
  // {
  //   code: 'VALIDATION_ERROR',
  //   message: 'Invalid channel ID',
  //   details: {
  //     field: 'channelId',
  //     issue: 'Channel not found'
  //   }
  // }
})
```

---

*This API reference provides comprehensive documentation for all StreamControl endpoints. For additional examples and use cases, refer to the technical documentation.*
