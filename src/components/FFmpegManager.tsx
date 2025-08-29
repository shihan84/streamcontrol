"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { 
  Play, 
  Pause, 
  Square, 
  Settings, 
  Activity, 
  Copy,
  Save,
  RefreshCw,
  Terminal,
  CheckCircle,
  AlertTriangle,
  Clock
} from 'lucide-react'
import ManualParameterEditor from '@/components/ManualParameterEditor'

interface FFmpegConfig {
  id: string
  name: string
  inputUrl: string
  outputUrl: string
  scte35Pid: number
  videoPid: number
  audioPid: number
  serviceId: number
  pmtStartPid: number
  startPid: number
  nullPid: number
  latency: number
  mode: 'caller' | 'listener'
  isActive: boolean
  ffmpegCommand: string
}

interface FFmpegProcess {
  id: string
  configId: string
  status: 'STOPPED' | 'STARTING' | 'RUNNING' | 'STOPPING' | 'ERROR'
  pid?: number
  cpuUsage: number
  memoryUsage: number
  uptime: number
  lastOutput: string
  startTime?: string
}

export default function FFmpegManager() {
  const [configs, setConfigs] = useState<FFmpegConfig[]>([])
  const [processes, setProcesses] = useState<FFmpegProcess[]>([])
  const [selectedConfig, setSelectedConfig] = useState<string>('')
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)

  // Mock data initialization
  useEffect(() => {
    const mockConfigs: FFmpegConfig[] = [
      {
        id: '1',
        name: 'Main Stream Configuration',
        inputUrl: 'srt://source:9000',
        outputUrl: 'srt://cdn:1234',
        scte35Pid: 511,
        videoPid: 257,
        audioPid: 258,
        serviceId: 1,
        pmtStartPid: 4096,
        startPid: 257,
        nullPid: 8191,
        latency: 2000000,
        mode: 'caller',
        isActive: true,
        ffmpegCommand: ''
      }
    ]

    const now = new Date()
    const mockProcesses: FFmpegProcess[] = [
      {
        id: '1',
        configId: '1',
        status: 'RUNNING',
        pid: 12345,
        cpuUsage: 25,
        memoryUsage: 150,
        uptime: 3600,
        lastOutput: 'frame=12345 fps=30.0 q=28.0',
        startTime: new Date(now.getTime() - 3600000).toISOString()
      }
    ]

    // Generate FFmpeg command for the config
    const configWithCommand = mockConfigs.map(config => ({
      ...config,
      ffmpegCommand: generateFFmpegCommand(config)
    }))

    setConfigs(configWithCommand)
    setProcesses(mockProcesses)
    setSelectedConfig('1')
  }, [])

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

  const generateFFmpegCommand = (config: FFmpegConfig): string => {
    return `ffmpeg -i "${config.inputUrl}" -c copy \\
  -mpegts_flags "+pat_pmt_at_frames+resend_headers" \\
  -mpegts_service_id ${config.serviceId} \\
  -mpegts_pmt_start_pid ${config.pmtStartPid} \\
  -mpegts_start_pid ${config.startPid} \\
  -mpegts_pid_video ${config.videoPid} \\
  -mpegts_pid_audio ${config.audioPid} \\
  -mpegts_scte35_pid ${config.scte35Pid} \\
  -mpegts_null_pid ${config.nullPid} \\
  -f mpegts \\
  "${config.outputUrl}?mode=${config.mode}&latency=${config.latency}"`
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'RUNNING': return 'bg-green-500'
      case 'STOPPED': return 'bg-gray-500'
      case 'STARTING': return 'bg-yellow-500'
      case 'STOPPING': return 'bg-orange-500'
      case 'ERROR': return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'RUNNING':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'STOPPED':
        return <Square className="h-4 w-4 text-gray-500" />
      case 'STARTING':
      case 'STOPPING':
        return <Clock className="h-4 w-4 text-yellow-500" />
      case 'ERROR':
        return <AlertTriangle className="h-4 w-4 text-red-500" />
      default:
        return <Activity className="h-4 w-4 text-gray-500" />
    }
  }

  const formatUptime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hours}h ${minutes}m ${secs}s`
  }

  const startProcess = (configId: string) => {
    const newProcess: FFmpegProcess = {
      id: Date.now().toString(),
      configId,
      status: 'STARTING',
      cpuUsage: 0,
      memoryUsage: 0,
      uptime: 0,
      lastOutput: 'Starting FFmpeg process...',
      startTime: new Date().toISOString()
    }
    setProcesses([...processes, newProcess])

    // Simulate process starting
    setTimeout(() => {
      setProcesses(processes.map(p => 
        p.id === newProcess.id 
          ? { 
              ...p, 
              status: 'RUNNING', 
              pid: Math.floor(Math.random() * 50000) + 10000,
              cpuUsage: Math.floor(Math.random() * 30) + 10,
              memoryUsage: Math.floor(Math.random() * 200) + 50,
              uptime: 1,
              lastOutput: 'FFmpeg process started successfully'
            }
          : p
      ))
    }, 2000)
  }

  const stopProcess = (processId: string) => {
    setProcesses(processes.map(p => 
      p.id === processId 
        ? { ...p, status: 'STOPPING', lastOutput: 'Stopping FFmpeg process...' }
        : p
    ))

    setTimeout(() => {
      setProcesses(processes.filter(p => p.id !== processId))
    }, 2000)
  }

  const createConfig = (configData: Partial<FFmpegConfig>) => {
    const newConfig: FFmpegConfig = {
      id: Date.now().toString(),
      name: configData.name || 'New Configuration',
      inputUrl: configData.inputUrl || '',
      outputUrl: configData.outputUrl || '',
      scte35Pid: configData.scte35Pid || 511,
      videoPid: configData.videoPid || 257,
      audioPid: configData.audioPid || 258,
      serviceId: configData.serviceId || 1,
      pmtStartPid: configData.pmtStartPid || 4096,
      startPid: configData.startPid || 257,
      nullPid: configData.nullPid || 8191,
      latency: configData.latency || 2000000,
      mode: configData.mode || 'caller',
      isActive: true,
      ffmpegCommand: ''
    }
    
    newConfig.ffmpegCommand = generateFFmpegCommand(newConfig)
    setConfigs([...configs, newConfig])
    setIsCreateDialogOpen(false)
  }

  const ConfigForm = ({ config, onSave, onCancel }: { 
    config?: FFmpegConfig | null
    onSave: (data: Partial<FFmpegConfig>) => void
    onCancel: () => void
  }) => {
    const [formData, setFormData] = useState({
      name: config?.name || '',
      inputUrl: config?.inputUrl || '',
      outputUrl: config?.outputUrl || '',
      scte35Pid: config?.scte35Pid || 511,
      videoPid: config?.videoPid || 257,
      audioPid: config?.audioPid || 258,
      serviceId: config?.serviceId || 1,
      pmtStartPid: config?.pmtStartPid || 4096,
      startPid: config?.startPid || 257,
      nullPid: config?.nullPid || 8191,
      latency: config?.latency || 2000000,
      mode: config?.mode || 'caller' as 'caller' | 'listener'
    })

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault()
      onSave(formData)
    }

    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="name">Configuration Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              placeholder="Configuration name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="mode">SRT Mode</Label>
            <Select 
              value={formData.mode} 
              onValueChange={(value) => setFormData({...formData, mode: value as 'caller' | 'listener'})}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="caller">Caller</SelectItem>
                <SelectItem value="listener">Listener</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="inputUrl">Input URL</Label>
            <Input
              id="inputUrl"
              value={formData.inputUrl}
              onChange={(e) => setFormData({...formData, inputUrl: e.target.value})}
              placeholder="srt://source:9000"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="outputUrl">Output URL</Label>
            <Input
              id="outputUrl"
              value={formData.outputUrl}
              onChange={(e) => setFormData({...formData, outputUrl: e.target.value})}
              placeholder="srt://cdn:1234"
            />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="scte35Pid">SCTE-35 PID</Label>
            <Input
              id="scte35Pid"
              type="number"
              value={formData.scte35Pid}
              onChange={(e) => setFormData({...formData, scte35Pid: parseInt(e.target.value)})}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="videoPid">Video PID</Label>
            <Input
              id="videoPid"
              type="number"
              value={formData.videoPid}
              onChange={(e) => setFormData({...formData, videoPid: parseInt(e.target.value)})}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="audioPid">Audio PID</Label>
            <Input
              id="audioPid"
              type="number"
              value={formData.audioPid}
              onChange={(e) => setFormData({...formData, audioPid: parseInt(e.target.value)})}
            />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="serviceId">Service ID</Label>
            <Input
              id="serviceId"
              type="number"
              value={formData.serviceId}
              onChange={(e) => setFormData({...formData, serviceId: parseInt(e.target.value)})}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="pmtStartPid">PMT Start PID</Label>
            <Input
              id="pmtStartPid"
              type="number"
              value={formData.pmtStartPid}
              onChange={(e) => setFormData({...formData, pmtStartPid: parseInt(e.target.value)})}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="startPid">Start PID</Label>
            <Input
              id="startPid"
              type="number"
              value={formData.startPid}
              onChange={(e) => setFormData({...formData, startPid: parseInt(e.target.value)})}
            />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="nullPid">Null PID</Label>
            <Input
              id="nullPid"
              type="number"
              value={formData.nullPid}
              onChange={(e) => setFormData({...formData, nullPid: parseInt(e.target.value)})}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="latency">Latency (μs)</Label>
            <Input
              id="latency"
              type="number"
              value={formData.latency}
              onChange={(e) => setFormData({...formData, latency: parseInt(e.target.value)})}
            />
          </div>
        </div>

        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">
            <Save className="h-4 w-4 mr-2" />
            {config ? 'Update' : 'Create'} Configuration
          </Button>
        </div>
      </form>
    )
  }

  const selectedConfigData = configs.find(c => c.id === selectedConfig)
  const activeProcesses = processes.filter(p => p.status === 'RUNNING')

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>FFmpeg Stream Processing</CardTitle>
              <CardDescription>
                Manage FFmpeg processes for SCTE-35 enabled stream processing
              </CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="flex items-center space-x-2">
                <Activity className="h-3 w-3" />
                <span>{activeProcesses.length} Active Processes</span>
              </Badge>
            </div>
          </div>
        </CardHeader>
      </Card>

      <Tabs defaultValue="processes" className="space-y-6">
        <TabsList>
          <TabsTrigger value="processes">Active Processes</TabsTrigger>
          <TabsTrigger value="configs">Configurations</TabsTrigger>
          <TabsTrigger value="manual">Manual Parameters</TabsTrigger>
          <TabsTrigger value="command">Command Generator</TabsTrigger>
          <TabsTrigger value="logs">Process Logs</TabsTrigger>
        </TabsList>

        <TabsContent value="processes">
          <Card>
            <CardHeader>
              <CardTitle>Active FFmpeg Processes</CardTitle>
              <CardDescription>Monitor and control running FFmpeg processes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {processes.map((process) => {
                  const config = configs.find(c => c.id === process.configId)
                  return (
                    <div key={process.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          {getStatusIcon(process.status)}
                          <div>
                            <h3 className="font-medium">{config?.name || 'Unknown Configuration'}</h3>
                            <p className="text-sm text-muted-foreground">
                              PID: {process.pid} • {formatUptime(process.uptime)}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              CPU: {process.cpuUsage}% • Memory: {process.memoryUsage}MB
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge className={`${getStatusColor(process.status)} text-white`}>
                            {process.status}
                          </Badge>
                          <div className="flex space-x-1">
                            {process.status === 'RUNNING' && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => stopProcess(process.id)}
                              >
                                <Square className="h-4 w-4" />
                              </Button>
                            )}
                            <Button size="sm" variant="outline">
                              <RefreshCw className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                      <div className="mt-3 p-2 bg-muted rounded text-sm font-mono">
                        {process.lastOutput}
                      </div>
                    </div>
                  )
                })}
                {processes.length === 0 && (
                  <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      No FFmpeg processes are currently running. Start a process from the configurations tab.
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="configs">
          <Card>
            <CardHeader>
              <CardTitle>FFmpeg Configurations</CardTitle>
              <CardDescription>Manage FFmpeg stream processing configurations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {configs.map((config) => {
                  const process = processes.find(p => p.configId === config.id)
                  return (
                    <div key={config.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div>
                            <h3 className="font-medium">{config.name}</h3>
                            <p className="text-sm text-muted-foreground">
                              {config.inputUrl} → {config.outputUrl}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              SCTE-35 PID: {config.scte35Pid} • Mode: {config.mode}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {process ? (
                            <Badge className={`${getStatusColor(process.status)} text-white`}>
                              {process.status}
                            </Badge>
                          ) : (
                            <Badge variant="outline">Stopped</Badge>
                          )}
                          <div className="flex space-x-1">
                            {!process && (
                              <Button
                                size="sm"
                                onClick={() => startProcess(config.id)}
                              >
                                <Play className="h-4 w-4" />
                              </Button>
                            )}
                            <Button size="sm" variant="outline">
                              <Settings className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="manual">
          <ManualParameterEditor 
            onParametersChange={(params) => {
              console.log('Parameters changed:', params)
            }}
            onCommandGenerate={(command) => {
              console.log('Command generated:', command)
            }}
          />
        </TabsContent>

        <TabsContent value="command">
          <Card>
            <CardHeader>
              <CardTitle>FFmpeg Command Generator</CardTitle>
              <CardDescription>Generate and view FFmpeg commands for SCTE-35 processing</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Select Configuration</Label>
                  <Select value={selectedConfig} onValueChange={setSelectedConfig}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {configs.map((config) => (
                        <SelectItem key={config.id} value={config.id}>
                          {config.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {selectedConfigData && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Generated FFmpeg Command</Label>
                      <div className="p-4 bg-muted rounded-md">
                        <pre className="text-sm font-mono whitespace-pre-wrap">
                          {selectedConfigData.ffmpegCommand}
                        </pre>
                      </div>
                    </div>

                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="outline"
                        onClick={() => {
                          navigator.clipboard.writeText(selectedConfigData.ffmpegCommand)
                        }}
                      >
                        <Copy className="h-4 w-4 mr-2" />
                        Copy Command
                      </Button>
                      <Button onClick={() => startProcess(selectedConfigData.id)}>
                        <Play className="h-4 w-4 mr-2" />
                        Start Process
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="logs">
          <Card>
            <CardHeader>
              <CardTitle>Process Logs</CardTitle>
              <CardDescription>View FFmpeg process logs and output</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {processes.map((process) => {
                  const config = configs.find(c => c.id === process.configId)
                  return (
                    <div key={process.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(process.status)}
                          <h3 className="font-medium">{config?.name}</h3>
                          <Badge variant="outline">PID: {process.pid}</Badge>
                        </div>
                      </div>
                      <div className="p-3 bg-black text-green-400 rounded font-mono text-sm space-y-1 max-h-64 overflow-y-auto">
                        <div>[{formatDateTime(new Date().toISOString())}] FFmpeg process started</div>
                        <div>[{formatDateTime(new Date().toISOString())}] Input: {config?.inputUrl}</div>
                        <div>[{formatDateTime(new Date().toISOString())}] Output: {config?.outputUrl}</div>
                        <div>[{formatDateTime(new Date().toISOString())}] SCTE-35 PID: {config?.scte35Pid}</div>
                        <div>[{formatDateTime(new Date().toISOString())}] {process.lastOutput}</div>
                        <div>[{formatDateTime(new Date().toISOString())}] Stream processing active</div>
                      </div>
                    </div>
                  )
                })}
                {processes.length === 0 && (
                  <Alert>
                    <Terminal className="h-4 w-4" />
                    <AlertDescription>
                      No active processes to display logs for.
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}