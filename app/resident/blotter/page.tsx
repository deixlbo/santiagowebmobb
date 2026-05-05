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
import { DocumentHeader } from "@/components/document-header"
import { 
  AlertTriangle, 
  Plus, 
  Clock, 
  CheckCircle2, 
  MapPin,
  FileText,
  Printer
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
              <title>Blotter Report</title>
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
                .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
                .label { color: #666; font-size: 12px; }
                .value { font-weight: 500; }
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
                <DocumentHeader title="BLOTTER REPORT" />
                <div className="space-y-4 text-xs sm:text-sm">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-gray-600">Reference No:</p>
                      <p className="font-medium">{showPreview.id}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Date Reported:</p>
                      <p className="font-medium">{showPreview.date}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-gray-600">Complainant:</p>
                      <p className="font-medium">{showPreview.complainant}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Respondent:</p>
                      <p className="font-medium">{showPreview.respondent}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-gray-600">Incident Type:</p>
                    <p className="font-medium">{showPreview.type}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Location:</p>
                    <p className="font-medium">{showPreview.location}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Description:</p>
                    <p className="font-medium">{showPreview.description}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Status:</p>
                    <p className="font-medium capitalize">{showPreview.status}</p>
                  </div>
                  {showPreview.resolution && (
                    <div className="border-t pt-4">
                      <p className="text-gray-600">Resolution:</p>
                      <p className="font-medium">{showPreview.resolution}</p>
                    </div>
                  )}
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
              Print Report
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
