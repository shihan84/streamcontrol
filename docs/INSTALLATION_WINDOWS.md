# StreamControl Windows Installation Guide

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [System Requirements](#system-requirements)
3. [Installation Steps](#installation-steps)
4. [Configuration](#configuration)
5. [Development Setup](#development-setup)
6. [Production Deployment](#production-deployment)
7. [Troubleshooting](#troubleshooting)

## Prerequisites

### Required Software
- **Windows 10/11** (64-bit)
- **Node.js 18+** (LTS version recommended)
- **Git** for Windows
- **FFmpeg** (for video processing)
- **Visual Studio Build Tools** (for native dependencies)

### Optional Software
- **Docker Desktop** (for containerized deployment)
- **PostgreSQL** (for production database)
- **Redis** (for caching and session storage)

## System Requirements

### Minimum Requirements
- **CPU**: Intel i3 or AMD equivalent (2 cores)
- **RAM**: 4GB
- **Storage**: 10GB free space
- **Network**: Broadband internet connection

### Recommended Requirements
- **CPU**: Intel i5 or AMD equivalent (4+ cores)
- **RAM**: 8GB or more
- **Storage**: 50GB+ SSD
- **Network**: High-speed internet (100+ Mbps)

## Installation Steps

### Step 1: Install Node.js

1. **Download Node.js**
   - Visit [nodejs.org](https://nodejs.org/)
   - Download the LTS version (18.x or higher)
   - Choose the Windows Installer (.msi) for your system architecture

2. **Install Node.js**
   ```powershell
   # Run the downloaded .msi file as Administrator
   # Follow the installation wizard
   # Ensure "Add to PATH" is checked
   ```

3. **Verify Installation**
   ```powershell
   node --version
   npm --version
   ```

### Step 2: Install Git

1. **Download Git for Windows**
   - Visit [git-scm.com](https://git-scm.com/download/win)
   - Download the latest version

2. **Install Git**
   ```powershell
   # Run the downloaded .exe file
   # Use default settings for most options
   # Choose "Git from the command line and also from 3rd-party software"
   ```

3. **Verify Installation**
   ```powershell
   git --version
   ```

### Step 3: Install FFmpeg

#### Option A: Using Chocolatey (Recommended)
1. **Install Chocolatey** (if not already installed)
   ```powershell
   # Run PowerShell as Administrator
   Set-ExecutionPolicy Bypass -Scope Process -Force
   [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072
   iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))
   ```

2. **Install FFmpeg**
   ```powershell
   choco install ffmpeg
   ```

#### Option B: Manual Installation
1. **Download FFmpeg**
   - Visit [ffmpeg.org](https://ffmpeg.org/download.html)
   - Download Windows builds from [gyan.dev](https://www.gyan.dev/ffmpeg/builds/)
   - Choose "ffmpeg-release-essentials.zip"

2. **Extract and Setup**
   ```powershell
   # Extract to C:\ffmpeg
   # Add C:\ffmpeg\bin to your PATH environment variable
   ```

3. **Verify Installation**
   ```powershell
   ffmpeg -version
   ```

### Step 4: Install Visual Studio Build Tools

1. **Download Build Tools**
   - Visit [Visual Studio Downloads](https://visualstudio.microsoft.com/downloads/)
   - Download "Build Tools for Visual Studio 2022"

2. **Install Build Tools**
   ```powershell
   # Run the installer
   # Select "C++ build tools" workload
   # Install
   ```

### Step 5: Clone and Setup StreamControl

1. **Clone Repository**
   ```powershell
   git clone https://github.com/shihan84/streamcontrol.git
   cd streamcontrol
   ```

2. **Install Dependencies**
   ```powershell
   npm install
   ```

3. **Setup Environment Variables**
   ```powershell
   # Create .env file
   Copy-Item .env.example .env
   
   # Edit .env file with your configuration
   notepad .env
   ```

4. **Configure Database**
   ```powershell
   # Generate Prisma client
   npm run db:generate
   
   # Push schema to database
   npm run db:push
   ```

5. **Build Application**
   ```powershell
   npm run build
   ```

## Configuration

### Environment Variables

Create a `.env` file in the project root:

```bash
# Database Configuration
DATABASE_URL="file:./dev.db"

# Server Configuration
NODE_ENV=development
PORT=3000
HOST=0.0.0.0

# Authentication
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=7d

# FFmpeg Configuration
FFMPEG_PATH=C:\ffmpeg\bin\ffmpeg.exe
FFMPEG_THREADS=4

# Logging
LOG_LEVEL=info
LOG_FILE=logs/streamcontrol.log

# Socket.IO
SOCKET_SECRET=your-socket-secret-key

# Optional: Redis (for production)
REDIS_URL=redis://localhost:6379

# Optional: PostgreSQL (for production)
# DATABASE_URL="postgresql://username:password@localhost:5432/streamcontrol"
```

### Windows Firewall Configuration

1. **Allow Node.js through Firewall**
   ```powershell
   # Open Windows Defender Firewall
   # Click "Allow an app or feature through Windows Defender Firewall"
   # Add Node.js and allow it on private and public networks
   ```

2. **Configure Port Access**
   ```powershell
   # Allow port 3000 (or your chosen port)
   netsh advfirewall firewall add rule name="StreamControl" dir=in action=allow protocol=TCP localport=3000
   ```

## Development Setup

### Start Development Server

```powershell
# Start the development server
npm run dev
```

### Access the Application

- Open your browser to `http://localhost:3000`
- The application should be running with hot reload enabled

### Development Tools

1. **Install VS Code Extensions** (Recommended)
   ```powershell
   # Install these VS Code extensions:
   # - TypeScript and JavaScript Language Features
   # - Tailwind CSS IntelliSense
   # - Prisma
   # - ESLint
   # - Prettier
   ```

2. **Setup Git Hooks** (Optional)
   ```powershell
   npm install -g husky
   npx husky install
   ```

## Production Deployment

### Option 1: Direct Deployment

1. **Build for Production**
   ```powershell
   npm run build
   ```

2. **Start Production Server**
   ```powershell
   npm start
   ```

3. **Setup Windows Service** (Optional)
   ```powershell
   # Install PM2 globally
   npm install -g pm2
   
   # Start application with PM2
   pm2 start npm --name "streamcontrol" -- start
   
   # Save PM2 configuration
   pm2 save
   
   # Setup PM2 to start on boot
   pm2 startup
   ```

### Option 2: Docker Deployment

1. **Install Docker Desktop**
   - Download from [docker.com](https://www.docker.com/products/docker-desktop)
   - Install and restart your computer

2. **Build Docker Image**
   ```powershell
   docker build -t streamcontrol .
   ```

3. **Run Container**
   ```powershell
   docker run -d -p 3000:3000 --name streamcontrol streamcontrol
   ```

### Option 3: Using Docker Compose

1. **Create docker-compose.yml**
   ```yaml
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

2. **Start Services**
   ```powershell
   docker-compose up -d
   ```

## Troubleshooting

### Common Issues

#### Node.js Installation Issues
```powershell
# If npm commands fail, try:
npm cache clean --force
npm install -g npm@latest
```

#### FFmpeg Not Found
```powershell
# Check if FFmpeg is in PATH
ffmpeg -version

# If not found, add to PATH manually:
# 1. Open System Properties > Environment Variables
# 2. Add C:\ffmpeg\bin to PATH
# 3. Restart PowerShell
```

#### Port Already in Use
```powershell
# Check what's using port 3000
netstat -ano | findstr :3000

# Kill the process
taskkill /PID <process_id> /F
```

#### Database Issues
```powershell
# Reset database
npm run db:reset

# Or delete and recreate
Remove-Item prisma/dev.db
npm run db:push
```

#### Permission Issues
```powershell
# Run PowerShell as Administrator for system-wide installations
# For project-specific issues, check file permissions
```

### Performance Optimization

1. **Enable Hardware Acceleration**
   ```powershell
   # In your .env file, add:
   FFMPEG_HWACCEL=1
   ```

2. **Optimize Node.js**
   ```powershell
   # Set Node.js options
   $env:NODE_OPTIONS="--max-old-space-size=4096"
   ```

3. **Use SSD Storage**
   - Store the application and database on SSD for better performance

### Security Considerations

1. **Firewall Configuration**
   ```powershell
   # Only allow necessary ports
   # Use Windows Defender Firewall with Advanced Security
   ```

2. **Environment Variables**
   - Never commit `.env` files to version control
   - Use strong, unique secrets for JWT and Socket.IO

3. **Regular Updates**
   ```powershell
   # Update dependencies regularly
   npm audit
   npm update
   ```

### Monitoring and Logging

1. **Setup Logging**
   ```powershell
   # Create logs directory
   New-Item -ItemType Directory -Path logs
   ```

2. **Monitor Application**
   ```powershell
   # Use PM2 for monitoring
   pm2 monit
   
   # Or use Windows Task Manager
   # Monitor CPU, Memory, and Network usage
   ```

## Support

For additional support:
- Check the [User Manual](./USER_MANUAL.md)
- Review the [Technical Documentation](./TECHNICAL_DOCUMENTATION.md)
- Create an issue on GitHub
- Check the troubleshooting section above

---

*This installation guide is specifically designed for Windows environments. For Ubuntu/Linux installation, see [INSTALLATION_UBUNTU.md](./INSTALLATION_UBUNTU.md).*
