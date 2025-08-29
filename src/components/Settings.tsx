/**
 * StreamControl - Settings Component
 * 
 * Copyright (c) 2024 Morus Broadcasting Pvt Ltd. All rights reserved.
 * This software is proprietary and confidential.
 * Unauthorized copying, distribution, or use is strictly prohibited.
 */

"use client"

import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Separator } from '@/components/ui/separator'
import { 
  Settings, 
  Monitor, 
  Database, 
  Shield, 
  Network, 
  Save, 
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Clock,
  Activity,
  Server,
  HardDrive,
  Cpu,
  Wifi,
  Globe,
  User,
  Bell,
  Palette
} from 'lucide-react'

interface SystemStatus {
  status: 'online' | 'offline' | 'warning' | 'error'
  uptime: string
  cpu: number
  memory: number
  disk: number
  network: {
    in: number
    out: number
  }
  activeConnections: number
  ffmpegProcesses: number
}

export default function Settings() {
  const [systemStatus, setSystemStatus] = useState<SystemStatus>({
    status: 'online',
    uptime: '2d 14h 32m',
    cpu: 45.2,
    memory: 67.8,
    disk: 23.1,
    network: {
      in: 1024,
      out: 2048
    },
    activeConnections: 12,
    ffmpegProcesses: 3
  })

  const [settings, setSettings] = useState({
    // General Settings
    applicationName: 'StreamControl',
    version: '1.0.0',
    autoStart: true,
    autoUpdate: false,
    theme: 'dark',
    language: 'en',
    
    // Streaming Settings
    defaultBitrate: 8000,
    defaultResolution: '1920x1080',
    defaultFps: 30,
    maxChannels: 50,
    ffmpegPath: '/usr/bin/ffmpeg',
    ffmpegThreads: 4,
    
    // Database Settings
    databaseType: 'sqlite',
    databaseUrl: 'file:./dev.db',
    maxConnections: 10,
    connectionTimeout: 30000,
    
    // Security Settings
    enableSSL: true,
    jwtSecret: 'your-jwt-secret',
    sessionTimeout: 3600,
    maxLoginAttempts: 5,
    enableTwoFactor: false,
    
    // Notification Settings
    emailNotifications: true,
    smsNotifications: false,
    webhookUrl: '',
    alertThreshold: 80,
    
    // Monitoring Settings
    logLevel: 'info',
    logRetention: 30,
    enableMetrics: true,
    metricsInterval: 60,
    healthCheckInterval: 30
  })

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const saveSettings = () => {
    // TODO: Implement settings save functionality
    console.log('Saving settings:', settings)
  }

  const refreshSystemStatus = () => {
    // TODO: Implement system status refresh
    console.log('Refreshing system status')
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'text-green-500'
      case 'warning': return 'text-yellow-500'
      case 'error': return 'text-red-500'
      default: return 'text-gray-500'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'online': return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      case 'error': return <AlertTriangle className="h-4 w-4 text-red-500" />
      default: return <Clock className="h-4 w-4 text-gray-500" />
    }
  }

  return (
    <div className="space-y-6">
      {/* System Status Overview */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Server className="h-5 w-5" />
                System Status
              </CardTitle>
              <CardDescription>Current system health and performance metrics</CardDescription>
            </div>
            <Button onClick={refreshSystemStatus} variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="flex items-center space-x-3">
              {getStatusIcon(systemStatus.status)}
              <div>
                <p className="text-sm font-medium">System Status</p>
                <Badge variant="outline" className={getStatusColor(systemStatus.status)}>
                  {systemStatus.status.toUpperCase()}
                </Badge>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Uptime</p>
                <p className="text-sm text-muted-foreground">{systemStatus.uptime}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Cpu className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">CPU Usage</p>
                <p className="text-sm text-muted-foreground">{systemStatus.cpu}%</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Activity className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Memory Usage</p>
                <p className="text-sm text-muted-foreground">{systemStatus.memory}%</p>
              </div>
            </div>
          </div>
          
          <Separator className="my-4" />
          
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="flex items-center space-x-3">
              <HardDrive className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Disk Usage</p>
                <p className="text-sm text-muted-foreground">{systemStatus.disk}%</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Wifi className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Network</p>
                <p className="text-sm text-muted-foreground">
                  ↓ {systemStatus.network.in}MB/s ↑ {systemStatus.network.out}MB/s
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Activity className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Active Connections</p>
                <p className="text-sm text-muted-foreground">{systemStatus.activeConnections}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Monitor className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">FFmpeg Processes</p>
                <p className="text-sm text-muted-foreground">{systemStatus.ffmpegProcesses}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Settings Tabs */}
      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="streaming">Streaming</TabsTrigger>
          <TabsTrigger value="database">Database</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="monitoring">Monitoring</TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                General Settings
              </CardTitle>
              <CardDescription>Basic application configuration</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="appName">Application Name</Label>
                  <Input
                    id="appName"
                    value={settings.applicationName}
                    onChange={(e) => handleSettingChange('applicationName', e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="version">Version</Label>
                  <Input
                    id="version"
                    value={settings.version}
                    disabled
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="theme">Theme</Label>
                  <Select value={settings.theme} onValueChange={(value) => handleSettingChange('theme', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="dark">Dark</SelectItem>
                      <SelectItem value="auto">Auto</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="language">Language</Label>
                  <Select value={settings.language} onValueChange={(value) => handleSettingChange('language', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Spanish</SelectItem>
                      <SelectItem value="fr">French</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="autoStart"
                  checked={settings.autoStart}
                  onCheckedChange={(checked) => handleSettingChange('autoStart', checked)}
                />
                <Label htmlFor="autoStart">Auto-start application on boot</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="autoUpdate"
                  checked={settings.autoUpdate}
                  onCheckedChange={(checked) => handleSettingChange('autoUpdate', checked)}
                />
                <Label htmlFor="autoUpdate">Enable automatic updates</Label>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Streaming Settings */}
        <TabsContent value="streaming" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Monitor className="h-5 w-5" />
                Streaming Configuration
              </CardTitle>
              <CardDescription>Configure default streaming parameters</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="defaultBitrate">Default Bitrate (kbps)</Label>
                  <Input
                    id="defaultBitrate"
                    type="number"
                    value={settings.defaultBitrate}
                    onChange={(e) => handleSettingChange('defaultBitrate', parseInt(e.target.value))}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="defaultResolution">Default Resolution</Label>
                  <Select value={settings.defaultResolution} onValueChange={(value) => handleSettingChange('defaultResolution', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="3840x2160">4K UHD (3840x2160)</SelectItem>
                      <SelectItem value="1920x1080">Full HD (1920x1080)</SelectItem>
                      <SelectItem value="1280x720">HD (1280x720)</SelectItem>
                      <SelectItem value="854x480">SD (854x480)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="defaultFps">Default Frame Rate</Label>
                  <Select value={settings.defaultFps.toString()} onValueChange={(value) => handleSettingChange('defaultFps', parseInt(value))}>
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
                
                <div className="space-y-2">
                  <Label htmlFor="maxChannels">Maximum Channels</Label>
                  <Input
                    id="maxChannels"
                    type="number"
                    value={settings.maxChannels}
                    onChange={(e) => handleSettingChange('maxChannels', parseInt(e.target.value))}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="ffmpegPath">FFmpeg Path</Label>
                  <Input
                    id="ffmpegPath"
                    value={settings.ffmpegPath}
                    onChange={(e) => handleSettingChange('ffmpegPath', e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="ffmpegThreads">FFmpeg Threads</Label>
                  <Input
                    id="ffmpegThreads"
                    type="number"
                    value={settings.ffmpegThreads}
                    onChange={(e) => handleSettingChange('ffmpegThreads', parseInt(e.target.value))}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Database Settings */}
        <TabsContent value="database" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Database Configuration
              </CardTitle>
              <CardDescription>Configure database connection and settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="databaseType">Database Type</Label>
                  <Select value={settings.databaseType} onValueChange={(value) => handleSettingChange('databaseType', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sqlite">SQLite</SelectItem>
                      <SelectItem value="postgresql">PostgreSQL</SelectItem>
                      <SelectItem value="mysql">MySQL</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="databaseUrl">Database URL</Label>
                  <Input
                    id="databaseUrl"
                    value={settings.databaseUrl}
                    onChange={(e) => handleSettingChange('databaseUrl', e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="maxConnections">Max Connections</Label>
                  <Input
                    id="maxConnections"
                    type="number"
                    value={settings.maxConnections}
                    onChange={(e) => handleSettingChange('maxConnections', parseInt(e.target.value))}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="connectionTimeout">Connection Timeout (ms)</Label>
                  <Input
                    id="connectionTimeout"
                    type="number"
                    value={settings.connectionTimeout}
                    onChange={(e) => handleSettingChange('connectionTimeout', parseInt(e.target.value))}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Settings */}
        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Security Settings
              </CardTitle>
              <CardDescription>Configure security and authentication</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="jwtSecret">JWT Secret</Label>
                  <Input
                    id="jwtSecret"
                    type="password"
                    value={settings.jwtSecret}
                    onChange={(e) => handleSettingChange('jwtSecret', e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="sessionTimeout">Session Timeout (seconds)</Label>
                  <Input
                    id="sessionTimeout"
                    type="number"
                    value={settings.sessionTimeout}
                    onChange={(e) => handleSettingChange('sessionTimeout', parseInt(e.target.value))}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="maxLoginAttempts">Max Login Attempts</Label>
                  <Input
                    id="maxLoginAttempts"
                    type="number"
                    value={settings.maxLoginAttempts}
                    onChange={(e) => handleSettingChange('maxLoginAttempts', parseInt(e.target.value))}
                  />
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="enableSSL"
                  checked={settings.enableSSL}
                  onCheckedChange={(checked) => handleSettingChange('enableSSL', checked)}
                />
                <Label htmlFor="enableSSL">Enable SSL/TLS</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="enableTwoFactor"
                  checked={settings.enableTwoFactor}
                  onCheckedChange={(checked) => handleSettingChange('enableTwoFactor', checked)}
                />
                <Label htmlFor="enableTwoFactor">Enable Two-Factor Authentication</Label>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notification Settings */}
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notification Settings
              </CardTitle>
              <CardDescription>Configure notification preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="webhookUrl">Webhook URL</Label>
                  <Input
                    id="webhookUrl"
                    value={settings.webhookUrl}
                    onChange={(e) => handleSettingChange('webhookUrl', e.target.value)}
                    placeholder="https://your-webhook-url.com"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="alertThreshold">Alert Threshold (%)</Label>
                  <Input
                    id="alertThreshold"
                    type="number"
                    value={settings.alertThreshold}
                    onChange={(e) => handleSettingChange('alertThreshold', parseInt(e.target.value))}
                  />
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="emailNotifications"
                  checked={settings.emailNotifications}
                  onCheckedChange={(checked) => handleSettingChange('emailNotifications', checked)}
                />
                <Label htmlFor="emailNotifications">Email Notifications</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="smsNotifications"
                  checked={settings.smsNotifications}
                  onCheckedChange={(checked) => handleSettingChange('smsNotifications', checked)}
                />
                <Label htmlFor="smsNotifications">SMS Notifications</Label>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Monitoring Settings */}
        <TabsContent value="monitoring" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Monitoring Configuration
              </CardTitle>
              <CardDescription>Configure monitoring and logging settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="logLevel">Log Level</Label>
                  <Select value={settings.logLevel} onValueChange={(value) => handleSettingChange('logLevel', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="debug">Debug</SelectItem>
                      <SelectItem value="info">Info</SelectItem>
                      <SelectItem value="warn">Warning</SelectItem>
                      <SelectItem value="error">Error</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="logRetention">Log Retention (days)</Label>
                  <Input
                    id="logRetention"
                    type="number"
                    value={settings.logRetention}
                    onChange={(e) => handleSettingChange('logRetention', parseInt(e.target.value))}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="metricsInterval">Metrics Interval (seconds)</Label>
                  <Input
                    id="metricsInterval"
                    type="number"
                    value={settings.metricsInterval}
                    onChange={(e) => handleSettingChange('metricsInterval', parseInt(e.target.value))}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="healthCheckInterval">Health Check Interval (seconds)</Label>
                  <Input
                    id="healthCheckInterval"
                    type="number"
                    value={settings.healthCheckInterval}
                    onChange={(e) => handleSettingChange('healthCheckInterval', parseInt(e.target.value))}
                  />
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="enableMetrics"
                  checked={settings.enableMetrics}
                  onCheckedChange={(checked) => handleSettingChange('enableMetrics', checked)}
                />
                <Label htmlFor="enableMetrics">Enable Metrics Collection</Label>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={saveSettings} className="flex items-center gap-2">
          <Save className="h-4 w-4" />
          Save Settings
        </Button>
      </div>
    </div>
  )
}
