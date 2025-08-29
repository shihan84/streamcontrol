# StreamControl Ubuntu 22.04 Installation Guide

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [System Requirements](#system-requirements)
3. [Installation Steps](#installation-steps)
4. [Configuration](#configuration)
5. [Development Setup](#development-setup)
6. [Production Deployment](#production-deployment)
7. [Systemd Service Setup](#systemd-service-setup)
8. [Troubleshooting](#troubleshooting)

## Prerequisites

### Required Software
- **Ubuntu 22.04 LTS** (64-bit)
- **Node.js 18+** (LTS version recommended)
- **Git**
- **FFmpeg** (for video processing)
- **Build Essentials** (for native dependencies)

### Optional Software
- **Docker** (for containerized deployment)
- **PostgreSQL** (for production database)
- **Redis** (for caching and session storage)
- **Nginx** (for reverse proxy)

## System Requirements

### Minimum Requirements
- **CPU**: 2 cores (Intel/AMD)
- **RAM**: 4GB
- **Storage**: 20GB free space
- **Network**: Broadband internet connection

### Recommended Requirements
- **CPU**: 4+ cores (Intel i5/AMD equivalent or better)
- **RAM**: 8GB or more
- **Storage**: 50GB+ SSD
- **Network**: High-speed internet (100+ Mbps)

## Installation Steps

### Step 1: Update System

```bash
# Update package list and upgrade existing packages
sudo apt update && sudo apt upgrade -y

# Install essential packages
sudo apt install -y curl wget git build-essential software-properties-common
```

### Step 2: Install Node.js

#### Option A: Using NodeSource Repository (Recommended)
```bash
# Add NodeSource repository
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -

# Install Node.js
sudo apt install -y nodejs

# Verify installation
node --version
npm --version
```

#### Option B: Using Node Version Manager (nvm)
```bash
# Install nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Reload shell configuration
source ~/.bashrc

# Install Node.js LTS
nvm install --lts
nvm use --lts

# Verify installation
node --version
npm --version
```

### Step 3: Install FFmpeg

```bash
# Add FFmpeg repository
sudo add-apt-repository ppa:savoury1/ffmpeg4 -y
sudo apt update

# Install FFmpeg
sudo apt install -y ffmpeg

# Verify installation
ffmpeg -version
```

### Step 4: Install Additional Dependencies

```bash
# Install build tools and libraries
sudo apt install -y python3 make g++ libc6-dev

# Install additional system libraries
sudo apt install -y libssl-dev libffi-dev
```

### Step 5: Clone and Setup StreamControl

```bash
# Clone repository
git clone https://github.com/shihan84/streamcontrol.git
cd streamcontrol

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env
nano .env
```

### Step 6: Configure Database

```bash
# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push

# Build application
npm run build
```

## Configuration

### Environment Variables

Edit the `.env` file:

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
FFMPEG_PATH=/usr/bin/ffmpeg
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

### Firewall Configuration

```bash
# Install UFW if not already installed
sudo apt install -y ufw

# Allow SSH (if using)
sudo ufw allow ssh

# Allow application port
sudo ufw allow 3000

# Enable firewall
sudo ufw enable

# Check status
sudo ufw status
```

## Development Setup

### Start Development Server

```bash
# Start development server
npm run dev
```

### Access the Application

- Open your browser to `http://localhost:3000`
- For remote access: `http://your-server-ip:3000`

### Development Tools

```bash
# Install global development tools
npm install -g nodemon typescript ts-node

# Install VS Code (optional)
sudo snap install code --classic
```

## Production Deployment

### Option 1: Direct Deployment

```bash
# Build for production
npm run build

# Start production server
npm start
```

### Option 2: Using PM2 (Recommended)

```bash
# Install PM2 globally
sudo npm install -g pm2

# Start application with PM2
pm2 start npm --name "streamcontrol" -- start

# Save PM2 configuration
pm2 save

# Setup PM2 to start on boot
pm2 startup
```

### Option 3: Docker Deployment

```bash
# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Add user to docker group
sudo usermod -aG docker $USER

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/download/v2.20.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Build and run
docker build -t streamcontrol .
docker run -d -p 3000:3000 --name streamcontrol streamcontrol
```

### Option 4: Using Docker Compose

Create `docker-compose.yml`:

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
    restart: unless-stopped
  
  db:
    image: postgres:15
    environment:
      - POSTGRES_DB=streamcontrol
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    restart: unless-stopped

volumes:
  postgres_data:
```

Start services:

```bash
docker-compose up -d
```

## Systemd Service Setup

### Create Systemd Service File

```bash
# Create service file
sudo nano /etc/systemd/system/streamcontrol.service
```

Add the following content:

```ini
[Unit]
Description=StreamControl Application
After=network.target

[Service]
Type=simple
User=ubuntu
WorkingDirectory=/home/ubuntu/streamcontrol
ExecStart=/usr/bin/npm start
Restart=on-failure
RestartSec=10
Environment=NODE_ENV=production
Environment=PORT=3000

[Install]
WantedBy=multi-user.target
```

### Enable and Start Service

```bash
# Reload systemd
sudo systemctl daemon-reload

# Enable service
sudo systemctl enable streamcontrol

# Start service
sudo systemctl start streamcontrol

# Check status
sudo systemctl status streamcontrol

# View logs
sudo journalctl -u streamcontrol -f
```

## Nginx Reverse Proxy Setup

### Install Nginx

```bash
sudo apt install -y nginx
```

### Configure Nginx

```bash
# Create Nginx configuration
sudo nano /etc/nginx/sites-available/streamcontrol
```

Add the following configuration:

```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # WebSocket support
    location /api/socketio/ {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### Enable Site

```bash
# Create symbolic link
sudo ln -s /etc/nginx/sites-available/streamcontrol /etc/nginx/sites-enabled/

# Test configuration
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx

# Allow HTTP/HTTPS through firewall
sudo ufw allow 'Nginx Full'
```

## SSL Certificate Setup (Let's Encrypt)

### Install Certbot

```bash
sudo apt install -y certbot python3-certbot-nginx
```

### Obtain SSL Certificate

```bash
sudo certbot --nginx -d your-domain.com -d www.your-domain.com
```

### Auto-renewal

```bash
# Test auto-renewal
sudo certbot renew --dry-run

# Certbot creates a cron job automatically
```

## Troubleshooting

### Common Issues

#### Node.js Installation Issues
```bash
# Clear npm cache
npm cache clean --force

# Update npm
sudo npm install -g npm@latest

# Check Node.js version
node --version
```

#### FFmpeg Not Found
```bash
# Check if FFmpeg is installed
which ffmpeg

# Reinstall if needed
sudo apt remove ffmpeg
sudo apt install ffmpeg
```

#### Port Already in Use
```bash
# Check what's using port 3000
sudo netstat -tulpn | grep :3000

# Kill the process
sudo kill -9 <process_id>
```

#### Database Issues
```bash
# Reset database
npm run db:reset

# Or delete and recreate
rm prisma/dev.db
npm run db:push
```

#### Permission Issues
```bash
# Fix ownership
sudo chown -R $USER:$USER /home/ubuntu/streamcontrol

# Fix permissions
chmod -R 755 /home/ubuntu/streamcontrol
```

### Performance Optimization

#### Enable Hardware Acceleration
```bash
# Check available hardware acceleration
ffmpeg -hwaccels

# In your .env file, add:
FFMPEG_HWACCEL=1
```

#### Optimize Node.js
```bash
# Set Node.js options
export NODE_OPTIONS="--max-old-space-size=4096"

# Add to ~/.bashrc for persistence
echo 'export NODE_OPTIONS="--max-old-space-size=4096"' >> ~/.bashrc
```

#### System Optimization
```bash
# Update system limits
sudo nano /etc/security/limits.conf

# Add these lines:
* soft nofile 65536
* hard nofile 65536
```

### Security Considerations

#### Firewall Configuration
```bash
# Only allow necessary ports
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow ssh
sudo ufw allow 80
sudo ufw allow 443
sudo ufw allow 3000  # Only if not using Nginx
```

#### Environment Variables
```bash
# Generate strong secrets
openssl rand -base64 32

# Never commit .env files
echo ".env" >> .gitignore
```

#### Regular Updates
```bash
# Update system regularly
sudo apt update && sudo apt upgrade -y

# Update Node.js dependencies
npm audit
npm update
```

### Monitoring and Logging

#### Setup Logging
```bash
# Create logs directory
mkdir -p logs

# Setup log rotation
sudo nano /etc/logrotate.d/streamcontrol
```

Add log rotation configuration:

```
/home/ubuntu/streamcontrol/logs/*.log {
    daily
    missingok
    rotate 52
    compress
    delaycompress
    notifempty
    create 644 ubuntu ubuntu
}
```

#### Monitor Application
```bash
# Monitor with PM2
pm2 monit

# Monitor system resources
htop

# Monitor disk usage
df -h

# Monitor memory usage
free -h
```

#### Setup Monitoring Scripts
```bash
# Create monitoring script
nano monitor.sh
```

```bash
#!/bin/bash
# Monitor script for StreamControl

# Check if application is running
if ! pgrep -f "streamcontrol" > /dev/null; then
    echo "$(date): StreamControl is not running. Restarting..."
    pm2 restart streamcontrol
fi

# Check disk usage
DISK_USAGE=$(df / | awk 'NR==2 {print $5}' | sed 's/%//')
if [ $DISK_USAGE -gt 80 ]; then
    echo "$(date): Disk usage is high: ${DISK_USAGE}%"
fi

# Check memory usage
MEMORY_USAGE=$(free | awk 'NR==2{printf "%.2f", $3*100/$2}')
if (( $(echo "$MEMORY_USAGE > 80" | bc -l) )); then
    echo "$(date): Memory usage is high: ${MEMORY_USAGE}%"
fi
```

Make executable and add to cron:

```bash
chmod +x monitor.sh
crontab -e

# Add this line to run every 5 minutes:
*/5 * * * * /home/ubuntu/streamcontrol/monitor.sh >> /home/ubuntu/streamcontrol/logs/monitor.log 2>&1
```

## Support

For additional support:
- Check the [User Manual](./USER_MANUAL.md)
- Review the [Technical Documentation](./TECHNICAL_DOCUMENTATION.md)
- Create an issue on GitHub
- Check the troubleshooting section above

---

*This installation guide is specifically designed for Ubuntu 22.04 LTS. For Windows installation, see [INSTALLATION_WINDOWS.md](./INSTALLATION_WINDOWS.md).*
