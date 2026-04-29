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
  FileText
} from "lucide-react"

const mockBlotters = [
  {
    id: "BLT-2026-001",
    type: "Noise Complaint",
    description: "Loud karaoke past 10PM in Purok 3, disturbing nearby residents.",
    location: "Purok 3, near the chapel",
    complainant: "Juan Dela Cruz",
    complainantAddress: "Purok 3, Barangay Santiago",
    respondent: "Unknown",
    respondentAddress: "Purok 3",
    status: "filed",
    date: "April 28, 2026",
    actionTaken: null,
    resolution: null
  },
  {
    id: "BLT-2026-002",
    type: "Property Dispute",
    description: "Fence encroachment on neighboring lot. The respondent allegedly built a fence that extends into the complainant's property by approximately 2 meters.",
    location: "Purok 2, Lot 15",
    complainant: "Maria Santos",
    complainantAddress: "Lot 14, Purok 2",
    respondent: "Pedro Reyes",
    respondentAddress: "Lot 16, Purok 2",
    status: "processing",
    date: "April 26, 2026",
    actionTaken: "Mediation scheduled for May 2, 2026",
    resolution: null
  },
  {
    id: "BLT-2026-003",
    type: "Neighborhood Dispute",
    description: "Ongoing argument about water drainage causing flooding in complainant's yard during rainy season.",
    location: "Purok 1",
    complainant: "Ana Garcia",
    complainantAddress: "Purok 1, Barangay Santiago",
    respondent: "Carlos Mendoza",
    respondentAddress: "Purok 1, Barangay Santiago",
    status: "resolved",
    date: "April 20, 2026",
    actionTaken: "Mediation conducted on April 23, 2026",
    resolution: "Both parties agreed to share the cost of installing proper drainage. Resolution signed on April 24, 2026."
  },
]

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
    default:
      return <Badge variant="secondary">{status}</Badge>
  }
}

