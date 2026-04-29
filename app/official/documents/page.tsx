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
import { 
  Search, 
  Eye,
  CheckCircle2,
  XCircle,
  Clock,
  FileText,
  Download,
  Printer,
  Settings,
  Archive
} from "lucide-react"

const mockRequests = [
  {
    id: "REQ-2026-001",
    type: "Barangay Clearance",
    purpose: "Employment",
    requester: "Juan Dela Cruz",
    email: "juan@example.com",
    purok: "Purok 3",
    status: "pending",
    date: "April 28, 2026",
    fee: "50",
    documentsUploaded: true
  },
  {
    id: "REQ-2026-002",
    type: "Certificate of Residency",
    purpose: "School Enrollment",
    requester: "Maria Santos",
    email: "maria@example.com",
    purok: "Purok 1",
    status: "approved",
    date: "April 27, 2026",
    fee: "30",
    pickupTime: "April 30, 2026, 2:00 PM",
    documentsUploaded: true
  },
  {
    id: "REQ-2026-003",
    type: "Business Clearance",
    purpose: "Business Permit Application",
    requester: "Pedro Reyes",
    email: "pedro@example.com",
    purok: "Purok 2",
    status: "pending",
    date: "April 26, 2026",
    fee: "200",
    documentsUploaded: false
  },
  {
    id: "REQ-2026-004",
    type: "Certificate of Indigency",
    purpose: "Medical Assistance",
    requester: "Ana Garcia",
    email: "ana@example.com",
    purok: "Purok 4",
    status: "released",
    date: "April 20, 2026",
    fee: "Free",
    releaseDate: "April 22, 2026",
    documentsUploaded: true
  },
]

const archivedDocuments = [
  { id: "ARC-001", type: "Barangay Clearance", requester: "Juan Dela Cruz", releaseDate: "April 15, 2026" },
  { id: "ARC-002", type: "Business Clearance", requester: "Maria Santos", releaseDate: "April 10, 2026" },
  { id: "ARC-003", type: "Certificate of Residency", requester: "Pedro Reyes", releaseDate: "April 5, 2026" },
]

function getStatusBadge(status: string) {
  switch (status) {
    case "approved":
      return (
        <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">
          <CheckCircle2 className="mr-1 h-3 w-3" />
          Approved
        </Badge>
      )
    case "pending":
      return (
        <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100">
          <Clock className="mr-1 h-3 w-3" />
          Pending
        </Badge>
      )
    case "rejected":
      return (
        <Badge className="bg-red-100 text-red-700 hover:bg-red-100">
          <XCircle className="mr-1 h-3 w-3" />
          Rejected
        </Badge>
      )
    case "released":
      return (
        <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">
          <Archive className="mr-1 h-3 w-3" />
          Released
        </Badge>
      )
    default:
      return <Badge variant="secondary">{status}</Badge>
  }
}

