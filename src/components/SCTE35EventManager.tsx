"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Switch } from '@/components/ui/switch'
import { Calendar } from '@/components/ui/calendar'
import { 
  Plus, 
  Edit, 
  Trash2, 
  Play, 
  Pause, 
  Calendar as CalendarIcon,
  Clock,
  AlertTriangle,
  CheckCircle,
  Copy,
  Save,
  X
} from 'lucide-react'

interface SCTE35Event {
  id: string
  eventId: string
  commandType: 'SPLICE_INSERT' | 'SPLICE_NULL' | 'TIME_SIGNAL' | 'BANDWIDTH_RESERVATION' | 'PRIVATE_COMMAND'
  description: string
  startTime: string
  endTime?: string
  duration?: number
  isRecurring: boolean
  recurringPattern?: string
  channelId: string
  isActive: boolean
  status: 'SCHEDULED' | 'ACTIVE' | 'COMPLETED' | 'FAILED' | 'CANCELLED'
  createdAt: string
  updatedAt: string
}

interface SCTE35EventManagerProps {
  channelId: string
}

export default function SCTE35EventManager({ channelId }: SCTE35EventManagerProps) {
  const [events, setEvents] = useState<SCTE35Event[]>([])
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [editingEvent, setEditingEvent] = useState<SCTE35Event | null>(null)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [isClient, setIsClient] = useState(false)

  // Set client-side only after mount
  useEffect(() => {
    setIsClient(true)
    setSelectedDate(new Date())
  }, [])

  // Mock data for demonstration
  useEffect(() => {
    const mockEvents: SCTE35Event[] = [
      {
        id: '1',
        eventId: 'EVT001',
        commandType: 'SPLICE_INSERT',
        description: 'Commercial Break - Prime Time',
        startTime: '2024-01-15T20:00:00Z',
        duration: 120,
        isRecurring: false,
        channelId,
        isActive: true,
        status: 'SCHEDULED',
        createdAt: '2024-01-15T10:00:00Z',
        updatedAt: '2024-01-15T10:00:00Z'
      },
      {
        id: '2',
        eventId: 'EVT002',
        commandType: 'TIME_SIGNAL',
        description: 'Program Start Marker',
        startTime: '2024-01-15T20:02:00Z',
        isRecurring: false,
        channelId,
        isActive: true,
        status: 'SCHEDULED',
        createdAt: '2024-01-15T10:00:00Z',
        updatedAt: '2024-01-15T10:00:00Z'
      },
      {
        id: '3',
        eventId: 'EVT003',
        commandType: 'SPLICE_INSERT',
        description: 'Daily News Break',
        startTime: '2024-01-15T18:00:00Z',
        duration: 60,
        isRecurring: true,
        recurringPattern: '0 18 * * *',
        channelId,
        isActive: true,
        status: 'SCHEDULED',
        createdAt: '2024-01-15T09:00:00Z',
        updatedAt: '2024-01-15T09:00:00Z'
      }
    ]
    setEvents(mockEvents)
  }, [channelId])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'SCHEDULED': return 'bg-blue-500'
      case 'ACTIVE': return 'bg-green-500'
      case 'COMPLETED': return 'bg-gray-500'
      case 'FAILED': return 'bg-red-500'
      case 'CANCELLED': return 'bg-orange-500'
      default: return 'bg-gray-500'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'SCHEDULED':
        return <Clock className="h-4 w-4 text-blue-500" />
      case 'ACTIVE':
        return <Play className="h-4 w-4 text-green-500" />
      case 'COMPLETED':
        return <CheckCircle className="h-4 w-4 text-gray-500" />
      case 'FAILED':
        return <AlertTriangle className="h-4 w-4 text-red-500" />
      case 'CANCELLED':
        return <X className="h-4 w-4 text-orange-500" />
      default:
        return <Clock className="h-4 w-4 text-gray-500" />
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

  const createEvent = (eventData: Partial<SCTE35Event>) => {
    const newEvent: SCTE35Event = {
      id: Date.now().toString(),
      eventId: `EVT${String(events.length + 1).padStart(3, '0')}`,
      commandType: eventData.commandType || 'SPLICE_INSERT',
      description: eventData.description || '',
      startTime: eventData.startTime || new Date().toISOString(),
      duration: eventData.duration,
      isRecurring: eventData.isRecurring || false,
      recurringPattern: eventData.recurringPattern,
      channelId,
      isActive: true,
      status: 'SCHEDULED',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    setEvents([...events, newEvent])
    setIsCreateDialogOpen(false)
  }

  const updateEvent = (eventId: string, updates: Partial<SCTE35Event>) => {
    setEvents(events.map(event => 
      event.id === eventId 
        ? { ...event, ...updates, updatedAt: new Date().toISOString() }
        : event
    ))
    setEditingEvent(null)
  }

  const deleteEvent = (eventId: string) => {
    setEvents(events.filter(event => event.id !== eventId))
  }

  const duplicateEvent = (event: SCTE35Event) => {
    const newEvent = {
      ...event,
      id: Date.now().toString(),
      eventId: `EVT${String(events.length + 1).padStart(3, '0')}`,
      status: 'SCHEDULED' as const,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    setEvents([...events, newEvent])
  }

  const EventForm = ({ event, onSave, onCancel }: { 
    event?: SCTE35Event | null
    onSave: (data: Partial<SCTE35Event>) => void
    onCancel: () => void
  }) => {
    const [formData, setFormData] = useState({
      commandType: event?.commandType || 'SPLICE_INSERT',
      description: event?.description || '',
      startTime: event?.startTime || new Date().toISOString().slice(0, 16),
      duration: event?.duration || '',
      isRecurring: event?.isRecurring || false,
      recurringPattern: event?.recurringPattern || ''
    })

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault()
      onSave({
        ...formData,
        duration: formData.duration ? parseInt(formData.duration) : undefined,
        startTime: new Date(formData.startTime).toISOString()
      })
    }

    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="commandType">Command Type</Label>
          <Select 
            value={formData.commandType} 
            onValueChange={(value) => setFormData({...formData, commandType: value as any})}
          >
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
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            placeholder="Event description..."
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="startTime">Start Time</Label>
          <Input
            id="startTime"
            type="datetime-local"
            value={formData.startTime}
            onChange={(e) => setFormData({...formData, startTime: e.target.value})}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="duration">Duration (seconds)</Label>
          <Input
            id="duration"
            type="number"
            value={formData.duration}
            onChange={(e) => setFormData({...formData, duration: e.target.value})}
            placeholder="Duration in seconds"
          />
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="recurring"
            checked={formData.isRecurring}
            onCheckedChange={(checked) => setFormData({...formData, isRecurring: checked})}
          />
          <Label htmlFor="recurring">Recurring Event</Label>
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
          </div>
        )}

        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">
            <Save className="h-4 w-4 mr-2" />
            {event ? 'Update' : 'Create'} Event
          </Button>
        </div>
      </form>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>SCTE-35 Event Management</CardTitle>
              <CardDescription>
                Create, schedule, and manage SCTE-35 events for ad insertion and program control
              </CardDescription>
            </div>
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Event
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Create SCTE-35 Event</DialogTitle>
                  <DialogDescription>
                    Configure a new SCTE-35 event for ad insertion or program control
                  </DialogDescription>
                </DialogHeader>
                <EventForm
                  onSave={createEvent}
                  onCancel={() => setIsCreateDialogOpen(false)}
                />
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
      </Card>

      <Tabs defaultValue="events" className="space-y-6">
        <TabsList>
          <TabsTrigger value="events">All Events</TabsTrigger>
          <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
          <TabsTrigger value="recurring">Recurring</TabsTrigger>
          <TabsTrigger value="calendar">Calendar</TabsTrigger>
        </TabsList>

        <TabsContent value="events">
          <Card>
            <CardHeader>
              <CardTitle>All SCTE-35 Events</CardTitle>
              <CardDescription>View and manage all SCTE-35 events</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {events.map((event) => (
                  <div key={event.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4">
                        {getStatusIcon(event.status)}
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <h3 className="font-medium">{event.eventId}</h3>
                            <Badge variant="outline">{event.commandType}</Badge>
                            <Badge className={`${getStatusColor(event.status)} text-white`}>
                              {event.status}
                            </Badge>
                            {event.isRecurring && (
                              <Badge variant="secondary">Recurring</Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            {event.description}
                          </p>
                          <div className="text-xs text-muted-foreground mt-2">
                            <div>Start: {formatDateTime(event.startTime)}</div>
                            {event.duration && <div>Duration: {event.duration}s</div>}
                            {event.recurringPattern && (
                              <div>Pattern: {event.recurringPattern}</div>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => duplicateEvent(event)}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setEditingEvent(event)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => deleteEvent(event.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="scheduled">
          <Card>
            <CardHeader>
              <CardTitle>Scheduled Events</CardTitle>
              <CardDescription>View upcoming scheduled events</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {events
                  .filter(event => event.status === 'SCHEDULED')
                  .map((event) => (
                    <div key={event.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          {getStatusIcon(event.status)}
                          <div>
                            <h3 className="font-medium">{event.eventId}</h3>
                            <p className="text-sm text-muted-foreground">{event.description}</p>
                            <p className="text-xs text-muted-foreground">
                              {formatDateTime(event.startTime)}
                              {event.duration && <span> • {event.duration}s</span>}
                            </p>
                          </div>
                        </div>
                        <Badge variant="outline">{event.commandType}</Badge>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recurring">
          <Card>
            <CardHeader>
              <CardTitle>Recurring Events</CardTitle>
              <CardDescription>Manage recurring SCTE-35 events</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {events
                  .filter(event => event.isRecurring)
                  .map((event) => (
                    <div key={event.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          {getStatusIcon(event.status)}
                          <div>
                            <h3 className="font-medium">{event.eventId}</h3>
                            <p className="text-sm text-muted-foreground">{event.description}</p>
                            <p className="text-xs text-muted-foreground">
                              Pattern: {event.recurringPattern}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline">{event.commandType}</Badge>
                          <Badge variant="secondary">Recurring</Badge>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="calendar">
          <Card>
            <CardHeader>
              <CardTitle>Event Calendar</CardTitle>
              <CardDescription>View events in calendar format</CardDescription>
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
                  <h3 className="font-medium mb-4">Events for {selectedDate ? selectedDate.toLocaleDateString() : 'Select a date'}</h3>
                  <div className="space-y-2">
                    {events
                      .filter(event => {
                        const eventDate = new Date(event.startTime).toDateString()
                        return eventDate === selectedDate.toDateString()
                      })
                      .map((event) => (
                        <div key={event.id} className="p-3 border rounded">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-medium">{event.eventId}</h4>
                              <p className="text-sm text-muted-foreground">{event.description}</p>
                              <p className="text-xs text-muted-foreground">
                                {new Date(event.startTime).toLocaleTimeString()}
                              </p>
                            </div>
                            <Badge variant="outline">{event.commandType}</Badge>
                          </div>
                        </div>
                      ))}
                    {events.filter(event => {
                      const eventDate = new Date(event.startTime).toDateString()
                      return eventDate === selectedDate.toDateString()
                    }).length === 0 && (
                      <p className="text-muted-foreground text-sm">No events scheduled for this date</p>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Edit Event Dialog */}
      <Dialog open={!!editingEvent} onOpenChange={() => setEditingEvent(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit SCTE-35 Event</DialogTitle>
            <DialogDescription>
              Modify the SCTE-35 event configuration
            </DialogDescription>
          </DialogHeader>
          {editingEvent && (
            <EventForm
              event={editingEvent}
              onSave={(updates) => updateEvent(editingEvent.id, updates)}
              onCancel={() => setEditingEvent(null)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}