"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Settings, 
  Play, 
  Pause, 
  Square,
  Radio,
  Tv,
  Monitor,
  Network,
  AlertTriangle,
  CheckCircle,
  Copy,
  RefreshCw,
  Link,
  Unlink,
  Zap
} from 'lucide-react'

interface OBSConfig {
  obsOutputMode: 'advanced' | 'simple'
  obsOutputType: 'srt' | 'rtmp' | 'hls' | 'dash'
  obsServer: string
  obsPort: number
  obsStreamKey: string
  obsBitrate: number
  obsResolution: string
  obsFps: number
  obsAudioBitrate: number
}

interface ProcessingConfig {
  enableProcessing: boolean
  processingMode: 'inject' | 'transcode' | 'pass-through'
  scte35Pid: number
  distributorUrl: string
  distributorProtocol: 'srt' | 'hls' | 'dash'
  latency: number
  enableMonitoring: boolean
}

interface OBSIntegrationProps {
  onConfigSave?: (config: { obs: OBSConfig, processing: ProcessingConfig }) => void
  onStreamStart?: () => void
  onStreamStop?: () => void
}

export default function OBSIntegration({ 
  onConfigSave, 
  onStreamStart, 
  onStreamStop 
}: OBSIntegrationProps) {
  const [obsConfig, setObsConfig] = useState<OBSConfig>({
    obsOutputMode: 'advanced',
    obsOutputType: 'srt',
    obsServer: 'localhost',
    obsPort: 9000,
    obsStreamKey: '',
    obsBitrate: 8000,
    obsResolution: '1920x1080',
    obsFps: 30,
    obsAudioBitrate: 128
  })

  const [processingConfig, setProcessingConfig] = useState<ProcessingConfig>({
    enableProcessing: true,
    processingMode: 'inject',
    scte35Pid: 500,
    distributorUrl: 'srt://distributor-cdn:1234',
    distributorProtocol: 'srt',
    latency: 2000,
    enableMonitoring: true
  })

  const [isStreamActive, setIsStreamActive] = useState(false)
  const [connectionStatus, setConnectionStatus] = useState<'disconnected' | 'connecting' | 'connected' | 'error'>('disconnected')
  const [generatedCommand, setGeneratedCommand] = useState('')

  const generateOBSCommand = () => {
    const command = `# OBS Studio Configuration
# 1. OBS Output Settings
# Go to Settings → Output → Output Mode: ${obsConfig.obsOutputMode}

# 2. Streaming Service Configuration
# Service: Custom
# Server: ${obsConfig.obsServer}:${obsConfig.obsPort}
# Stream Key: ${obsConfig.obsStreamKey}

# 3. Video Settings
# Encoder: x264
# Rate Control: CBR
# Bitrate: ${obsConfig.obsBitrate} kbps
# Resolution: ${obsConfig.obsResolution}
# FPS: ${obsConfig.obsFps}

# 4. Audio Settings
# Audio Bitrate: ${obsConfig.obsAudioBitrate} kbps

# 5. Advanced Settings
# CPU Usage Preset: veryfast
# Profile: high
# Tune: zerolatency`

    setGeneratedCommand(command)
  }

  const generateFFmpegCommand = () => {
    const command = `# FFmpeg Processing Command
# This command processes OBS output and injects SCTE-35

ffmpeg -i '${obsConfig.obsOutputType === 'srt' ? 'srt://' : 'rtmp://'}${obsConfig.obsServer}:${obsConfig.obsPort}/${obsConfig.obsStreamKey}' \\
  ${processingConfig.processingMode === 'transcode' ? 
    `-c:v libx264 -profile:v high -preset veryfast -tune zerolatency -b:v ${obsConfig.obsBitrate}k \\
     -c:a aac -b:a ${obsConfig.obsAudioBitrate}k` : 
    '-c copy'
  } \\
  -mpegts_flags "+pat_pmt_at_frames+resend_headers" \\
  -mpegts_service_id 1 \\
  -mpegts_scte35_pid ${processingConfig.scte35Pid} \\
  -f mpegts \\
  '${processingConfig.distributorUrl}?mode=caller&latency=${processingConfig.latency}'`

    setGeneratedCommand(command)
  }

  const startStream = () => {
    setConnectionStatus('connecting')
    
    // Simulate connection process
    setTimeout(() => {
      setConnectionStatus('connected')
      setIsStreamActive(true)
      if (onStreamStart) onStreamStart()
    }, 2000)
  }

  const stopStream = () => {
    setConnectionStatus('disconnected')
    setIsStreamActive(false)
    if (onStreamStop) onStreamStop()
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected': return 'bg-green-500'
      case 'connecting': return 'bg-yellow-500'
      case 'error': return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected': return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'connecting': return <RefreshCw className="h-4 w-4 text-yellow-500 animate-spin" />
      case 'error': return <AlertTriangle className="h-4 w-4 text-red-500" />
      default: return <Radio className="h-4 w-4 text-gray-500" />
    }
  }

  useEffect(() => {
    generateOBSCommand()
  }, [obsConfig])

  useEffect(() => {
    if (processingConfig.enableProcessing) {
      generateFFmpegCommand()
    }
  }, [obsConfig, processingConfig])

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <Monitor className="h-5 w-5" />
                <span>OBS Studio Integration</span>
              </CardTitle>
              <CardDescription>
                Integrate OBS Studio with SCTE-35 injection for professional broadcast streaming
              </CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-2">
                {getStatusIcon(connectionStatus)}
                <span className="text-sm font-medium capitalize">{connectionStatus}</span>
              </div>
              {isStreamActive ? (
                <Button variant="destructive" onClick={stopStream}>
                  <Square className="h-4 w-4 mr-2" />
                  Stop Stream
                </Button>
              ) : (
                <Button onClick={startStream}>
                  <Play className="h-4 w-4 mr-2" />
                  Start Stream
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
      </Card>

      <Tabs defaultValue="obs-config" className="space-y-6">
        <TabsList>
          <TabsTrigger value="obs-config">OBS Configuration</TabsTrigger>
          <TabsTrigger value="processing">Processing Settings</TabsTrigger>
          <TabsTrigger value="commands">Generated Commands</TabsTrigger>
          <TabsTrigger value="monitoring">Stream Monitoring</TabsTrigger>
        </TabsList>

        <TabsContent value="obs-config">
          <Card>
            <CardHeader>
              <CardTitle>OBS Studio Configuration</CardTitle>
              <CardDescription>
                Configure OBS Studio output settings for integration with SCTE-35 processing
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Output Mode */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Output Mode</h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="obsOutputMode">Output Mode</Label>
                      <Select 
                        value={obsConfig.obsOutputMode} 
                        onValueChange={(value) => setObsConfig({...obsConfig, obsOutputMode: value as 'advanced' | 'simple'})}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="advanced">Advanced</SelectItem>
                          <SelectItem value="simple">Simple</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="obsOutputType">Output Type</Label>
                      <Select 
                        value={obsConfig.obsOutputType} 
                        onValueChange={(value) => setObsConfig({...obsConfig, obsOutputType: value as 'srt' | 'rtmp' | 'hls' | 'dash'})}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="srt">SRT</SelectItem>
                          <SelectItem value="rtmp">RTMP</SelectItem>
                          <SelectItem value="hls">HLS</SelectItem>
                          <SelectItem value="dash">DASH</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Server Configuration */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Server Configuration</h3>
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="space-y-2">
                      <Label htmlFor="obsServer">Server Address</Label>
                      <Input
                        id="obsServer"
                        value={obsConfig.obsServer}
                        onChange={(e) => setObsConfig({...obsConfig, obsServer: e.target.value})}
                        placeholder="localhost or your-server-ip"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="obsPort">Port</Label>
                      <Input
                        id="obsPort"
                        type="number"
                        value={obsConfig.obsPort}
                        onChange={(e) => setObsConfig({...obsConfig, obsPort: parseInt(e.target.value) || 9000})}
                        placeholder="9000"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="obsStreamKey">Stream Key</Label>
                      <Input
                        id="obsStreamKey"
                        value={obsConfig.obsStreamKey}
                        onChange={(e) => setObsConfig({...obsConfig, obsStreamKey: e.target.value})}
                        placeholder="stream-key"
                      />
                    </div>
                  </div>
                </div>

                {/* Video Configuration */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Video Configuration</h3>
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="space-y-2">
                      <Label htmlFor="obsBitrate">Bitrate (kbps)</Label>
                      <Input
                        id="obsBitrate"
                        type="number"
                        value={obsConfig.obsBitrate}
                        onChange={(e) => setObsConfig({...obsConfig, obsBitrate: parseInt(e.target.value) || 8000})}
                        placeholder="8000"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="obsResolution">Resolution</Label>
                      <Select 
                        value={obsConfig.obsResolution} 
                        onValueChange={(value) => setObsConfig({...obsConfig, obsResolution: value})}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1920x1080">1920x1080 (1080p)</SelectItem>
                          <SelectItem value="1280x720">1280x720 (720p)</SelectItem>
                          <SelectItem value="3840x2160">3840x2160 (4K)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="obsFps">FPS</Label>
                      <Select 
                        value={obsConfig.obsFps.toString()} 
                        onValueChange={(value) => setObsConfig({...obsConfig, obsFps: parseInt(value)})}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="24">24 FPS</SelectItem>
                          <SelectItem value="25">25 FPS</SelectItem>
                          <SelectItem value="30">30 FPS</SelectItem>
                          <SelectItem value="50">50 FPS</SelectItem>
                          <SelectItem value="60">60 FPS</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Audio Configuration */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Audio Configuration</h3>
                  <div className="space-y-2">
                    <Label htmlFor="obsAudioBitrate">Audio Bitrate (kbps)</Label>
                    <Select 
                      value={obsConfig.obsAudioBitrate.toString()} 
                      onValueChange={(value) => setObsConfig({...obsConfig, obsAudioBitrate: parseInt(value)})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="64">64 kbps</SelectItem>
                        <SelectItem value="96">96 kbps</SelectItem>
                        <SelectItem value="128">128 kbps</SelectItem>
                        <SelectItem value="160">160 kbps</SelectItem>
                        <SelectItem value="192">192 kbps</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="processing">
          <Card>
            <CardHeader>
              <CardTitle>Processing Settings</CardTitle>
              <CardDescription>
                Configure SCTE-35 injection and stream processing settings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Processing Toggle */}
                <div className="flex items-center space-x-2">
                  <Switch
                    id="enableProcessing"
                    checked={processingConfig.enableProcessing}
                    onCheckedChange={(checked) => setProcessingConfig({...processingConfig, enableProcessing: checked})}
                  />
                  <Label htmlFor="enableProcessing">Enable SCTE-35 Processing</Label>
                </div>

                {processingConfig.enableProcessing && (
                  <>
                    {/* Processing Mode */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Processing Mode</h3>
                      <div className="space-y-2">
                        <Select 
                          value={processingConfig.processingMode} 
                          onValueChange={(value) => setProcessingConfig({...processingConfig, processingMode: value as 'inject' | 'transcode' | 'pass-through'})}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="inject">SCTE-35 Injection Only</SelectItem>
                            <SelectItem value="transcode">Transcode + SCTE-35</SelectItem>
                            <SelectItem value="pass-through">Pass-through + SCTE-35</SelectItem>
                          </SelectContent>
                        </Select>
                        <p className="text-sm text-muted-foreground">
                          {processingConfig.processingMode === 'inject' && 'Inject SCTE-35 without re-encoding (fastest)'}
                          {processingConfig.processingMode === 'transcode' && 'Re-encode stream and inject SCTE-35 (highest quality)'}
                          {processingConfig.processingMode === 'pass-through' && 'Pass-through with SCTE-35 insertion'}
                        </p>
                      </div>
                    </div>

                    {/* Distributor Configuration */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Distributor Configuration</h3>
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="distributorProtocol">Protocol</Label>
                          <Select 
                            value={processingConfig.distributorProtocol} 
                            onValueChange={(value) => setProcessingConfig({...processingConfig, distributorProtocol: value as 'srt' | 'hls' | 'dash'})}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="srt">SRT</SelectItem>
                              <SelectItem value="hls">HLS</SelectItem>
                              <SelectItem value="dash">DASH</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="distributorUrl">Distributor URL</Label>
                          <Input
                            id="distributorUrl"
                            value={processingConfig.distributorUrl}
                            onChange={(e) => setProcessingConfig({...processingConfig, distributorUrl: e.target.value})}
                            placeholder="srt://distributor-cdn:1234"
                          />
                        </div>
                      </div>
                    </div>

                    {/* SCTE-35 Configuration */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">SCTE-35 Configuration</h3>
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="scte35Pid">SCTE-35 PID</Label>
                          <Input
                            id="scte35Pid"
                            type="number"
                            value={processingConfig.scte35Pid}
                            onChange={(e) => setProcessingConfig({...processingConfig, scte35Pid: parseInt(e.target.value) || 500})}
                            placeholder="500"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="latency">Latency (ms)</Label>
                          <Input
                            id="latency"
                            type="number"
                            value={processingConfig.latency}
                            onChange={(e) => setProcessingConfig({...processingConfig, latency: parseInt(e.target.value) || 2000})}
                            placeholder="2000"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Monitoring */}
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="enableMonitoring"
                        checked={processingConfig.enableMonitoring}
                        onCheckedChange={(checked) => setProcessingConfig({...processingConfig, enableMonitoring: checked})}
                      />
                      <Label htmlFor="enableMonitoring">Enable Stream Monitoring</Label>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="commands">
          <Card>
            <CardHeader>
              <CardTitle>Generated Commands</CardTitle>
              <CardDescription>
                OBS Studio configuration and FFmpeg processing commands
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* OBS Configuration */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium">OBS Studio Configuration</h3>
                    <Button variant="outline" onClick={generateOBSCommand}>
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Regenerate
                    </Button>
                  </div>
                  <div className="p-4 bg-muted rounded-md">
                    <pre className="text-sm font-mono whitespace-pre-wrap">
                      {generatedCommand}
                    </pre>
                  </div>
                </div>

                {processingConfig.enableProcessing && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium">FFmpeg Processing Command</h3>
                      <Button variant="outline" onClick={generateFFmpegCommand}>
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Regenerate
                      </Button>
                    </div>
                    <div className="p-4 bg-muted rounded-md">
                      <pre className="text-sm font-mono whitespace-pre-wrap">
                        {generatedCommand}
                      </pre>
                    </div>
                  </div>
                )}

                <div className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      navigator.clipboard.writeText(generatedCommand)
                    }}
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Copy Commands
                  </Button>
                  <Button>
                    <Play className="h-4 w-4 mr-2" />
                    Apply Configuration
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="monitoring">
          <Card>
            <CardHeader>
              <CardTitle>Stream Monitoring</CardTitle>
              <CardDescription>
                Monitor stream health and SCTE-35 injection status
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Connection Status */}
                <div className="grid gap-4 md:grid-cols-3">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">OBS Studio</CardTitle>
                      <Radio className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {connectionStatus === 'connected' ? 'Connected' : 'Disconnected'}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {connectionStatus === 'connected' ? 'Stream active' : 'No connection'}
                      </p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Processing</CardTitle>
                      <Zap className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {processingConfig.enableProcessing ? 'Active' : 'Disabled'}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {processingConfig.enableProcessing ? 'SCTE-35 enabled' : 'Pass-through'}
                      </p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Distributor</CardTitle>
                      <Network className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {connectionStatus === 'connected' ? 'Connected' : 'Waiting'}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {processingConfig.distributorProtocol.toUpperCase()} link
                      </p>
                    </CardContent>
                  </Card>
                </div>

                {/* Stream Metrics */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Stream Metrics</h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Input Bitrate:</span>
                        <span>{obsConfig.obsBitrate} kbps</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Resolution:</span>
                        <span>{obsConfig.obsResolution}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Frame Rate:</span>
                        <span>{obsConfig.obsFps} FPS</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Audio Bitrate:</span>
                        <span>{obsConfig.obsAudioBitrate} kbps</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Latency:</span>
                        <span>{processingConfig.latency} ms</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>SCTE-35 PID:</span>
                        <span>{processingConfig.scte35Pid}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Alerts */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">System Alerts</h3>
                  <div className="space-y-2">
                    {connectionStatus === 'disconnected' && (
                      <Alert>
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription>
                          OBS Studio is not connected. Please start your OBS stream.
                        </AlertDescription>
                      </Alert>
                    )}
                    {connectionStatus === 'error' && (
                      <Alert>
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription>
                          Connection error. Check your OBS Studio output settings.
                        </AlertDescription>
                      </Alert>
                    )}
                    {!processingConfig.enableProcessing && (
                      <Alert>
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription>
                          SCTE-35 processing is disabled. Enable it for ad insertion.
                        </AlertDescription>
                      </Alert>
                    )}
                    {connectionStatus === 'connected' && processingConfig.enableProcessing && (
                      <Alert>
                        <CheckCircle className="h-4 w-4" />
                        <AlertDescription>
                          System is running normally with SCTE-35 injection enabled.
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}