export default function OfficialBlottersPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedBlotter, setSelectedBlotter] = useState<typeof mockBlotters[0] | null>(null)
  const [showUpdateDialog, setShowUpdateDialog] = useState(false)
  const [showPrintPreview, setShowPrintPreview] = useState(false)

  const filedCount = mockBlotters.filter(b => b.status === "filed").length
  const processingCount = mockBlotters.filter(b => b.status === "processing").length

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Blotter Records</h1>
          <p className="text-muted-foreground">Manage and process incident reports</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-4">
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
                <p className="text-2xl font-bold">{mockBlotters.filter(b => b.status === "resolved").length}</p>
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
                <p className="text-2xl font-bold">{mockBlotters.length}</p>
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
            <TabsList>
              <TabsTrigger value="filed">New ({filedCount})</TabsTrigger>
              <TabsTrigger value="processing">Processing ({processingCount})</TabsTrigger>
              <TabsTrigger value="all">All Records</TabsTrigger>
            </TabsList>
            <TabsContent value="filed" className="mt-4">
              <div className="rounded-md border">
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
                    {mockBlotters.filter(b => b.status === "filed").map((blotter) => (
                      <TableRow key={blotter.id}>
                        <TableCell className="font-medium">{blotter.id}</TableCell>
                        <TableCell>{blotter.type}</TableCell>
                        <TableCell>{blotter.complainant}</TableCell>
                        <TableCell>
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {blotter.location}
                          </span>
                        </TableCell>
                        <TableCell>{blotter.date}</TableCell>
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
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
            <TabsContent value="processing" className="mt-4">
              <div className="rounded-md border">
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
                    {mockBlotters.filter(b => b.status === "processing").map((blotter) => (
                      <TableRow key={blotter.id}>
                        <TableCell className="font-medium">{blotter.id}</TableCell>
                        <TableCell>{blotter.type}</TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <p>{blotter.complainant} vs</p>
                            <p className="text-muted-foreground">{blotter.respondent}</p>
                          </div>
                        </TableCell>
                        <TableCell className="max-w-[200px] truncate">{blotter.actionTaken}</TableCell>
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
                                setShowUpdateDialog(true)
                              }}
                            >
                              Update
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
            <TabsContent value="all" className="mt-4">
              <div className="rounded-md border">
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
                    {mockBlotters.map((blotter) => (
                      <TableRow key={blotter.id}>
                        <TableCell className="font-medium">{blotter.id}</TableCell>
                        <TableCell>{blotter.type}</TableCell>
                        <TableCell>{blotter.complainant}</TableCell>
                        <TableCell>{blotter.date}</TableCell>
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
                    ))}
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
                  <span className="font-medium">{selectedBlotter.id}</span>
                  {getStatusBadge(selectedBlotter.status)}
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <p className="text-sm text-muted-foreground">Incident Type</p>
                    <p className="font-medium">{selectedBlotter.type}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Date Reported</p>
                    <p className="font-medium">{selectedBlotter.date}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Location</p>
                    <p className="font-medium">{selectedBlotter.location}</p>
                  </div>
                </div>
                <div className="border-t pt-4">
                  <p className="text-sm text-muted-foreground">Complainant</p>
                  <p className="font-medium">{selectedBlotter.complainant}</p>
                  <p className="text-sm text-muted-foreground">{selectedBlotter.complainantAddress}</p>
                </div>
                <div className="border-t pt-4">
                  <p className="text-sm text-muted-foreground">Respondent</p>
                  <p className="font-medium">{selectedBlotter.respondent}</p>
                  <p className="text-sm text-muted-foreground">{selectedBlotter.respondentAddress}</p>
                </div>
                <div className="border-t pt-4">
                  <p className="text-sm text-muted-foreground">Description</p>
                  <p className="mt-1">{selectedBlotter.description}</p>
                </div>
                {selectedBlotter.actionTaken && (
                  <div className="border-t pt-4">
                    <p className="text-sm text-muted-foreground">Action Taken</p>
                    <p className="mt-1">{selectedBlotter.actionTaken}</p>
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
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedBlotter(null)}>Close</Button>
            <Button 
              variant="outline"
              onClick={() => setShowPrintPreview(true)}
            >
              <Printer className="mr-2 h-4 w-4" />
              Print Report
            </Button>
            {selectedBlotter?.status !== "resolved" && (
              <Button onClick={() => setShowUpdateDialog(true)}>
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
              />
            </div>
            <div className="space-y-2">
              <Label>Resolution (if resolved)</Label>
              <Textarea 
                placeholder="Enter resolution details if the case is resolved..."
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowUpdateDialog(false)}>Cancel</Button>
            <Button onClick={() => {
              setShowUpdateDialog(false)
              setSelectedBlotter(null)
            }}>
              Save & Notify Parties
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
                    <div>
                      <p className="text-gray-600">Reference No:</p>
                      <p className="font-medium">{selectedBlotter.id}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Date Reported:</p>
                      <p className="font-medium">{selectedBlotter.date}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-gray-600">Incident Type:</p>
                    <p className="font-medium">{selectedBlotter.type}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Location:</p>
                    <p className="font-medium">{selectedBlotter.location}</p>
                  </div>
                  <div className="border-t pt-4">
                    <p className="font-semibold">COMPLAINANT DETAILS</p>
                    <p>Name: {selectedBlotter.complainant}</p>
                    <p>Address: {selectedBlotter.complainantAddress}</p>
                  </div>
                  <div className="border-t pt-4">
                    <p className="font-semibold">RESPONDENT DETAILS</p>
                    <p>Name: {selectedBlotter.respondent}</p>
                    <p>Address: {selectedBlotter.respondentAddress}</p>
                  </div>
                  <div className="border-t pt-4">
                    <p className="font-semibold">INCIDENT DESCRIPTION</p>
                    <p className="mt-1">{selectedBlotter.description}</p>
                  </div>
                  {selectedBlotter.actionTaken && (
                    <div className="border-t pt-4">
                      <p className="font-semibold">ACTION TAKEN</p>
                      <p className="mt-1">{selectedBlotter.actionTaken}</p>
                    </div>
                  )}
                  {selectedBlotter.resolution && (
                    <div className="border-t pt-4">
                      <p className="font-semibold">RESOLUTION</p>
                      <p className="mt-1">{selectedBlotter.resolution}</p>
                    </div>
                  )}
                </div>
                <div className="mt-12 grid grid-cols-2 gap-8 text-center text-sm">
                  <div>
                    <p className="border-t border-black pt-1">Recorded by</p>
                  </div>
                  <div>
                    <p className="border-t border-black pt-1 font-semibold">ROLANDO C. BORJA</p>
                    <p>Punong Barangay</p>
                    <p className="text-xs text-gray-600 mt-1">Approved by</p>
                  </div>
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
