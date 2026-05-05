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
  Printer,
  Eye,
  Upload,
  X,
  AlertCircle
} from "lucide-react"

// Available document types
const documentTypes = [
  { id: "clearance", name: "Barangay Clearance", fee: "50", requirements: ["Valid ID", "Proof of Residency"] },
  { id: "residency", name: "Certificate of Residency", fee: "30", requirements: ["Valid ID"] },
  { id: "indigency", name: "Certificate of Indigency", fee: "Free", requirements: ["Valid ID", "Barangay Clearance"] },
  { id: "business", name: "Business Clearance", fee: "200", requirements: ["Valid ID", "DTI Registration", "Barangay Clearance"] },
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

export default function DocumentsPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedType, setSelectedType] = useState<string>("")
  const [showPreview, setShowPreview] = useState<typeof mockRequests[0] | null>(null)
  const [showResubmit, setShowResubmit] = useState<typeof mockRequests[0] | null>(null)
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)
  const printRef = useRef<HTMLDivElement>(null)

  const selectedDoc = documentTypes.find(d => d.id === selectedType)

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setUploadedFiles(prev => [...prev, ...Array.from(e.target.files!)])
    }
  }

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index))
  }

  const handlePrint = () => {
    const printContent = printRef.current
    if (printContent) {
      const printWindow = window.open('', '_blank')
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>Document Preview</title>
              <style>
                body { font-family: Arial, sans-serif; padding: 20px; }
                .header { text-align: center; margin-bottom: 20px; }
                .header img { width: 60px; height: 60px; border-radius: 50%; object-fit: cover; }
                .header-content { display: flex; align-items: center; justify-content: center; gap: 16px; margin-bottom: 16px; }
                .center-text { text-align: center; }
                .center-text p { margin: 2px 0; font-size: 12px; }
                .center-text .bold { font-weight: bold; }
                .title { border-top: 1px solid black; border-bottom: 1px solid black; padding: 12px; margin: 16px 0; text-align: center; font-weight: bold; }
                .content { font-size: 14px; }
                .content p { margin: 8px 0; text-align: justify; line-height: 1.6; }
                .signatures { display: grid; grid-template-columns: 1fr 1fr; gap: 32px; margin-top: 48px; text-align: center; }
                .signature-line { border-top: 1px solid black; padding-top: 4px; font-weight: bold; }
              </style>
            </head>
            <body>
              ${printContent.innerHTML}
            </body>
          </html>
        `)
        printWindow.document.close()
        printWindow.print()
      }
    }
  }

  const handleResubmit = () => {
    // Handle resubmit logic here
    setShowResubmit(null)
    setUploadedFiles([])
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Document Requests</h1>
        <p className="text-sm text-muted-foreground">Request and track your document applications</p>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
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
                <Select value={selectedType} onValueChange={setSelectedType}>
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
                  <p className="text-sm font-medium">Requirements:</p>
                  <ul className="mt-1 list-inside list-disc text-sm text-muted-foreground">
                    {selectedDoc.requirements.map((req, i) => (
                      <li key={i}>{req}</li>
                    ))}
                  </ul>
                  <p className="mt-2 text-sm">
                    <span className="font-medium">Fee:</span> PHP {selectedDoc.fee}
                  </p>
                </div>

                <div className="space-y-2">
                  <Label>Purpose</Label>
                  <Input placeholder="e.g., Employment, School Enrollment" />
                </div>

                <div className="space-y-2">
                  <Label>Upload Requirements</Label>
                  <div 
                    className="flex items-center justify-center gap-2 rounded-lg border-2 border-dashed border-muted-foreground/25 p-4 sm:p-6 transition-colors hover:border-primary/50 cursor-pointer"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="h-5 w-5 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      Click to upload documents
                    </span>
                    <input 
                      ref={fileInputRef}
                      type="file" 
                      className="hidden" 
                      multiple 
                      onChange={handleFileUpload}
                    />
                  </div>
                  {uploadedFiles.length > 0 && (
                    <div className="space-y-2 mt-2">
                      {uploadedFiles.map((file, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-muted rounded-lg">
                          <span className="text-sm truncate flex-1">{file.name}</span>
                          <Button variant="ghost" size="sm" onClick={() => removeFile(index)}>
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
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
                setUploadedFiles([])
              }}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button 
              onClick={() => {
                setIsDialogOpen(false)
                setSelectedType("")
                setUploadedFiles([])
              }} 
              disabled={!selectedType}
              className="w-full sm:w-auto"
            >
              Submit Request
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
                  setSelectedType(doc.id)
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
                        <p className="text-xs sm:text-sm text-accent font-medium">
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
                    <div className="flex flex-wrap gap-2">
                      {request.status === "approved" && (
                        <>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setShowPreview(request)}
                            className="flex-1 sm:flex-none text-xs sm:text-sm"
                          >
                            <Eye className="mr-1 h-3 w-3 sm:h-4 sm:w-4" />
                            Preview
                          </Button>
                          <Button 
                            size="sm"
                            onClick={() => {
                              setShowPreview(request)
                              setTimeout(handlePrint, 100)
                            }}
                            className="flex-1 sm:flex-none text-xs sm:text-sm"
                          >
                            <Printer className="mr-1 h-3 w-3 sm:h-4 sm:w-4" />
                            Print
                          </Button>
                        </>
                      )}
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
                    className="flex flex-col gap-3 rounded-lg border p-3 sm:p-4"
                  >
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-medium text-sm">{request.type}</span>
                        {getStatusBadge(request.status)}
                      </div>
                      <p className="text-xs sm:text-sm text-muted-foreground">{request.id} | {request.date}</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setShowPreview(request)}
                        className="flex-1 sm:flex-none text-xs sm:text-sm"
                      >
                        <Eye className="mr-1 h-3 w-3 sm:h-4 sm:w-4" />
                        Preview
                      </Button>
                      <Button 
                        size="sm"
                        onClick={() => {
                          setShowPreview(request)
                          setTimeout(handlePrint, 100)
                        }}
                        className="flex-1 sm:flex-none text-xs sm:text-sm"
                      >
                        <Printer className="mr-1 h-3 w-3 sm:h-4 sm:w-4" />
                        Print
                      </Button>
                    </div>
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
                        <p className="text-xs sm:text-sm text-destructive">{request.remarks}</p>
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

      {/* Document Preview Modal */}
      <Dialog open={!!showPreview} onOpenChange={() => setShowPreview(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>Document Preview</DialogTitle>
          </DialogHeader>
          {showPreview && (
            <ScrollArea className="max-h-[70vh]">
              <div ref={printRef} className="rounded-lg border bg-white p-4 sm:p-8 text-black">
                <DocumentHeader title="BARANGAY CLEARANCE" />
                <div className="space-y-4 text-xs sm:text-sm">
                  <p><strong>TO WHOM IT MAY CONCERN:</strong></p>
                  <p className="text-justify leading-relaxed">
                    This is to certify that <strong>{showPreview.residentName}</strong>, of legal age, Filipino, 
                    and a resident of <strong>{showPreview.address}</strong>, 
                    has been known to be a person of good moral character and law-abiding citizen in the community.
                  </p>
                  <p className="text-justify leading-relaxed">
                    This further certifies that as of this date, there are no records filed against him/her in this barangay.
                  </p>
                  <p className="text-justify leading-relaxed">
                    This certification is issued upon the request of the above-named person for <strong>{showPreview.purpose}</strong> purposes.
                  </p>
                  <p className="mt-6">
                    Issued this <strong>25th</strong> day of <strong>April, 2026</strong> at Barangay Santiago.
                  </p>
                </div>
                <div className="mt-8 sm:mt-12 grid grid-cols-2 gap-4 sm:gap-8 text-center text-xs sm:text-sm">
                  <div>
                    <p className="border-t border-black pt-1 font-semibold">APRIL JOY C. CANO</p>
                    <p>Barangay Secretary</p>
                  </div>
                  <div>
                    <p className="border-t border-black pt-1 font-semibold">ROLANDO C. BORJA</p>
                    <p>Punong Barangay</p>
                  </div>
                </div>
              </div>
            </ScrollArea>
          )}
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={() => setShowPreview(null)} className="w-full sm:w-auto">
              Close
            </Button>
            <Button onClick={handlePrint} className="w-full sm:w-auto">
              <Printer className="mr-2 h-4 w-4" />
              Print Document
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Resubmit Modal */}
      <Dialog open={!!showResubmit} onOpenChange={() => { setShowResubmit(null); setUploadedFiles([]); }}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Resubmit Document Request</DialogTitle>
            <DialogDescription>
              Upload the missing documents to resubmit your request
            </DialogDescription>
          </DialogHeader>
          {showResubmit && (
            <div className="space-y-4 py-4">
              <div className="rounded-lg border bg-red-50 p-3">
                <p className="text-sm font-medium text-red-800 flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" />
                  Missing Documents:
                </p>
                <ul className="mt-2 list-inside list-disc text-sm text-red-700">
                  {showResubmit.missingDocs?.map((doc, i) => (
                    <li key={i}>{doc}</li>
                  ))}
                </ul>
              </div>

              <div className="space-y-2">
                <Label>Upload Missing Documents</Label>
                <div 
                  className="flex items-center justify-center gap-2 rounded-lg border-2 border-dashed border-muted-foreground/25 p-4 sm:p-6 transition-colors hover:border-primary/50 cursor-pointer"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="h-5 w-5 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    Click to upload documents
                  </span>
                  <input 
                    ref={fileInputRef}
                    type="file" 
                    className="hidden" 
                    multiple 
                    onChange={handleFileUpload}
                  />
                </div>
                {uploadedFiles.length > 0 && (
                  <div className="space-y-2 mt-2">
                    {uploadedFiles.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-muted rounded-lg">
                        <span className="text-sm truncate flex-1">{file.name}</span>
                        <Button variant="ghost" size="sm" onClick={() => removeFile(index)}>
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label>Additional Notes (Optional)</Label>
                <Textarea placeholder="Any additional information..." />
              </div>
            </div>
          )}
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button 
              variant="outline" 
              onClick={() => { setShowResubmit(null); setUploadedFiles([]); }}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleResubmit}
              disabled={uploadedFiles.length === 0}
              className="w-full sm:w-auto"
            >
              Resubmit Request
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
