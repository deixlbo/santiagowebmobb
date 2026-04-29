"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
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
  Archive,
  Plus,
  Trash2,
  Edit2
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

const defaultDocumentTypes = [
  { id: "1", name: "Barangay Clearance", requirements: "Valid ID, Proof of Residency", fee: "50" },
  { id: "2", name: "Certificate of Residency", requirements: "Proof of Address, Valid ID", fee: "30" },
  { id: "3", name: "Business Clearance", requirements: "Business Registration, Valid ID", fee: "200" },
  { id: "4", name: "Certificate of Indigency", requirements: "Proof of Residency, Income Statement", fee: "Free" },
]

function getStatusBadge(status: string) {
  switch (status) {
    case "approved":
      return (
        <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 text-[10px] md:text-xs">
          <CheckCircle2 className="mr-0.5 md:mr-1 h-2.5 w-2.5 md:h-3 md:w-3" />
          <span className="hidden sm:inline">Approved</span>
          <span className="sm:hidden">OK</span>
        </Badge>
      )
    case "pending":
      return (
        <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100 text-[10px] md:text-xs">
          <Clock className="mr-0.5 md:mr-1 h-2.5 w-2.5 md:h-3 md:w-3" />
          <span className="hidden sm:inline">Pending</span>
          <span className="sm:hidden">Wait</span>
        </Badge>
      )
    case "rejected":
      return (
        <Badge className="bg-red-100 text-red-700 hover:bg-red-100 text-[10px] md:text-xs">
          <XCircle className="mr-0.5 md:mr-1 h-2.5 w-2.5 md:h-3 md:w-3" />
          <span className="hidden sm:inline">Rejected</span>
          <span className="sm:hidden">No</span>
        </Badge>
      )
    case "released":
      return (
        <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 text-[10px] md:text-xs">
          <Archive className="mr-0.5 md:mr-1 h-2.5 w-2.5 md:h-3 md:w-3" />
          <span className="hidden sm:inline">Released</span>
          <span className="sm:hidden">Done</span>
        </Badge>
      )
    default:
      return <Badge variant="secondary">{status}</Badge>
  }
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
}

// Document Header Component with Logos
function DocumentHeader() {
  return (
    <div className="flex items-center justify-between mb-4 p-4 border-b print:border-b print:mb-4">
      <Image src="/images/santiago.jpg" alt="Barangay Santiago" width={60} height={60} className="w-12 h-12 md:w-16 md:h-16 rounded-full object-cover shrink-0" />
      <div className="text-center flex-1 px-2">
        <p className="text-[10px] md:text-xs text-muted-foreground print:text-black">Republic of the Philippines</p>
        <p className="text-xs md:text-sm font-semibold print:text-black">BARANGAY SANTIAGO</p>
        <p className="text-[10px] md:text-xs text-muted-foreground print:text-black">City of Santiago, Isabela</p>
      </div>
      <Image src="/images/saz.jpg" alt="City of Santiago" width={60} height={60} className="w-12 h-12 md:w-16 md:h-16 rounded-full object-cover shrink-0" />
    </div>
  )
}

