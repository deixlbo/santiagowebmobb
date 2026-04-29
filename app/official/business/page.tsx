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
  XCircle,
  Clock,
  Building2,
  Printer,
  Settings
} from "lucide-react"

const mockBusinessApplications = [
  {
    id: "BUS-2026-001",
    businessName: "Juan's Sari-sari Store",
    businessType: "Retail",
    owner: "Juan Dela Cruz",
    address: "Purok 3, Barangay Santiago",
    email: "juan@example.com",
    contact: "0917-123-4567",
    status: "pending",
    date: "April 26, 2026",
    documentsComplete: true
  },
  {
    id: "BUS-2026-002",
    businessName: "Maria's Eatery",
    businessType: "Food Service",
    owner: "Maria Santos",
    address: "Purok 1, Barangay Santiago",
    email: "maria@example.com",
    contact: "0918-234-5678",
    status: "approved",
    date: "April 20, 2026",
    documentsComplete: true
  },
  {
    id: "BUS-2026-003",
    businessName: "Pedro's Hardware",
    businessType: "Retail",
    owner: "Pedro Reyes",
    address: "Purok 2, Barangay Santiago",
    email: "pedro@example.com",
    contact: "0919-345-6789",
    status: "pending",
    date: "April 28, 2026",
    documentsComplete: false,
    missingDocs: ["DTI Registration", "Fire Safety Certificate"]
  },
  {
    id: "BUS-2026-004",
    businessName: "Ana's Beauty Salon",
    businessType: "Services",
    owner: "Ana Garcia",
    address: "Purok 4, Barangay Santiago",
    email: "ana@example.com",
    contact: "0920-456-7890",
    status: "rejected",
    date: "April 15, 2026",
    documentsComplete: true,
    remarks: "Location not zoned for commercial use"
  },
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
    default:
      return <Badge variant="secondary">{status}</Badge>
  }
}

