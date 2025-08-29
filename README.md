# StreamControl - SCTE-35 Streaming Control Center

A comprehensive Next.js-based streaming control center for professional broadcasters with complete SCTE-35 support, real-time monitoring, and advanced event management.

## 🎯 Features

### Core Functionality
- **Real-time Stream Monitoring**: Live stream metrics, health monitoring, and SCTE-35 event detection
- **SCTE-35 Event Management**: Complete event creation, scheduling, and automation
- **FFmpeg Integration**: Advanced FFmpeg command generation and process management
- **SRT Stream Templates**: Configurable templates for broadcast specifications
- **Manual Parameter Editor**: Fine-tune MPEG-TS parameters with precision control

### SCTE-35 Support
- **Event Types**: SPLICE_INSERT, SPLICE_NULL, TIME_SIGNAL, BANDWIDTH_RESERVATION, PRIVATE_COMMAND
- **Command Types**: CUE-OUT, CUE-IN, TIME-SIGNAL, RESERVATION-START, RESERVATION-END
- **Event Templates**: Pre-configured templates for various broadcast scenarios
- **Event Scheduling**: Calendar-based scheduling with recurring event support
- **Command Generation**: Automatic FFmpeg command generation with SCTE-35 integration

### Advanced Features
- **Real-time Monitoring**: Bitrate, viewers, latency, FPS, audio levels, system resources
- **Health Validation**: PID conflict detection, standards compliance checking
- **Template Management**: Import/export templates for team collaboration
- **Preset System**: Built-in presets for different broadcast standards (ATSC, DVB)
- **Manual Parameter Control**: Fine-tune individual MPEG-TS parameters

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- FFmpeg (for stream processing)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/shihan84/streamcontrol.git
cd streamcontrol
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. **Initialize database**
```bash
npm run db:push
```

5. **Start the development server**
```bash
npm run dev
```

6. **Open your browser**
```
http://localhost:3000
```

## 📋 Project Structure

```
streamcontrol/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── page.tsx           # Main dashboard
│   │   ├── layout.tsx         # Root layout
│   │   └── globals.css        # Global styles
│   ├── components/            # React components
│   │   ├── ui/               # shadcn/ui components
│   │   ├── StreamMonitor.tsx # Real-time monitoring
│   │   ├── SCTE35EventManager.tsx # Event management
│   │   ├── FFmpegManager.tsx # FFmpeg integration
│   │   ├── SRTStreamTemplate.tsx # SRT templates
│   │   ├── ManualParameterEditor.tsx # Parameter editor
│   │   └── SCTE35EventTemplate.tsx # Event templates
│   ├── lib/                   # Utilities
│   │   ├── db.ts             # Database client
│   │   ├── socket.ts         # WebSocket configuration
│   │   └── utils.ts          # Helper functions
│   └── hooks/                 # Custom React hooks
├── prisma/                    # Database schema
├── public/                    # Static assets
├── components.json           # shadcn/ui configuration
├── tailwind.config.ts        # Tailwind CSS configuration
├── tsconfig.json            # TypeScript configuration
└── package.json             # Project dependencies
```

## 🔧 Configuration

### Environment Variables

```env
DATABASE_URL="file:./dev.db"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key"
```

### Database Schema

The project uses Prisma ORM with SQLite for development. Key models include:

- **StreamingChannel**: Channel configuration and status
- **SCTE35Event**: Event management and scheduling
- **StreamConfiguration**: FFmpeg configuration templates
- **EventSchedule**: Scheduled event execution
- **StreamLog**: System logging and monitoring

## 🎮 Usage Guide

### 1. Stream Monitoring
- Navigate to the **Real-time Monitor** tab
- View live stream metrics including bitrate, viewers, latency
- Monitor system resources and SCTE-35 event detection
- Track stream health and performance indicators

### 2. SCTE-35 Event Management
- Go to **SCTE-35 Events** → **Event Manager**
- Create, edit, and schedule SCTE-35 events
- Use the **Event Templates** for pre-configured scenarios
- Schedule recurring events with cron patterns

### 3. FFmpeg Integration
- Access **FFmpeg** tab for process management
- Use **Manual Parameters** for fine-tuning MPEG-TS settings
- Generate FFmpeg commands automatically
- Monitor active processes and system logs

### 4. SRT Stream Templates
- Visit **SRT Templates** for broadcast specifications
- Configure templates with exact distributor requirements
- Export/import templates for team sharing
- Validate configurations against broadcast standards

### 5. Manual Parameter Editor
- Navigate to **FFmpeg** → **Manual Parameters**
- Fine-tune individual MPEG-TS parameters:
  - Service ID, PMT Start PID, Start PID
  - Video PID, Audio PID, SCTE-35 PID
  - Null PID and other stream parameters
- Use presets for different broadcast standards
- Validate PID conflicts and compliance

## 📺 Broadcast Specifications

### SRT Stream Template Requirements
- **Video Resolution**: 1920x1080 (HD)
- **Video Codec**: H.264
- **Profile@Level**: High@Auto
- **GOP**: 12 frames
- **B Frames**: 5
- **Video Bitrate**: 5 Mbps
- **Chroma**: 4:2:0
- **Aspect Ratio**: 16:9
- **Audio Codec**: AAC-LC
- **Audio Bitrate**: 128 Kbps
- **Audio LKFS**: -20 dB
- **Audio Sampling Rate**: 48KHz
- **SCTE PID**: 500
- **Null PID**: 8191
- **Latency**: 2000ms

### SCTE-35 Event Requirements
- **Ad Duration**: Configurable (e.g., 600 seconds)
- **Event ID**: Sequential increment (e.g., 100023)
- **Commands**: CUE-OUT, CUE-IN, TIME-SIGNAL
- **Crash Out**: Emergency CUE-IN support
- **Pre-roll**: 0-10 seconds configurable
- **SCTE Data PID**: Configurable (e.g., 500)

### MPEG-TS Parameters
```bash
- mpegts_service_id 1
- mpegts_pmt_start_pid 4096
- mpegts_start_pid 257
- mpegts_pid_video 257
- mpegts_pid_audio 258
- mpegts_scte35_pid 511
- mpegts_null_pid 8191
```

## 🛠️ Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run db:push      # Push database schema
npm run db:studio    # Open Prisma Studio
```

### Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4
- **UI Components**: shadcn/ui
- **Database**: Prisma ORM with SQLite
- **State Management**: Zustand
- **Real-time**: Socket.io
- **Icons**: Lucide React

### Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Support

For support and questions:
- Create an issue in the GitHub repository
- Check the documentation
- Review the example configurations

## 📞 Contact

Created with ❤️ for professional broadcasters. For support and inquiries, please open an issue in the GitHub repository.

---

**StreamControl** - Professional SCTE-35 Streaming Control Center