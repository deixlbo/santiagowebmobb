"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ScrollArea } from "@/components/ui/scroll-area"
import { 
  Search, 
  Eye,
  CheckCircle2,
  Clock,
  AlertTriangle,
  MapPin,
  Printer,
  FileText,
  Loader2
} from "lucide-react"
import useSWR from "swr"

interface Blotter {
  id: string
  blotter_number: string
  incident_type: string
  description: string
  location: string
  complainant_name: string
  complainant_address: string
  respondent_name: string
  respondent_address: string
  status: string
  incident_date: string
  action_taken: string | null
  resolution: string | null
  created_at: string
}

const fetcher = (url: string) => fetch(url).then(res => res.json())

function getStatusBadge(status: string) {
  switch (status) {
    case "resolved":
      return (
        <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">
          <CheckCircle2 className="mr-1 h-3 w-3" />
          Resolved
        </Badge>
      )
    case "processing":
    case "mediation":
      return (
        <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100">
          <Clock className="mr-1 h-3 w-3" />
          Processing
        </Badge>
      )
    case "filed":
      return (
        <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">
          <FileText className="mr-1 h-3 w-3" />
          Filed
        </Badge>
      )
    case "escalated":
      return (
        <Badge className="bg-red-100 text-red-700 hover:bg-red-100">
          <AlertTriangle className="mr-1 h-3 w-3" />
          Escalated
        </Badge>
      )
    default:
      return <Badge variant="secondary">{status}</Badge>
  }
}

