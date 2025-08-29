/**
 * StreamControl - Main Dashboard Page
 * 
 * Copyright (c) 2024 Morus Broadcasting Pvt Ltd. All rights reserved.
 * This software is proprietary and confidential.
 * Unauthorized copying, distribution, or use is strictly prohibited.
 */

"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Play, 
  Pause, 
  Square, 
  Settings, 
  Activity, 
  Calendar,
  Signal,
  AlertTriangle,
  CheckCircle,
  Clock,
  Monitor
} from 'lucide-react'
import RealtimeStreamMonitor from '@/components/StreamMonitor'
import SCTE35EventManager from '@/components/SCTE35EventManager'
import FFmpegManager from '@/components/FFmpegManager'
import SRTStreamTemplate from '@/components/SRTStreamTemplate'
import ChannelManager from '@/components/ChannelManager'
import SCTE35EventTemplate from '@/components/SCTE35EventTemplate'
import ClientOnly from '@/components/ClientOnly'

interface Channel {
  id: string
  name: string
  status: 'ONLINE' | 'OFFLINE' | 'STARTING' | 'STOPPING' | 'ERROR'
  bitrate: number
  viewers: number
  uptime: string
  inputUrl: string
  outputUrl: string
}

interface SCTE35Event {
  id: string
  eventId: string
  commandType: string
  description: string
  startTime: string
  duration?: number
  status: 'SCHEDULED' | 'ACTIVE' | 'COMPLETED' | 'FAILED'
}

