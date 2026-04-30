"use client"

import { useMemo, useState } from "react"
import { motion } from "framer-motion"
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
  Edit2,
  ListChecks,
} from "lucide-react"
import { toast } from "sonner"
import { exportToOfficialExcel } from "@/lib/excel-export"
import { printDocument } from "@/lib/print-document"

interface Request {
  id: string
  type: string
  purpose: string
  requester: string
  email: string
  purok: string
  status: "pending" | "approved" | "rejected" | "released"
  date: string
  fee: string
  pickupTime?: string
  releaseDate?: string
  documentsUploaded: boolean
  uploadedImage?: string
}

const initialRequests: Request[] = [
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
    documentsUploaded: true,
    uploadedImage: "/placeholder.jpg",
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
    documentsUploaded: true,
    uploadedImage: "/placeholder.jpg",
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
    documentsUploaded: false,
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
    documentsUploaded: true,
    uploadedImage: "/placeholder.jpg",
  },
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
          <CheckCircle2 className="mr-1 h-3 w-3" />
          Approved
        </Badge>
      )
    case "pending":
      return (
        <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100 text-[10px] md:text-xs">
          <Clock className="mr-1 h-3 w-3" />
          Pending
        </Badge>
      )
    case "rejected":
      return (
        <Badge className="bg-red-100 text-red-700 hover:bg-red-100 text-[10px] md:text-xs">
          <XCircle className="mr-1 h-3 w-3" />
          Rejected
        </Badge>
      )
    case "released":
      return (
        <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 text-[10px] md:text-xs">
          <Archive className="mr-1 h-3 w-3" />
          Released
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

function formatPHDate(date = new Date()) {
  return date.toLocaleDateString("en-PH", { year: "numeric", month: "long", day: "numeric" })
}

function buildPrintHtml(req: Request, releaseDate: string): string {
  const certBody = (() => {
    switch (req.type) {
      case "Barangay Clearance":
        return `
          <p>This is to certify that <strong>${req.requester}</strong>, of legal age, a bonafide resident of <strong>${req.purok}, Barangay Santiago, San Antonio, Zambales</strong>, is known to be of good moral character and reputation in the community.</p>
          <p>Based on the records of this office, the above-named person has no derogatory record nor any pending criminal case filed against him/her.</p>
          <p>This certification is issued upon the request of the above-named person for <strong>${req.purpose}</strong>.</p>
        `
      case "Certificate of Residency":
        return `
          <p>This is to certify that <strong>${req.requester}</strong> is a bonafide resident of <strong>${req.purok}, Barangay Santiago, San Antonio, Zambales</strong>.</p>
          <p>This certification is issued upon the request of the above-named person for <strong>${req.purpose}</strong>.</p>
        `
      case "Certificate of Indigency":
        return `
          <p>This is to certify that <strong>${req.requester}</strong> is a bonafide resident of <strong>${req.purok}, Barangay Santiago, San Antonio, Zambales</strong>, and belongs to an indigent family in this barangay.</p>
          <p>This certification is issued upon the request of the above-named person for <strong>${req.purpose}</strong>.</p>
        `
      case "Business Clearance":
        return `
          <p>This is to certify that <strong>${req.requester}</strong>, owner/operator of <strong>${req.purpose}</strong>, located at <strong>${req.purok}, Barangay Santiago, San Antonio, Zambales</strong>, has been granted clearance to operate said business in this barangay.</p>
          <p>This certification is issued for whatever legal purpose it may serve.</p>
        `
      default:
        return `
          <p>This certification is issued in favor of <strong>${req.requester}</strong>, a bonafide resident of <strong>${req.purok}, Barangay Santiago, San Antonio, Zambales</strong>, for the purpose of <strong>${req.purpose}</strong>.</p>
        `
    }
  })()

  return `
    <h2>${req.type}</h2>
    <p style="text-align:center; font-style:italic; margin-top:-6px;">Office of the Barangay Captain</p>
    <p style="margin-top:24px;"><strong>TO WHOM IT MAY CONCERN:</strong></p>
    ${certBody}
    <p style="margin-top:24px;">Issued this <strong>${releaseDate}</strong> at Barangay Santiago, San Antonio, Zambales.</p>
    <table style="width:100%; margin-top:48px;">
      <tr>
        <td style="width:50%; vertical-align:top;">
          <div><span class="field">O.R. No.:</span> ____________________</div>
          <div><span class="field">Date Issued:</span> ${releaseDate}</div>
          <div><span class="field">Doc. Stamp:</span> Paid</div>
          <div><span class="field">Fee:</span> PHP ${req.fee}</div>
        </td>
        <td style="width:50%; text-align:center; vertical-align:bottom;">
          <div style="margin-top:36px; border-top:1px solid #000; padding-top:4px; display:inline-block; min-width:240px;">
            <div style="font-weight:bold; text-transform:uppercase;">ROLANDO C. BORJA</div>
            <div style="font-style:italic;">Punong Barangay</div>
          </div>
        </td>
      </tr>
    </table>
  `
}

export default function OfficialDocumentsPage() {
  const [requests, setRequests] = useState<Request[]>(initialRequests)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null)
  const [showApproveDialog, setShowApproveDialog] = useState(false)
  const [pickupDate, setPickupDate] = useState("")
  const [pickupTime, setPickupTime] = useState("")
  const [pickupFee, setPickupFee] = useState("")
  const [showArchive, setShowArchive] = useState(false)
  const [showManageTypes, setShowManageTypes] = useState(false)
  const [showInventory, setShowInventory] = useState(false)
  const [documentTypes, setDocumentTypes] = useState(defaultDocumentTypes)
  const [, setEditingType] = useState<typeof defaultDocumentTypes[0] | null>(null)
  const [newTypeName, setNewTypeName] = useState("")
  const [newTypeRequirements, setNewTypeRequirements] = useState<string[]>([""])
  const [newTypeFee, setNewTypeFee] = useState("")
  const [imagePreview, setImagePreview] = useState<{ src: string; title: string } | null>(null)

  // Inventory filters
  const [invFromDate, setInvFromDate] = useState("")
  const [invToDate, setInvToDate] = useState("")
  const [invDocType, setInvDocType] = useState("all")

  const pendingCount = requests.filter(r => r.status === "pending").length
  const approvedCount = requests.filter(r => r.status === "approved").length
  const releasedCount = requests.filter(r => r.status === "released").length

  const filteredRequests = useMemo(() => {
    const q = searchTerm.toLowerCase()
    return requests.filter(r =>
      r.id.toLowerCase().includes(q) ||
      r.type.toLowerCase().includes(q) ||
      r.requester.toLowerCase().includes(q) ||
      r.email.toLowerCase().includes(q)
    )
  }, [requests, searchTerm])

  const archivedDocuments = requests.filter(r => r.status === "released")

  const handleReject = (id: string) => {
    setRequests(prev => prev.map(r => r.id === id ? { ...r, status: "rejected" } : r))
    setSelectedRequest(null)
    toast.success("Request rejected")
  }

  const handleApproveSubmit = () => {
    if (!selectedRequest) return
    const pickupStr = pickupDate
      ? `${formatPHDate(new Date(pickupDate))}${pickupTime ? `, ${pickupTime}` : ""}`
      : ""
    setRequests(prev => prev.map(r => r.id === selectedRequest.id ? {
      ...r,
      status: "approved",
      pickupTime: pickupStr || r.pickupTime,
      fee: pickupFee || r.fee,
    } : r))
    setShowApproveDialog(false)
    setSelectedRequest(null)
    setPickupDate("")
    setPickupTime("")
    setPickupFee("")
    toast.success("Request approved")
  }

  const handleMarkReleased = (req: Request) => {
    const today = formatPHDate()
    setRequests(prev => prev.map(r => r.id === req.id ? {
      ...r, status: "released", releaseDate: today,
    } : r))
    toast.success("Marked as released")
  }

  const handlePrint = (req: Request) => {
    const today = formatPHDate()
    // If not yet released, mark released with today's date (autofill)
    const releaseDate = req.releaseDate || today
    if (!req.releaseDate) {
      setRequests(prev => prev.map(r => r.id === req.id ? {
        ...r, status: "released", releaseDate: today,
      } : r))
    }
    printDocument({
      title: `${req.type} — ${req.requester}`,
      bodyHtml: buildPrintHtml(req, releaseDate),
    })
  }

  const handleArchiveExport = async () => {
    try {
      await exportToOfficialExcel({
        title: "RELEASED DOCUMENTS ARCHIVE",
        subtitle: `As of ${formatPHDate()}`,
        filename: `barangay-santiago-archive-${new Date().toISOString().slice(0, 10)}.xlsx`,
        sheetName: "Archive",
        columns: [
          { header: "ID", key: "id", width: 16 },
          { header: "Type", key: "type", width: 26 },
          { header: "Requester", key: "requester", width: 24 },
          { header: "Purok", key: "purok", width: 12 },
          { header: "Purpose", key: "purpose", width: 26 },
          { header: "Fee (PHP)", key: "fee", width: 10 },
          { header: "Release Date", key: "releaseDate", width: 18 },
        ],
        rows: archivedDocuments.map(d => ({
          id: d.id,
          type: d.type,
          requester: d.requester,
          purok: d.purok,
          purpose: d.purpose,
          fee: d.fee,
          releaseDate: d.releaseDate || "",
        })),
      })
      toast.success("Archive exported")
    } catch (e) {
      console.error(e)
      toast.error("Failed to export archive")
    }
  }

  const handleInventoryExport = async () => {
    if (!invFromDate || !invToDate) {
      toast.error("Please select both From and To dates")
      return
    }
    const from = new Date(invFromDate)
    const to = new Date(invToDate)
    to.setHours(23, 59, 59, 999)
    const filtered = requests.filter(r => {
      if (!r.documentsUploaded) return false
      if (invDocType !== "all" && r.type !== invDocType) return false
      const d = new Date(r.date)
      return d >= from && d <= to
    })
    if (filtered.length === 0) {
      toast.error("No records match the selected filters")
      return
    }
    try {
      await exportToOfficialExcel({
        title: "DOCUMENT REQUEST INVENTORY",
        subtitle: `${invDocType === "all" ? "All Types" : invDocType} · ${formatPHDate(from)} to ${formatPHDate(to)}`,
        filename: `barangay-santiago-inventory-${invFromDate}-to-${invToDate}.xlsx`,
        sheetName: "Inventory",
        columns: [
          { header: "ID", key: "id", width: 16 },
          { header: "Type", key: "type", width: 26 },
          { header: "Requester", key: "requester", width: 24 },
          { header: "Email", key: "email", width: 24 },
          { header: "Purok", key: "purok", width: 12 },
          { header: "Purpose", key: "purpose", width: 26 },
          { header: "Status", key: "status", width: 14 },
          { header: "Fee (PHP)", key: "fee", width: 10 },
          { header: "Date Filed", key: "date", width: 18 },
          { header: "Release Date", key: "releaseDate", width: 18 },
        ],
        rows: filtered.map(r => ({
          id: r.id,
          type: r.type,
          requester: r.requester,
          email: r.email,
          purok: r.purok,
          purpose: r.purpose,
          status: r.status.toUpperCase(),
          fee: r.fee,
          date: r.date,
          releaseDate: r.releaseDate || "",
        })),
      })
      toast.success(`Exported ${filtered.length} records`)
    } catch (e) {
      console.error(e)
      toast.error("Failed to export inventory")
    }
  }

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
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" className="h-8 text-xs" onClick={() => setShowInventory(true)}>
            <ListChecks className="h-3 w-3 md:mr-2" />
            <span className="hidden md:inline">Inventory</span>
          </Button>
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

      {/* Stats — compact, ratio 2/1/1/4 */}
      <motion.div variants={itemVariants} className="grid grid-cols-8 gap-2 md:gap-3">
        <Card className="col-span-2">
          <CardContent className="p-2 md:p-3">
            <div className="flex items-center gap-1.5">
              <div className="rounded-md bg-amber-100 p-1.5">
                <Clock className="h-3.5 w-3.5 md:h-4 md:w-4 text-amber-700" />
              </div>
              <div className="min-w-0">
                <p className="text-base md:text-lg font-bold leading-none">{pendingCount}</p>
                <p className="text-[9px] md:text-xs text-muted-foreground truncate">Pending</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="col-span-1">
          <CardContent className="p-2 md:p-3">
            <div className="flex items-center gap-1.5">
              <div className="rounded-md bg-emerald-100 p-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 md:h-4 md:w-4 text-emerald-700" />
              </div>
              <div className="min-w-0">
                <p className="text-base md:text-lg font-bold leading-none">{approvedCount}</p>
                <p className="text-[9px] md:text-xs text-muted-foreground truncate">Approved</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="col-span-1">
          <CardContent className="p-2 md:p-3">
            <div className="flex items-center gap-1.5">
              <div className="rounded-md bg-blue-100 p-1.5">
                <Archive className="h-3.5 w-3.5 md:h-4 md:w-4 text-blue-700" />
              </div>
              <div className="min-w-0">
                <p className="text-base md:text-lg font-bold leading-none">{releasedCount}</p>
                <p className="text-[9px] md:text-xs text-muted-foreground truncate">Released</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="col-span-4">
          <CardContent className="p-2 md:p-3">
            <div className="flex items-center gap-2">
              <div className="rounded-md bg-primary/10 p-1.5">
                <FileText className="h-3.5 w-3.5 md:h-4 md:w-4 text-primary" />
              </div>
              <div className="min-w-0">
                <p className="text-base md:text-lg font-bold leading-none">{requests.length}</p>
                <p className="text-[9px] md:text-xs text-muted-foreground truncate">Total Requests</p>
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
                <TabsTrigger value="approved" className="text-xs md:text-sm px-2 md:px-3">For Pickup ({approvedCount})</TabsTrigger>
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
                      {filteredRequests.filter(r => r.status === "pending").map((request) => (
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
                        <TableHead className="text-xs md:text-sm hidden lg:table-cell">Pickup Time</TableHead>
                        <TableHead className="text-xs md:text-sm text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredRequests.filter(r => r.status === "approved").map((request) => (
                        <TableRow key={request.id}>
                          <TableCell className="font-medium text-xs md:text-sm py-2 md:py-4">{request.id}</TableCell>
                          <TableCell className="text-xs md:text-sm py-2 md:py-4 hidden sm:table-cell truncate">{request.type}</TableCell>
                          <TableCell className="text-xs md:text-sm py-2 md:py-4 hidden md:table-cell">{request.requester}</TableCell>
                          <TableCell className="text-xs md:text-sm py-2 md:py-4 hidden lg:table-cell">{request.pickupTime}</TableCell>
                          <TableCell className="py-2 md:py-4 text-right">
                            <div className="flex gap-1 md:gap-2 justify-end">
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="h-7 md:h-8 px-2 md:px-3 text-xs flex-shrink-0"
                                onClick={() => handlePrint(request)}
                              >
                                <Printer className="h-3 w-3 md:mr-1" />
                                <span className="hidden md:inline">Print</span>
                              </Button>
                              <Button 
                                size="sm" 
                                className="h-7 md:h-8 px-2 md:px-3 text-xs bg-emerald-600 hover:bg-emerald-700 flex-shrink-0"
                                onClick={() => handleMarkReleased(request)}
                              >
                                <CheckCircle2 className="h-3 w-3 md:mr-1" />
                                <span className="hidden md:inline">Released</span>
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
                      {filteredRequests.map((request) => (
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
                              <Eye className="h-3 w-3 md:mr-1" />
                              <span className="hidden md:inline">View</span>
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

      {/* View Request Dialog */}
      <Dialog open={!!selectedRequest && !showApproveDialog} onOpenChange={() => !showApproveDialog && setSelectedRequest(null)}>
        <DialogContent className="max-w-md md:max-w-lg">
          <DialogHeader>
            <DialogTitle>Request Details</DialogTitle>
            <DialogDescription>REQ #{selectedRequest?.id}</DialogDescription>
          </DialogHeader>
          {selectedRequest && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs md:text-sm font-semibold">Type</Label>
                  <p className="text-xs md:text-sm">{selectedRequest.type}</p>
                </div>
                <div>
                  <Label className="text-xs md:text-sm font-semibold">Status</Label>
                  <div className="mt-1">{getStatusBadge(selectedRequest.status)}</div>
                </div>
                <div className="col-span-2">
                  <Label className="text-xs md:text-sm font-semibold">Requester</Label>
                  <p className="text-xs md:text-sm">{selectedRequest.requester}</p>
                </div>
                <div className="col-span-2">
                  <Label className="text-xs md:text-sm font-semibold">Email</Label>
                  <p className="text-xs md:text-sm">{selectedRequest.email}</p>
                </div>
                <div>
                  <Label className="text-xs md:text-sm font-semibold">Purok</Label>
                  <p className="text-xs md:text-sm">{selectedRequest.purok}</p>
                </div>
                <div>
                  <Label className="text-xs md:text-sm font-semibold">Fee</Label>
                  <p className="text-xs md:text-sm">PHP {selectedRequest.fee}</p>
                </div>
                <div className="col-span-2">
                  <Label className="text-xs md:text-sm font-semibold">Purpose</Label>
                  <p className="text-xs md:text-sm">{selectedRequest.purpose}</p>
                </div>
                <div className="col-span-2">
                  <Label className="text-xs md:text-sm font-semibold">Date Filed</Label>
                  <p className="text-xs md:text-sm">{selectedRequest.date}</p>
                </div>
              </div>
              {selectedRequest.documentsUploaded && (
                <div>
                  <Label className="text-xs md:text-sm font-semibold">Documents</Label>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full mt-2 text-xs"
                    onClick={() => setImagePreview({ src: selectedRequest.uploadedImage || "", title: selectedRequest.type })}
                  >
                    <Eye className="h-3 w-3 mr-2" />
                    View Uploaded Documents
                  </Button>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            {selectedRequest?.status === "pending" && selectedRequest.documentsUploaded && (
              <Button 
                className="bg-emerald-600 hover:bg-emerald-700"
                onClick={() => {
                  setShowApproveDialog(true)
                }}
              >
                Approve Request
              </Button>
            )}
            {selectedRequest?.status === "pending" && (
              <Button 
                variant="destructive"
                onClick={() => {
                  handleReject(selectedRequest.id)
                  setSelectedRequest(null)
                }}
              >
                Reject Request
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Approve Dialog */}
      <Dialog open={showApproveDialog} onOpenChange={setShowApproveDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Approve Request</DialogTitle>
            <DialogDescription>Set pickup date and fee for {selectedRequest?.requester}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="pickup-date" className="text-xs md:text-sm">Pickup Date</Label>
              <Input 
                id="pickup-date"
                type="date" 
                value={pickupDate}
                onChange={(e) => setPickupDate(e.target.value)}
                className="h-8 md:h-9 text-xs"
              />
            </div>
            <div>
              <Label htmlFor="pickup-time" className="text-xs md:text-sm">Pickup Time</Label>
              <Input 
                id="pickup-time"
                type="time" 
                value={pickupTime}
                onChange={(e) => setPickupTime(e.target.value)}
                className="h-8 md:h-9 text-xs"
              />
            </div>
            <div>
              <Label htmlFor="pickup-fee" className="text-xs md:text-sm">Fee (PHP)</Label>
              <Input 
                id="pickup-fee"
                placeholder={selectedRequest?.fee || "50"}
                value={pickupFee}
                onChange={(e) => setPickupFee(e.target.value)}
                className="h-8 md:h-9 text-xs"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowApproveDialog(false)} className="h-8 md:h-9 text-xs">Cancel</Button>
            <Button className="bg-emerald-600 hover:bg-emerald-700 h-8 md:h-9 text-xs" onClick={handleApproveSubmit}>Approve</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Archive Dialog */}
      <Dialog open={showArchive} onOpenChange={setShowArchive}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Released Documents Archive</DialogTitle>
            <DialogDescription>View and export all released documents</DialogDescription>
          </DialogHeader>
          <div className="max-h-96 overflow-y-auto rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs">ID</TableHead>
                  <TableHead className="text-xs">Type</TableHead>
                  <TableHead className="text-xs">Requester</TableHead>
                  <TableHead className="text-xs">Release Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {archivedDocuments.map(doc => (
                  <TableRow key={doc.id}>
                    <TableCell className="text-xs font-medium">{doc.id}</TableCell>
                    <TableCell className="text-xs">{doc.type}</TableCell>
                    <TableCell className="text-xs">{doc.requester}</TableCell>
                    <TableCell className="text-xs">{doc.releaseDate}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowArchive(false)} className="h-8 text-xs">Close</Button>
            <Button onClick={handleArchiveExport} className="h-8 text-xs">
              <Download className="h-3 w-3 mr-2" />
              Export Excel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Inventory Export Dialog */}
      <Dialog open={showInventory} onOpenChange={setShowInventory}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Document Inventory Export</DialogTitle>
            <DialogDescription>Generate inventory report for a date range</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="inv-from" className="text-xs md:text-sm">From Date</Label>
              <Input 
                id="inv-from"
                type="date" 
                value={invFromDate}
                onChange={(e) => setInvFromDate(e.target.value)}
                className="h-8 md:h-9 text-xs"
              />
            </div>
            <div>
              <Label htmlFor="inv-to" className="text-xs md:text-sm">To Date</Label>
              <Input 
                id="inv-to"
                type="date" 
                value={invToDate}
                onChange={(e) => setInvToDate(e.target.value)}
                className="h-8 md:h-9 text-xs"
              />
            </div>
            <div>
              <Label htmlFor="inv-type" className="text-xs md:text-sm">Document Type</Label>
              <select 
                id="inv-type"
                value={invDocType}
                onChange={(e) => setInvDocType(e.target.value)}
                className="w-full h-8 md:h-9 px-2 text-xs border rounded-md"
              >
                <option value="all">All Types</option>
                {documentTypes.map(type => (
                  <option key={type.id} value={type.name}>{type.name}</option>
                ))}
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowInventory(false)} className="h-8 text-xs">Cancel</Button>
            <Button onClick={handleInventoryExport} className="h-8 text-xs">
              <Download className="h-3 w-3 mr-2" />
              Export
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Manage Document Types Dialog */}
      <Dialog open={showManageTypes} onOpenChange={setShowManageTypes}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Manage Document Types</DialogTitle>
            <DialogDescription>Add, edit, or remove document types</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {documentTypes.map((type) => (
              <Card key={type.id} className="p-3">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <p className="font-semibold text-xs md:text-sm">{type.name}</p>
                    <p className="text-[10px] md:text-xs text-muted-foreground">{type.requirements}</p>
                    <p className="text-[10px] md:text-xs font-medium mt-1">Fee: PHP {type.fee}</p>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="h-7 px-2"
                    onClick={() => setEditingType(type)}
                  >
                    <Edit2 className="h-3 w-3" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowManageTypes(false)} className="h-8 text-xs">Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Image Preview Dialog */}
      {imagePreview && (
        <Dialog open={!!imagePreview} onOpenChange={() => setImagePreview(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{imagePreview.title}</DialogTitle>
            </DialogHeader>
            <div className="flex items-center justify-center bg-muted rounded-md p-4">
              <img src={imagePreview.src} alt={imagePreview.title} className="max-w-full max-h-96" />
            </div>
          </DialogContent>
        </Dialog>
      )}
    </motion.div>
  )
}
