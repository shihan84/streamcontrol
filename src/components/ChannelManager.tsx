"use client"

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Plus, 
  Edit, 
  Trash2, 
  Play, 
  Pause, 
  Square,
  Settings,
  Activity,
  Signal,
  Users,
  Clock,
  CheckCircle,
  AlertTriangle,
  Tv,
  Radio,
  Film,
  Music,
  Newspaper,
  Trophy,
  Copy,
  Save
} from 'lucide-react'

interface Channel {
  id: string
  name: string
  description: string
  inputUrl: string
  outputUrl: string
  status: 'ONLINE' | 'OFFLINE' | 'STARTING' | 'STOPPING' | 'ERROR'
  bitrate: number
  resolution: string
  fps: number
  audioChannels: number
  viewers: number
  uptime: number
  categoryId: string
  isActive: boolean
  scte35Enabled: boolean
  scte35Pid: number
  tags: string[]
  createdAt: string
  updatedAt: string
}

interface ChannelCategory {
  id: string
  name: string
  description: string
  icon: string
  color: string
}

// Channel Form Component - Moved outside to prevent recreation
const ChannelForm = React.memo(({ channel, onSave, onCancel, categories }: { 
  channel?: Channel | null
  onSave: (data: Partial<Channel>) => void
  onCancel: () => void
  categories: ChannelCategory[]
}) => {
  const [formData, setFormData] = useState(() => ({
    name: channel?.name || '',
    description: channel?.description || '',
    inputUrl: channel?.inputUrl || '',
    outputUrl: channel?.outputUrl || '',
    bitrate: channel?.bitrate || 8000,
    resolution: channel?.resolution || '1920x1080',
    fps: channel?.fps || 30,
    audioChannels: channel?.audioChannels || 2,
    categoryId: channel?.categoryId || '1',
    isActive: channel?.isActive ?? true,
    scte35Enabled: channel?.scte35Enabled ?? true,
    scte35Pid: channel?.scte35Pid || 500
  }))

  // Update form data when channel prop changes
  useEffect(() => {
    setFormData({
      name: channel?.name || '',
      description: channel?.description || '',
      inputUrl: channel?.inputUrl || '',
      outputUrl: channel?.outputUrl || '',
      bitrate: channel?.bitrate || 8000,
      resolution: channel?.resolution || '1920x1080',
      fps: channel?.fps || 30,
      audioChannels: channel?.audioChannels || 2,
      categoryId: channel?.categoryId || '1',
      isActive: channel?.isActive ?? true,
      scte35Enabled: channel?.scte35Enabled ?? true,
      scte35Pid: channel?.scte35Pid || 500
    })
  }, [channel])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Form submitted with data:', formData)
    onSave(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-h-96 overflow-y-auto">
      {/* Basic Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Basic Information</h3>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="name">Channel Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              placeholder="Channel name"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select value={formData.categoryId} onValueChange={(value) => setFormData({...formData, categoryId: value})}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
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
            placeholder="Channel description"
            rows={3}
          />
        </div>
      </div>

      {/* Stream Configuration */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Stream Configuration</h3>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="inputUrl">Input URL</Label>
            <Input
              id="inputUrl"
              value={formData.inputUrl}
              onChange={(e) => setFormData({...formData, inputUrl: e.target.value})}
              placeholder="srt://source:9000"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="outputUrl">Output URL</Label>
            <Input
              id="outputUrl"
              value={formData.outputUrl}
              onChange={(e) => setFormData({...formData, outputUrl: e.target.value})}
              placeholder="srt://cdn:1234"
              required
            />
          </div>
        </div>
      </div>

      {/* Video Configuration */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Video Configuration</h3>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="resolution">Resolution</Label>
            <Select value={formData.resolution} onValueChange={(value) => setFormData({...formData, resolution: value})}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="3840x2160">3840x2160 (4K UHD)</SelectItem>
                <SelectItem value="1920x1080">1920x1080 (Full HD)</SelectItem>
                <SelectItem value="1280x720">1280x720 (HD)</SelectItem>
                <SelectItem value="854x480">854x480 (SD)</SelectItem>
                <SelectItem value="640x360">640x360 (nHD)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="bitrate">Bitrate (kbps)</Label>
            <Input
              id="bitrate"
              type="number"
              value={formData.bitrate}
              onChange={(e) => setFormData({...formData, bitrate: parseInt(e.target.value) || 0})}
              min="500"
              max="50000"
              placeholder="8000"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="fps">Frame Rate (FPS)</Label>
            <Select value={formData.fps.toString()} onValueChange={(value) => setFormData({...formData, fps: parseInt(value)})}>
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
          <Label htmlFor="audioChannels">Audio Channels</Label>
          <Select value={formData.audioChannels.toString()} onValueChange={(value) => setFormData({...formData, audioChannels: parseInt(value)})}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">Mono (1.0)</SelectItem>
              <SelectItem value="2">Stereo (2.0)</SelectItem>
              <SelectItem value="6">Surround (5.1)</SelectItem>
              <SelectItem value="8">Surround (7.1)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* SCTE-35 Configuration */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">SCTE-35 Configuration</h3>
        <div className="flex items-center space-x-2">
          <Switch
            id="scte35Enabled"
            checked={formData.scte35Enabled}
            onCheckedChange={(checked) => setFormData({...formData, scte35Enabled: checked})}
          />
          <Label htmlFor="scte35Enabled">Enable SCTE-35</Label>
        </div>
        {formData.scte35Enabled && (
          <div className="space-y-2">
            <Label htmlFor="scte35Pid">SCTE-35 PID</Label>
            <Input
              id="scte35Pid"
              type="number"
              value={formData.scte35Pid}
              onChange={(e) => setFormData({...formData, scte35Pid: parseInt(e.target.value) || 500})}
              min="16"
              max="8190"
              placeholder="500"
            />
          </div>
        )}
      </div>

      {/* Status Configuration */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Status Configuration</h3>
        <div className="flex items-center space-x-2">
          <Switch
            id="isActive"
            checked={formData.isActive}
            onCheckedChange={(checked) => setFormData({...formData, isActive: checked})}
          />
          <Label htmlFor="isActive">Channel Active</Label>
        </div>
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          <Save className="h-4 w-4 mr-2" />
          {channel ? 'Update Channel' : 'Create Channel'}
        </Button>
      </div>
    </form>
  )
})

interface ChannelManagerProps {
  onChannelCreate?: (channel: Channel) => void
  onChannelUpdate?: (channel: Channel) => void
  onChannelDelete?: (channelId: string) => void
  onChannelStart?: (channelId: string) => void
  onChannelStop?: (channelId: string) => void
}

export default function ChannelManager({ 
  onChannelCreate, 
  onChannelUpdate, 
  onChannelDelete,
  onChannelStart,
  onChannelStop
}: ChannelManagerProps) {
  const [channels, setChannels] = useState<Channel[]>([])
  const [categories, setCategories] = useState<ChannelCategory[]>([])
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [editingChannel, setEditingChannel] = useState<Channel | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [isClient, setIsClient] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  // Initialize client-side
  useEffect(() => {
    setIsClient(true)
    
    // Default channel categories
    const defaultCategories: ChannelCategory[] = [
      { id: '1', name: 'General Entertainment', description: 'General entertainment channels', icon: 'Tv', color: 'bg-blue-100 text-blue-800' },
      { id: '2', name: 'Sports', description: 'Sports and live events', icon: 'Trophy', color: 'bg-green-100 text-green-800' },
      { id: '3', name: 'News', description: 'News and information channels', icon: 'Newspaper', color: 'bg-red-100 text-red-800' },
      { id: '4', name: 'Music', description: 'Music and audio channels', icon: 'Music', color: 'bg-purple-100 text-purple-800' },
      { id: '5', name: 'Movies', description: 'Movie and film channels', icon: 'Film', color: 'bg-orange-100 text-orange-800' },
      { id: '6', name: 'Radio', description: 'Radio broadcast channels', icon: 'Radio', color: 'bg-yellow-100 text-yellow-800' }
    ]

    // Default channels
    const defaultChannels: Channel[] = [
      {
        id: '1',
        name: 'Main Channel HD',
        description: 'Primary high-definition entertainment channel',
        inputUrl: 'srt://source:9000',
        outputUrl: 'srt://cdn:1234',
        status: 'ONLINE',
        bitrate: 8000,
        resolution: '1920x1080',
        fps: 30,
        audioChannels: 2,
        viewers: 1250,
        uptime: 9120,
        categoryId: '1',
        isActive: true,
        scte35Enabled: true,
        scte35Pid: 500,
        tags: ['hd', 'entertainment', 'primary'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: '2',
        name: 'Sports Network',
        description: '24/7 sports coverage and live events',
        inputUrl: 'srt://sports:9001',
        outputUrl: 'srt://cdn:1235',
        status: 'OFFLINE',
        bitrate: 10000,
        resolution: '1920x1080',
        fps: 60,
        audioChannels: 6,
        viewers: 0,
        uptime: 0,
        categoryId: '2',
        isActive: true,
        scte35Enabled: true,
        scte35Pid: 501,
        tags: ['sports', 'live', 'hd'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: '3',
        name: 'News Channel 24',
        description: 'Round-the-clock news and current affairs',
        inputUrl: 'srt://news:9002',
        outputUrl: 'srt://cdn:1236',
        status: 'ONLINE',
        bitrate: 6000,
        resolution: '1280x720',
        fps: 30,
        audioChannels: 2,
        viewers: 850,
        uptime: 14400,
        categoryId: '3',
        isActive: true,
        scte35Enabled: true,
        scte35Pid: 502,
        tags: ['news', '24/7', 'current-affairs'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ]

    setCategories(defaultCategories)
    setChannels(defaultChannels)
    setSelectedCategory('all')

    // Simulate real-time updates
    const interval = setInterval(() => {
      setChannels(prevChannels => 
        prevChannels.map(channel => {
          if (channel.status === 'ONLINE') {
            return {
              ...channel,
              viewers: Math.max(0, channel.viewers + Math.floor(Math.random() * 10) - 5),
              uptime: channel.uptime + 1,
              bitrate: Math.max(7000, Math.min(12000, channel.bitrate + Math.floor(Math.random() * 200) - 100))
            }
          }
          return channel
        })
      )
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const createChannel = (channelData: Partial<Channel>) => {
    console.log('Creating channel with data:', channelData)
    
    const now = new Date()
    const newChannel: Channel = {
      id: Date.now().toString(),
      name: channelData.name || '',
      description: channelData.description || '',
      inputUrl: channelData.inputUrl || '',
      outputUrl: channelData.outputUrl || '',
      status: 'OFFLINE',
      bitrate: channelData.bitrate || 8000,
      resolution: channelData.resolution || '1920x1080',
      fps: channelData.fps || 30,
      audioChannels: channelData.audioChannels || 2,
      viewers: 0,
      uptime: 0,
      categoryId: channelData.categoryId || '1',
      isActive: channelData.isActive ?? true,
      scte35Enabled: channelData.scte35Enabled ?? true,
      scte35Pid: channelData.scte35Pid || 500,
      tags: channelData.tags || [],
      createdAt: now.toISOString(),
      updatedAt: now.toISOString()
    }
    
    console.log('New channel created:', newChannel)
    setChannels(prevChannels => [...prevChannels, newChannel])
    setIsCreateDialogOpen(false)
    
    if (onChannelCreate) {
      onChannelCreate(newChannel)
    }
  }

  const updateChannel = (channelId: string, updates: Partial<Channel>) => {
    const updatedChannels = channels.map(channel =>
      channel.id === channelId
        ? { ...channel, ...updates, updatedAt: new Date().toISOString() }
        : channel
    )
    setChannels(updatedChannels)
    setEditingChannel(null)
    
    if (onChannelUpdate) {
      const updatedChannel = updatedChannels.find(c => c.id === channelId)
      if (updatedChannel) {
        onChannelUpdate(updatedChannel)
      }
    }
  }

  const deleteChannel = (channelId: string) => {
    setChannels(channels.filter(c => c.id !== channelId))
    
    if (onChannelDelete) {
      onChannelDelete(channelId)
    }
  }

  const startChannel = (channelId: string) => {
    setChannels(channels.map(channel =>
      channel.id === channelId
        ? { ...channel, status: 'STARTING' as const }
        : channel
    ))
    
    // Simulate channel starting
    setTimeout(() => {
      setChannels(prevChannels => 
        prevChannels.map(channel =>
          channel.id === channelId
            ? { ...channel, status: 'ONLINE' as const, viewers: Math.floor(Math.random() * 1000) + 100 }
            : channel
        )
      )
    }, 2000)
    
    if (onChannelStart) {
      onChannelStart(channelId)
    }
  }

  const stopChannel = (channelId: string) => {
    setChannels(channels.map(channel =>
      channel.id === channelId
        ? { ...channel, status: 'STOPPING' as const }
        : channel
    ))
    
    // Simulate channel stopping
    setTimeout(() => {
      setChannels(prevChannels => 
        prevChannels.map(channel =>
          channel.id === channelId
            ? { ...channel, status: 'OFFLINE' as const, viewers: 0, uptime: 0 }
            : channel
        )
      )
    }, 1000)
    
    if (onChannelStop) {
      onChannelStop(channelId)
    }
  }

  const duplicateChannel = (channel: Channel) => {
    const now = new Date()
    const newChannel = {
      ...channel,
      id: Date.now().toString(),
      name: `${channel.name} (Copy)`,
      inputUrl: `${channel.inputUrl}-copy`,
      outputUrl: `${channel.outputUrl}-copy`,
      status: 'OFFLINE' as const,
      viewers: 0,
      uptime: 0,
      createdAt: now.toISOString(),
      updatedAt: now.toISOString()
    }
    setChannels([...channels, newChannel])
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ONLINE': return 'bg-green-500'
      case 'OFFLINE': return 'bg-gray-500'
      case 'STARTING': return 'bg-yellow-500'
      case 'STOPPING': return 'bg-orange-500'
      case 'ERROR': return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ONLINE':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'OFFLINE':
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
    if (seconds === 0) return '0m'
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`
  }

  const formatBitrate = (bitrate: number) => {
    if (bitrate >= 1000) {
      return `${(bitrate / 1000).toFixed(1)} Mbps`
    }
    return `${bitrate} kbps`
  }

  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'Tv': return <Tv className="h-4 w-4" />
      case 'Trophy': return <Trophy className="h-4 w-4" />
      case 'Newspaper': return <Newspaper className="h-4 w-4" />
      case 'Music': return <Music className="h-4 w-4" />
      case 'Film': return <Film className="h-4 w-4" />
      case 'Radio': return <Radio className="h-4 w-4" />
      default: return <Tv className="h-4 w-4" />
    }
  }

  // Filter channels based on search term and category
  const filteredChannels = channels.filter(channel => {
    const matchesSearch = channel.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         channel.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || selectedCategory === '' || channel.categoryId === selectedCategory
    return matchesSearch && matchesCategory
  })

  if (!isClient) {
    return <div className="p-8 text-center">Loading Channel Manager...</div>
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <Settings className="h-5 w-5" />
                <span>Channel Management</span>
              </CardTitle>
              <CardDescription>
                Create, configure, and manage your streaming channels
              </CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="flex items-center space-x-2">
                <span>{channels.length} Channels</span>
              </Badge>
              <Badge variant="outline" className="flex items-center space-x-2">
                <span>{channels.filter(c => c.status === 'ONLINE').length} Online</span>
              </Badge>
              <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={() => console.log('Add Channel button clicked')}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Channel
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[90vh]">
                  <DialogHeader>
                    <DialogTitle>Create New Channel</DialogTitle>
                    <DialogDescription>
                      Configure a new streaming channel with broadcast settings
                    </DialogDescription>
                  </DialogHeader>
                  <ChannelForm
                    categories={categories}
                    onSave={(data) => {
                      console.log('ChannelForm onSave called with:', data)
                      createChannel(data)
                    }}
                    onCancel={() => {
                      console.log('ChannelForm onCancel called')
                      setIsCreateDialogOpen(false)
                    }}
                  />
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Channel Statistics */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Channels</CardTitle>
            <Settings className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{channels.length}</div>
            <p className="text-xs text-muted-foreground">Configured channels</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Online Channels</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{channels.filter(c => c.status === 'ONLINE').length}</div>
            <p className="text-xs text-muted-foreground">Currently streaming</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Viewers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {channels.reduce((sum, channel) => sum + channel.viewers, 0).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">Across all channels</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">SCTE-35 Enabled</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{channels.filter(c => c.scte35Enabled).length}</div>
            <p className="text-xs text-muted-foreground">SCTE-35 active channels</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter Controls */}
      <Card>
        <CardHeader>
          <CardTitle>Channel Controls</CardTitle>
          <CardDescription>Search and filter your channels</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <div className="space-y-2">
              <Label htmlFor="search">Search Channels</Label>
              <Input
                id="search"
                placeholder="Search by name or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full md:w-80"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Filter by Category</Label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Channel List */}
      <Card>
        <CardHeader>
          <CardTitle>Channels</CardTitle>
          <CardDescription>
            Manage your streaming channels and monitor their status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredChannels.length === 0 ? (
              <div className="text-center py-8">
                <Tv className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-muted-foreground">No channels found</h3>
                <p className="text-sm text-muted-foreground">
                  {searchTerm || selectedCategory !== '' 
                    ? 'Try adjusting your search or filter criteria' 
                    : 'Create your first channel to get started'}
                </p>
              </div>
            ) : (
              filteredChannels.map((channel) => {
                const category = categories.find(c => c.id === channel.categoryId)
                return (
                  <div key={channel.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4">
                        <div className="flex items-center space-x-2 mt-1">
                          {getStatusIcon(channel.status)}
                          <div>
                            <h3 className="font-medium">{channel.name}</h3>
                            <p className="text-sm text-muted-foreground">{channel.description}</p>
                            <div className="flex items-center space-x-4 mt-2 text-xs text-muted-foreground">
                              <span className="flex items-center space-x-1">
                                {getCategoryIcon(category?.icon || 'Tv')}
                                <span>{category?.name}</span>
                              </span>
                              <span className="flex items-center space-x-1">
                                <span>Input:</span>
                                <span className="font-mono">{channel.inputUrl}</span>
                              </span>
                              <span className="flex items-center space-x-1">
                                <span>Output:</span>
                                <span className="font-mono">{channel.outputUrl}</span>
                              </span>
                            </div>
                            <div className="flex items-center space-x-4 mt-2 text-xs text-muted-foreground">
                              <span className="flex items-center space-x-1">
                                <span>Resolution:</span>
                                <Badge variant="outline" className="text-xs">
                                  {channel.resolution}
                                </Badge>
                              </span>
                              <span className="flex items-center space-x-1">
                                <span>Bitrate:</span>
                                <Badge variant="outline" className="text-xs">
                                  {formatBitrate(channel.bitrate)}
                                </Badge>
                              </span>
                              <span className="flex items-center space-x-1">
                                <span>FPS:</span>
                                <Badge variant="outline" className="text-xs">
                                  {channel.fps}
                                </Badge>
                              </span>
                              <span className="flex items-center space-x-1">
                                <span>Audio:</span>
                                <Badge variant="outline" className="text-xs">
                                  {channel.audioChannels}ch
                                </Badge>
                              </span>
                            </div>
                            <div className="flex items-center space-x-4 mt-2 text-xs text-muted-foreground">
                              <span className="flex items-center space-x-1">
                                <span>Viewers:</span>
                                <Badge variant="outline" className="text-xs">
                                  {channel.viewers.toLocaleString()}
                                </Badge>
                              </span>
                              <span className="flex items-center space-x-1">
                                <span>Uptime:</span>
                                <Badge variant="outline" className="text-xs">
                                  {formatUptime(channel.uptime)}
                                </Badge>
                              </span>
                              {channel.scte35Enabled && (
                                <span className="flex items-center space-x-1">
                                  <span>SCTE-35:</span>
                                  <Badge variant="outline" className="text-xs">
                                    PID {channel.scte35Pid}
                                  </Badge>
                                </span>
                              )}
                            </div>
                            <div className="flex items-center space-x-2 mt-2">
                              {channel.tags?.map((tag, index) => (
                                <Badge key={index} variant="secondary" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                              {channel.isActive ? (
                                <Badge variant="default" className="text-xs">Active</Badge>
                              ) : (
                                <Badge variant="secondary" className="text-xs">Inactive</Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="flex items-center space-x-1">
                          <div className={`h-3 w-3 rounded-full ${getStatusColor(channel.status)}`} />
                          <Badge variant="outline">{channel.status}</Badge>
                        </div>
                        <div className="flex space-x-1">
                          {channel.status === 'OFFLINE' && (
                            <Button
                              size="sm"
                              onClick={() => startChannel(channel.id)}
                            >
                              <Play className="h-4 w-4" />
                            </Button>
                          )}
                          {channel.status === 'ONLINE' && (
                            <Button
                              size="sm"
                              onClick={() => stopChannel(channel.id)}
                            >
                              <Pause className="h-4 w-4" />
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setEditingChannel(channel)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => duplicateChannel(channel)}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => deleteChannel(channel.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </CardContent>
      </Card>

      {/* Edit Channel Dialog */}
      <Dialog open={!!editingChannel} onOpenChange={() => setEditingChannel(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>Edit Channel</DialogTitle>
            <DialogDescription>
              Modify channel configuration and settings
            </DialogDescription>
          </DialogHeader>
          {editingChannel && (
            <ChannelForm
              channel={editingChannel}
              categories={categories}
              onSave={(updates) => updateChannel(editingChannel.id, updates)}
              onCancel={() => setEditingChannel(null)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