export default function OfficialBlottersPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedBlotter, setSelectedBlotter] = useState<Blotter | null>(null)
  const [showUpdateDialog, setShowUpdateDialog] = useState(false)
  const [showPrintPreview, setShowPrintPreview] = useState(false)
  const [actionTaken, setActionTaken] = useState("")
  const [resolution, setResolution] = useState("")
  const [isUpdating, setIsUpdating] = useState(false)

  const { data: blotters = [], mutate, isLoading } = useSWR<Blotter[]>('/api/blotter', fetcher)

  const filteredBlotters = blotters.filter((b: Blotter) => 
    b.blotter_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.incident_type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.complainant_name?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const filedBlotters = filteredBlotters.filter((b: Blotter) => b.status === "filed")
  const processingBlotters = filteredBlotters.filter((b: Blotter) => b.status === "processing" || b.status === "mediation")
  const filedCount = filedBlotters.length
  const processingCount = processingBlotters.length
  const resolvedCount = filteredBlotters.filter((b: Blotter) => b.status === "resolved").length

  const handleUpdateStatus = async (newStatus: string) => {
    if (!selectedBlotter) return
    setIsUpdating(true)

    try {
      await fetch('/api/blotter', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: selectedBlotter.id,
          status: newStatus,
          action_taken: actionTaken || selectedBlotter.action_taken,
          resolution: resolution || null,
          resolution_date: newStatus === 'resolved' ? new Date().toISOString().split('T')[0] : null
        })
      })

      mutate()
      setShowUpdateDialog(false)
      setSelectedBlotter(null)
      setActionTaken("")
      setResolution("")
    } catch (error) {
      console.error('Error updating blotter:', error)
    } finally {
      setIsUpdating(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Blotter Records</h1>
        <p className="text-muted-foreground">Manage and process incident reports</p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 grid-cols-2 sm:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-blue-100 p-2">
                <FileText className="h-5 w-5 text-blue-700" />
              </div>
              <div>
                <p className="text-2xl font-bold">{filedCount}</p>
                <p className="text-sm text-muted-foreground">New Reports</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-amber-100 p-2">
                <Clock className="h-5 w-5 text-amber-700" />
              </div>
              <div>
                <p className="text-2xl font-bold">{processingCount}</p>
                <p className="text-sm text-muted-foreground">Processing</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-emerald-100 p-2">
                <CheckCircle2 className="h-5 w-5 text-emerald-700" />
              </div>
              <div>
                <p className="text-2xl font-bold">{resolvedCount}</p>
                <p className="text-sm text-muted-foreground">Resolved</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-primary/10 p-2">
                <AlertTriangle className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{blotters.length}</p>
                <p className="text-sm text-muted-foreground">Total</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input 
          placeholder="Search blotter records..." 
          className="pl-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Blotters Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Blotter Records</CardTitle>
          <CardDescription>Process and resolve incident reports</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="filed">
            <TabsList className="w-full sm:w-auto">
              <TabsTrigger value="filed">New ({filedCount})</TabsTrigger>
              <TabsTrigger value="processing">Processing ({processingCount})</TabsTrigger>
              <TabsTrigger value="all">All Records</TabsTrigger>
            </TabsList>
            <TabsContent value="filed" className="mt-4">
              <div className="rounded-md border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Reference</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Complainant</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filedBlotters.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                          No new reports
                        </TableCell>
                      </TableRow>
                    ) : (
                      filedBlotters.map((blotter: Blotter) => (
                        <TableRow key={blotter.id}>
                          <TableCell className="font-medium">{blotter.blotter_number}</TableCell>
                          <TableCell>{blotter.incident_type}</TableCell>
                          <TableCell>{blotter.complainant_name || 'Unknown'}</TableCell>
                          <TableCell>
                            <span className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {blotter.location || 'Not specified'}
                            </span>
                          </TableCell>
                          <TableCell>{blotter.incident_date ? new Date(blotter.incident_date).toLocaleDateString() : new Date(blotter.created_at).toLocaleDateString()}</TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => setSelectedBlotter(blotter)}
                              >
                                <Eye className="mr-1 h-3 w-3" />
                                View
                              </Button>
                              <Button 
                                size="sm"
                                onClick={() => {
                                  setSelectedBlotter(blotter)
                                  setShowUpdateDialog(true)
                                }}
                              >
                                Process
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
            <TabsContent value="processing" className="mt-4">
              <div className="rounded-md border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Reference</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Parties</TableHead>
                      <TableHead>Action Taken</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {processingBlotters.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                          No reports in processing
                        </TableCell>
                      </TableRow>
                    ) : (
                      processingBlotters.map((blotter: Blotter) => (
                        <TableRow key={blotter.id}>
                          <TableCell className="font-medium">{blotter.blotter_number}</TableCell>
                          <TableCell>{blotter.incident_type}</TableCell>
                          <TableCell>
                            <div className="text-sm">
                              <p>{blotter.complainant_name || 'Unknown'} vs</p>
                              <p className="text-muted-foreground">{blotter.respondent_name || 'Unknown'}</p>
                            </div>
                          </TableCell>
                          <TableCell className="max-w-[200px] truncate">{blotter.action_taken || 'No action yet'}</TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => setSelectedBlotter(blotter)}
                              >
                                View
                              </Button>
                              <Button 
                                size="sm"
                                onClick={() => {
                                  setSelectedBlotter(blotter)
                                  setActionTaken(blotter.action_taken || '')
                                  setShowUpdateDialog(true)
                                }}
                              >
                                Update
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
            <TabsContent value="all" className="mt-4">
              <div className="rounded-md border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Reference</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Complainant</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredBlotters.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                          No blotter records found
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredBlotters.map((blotter: Blotter) => (
                        <TableRow key={blotter.id}>
                          <TableCell className="font-medium">{blotter.blotter_number}</TableCell>
                          <TableCell>{blotter.incident_type}</TableCell>
                          <TableCell>{blotter.complainant_name || 'Unknown'}</TableCell>
                          <TableCell>{new Date(blotter.created_at).toLocaleDateString()}</TableCell>
                          <TableCell>{getStatusBadge(blotter.status)}</TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => setSelectedBlotter(blotter)}
                              >
                                View
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => {
                                  setSelectedBlotter(blotter)
                                  setShowPrintPreview(true)
                                }}
                              >
                                <Printer className="h-3 w-3" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Blotter Details Modal */}
      <Dialog open={!!selectedBlotter && !showUpdateDialog && !showPrintPreview} onOpenChange={() => setSelectedBlotter(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Blotter Details</DialogTitle>
            <DialogDescription>
              View complete incident report
            </DialogDescription>
          </DialogHeader>
          {selectedBlotter && (
            <ScrollArea className="max-h-[60vh]">
              <div className="space-y-4 pr-4">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{selectedBlotter.blotter_number}</span>
                  {getStatusBadge(selectedBlotter.status)}
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <p className="text-sm text-muted-foreground">Incident Type</p>
                    <p className="font-medium">{selectedBlotter.incident_type}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Date Reported</p>
                    <p className="font-medium">{new Date(selectedBlotter.created_at).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Location</p>
                    <p className="font-medium">{selectedBlotter.location || 'Not specified'}</p>
                  </div>
                </div>
                <div className="border-t pt-4">
                  <p className="text-sm text-muted-foreground">Complainant</p>
                  <p className="font-medium">{selectedBlotter.complainant_name || 'Unknown'}</p>
                  <p className="text-sm text-muted-foreground">{selectedBlotter.complainant_address || ''}</p>
                </div>
                <div className="border-t pt-4">
                  <p className="text-sm text-muted-foreground">Respondent</p>
                  <p className="font-medium">{selectedBlotter.respondent_name || 'Unknown'}</p>
                  <p className="text-sm text-muted-foreground">{selectedBlotter.respondent_address || ''}</p>
                </div>
                <div className="border-t pt-4">
                  <p className="text-sm text-muted-foreground">Description</p>
                  <p className="mt-1">{selectedBlotter.description}</p>
                </div>
                {selectedBlotter.action_taken && (
                  <div className="border-t pt-4">
                    <p className="text-sm text-muted-foreground">Action Taken</p>
                    <p className="mt-1">{selectedBlotter.action_taken}</p>
                  </div>
                )}
                {selectedBlotter.resolution && (
                  <div className="border-t pt-4 rounded-lg bg-emerald-50 p-4">
                    <p className="text-sm font-medium text-emerald-800">Resolution</p>
                    <p className="mt-1 text-emerald-700">{selectedBlotter.resolution}</p>
                  </div>
                )}
              </div>
            </ScrollArea>
          )}
          <DialogFooter className="flex-col gap-2 sm:flex-row">
            <Button variant="outline" onClick={() => setSelectedBlotter(null)}>Close</Button>
            <Button 
              variant="outline"
              onClick={() => setShowPrintPreview(true)}
            >
              <Printer className="mr-2 h-4 w-4" />
              Print Report
            </Button>
            {selectedBlotter?.status !== "resolved" && (
              <Button onClick={() => {
                setActionTaken(selectedBlotter?.action_taken || '')
                setShowUpdateDialog(true)
              }}>
                Update Status
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Update Status Dialog */}
      <Dialog open={showUpdateDialog} onOpenChange={setShowUpdateDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Blotter Status</DialogTitle>
            <DialogDescription>
              Record action taken and update case status
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Action Taken</Label>
              <Textarea 
                placeholder="Describe the action taken (e.g., mediation scheduled, investigation conducted)..."
                rows={3}
                value={actionTaken}
                onChange={(e) => setActionTaken(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Resolution (if resolved)</Label>
              <Textarea 
                placeholder="Enter resolution details if the case is resolved..."
                rows={3}
                value={resolution}
                onChange={(e) => setResolution(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter className="flex-col gap-2 sm:flex-row">
            <Button variant="outline" onClick={() => setShowUpdateDialog(false)}>Cancel</Button>
            <Button 
              variant="outline"
              onClick={() => handleUpdateStatus('processing')}
              disabled={isUpdating}
            >
              {isUpdating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Mark Processing
            </Button>
            <Button 
              onClick={() => handleUpdateStatus('resolved')}
              disabled={isUpdating || !resolution}
            >
              {isUpdating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Mark Resolved
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Print Preview Dialog */}
      <Dialog open={showPrintPreview} onOpenChange={setShowPrintPreview}>
        <DialogContent className="max-w-3xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>Blotter Report Preview</DialogTitle>
          </DialogHeader>
          {selectedBlotter && (
            <ScrollArea className="max-h-[70vh]">
              <div className="rounded-lg border bg-white p-8 text-black">
                <div className="text-center space-y-1 mb-6">
                  <p className="text-sm">Republic of the Philippines</p>
                  <p className="text-sm">Province of Zambales</p>
                  <p className="text-sm">Municipality of San Antonio</p>
                  <p className="text-sm font-semibold">Barangay Santiago</p>
                </div>
                <h2 className="text-center text-lg font-bold mb-6 border-t border-b py-4">BLOTTER REPORT</h2>
                <div className="space-y-4 text-sm">
                  <div className="grid grid-cols-2 gap-4">
                    <p><strong>Reference No:</strong> {selectedBlotter.blotter_number}</p>
                    <p><strong>Date:</strong> {new Date(selectedBlotter.created_at).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p><strong>Incident Type:</strong> {selectedBlotter.incident_type}</p>
                    <p><strong>Location:</strong> {selectedBlotter.location || 'Not specified'}</p>
                  </div>
                  <div className="border-t pt-4">
                    <p className="font-semibold">COMPLAINANT</p>
                    <p>{selectedBlotter.complainant_name || 'Unknown'}</p>
                    <p>{selectedBlotter.complainant_address || ''}</p>
                  </div>
                  <div className="border-t pt-4">
                    <p className="font-semibold">RESPONDENT</p>
                    <p>{selectedBlotter.respondent_name || 'Unknown'}</p>
                    <p>{selectedBlotter.respondent_address || ''}</p>
                  </div>
                  <div className="border-t pt-4">
                    <p className="font-semibold">INCIDENT DETAILS</p>
                    <p className="mt-2">{selectedBlotter.description}</p>
                  </div>
                  {selectedBlotter.action_taken && (
                    <div className="border-t pt-4">
                      <p className="font-semibold">ACTION TAKEN</p>
                      <p className="mt-2">{selectedBlotter.action_taken}</p>
                    </div>
                  )}
                  {selectedBlotter.resolution && (
                    <div className="border-t pt-4">
                      <p className="font-semibold">RESOLUTION</p>
                      <p className="mt-2">{selectedBlotter.resolution}</p>
                    </div>
                  )}
                </div>
              </div>
            </ScrollArea>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPrintPreview(false)}>Close</Button>
            <Button onClick={() => window.print()}>
              <Printer className="mr-2 h-4 w-4" />
              Print
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
