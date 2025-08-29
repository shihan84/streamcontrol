# StreamControl Documentation

Welcome to the StreamControl documentation! This comprehensive guide will help you understand, install, configure, and use the StreamControl streaming management platform.

## 📚 Documentation Index

### 🚀 Getting Started
- **[User Manual](./USER_MANUAL.md)** - Complete user guide for StreamControl
- **[Technical Documentation](./TECHNICAL_DOCUMENTATION.md)** - Architecture and development details
- **[API Reference](./API_REFERENCE.md)** - Complete API documentation

### 📖 Quick Start Guide

#### Prerequisites
- Node.js 18+ installed
- FFmpeg (for video processing features)
- Modern web browser (Chrome, Firefox, Safari, Edge)

#### Installation
```bash
# Clone the repository
git clone <repository-url>
cd streamcontrol

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration

# Set up the database
npm run db:push

# Start the development server
npm run dev
```

#### Access the Application
Open your browser to `http://localhost:3000`

## 🎯 What is StreamControl?

StreamControl is a comprehensive streaming management platform designed for professional broadcast environments. It provides:

- **Multi-Channel Management**: Create, configure, and manage multiple streaming channels
- **Real-time Monitoring**: Live status updates, viewer counts, and performance metrics
- **SCTE-35 Integration**: Professional ad insertion and program scheduling
- **FFmpeg Integration**: Advanced video processing and transcoding
- **Modern Web Interface**: Responsive design with intuitive controls

## 🏗️ Architecture Overview

StreamControl follows a modern full-stack architecture:

```
Frontend (Next.js + React) ←→ Backend (Node.js + Express) ←→ Database (SQLite/PostgreSQL)
         ↓                              ↓
   Real-time Updates              FFmpeg Processes
   (Socket.IO)                   (Child Processes)
```

### Technology Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | Next.js 15, React, TypeScript, Tailwind CSS, shadcn/ui |
| **Backend** | Node.js, Express.js, Socket.IO, Prisma ORM |
| **Database** | SQLite (dev), PostgreSQL (prod) |
| **Real-time** | Socket.IO |
| **Video Processing** | FFmpeg |
| **Authentication** | JWT |

## 📋 Key Features

### 🎬 Channel Management
- Create and configure streaming channels
- Real-time status monitoring
- Channel start/stop controls
- Duplicate and edit channels
- Search and filter functionality

### 📊 Real-time Monitoring
- Live viewer counts
- Performance metrics
- System health indicators
- Error detection and reporting

### 📺 SCTE-35 Events
- Professional ad insertion
- Program scheduling
- Event management
- Compliance tracking

### 🎥 FFmpeg Integration
- Advanced video processing
- Transcoding configurations
- Stream templates
- Performance optimization

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```bash
# Database
DATABASE_URL="file:./dev.db"

# Server
NODE_ENV=development
PORT=3000

# Authentication
JWT_SECRET=your-jwt-secret-key

# FFmpeg
FFMPEG_PATH=/usr/bin/ffmpeg

# Logging
LOG_LEVEL=info
```

### Database Setup

The application uses Prisma ORM with SQLite for development:

```bash
# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push

# Run migrations (if needed)
npm run db:migrate
```

## 🚀 Deployment

### Development
```bash
npm run dev
```

### Production
```bash
# Build the application
npm run build

# Start production server
npm start
```

### Docker Deployment
```bash
# Build and run with Docker Compose
docker-compose up -d
```

## 📖 Usage Examples

### Creating a Channel
1. Navigate to the "Channels" tab
2. Click "Add Channel"
3. Fill in the channel details:
   - **Name**: "My Channel"
   - **Input URL**: `srt://source:9000`
   - **Output URL**: `srt://cdn:1234`
   - **Resolution**: 1920x1080
   - **Bitrate**: 8000 kbps
4. Click "Create Channel"

### Starting a Channel
1. Find your channel in the list
2. Click the play button (▶️) next to the channel
3. Monitor the status change from "OFFLINE" to "STARTING" to "ONLINE"

### Creating SCTE-35 Events
1. Navigate to the "SCTE-35 Events" tab
2. Click "Create Event"
3. Configure the event:
   - **Channel**: Select target channel
   - **Type**: INSERT (for ad insertion)
   - **Start Time**: Set when the event should trigger
   - **Duration**: Set how long the event should run
4. Click "Create Event"

## 🔍 Troubleshooting

### Common Issues

#### Channel Won't Start
- Check if FFmpeg is installed and accessible
- Verify input/output URLs are correct
- Check network connectivity
- Review system logs

#### High CPU Usage
- Reduce video bitrate
- Lower resolution
- Enable hardware acceleration
- Monitor system resources

#### SCTE-35 Not Working
- Verify SCTE-35 is enabled on the channel
- Check PID configuration
- Ensure events are properly scheduled
- Review event logs

### Getting Help

1. **Check the logs**: Review system and channel logs for error messages
2. **Verify configuration**: Ensure all settings are correct
3. **Test connectivity**: Verify network and stream URLs
4. **Review documentation**: Check the detailed documentation files

## 🤝 Contributing

We welcome contributions! Please see our contributing guidelines for more information.

### Development Setup
```bash
# Fork and clone the repository
git clone <your-fork-url>
cd streamcontrol

# Install dependencies
npm install

# Set up development environment
npm run db:push

# Start development server
npm run dev
```

### Code Style
- Use TypeScript for all new code
- Follow ESLint configuration
- Write tests for new features
- Update documentation as needed

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:

1. **Documentation**: Check the detailed documentation files
2. **Issues**: Create an issue on GitHub
3. **Discussions**: Use GitHub Discussions for questions
4. **Email**: Contact the development team

---

## 📚 Additional Resources

- **[User Manual](./USER_MANUAL.md)** - Complete user guide
- **[Technical Documentation](./TECHNICAL_DOCUMENTATION.md)** - Architecture details
- **[API Reference](./API_REFERENCE.md)** - API documentation
- **[GitHub Repository](https://github.com/your-org/streamcontrol)** - Source code
- **[FFmpeg Documentation](https://ffmpeg.org/documentation.html)** - Video processing reference
- **[SCTE-35 Standards](https://www.scte.org/standards/)** - Professional broadcast standards

---

*This documentation is maintained by the StreamControl development team. For the latest updates, please check the GitHub repository.*
