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
import { Calendar } from '@/components/ui/calendar'
import { 
  Plus, 
  Copy, 
  Save, 
  Trash2, 
  Edit,
  Play,
  Pause,
  Clock,
  Calendar as CalendarIcon,
  AlertTriangle,
  CheckCircle,
  Settings,
  FileText,
  Timer,
  Zap,
  Tv,
  Radio,
  Film,
  Music,
  News,
  Sports,
  Megaphone
} from 'lucide-react'

interface SCTE35EventTemplate {
  id: string
  name: string
  description: string
  eventType: 'SPLICE_INSERT' | 'SPLICE_NULL' | 'TIME_SIGNAL' | 'BANDWIDTH_RESERVATION' | 'PRIVATE_COMMAND'
  commandType: 'CUE-OUT' | 'CUE-IN' | 'TIME-SIGNAL' | 'RESERVATION-START' | 'RESERVATION-END'
  adDuration: number
  preRollDuration: number
  eventIdStart: number
  autoIncrement: boolean
  scte35Pid: number
  segmentationTypeId: string
  segmentationMessage: string
  upidType: string
  upidValue: string
  deviceConstraints: string
  timeSignalSpec: string
  privateData: string
  isActive: boolean
  isRecurring: boolean
  recurringPattern: string
  category: 'commercial' | 'program' | 'emergency' | 'maintenance' | 'testing'
  tags: string[]
  createdAt: string
  updatedAt: string
}

interface ScheduledEvent {
  id: string
  templateId: string
  templateName: string
  scheduledTime: string
  eventId: string
  status: 'SCHEDULED' | 'EXECUTED' | 'FAILED' | 'CANCELLED'
  executionTime?: string
  createdAt: string
}

interface SCTE35EventTemplateProps {
  channelId: string
  onEventCreate?: (event: SCTE35EventTemplate) => void
  onEventExecute?: (eventId: string) => void
}

