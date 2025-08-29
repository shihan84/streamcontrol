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
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { 
  Play, 
  Pause, 
  Square, 
  Settings, 
  Activity, 
  Copy,
  Save,
  RefreshCw,
  Download,
  Upload,
  FileText,
  CheckCircle,
  AlertTriangle,
  Clock,
  LayoutTemplate,
  Trash2
} from 'lucide-react'

interface SRTStreamTemplate {
  id: string
  name: string
  service_name: string
  video_resolution: string
  video_codec: string
  pcr: string
  profile_level: string
  gop: number
  b_frames: number
  video_bitrate: number
  chroma: string
  aspect_ratio: string
  audio_codec: string
  audio_bitrate: number
  audio_lkfs: number
  audio_sampling_rate: number
  scte_pid: number
  null_pid: number
  latency: number
  // SCTE-35 Transport Stream values
  ad_duration: number
  scte_event_id_start: number
  scte_start_command: string
  scte_stop_command: string
  crash_out_command: string
  pre_roll_duration: number
  scte_data_pid: number
  input_url: string
  output_url: string
  is_active: boolean
  created_at: string
  updated_at: string
}

interface GeneratedCommand {
  ffmpeg_command: string
  scte_config: string
  validation_status: 'valid' | 'warning' | 'error'
  validation_messages: string[]
}

