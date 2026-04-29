"use client"

import { useState, useEffect } from "react"
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
  Printer,
  Archive,
  Loader2
} from "lucide-react"
import useSWR from "swr"

interface DocumentRequest {
  id: string
  request_number: string
  document_type_name: string
  purpose: string
  status: string
  fee: number
  pickup_date: string | null
  pickup_time: string | null
  remarks: string | null
  created_at: string
  profiles?: {
    full_name: string
    email: string
    purok: string
  }
}

const fetcher = (url: string) => fetch(url).then(res => res.json())

function getStatusBadge(status: string) {
  switch (status) {
    case "approved":
    case "ready":
      return (
        <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">
          <CheckCircle2 className="mr-1 h-3 w-3" />
          Ready
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
    case "processing":
      return (
        <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-100">
          <Clock className="mr-1 h-3 w-3" />
          Processing
        </Badge>
      )
    default:
      return <Badge variant="secondary">{status}</Badge>
  }
}

export default function OfficialDocumentsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedRequest, setSelectedRequest] = useState<DocumentRequest | null>(null)
  const [showApproveDialog, setShowApproveDialog] = useState(false)
  const [showArchive, setShowArchive] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [pickupDate, setPickupDate] = useState("")
  const [pickupTime, setPickupTime] = useState("")
  const [notes, setNotes] = useState("")

  const { data: requests = [], mutate, isLoading } = useSWR<DocumentRequest[]>('/api/documents', fetcher)
  const { data: archiveData = [] } = useSWR('/api/documents/archive', fetcher, { 
    revalidateOnFocus: false 
  })

  const filteredRequests = requests.filter((req: DocumentRequest) => 
    req.request_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    req.document_type_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    req.profiles?.full_name?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const pendingRequests = filteredRequests.filter((r: DocumentRequest) => r.status === "pending")
  const readyRequests = filteredRequests.filter((r: DocumentRequest) => r.status === "approved" || r.status === "ready")
  const pendingCount = pendingRequests.length
  const approvedCount = readyRequests.length
  const releasedCount = filteredRequests.filter((r: DocumentRequest) => r.status === "released").length

  const handleApprove = async () => {
    if (!selectedRequest) return
    setIsUpdating(true)
    
    try {
      await fetch('/api/documents', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: selectedRequest.id,
          status: 'approved',
          pickup_date: pickupDate || null,
          pickup_time: pickupTime || null,
          remarks: notes || null
        })
      })
      
      mutate()
      setShowApproveDialog(false)
      setSelectedRequest(null)
      setPickupDate("")
      setPickupTime("")
      setNotes("")
    } catch (error) {
      console.error('Error approving request:', error)
    } finally {
      setIsUpdating(false)
    }
  }

  const handleReject = async () => {
    if (!selectedRequest) return
    setIsUpdating(true)
    
    try {
      await fetch('/api/documents', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: selectedRequest.id,
          status: 'rejected',
          remarks: notes || 'Request rejected'
        })
      })
      
      mutate()
      setSelectedRequest(null)
    } catch (error) {
      console.error('Error rejecting request:', error)
    } finally {
      setIsUpdating(false)
    }
  }

  const handleRelease = async (request: DocumentRequest) => {
    setIsUpdating(true)
    
    try {
      await fetch('/api/documents', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: request.id,
          status: 'released',
          released_at: new Date().toISOString()
        })
      })
      
      mutate()
    } catch (error) {
      console.error('Error releasing document:', error)
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
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Document Requests</h1>
          <p className="text-muted-foreground">Process and manage document requests</p>
        </div>
        <Button variant="outline" onClick={() => setShowArchive(true)}>
          <Archive className="mr-2 h-4 w-4" />
          Archive
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 grid-cols-2 sm:grid-cols-4">
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
                <p className="text-2xl font-bold">{approvedCount}</p>
                <p className="text-sm text-muted-foreground">Ready</p>
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
                <p className="text-2xl font-bold">{releasedCount}</p>
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
                <p className="text-2xl font-bold">{requests.length}</p>
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
            <TabsList className="w-full sm:w-auto">
              <TabsTrigger value="pending">Pending ({pendingCount})</TabsTrigger>
              <TabsTrigger value="approved">For Pickup ({approvedCount})</TabsTrigger>
              <TabsTrigger value="all">All Requests</TabsTrigger>
            </TabsList>
            <TabsContent value="pending" className="mt-4">
              <div className="rounded-md border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Request ID</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Requester</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pendingRequests.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                          No pending requests
                        </TableCell>
                      </TableRow>
                    ) : (
                      pendingRequests.map((request: DocumentRequest) => (
                        <TableRow key={request.id}>
                          <TableCell className="font-medium">{request.request_number}</TableCell>
                          <TableCell>{request.document_type_name || 'Unknown'}</TableCell>
                          <TableCell>
                            <div>
                              <p className="font-medium">{request.profiles?.full_name || 'Unknown'}</p>
                              <p className="text-sm text-muted-foreground">{request.profiles?.purok || ''}</p>
                            </div>
                          </TableCell>
                          <TableCell>{new Date(request.created_at).toLocaleDateString()}</TableCell>
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
                              <Button 
                                size="sm"
                                onClick={() => {
                                  setSelectedRequest(request)
                                  setShowApproveDialog(true)
                                }}
                              >
                                Approve
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
            <TabsContent value="approved" className="mt-4">
              <div className="rounded-md border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Request ID</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Requester</TableHead>
                      <TableHead>Pickup</TableHead>
                      <TableHead>Fee</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {readyRequests.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                          No documents ready for pickup
                        </TableCell>
                      </TableRow>
                    ) : (
                      readyRequests.map((request: DocumentRequest) => (
                        <TableRow key={request.id}>
                          <TableCell className="font-medium">{request.request_number}</TableCell>
                          <TableCell>{request.document_type_name || 'Unknown'}</TableCell>
                          <TableCell>{request.profiles?.full_name || 'Unknown'}</TableCell>
                          <TableCell>
                            {request.pickup_date 
                              ? `${new Date(request.pickup_date).toLocaleDateString()} ${request.pickup_time || ''}`
                              : 'Not set'}
                          </TableCell>
                          <TableCell>PHP {request.fee || 0}</TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm">
                                <Printer className="mr-1 h-3 w-3" />
                                Print
                              </Button>
                              <Button 
                                size="sm"
                                onClick={() => handleRelease(request)}
                                disabled={isUpdating}
                              >
                                {isUpdating ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Release'}
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
                      <TableHead>Request ID</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Requester</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredRequests.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                          No requests found
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredRequests.map((request: DocumentRequest) => (
                        <TableRow key={request.id}>
                          <TableCell className="font-medium">{request.request_number}</TableCell>
                          <TableCell>{request.document_type_name || 'Unknown'}</TableCell>
                          <TableCell>{request.profiles?.full_name || 'Unknown'}</TableCell>
                          <TableCell>{new Date(request.created_at).toLocaleDateString()}</TableCell>
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
                      ))
                    )}
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
                <span className="font-medium">{selectedRequest.request_number}</span>
                {getStatusBadge(selectedRequest.status)}
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-sm text-muted-foreground">Document Type</p>
                  <p className="font-medium">{selectedRequest.document_type_name || 'Unknown'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Purpose</p>
                  <p className="font-medium">{selectedRequest.purpose || 'Not specified'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Requester</p>
                  <p className="font-medium">{selectedRequest.profiles?.full_name || 'Unknown'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{selectedRequest.profiles?.email || 'Unknown'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Purok</p>
                  <p className="font-medium">{selectedRequest.profiles?.purok || 'Unknown'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Fee</p>
                  <p className="font-medium">PHP {selectedRequest.fee || 0}</p>
                </div>
              </div>
              {selectedRequest.remarks && (
                <div className="rounded-lg border p-4">
                  <p className="text-sm text-muted-foreground mb-2">Remarks</p>
                  <p>{selectedRequest.remarks}</p>
                </div>
              )}
            </div>
          )}
          <DialogFooter className="flex-col gap-2 sm:flex-row">
            <Button variant="outline" onClick={() => setSelectedRequest(null)}>Close</Button>
            {selectedRequest?.status === "pending" && (
              <>
                <Button 
                  variant="destructive" 
                  onClick={handleReject}
                  disabled={isUpdating}
                >
                  {isUpdating ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Reject'}
                </Button>
                <Button 
                  onClick={() => setShowApproveDialog(true)}
                  disabled={isUpdating}
                >
                  Approve
                </Button>
              </>
            )}
            {(selectedRequest?.status === "approved" || selectedRequest?.status === "ready") && (
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
              <Input 
                type="date" 
                value={pickupDate}
                onChange={(e) => setPickupDate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Pickup Time</Label>
              <Input 
                type="time" 
                value={pickupTime}
                onChange={(e) => setPickupTime(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Fee Amount</Label>
              <Input defaultValue={selectedRequest?.fee || 0} placeholder="Enter fee" disabled />
            </div>
            <div className="space-y-2">
              <Label>Notes (Optional)</Label>
              <Textarea 
                placeholder="Additional instructions for the resident..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowApproveDialog(false)}>Cancel</Button>
            <Button onClick={handleApprove} disabled={isUpdating}>
              {isUpdating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
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
            <div className="rounded-md border overflow-x-auto">
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
                  {filteredRequests.filter((r: DocumentRequest) => r.status === 'released').length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                        No archived documents
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredRequests.filter((r: DocumentRequest) => r.status === 'released').map((doc: DocumentRequest) => (
                      <TableRow key={doc.id}>
                        <TableCell className="font-medium">{doc.request_number}</TableCell>
                        <TableCell>{doc.document_type_name || 'Unknown'}</TableCell>
                        <TableCell>{doc.profiles?.full_name || 'Unknown'}</TableCell>
                        <TableCell>{new Date(doc.created_at).toLocaleDateString()}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