export default function SCTE35EventTemplate({ channelId, onEventCreate, onEventExecute }: SCTE35EventTemplateProps) {
  const [templates, setTemplates] = useState<SCTE35EventTemplate[]>([])
  const [scheduledEvents, setScheduledEvents] = useState<ScheduledEvent[]>([])
  const [selectedTemplate, setSelectedTemplate] = useState<string>('')
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [isClient, setIsClient] = useState(false)
  const [nextEventId, setNextEventId] = useState<number>(100023)

  // Initialize client-side
  useEffect(() => {
    setIsClient(true)
    setSelectedDate(new Date())
    
    // Default templates based on distributor requirements
    const defaultTemplates: SCTE35EventTemplate[] = [
      {
        id: '1',
        name: 'Standard Commercial Break',
        description: 'Standard 60-second commercial break with pre-roll',
        eventType: 'SPLICE_INSERT',
        commandType: 'CUE-OUT',
        adDuration: 60,
        preRollDuration: 0,
        eventIdStart: 100023,
        autoIncrement: true,
        scte35Pid: 500,
        segmentationTypeId: '0x32', // Program Segment
        segmentationMessage: 'Commercial Break',
        upidType: '0x08', // URI
        upidValue: 'commercial://standard/60s',
        deviceConstraints: 'none',
        timeSignalSpec: '',
        privateData: '',
        isActive: true,
        isRecurring: false,
        recurringPattern: '',
        category: 'commercial',
        tags: ['standard', 'commercial', '60s'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: '2',
        name: 'Prime Time Commercial Break',
        description: 'Extended 120-second commercial break for prime time',
        eventType: 'SPLICE_INSERT',
        commandType: 'CUE-OUT',
        adDuration: 120,
        preRollDuration: 2,
        eventIdStart: 100024,
        autoIncrement: true,
        scte35Pid: 500,
        segmentationTypeId: '0x32',
        segmentationMessage: 'Prime Time Commercial Break',
        upidType: '0x08',
        upidValue: 'commercial://primetime/120s',
        deviceConstraints: 'none',
        timeSignalSpec: '',
        privateData: '',
        isActive: true,
        isRecurring: false,
        recurringPattern: '',
        category: 'commercial',
        tags: ['primetime', 'commercial', '120s'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: '3',
        name: 'Program Start Marker',
        description: 'Time signal for program start',
        eventType: 'TIME_SIGNAL',
        commandType: 'TIME-SIGNAL',
        adDuration: 0,
        preRollDuration: 0,
        eventIdStart: 100025,
        autoIncrement: true,
        scte35Pid: 500,
        segmentationTypeId: '0x00',
        segmentationMessage: 'Program Start',
        upidType: '0x08',
        upidValue: 'program://start',
        deviceConstraints: 'none',
        timeSignalSpec: 'PTS auto',
        privateData: '',
        isActive: true,
        isRecurring: false,
        recurringPattern: '',
        category: 'program',
        tags: ['program', 'start', 'marker'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: '4',
        name: 'Emergency Alert System',
        description: 'Emergency broadcast system interruption',
        eventType: 'SPLICE_INSERT',
        commandType: 'CUE-OUT',
        adDuration: 300,
        preRollDuration: 0,
        eventIdStart: 900001,
        autoIncrement: false,
        scte35Pid: 500,
        segmentationTypeId: '0x34', // Provider Advertisement
        segmentationMessage: 'Emergency Alert',
        upidType: '0x08',
        upidValue: 'emergency://alert/system',
        deviceConstraints: 'all',
        timeSignalSpec: '',
        privateData: 'EMERGENCY',
        isActive: true,
        isRecurring: false,
        recurringPattern: '',
        category: 'emergency',
        tags: ['emergency', 'alert', 'system'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: '5',
        name: 'Daily News Break',
        description: 'Recurring 90-second news break',
        eventType: 'SPLICE_INSERT',
        commandType: 'CUE-OUT',
        adDuration: 90,
        preRollDuration: 1,
        eventIdStart: 200001,
        autoIncrement: true,
        scte35Pid: 500,
        segmentationTypeId: '0x32',
        segmentationMessage: 'News Break',
        upidType: '0x08',
        upidValue: 'news://break/daily',
        deviceConstraints: 'none',
        timeSignalSpec: '',
        privateData: '',
        isActive: true,
        isRecurring: true,
        recurringPattern: '0 18 * * *', // Daily at 6 PM
        category: 'commercial',
        tags: ['news', 'break', 'recurring', '90s'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ]

    const mockScheduledEvents: ScheduledEvent[] = [
      {
        id: '1',
        templateId: '1',
        templateName: 'Standard Commercial Break',
        scheduledTime: new Date(Date.now() + 300000).toISOString(), // 5 minutes from now
        eventId: '100023',
        status: 'SCHEDULED',
        createdAt: new Date().toISOString()
      },
      {
        id: '2',
        templateId: '2',
        templateName: 'Prime Time Commercial Break',
        scheduledTime: new Date(Date.now() + 3600000).toISOString(), // 1 hour from now
        eventId: '100024',
        status: 'SCHEDULED',
        createdAt: new Date().toISOString()
      }
    ]

    setTemplates(defaultTemplates)
    setScheduledEvents(mockScheduledEvents)
    setSelectedTemplate('1')
    setNextEventId(100026)
  }, [])

  const createTemplate = (templateData: Partial<SCTE35EventTemplate>) => {
    const now = new Date()
    const newTemplate: SCTE35EventTemplate = {
      id: Date.now().toString(),
      name: templateData.name || 'New Event Template',
      description: templateData.description || '',
      eventType: templateData.eventType || 'SPLICE_INSERT',
      commandType: templateData.commandType || 'CUE-OUT',
      adDuration: templateData.adDuration || 60,
      preRollDuration: templateData.preRollDuration || 0,
      eventIdStart: templateData.eventIdStart || nextEventId,
      autoIncrement: templateData.autoIncrement ?? true,
      scte35Pid: templateData.scte35Pid || 500,
      segmentationTypeId: templateData.segmentationTypeId || '0x32',
      segmentationMessage: templateData.segmentationMessage || '',
      upidType: templateData.upidType || '0x08',
      upidValue: templateData.upidValue || '',
      deviceConstraints: templateData.deviceConstraints || 'none',
      timeSignalSpec: templateData.timeSignalSpec || '',
      privateData: templateData.privateData || '',
      isActive: templateData.isActive ?? true,
      isRecurring: templateData.isRecurring || false,
      recurringPattern: templateData.recurringPattern || '',
      category: templateData.category || 'commercial',
      tags: templateData.tags || [],
      createdAt: now.toISOString(),
      updatedAt: now.toISOString()
    }
    
    setTemplates([...templates, newTemplate])
    setIsCreateDialogOpen(false)
    setNextEventId(nextEventId + 1)
    
    if (onEventCreate) {
      onEventCreate(newTemplate)
    }
  }

  const scheduleEvent = (templateId: string, scheduledTime: string) => {
    const template = templates.find(t => t.id === templateId)
    if (!template) return

    const eventId = template.autoIncrement 
      ? (template.eventIdStart + scheduledEvents.filter(e => e.templateId === templateId).length).toString()
      : template.eventIdStart.toString()

    const newScheduledEvent: ScheduledEvent = {
      id: Date.now().toString(),
      templateId,
      templateName: template.name,
      scheduledTime,
      eventId,
      status: 'SCHEDULED',
      createdAt: new Date().toISOString()
    }

    setScheduledEvents([...scheduledEvents, newScheduledEvent])
  }

  const executeEvent = (eventId: string) => {
    setScheduledEvents(scheduledEvents.map(event => 
      event.id === eventId 
        ? { ...event, status: 'EXECUTED', executionTime: new Date().toISOString() }
        : event
    ))
    
    if (onEventExecute) {
      onEventExecute(eventId)
    }
  }

  const deleteTemplate = (templateId: string) => {
    setTemplates(templates.filter(t => t.id !== templateId))
    setScheduledEvents(scheduledEvents.filter(e => e.templateId !== templateId))
  }

  const duplicateTemplate = (template: SCTE35EventTemplate) => {
    const now = new Date()
    const newTemplate = {
      ...template,
      id: Date.now().toString(),
      name: `${template.name} (Copy)`,
      eventIdStart: nextEventId,
      createdAt: now.toISOString(),
      updatedAt: now.toISOString()
    }
    setTemplates([...templates, newTemplate])
    setNextEventId(nextEventId + 1)
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'commercial': return <Megaphone className="h-4 w-4" />
      case 'program': return <Tv className="h-4 w-4" />
      case 'emergency': return <AlertTriangle className="h-4 w-4" />
      case 'maintenance': return <Settings className="h-4 w-4" />
      case 'testing': return <Zap className="h-4 w-4" />
      default: return <FileText className="h-4 w-4" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'SCHEDULED': return 'bg-blue-500'
      case 'EXECUTED': return 'bg-green-500'
      case 'FAILED': return 'bg-red-500'
      case 'CANCELLED': return 'bg-orange-500'
      default: return 'bg-gray-500'
    }
  }

  const formatDateTime = (dateString: string) => {
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

  const generateSCTE35Command = (template: SCTE35EventTemplate) => {
    const baseCommand = `ffmpeg -i input.mpg -c copy -mpegts_scte35_pid ${template.scte35Pid}`
    
    switch (template.commandType) {
      case 'CUE-OUT':
        return `${baseCommand} -f mpegts "srt://output:1234?mode=caller&latency=2000000" # CUE-OUT - ${template.segmentationMessage}`
      case 'CUE-IN':
        return `${baseCommand} -f mpegts "srt://output:1234?mode=caller&latency=2000000" # CUE-IN - Return to program`
      case 'TIME-SIGNAL':
        return `${baseCommand} -f mpegts "srt://output:1234?mode=caller&latency=2000000" # TIME-SIGNAL - ${template.segmentationMessage}`
      default:
        return `${baseCommand} -f mpegts "srt://output:1234?mode=caller&latency=2000000"`
    }
  }

  const TemplateForm = ({ template, onSave, onCancel }: { 
    template?: SCTE35EventTemplate | null
    onSave: (data: Partial<SCTE35EventTemplate>) => void
    onCancel: () => void
  }) => {
    const [formData, setFormData] = useState({
      name: template?.name || '',
      description: template?.description || '',
      eventType: template?.eventType || 'SPLICE_INSERT',
      commandType: template?.commandType || 'CUE-OUT',
      adDuration: template?.adDuration || 60,
      preRollDuration: template?.preRollDuration || 0,
      eventIdStart: template?.eventIdStart || nextEventId,
      autoIncrement: template?.autoIncrement ?? true,
      scte35Pid: template?.scte35Pid || 500,
      segmentationTypeId: template?.segmentationTypeId || '0x32',
      segmentationMessage: template?.segmentationMessage || '',
      upidType: template?.upidType || '0x08',
      upidValue: template?.upidValue || '',
      deviceConstraints: template?.deviceConstraints || 'none',
      timeSignalSpec: template?.timeSignalSpec || '',
      privateData: template?.privateData || '',
      isActive: template?.isActive ?? true,
      isRecurring: template?.isRecurring || false,
      recurringPattern: template?.recurringPattern || '',
      category: template?.category || 'commercial',
      tags: template?.tags?.join(', ') || ''
    })

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault()
      onSave({
        ...formData,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean)
      })
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
              <Label htmlFor="category">Category</Label>
              <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value as any})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="commercial">Commercial</SelectItem>
                  <SelectItem value="program">Program</SelectItem>
                  <SelectItem value="emergency">Emergency</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                  <SelectItem value="testing">Testing</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              placeholder="Template description"
              rows={3}
            />
          </div>
        </div>

        {/* Event Configuration */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Event Configuration</h3>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="eventType">Event Type</Label>
              <Select value={formData.eventType} onValueChange={(value) => setFormData({...formData, eventType: value as any})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="SPLICE_INSERT">Splice Insert</SelectItem>
                  <SelectItem value="SPLICE_NULL">Splice Null</SelectItem>
                  <SelectItem value="TIME_SIGNAL">Time Signal</SelectItem>
                  <SelectItem value="BANDWIDTH_RESERVATION">Bandwidth Reservation</SelectItem>
                  <SelectItem value="PRIVATE_COMMAND">Private Command</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="commandType">Command Type</Label>
              <Select value={formData.commandType} onValueChange={(value) => setFormData({...formData, commandType: value as any})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CUE-OUT">CUE-OUT</SelectItem>
                  <SelectItem value="CUE-IN">CUE-IN</SelectItem>
                  <SelectItem value="TIME-SIGNAL">TIME-SIGNAL</SelectItem>
                  <SelectItem value="RESERVATION-START">RESERVATION-START</SelectItem>
                  <SelectItem value="RESERVATION-END">RESERVATION-END</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="adDuration">Ad Duration (seconds)</Label>
              <Input
                id="adDuration"
                type="number"
                value={formData.adDuration}
                onChange={(e) => setFormData({...formData, adDuration: parseInt(e.target.value) || 0})}
                min="0"
                max="3600"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="preRollDuration">Pre-roll Duration (seconds)</Label>
              <Input
                id="preRollDuration"
                type="number"
                value={formData.preRollDuration}
                onChange={(e) => setFormData({...formData, preRollDuration: parseInt(e.target.value) || 0})}
                min="0"
                max="10"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="scte35Pid">SCTE-35 PID</Label>
              <Input
                id="scte35Pid"
                type="number"
                value={formData.scte35Pid}
                onChange={(e) => setFormData({...formData, scte35Pid: parseInt(e.target.value) || 500})}
                min="16"
                max="8190"
              />
            </div>
          </div>
        </div>

        {/* Event ID Configuration */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Event ID Configuration</h3>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="eventIdStart">Event ID Start</Label>
              <Input
                id="eventIdStart"
                type="number"
                value={formData.eventIdStart}
                onChange={(e) => setFormData({...formData, eventIdStart: parseInt(e.target.value) || 100023})}
                min="1"
                max="999999"
              />
            </div>
            <div className="flex items-center space-x-2 pt-6">
              <Switch
                id="autoIncrement"
                checked={formData.autoIncrement}
                onCheckedChange={(checked) => setFormData({...formData, autoIncrement: checked})}
              />
              <Label htmlFor="autoIncrement">Auto-increment Event ID</Label>
            </div>
          </div>
        </div>

        {/* SCTE-35 Specific Configuration */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">SCTE-35 Configuration</h3>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="segmentationTypeId">Segmentation Type ID</Label>
              <Select value={formData.segmentationTypeId} onValueChange={(value) => setFormData({...formData, segmentationTypeId: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0x00">Not Indicated</SelectItem>
                  <SelectItem value="0x10">Program Content</SelectItem>
                  <SelectItem value="0x20">Program Start</SelectItem>
                  <SelectItem value="0x22">Program End</SelectItem>
                  <SelectItem value="0x30">Program Early Termination</SelectItem>
                  <SelectItem value="0x32">Program Break</SelectItem>
                  <SelectItem value="0x34">Provider Advertisement</SelectItem>
                  <SelectItem value="0x36">Distributor Advertisement</SelectItem>
                  <SelectItem value="0x40">Provider Placement Opportunity</SelectItem>
                  <SelectItem value="0x42">Distributor Placement Opportunity</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="segmentationMessage">Segmentation Message</Label>
              <Input
                id="segmentationMessage"
                value={formData.segmentationMessage}
                onChange={(e) => setFormData({...formData, segmentationMessage: e.target.value})}
                placeholder="Segmentation message"
              />
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="upidType">UPID Type</Label>
              <Select value={formData.upidType} onValueChange={(value) => setFormData({...formData, upidType: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0x00">Not Used</SelectItem>
                  <SelectItem value="0x01">User Defined</SelectItem>
                  <SelectItem value="0x02">ISCI</SelectItem>
                  <SelectItem value="0x03">Ad ID</SelectItem>
                  <SelectItem value="0x04">UMID</SelectItem>
                  <SelectItem value="0x05">ISAN</SelectItem>
                  <SelectItem value="0x06">TID</SelectItem>
                  <SelectItem value="0x07">Airing ID</SelectItem>
                  <SelectItem value="0x08">URI</SelectItem>
                  <SelectItem value="0x09">UUID</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="upidValue">UPID Value</Label>
              <Input
                id="upidValue"
                value={formData.upidValue}
                onChange={(e) => setFormData({...formData, upidValue: e.target.value})}
                placeholder="UPID value"
              />
            </div>
          </div>
        </div>

        {/* Recurring Configuration */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Recurring Configuration</h3>
          <div className="flex items-center space-x-2">
            <Switch
              id="isRecurring"
              checked={formData.isRecurring}
              onCheckedChange={(checked) => setFormData({...formData, isRecurring: checked})}
            />
            <Label htmlFor="isRecurring">Recurring Event</Label>
          </div>
          {formData.isRecurring && (
            <div className="space-y-2">
              <Label htmlFor="recurringPattern">Cron Pattern</Label>
              <Input
                id="recurringPattern"
                value={formData.recurringPattern}
                onChange={(e) => setFormData({...formData, recurringPattern: e.target.value})}
                placeholder="0 18 * * * (daily at 6 PM)"
              />
              <p className="text-xs text-muted-foreground">
                Examples: 0 18 * * * (daily 6PM), 0 */2 * * 1-5 (every 2 hours weekdays)
              </p>
            </div>
          )}
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

  if (!isClient) {
    return <div className="p-8 text-center">Loading SCTE-35 Event Templates...</div>
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <Timer className="h-5 w-5" />
                <span>SCTE-35 Event Templates</span>
              </CardTitle>
              <CardDescription>
                Create and manage SCTE-35 event templates based on distributor requirements
              </CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="flex items-center space-x-2">
                <span>{templates.length} Templates</span>
              </Badge>
              <Badge variant="outline" className="flex items-center space-x-2">
                <span>{scheduledEvents.length} Scheduled</span>
              </Badge>
              <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Template
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[90vh]">
                  <DialogHeader>
                    <DialogTitle>Create SCTE-35 Event Template</DialogTitle>
                    <DialogDescription>
                      Configure a new SCTE-35 event template for broadcast scheduling
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
          <TabsTrigger value="templates">Event Templates</TabsTrigger>
          <TabsTrigger value="scheduler">Event Scheduler</TabsTrigger>
          <TabsTrigger value="calendar">Calendar View</TabsTrigger>
          <TabsTrigger value="commands">Command Generator</TabsTrigger>
        </TabsList>

        <TabsContent value="templates">
          <Card>
            <CardHeader>
              <CardTitle>SCTE-35 Event Templates</CardTitle>
              <CardDescription>
                Pre-configured event templates for different broadcast scenarios
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {templates.map((template) => (
                  <div key={template.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4">
                        <div className="flex items-center space-x-2 mt-1">
                          {getCategoryIcon(template.category)}
                          <div>
                            <h3 className="font-medium">{template.name}</h3>
                            <p className="text-sm text-muted-foreground">{template.description}</p>
                            <div className="flex items-center space-x-4 mt-2 text-xs text-muted-foreground">
                              <span className="flex items-center space-x-1">
                                <span>Type:</span>
                                <Badge variant="outline" className="text-xs">
                                  {template.eventType}
                                </Badge>
                              </span>
                              <span className="flex items-center space-x-1">
                                <span>Command:</span>
                                <Badge variant="outline" className="text-xs">
                                  {template.commandType}
                                </Badge>
                              </span>
                              <span className="flex items-center space-x-1">
                                <span>Duration:</span>
                                <Badge variant="outline" className="text-xs">
                                  {template.adDuration}s
                                </Badge>
                              </span>
                              <span className="flex items-center space-x-1">
                                <span>PID:</span>
                                <Badge variant="outline" className="text-xs">
                                  {template.scte35Pid}
                                </Badge>
                              </span>
                            </div>
                            <div className="flex items-center space-x-2 mt-2">
                              {template.tags.map((tag, index) => (
                                <Badge key={index} variant="secondary" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                              {template.isRecurring && (
                                <Badge variant="outline" className="text-xs">
                                  Recurring
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="flex items-center space-x-1">
                          {template.isActive ? (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          ) : (
                            <AlertTriangle className="h-4 w-4 text-yellow-500" />
                          )}
                          <Badge variant={template.isActive ? "default" : "secondary"}>
                            {template.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </div>
                        <div className="flex space-x-1">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => scheduleEvent(template.id, new Date(Date.now() + 300000).toISOString())}
                          >
                            <Play className="h-4 w-4" />
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

        <TabsContent value="scheduler">
          <Card>
            <CardHeader>
              <CardTitle>Event Scheduler</CardTitle>
              <CardDescription>
                Schedule SCTE-35 events using templates
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Quick Schedule */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Quick Schedule</h3>
                  <div className="grid gap-4 md:grid-cols-2">
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
                    <div className="space-y-2">
                      <Label>Schedule Time</Label>
                      <Input
                        type="datetime-local"
                        onChange={(e) => {
                          if (e.target.value && selectedTemplate) {
                            scheduleEvent(selectedTemplate, new Date(e.target.value).toISOString())
                          }
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Scheduled Events */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Scheduled Events</h3>
                  <div className="space-y-3">
                    {scheduledEvents.map((event) => (
                      <div key={event.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div className={`h-3 w-3 rounded-full ${getStatusColor(event.status)}`} />
                          <div>
                            <h4 className="font-medium">{event.templateName}</h4>
                            <p className="text-sm text-muted-foreground">
                              Event ID: {event.eventId} • Scheduled: {formatDateTime(event.scheduledTime)}
                            </p>
                            {event.executionTime && (
                              <p className="text-xs text-muted-foreground">
                                Executed: {formatDateTime(event.executionTime)}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline">{event.status}</Badge>
                          <div className="flex space-x-1">
                            {event.status === 'SCHEDULED' && (
                              <Button
                                size="sm"
                                onClick={() => executeEvent(event.id)}
                              >
                                <Play className="h-4 w-4" />
                              </Button>
                            )}
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setScheduledEvents(scheduledEvents.filter(e => e.id !== event.id))
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="calendar">
          <Card>
            <CardHeader>
              <CardTitle>Calendar View</CardTitle>
              <CardDescription>
                View scheduled events in calendar format
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  {selectedDate && (
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={(date) => date && setSelectedDate(date)}
                      className="rounded-md border"
                    />
                  )}
                </div>
                <div>
                  <h3 className="font-medium mb-4">
                    Events for {selectedDate ? selectedDate.toLocaleDateString() : 'Select a date'}
                  </h3>
                  <div className="space-y-2">
                    {scheduledEvents
                      .filter(event => {
                        const eventDate = new Date(event.scheduledTime).toDateString()
                        return selectedDate && eventDate === selectedDate.toDateString()
                      })
                      .map((event) => (
                        <div key={event.id} className="p-3 border rounded">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-medium">{event.templateName}</h4>
                              <p className="text-sm text-muted-foreground">
                                Event ID: {event.eventId}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {new Date(event.scheduledTime).toLocaleTimeString()}
                              </p>
                            </div>
                            <Badge variant="outline">{event.status}</Badge>
                          </div>
                        </div>
                      ))}
                    {(!selectedDate || scheduledEvents.filter(event => {
                      const eventDate = new Date(event.scheduledTime).toDateString()
                      return selectedDate && eventDate === selectedDate.toDateString()
                    }).length === 0) && (
                      <p className="text-muted-foreground text-sm">No events scheduled for this date</p>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="commands">
          <Card>
            <CardHeader>
              <CardTitle>Command Generator</CardTitle>
              <CardDescription>
                Generate FFmpeg commands for SCTE-35 events
              </CardDescription>
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

                {selectedTemplate && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Generated FFmpeg Command</Label>
                      <div className="p-4 bg-muted rounded-md">
                        <pre className="text-sm font-mono whitespace-pre-wrap">
                          {generateSCTE35Command(templates.find(t => t.id === selectedTemplate)!)}
                        </pre>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>SCTE-35 Event Details</Label>
                      <div className="p-4 bg-muted rounded-md space-y-2 text-sm">
                        {(() => {
                          const template = templates.find(t => t.id === selectedTemplate)!
                          return (
                            <>
                              <div><strong>Event Type:</strong> {template.eventType}</div>
                              <div><strong>Command:</strong> {template.commandType}</div>
                              <div><strong>Duration:</strong> {template.adDuration} seconds</div>
                              <div><strong>Pre-roll:</strong> {template.preRollDuration} seconds</div>
                              <div><strong>SCTE-35 PID:</strong> {template.scte35Pid}</div>
                              <div><strong>Segmentation Type:</strong> {template.segmentationTypeId}</div>
                              <div><strong>Segmentation Message:</strong> {template.segmentationMessage}</div>
                              <div><strong>UPID Type:</strong> {template.upidType}</div>
                              <div><strong>UPID Value:</strong> {template.upidValue}</div>
                              <div><strong>Event ID:</strong> {template.eventIdStart} {template.autoIncrement ? '(auto-increment)' : '(fixed)'}</div>
                            </>
                          )
                        })()}
                      </div>
                    </div>

                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="outline"
                        onClick={() => {
                          const command = generateSCTE35Command(templates.find(t => t.id === selectedTemplate)!)
                          navigator.clipboard.writeText(command)
                        }}
                      >
                        <Copy className="h-4 w-4 mr-2" />
                        Copy Command
                      </Button>
                      <Button>
                        <Play className="h-4 w-4 mr-2" />
                        Execute Event
                      </Button>
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