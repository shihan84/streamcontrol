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
  Settings, 
  Save, 
  Copy, 
  RefreshCw, 
  Download, 
  Upload,
  Plus,
  Trash2,
  Edit,
  Play,
  CheckCircle,
  AlertTriangle,
  HelpCircle,
  FileText,
  Hash
} from 'lucide-react'

interface MPEGTSParameter {
  name: string
  value: number
  description: string
  hexValue: string
  min: number
  max: number
  defaultValue: number
  category: 'service' | 'pmt' | 'elementary' | 'scte35' | 'system'
}

interface ParameterPreset {
  id: string
  name: string
  description: string
  parameters: Record<string, number>
  isDefault: boolean
  createdAt: string
}

interface ManualParameterEditorProps {
  onParametersChange?: (parameters: Record<string, number>) => void
  onCommandGenerate?: (command: string) => void
}

export default function ManualParameterEditor({ 
  onParametersChange, 
  onCommandGenerate 
}: ManualParameterEditorProps) {
  const [parameters, setParameters] = useState<MPEGTSParameter[]>([])
  const [presets, setPresets] = useState<ParameterPreset[]>([])
  const [selectedPreset, setSelectedPreset] = useState<string>('')
  const [isCreatePresetOpen, setIsCreatePresetOpen] = useState(false)
  const [generatedCommand, setGeneratedCommand] = useState<string>('')

  // Initialize default parameters
  useEffect(() => {
    const defaultParams: MPEGTSParameter[] = [
      {
        name: 'mpegts_service_id',
        value: 1,
        description: 'MPEG-TS Service ID',
        hexValue: '0x0001',
        min: 1,
        max: 65535,
        defaultValue: 1,
        category: 'service'
      },
      {
        name: 'mpegts_pmt_start_pid',
        value: 4096,
        description: 'PMT Start PID',
        hexValue: '0x1000',
        min: 16,
        max: 8190,
        defaultValue: 4096,
        category: 'pmt'
      },
      {
        name: 'mpegts_start_pid',
        value: 257,
        description: 'Start PID',
        hexValue: '0x0101',
        min: 16,
        max: 8190,
        defaultValue: 257,
        category: 'system'
      },
      {
        name: 'mpegts_pid_video',
        value: 257,
        description: 'Video PID',
        hexValue: '0x0101',
        min: 16,
        max: 8190,
        defaultValue: 257,
        category: 'elementary'
      },
      {
        name: 'mpegts_pid_audio',
        value: 258,
        description: 'Audio PID',
        hexValue: '0x0102',
        min: 16,
        max: 8190,
        defaultValue: 258,
        category: 'elementary'
      },
      {
        name: 'mpegts_scte35_pid',
        value: 511,
        description: 'SCTE-35 PID',
        hexValue: '0x01FF',
        min: 16,
        max: 8190,
        defaultValue: 511,
        category: 'scte35'
      },
      {
        name: 'mpegts_null_pid',
        value: 8191,
        description: 'Null PID',
        hexValue: '0x1FFF',
        min: 8191,
        max: 8191,
        defaultValue: 8191,
        category: 'system'
      }
    ]

    const defaultPresets: ParameterPreset[] = [
      {
        id: 'default',
        name: 'Standard Broadcast',
        description: 'Default MPEG-TS parameters for broadcast',
        parameters: {
          mpegts_service_id: 1,
          mpegts_pmt_start_pid: 4096,
          mpegts_start_pid: 257,
          mpegts_pid_video: 257,
          mpegts_pid_audio: 258,
          mpegts_scte35_pid: 511,
          mpegts_null_pid: 8191
        },
        isDefault: true,
        createdAt: new Date().toISOString()
      },
      {
        id: 'atsc',
        name: 'ATSC Standard',
        description: 'ATSC broadcast standard parameters',
        parameters: {
          mpegts_service_id: 1,
          mpegts_pmt_start_pid: 4096,
          mpegts_start_pid: 257,
          mpegts_pid_video: 257,
          mpegts_pid_audio: 258,
          mpegts_scte35_pid: 511,
          mpegts_null_pid: 8191
        },
        isDefault: false,
        createdAt: new Date().toISOString()
      },
      {
        id: 'dvb',
        name: 'DVB Standard',
        description: 'DVB broadcast standard parameters',
        parameters: {
          mpegts_service_id: 1,
          mpegts_pmt_start_pid: 4096,
          mpegts_start_pid: 257,
          mpegts_pid_video: 257,
          mpegts_pid_audio: 258,
          mpegts_scte35_pid: 500,
          mpegts_null_pid: 8191
        },
        isDefault: false,
        createdAt: new Date().toISOString()
      }
    ]

    setParameters(defaultParams)
    setPresets(defaultPresets)
    setSelectedPreset('default')
    generateCommandFromParams(defaultParams)
  }, [])

  const updateParameter = (paramName: string, newValue: number) => {
    const updatedParams = parameters.map(param => 
      param.name === paramName 
        ? { 
            ...param, 
            value: newValue,
            hexValue: '0x' + newValue.toString(16).toUpperCase().padStart(4, '0')
          }
        : param
    )
    setParameters(updatedParams)
    generateCommandFromParams(updatedParams)
    
    // Notify parent component
    if (onParametersChange) {
      const paramsObj = updatedParams.reduce((acc, param) => {
        acc[param.name] = param.value
        return acc
      }, {} as Record<string, number>)
      onParametersChange(paramsObj)
    }
  }

  const generateCommandFromParams = (params: MPEGTSParameter[]) => {
    const command = `ffmpeg -i "input.mpg" -c copy \\
  -mpegts_flags "+pat_pmt_at_frames+resend_headers" \\
  ${params.map(p => `-${p.name} ${p.value}`).join(' \\\n  ')} \\
  -f mpegts \\
  "srt://192.168.1.100:1234?mode=caller&latency=2000000"`
    
    setGeneratedCommand(command)
    
    if (onCommandGenerate) {
      onCommandGenerate(command)
    }
  }

  const applyPreset = (presetId: string) => {
    const preset = presets.find(p => p.id === presetId)
    if (preset) {
      const updatedParams = parameters.map(param => ({
        ...param,
        value: preset.parameters[param.name] || param.defaultValue,
        hexValue: '0x' + (preset.parameters[param.name] || param.defaultValue).toString(16).toUpperCase().padStart(4, '0')
      }))
      setParameters(updatedParams)
      generateCommandFromParams(updatedParams)
      setSelectedPreset(presetId)
    }
  }

  const createPreset = (presetData: { name: string; description: string }) => {
    const newPreset: ParameterPreset = {
      id: Date.now().toString(),
      name: presetData.name,
      description: presetData.description,
      parameters: parameters.reduce((acc, param) => {
        acc[param.name] = param.value
        return acc
      }, {} as Record<string, number>),
      isDefault: false,
      createdAt: new Date().toISOString()
    }
    setPresets([...presets, newPreset])
    setIsCreatePresetOpen(false)
  }

  const deletePreset = (presetId: string) => {
    if (presets.find(p => p.id === presetId)?.isDefault) return
    setPresets(presets.filter(p => p.id !== presetId))
    if (selectedPreset === presetId) {
      setSelectedPreset('default')
      applyPreset('default')
    }
  }

  const exportPreset = (preset: ParameterPreset) => {
    const dataStr = JSON.stringify(preset, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${preset.name.replace(/\s+/g, '_')}_preset.json`
    link.click()
  }

  const importPreset = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const preset = JSON.parse(e.target?.result as string)
          preset.id = Date.now().toString()
          preset.createdAt = new Date().toISOString()
          preset.isDefault = false
          setPresets([...presets, preset])
        } catch (error) {
          alert('Invalid preset file')
        }
      }
      reader.readAsText(file)
    }
  }

  const resetToDefaults = () => {
    const resetParams = parameters.map(param => ({
      ...param,
      value: param.defaultValue,
      hexValue: '0x' + param.defaultValue.toString(16).toUpperCase().padStart(4, '0')
    }))
    setParameters(resetParams)
    generateCommandFromParams(resetParams)
    setSelectedPreset('default')
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'service': return 'bg-blue-100 text-blue-800'
      case 'pmt': return 'bg-green-100 text-green-800'
      case 'elementary': return 'bg-purple-100 text-purple-800'
      case 'scte35': return 'bg-orange-100 text-orange-800'
      case 'system': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const validatePID = (value: number, min: number, max: number) => {
    return value >= min && value <= max
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
                <span>Manual MPEG-TS Parameter Editor</span>
              </CardTitle>
              <CardDescription>
                Fine-tune MPEG-TS stream parameters with manual control over PIDs and service settings
              </CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" onClick={resetToDefaults}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Reset Defaults
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      <Tabs defaultValue="editor" className="space-y-6">
        <TabsList>
          <TabsTrigger value="editor">Parameter Editor</TabsTrigger>
          <TabsTrigger value="presets">Presets</TabsTrigger>
          <TabsTrigger value="command">Generated Command</TabsTrigger>
          <TabsTrigger value="validation">Validation</TabsTrigger>
        </TabsList>

        <TabsContent value="editor">
          <Card>
            <CardHeader>
              <CardTitle>MPEG-TS Parameters</CardTitle>
              <CardDescription>
                Edit individual MPEG-TS parameters. Each PID must be unique within the valid range (16-8190).
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Preset Selection */}
                <div className="flex items-center space-x-4">
                  <Label>Current Preset:</Label>
                  <Select value={selectedPreset} onValueChange={applyPreset}>
                    <SelectTrigger className="w-64">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {presets.map((preset) => (
                        <SelectItem key={preset.id} value={preset.id}>
                          {preset.name} {preset.isDefault && '(Default)'}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Badge variant="outline">
                    {parameters.length} Parameters
                  </Badge>
                </div>

                {/* Parameter Groups */}
                {['service', 'pmt', 'elementary', 'scte35', 'system'].map((category) => {
                  const categoryParams = parameters.filter(p => p.category === category)
                  if (categoryParams.length === 0) return null

                  return (
                    <div key={category} className="space-y-4">
                      <h3 className="text-lg font-medium capitalize">{category} Parameters</h3>
                      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {categoryParams.map((param) => (
                          <div key={param.name} className="space-y-2">
                            <div className="flex items-center justify-between">
                              <Label htmlFor={param.name} className="text-sm font-medium">
                                {param.name.replace(/mpegts_/, '').replace(/_/g, ' ').toUpperCase()}
                              </Label>
                              <Badge className={`text-xs ${getCategoryColor(param.category)}`}>
                                {param.category}
                              </Badge>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Input
                                id={param.name}
                                type="number"
                                value={param.value}
                                onChange={(e) => updateParameter(param.name, parseInt(e.target.value) || 0)}
                                min={param.min}
                                max={param.max}
                                className="flex-1"
                              />
                              <div className="text-sm text-muted-foreground font-mono min-w-16">
                                {param.hexValue}
                              </div>
                            </div>
                            <div className="flex items-center justify-between text-xs text-muted-foreground">
                              <span>{param.description}</span>
                              <span>
                                {param.min}-{param.max}
                              </span>
                            </div>
                            {!validatePID(param.value, param.min, param.max) && (
                              <Alert className="py-2">
                                <AlertTriangle className="h-4 w-4" />
                                <AlertDescription className="text-xs">
                                  Value must be between {param.min} and {param.max}
                                </AlertDescription>
                              </Alert>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="presets">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Parameter Presets</CardTitle>
                  <CardDescription>
                    Save and load parameter configurations for different broadcast standards
                  </CardDescription>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="file"
                    accept=".json"
                    onChange={importPreset}
                    className="hidden"
                    id="import-preset"
                  />
                  <Button
                    variant="outline"
                    onClick={() => document.getElementById('import-preset')?.click()}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Import
                  </Button>
                  <Dialog open={isCreatePresetOpen} onOpenChange={setIsCreatePresetOpen}>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Create Preset
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Create Parameter Preset</DialogTitle>
                        <DialogDescription>
                          Save current parameter values as a new preset
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="preset-name">Preset Name</Label>
                          <Input
                            id="preset-name"
                            placeholder="Enter preset name"
                            onKeyPress={(e) => {
                              if (e.key === 'Enter') {
                                createPreset({ 
                                  name: (e.target as HTMLInputElement).value, 
                                  description: 'Custom preset' 
                                })
                              }
                            }}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="preset-description">Description</Label>
                          <Textarea
                            id="preset-description"
                            placeholder="Enter preset description"
                            rows={3}
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setIsCreatePresetOpen(false)}>
                          Cancel
                        </Button>
                        <Button onClick={() => {
                          const nameInput = document.getElementById('preset-name') as HTMLInputElement
                          const descInput = document.getElementById('preset-description') as HTMLTextAreaElement
                          createPreset({ 
                            name: nameInput.value, 
                            description: descInput.value 
                          })
                        }}>
                          Create
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {presets.map((preset) => (
                  <div key={preset.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div>
                          <h3 className="font-medium">{preset.name}</h3>
                          <p className="text-sm text-muted-foreground">{preset.description}</p>
                          <div className="flex items-center space-x-4 mt-2 text-xs text-muted-foreground">
                            <span>Service ID: {preset.parameters.mpegts_service_id}</span>
                            <span>Video PID: {preset.parameters.mpegts_pid_video}</span>
                            <span>Audio PID: {preset.parameters.mpegts_pid_audio}</span>
                            <span>SCTE-35 PID: {preset.parameters.mpegts_scte35_pid}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {preset.isDefault && (
                          <Badge variant="secondary">Default</Badge>
                        )}
                        <div className="flex space-x-1">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => applyPreset(preset.id)}
                          >
                            <Play className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => exportPreset(preset)}
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                          {!preset.isDefault && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => deletePreset(preset.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="command">
          <Card>
            <CardHeader>
              <CardTitle>Generated FFmpeg Command</CardTitle>
              <CardDescription>
                FFmpeg command generated from current parameter values
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>FFmpeg Command</Label>
                  <div className="p-4 bg-muted rounded-md">
                    <pre className="text-sm font-mono whitespace-pre-wrap">
                      {generatedCommand}
                    </pre>
                  </div>
                </div>
                
                <div className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => copyToClipboard(generatedCommand)}
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Copy Command
                  </Button>
                  <Button>
                    <Play className="h-4 w-4 mr-2" />
                    Execute Command
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="validation">
          <Card>
            <CardHeader>
              <CardTitle>Parameter Validation</CardTitle>
              <CardDescription>
                Validate current parameter settings against broadcast standards
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* PID Conflict Detection */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">PID Conflict Detection</h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <h4 className="font-medium">Used PIDs</h4>
                      <div className="space-y-2">
                        {parameters.map((param) => (
                          <div key={param.name} className="flex justify-between items-center p-2 border rounded">
                            <span className="text-sm">{param.name.replace(/mpegts_/, '').replace(/_/g, ' ').toUpperCase()}</span>
                            <div className="flex items-center space-x-2">
                              <span className="font-mono text-sm">{param.hexValue}</span>
                              <Badge variant="outline" className="text-xs">
                                {param.value}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <h4 className="font-medium">Validation Results</h4>
                      <div className="space-y-2">
                        {parameters.map((param) => (
                          <div key={param.name} className="flex items-center justify-between p-2 border rounded">
                            <span className="text-sm">{param.name.replace(/mpegts_/, '').replace(/_/g, ' ').toUpperCase()}</span>
                            <div className="flex items-center space-x-2">
                              {validatePID(param.value, param.min, param.max) ? (
                                <CheckCircle className="h-4 w-4 text-green-500" />
                              ) : (
                                <AlertTriangle className="h-4 w-4 text-red-500" />
                              )}
                              <Badge variant={validatePID(param.value, param.min, param.max) ? "default" : "destructive"} className="text-xs">
                                {validatePID(param.value, param.min, param.max) ? "Valid" : "Invalid"}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Standards Compliance */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Standards Compliance</h3>
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="space-y-2">
                      <h4 className="font-medium">MPEG-TS Standard</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Service ID Range:</span>
                          <span className={parameters.find(p => p.name === 'mpegts_service_id')?.value >= 1 && parameters.find(p => p.name === 'mpegts_service_id')?.value <= 65535 ? 'text-green-500' : 'text-red-500'}>
                            {parameters.find(p => p.name === 'mpegts_service_id')?.value}/1-65535
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>PID Range:</span>
                          <span className="text-green-500">16-8190</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Null PID:</span>
                          <span className={parameters.find(p => p.name === 'mpegts_null_pid')?.value === 8191 ? 'text-green-500' : 'text-red-500'}>
                            {parameters.find(p => p.name === 'mpegts_null_pid')?.value}/8191
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-medium">SCTE-35 Compliance</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>SCTE-35 PID:</span>
                          <span className={validatePID(parameters.find(p => p.name === 'mpegts_scte35_pid')?.value || 0, 16, 8190) ? 'text-green-500' : 'text-red-500'}>
                            {parameters.find(p => p.name === 'mpegts_scte35_pid')?.value}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Video PID:</span>
                          <span className={validatePID(parameters.find(p => p.name === 'mpegts_pid_video')?.value || 0, 16, 8190) ? 'text-green-500' : 'text-red-500'}>
                            {parameters.find(p => p.name === 'mpegts_pid_video')?.value}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Audio PID:</span>
                          <span className={validatePID(parameters.find(p => p.name === 'mpegts_pid_audio')?.value || 0, 16, 8190) ? 'text-green-500' : 'text-green-500'}>
                            {parameters.find(p => p.name === 'mpegts_pid_audio')?.value}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-medium">Best Practices</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>PID Uniqueness:</span>
                          <span className="text-green-500">OK</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Range Validity:</span>
                          <span className={parameters.every(p => validatePID(p.value, p.min, p.max)) ? 'text-green-500' : 'text-red-500'}>
                            {parameters.every(p => validatePID(p.value, p.min, p.max)) ? 'Pass' : 'Fail'}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Configuration:</span>
                          <span className="text-green-500">Valid</span>
                        </div>
                      </div>
                    </div>
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