export default function OfficialDocumentsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedRequest, setSelectedRequest] = useState<typeof mockRequests[0] | null>(null)
  const [showApproveDialog, setShowApproveDialog] = useState(false)
  const [showArchive, setShowArchive] = useState(false)
  const [showManageTypes, setShowManageTypes] = useState(false)
  const [documentTypes, setDocumentTypes] = useState(defaultDocumentTypes)
  const [editingType, setEditingType] = useState<typeof defaultDocumentTypes[0] | null>(null)
  const [newTypeName, setNewTypeName] = useState("")
  const [newTypeRequirements, setNewTypeRequirements] = useState<string[]>([""])
  const [newTypeFee, setNewTypeFee] = useState("")
  const [showPrintDocument, setShowPrintDocument] = useState(false)
  const [printRequest, setPrintRequest] = useState<typeof mockRequests[0] | null>(null)

  const pendingCount = mockRequests.filter(r => r.status === "pending").length
  const approvedCount = mockRequests.filter(r => r.status === "approved").length
  const releasedCount = mockRequests.filter(r => r.status === "released").length

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-4 md:space-y-6"
    >
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight">Document Requests</h1>
          <p className="text-xs md:text-sm text-muted-foreground">Process and manage document requests</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="h-8 text-xs" onClick={() => setShowArchive(true)}>
            <Archive className="h-3 w-3 md:mr-2" />
            <span className="hidden md:inline">Archive</span>
          </Button>
          <Button variant="outline" size="sm" className="h-8 text-xs" onClick={() => setShowManageTypes(true)}>
            <Settings className="h-3 w-3 md:mr-2" />
            <span className="hidden md:inline">Manage Types</span>
          </Button>
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div variants={itemVariants} className="grid grid-cols-4 gap-2 md:gap-4">
        <Card>
          <CardContent className="p-2 md:p-4">
            <div className="flex flex-col md:flex-row items-center gap-1 md:gap-4">
              <div className="rounded-lg bg-amber-100 p-1.5 md:p-2">
                <Clock className="h-4 w-4 md:h-5 md:w-5 text-amber-700" />
              </div>
              <div className="text-center md:text-left">
                <p className="text-lg md:text-2xl font-bold">{pendingCount}</p>
                <p className="text-[10px] md:text-sm text-muted-foreground">Pending</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-2 md:p-4">
            <div className="flex flex-col md:flex-row items-center gap-1 md:gap-4">
              <div className="rounded-lg bg-emerald-100 p-1.5 md:p-2">
                <CheckCircle2 className="h-4 w-4 md:h-5 md:w-5 text-emerald-700" />
              </div>
              <div className="text-center md:text-left">
                <p className="text-lg md:text-2xl font-bold">{approvedCount}</p>
                <p className="text-[10px] md:text-sm text-muted-foreground">Approved</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-2 md:p-4">
            <div className="flex flex-col md:flex-row items-center gap-1 md:gap-4">
              <div className="rounded-lg bg-blue-100 p-1.5 md:p-2">
                <Archive className="h-4 w-4 md:h-5 md:w-5 text-blue-700" />
              </div>
              <div className="text-center md:text-left">
                <p className="text-lg md:text-2xl font-bold">{releasedCount}</p>
                <p className="text-[10px] md:text-sm text-muted-foreground">Released</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-2 md:p-4">
            <div className="flex flex-col md:flex-row items-center gap-1 md:gap-4">
              <div className="rounded-lg bg-primary/10 p-1.5 md:p-2">
                <FileText className="h-4 w-4 md:h-5 md:w-5 text-primary" />
              </div>
              <div className="text-center md:text-left">
                <p className="text-lg md:text-2xl font-bold">{mockRequests.length}</p>
                <p className="text-[10px] md:text-sm text-muted-foreground">Total</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Search */}
      <motion.div variants={itemVariants} className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input 
          placeholder="Search requests..." 
          className="pl-10 h-9 md:h-10 text-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </motion.div>

      {/* Requests Table */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader className="p-3 md:p-6 pb-2 md:pb-4">
            <CardTitle className="text-base md:text-lg">Document Requests</CardTitle>
            <CardDescription className="text-xs md:text-sm">Process pending requests and manage approvals</CardDescription>
          </CardHeader>
          <CardContent className="p-3 md:p-6 pt-0">
            <Tabs defaultValue="pending">
              <TabsList className="h-8 md:h-9 w-full justify-start overflow-x-auto">
                <TabsTrigger value="pending" className="text-xs md:text-sm px-2 md:px-3">Pending ({pendingCount})</TabsTrigger>
                <TabsTrigger value="approved" className="text-xs md:text-sm px-2 md:px-3">For Pickup</TabsTrigger>
                <TabsTrigger value="all" className="text-xs md:text-sm px-2 md:px-3">All Requests</TabsTrigger>
              </TabsList>
              <TabsContent value="pending" className="mt-3 md:mt-4">
                <div className="rounded-md border overflow-x-auto md:overflow-x-visible">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-xs md:text-sm">Request ID</TableHead>
                        <TableHead className="text-xs md:text-sm hidden sm:table-cell">Type</TableHead>
                        <TableHead className="text-xs md:text-sm hidden md:table-cell">Requester</TableHead>
                        <TableHead className="text-xs md:text-sm hidden lg:table-cell">Date</TableHead>
                        <TableHead className="text-xs md:text-sm text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockRequests.filter(r => r.status === "pending").map((request) => (
                        <TableRow key={request.id}>
                          <TableCell className="font-medium text-xs md:text-sm py-2 md:py-4">{request.id}</TableCell>
                          <TableCell className="text-xs md:text-sm py-2 md:py-4 hidden sm:table-cell truncate">{request.type}</TableCell>
                          <TableCell className="py-2 md:py-4 hidden md:table-cell">
                            <div>
                              <p className="font-medium text-xs md:text-sm">{request.requester}</p>
                              <p className="text-[10px] md:text-xs text-muted-foreground">{request.purok}</p>
                            </div>
                          </TableCell>
                          <TableCell className="text-xs md:text-sm py-2 md:py-4 hidden lg:table-cell whitespace-nowrap">{request.date}</TableCell>
                          <TableCell className="py-2 md:py-4 text-right">
                            <div className="flex gap-1 md:gap-2 justify-end">
                              <Button 
                                variant="outline" 
                                size="sm"
                                className="h-7 md:h-8 px-2 md:px-3 text-xs flex-shrink-0"
                                onClick={() => setSelectedRequest(request)}
                              >
                                <Eye className="h-3 w-3 md:mr-1" />
                                <span className="hidden md:inline">View</span>
                              </Button>
                              {request.documentsUploaded && (
                                <Button 
                                  size="sm"
                                  className="h-7 md:h-8 px-2 md:px-3 text-xs bg-emerald-600 hover:bg-emerald-700 flex-shrink-0"
                                  onClick={() => {
                                    setSelectedRequest(request)
                                    setShowApproveDialog(true)
                                  }}
                                >
                                  <CheckCircle2 className="h-3 w-3 md:mr-1" />
                                  <span className="hidden md:inline">Approve</span>
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
              <TabsContent value="approved" className="mt-3 md:mt-4">
                <div className="rounded-md border overflow-x-auto md:overflow-x-visible">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-xs md:text-sm">Request ID</TableHead>
                        <TableHead className="text-xs md:text-sm hidden sm:table-cell">Type</TableHead>
                        <TableHead className="text-xs md:text-sm hidden md:table-cell">Requester</TableHead>
                        <TableHead className="text-xs md:text-sm text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockRequests.filter(r => r.status === "approved").map((request) => (
                        <TableRow key={request.id}>
                          <TableCell className="font-medium text-xs md:text-sm py-2 md:py-4">{request.id}</TableCell>
                          <TableCell className="text-xs md:text-sm py-2 md:py-4 hidden sm:table-cell truncate">{request.type}</TableCell>
                          <TableCell className="text-xs md:text-sm py-2 md:py-4 hidden md:table-cell">{request.requester}</TableCell>
                          <TableCell className="py-2 md:py-4 text-right">
                            <div className="flex gap-1 md:gap-2 justify-end">
                              <Button variant="outline" size="sm" className="h-7 md:h-8 px-2 md:px-3 text-xs flex-shrink-0" onClick={() => {
                                setPrintRequest(request)
                                setShowPrintDocument(true)
                              }}>
                                <Printer className="h-3 w-3 md:mr-1" />
                                <span className="hidden md:inline">Print</span>
                              </Button>
                              <Button size="sm" className="h-7 md:h-8 px-2 md:px-3 text-xs bg-emerald-600 hover:bg-emerald-700 flex-shrink-0">
                                <CheckCircle2 className="h-3 w-3 md:mr-1" />
                                <span className="hidden lg:inline">Released</span>
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>
              <TabsContent value="all" className="mt-3 md:mt-4">
                <div className="rounded-md border overflow-x-auto md:overflow-x-visible">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-xs md:text-sm">Request ID</TableHead>
                        <TableHead className="text-xs md:text-sm hidden sm:table-cell">Type</TableHead>
                        <TableHead className="text-xs md:text-sm hidden md:table-cell">Requester</TableHead>
                        <TableHead className="text-xs md:text-sm">Status</TableHead>
                        <TableHead className="text-xs md:text-sm text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockRequests.map((request) => (
                        <TableRow key={request.id}>
                          <TableCell className="font-medium text-xs md:text-sm py-2 md:py-4">{request.id}</TableCell>
                          <TableCell className="text-xs md:text-sm py-2 md:py-4 hidden sm:table-cell truncate">{request.type}</TableCell>
                          <TableCell className="text-xs md:text-sm py-2 md:py-4 hidden md:table-cell">{request.requester}</TableCell>
                          <TableCell className="py-2 md:py-4">{getStatusBadge(request.status)}</TableCell>
                          <TableCell className="py-2 md:py-4 text-right">
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="h-7 md:h-8 px-2 md:px-3 text-xs flex-shrink-0"
                              onClick={() => setSelectedRequest(request)}
                            >
                              <Eye className="h-3 w-3" />
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
      </motion.div>

      {/* Request Details Modal - with Document Header */}
      <Dialog open={!!selectedRequest && !showApproveDialog} onOpenChange={() => setSelectedRequest(null)}>
        <DialogContent className="w-[95vw] max-w-2xl sm:w-full">
          <DocumentHeader />
          <DialogHeader>
            <DialogTitle className="text-base md:text-lg">Request Details</DialogTitle>
            <DialogDescription className="text-xs md:text-sm">
              View complete request information
            </DialogDescription>
          </DialogHeader>
          {selectedRequest && (
            <div className="space-y-3 md:space-y-4 max-h-[60vh] overflow-y-auto pr-2">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <span className="font-medium text-sm md:text-base">{selectedRequest.id}</span>
                {getStatusBadge(selectedRequest.status)}
              </div>
              <div className="grid gap-2 md:gap-3 grid-cols-1 sm:grid-cols-2">
                <div>
                  <p className="text-[10px] md:text-xs text-muted-foreground">Document Type</p>
                  <p className="font-medium text-sm md:text-base">{selectedRequest.type}</p>
                </div>
                <div>
                  <p className="text-[10px] md:text-xs text-muted-foreground">Purpose</p>
                  <p className="font-medium text-sm md:text-base">{selectedRequest.purpose}</p>
                </div>
                <div>
                  <p className="text-[10px] md:text-xs text-muted-foreground">Requester</p>
                  <p className="font-medium text-sm md:text-base">{selectedRequest.requester}</p>
                </div>
                <div>
                  <p className="text-[10px] md:text-xs text-muted-foreground">Purok</p>
                  <p className="font-medium text-sm md:text-base">{selectedRequest.purok}</p>
                </div>
                <div>
                  <p className="text-[10px] md:text-xs text-muted-foreground">Fee</p>
                  <p className="font-medium text-sm md:text-base">PHP {selectedRequest.fee}</p>
                </div>
                <div>
                  <p className="text-[10px] md:text-xs text-muted-foreground">Date</p>
                  <p className="font-medium text-sm md:text-base">{selectedRequest.date}</p>
                </div>
              </div>
            </div>
          )}
          <DialogFooter className="flex-col-reverse sm:flex-row gap-2 pt-4">
            <Button variant="outline" size="sm" className="w-full sm:w-auto" onClick={() => setSelectedRequest(null)}>Close</Button>
            {selectedRequest?.status === "pending" && selectedRequest.documentsUploaded && (
              <>
                <Button variant="destructive" size="sm" className="w-full sm:w-auto">Reject</Button>
                <Button size="sm" className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700" onClick={() => setShowApproveDialog(true)}>Approve</Button>
              </>
            )}
            {selectedRequest?.status === "approved" && (
              <Button size="sm" className="w-full sm:w-auto" onClick={() => {
                setPrintRequest(selectedRequest)
                setTimeout(() => window.print(), 100)
              }}>
                <Printer className="mr-2 h-3 w-3" />
                Print Document
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Approve Dialog */}
      <Dialog open={showApproveDialog} onOpenChange={setShowApproveDialog}>
        <DialogContent className="mx-4 md:mx-auto">
          <DocumentHeader />
          <DialogHeader>
            <DialogTitle className="text-base md:text-lg">Approve Request</DialogTitle>
            <DialogDescription className="text-xs md:text-sm">
              Set pickup details for the approved document
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 md:space-y-4 py-2 md:py-4">
            <div className="space-y-1 md:space-y-2">
              <Label className="text-xs md:text-sm">Pickup Date</Label>
              <Input type="date" className="h-8 md:h-10 text-sm" />
            </div>
            <div className="space-y-1 md:space-y-2">
              <Label className="text-xs md:text-sm">Pickup Time</Label>
              <Input type="time" className="h-8 md:h-10 text-sm" />
            </div>
            <div className="space-y-1 md:space-y-2">
              <Label className="text-xs md:text-sm">Fee Amount</Label>
              <Input defaultValue={selectedRequest?.fee} placeholder="Enter fee" className="h-8 md:h-10 text-sm" />
            </div>
            <div className="space-y-1 md:space-y-2">
              <Label className="text-xs md:text-sm">Notes (Optional)</Label>
              <Textarea placeholder="Additional instructions..." className="text-sm min-h-[60px] md:min-h-[80px]" />
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" size="sm" onClick={() => setShowApproveDialog(false)}>Cancel</Button>
            <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700" onClick={() => {
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
        <DialogContent className="max-w-2xl mx-4 md:mx-auto">
          <DocumentHeader />
          <DialogHeader>
            <DialogTitle className="text-base md:text-lg">Document Archive</DialogTitle>
            <DialogDescription className="text-xs md:text-sm">
              View all released documents
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 md:space-y-4">
            <div className="flex gap-2">
              <Input placeholder="Search archive..." className="flex-1 h-8 md:h-10 text-sm" />
              <Button variant="outline" size="sm" className="h-8 md:h-10 text-xs">
                <Download className="h-3 w-3 md:mr-2" />
                <span className="hidden md:inline">Export CSV</span>
              </Button>
            </div>
            <div className="rounded-md border overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-xs md:text-sm">ID</TableHead>
                    <TableHead className="text-xs md:text-sm hidden sm:table-cell">Type</TableHead>
                    <TableHead className="text-xs md:text-sm">Requester</TableHead>
                    <TableHead className="text-xs md:text-sm hidden md:table-cell">Release Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {archivedDocuments.map((doc) => (
                    <TableRow key={doc.id}>
                      <TableCell className="font-medium text-xs md:text-sm py-2 md:py-4">{doc.id}</TableCell>
                      <TableCell className="text-xs md:text-sm py-2 md:py-4 hidden sm:table-cell">{doc.type}</TableCell>
                      <TableCell className="text-xs md:text-sm py-2 md:py-4">{doc.requester}</TableCell>
                      <TableCell className="text-xs md:text-sm py-2 md:py-4 hidden md:table-cell">{doc.releaseDate}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => setShowArchive(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Print Document Dialog - Hidden, prints directly */}
      <Dialog open={false} onOpenChange={setShowPrintDocument}>
        <DialogContent className="w-[95vw] max-w-4xl sm:w-full max-h-[95vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-base md:text-lg">Document Preview</DialogTitle>
          </DialogHeader>
          {printRequest && (
            <div id="print-document" className="bg-white p-4 md:p-8 text-black print:p-4">
              {/* Document Header with Logos */}
              <div className="flex items-center justify-between mb-4 md:mb-6 pb-4 border-b-2 border-black">
                <Image src="/images/santiago.jpg" alt="Barangay Santiago" width={60} height={60} className="w-12 h-12 md:w-16 md:h-16 rounded-full object-cover" />
                <div className="text-center flex-1 px-2">
                  <p className="text-xs md:text-sm font-semibold">REPUBLIC OF THE PHILIPPINES</p>
                  <p className="text-xs md:text-sm">PROVINCE OF ZAMBALES</p>
                  <p className="text-xs md:text-sm">MUNICIPALITY OF SAN ANTONIO</p>
                  <p className="text-xs md:text-sm font-bold">BARANGAY SANTIAGO</p>
                  <p className="text-xs md:text-sm mt-2">OFFICE OF THE BARANGAY CAPTAIN</p>
                  <p className="text-sm md:text-base font-bold mt-3 uppercase">{printRequest.type}</p>
                </div>
                <Image src="/images/saz.jpg" alt="City of Santiago" width={60} height={60} className="w-12 h-12 md:w-16 md:h-16 rounded-full object-cover" />
              </div>

              {/* Document Body */}
              <div className="space-y-4 text-xs md:text-sm leading-relaxed">
                <p>TO WHOM IT MAY CONCERN:</p>

                {printRequest.type === "Barangay Clearance" && (
                  <>
                    <p>This is to certify that <span className="font-bold underline">{printRequest.requester}</span>, a resident of Barangay Santiago, San Antonio, Zambales, is of good moral character and has no derogatory record on file in this office.</p>
                    <p>This certification is issued upon request for <span className="font-bold underline">{printRequest.purpose}</span>.</p>
                  </>
                )}

                {printRequest.type === "Certificate of Residency" && (
                  <>
                    <p>This is to certify that <span className="font-bold underline">{printRequest.requester}</span> is a bonafide resident of Barangay Santiago, San Antonio, Zambales.</p>
                    <p>This certification is issued upon request for <span className="font-bold underline">{printRequest.purpose}</span>.</p>
                  </>
                )}

                {printRequest.type === "Certificate of Indigency" && (
                  <>
                    <p>This is to certify that <span className="font-bold underline">{printRequest.requester}</span> is a resident of Barangay Santiago, San Antonio, Zambales, and belongs to an indigent family in this barangay.</p>
                    <p>This certification is issued upon request for <span className="font-bold underline">{printRequest.purpose}</span>.</p>
                  </>
                )}

                {printRequest.type === "Business Clearance" && (
                  <>
                    <p>This is to certify that <span className="font-bold underline">{printRequest.requester}</span>, owner/operator of <span className="font-bold underline">{printRequest.purpose}</span>, located at Barangay Santiago, San Antonio, Zambales, has been granted clearance to operate their business in this barangay.</p>
                    <p>This certification is issued upon request for business operations.</p>
                  </>
                )}

                <p>Issued this <span className="font-bold underline">{new Date().toLocaleDateString('en-US', { month: 'long', day: '2-digit', year: 'numeric' })}</span>.</p>

                <div className="mt-8 pt-4">
                  <div className="inline-block">
                    <div className="w-48 border-b border-black mb-1 h-12" />
                    <p className="font-bold text-center">ROLANDO C. BORJA</p>
                    <p className="text-center">Barangay Captain</p>
                  </div>
                </div>

                <div className="mt-8 pt-4 space-y-1">
                  <p>O.R. No.: ____________________</p>
                  <p>Date Issued: _________________</p>
                  <p>Doc. Stamp: Paid</p>
                </div>
              </div>
            </div>
          )}
          <DialogFooter className="flex-col-reverse sm:flex-row gap-2 pt-4">
            <Button variant="outline" size="sm" onClick={() => setShowPrintDocument(false)}>Close</Button>
            <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700" onClick={() => window.print()}>
              <Printer className="mr-2 h-3 w-3" />
              Print Document
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Manage Document Types Dialog */}
      <Dialog open={showManageTypes} onOpenChange={setShowManageTypes}>
        <DialogContent className="w-[95vw] max-w-2xl sm:w-full max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-base md:text-lg">Manage Document Types</DialogTitle>
            <DialogDescription className="text-xs md:text-sm">
              Create, edit, and manage document types with requirements
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 md:space-y-5">
            {/* Add New Type Form */}
            <div className="rounded-lg border p-3 md:p-4 bg-blue-50 dark:bg-blue-950/20">
              <div className="flex items-center gap-2 mb-3">
                <Plus className="w-4 h-4 text-blue-600" />
                <p className="text-xs md:text-sm font-semibold">Add New Document Type</p>
              </div>
              <div className="space-y-3">
                <div>
                  <Label className="text-xs md:text-sm">Document Type Name</Label>
                  <Input 
                    placeholder="e.g., Barangay Clearance"
                    value={newTypeName}
                    onChange={(e) => setNewTypeName(e.target.value)}
                    className="h-8 md:h-10 text-xs md:text-sm mt-1"
                  />
                </div>
                
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label className="text-xs md:text-sm">Requirements</Label>
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      className="h-6 px-2 gap-1"
                      onClick={() => {
                        setNewTypeRequirements([...newTypeRequirements, ""])
                      }}
                    >
                      <Plus className="w-3 h-3" />
                      <span className="text-xs">Add</span>
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {newTypeRequirements.map((requirement, index) => (
                      <div key={index} className="flex gap-2">
                        <Input 
                          placeholder={`Requirement ${index + 1}`}
                          value={requirement}
                          onChange={(e) => {
                            const updated = [...newTypeRequirements]
                            updated[index] = e.target.value
                            setNewTypeRequirements(updated)
                          }}
                          className="h-8 md:h-10 text-xs md:text-sm flex-1"
                        />
                        {newTypeRequirements.length > 1 && (
                          <Button 
                            size="sm" 
                            variant="ghost"
                            className="h-8 w-8 p-0"
                            onClick={() => {
                              setNewTypeRequirements(newTypeRequirements.filter((_, i) => i !== index))
                            }}
                          >
                            <Trash2 className="w-3 h-3 text-red-500" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <Label className="text-xs md:text-sm">Fee</Label>
                  <Input 
                    placeholder="e.g., 50 or Free"
                    value={newTypeFee}
                    onChange={(e) => setNewTypeFee(e.target.value)}
                    className="h-8 md:h-10 text-xs md:text-sm mt-1"
                  />
                </div>
                
                <Button 
                  size="sm" 
                  className="w-full gap-2 bg-blue-600 hover:bg-blue-700 mt-2"
                  onClick={() => {
                    if (newTypeName.trim()) {
                      const newType = {
                        id: Math.random().toString(),
                        name: newTypeName,
                        requirements: newTypeRequirements.filter(r => r.trim()).join(", "),
                        fee: newTypeFee
                      }
                      setDocumentTypes([...documentTypes, newType])
                      setNewTypeName("")
                      setNewTypeRequirements([""])
                      setNewTypeFee("")
                    }
                  }}
                >
                  <Plus className="w-3 h-3" />
                  Add Type
                </Button>
              </div>
            </div>

            {/* Existing Types List */}
            <div className="space-y-2">
              <p className="text-xs md:text-sm font-semibold">Existing Document Types</p>
              <div className="space-y-2 max-h-[40vh] overflow-y-auto">
                {documentTypes.map((type) => (
                  <div key={type.id} className="p-3 border rounded-lg bg-muted/50">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-xs md:text-sm">{type.name}</p>
                        <p className="text-[10px] md:text-xs text-muted-foreground mt-1">Requirements: {type.requirements}</p>
                        <p className="text-[10px] md:text-xs text-muted-foreground">Fee: {type.fee}</p>
                      </div>
                      <div className="flex gap-1 flex-shrink-0">
                        <Button 
                          size="sm" 
                          variant="ghost"
                          className="h-7 w-7 p-0"
                          onClick={() => {
                            setEditingType(type)
                            setNewTypeName(type.name)
                            setNewTypeRequirements(type.requirements.split(", "))
                            setNewTypeFee(type.fee)
                          }}
                        >
                          <Edit2 className="w-3 h-3 text-blue-500" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="ghost"
                          className="h-7 w-7 p-0"
                          onClick={() => {
                            setDocumentTypes(documentTypes.filter(t => t.id !== type.id))
                          }}
                        >
                          <Trash2 className="w-3 h-3 text-red-500" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <DialogFooter className="flex-col-reverse sm:flex-row gap-2 pt-4">
            <Button variant="outline" size="sm" onClick={() => {
              setShowManageTypes(false)
              setEditingType(null)
              setNewTypeName("")
              setNewTypeRequirements([""])
              setNewTypeFee("")
            }}>
              Close
            </Button>
            <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700" onClick={() => {
              setShowManageTypes(false)
              setEditingType(null)
            }}>
              Done
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  )
}