export default function StreamingDashboard() {
  const [channels, setChannels] = useState<Channel[]>([])
  const [events, setEvents] = useState<SCTE35Event[]>([])
  const [isClient, setIsClient] = useState(false)

  // Initialize data only on client side
  useEffect(() => {
    setIsClient(true)
    
    // Set initial channels data
    setChannels([
      {
        id: '1',
        name: 'Main Channel HD',
        status: 'ONLINE',
        bitrate: 8000,
        viewers: 1250,
        uptime: '2h 34m',
        inputUrl: 'srt://source:9000',
        outputUrl: 'srt://cdn:1234'
      },
      {
        id: '2',
        name: 'Backup Channel',
        status: 'OFFLINE',
        bitrate: 0,
        viewers: 0,
        uptime: '0m',
        inputUrl: 'srt://backup:9000',
        outputUrl: 'srt://cdn:1235'
      }
    ])

    // Set initial events data
    setEvents([
      {
        id: '1',
        eventId: 'EVT001',
        commandType: 'SPLICE_INSERT',
        description: 'Commercial Break - Prime Time',
        startTime: '2024-01-15T20:00:00Z',
        duration: 120,
        status: 'SCHEDULED'
      },
      {
        id: '2',
        eventId: 'EVT002',
        commandType: 'TIME_SIGNAL',
        description: 'Program Start Marker',
        startTime: '2024-01-15T20:02:00Z',
        status: 'SCHEDULED'
      }
    ])
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ONLINE': return 'bg-green-500'
      case 'OFFLINE': return 'bg-gray-500'
      case 'STARTING': return 'bg-yellow-500'
      case 'STOPPING': return 'bg-orange-500'
      case 'ERROR': return 'bg-red-500'
      case 'SCHEDULED': return 'bg-blue-500'
      case 'ACTIVE': return 'bg-green-500'
      case 'COMPLETED': return 'bg-gray-500'
      case 'FAILED': return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ONLINE':
      case 'ACTIVE':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'ERROR':
      case 'FAILED':
        return <AlertTriangle className="h-4 w-4 text-red-500" />
      case 'STARTING':
      case 'STOPPING':
      case 'SCHEDULED':
        return <Clock className="h-4 w-4 text-yellow-500" />
      default:
        return <Square className="h-4 w-4 text-gray-500" />
    }
  }

  const formatDateTime = (dateString: string) => {
    // Use consistent date formatting to avoid hydration issues
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    })
  }

  if (!isClient) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading Streaming Dashboard...</p>
        </div>
      </div>
    )
  }

  const formatBitrate = (bitrate: number) => {
    if (bitrate >= 1000) {
      return `${(bitrate / 1000).toFixed(1)} Mbps`
    }
    return `${bitrate} kbps`
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="flex h-16 items-center px-6">
          <div className="flex items-center space-x-4">
            <Activity className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-2xl font-bold">SCTE-35 Streaming Control Center</h1>
              <p className="text-sm text-muted-foreground">Professional Broadcast Management</p>
            </div>
          </div>
          <div className="ml-auto flex items-center space-x-4">
            <Badge variant="outline" className="flex items-center space-x-2">
              <Signal className="h-3 w-3" />
              <span>System Online</span>
            </Badge>
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-7">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="monitoring">Real-time Monitor</TabsTrigger>
            <TabsTrigger value="ffmpeg">FFmpeg</TabsTrigger>
            <TabsTrigger value="templates">SRT Templates</TabsTrigger>
            <TabsTrigger value="channels">Channels</TabsTrigger>
            <TabsTrigger value="events">SCTE-35 Events</TabsTrigger>
            <TabsTrigger value="logs">Logs</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* System Status */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Channels</CardTitle>
                  <Activity className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">1/2</div>
                  <p className="text-xs text-muted-foreground">Channels Online</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Viewers</CardTitle>
                  <Signal className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">1,250</div>
                  <p className="text-xs text-muted-foreground">Across all channels</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Scheduled Events</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">2</div>
                  <p className="text-xs text-muted-foreground">Next 24 hours</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">System Health</CardTitle>
                  <CheckCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">98%</div>
                  <p className="text-xs text-muted-foreground">Uptime this week</p>
                </CardContent>
              </Card>
            </div>

            {/* Active Channels */}
            <Card>
              <CardHeader>
                <CardTitle>Active Channels</CardTitle>
                <CardDescription>Monitor your live streaming channels</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {channels.map((channel) => (
                    <div key={channel.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className={`h-3 w-3 rounded-full ${getStatusColor(channel.status)}`} />
                        <div>
                          <h3 className="font-medium">{channel.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {formatBitrate(channel.bitrate)} • {channel.viewers.toLocaleString()} viewers
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline">{channel.status}</Badge>
                        <span className="text-sm text-muted-foreground">{channel.uptime}</span>
                        <div className="flex space-x-1">
                          <Button size="sm" variant="outline">
                            <Play className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Pause className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Square className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Upcoming Events */}
            <Card>
              <CardHeader>
                <CardTitle>Upcoming SCTE-35 Events</CardTitle>
                <CardDescription>Scheduled ad insertion and program events</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {events.map((event) => (
                    <div key={event.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        {getStatusIcon(event.status)}
                        <div>
                          <h3 className="font-medium">{event.eventId} - {event.commandType}</h3>
                          <p className="text-sm text-muted-foreground">{event.description}</p>
                          <p className="text-xs text-muted-foreground">
                            {formatDateTime(event.startTime)}
                            {event.duration && ` • ${event.duration}s duration`}
                          </p>
                        </div>
                      </div>
                      <Badge variant="outline">{event.status}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="monitoring">
            <ClientOnly fallback={<div className="p-8 text-center">Loading monitor...</div>}>
              <RealtimeStreamMonitor channelId="1" channelName="Main Channel HD" />
            </ClientOnly>
          </TabsContent>

          <TabsContent value="ffmpeg">
            <FFmpegManager />
          </TabsContent>

          <TabsContent value="templates">
            <ClientOnly fallback={<div className="p-8 text-center">Loading templates...</div>}>
              <SRTStreamTemplate />
            </ClientOnly>
          </TabsContent>

          <TabsContent value="channels">
            <ClientOnly fallback={<div className="p-8 text-center">Loading channel manager...</div>}>
              <ChannelManager />
            </ClientOnly>
          </TabsContent>

          <TabsContent value="events">
            <ClientOnly fallback={<div className="p-8 text-center">Loading event manager...</div>}>
              <Tabs defaultValue="manager" className="space-y-6">
                <TabsList>
                  <TabsTrigger value="manager">Event Manager</TabsTrigger>
                  <TabsTrigger value="templates">Event Templates</TabsTrigger>
                </TabsList>
                
                <TabsContent value="manager">
                  <SCTE35EventManager channelId="1" />
                </TabsContent>
                
                <TabsContent value="templates">
                  <SCTE35EventTemplate channelId="1" />
                </TabsContent>
              </Tabs>
            </ClientOnly>
          </TabsContent>

          <TabsContent value="logs">
            <Card>
              <CardHeader>
                <CardTitle>System Logs</CardTitle>
                <CardDescription>Monitor system events and stream health</CardDescription>
              </CardHeader>
              <CardContent>
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    System logs interface will be implemented here. This will include real-time log monitoring, 
                    filtering, and alert management.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}