export default function OfficialBusinessPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedBusiness, setSelectedBusiness] = useState<typeof mockBusinessApplications[0] | null>(null)
  const [showApproveDialog, setShowApproveDialog] = useState(false)
  const [showPrintPreview, setShowPrintPreview] = useState(false)

  const pendingCount = mockBusinessApplications.filter(b => b.status === "pending").length

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Business Permits</h1>
          <p className="text-muted-foreground">Process and manage business permit applications</p>
        </div>
        <Button variant="outline">
          <Settings className="mr-2 h-4 w-4" />
          Manage Requirements
        </Button>
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
                <p className="text-2xl font-bold">{mockBusinessApplications.filter(b => b.status === "approved").length}</p>
                <p className="text-sm text-muted-foreground">Approved</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-red-100 p-2">
                <XCircle className="h-5 w-5 text-red-700" />
              </div>
              <div>
                <p className="text-2xl font-bold">{mockBusinessApplications.filter(b => b.status === "rejected").length}</p>
                <p className="text-sm text-muted-foreground">Rejected</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-primary/10 p-2">
                <Building2 className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{mockBusinessApplications.length}</p>
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
          placeholder="Search businesses..." 
          className="pl-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Applications Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Business Applications</CardTitle>
          <CardDescription>Review and process business permit applications</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="pending">
            <TabsList>
              <TabsTrigger value="pending">Pending ({pendingCount})</TabsTrigger>
              <TabsTrigger value="approved">Approved</TabsTrigger>
              <TabsTrigger value="all">All Applications</TabsTrigger>
            </TabsList>
            <TabsContent value="pending" className="mt-4">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Application ID</TableHead>
                      <TableHead>Business Name</TableHead>
                      <TableHead>Owner</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Documents</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockBusinessApplications.filter(b => b.status === "pending").map((business) => (
                      <TableRow key={business.id}>
                        <TableCell className="font-medium">{business.id}</TableCell>
                        <TableCell>{business.businessName}</TableCell>
                        <TableCell>{business.owner}</TableCell>
                        <TableCell>{business.businessType}</TableCell>
                        <TableCell>
                          {business.documentsComplete ? (
                            <Badge className="bg-emerald-100 text-emerald-700">Complete</Badge>
                          ) : (
                            <Badge className="bg-red-100 text-red-700">Incomplete</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => setSelectedBusiness(business)}
                            >
                              <Eye className="mr-1 h-3 w-3" />
                              Review
                            </Button>
                            {business.documentsComplete && (
                              <Button 
                                size="sm"
                                onClick={() => {
                                  setSelectedBusiness(business)
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
                      <TableHead>Application ID</TableHead>
                      <TableHead>Business Name</TableHead>
                      <TableHead>Owner</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockBusinessApplications.filter(b => b.status === "approved").map((business) => (
                      <TableRow key={business.id}>
                        <TableCell className="font-medium">{business.id}</TableCell>
                        <TableCell>{business.businessName}</TableCell>
                        <TableCell>{business.owner}</TableCell>
                        <TableCell>{business.businessType}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => setSelectedBusiness(business)}
                            >
                              View
                            </Button>
                            <Button 
                              size="sm"
                              onClick={() => {
                                setSelectedBusiness(business)
                                setShowPrintPreview(true)
                              }}
                            >
                              <Printer className="mr-1 h-3 w-3" />
                              Print Permit
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
                      <TableHead>Application ID</TableHead>
                      <TableHead>Business Name</TableHead>
                      <TableHead>Owner</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockBusinessApplications.map((business) => (
                      <TableRow key={business.id}>
                        <TableCell className="font-medium">{business.id}</TableCell>
                        <TableCell>{business.businessName}</TableCell>
                        <TableCell>{business.owner}</TableCell>
                        <TableCell>{business.date}</TableCell>
                        <TableCell>{getStatusBadge(business.status)}</TableCell>
                        <TableCell>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setSelectedBusiness(business)}
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

      {/* Business Details Modal */}
      <Dialog open={!!selectedBusiness && !showApproveDialog && !showPrintPreview} onOpenChange={() => setSelectedBusiness(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Business Application Details</DialogTitle>
            <DialogDescription>
              Review business permit application
            </DialogDescription>
          </DialogHeader>
          {selectedBusiness && (
            <ScrollArea className="max-h-[60vh]">
              <div className="space-y-4 pr-4">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{selectedBusiness.id}</span>
                  {getStatusBadge(selectedBusiness.status)}
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <p className="text-sm text-muted-foreground">Business Name</p>
                    <p className="font-medium">{selectedBusiness.businessName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Business Type</p>
                    <p className="font-medium">{selectedBusiness.businessType}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Owner</p>
                    <p className="font-medium">{selectedBusiness.owner}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Contact</p>
                    <p className="font-medium">{selectedBusiness.contact}</p>
                  </div>
                  <div className="sm:col-span-2">
                    <p className="text-sm text-muted-foreground">Address</p>
                    <p className="font-medium">{selectedBusiness.address}</p>
                  </div>
                  <div className="sm:col-span-2">
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium">{selectedBusiness.email}</p>
                  </div>
                </div>
                <div className="rounded-lg border p-4">
                  <p className="text-sm font-medium mb-2">Document Status</p>
                  {selectedBusiness.documentsComplete ? (
                    <div className="flex items-center gap-2 text-emerald-700">
                      <CheckCircle2 className="h-4 w-4" />
                      <span>All required documents uploaded</span>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-red-700">
                        <XCircle className="h-4 w-4" />
                        <span>Missing documents</span>
                      </div>
                      {selectedBusiness.missingDocs && (
                        <ul className="list-disc list-inside text-sm text-muted-foreground">
                          {selectedBusiness.missingDocs.map((doc, i) => (
                            <li key={i}>{doc}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  )}
                </div>
                {selectedBusiness.remarks && (
                  <div className="rounded-lg bg-red-50 p-4">
                    <p className="text-sm font-medium text-red-800">Rejection Reason</p>
                    <p className="text-sm text-red-700">{selectedBusiness.remarks}</p>
                  </div>
                )}
              </div>
            </ScrollArea>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedBusiness(null)}>Close</Button>
            {selectedBusiness?.status === "pending" && (
              <>
                {!selectedBusiness.documentsComplete && (
                  <Button variant="outline">Notify Missing Docs</Button>
                )}
                <Button variant="destructive">Reject</Button>
                {selectedBusiness.documentsComplete && (
                  <Button onClick={() => setShowApproveDialog(true)}>Approve</Button>
                )}
              </>
            )}
            {selectedBusiness?.status === "approved" && (
              <Button onClick={() => setShowPrintPreview(true)}>
                <Printer className="mr-2 h-4 w-4" />
                Print Permit
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Approve Dialog */}
      <Dialog open={showApproveDialog} onOpenChange={setShowApproveDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Approve Business Permit</DialogTitle>
            <DialogDescription>
              Confirm approval and set permit details
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Permit Fee</Label>
              <Input defaultValue="200" placeholder="Enter permit fee" />
            </div>
            <div className="space-y-2">
              <Label>Validity Period</Label>
              <Input type="date" />
            </div>
            <div className="space-y-2">
              <Label>Notes (Optional)</Label>
              <Textarea placeholder="Additional notes for the permit..." />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowApproveDialog(false)}>Cancel</Button>
            <Button onClick={() => {
              setShowApproveDialog(false)
              setSelectedBusiness(null)
            }}>
              Approve & Issue Permit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Print Preview Dialog */}
      <Dialog open={showPrintPreview} onOpenChange={setShowPrintPreview}>
        <DialogContent className="max-w-2xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>Business Clearance Preview</DialogTitle>
          </DialogHeader>
          {selectedBusiness && (
            <ScrollArea className="max-h-[70vh]">
              <div className="rounded-lg border bg-white p-8 text-black">
                <div className="text-center space-y-1 mb-6">
                  <p className="text-sm">Republic of the Philippines</p>
                  <p className="text-sm">Province of Zambales</p>
                  <p className="text-sm">Municipality of San Antonio</p>
                  <p className="text-sm font-semibold">Barangay Santiago</p>
                </div>
                <h2 className="text-center text-lg font-bold mb-6 border-t border-b py-4">BARANGAY BUSINESS CLEARANCE</h2>
                <div className="space-y-4 text-sm">
                  <p><strong>TO WHOM IT MAY CONCERN:</strong></p>
                  <p className="text-justify leading-relaxed">
                    This is to certify that the business named <strong>{selectedBusiness.businessName}</strong>, 
                    owned by <strong>{selectedBusiness.owner}</strong>, located at <strong>{selectedBusiness.address}</strong>, 
                    is granted clearance to operate within the jurisdiction of this barangay.
                  </p>
                  <p className="text-justify leading-relaxed">
                    This clearance is issued in compliance with existing barangay rules and regulations.
                  </p>
                  <div className="border-t pt-4 mt-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-gray-600">Business Type:</p>
                        <p className="font-medium">{selectedBusiness.businessType}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Application No:</p>
                        <p className="font-medium">{selectedBusiness.id}</p>
                      </div>
                    </div>
                  </div>
                  <p className="mt-4">
                    Issued this <strong>___</strong> day of <strong>_______</strong>, 2026 at Barangay Santiago.
                  </p>
                </div>
                <div className="mt-12 grid grid-cols-2 gap-8 text-center text-sm">
                  <div>
                    <p className="border-t border-black pt-1 font-semibold">APRIL JOY C. CANO</p>
                    <p>Barangay Secretary</p>
                    <p className="text-xs text-gray-600 mt-1">Certified by</p>
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
              Print Permit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
