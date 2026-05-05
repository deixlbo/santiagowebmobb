"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { 
  AlertTriangle, 
  Plus, 
  Clock, 
  CheckCircle2, 
  MapPin,
  FileText,
  Printer,
  Download
} from "lucide-react"

const incidentTypes = [
  "Noise Complaint",
  "Property Dispute",
  "Physical Altercation",
  "Theft",
  "Vandalism",
  "Domestic Issue",
  "Neighborhood Dispute",
  "Other"
]

const mockBlotters = [
  {
    id: "BLT-2026-001",
    type: "Noise Complaint",
    description: "Loud karaoke past 10PM in Purok 3",
    location: "Purok 3, near the chapel",
    status: "resolved",
    date: "April 22, 2026",
    resolution: "Parties agreed to limit karaoke hours until 9PM",
    resolutionDate: "April 25, 2026",
    resolutionDocument: "/documents/resolution-BLT-2026-001.pdf",
    complainant: "Juan Dela Cruz",
    respondent: "Pedro Santos"
  },
  {
    id: "BLT-2026-002",
    type: "Property Dispute",
    description: "Fence encroachment on neighboring lot",
    location: "Purok 2, Lot 15",
    status: "processing",
    date: "April 26, 2026",
    resolution: null,
    resolutionDate: null,
    resolutionDocument: null,
    complainant: "Juan Dela Cruz",
    respondent: "Maria Garcia"
  },
  {
    id: "BLT-2026-003",
    type: "Neighborhood Dispute",
    description: "Ongoing argument about water drainage",
    location: "Purok 1",
    status: "filed",
    date: "April 28, 2026",
    resolution: null,
    resolutionDate: null,
    resolutionDocument: null,
    complainant: "Juan Dela Cruz",
    respondent: "Jose Reyes"
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

export default function BlotterPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [showPreview, setShowPreview] = useState<typeof mockBlotters[0] | null>(null)
  const printRef = useRef<HTMLDivElement>(null)

  const handlePrint = () => {
    const printContent = printRef.current
    if (printContent) {
      const printWindow = window.open('', '_blank')
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>Blotter Report - ${showPreview?.id}</title>
              <style>
                * { box-sizing: border-box; }
                body { 
                  font-family: Arial, sans-serif; 
                  padding: 40px; 
                  margin: 0;
                  line-height: 1.6;
                }
                .document {
                  max-width: 800px;
                  margin: 0 auto;
                }
                .header-row {
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  gap: 24px;
                  margin-bottom: 20px;
                }
                .header-logo {
                  width: 80px;
                  height: 80px;
                  border-radius: 50%;
                  object-fit: cover;
                  flex-shrink: 0;
                }
                .header-text {
                  text-align: center;
                  flex: 1;
                }
                .header-text p {
                  margin: 3px 0;
                  font-size: 13px;
                }
                .header-text .brgy-name {
                  font-weight: bold;
                  font-size: 15px;
                }
                .title-section {
                  border-top: 2px solid #000;
                  border-bottom: 2px solid #000;
                  padding: 14px 0;
                  margin: 24px 0;
                  text-align: center;
                }
                .title-section h1 {
                  margin: 0;
                  font-size: 20px;
                  font-weight: bold;
                  letter-spacing: 1px;
                }
                .info-grid {
                  display: grid;
                  grid-template-columns: 1fr 1fr;
                  gap: 20px;
                  margin-bottom: 24px;
                }
                .info-item {
                  margin-bottom: 12px;
                }
                .info-label {
                  color: #666;
                  font-size: 12px;
                  margin-bottom: 4px;
                }
                .info-value {
                  font-size: 14px;
                  font-weight: 500;
                }
                .full-width {
                  grid-column: 1 / -1;
                }
                .description-section {
                  margin: 24px 0;
                }
                .description-section .label {
                  color: #666;
                  font-size: 12px;
                  margin-bottom: 8px;
                }
                .description-section .content {
                  font-size: 14px;
                  text-align: justify;
                  line-height: 1.8;
                }
                .resolution-section {
                  background: #f0fdf4;
                  border: 1px solid #86efac;
                  border-radius: 8px;
                  padding: 16px;
                  margin: 24px 0;
                }
                .resolution-section .label {
                  color: #166534;
                  font-size: 12px;
                  font-weight: bold;
                  margin-bottom: 8px;
                }
                .resolution-section .content {
                  font-size: 14px;
                  color: #166534;
                }
                .signatures {
                  display: grid;
                  grid-template-columns: 1fr 1fr;
                  gap: 60px;
                  margin-top: 80px;
                  text-align: center;
                }
                .signature-box .name {
                  border-top: 1px solid #000;
                  padding-top: 8px;
                  font-weight: bold;
                  font-size: 14px;
                }
                .signature-box .title {
                  font-size: 12px;
                  color: #666;
                }
              </style>
            </head>
            <body>
              <div class="document">
                ${printContent.innerHTML}
              </div>
            </body>
          </html>
        `)
        printWindow.document.close()
        printWindow.print()
      }
    }
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Blotter Reports</h1>
          <p className="text-sm text-muted-foreground">File and track incident reports</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="w-full sm:w-auto">
              <Plus className="mr-2 h-4 w-4" />
              File Report
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>File Blotter Report</DialogTitle>
              <DialogDescription>
                Report an incident to the barangay
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Incident Type</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select incident type" />
                  </SelectTrigger>
                  <SelectContent>
                    {incidentTypes.map((type) => (
                      <SelectItem key={type} value={type.toLowerCase().replace(" ", "-")}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Date of Incident</Label>
                <Input type="date" />
              </div>

              <div className="space-y-2">
                <Label>Location</Label>
                <Input placeholder="e.g., Purok 3, near the chapel" />
              </div>

              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea 
                  placeholder="Provide a detailed description of the incident..."
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label>Respondent Name (if known)</Label>
                <Input placeholder="Name of person involved" />
              </div>

              <div className="space-y-2">
                <Label>Respondent Address (if known)</Label>
                <Input placeholder="Address of person involved" />
              </div>
            </div>
            <DialogFooter className="flex-col sm:flex-row gap-2">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="w-full sm:w-auto">
                Cancel
              </Button>
              <Button onClick={() => setIsDialogOpen(false)} className="w-full sm:w-auto">
                Submit Report
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Info Card */}
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="flex items-start gap-3 sm:gap-4 p-3 sm:p-4">
          <AlertTriangle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-medium text-sm sm:text-base">Filing a Blotter Report</p>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Blotter reports are official records of incidents reported to the barangay. 
              After filing, officials will review and process your report. You will be notified of any updates.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Reports List */}
      <Card>
        <CardHeader className="pb-3 sm:pb-6">
          <CardTitle className="text-base sm:text-lg">My Reports</CardTitle>
          <CardDescription className="text-xs sm:text-sm">Track your filed incident reports</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all">
            <TabsList className="w-full sm:w-auto grid grid-cols-4 sm:flex">
              <TabsTrigger value="all" className="text-xs sm:text-sm">All</TabsTrigger>
              <TabsTrigger value="filed" className="text-xs sm:text-sm">Filed</TabsTrigger>
              <TabsTrigger value="processing" className="text-xs sm:text-sm">Processing</TabsTrigger>
              <TabsTrigger value="resolved" className="text-xs sm:text-sm">Resolved</TabsTrigger>
            </TabsList>
            <TabsContent value="all" className="mt-4">
              <div className="space-y-3 sm:space-y-4">
                {mockBlotters.map((blotter) => (
                  <div 
                    key={blotter.id}
                    className="rounded-lg border p-3 sm:p-4 cursor-pointer transition-all hover:bg-muted/50 hover:border-primary hover:shadow-md"
                    onClick={() => setShowPreview(blotter)}
                  >
                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-medium text-sm sm:text-base">{blotter.type}</span>
                        {getStatusBadge(blotter.status)}
                      </div>
                      <p className="text-xs sm:text-sm text-muted-foreground">
                        {blotter.id} | {blotter.date}
                      </p>
                      <p className="text-xs sm:text-sm">{blotter.description}</p>
                      <div className="flex items-center gap-1 text-xs sm:text-sm text-muted-foreground">
                        <MapPin className="h-3 w-3" />
                        {blotter.location}
                      </div>
                      {blotter.resolution && (
                        <div className="rounded bg-emerald-50 p-2 text-xs sm:text-sm text-emerald-700">
                          <strong>Resolution:</strong> {blotter.resolution}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="filed" className="mt-4">
              <div className="space-y-3 sm:space-y-4">
                {mockBlotters.filter(b => b.status === "filed").map((blotter) => (
                  <div 
                    key={blotter.id}
                    className="rounded-lg border p-3 sm:p-4 cursor-pointer transition-all hover:bg-muted/50 hover:border-primary hover:shadow-md"
                    onClick={() => setShowPreview(blotter)}
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-medium text-sm">{blotter.type}</span>
                      {getStatusBadge(blotter.status)}
                    </div>
                    <p className="text-xs sm:text-sm text-muted-foreground">{blotter.id} | {blotter.date}</p>
                  </div>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="processing" className="mt-4">
              <div className="space-y-3 sm:space-y-4">
                {mockBlotters.filter(b => b.status === "processing").map((blotter) => (
                  <div 
                    key={blotter.id}
                    className="rounded-lg border p-3 sm:p-4 cursor-pointer transition-all hover:bg-muted/50 hover:border-primary hover:shadow-md"
                    onClick={() => setShowPreview(blotter)}
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-medium text-sm">{blotter.type}</span>
                      {getStatusBadge(blotter.status)}
                    </div>
                    <p className="text-xs sm:text-sm text-muted-foreground">{blotter.id} | {blotter.date}</p>
                  </div>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="resolved" className="mt-4">
              <div className="space-y-3 sm:space-y-4">
                {mockBlotters.filter(b => b.status === "resolved").map((blotter) => (
                  <div 
                    key={blotter.id}
                    className="rounded-lg border p-3 sm:p-4 cursor-pointer transition-all hover:bg-muted/50 hover:border-primary hover:shadow-md"
                    onClick={() => setShowPreview(blotter)}
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-medium text-sm">{blotter.type}</span>
                      {getStatusBadge(blotter.status)}
                    </div>
                    <p className="text-xs sm:text-sm text-muted-foreground">{blotter.id} | {blotter.date}</p>
                    {blotter.resolution && (
                      <div className="mt-2 rounded bg-emerald-50 p-2 text-xs sm:text-sm text-emerald-700">
                        <strong>Resolution:</strong> {blotter.resolution}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Blotter Preview Modal */}
      <Dialog open={!!showPreview} onOpenChange={() => setShowPreview(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>Blotter Report Details</DialogTitle>
          </DialogHeader>
          {showPreview && (
            <ScrollArea className="max-h-[70vh]">
              <div ref={printRef} className="rounded-lg border bg-white p-4 sm:p-8 text-black">
                {/* Print-friendly header with inline styles */}
                <div className="header-row" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '24px', marginBottom: '20px' }}>
                  <img 
                    src="/images/santiagologo.jpg" 
                    alt="Barangay Santiago" 
                    className="header-logo"
                    style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }}
                  />
                  <div className="header-text" style={{ textAlign: 'center', flex: 1 }}>
                    <p style={{ margin: '3px 0', fontSize: '13px' }}>Republic of the Philippines</p>
                    <p style={{ margin: '3px 0', fontSize: '13px' }}>Province of Zambales</p>
                    <p style={{ margin: '3px 0', fontSize: '13px' }}>Municipality of San Antonio</p>
                    <p className="brgy-name" style={{ margin: '3px 0', fontSize: '15px', fontWeight: 'bold' }}>Barangay Santiago</p>
                  </div>
                  <img 
                    src="/images/saz.jpg" 
                    alt="Municipal Mayor" 
                    className="header-logo"
                    style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }}
                  />
                </div>
                
                <div className="title-section" style={{ borderTop: '2px solid #000', borderBottom: '2px solid #000', padding: '14px 0', margin: '24px 0', textAlign: 'center' }}>
                  <h1 style={{ margin: 0, fontSize: '20px', fontWeight: 'bold', letterSpacing: '1px' }}>BLOTTER REPORT</h1>
                </div>
                
                <div className="space-y-4 text-xs sm:text-sm">
                  <div className="info-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                    <div className="info-item">
                      <p className="info-label" style={{ color: '#666', fontSize: '12px', marginBottom: '4px' }}>Reference No:</p>
                      <p className="info-value" style={{ fontSize: '14px', fontWeight: 500 }}>{showPreview.id}</p>
                    </div>
                    <div className="info-item">
                      <p className="info-label" style={{ color: '#666', fontSize: '12px', marginBottom: '4px' }}>Date Reported:</p>
                      <p className="info-value" style={{ fontSize: '14px', fontWeight: 500 }}>{showPreview.date}</p>
                    </div>
                  </div>
                  <div className="info-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                    <div className="info-item">
                      <p className="info-label" style={{ color: '#666', fontSize: '12px', marginBottom: '4px' }}>Complainant:</p>
                      <p className="info-value" style={{ fontSize: '14px', fontWeight: 500 }}>{showPreview.complainant}</p>
                    </div>
                    <div className="info-item">
                      <p className="info-label" style={{ color: '#666', fontSize: '12px', marginBottom: '4px' }}>Respondent:</p>
                      <p className="info-value" style={{ fontSize: '14px', fontWeight: 500 }}>{showPreview.respondent}</p>
                    </div>
                  </div>
                  <div className="info-item">
                    <p className="info-label" style={{ color: '#666', fontSize: '12px', marginBottom: '4px' }}>Incident Type:</p>
                    <p className="info-value" style={{ fontSize: '14px', fontWeight: 500 }}>{showPreview.type}</p>
                  </div>
                  <div className="info-item">
                    <p className="info-label" style={{ color: '#666', fontSize: '12px', marginBottom: '4px' }}>Location:</p>
                    <p className="info-value" style={{ fontSize: '14px', fontWeight: 500 }}>{showPreview.location}</p>
                  </div>
                  <div className="description-section" style={{ margin: '24px 0' }}>
                    <p className="info-label" style={{ color: '#666', fontSize: '12px', marginBottom: '8px' }}>Description:</p>
                    <p className="info-value" style={{ fontSize: '14px', fontWeight: 500, textAlign: 'justify', lineHeight: 1.8 }}>{showPreview.description}</p>
                  </div>
                  <div className="info-item">
                    <p className="info-label" style={{ color: '#666', fontSize: '12px', marginBottom: '4px' }}>Status:</p>
                    <p className="info-value" style={{ fontSize: '14px', fontWeight: 500, textTransform: 'capitalize' }}>{showPreview.status}</p>
                  </div>
                  {showPreview.resolution && (
                    <div className="resolution-section" style={{ background: '#f0fdf4', border: '1px solid #86efac', borderRadius: '8px', padding: '16px', margin: '24px 0' }}>
                      <p style={{ color: '#166534', fontSize: '12px', fontWeight: 'bold', marginBottom: '8px' }}>Resolution ({showPreview.resolutionDate}):</p>
                      <p style={{ fontSize: '14px', color: '#166534' }}>{showPreview.resolution}</p>
                    </div>
                  )}
                </div>
                <div className="signatures" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px', marginTop: '80px', textAlign: 'center' }}>
                  <div className="signature-box">
                    <p className="name" style={{ borderTop: '1px solid #000', paddingTop: '8px', fontWeight: 'bold', fontSize: '14px' }}>APRIL JOY C. CANO</p>
                    <p className="title" style={{ fontSize: '12px', color: '#666' }}>Barangay Secretary</p>
                  </div>
                  <div className="signature-box">
                    <p className="name" style={{ borderTop: '1px solid #000', paddingTop: '8px', fontWeight: 'bold', fontSize: '14px' }}>ROLANDO C. BORJA</p>
                    <p className="title" style={{ fontSize: '12px', color: '#666' }}>Punong Barangay</p>
                  </div>
                </div>
              </div>
            </ScrollArea>
          )}
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={() => setShowPreview(null)} className="w-full sm:w-auto">
              Close
            </Button>
            {/* Only show print for resolved status */}
            {showPreview?.status === "resolved" && (
              <>
                {showPreview.resolutionDocument && (
                  <Button variant="outline" className="w-full sm:w-auto" asChild>
                    <a href={showPreview.resolutionDocument} download>
                      <Download className="mr-2 h-4 w-4" />
                      Download Resolution
                    </a>
                  </Button>
                )}
                <Button onClick={handlePrint} className="w-full sm:w-auto">
                  <Printer className="mr-2 h-4 w-4" />
                  Print Report
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
