"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { DocumentHeader } from "@/components/document-header"
import { 
  FileText, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Upload,
  X,
  AlertCircle,
  ChevronDown,
  ChevronUp
} from "lucide-react"

// Available document types with requirements that have upload status
const documentTypes = [
  { 
    id: "clearance", 
    name: "Barangay Clearance", 
    fee: "50", 
    requirements: [
      { name: "Valid ID", status: "empty" },
      { name: "Proof of Residency", status: "empty" }
    ] 
  },
  { 
    id: "residency", 
    name: "Certificate of Residency", 
    fee: "30", 
    requirements: [
      { name: "Valid ID", status: "empty" }
    ] 
  },
  { 
    id: "indigency", 
    name: "Certificate of Indigency", 
    fee: "Free", 
    requirements: [
      { name: "Valid ID", status: "empty" },
      { name: "Barangay Clearance", status: "empty" }
    ] 
  },
  { 
    id: "business", 
    name: "Business Clearance", 
    fee: "200", 
    requirements: [
      { name: "Valid ID", status: "empty" },
      { name: "DTI Registration", status: "empty" },
      { name: "Barangay Clearance", status: "empty" }
    ] 
  },
]

// Mock requests data
const mockRequests = [
  {
    id: "REQ-2026-001",
    type: "Barangay Clearance",
    purpose: "Employment",
    status: "approved",
    date: "April 25, 2026",
    fee: "50",
    pickupTime: "April 28, 2026, 2:00 PM",
    residentName: "Juan Dela Cruz",
    address: "Purok 3, Barangay Santiago, San Antonio, Zambales",
  },
  {
    id: "REQ-2026-002",
    type: "Certificate of Residency",
    purpose: "School Enrollment",
    status: "pending",
    date: "April 28, 2026",
    fee: "30",
    pickupTime: null,
    residentName: "Juan Dela Cruz",
    address: "Purok 3, Barangay Santiago, San Antonio, Zambales",
  },
  {
    id: "REQ-2026-003",
    type: "Business Clearance",
    purpose: "Business Permit Application",
    status: "rejected",
    date: "April 20, 2026",
    fee: "200",
    remarks: "Missing DTI Registration document",
    missingDocs: ["DTI Registration"],
    residentName: "Juan Dela Cruz",
    address: "Purok 3, Barangay Santiago, San Antonio, Zambales",
  },
]

type RequirementStatus = "empty" | "uploaded" | "reviewing"

interface Requirement {
  name: string
  status: RequirementStatus
  file?: File
}

function getStatusBadge(status: string) {
  switch (status) {
    case "approved":
      return (
        <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">
          <CheckCircle2 className="mr-1 h-3 w-3" />
          Ready to Release
        </Badge>
      )
    case "pending":
      return (
        <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100">
          <Clock className="mr-1 h-3 w-3" />
          Waiting for Approval
        </Badge>
      )
    case "rejected":
      return (
        <Badge className="bg-red-100 text-red-700 hover:bg-red-100">
          <XCircle className="mr-1 h-3 w-3" />
          Rejected - Resubmit
        </Badge>
      )
    default:
      return <Badge variant="secondary">{status}</Badge>
  }
}

function getStatusCircle(status: RequirementStatus) {
  switch (status) {
    case "uploaded":
      return <span className="h-3 w-3 rounded-full bg-emerald-500 inline-block" />
    case "reviewing":
      return <span className="h-3 w-3 rounded-full bg-amber-500 inline-block" />
    default:
      return <span className="h-3 w-3 rounded-full bg-red-500 inline-block" />
  }
}