export default function SRTStreamTemplate() {
  const [templates, setTemplates] = useState<SRTStreamTemplate[]>([])
  const [selectedTemplate, setSelectedTemplate] = useState<string>('')
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [generatedCommand, setGeneratedCommand] = useState<GeneratedCommand | null>(null)

  // Initialize templates only on client side
  useEffect(() => {
    const now = new Date()
    
    // Default template with your specifications
    const defaultTemplate: SRTStreamTemplate = {
      id: 'default',
      name: 'HD Broadcast Template',
      service_name: 'Main Channel',
      video_resolution: '1920x1080',
      video_codec: 'H.264',
      pcr: 'Video Embedded',
      profile_level: 'High@Auto',
      gop: 12,
      b_frames: 5,
      video_bitrate: 5000,
      chroma: '4:2:0',
      aspect_ratio: '16:9',
      audio_codec: 'AAC-LC',
      audio_bitrate: 128,
      audio_lkfs: -20,
      audio_sampling_rate: 48000,
      scte_pid: 500,
      null_pid: 8191,
      latency: 2000,
      ad_duration: 600,
      scte_event_id_start: 100023,
      scte_start_command: 'CUE-OUT',
      scte_stop_command: 'CUE-IN',
      crash_out_command: 'CUE-IN',
      pre_roll_duration: 0,
      scte_data_pid: 500,
      input_url: 'srt://source:9000',
      output_url: 'srt://cdn:1234',
      is_active: true,
      created_at: now.toISOString(),
      updated_at: now.toISOString()
    }

    setTemplates([defaultTemplate])
    setSelectedTemplate('default')
  }, [])

  const generateFFmpegCommand = (template: SRTStreamTemplate): GeneratedCommand => {
    const validationMessages: string[] = []
    let validation_status: 'valid' | 'warning' | 'error' = 'valid'

    // Validate template
    if (!template.input_url) {
      validationMessages.push('Input URL is required')
      validation_status = 'error'
    }
    if (!template.output_url) {
      validationMessages.push('Output URL is required')
      validation_status = 'error'
    }
    if (template.video_bitrate < 1000 || template.video_bitrate > 20000) {
      validationMessages.push('Video bitrate should be between 1-20 Mbps')
      validation_status = 'warning'
    }
    if (template.audio_bitrate < 64 || template.audio_bitrate > 320) {
      validationMessages.push('Audio bitrate should be between 64-320 kbps')
      validation_status = 'warning'
    }

    const ffmpeg_command = `ffmpeg -i "${template.input_url}" \\
  -c:v libx264 -profile:v high -preset veryfast -tune zerolatency \\
  -g ${template.gop} -bf ${template.b_frames} -b:v ${template.video_bitrate}k \\
  -pix_fmt yuv420p -aspect ${template.aspect_ratio} \\
  -c:a aac -b:a ${template.audio_bitrate}k -ar ${template.audio_sampling_rate} \\
  -af "volume=${Math.pow(10, template.audio_lkfs / 20)}" \\
  -mpegts_flags "+pat_pmt_at_frames+resend_headers" \\
  -mpegts_service_id 1 \\
  -mpegts_pmt_start_pid 4096 \\
  -mpegts_start_pid 257 \\
  -mpegts_pid_video 257 \\
  -mpegts_pid_audio 258 \\
  -mpegts_scte35_pid ${template.scte_pid} \\
  -mpegts_null_pid ${template.null_pid} \\
  -f mpegts \\
  "${template.output_url}?mode=caller&latency=${template.latency * 1000}"`

    const scte_config = `# SCTE-35 Configuration
Service Name: ${template.service_name}
Ad Duration: ${template.ad_duration} seconds
SCTE Event ID Start: ${template.scte_event_id_start}
SCTE Start Command: ${template.scte_start_command}
SCTE Stop Command: ${template.scte_stop_command}
Crash Out Command: ${template.crash_out_command}
Pre-roll Duration: ${template.pre_roll_duration} seconds
SCTE Data PID: ${template.scte_data_pid}

# Video Specifications
Resolution: ${template.video_resolution}
Codec: ${template.video_codec}
Profile@Level: ${template.profile_level}
GOP: ${template.gop}
B Frames: ${template.b_frames}
Bitrate: ${template.video_bitrate} kbps
Chroma: ${template.chroma}
Aspect Ratio: ${template.aspect_ratio}

# Audio Specifications
Codec: ${template.audio_codec}
Bitrate: ${template.audio_bitrate} kbps
LKFS: ${template.audio_lkfs} dB
Sampling Rate: ${template.audio_sampling_rate} Hz

# Stream Parameters
SCTE PID: ${template.scte_pid}
Null PID: ${template.null_pid}
Latency: ${template.latency} ms`

    return {
      ffmpeg_command,
      scte_config,
      validation_status,
      validation_messages
    }
  }

  const createTemplate = (templateData: Partial<SRTStreamTemplate>) => {
    const now = new Date()
    const newTemplate: SRTStreamTemplate = {
      id: Date.now().toString(),
      name: templateData.name || 'New Template',
      service_name: templateData.service_name || 'Service Name',
      video_resolution: templateData.video_resolution || '1920x1080',
      video_codec: templateData.video_codec || 'H.264',
      pcr: templateData.pcr || 'Video Embedded',
      profile_level: templateData.profile_level || 'High@Auto',
      gop: templateData.gop || 12,
      b_frames: templateData.b_frames || 5,
      video_bitrate: templateData.video_bitrate || 5000,
      chroma: templateData.chroma || '4:2:0',
      aspect_ratio: templateData.aspect_ratio || '16:9',
      audio_codec: templateData.audio_codec || 'AAC-LC',
      audio_bitrate: templateData.audio_bitrate || 128,
      audio_lkfs: templateData.audio_lkfs || -20,
      audio_sampling_rate: templateData.audio_sampling_rate || 48000,
      scte_pid: templateData.scte_pid || 500,
      null_pid: templateData.null_pid || 8191,
      latency: templateData.latency || 2000,
      ad_duration: templateData.ad_duration || 600,
      scte_event_id_start: templateData.scte_event_id_start || 100023,
      scte_start_command: templateData.scte_start_command || 'CUE-OUT',
      scte_stop_command: templateData.scte_stop_command || 'CUE-IN',
      crash_out_command: templateData.crash_out_command || 'CUE-IN',
      pre_roll_duration: templateData.pre_roll_duration || 0,
      scte_data_pid: templateData.scte_data_pid || 500,
      input_url: templateData.input_url || '',
      output_url: templateData.output_url || '',
      is_active: true,
      created_at: now.toISOString(),
      updated_at: now.toISOString()
    }
    setTemplates([...templates, newTemplate])
    setIsCreateDialogOpen(false)
  }

  const duplicateTemplate = (template: SRTStreamTemplate) => {
    const now = new Date()
    const newTemplate = {
      ...template,
      id: Date.now().toString(),
      name: `${template.name} (Copy)`,
      created_at: now.toISOString(),
      updated_at: now.toISOString()
    }
    setTemplates([...templates, newTemplate])
  }

  const deleteTemplate = (templateId: string) => {
    setTemplates(templates.filter(t => t.id !== templateId))
  }

  const exportTemplate = (template: SRTStreamTemplate) => {
    const dataStr = JSON.stringify(template, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${template.name.replace(/\s+/g, '_')}_template.json`
    link.click()
  }

  const importTemplate = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const template = JSON.parse(e.target?.result as string)
          const now = new Date()
          template.id = Date.now().toString()
          template.created_at = now.toISOString()
          template.updated_at = now.toISOString()
          setTemplates([...templates, template])
        } catch (error) {
          alert('Invalid template file')
        }
      }
      reader.readAsText(file)
    }
  }

  const TemplateForm = ({ template, onSave, onCancel }: { 
    template?: SRTStreamTemplate | null
    onSave: (data: Partial<SRTStreamTemplate>) => void
    onCancel: () => void
  }) => {
    const [formData, setFormData] = useState({
      name: template?.name || '',
      service_name: template?.service_name || '',
      video_resolution: template?.video_resolution || '1920x1080',
      video_codec: template?.video_codec || 'H.264',
      pcr: template?.pcr || 'Video Embedded',
      profile_level: template?.profile_level || 'High@Auto',
      gop: template?.gop || 12,
      b_frames: template?.b_frames || 5,
      video_bitrate: template?.video_bitrate || 5000,
      chroma: template?.chroma || '4:2:0',
      aspect_ratio: template?.aspect_ratio || '16:9',
      audio_codec: template?.audio_codec || 'AAC-LC',
      audio_bitrate: template?.audio_bitrate || 128,
      audio_lkfs: template?.audio_lkfs || -20,
      audio_sampling_rate: template?.audio_sampling_rate || 48000,
      scte_pid: template?.scte_pid || 500,
      null_pid: template?.null_pid || 8191,
      latency: template?.latency || 2000,
      ad_duration: template?.ad_duration || 600,
      scte_event_id_start: template?.scte_event_id_start || 100023,
      scte_start_command: template?.scte_start_command || 'CUE-OUT',
      scte_stop_command: template?.scte_stop_command || 'CUE-IN',
      crash_out_command: template?.crash_out_command || 'CUE-IN',
      pre_roll_duration: template?.pre_roll_duration || 0,
      scte_data_pid: template?.scte_data_pid || 500,
      input_url: template?.input_url || '',
      output_url: template?.output_url || ''
    })

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault()
      onSave(formData)
    }

    return (
      <form onSubmit={handleSubmit} className="space-y-6 max-h-96 overflow-y-auto">
        {/* Basic Info */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Basic Information</h3>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Template Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                placeholder="Template name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="service_name">Service Name</Label>
              <Input
                id="service_name"
                value={formData.service_name}
                onChange={(e) => setFormData({...formData, service_name: e.target.value})}
                placeholder="Service name"
              />
            </div>
          </div>
        </div>

        {/* Stream URLs */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Stream Configuration</h3>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="input_url">Input URL</Label>
              <Input
                id="input_url"
                value={formData.input_url}
                onChange={(e) => setFormData({...formData, input_url: e.target.value})}
                placeholder="srt://source:9000"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="output_url">Output URL</Label>
              <Input
                id="output_url"
                value={formData.output_url}
                onChange={(e) => setFormData({...formData, output_url: e.target.value})}
                placeholder="srt://cdn:1234"
              />
            </div>
          </div>
        </div>

        {/* Video Specifications */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Video Specifications</h3>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="video_resolution">Resolution</Label>
              <Select value={formData.video_resolution} onValueChange={(value) => setFormData({...formData, video_resolution: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1920x1080">1920x1080 (HD)</SelectItem>
                  <SelectItem value="1280x720">1280x720 (HD)</SelectItem>
                  <SelectItem value="3840x2160">3840x2160 (4K)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="video_codec">Codec</Label>
              <Select value={formData.video_codec} onValueChange={(value) => setFormData({...formData, video_codec: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="H.264">H.264</SelectItem>
                  <SelectItem value="H.265">H.265</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="profile_level">Profile@Level</Label>
              <Select value={formData.profile_level} onValueChange={(value) => setFormData({...formData, profile_level: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="High@Auto">High@Auto</SelectItem>
                  <SelectItem value="High@4.1">High@4.1</SelectItem>
                  <SelectItem value="High@4.2">High@4.2</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="gop">GOP</Label>
              <Input
                id="gop"
                type="number"
                value={formData.gop}
                onChange={(e) => setFormData({...formData, gop: parseInt(e.target.value)})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="b_frames">B Frames</Label>
              <Input
                id="b_frames"
                type="number"
                value={formData.b_frames}
                onChange={(e) => setFormData({...formData, b_frames: parseInt(e.target.value)})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="video_bitrate">Video Bitrate (kbps)</Label>
              <Input
                id="video_bitrate"
                type="number"
                value={formData.video_bitrate}
                onChange={(e) => setFormData({...formData, video_bitrate: parseInt(e.target.value)})}
              />
            </div>
          </div>
        </div>

        {/* Audio Specifications */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Audio Specifications</h3>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="audio_codec">Codec</Label>
              <Select value={formData.audio_codec} onValueChange={(value) => setFormData({...formData, audio_codec: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="AAC-LC">AAC-LC</SelectItem>
                  <SelectItem value="AAC-HE">AAC-HE</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="audio_bitrate">Audio Bitrate (kbps)</Label>
              <Input
                id="audio_bitrate"
                type="number"
                value={formData.audio_bitrate}
                onChange={(e) => setFormData({...formData, audio_bitrate: parseInt(e.target.value)})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="audio_lkfs">Audio LKFS (dB)</Label>
              <Input
                id="audio_lkfs"
                type="number"
                value={formData.audio_lkfs}
                onChange={(e) => setFormData({...formData, audio_lkfs: parseFloat(e.target.value)})}
              />
            </div>
          </div>
        </div>

        {/* SCTE-35 Configuration */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">SCTE-35 Configuration</h3>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="ad_duration">Ad Duration (seconds)</Label>
              <Input
                id="ad_duration"
                type="number"
                value={formData.ad_duration}
                onChange={(e) => setFormData({...formData, ad_duration: parseInt(e.target.value)})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="scte_event_id_start">Event ID Start</Label>
              <Input
                id="scte_event_id_start"
                type="number"
                value={formData.scte_event_id_start}
                onChange={(e) => setFormData({...formData, scte_event_id_start: parseInt(e.target.value)})}
              />
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="scte_start_command">Start Command</Label>
              <Input
                id="scte_start_command"
                value={formData.scte_start_command}
                onChange={(e) => setFormData({...formData, scte_start_command: e.target.value})}
                placeholder="CUE-OUT"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="scte_stop_command">Stop Command</Label>
              <Input
                id="scte_stop_command"
                value={formData.scte_stop_command}
                onChange={(e) => setFormData({...formData, scte_stop_command: e.target.value})}
                placeholder="CUE-IN"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">
            <Save className="h-4 w-4 mr-2" />
            Save Template
          </Button>
        </div>
      </form>
    )
  }

  const selectedTemplateData = templates.find(t => t.id === selectedTemplate)

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>SRT Stream Templates</CardTitle>
              <CardDescription>
                Manage and deploy SRT stream templates with exact broadcast specifications
              </CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="file"
                accept=".json"
                onChange={importTemplate}
                className="hidden"
                id="import-template"
              />
              <Button
                variant="outline"
                onClick={() => document.getElementById('import-template')?.click()}
              >
                <Upload className="h-4 w-4 mr-2" />
                Import
              </Button>
              <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <LayoutTemplate className="h-4 w-4 mr-2" />
                    Create Template
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[90vh]">
                  <DialogHeader>
                    <DialogTitle>Create SRT Stream Template</DialogTitle>
                    <DialogDescription>
                      Configure a new SRT stream template with broadcast specifications
                    </DialogDescription>
                  </DialogHeader>
                  <TemplateForm
                    onSave={createTemplate}
                    onCancel={() => setIsCreateDialogOpen(false)}
                  />
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>
      </Card>

      <Tabs defaultValue="templates" className="space-y-6">
        <TabsList>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="generator">Command Generator</TabsTrigger>
          <TabsTrigger value="validator">Configuration Validator</TabsTrigger>
        </TabsList>

        <TabsContent value="templates">
          <Card>
            <CardHeader>
              <CardTitle>SRT Stream Templates</CardTitle>
              <CardDescription>Manage your broadcast stream templates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {templates.map((template) => (
                  <div key={template.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div>
                          <h3 className="font-medium">{template.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            Service: {template.service_name} • {template.video_resolution} • {template.video_codec}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Video: {template.video_bitrate}kbps • Audio: {template.audio_bitrate}kbps • SCTE PID: {template.scte_pid}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant={template.is_active ? "default" : "secondary"}>
                          {template.is_active ? "Active" : "Inactive"}
                        </Badge>
                        <div className="flex space-x-1">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              const command = generateFFmpegCommand(template)
                              setGeneratedCommand(command)
                            }}
                          >
                            <FileText className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => duplicateTemplate(template)}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => exportTemplate(template)}
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => deleteTemplate(template.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="generator">
          <Card>
            <CardHeader>
              <CardTitle>FFmpeg Command Generator</CardTitle>
              <CardDescription>Generate FFmpeg commands from your templates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Select Template</Label>
                  <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {templates.map((template) => (
                        <SelectItem key={template.id} value={template.id}>
                          {template.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {selectedTemplateData && (
                  <div className="space-y-4">
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="outline"
                        onClick={() => {
                          const command = generateFFmpegCommand(selectedTemplateData)
                          setGeneratedCommand(command)
                        }}
                      >
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Generate Command
                      </Button>
                    </div>

                    {generatedCommand && (
                      <div className="space-y-4">
                        {/* Validation Status */}
                        <div className="flex items-center space-x-2">
                          {generatedCommand.validation_status === 'valid' && (
                            <CheckCircle className="h-5 w-5 text-green-500" />
                          )}
                          {generatedCommand.validation_status === 'warning' && (
                            <AlertTriangle className="h-5 w-5 text-yellow-500" />
                          )}
                          {generatedCommand.validation_status === 'error' && (
                            <AlertTriangle className="h-5 w-5 text-red-500" />
                          )}
                          <span className="font-medium">
                            Configuration {generatedCommand.validation_status.toUpperCase()}
                          </span>
                        </div>

                        {generatedCommand.validation_messages.length > 0 && (
                          <Alert>
                            <AlertTriangle className="h-4 w-4" />
                            <AlertDescription>
                              {generatedCommand.validation_messages.map((msg, index) => (
                                <div key={index}>• {msg}</div>
                              ))}
                            </AlertDescription>
                          </Alert>
                        )}

                        {/* FFmpeg Command */}
                        <div className="space-y-2">
                          <Label>FFmpeg Command</Label>
                          <div className="p-4 bg-muted rounded-md">
                            <pre className="text-sm font-mono whitespace-pre-wrap">
                              {generatedCommand.ffmpeg_command}
                            </pre>
                          </div>
                        </div>

                        {/* SCTE-35 Configuration */}
                        <div className="space-y-2">
                          <Label>SCTE-35 Configuration</Label>
                          <div className="p-4 bg-muted rounded-md">
                            <pre className="text-sm font-mono whitespace-pre-wrap">
                              {generatedCommand.scte_config}
                            </pre>
                          </div>
                        </div>

                        <div className="flex justify-end space-x-2">
                          <Button
                            variant="outline"
                            onClick={() => {
                              navigator.clipboard.writeText(generatedCommand.ffmpeg_command)
                            }}
                          >
                            <Copy className="h-4 w-4 mr-2" />
                            Copy Command
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => {
                              navigator.clipboard.writeText(generatedCommand.scte_config)
                            }}
                          >
                            <Copy className="h-4 w-4 mr-2" />
                            Copy Config
                          </Button>
                          <Button>
                            <Play className="h-4 w-4 mr-2" />
                            Start Stream
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="validator">
          <Card>
            <CardHeader>
              <CardTitle>Configuration Validator</CardTitle>
              <CardDescription>Validate your stream configurations against broadcast standards</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {selectedTemplateData && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Template: {selectedTemplateData.name}</h3>
                    
                    {/* Video Validation */}
                    <div className="space-y-2">
                      <h4 className="font-medium">Video Specifications</h4>
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span>Resolution:</span>
                            <span className={selectedTemplateData.video_resolution === '1920x1080' ? 'text-green-500' : 'text-yellow-500'}>
                              {selectedTemplateData.video_resolution}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>Codec:</span>
                            <span className={selectedTemplateData.video_codec === 'H.264' ? 'text-green-500' : 'text-yellow-500'}>
                              {selectedTemplateData.video_codec}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>Profile@Level:</span>
                            <span className={selectedTemplateData.profile_level === 'High@Auto' ? 'text-green-500' : 'text-yellow-500'}>
                              {selectedTemplateData.profile_level}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>GOP:</span>
                            <span className={selectedTemplateData.gop === 12 ? 'text-green-500' : 'text-yellow-500'}>
                              {selectedTemplateData.gop}
                            </span>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span>B Frames:</span>
                            <span className={selectedTemplateData.b_frames === 5 ? 'text-green-500' : 'text-yellow-500'}>
                              {selectedTemplateData.b_frames}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>Video Bitrate:</span>
                            <span className={selectedTemplateData.video_bitrate === 5000 ? 'text-green-500' : 'text-yellow-500'}>
                              {selectedTemplateData.video_bitrate} kbps
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>Chroma:</span>
                            <span className={selectedTemplateData.chroma === '4:2:0' ? 'text-green-500' : 'text-yellow-500'}>
                              {selectedTemplateData.chroma}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>Aspect Ratio:</span>
                            <span className={selectedTemplateData.aspect_ratio === '16:9' ? 'text-green-500' : 'text-yellow-500'}>
                              {selectedTemplateData.aspect_ratio}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Audio Validation */}
                    <div className="space-y-2">
                      <h4 className="font-medium">Audio Specifications</h4>
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span>Codec:</span>
                            <span className={selectedTemplateData.audio_codec === 'AAC-LC' ? 'text-green-500' : 'text-yellow-500'}>
                              {selectedTemplateData.audio_codec}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>Bitrate:</span>
                            <span className={selectedTemplateData.audio_bitrate === 128 ? 'text-green-500' : 'text-yellow-500'}>
                              {selectedTemplateData.audio_bitrate} kbps
                            </span>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span>LKFS:</span>
                            <span className={selectedTemplateData.audio_lkfs === -20 ? 'text-green-500' : 'text-yellow-500'}>
                              {selectedTemplateData.audio_lkfs} dB
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>Sampling Rate:</span>
                            <span className={selectedTemplateData.audio_sampling_rate === 48000 ? 'text-green-500' : 'text-yellow-500'}>
                              {selectedTemplateData.audio_sampling_rate} Hz
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* SCTE-35 Validation */}
                    <div className="space-y-2">
                      <h4 className="font-medium">SCTE-35 Configuration</h4>
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span>SCTE PID:</span>
                            <span className={selectedTemplateData.scte_pid === 500 ? 'text-green-500' : 'text-yellow-500'}>
                              {selectedTemplateData.scte_pid}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>Null PID:</span>
                            <span className={selectedTemplateData.null_pid === 8191 ? 'text-green-500' : 'text-yellow-500'}>
                              {selectedTemplateData.null_pid}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>Latency:</span>
                            <span className={selectedTemplateData.latency === 2000 ? 'text-green-500' : 'text-yellow-500'}>
                              {selectedTemplateData.latency} ms
                            </span>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span>Ad Duration:</span>
                            <span className={selectedTemplateData.ad_duration === 600 ? 'text-green-500' : 'text-yellow-500'}>
                              {selectedTemplateData.ad_duration}s
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>Start Command:</span>
                            <span className={selectedTemplateData.scte_start_command === 'CUE-OUT' ? 'text-green-500' : 'text-yellow-500'}>
                              {selectedTemplateData.scte_start_command}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>Stop Command:</span>
                            <span className={selectedTemplateData.scte_stop_command === 'CUE-IN' ? 'text-green-500' : 'text-yellow-500'}>
                              {selectedTemplateData.scte_stop_command}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}