export default function OfficialDocumentsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedRequest, setSelectedRequest] = useState<typeof mockRequests[0] | null>(null)
  const [showApproveDialog, setShowApproveDialog] = useState(false)
  const [showArchive, setShowArchive] = useState(false)

  const pendingCount = mockRequests.filter(r => r.status === "pending").length

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Document Requests</h1>
          <p className="text-muted-foreground">Process and manage document requests</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowArchive(true)}>
            <Archive className="mr-2 h-4 w-4" />
            Archive
          </Button>
          <Button variant="outline">
            <Settings className="mr-2 h-4 w-4" />
            Manage Types
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-amber-100 p-2">
                <Clock className="h-5 w-5 text-amber-700" />
              </div>
              <div>
                <p className="text-2xl font-bold">{pendingCount}</p>
                <p className="text-sm text-muted-foreground">Pending</p>
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
                <p className="text-2xl font-bold">{mockRequests.filter(r => r.status === "approved").length}</p>
                <p className="text-sm text-muted-foreground">Approved</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-blue-100 p-2">
                <Archive className="h-5 w-5 text-blue-700" />
              </div>
              <div>
                <p className="text-2xl font-bold">{mockRequests.filter(r => r.status === "released").length}</p>
                <p className="text-sm text-muted-foreground">Released</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-primary/10 p-2">
                <FileText className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{mockRequests.length}</p>
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
          placeholder="Search requests..." 
          className="pl-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Requests Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Document Requests</CardTitle>
          <CardDescription>Process pending requests and manage approvals</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="pending">
            <TabsList>
              <TabsTrigger value="pending">Pending ({pendingCount})</TabsTrigger>
              <TabsTrigger value="approved">For Pickup</TabsTrigger>
              <TabsTrigger value="all">All Requests</TabsTrigger>
            </TabsList>
            <TabsContent value="pending" className="mt-4">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Request ID</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Requester</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Documents</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockRequests.filter(r => r.status === "pending").map((request) => (
                      <TableRow key={request.id}>
                        <TableCell className="font-medium">{request.id}</TableCell>
                        <TableCell>{request.type}</TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{request.requester}</p>
                            <p className="text-sm text-muted-foreground">{request.purok}</p>
                          </div>
                        </TableCell>
                        <TableCell>{request.date}</TableCell>
                        <TableCell>
                          {request.documentsUploaded ? (
                            <Badge className="bg-emerald-100 text-emerald-700">Complete</Badge>
                          ) : (
                            <Badge className="bg-red-100 text-red-700">Missing</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => setSelectedRequest(request)}
                            >
                              <Eye className="mr-1 h-3 w-3" />
                              View
                            </Button>
                            {request.documentsUploaded && (
                              <Button 
                                size="sm"
                                onClick={() => {
                                  setSelectedRequest(request)
                                  setShowApproveDialog(true)
                                }}
                              >
                                Approve
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
            <TabsContent value="approved" className="mt-4">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Request ID</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Requester</TableHead>
                      <TableHead>Pickup Time</TableHead>
                      <TableHead>Fee</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockRequests.filter(r => r.status === "approved").map((request) => (
                      <TableRow key={request.id}>
                        <TableCell className="font-medium">{request.id}</TableCell>
                        <TableCell>{request.type}</TableCell>
                        <TableCell>{request.requester}</TableCell>
                        <TableCell>{request.pickupTime}</TableCell>
                        <TableCell>PHP {request.fee}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              <Printer className="mr-1 h-3 w-3" />
                              Print
                            </Button>
                            <Button size="sm">
                              Mark Released
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
                      <TableHead>Request ID</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Requester</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockRequests.map((request) => (
                      <TableRow key={request.id}>
                        <TableCell className="font-medium">{request.id}</TableCell>
                        <TableCell>{request.type}</TableCell>
                        <TableCell>{request.requester}</TableCell>
                        <TableCell>{request.date}</TableCell>
                        <TableCell>{getStatusBadge(request.status)}</TableCell>
                        <TableCell>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setSelectedRequest(request)}
                          >
                            View
                          </Button>
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

      {/* Request Details Modal */}
      <Dialog open={!!selectedRequest && !showApproveDialog} onOpenChange={() => setSelectedRequest(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Request Details</DialogTitle>
            <DialogDescription>
              View complete request information
            </DialogDescription>
          </DialogHeader>
          {selectedRequest && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-medium">{selectedRequest.id}</span>
                {getStatusBadge(selectedRequest.status)}
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-sm text-muted-foreground">Document Type</p>
                  <p className="font-medium">{selectedRequest.type}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Purpose</p>
                  <p className="font-medium">{selectedRequest.purpose}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Requester</p>
                  <p className="font-medium">{selectedRequest.requester}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{selectedRequest.email}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Purok</p>
                  <p className="font-medium">{selectedRequest.purok}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Fee</p>
                  <p className="font-medium">PHP {selectedRequest.fee}</p>
                </div>
              </div>
              <div className="rounded-lg border p-4">
                <p className="text-sm text-muted-foreground mb-2">Uploaded Requirements</p>
                {selectedRequest.documentsUploaded ? (
                  <div className="flex items-center gap-2 text-emerald-700">
                    <CheckCircle2 className="h-4 w-4" />
                    <span>All required documents uploaded</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-red-700">
                    <XCircle className="h-4 w-4" />
                    <span>Missing required documents - notify resident</span>
                  </div>
                )}
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedRequest(null)}>Close</Button>
            {selectedRequest?.status === "pending" && selectedRequest.documentsUploaded && (
              <>
                <Button variant="destructive">Reject</Button>
                <Button onClick={() => setShowApproveDialog(true)}>Approve</Button>
              </>
            )}
            {selectedRequest?.status === "approved" && (
              <Button>
                <Printer className="mr-2 h-4 w-4" />
                Print Document
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Approve Dialog */}
      <Dialog open={showApproveDialog} onOpenChange={setShowApproveDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Approve Request</DialogTitle>
            <DialogDescription>
              Set pickup details for the approved document
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Pickup Date</Label>
              <Input type="date" />
            </div>
            <div className="space-y-2">
              <Label>Pickup Time</Label>
              <Input type="time" />
            </div>
            <div className="space-y-2">
              <Label>Fee Amount</Label>
              <Input defaultValue={selectedRequest?.fee} placeholder="Enter fee" />
            </div>
            <div className="space-y-2">
              <Label>Notes (Optional)</Label>
              <Textarea placeholder="Additional instructions for the resident..." />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowApproveDialog(false)}>Cancel</Button>
            <Button onClick={() => {
              setShowApproveDialog(false)
              setSelectedRequest(null)
            }}>
              Approve & Notify
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Archive Dialog */}
      <Dialog open={showArchive} onOpenChange={setShowArchive}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Document Archive</DialogTitle>
            <DialogDescription>
              View all released documents
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex gap-2">
              <Input placeholder="Search archive..." className="flex-1" />
              <Button variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Export CSV
              </Button>
            </div>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Requester</TableHead>
                    <TableHead>Release Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {archivedDocuments.map((doc) => (
                    <TableRow key={doc.id}>
                      <TableCell className="font-medium">{doc.id}</TableCell>
                      <TableCell>{doc.type}</TableCell>
                      <TableCell>{doc.requester}</TableCell>
                      <TableCell>{doc.releaseDate}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowArchive(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
