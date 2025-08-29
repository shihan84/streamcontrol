# StreamControl User Manual

## Table of Contents
1. [Introduction](#introduction)
2. [Getting Started](#getting-started)
3. [Dashboard Overview](#dashboard-overview)
4. [Channel Management](#channel-management)
5. [Real-time Monitoring](#real-time-monitoring)
6. [FFmpeg Integration](#ffmpeg-integration)
7. [SCTE-35 Events](#scte-35-events)
8. [Troubleshooting](#troubleshooting)
9. [Keyboard Shortcuts](#keyboard-shortcuts)

## Introduction

StreamControl is a comprehensive streaming management platform designed for professional broadcast environments. It provides real-time monitoring, channel management, SCTE-35 event handling, and FFmpeg integration for seamless streaming operations.

### Key Features
- **Multi-Channel Management**: Create, configure, and manage multiple streaming channels
- **Real-time Monitoring**: Live status updates, viewer counts, and performance metrics
- **SCTE-35 Integration**: Professional ad insertion and program scheduling
- **FFmpeg Integration**: Advanced video processing and transcoding
- **Modern Web Interface**: Responsive design with intuitive controls

## Getting Started

### Prerequisites
- Node.js 18+ installed
- FFmpeg (for video processing features)
- Modern web browser (Chrome, Firefox, Safari, Edge)

### Installation
1. Clone the repository
2. Install dependencies: `npm install`
3. Set up the database: `npm run db:push`
4. Start the development server: `npm run dev`
5. Open your browser to `http://localhost:3000`

## Dashboard Overview

The main dashboard provides a comprehensive view of your streaming operations with four main tabs:

### 1. Real-time Monitor
- Live status of all channels
- Performance metrics and statistics
- System health indicators
- Quick access to channel controls

### 2. Channel Management
- Create and configure streaming channels
- Manage channel settings and parameters
- Monitor channel status and performance
- Search and filter channels

### 3. FFmpeg Integration
- Advanced video processing tools
- Transcoding configurations
- Stream template management
- Performance optimization settings

### 4. SCTE-35 Events
- Professional ad insertion
- Program scheduling
- Event management and monitoring
- Compliance tracking

## Channel Management

### Creating a New Channel

1. **Navigate to Channel Management**
   - Click on the "Channels" tab in the main dashboard
   - Click the "Add Channel" button in the top-right corner

2. **Basic Information**
   - **Channel Name**: Enter a descriptive name for your channel
   - **Category**: Select from predefined categories (Entertainment, Sports, News, etc.)
   - **Description**: Provide a detailed description of the channel content

3. **Stream Configuration**
   - **Input URL**: Source stream URL (e.g., `srt://source:9000`)
   - **Output URL**: Destination stream URL (e.g., `srt://cdn:1234`)

4. **Video Configuration**
   - **Resolution**: Choose from 4K UHD, Full HD, HD, SD, or nHD
   - **Bitrate**: Set video bitrate in kbps (500-50,000 range)
   - **Frame Rate**: Select FPS (24, 25, 30, 50, or 60)

5. **Audio Configuration**
   - **Audio Channels**: Choose Mono (1.0), Stereo (2.0), Surround 5.1, or Surround 7.1

6. **SCTE-35 Configuration**
   - **Enable SCTE-35**: Toggle for ad insertion capabilities
   - **SCTE-35 PID**: Set the PID for SCTE-35 data (16-8190 range)

7. **Status Configuration**
   - **Channel Active**: Enable/disable the channel

8. **Save Channel**
   - Click "Create Channel" to save your configuration

### Managing Existing Channels

#### Channel Actions
- **Start Channel**: Click the play button (▶️) to start streaming
- **Stop Channel**: Click the pause button (⏸️) to stop streaming
- **Edit Channel**: Click the edit button (✏️) to modify settings
- **Duplicate Channel**: Click the copy button (📋) to create a copy
- **Delete Channel**: Click the trash button (🗑️) to remove the channel

#### Channel Information Display
Each channel shows:
- **Status Indicator**: Color-coded status (Online, Offline, Starting, Stopping, Error)
- **Viewer Count**: Current number of viewers
- **Uptime**: How long the channel has been streaming
- **Bitrate**: Current video bitrate
- **Resolution & FPS**: Video quality settings
- **Audio Configuration**: Number of audio channels
- **SCTE-35 Status**: Whether SCTE-35 is enabled and PID

#### Search and Filter
- **Search**: Use the search box to find channels by name or description
- **Category Filter**: Use the dropdown to filter channels by category
- **Status Filter**: View only online, offline, or all channels

### Channel Statistics

The dashboard displays key metrics:
- **Total Channels**: Number of configured channels
- **Online Channels**: Currently streaming channels
- **Total Viewers**: Combined viewer count across all channels
- **SCTE-35 Enabled**: Number of channels with SCTE-35 active

## Real-time Monitoring

### Live Status Monitoring
- **Status Indicators**: Real-time status updates for all channels
- **Performance Metrics**: Live viewer counts, bitrate, and uptime
- **System Health**: Overall system performance indicators

### Channel Controls
- **Quick Start/Stop**: Direct controls for each channel
- **Status Updates**: Real-time status changes
- **Error Handling**: Automatic error detection and reporting

## FFmpeg Integration

### Stream Templates
- **Predefined Templates**: Common streaming configurations
- **Custom Templates**: Create your own FFmpeg configurations
- **Template Management**: Save, edit, and delete templates

### Transcoding Options
- **Video Codecs**: H.264, H.265, VP9 support
- **Audio Codecs**: AAC, MP3, Opus support
- **Quality Settings**: Adjustable quality parameters
- **Performance Optimization**: Hardware acceleration options

## SCTE-35 Events

### Event Management
- **Create Events**: Set up ad insertion and program events
- **Schedule Events**: Plan events for specific times
- **Monitor Events**: Track event execution and status

### Event Types
- **Ad Insertion**: Commercial break insertion
- **Program Changes**: Content switching events
- **Emergency Alerts**: Critical broadcast messages
- **Custom Events**: User-defined event types

### Event Configuration
- **Event Duration**: Set how long events should run
- **Event Priority**: Define event importance levels
- **Target Channels**: Specify which channels receive events
- **Event Parameters**: Configure event-specific settings

## Troubleshooting

### Common Issues

#### Channel Won't Start
1. **Check Input URL**: Verify the source stream is accessible
2. **Check Output URL**: Ensure the destination accepts the stream
3. **Verify Network**: Confirm network connectivity
4. **Check FFmpeg**: Ensure FFmpeg is properly installed

#### High Bitrate Issues
1. **Reduce Resolution**: Lower the video resolution
2. **Adjust Bitrate**: Decrease the bitrate setting
3. **Check Network**: Verify sufficient bandwidth
4. **Optimize Settings**: Use hardware acceleration if available

#### SCTE-35 Not Working
1. **Check PID**: Verify the SCTE-35 PID is correct
2. **Enable SCTE-35**: Ensure SCTE-35 is enabled on the channel
3. **Verify Events**: Confirm events are properly configured
4. **Check Timing**: Ensure event timing is correct

#### Performance Issues
1. **Monitor Resources**: Check CPU and memory usage
2. **Optimize Settings**: Adjust video/audio parameters
3. **Update FFmpeg**: Ensure you're using the latest version
4. **Check Network**: Verify network performance

### Error Messages

#### "Unable to connect to stream"
- Check if the source stream is running
- Verify the input URL is correct
- Ensure network connectivity

#### "FFmpeg process failed"
- Check FFmpeg installation
- Verify input/output parameters
- Check system resources

#### "SCTE-35 event failed"
- Verify SCTE-35 PID configuration
- Check event timing settings
- Ensure channel supports SCTE-35

## Keyboard Shortcuts

### Navigation
- `Ctrl/Cmd + 1`: Switch to Real-time Monitor
- `Ctrl/Cmd + 2`: Switch to Channel Management
- `Ctrl/Cmd + 3`: Switch to FFmpeg Integration
- `Ctrl/Cmd + 4`: Switch to SCTE-35 Events

### Channel Management
- `Ctrl/Cmd + N`: Create new channel
- `Ctrl/Cmd + F`: Focus search box
- `Ctrl/Cmd + E`: Edit selected channel
- `Delete`: Delete selected channel

### General
- `F5`: Refresh page
- `Ctrl/Cmd + R`: Refresh data
- `Esc`: Close dialogs
- `Enter`: Submit forms

## Best Practices

### Channel Configuration
1. **Use Descriptive Names**: Make channel names clear and identifiable
2. **Set Appropriate Bitrates**: Match bitrate to resolution and content
3. **Enable SCTE-35**: For professional broadcast environments
4. **Monitor Performance**: Regularly check channel metrics

### System Management
1. **Regular Backups**: Backup channel configurations
2. **Monitor Resources**: Keep track of system performance
3. **Update Software**: Keep FFmpeg and dependencies updated
4. **Test Configurations**: Test new settings before production use

### Network Optimization
1. **Bandwidth Planning**: Ensure sufficient bandwidth for all channels
2. **Quality Settings**: Balance quality with performance
3. **Redundancy**: Consider backup streaming paths
4. **Monitoring**: Continuously monitor network performance

## Support

For additional support:
- Check the troubleshooting section above
- Review the technical documentation
- Contact your system administrator
- Refer to FFmpeg documentation for advanced configurations

---

*This user manual covers the basic functionality of StreamControl. For advanced features and technical details, please refer to the technical documentation.*
