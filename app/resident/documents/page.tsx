"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  FileText, 
  Plus, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Printer,
  Eye,
  Loader2,
  AlertCircle
} from "lucide-react"
import useSWR from "swr"
import { createClient } from "@/lib/supabase/client"

interface DocumentType {
  id: string
  name: string
  description: string
  fee: number
  requirements: string[]
  processing_days: number
}

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
}

const fetcher = (url: string) => fetch(url).then(res => res.json())

function getStatusBadge(status: string) {
  switch (status) {
    case "approved":
    case "ready":
      return (
        <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">
          <CheckCircle2 className="mr-1 h-3 w-3" />
          Ready for Pickup
        </Badge>
      )
    case "pending":
      return (
        <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100">
          <Clock className="mr-1 h-3 w-3" />
          Pending
        </Badge>
      )
    case "processing":
      return (
        <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">
          <Clock className="mr-1 h-3 w-3" />
          Processing
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
        <Badge className="bg-gray-100 text-gray-700 hover:bg-gray-100">
          <CheckCircle2 className="mr-1 h-3 w-3" />
          Released
        </Badge>
      )
    default:
      return <Badge variant="secondary">{status}</Badge>
  }
}

export default function DocumentsPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedType, setSelectedType] = useState<string>("")
  const [showPreview, setShowPreview] = useState<DocumentRequest | null>(null)
  const [purpose, setPurpose] = useState("")
  const [notes, setNotes] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const { data: documentTypes = [], isLoading: typesLoading } = useSWR<DocumentType[]>('/api/document-types', fetcher)
  const { data: myRequests = [], mutate, isLoading: requestsLoading } = useSWR<DocumentRequest[]>('/api/documents/my', fetcher)

  const selectedDoc = documentTypes.find((d: DocumentType) => d.id === selectedType)

  const handleSubmit = async () => {
    if (!selectedDoc || !purpose) return
    setIsSubmitting(true)
    setError(null)

    try {
      const response = await fetch('/api/documents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          document_type_id: selectedDoc.id,
          document_type_name: selectedDoc.name,
          purpose,
          fee: selectedDoc.fee,
          remarks: notes || null
        })
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to submit request')
      }

      setSuccess(true)
      mutate()
      setTimeout(() => {
        setIsDialogOpen(false)
        setSelectedType("")
        setPurpose("")
        setNotes("")
        setSuccess(false)
      }, 2000)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const pendingRequests = myRequests.filter((r: DocumentRequest) => r.status === 'pending' || r.status === 'processing')
  const approvedRequests = myRequests.filter((r: DocumentRequest) => r.status === 'approved' || r.status === 'ready')
  const rejectedRequests = myRequests.filter((r: DocumentRequest) => r.status === 'rejected')

  if (typesLoading || requestsLoading) {
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
          <p className="text-muted-foreground">Request and track your document applications</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Request
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Request Document</DialogTitle>
              <DialogDescription>
                Select a document type and provide required information
              </DialogDescription>
            </DialogHeader>
            {success ? (
              <div className="py-8 text-center">
                <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-500" />
                <p className="mt-4 font-medium">Request Submitted Successfully!</p>
                <p className="text-sm text-muted-foreground">You will be notified when your document is ready.</p>
              </div>
            ) : (
              <>
                <div className="space-y-4 py-4">
                  {error && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}
                  <div className="space-y-2">
                    <Label>Document Type</Label>
                    <Select value={selectedType} onValueChange={setSelectedType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select document type" />
                      </SelectTrigger>
                      <SelectContent>
                        {documentTypes.map((doc: DocumentType) => (
                          <SelectItem key={doc.id} value={doc.id}>
                            {doc.name} - PHP {doc.fee}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {selectedDoc && (
                    <>
                      <div className="rounded-lg border bg-muted/50 p-3">
                        <p className="text-sm font-medium">Requirements:</p>
                        <ul className="mt-1 list-inside list-disc text-sm text-muted-foreground">
                          {selectedDoc.requirements?.map((req: string, i: number) => (
                            <li key={i}>{req}</li>
                          ))}
                        </ul>
                        <p className="mt-2 text-sm">
                          <span className="font-medium">Fee:</span> PHP {selectedDoc.fee}
                        </p>
                        <p className="text-sm">
                          <span className="font-medium">Processing:</span> {selectedDoc.processing_days} day(s)
                        </p>
                      </div>

                      <div className="space-y-2">
                        <Label>Purpose *</Label>
                        <Input 
                          placeholder="e.g., Employment, School Enrollment" 
                          value={purpose}
                          onChange={(e) => setPurpose(e.target.value)}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Additional Notes (Optional)</Label>
                        <Textarea 
                          placeholder="Any additional information..."
                          value={notes}
                          onChange={(e) => setNotes(e.target.value)}
                        />
                      </div>
                    </>
                  )}
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleSubmit} 
                    disabled={!selectedType || !purpose || isSubmitting}
                  >
                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Submit Request
                  </Button>
                </DialogFooter>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>

      {/* Available Documents */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Available Documents</CardTitle>
          <CardDescription>Documents you can request from the barangay</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 grid-cols-2 sm:grid-cols-2 lg:grid-cols-4">
            {documentTypes.map((doc: DocumentType) => (
              <div 
                key={doc.id}
                className="rounded-lg border p-4 transition-colors hover:bg-muted/50 cursor-pointer"
                onClick={() => {
                  setSelectedType(doc.id)
                  setIsDialogOpen(true)
                }}
              >
                <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-medium text-sm">{doc.name}</h3>
                <p className="text-sm text-muted-foreground">PHP {doc.fee}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Request History */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">My Requests</CardTitle>
          <CardDescription>Track your document request status</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all">
            <TabsList className="w-full sm:w-auto">
              <TabsTrigger value="all">All ({myRequests.length})</TabsTrigger>
              <TabsTrigger value="pending">Pending ({pendingRequests.length})</TabsTrigger>
              <TabsTrigger value="approved">Ready ({approvedRequests.length})</TabsTrigger>
            </TabsList>
            <TabsContent value="all" className="mt-4">
              {myRequests.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">No document requests yet</p>
              ) : (
                <div className="space-y-4">
                  {myRequests.map((request: DocumentRequest) => (
                    <div 
                      key={request.id}
                      className="flex flex-col gap-4 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-medium">{request.document_type_name}</span>
                          {getStatusBadge(request.status)}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {request.request_number} | {new Date(request.created_at).toLocaleDateString()}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Purpose: {request.purpose}
                        </p>
                        {(request.status === "approved" || request.status === "ready") && request.pickup_date && (
                          <p className="text-sm text-accent font-medium">
                            Pickup: {new Date(request.pickup_date).toLocaleDateString()} {request.pickup_time || ''} | Fee: PHP {request.fee}
                          </p>
                        )}
                        {request.status === "rejected" && request.remarks && (
                          <p className="text-sm text-destructive">
                            Reason: {request.remarks}
                          </p>
                        )}
                      </div>
                      <div className="flex gap-2">
                        {(request.status === "approved" || request.status === "ready") && (
                          <>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => setShowPreview(request)}
                            >
                              <Eye className="mr-1 h-4 w-4" />
                              Preview
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
            <TabsContent value="pending" className="mt-4">
              {pendingRequests.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">No pending requests</p>
              ) : (
                <div className="space-y-4">
                  {pendingRequests.map((request: DocumentRequest) => (
                    <div 
                      key={request.id}
                      className="flex items-center justify-between rounded-lg border p-4"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{request.document_type_name}</span>
                          {getStatusBadge(request.status)}
                        </div>
                        <p className="text-sm text-muted-foreground">{request.request_number} | {new Date(request.created_at).toLocaleDateString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
            <TabsContent value="approved" className="mt-4">
              {approvedRequests.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">No documents ready for pickup</p>
              ) : (
                <div className="space-y-4">
                  {approvedRequests.map((request: DocumentRequest) => (
                    <div 
                      key={request.id}
                      className="flex flex-col gap-4 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{request.document_type_name}</span>
                          {getStatusBadge(request.status)}
                        </div>
                        <p className="text-sm text-muted-foreground">{request.request_number} | {new Date(request.created_at).toLocaleDateString()}</p>
                        {request.pickup_date && (
                          <p className="text-sm text-accent font-medium">
                            Pickup: {new Date(request.pickup_date).toLocaleDateString()} {request.pickup_time || ''}
                          </p>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => setShowPreview(request)}>
                          <Eye className="mr-1 h-4 w-4" />
                          Preview
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Document Preview Modal */}
      <Dialog open={!!showPreview} onOpenChange={() => setShowPreview(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Document Preview</DialogTitle>
          </DialogHeader>
          {showPreview && (
            <div className="rounded-lg border bg-white p-8 text-black">
              <div className="text-center space-y-1 mb-6">
                <p className="text-sm">Republic of the Philippines</p>
                <p className="text-sm">Province of Zambales</p>
                <p className="text-sm">Municipality of San Antonio</p>
                <p className="text-sm font-semibold">Barangay Santiago</p>
              </div>
              <h2 className="text-center text-lg font-bold mb-6">{showPreview.document_type_name?.toUpperCase()}</h2>
              <div className="space-y-4 text-sm">
                <p><strong>Request No:</strong> {showPreview.request_number}</p>
                <p><strong>Purpose:</strong> {showPreview.purpose}</p>
                <p><strong>Status:</strong> {showPreview.status}</p>
                <p><strong>Fee:</strong> PHP {showPreview.fee}</p>
                {showPreview.pickup_date && (
                  <p><strong>Pickup:</strong> {new Date(showPreview.pickup_date).toLocaleDateString()} {showPreview.pickup_time || ''}</p>
                )}
              </div>
              <div className="mt-8 text-center text-xs text-muted-foreground">
                <p>Please bring valid ID and exact amount when picking up your document.</p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPreview(null)}>Close</Button>
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