export default function DocumentsPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedType, setSelectedType] = useState<string>("")
  const [showResubmit, setShowResubmit] = useState<typeof mockRequests[0] | null>(null)
  const [requirements, setRequirements] = useState<Requirement[]>([])
  const [expandedRequirement, setExpandedRequirement] = useState<string | null>(null)
  const [resubmitFiles, setResubmitFiles] = useState<{ [key: string]: File }>({})
  const fileInputRef = useRef<HTMLInputElement>(null)

  const selectedDoc = documentTypes.find(d => d.id === selectedType)

  // Initialize requirements when document type is selected
  const handleDocTypeSelect = (docId: string) => {
    setSelectedType(docId)
    const doc = documentTypes.find(d => d.id === docId)
    if (doc) {
      setRequirements(doc.requirements.map(r => ({ name: r.name, status: "empty" as RequirementStatus })))
    }
    setExpandedRequirement(null)
  }

  const handleRequirementUpload = (reqName: string, file: File) => {
    setRequirements(prev => 
      prev.map(r => 
        r.name === reqName 
          ? { ...r, status: "uploaded" as RequirementStatus, file }
          : r
      )
    )
    setExpandedRequirement(null)
  }

  const removeRequirementFile = (reqName: string) => {
    setRequirements(prev => 
      prev.map(r => 
        r.name === reqName 
          ? { ...r, status: "empty" as RequirementStatus, file: undefined }
          : r
      )
    )
  }

  const handleResubmit = () => {
    // Handle resubmit logic here
    setShowResubmit(null)
    setResubmitFiles({})
  }

  const handleResubmitFileUpload = (docName: string, file: File) => {
    setResubmitFiles(prev => ({ ...prev, [docName]: file }))
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Document Requests</h1>
        <p className="text-sm text-muted-foreground">Request and track your document applications</p>
      </div>

      {/* Request Document Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={(open) => {
        setIsDialogOpen(open)
        if (!open) {
          setSelectedType("")
          setRequirements([])
          setExpandedRequirement(null)
        }
      }}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Request Document</DialogTitle>
            <DialogDescription>
              {selectedDoc ? `Complete the form to request ${selectedDoc.name}` : "Select a document type and provide required information"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {!selectedType && (
              <div className="space-y-2">
                <Label>Document Type</Label>
                <Select value={selectedType} onValueChange={handleDocTypeSelect}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select document type" />
                  </SelectTrigger>
                  <SelectContent>
                    {documentTypes.map((doc) => (
                      <SelectItem key={doc.id} value={doc.id}>
                        {doc.name} - PHP {doc.fee}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {selectedDoc && (
              <>
                <div className="rounded-lg border bg-muted/50 p-3">
                  <p className="text-sm font-medium mb-2">Requirements:</p>
                  <div className="space-y-2">
                    {requirements.map((req) => (
                      <div key={req.name} className="space-y-2">
                        <button
                          type="button"
                          onClick={() => setExpandedRequirement(expandedRequirement === req.name ? null : req.name)}
                          className="w-full flex items-center justify-between p-2 rounded-md bg-background hover:bg-muted transition-colors text-left"
                        >
                          <div className="flex items-center gap-2">
                            {getStatusCircle(req.status)}
                            <span className="text-sm">{req.name}</span>
                          </div>
                          {expandedRequirement === req.name ? (
                            <ChevronUp className="h-4 w-4 text-muted-foreground" />
                          ) : (
                            <ChevronDown className="h-4 w-4 text-muted-foreground" />
                          )}
                        </button>
                        
                        {expandedRequirement === req.name && (
                          <div className="ml-5 p-3 bg-background rounded-md border">
                            {req.status === "uploaded" && req.file ? (
                              <div className="flex items-center justify-between">
                                <span className="text-sm text-emerald-600 truncate flex-1">{req.file.name}</span>
                                <Button variant="ghost" size="sm" onClick={() => removeRequirementFile(req.name)}>
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            ) : (
                              <div className="space-y-2">
                                <p className="text-xs text-muted-foreground">Upload your {req.name}</p>
                                <div 
                                  className="flex items-center justify-center gap-2 rounded-lg border-2 border-dashed border-muted-foreground/25 p-4 transition-colors hover:border-primary/50 cursor-pointer"
                                  onClick={() => {
                                    const input = document.createElement('input')
                                    input.type = 'file'
                                    input.onchange = (e) => {
                                      const file = (e.target as HTMLInputElement).files?.[0]
                                      if (file) handleRequirementUpload(req.name, file)
                                    }
                                    input.click()
                                  }}
                                >
                                  <Upload className="h-4 w-4 text-muted-foreground" />
                                  <span className="text-xs text-muted-foreground">Click to upload</span>
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  <p className="mt-3 text-sm">
                    <span className="font-medium">Fee:</span> PHP {selectedDoc.fee}
                  </p>
                  <div className="mt-2 flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <span className="h-2 w-2 rounded-full bg-red-500" /> Empty
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="h-2 w-2 rounded-full bg-emerald-500" /> Uploaded
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="h-2 w-2 rounded-full bg-amber-500" /> Reviewing
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Purpose</Label>
                  <Input placeholder="e.g., Employment, School Enrollment" />
                </div>

                <div className="space-y-2">
                  <Label>Additional Notes (Optional)</Label>
                  <Textarea placeholder="Any additional information..." />
                </div>
              </>
            )}
          </div>
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button 
              variant="outline" 
              onClick={() => {
                setIsDialogOpen(false)
                setSelectedType("")
                setRequirements([])
                setExpandedRequirement(null)
              }}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button 
              onClick={() => {
                setIsDialogOpen(false)
                setSelectedType("")
                setRequirements([])
                setExpandedRequirement(null)
              }} 
              disabled={!selectedType || requirements.some(r => r.status === "empty")}
              className="w-full sm:w-auto"
            >
              Submit Request
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Resubmit Dialog */}
      <Dialog open={!!showResubmit} onOpenChange={() => {
        setShowResubmit(null)
        setResubmitFiles({})
      }}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Resubmit Missing Documents</DialogTitle>
            <DialogDescription>
              Upload the missing documents to resubmit your request
            </DialogDescription>
          </DialogHeader>
          {showResubmit && (
            <div className="space-y-4 py-4">
              <div className="p-3 bg-red-50 rounded-lg">
                <p className="text-sm text-red-700 flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                  <span>Reason: {showResubmit.remarks}</span>
                </p>
              </div>
              
              <div className="space-y-3">
                <Label>Missing Documents</Label>
                {showResubmit.missingDocs?.map((doc) => (
                  <div key={doc} className="space-y-2">
                    <div className="flex items-center gap-2">
                      {resubmitFiles[doc] ? (
                        <span className="h-3 w-3 rounded-full bg-emerald-500" />
                      ) : (
                        <span className="h-3 w-3 rounded-full bg-red-500" />
                      )}
                      <span className="text-sm font-medium">{doc}</span>
                    </div>
                    {resubmitFiles[doc] ? (
                      <div className="ml-5 flex items-center justify-between p-2 bg-muted rounded-lg">
                        <span className="text-sm truncate flex-1">{resubmitFiles[doc].name}</span>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => {
                            const newFiles = { ...resubmitFiles }
                            delete newFiles[doc]
                            setResubmitFiles(newFiles)
                          }}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <div 
                        className="ml-5 flex items-center justify-center gap-2 rounded-lg border-2 border-dashed border-muted-foreground/25 p-4 transition-colors hover:border-primary/50 cursor-pointer"
                        onClick={() => {
                          const input = document.createElement('input')
                          input.type = 'file'
                          input.onchange = (e) => {
                            const file = (e.target as HTMLInputElement).files?.[0]
                            if (file) handleResubmitFileUpload(doc, file)
                          }
                          input.click()
                        }}
                      >
                        <Upload className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">Click to upload {doc}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={() => {
              setShowResubmit(null)
              setResubmitFiles({})
            }} className="w-full sm:w-auto">
              Cancel
            </Button>
            <Button 
              onClick={handleResubmit}
              disabled={showResubmit?.missingDocs?.some(doc => !resubmitFiles[doc])}
              className="w-full sm:w-auto"
            >
              Resubmit Request
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Available Documents */}
      <Card>
        <CardHeader className="pb-3 sm:pb-6">
          <CardTitle className="text-base sm:text-lg">Available Documents</CardTitle>
          <CardDescription className="text-xs sm:text-sm">Documents you can request from the barangay</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-4">
            {documentTypes.map((doc) => (
              <button
                key={doc.id}
                onClick={() => {
                  handleDocTypeSelect(doc.id)
                  setIsDialogOpen(true)
                }}
                className="rounded-lg border p-3 sm:p-4 text-left transition-all hover:bg-muted/50 hover:border-primary hover:shadow-md cursor-pointer"
              >
                <div className="mb-2 flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-lg bg-primary/10">
                  <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                </div>
                <h3 className="font-medium text-xs sm:text-sm">{doc.name}</h3>
                <p className="text-xs text-muted-foreground">Fee: PHP {doc.fee}</p>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Request History */}
      <Card>
        <CardHeader className="pb-3 sm:pb-6">
          <CardTitle className="text-base sm:text-lg">My Requests</CardTitle>
          <CardDescription className="text-xs sm:text-sm">Track your document request status</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all">
            <TabsList className="w-full sm:w-auto grid grid-cols-4 sm:flex">
              <TabsTrigger value="all" className="text-xs sm:text-sm">All</TabsTrigger>
              <TabsTrigger value="pending" className="text-xs sm:text-sm">Pending</TabsTrigger>
              <TabsTrigger value="approved" className="text-xs sm:text-sm">Approved</TabsTrigger>
              <TabsTrigger value="rejected" className="text-xs sm:text-sm">Rejected</TabsTrigger>
            </TabsList>
            <TabsContent value="all" className="mt-4">
              <div className="space-y-3 sm:space-y-4">
                {mockRequests.map((request) => (
                  <div 
                    key={request.id}
                    className="flex flex-col gap-3 rounded-lg border p-3 sm:p-4"
                  >
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-medium text-sm sm:text-base">{request.type}</span>
                        {getStatusBadge(request.status)}
                      </div>
                      <p className="text-xs sm:text-sm text-muted-foreground">
                        {request.id} | {request.date}
                      </p>
                      <p className="text-xs sm:text-sm text-muted-foreground">
                        Purpose: {request.purpose}
                      </p>
                      {request.status === "approved" && request.pickupTime && (
                        <p className="text-xs sm:text-sm text-primary font-medium">
                          Pickup: {request.pickupTime} | Fee: PHP {request.fee}
                        </p>
                      )}
                      {request.status === "rejected" && request.remarks && (
                        <div className="mt-2 p-2 bg-red-50 rounded-lg">
                          <p className="text-xs sm:text-sm text-destructive flex items-start gap-1">
                            <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                            <span>Reason: {request.remarks}</span>
                          </p>
                        </div>
                      )}
                    </div>
                    {request.status === "rejected" && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setShowResubmit(request)}
                        className="w-full sm:w-auto text-xs sm:text-sm"
                      >
                        <Upload className="mr-1 h-3 w-3 sm:h-4 sm:w-4" />
                        Resubmit with Missing Documents
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="pending" className="mt-4">
              <div className="space-y-3 sm:space-y-4">
                {mockRequests.filter(r => r.status === "pending").map((request) => (
                  <div 
                    key={request.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-lg border p-3 sm:p-4"
                  >
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-medium text-sm">{request.type}</span>
                        {getStatusBadge(request.status)}
                      </div>
                      <p className="text-xs sm:text-sm text-muted-foreground">{request.id} | {request.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="approved" className="mt-4">
              <div className="space-y-3 sm:space-y-4">
                {mockRequests.filter(r => r.status === "approved").map((request) => (
                  <div 
                    key={request.id}
                    className="rounded-lg border p-3 sm:p-4"
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-medium text-sm">{request.type}</span>
                      {getStatusBadge(request.status)}
                    </div>
                    <p className="text-xs sm:text-sm text-muted-foreground">{request.id} | {request.date}</p>
                    {request.pickupTime && (
                      <p className="text-xs sm:text-sm text-primary font-medium mt-1">
                        Pickup: {request.pickupTime} | Fee: PHP {request.fee}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="rejected" className="mt-4">
              <div className="space-y-3 sm:space-y-4">
                {mockRequests.filter(r => r.status === "rejected").map((request) => (
                  <div 
                    key={request.id}
                    className="flex flex-col gap-3 rounded-lg border p-3 sm:p-4"
                  >
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-medium text-sm">{request.type}</span>
                        {getStatusBadge(request.status)}
                      </div>
                      <p className="text-xs sm:text-sm text-muted-foreground">{request.id} | {request.date}</p>
                      <div className="mt-2 p-2 bg-red-50 rounded-lg">
                        <p className="text-xs sm:text-sm text-destructive flex items-start gap-1">
                          <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                          <span>Reason: {request.remarks}</span>
                        </p>
                      </div>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setShowResubmit(request)}
                      className="w-full sm:w-auto text-xs sm:text-sm"
                    >
                      <Upload className="mr-1 h-3 w-3 sm:h-4 sm:w-4" />
                      Resubmit with Missing Documents
                    </Button>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

    </div>
  )
}
