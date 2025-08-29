"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { 
  Activity, 
  Signal, 
  Users, 
  Clock, 
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  TrendingDown,
  Play,
  Pause,
  Square
} from 'lucide-react'

interface StreamMetrics {
  channelId: string
  bitrate: number
  viewers: number
  latency: number
  fps: number
  audioLevel: number
  cpuUsage: number
  memoryUsage: number
  timestamp: string
}

interface StreamHealth {
  channelId: string
  status: 'HEALTHY' | 'WARNING' | 'CRITICAL'
  issues: string[]
  uptime: number
  lastUpdate: string
}

interface RealtimeStreamMonitorProps {
  channelId: string
  channelName: string
}

export default function RealtimeStreamMonitor({ channelId, channelName }: RealtimeStreamMonitorProps) {
  const [metrics, setMetrics] = useState<StreamMetrics | null>(null)
  const [health, setHealth] = useState<StreamHealth | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)
  const [isClient, setIsClient] = useState(false)

  // Set client-side only after mount
  useEffect(() => {
    setIsClient(true)
    setLastUpdate(new Date())
  }, [])

  // Simulate real-time updates only on client
  useEffect(() => {
    if (!isClient) return
    
    // Set initial data
    const initialMetrics: StreamMetrics = {
      channelId,
      bitrate: 8000,
      viewers: 1250,
      latency: 1500,
      fps: 30,
      audioLevel: 80,
      cpuUsage: 25,
      memoryUsage: 150,
      timestamp: new Date().toISOString()
    }

    const initialHealth: StreamHealth = {
      channelId,
      status: 'HEALTHY',
      issues: [],
      uptime: 3600,
      lastUpdate: new Date().toISOString()
    }

    setMetrics(initialMetrics)
    setHealth(initialHealth)
    setIsConnected(true)
    setLastUpdate(new Date())
    
    const interval = setInterval(() => {
      // Generate mock real-time data
      const newMetrics: StreamMetrics = {
        channelId,
        bitrate: Math.floor(Math.random() * 2000) + 7000,
        viewers: Math.floor(Math.random() * 500) + 1000,
        latency: Math.floor(Math.random() * 1000) + 1000,
        fps: 30,
        audioLevel: Math.floor(Math.random() * 20) + 70,
        cpuUsage: Math.floor(Math.random() * 30) + 20,
        memoryUsage: Math.floor(Math.random() * 40) + 30,
        timestamp: new Date().toISOString()
      }

      const healthStatus = newMetrics.latency > 2000 ? 'WARNING' : 'HEALTHY'
      const issues = newMetrics.latency > 2000 ? ['High latency detected'] : []

      const newHealth: StreamHealth = {
        channelId,
        status: healthStatus,
        issues,
        uptime: Math.floor(Math.random() * 86400) + 3600,
        lastUpdate: new Date().toISOString()
      }

      setMetrics(newMetrics)
      setHealth(newHealth)
      setLastUpdate(new Date())
      setIsConnected(true)
    }, 2000)

    return () => clearInterval(interval)
  }, [channelId])

  const formatBitrate = (bitrate: number) => {
    if (bitrate >= 1000) {
      return `${(bitrate / 1000).toFixed(1)} Mbps`
    }
    return `${bitrate} kbps`
  }

  const formatUptime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    return `${hours}h ${minutes}m`
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'HEALTHY': return 'text-green-500'
      case 'WARNING': return 'text-yellow-500'
      case 'CRITICAL': return 'text-red-500'
      default: return 'text-gray-500'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'HEALTHY':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'WARNING':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      case 'CRITICAL':
        return <AlertTriangle className="h-4 w-4 text-red-500" />
      default:
        return <Activity className="h-4 w-4 text-gray-500" />
    }
  }

  const getHealthColor = (value: number, max: number) => {
    const percentage = (value / max) * 100
    if (percentage < 50) return 'text-green-500'
    if (percentage < 80) return 'text-yellow-500'
    return 'text-red-500'
  }

  if (!isClient || !metrics || !health) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Activity className="h-5 w-5" />
            <span>Stream Monitor - {channelName}</span>
          </CardTitle>
          <CardDescription>Loading real-time stream data...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Stream Status Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Activity className="h-5 w-5" />
              <div>
                <CardTitle>Stream Monitor - {channelName}</CardTitle>
                <CardDescription className="flex items-center space-x-2 mt-1">
                  {getStatusIcon(health.status)}
                  <span className={getStatusColor(health.status)}>
                    {health.status} • Last update: {lastUpdate ? formatDateTime(lastUpdate.toISOString()) : 'Initializing...'}
                  </span>
                  <Badge variant={isConnected ? "default" : "secondary"}>
                    {isConnected ? "Live" : "Disconnected"}
                  </Badge>
                </CardDescription>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button size="sm" variant="outline">
                <Play className="h-4 w-4 mr-2" />
                Start
              </Button>
              <Button size="sm" variant="outline">
                <Pause className="h-4 w-4 mr-2" />
                Pause
              </Button>
              <Button size="sm" variant="outline">
                <Square className="h-4 w-4 mr-2" />
                Stop
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Health Issues */}
      {health.issues.length > 0 && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            {health.issues.map((issue, index) => (
              <div key={index}>• {issue}</div>
            ))}
          </AlertDescription>
        </Alert>
      )}

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bitrate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatBitrate(metrics.bitrate)}</div>
            <p className="text-xs text-muted-foreground">Current bitrate</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Viewers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.viewers.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Active viewers</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Latency</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getHealthColor(metrics.latency, 3000)}`}>
              {metrics.latency}ms
            </div>
            <p className="text-xs text-muted-foreground">Stream latency</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Uptime</CardTitle>
            <Signal className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatUptime(health.uptime)}</div>
            <p className="text-xs text-muted-foreground">Stream uptime</p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Metrics */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Stream Quality</CardTitle>
            <CardDescription>Real-time stream quality metrics</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Frame Rate</span>
                <span>{metrics.fps} FPS</span>
              </div>
              <Progress value={(metrics.fps / 60) * 100} className="h-2" />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Audio Level</span>
                <span>{metrics.audioLevel}%</span>
              </div>
              <Progress value={metrics.audioLevel} className="h-2" />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Video Quality</span>
                <span>HD</span>
              </div>
              <Progress value={85} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>System Resources</CardTitle>
            <CardDescription>Server resource utilization</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>CPU Usage</span>
                <span className={getHealthColor(metrics.cpuUsage, 100)}>
                  {metrics.cpuUsage}%
                </span>
              </div>
              <Progress value={metrics.cpuUsage} className="h-2" />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Memory Usage</span>
                <span className={getHealthColor(metrics.memoryUsage, 100)}>
                  {metrics.memoryUsage}%
                </span>
              </div>
              <Progress value={metrics.memoryUsage} className="h-2" />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Network I/O</span>
                <span className="text-green-500">Normal</span>
              </div>
              <Progress value={45} className="h-2" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* SCTE-35 Events Monitor */}
      <Card>
        <CardHeader>
          <CardTitle>SCTE-35 Events Monitor</CardTitle>
          <CardDescription>Real-time SCTE-35 event detection and insertion</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="h-3 w-3 rounded-full bg-green-500"></div>
                <div>
                  <h3 className="font-medium">SCTE-35 Detector</h3>
                  <p className="text-sm text-muted-foreground">Active • Monitoring incoming stream</p>
                </div>
              </div>
              <Badge variant="outline">Enabled</Badge>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Recent Events</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm p-2 bg-muted rounded">
                    <span>SPLICE_INSERT</span>
                    <span className="text-muted-foreground">2 min ago</span>
                  </div>
                  <div className="flex justify-between text-sm p-2 bg-muted rounded">
                    <span>TIME_SIGNAL</span>
                    <span className="text-muted-foreground">5 min ago</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-sm font-medium">Event Statistics</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Events Detected</span>
                    <span>247</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Events Inserted</span>
                    <span>243</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Success Rate</span>
                    <span className="text-green-500">98.4%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}