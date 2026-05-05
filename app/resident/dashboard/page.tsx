"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import {
  FileText,
  CheckCircle2,
  Clock,
  Download,
  Bell,
  AlertTriangle,
  History,
  Plus,
  Eye,
  Megaphone,
} from "lucide-react"

interface DocumentRequest {
  id: string
  type: string
  status: 'pending' | 'approved' | 'rejected'
  date: string
  controlNumber: string
}

interface Blotter {
  id: string
  type: string
  status: 'pending' | 'ongoing' | 'resolved'
  date: string
}

interface Notification {
  id: string
  message: string
  time: string
  read: boolean
  type: 'document' | 'announcement' | 'blotter'
}

const mockRequests: DocumentRequest[] = [
  {
    id: "req-1",
    type: "Barangay Clearance",
    status: "approved",
    date: "Apr 25, 2026",
    controlNumber: "2026-00123",
  },
  {
    id: "req-2",
    type: "Certificate of Residency",
    status: "pending",
    date: "Apr 28, 2026",
    controlNumber: "2026-00124",
  },
]

const mockBlotters: Blotter[] = [
  {
    id: "b-1",
    type: "Noise Complaint",
    status: "resolved",
    date: "Apr 22, 2026",
  },
  {
    id: "b-2",
    type: "Property Dispute",
    status: "ongoing",
    date: "Apr 26, 2026",
  },
]

const mockNotifications: Notification[] = [
  {
    id: "n-1",
    message: "Your Barangay Clearance has been approved!",
    time: "5 mins ago",
    read: false,
    type: "document",
  },
  {
    id: "n-2",
    message: "New announcement: Community Health Drive",
    time: "2 hours ago",
    read: false,
    type: "announcement",
  },
  {
    id: "n-3",
    message: "Your blotter case is now resolved",
    time: "1 day ago",
    read: true,
    type: "blotter",
  },
]

const mockAnnouncements = [
  {
    id: "a-1",
    title: "Community Health Drive",
    content: "Free health checkup for all residents. April 30, 9:00 AM at Barangay Hall",
    date: "Apr 28, 2026",
  },
  {
    id: "a-2",
    title: "Road Maintenance Update",
    content: "Purok 1 and Purok 2 roads will be repaired. Minimal traffic expected.",
    date: "Apr 27, 2026",
  },
]

export default function ResidentDashboard() {
  const [selectedDocType, setSelectedDocType] = useState("")
  const [requestPurpose, setRequestPurpose] = useState("")
  const [notifications, setNotifications] = useState(mockNotifications)
  const [unreadCount, setUnreadCount] = useState(
    mockNotifications.filter((n) => !n.read).length
  )

  const handleDocumentRequest = async () => {
    if (!selectedDocType || !requestPurpose) {
      alert("Please fill all fields")
      return
    }

    try {
      const response = await fetch("/api/documents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          residentId: "resident-1",
          residentName: "Juan Dela Cruz",
          address: "Barangay Santiago",
          documentType: selectedDocType.toLowerCase().replace(/ /g, "_"),
          purpose: requestPurpose,
          barangayCaptan: "Rolando C. Borja",
        }),
      })

      if (response.ok) {
        alert("Document request submitted successfully!")
        setSelectedDocType("")
        setRequestPurpose("")
      }
    } catch (error) {
      console.error("Error:", error)
      alert("Error submitting request")
    }
  }

  const markNotificationAsRead = (id: string) => {
    const updated = notifications.map((n) =>
      n.id === id ? { ...n, read: true } : n
    )
    setNotifications(updated)
    setUnreadCount(updated.filter((n) => !n.read).length)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header with Notifications */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-4xl font-bold text-slate-900">Welcome, Juan</h1>
            <p className="text-slate-600 mt-1">Barangay Santiago Resident Dashboard</p>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="relative">
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>🔔 Notifications</DialogTitle>
              </DialogHeader>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {notifications.length === 0 ? (
                  <p className="text-center text-slate-600 py-4">No notifications</p>
                ) : (
                  notifications.map((notif) => (
                    <div
                      key={notif.id}
                      className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                        notif.read
                          ? "bg-slate-50 border-slate-200"
                          : "bg-blue-50 border-blue-200"
                      }`}
                      onClick={() => markNotificationAsRead(notif.id)}
                    >
                      <p className="font-medium text-sm text-slate-900">
                        {notif.message}
                      </p>
                      <p className="text-xs text-slate-500 mt-1">{notif.time}</p>
                    </div>
                  ))
                )}
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-slate-600">Request Status</p>
              <p className="text-2xl font-bold text-slate-900 mt-2">2 Pending</p>
              <p className="text-xs text-emerald-600 mt-1">1 Approved</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-slate-600">Blotter Reports</p>
              <p className="text-2xl font-bold text-slate-900 mt-2">2 Total</p>
              <p className="text-xs text-emerald-600 mt-1">1 Resolved</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-slate-600">Verification</p>
              <p className="text-2xl font-bold text-emerald-600 mt-2">✓ Verified</p>
              <p className="text-xs text-slate-600 mt-1">Account active</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Document Request */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="w-5 h-5" />
                Request Document
              </CardTitle>
              <CardDescription>Submit a new document request</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-sm">Document Type</Label>
                <Select value={selectedDocType} onValueChange={setSelectedDocType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="barangay_clearance">Barangay Clearance</SelectItem>
                    <SelectItem value="certificate_of_residency">Certificate of Residency</SelectItem>
                    <SelectItem value="certificate_of_indigency">Certificate of Indigency</SelectItem>
                    <SelectItem value="certificate_of_solo_parent">Certificate of Solo Parent</SelectItem>
                    <SelectItem value="barangay_business_clearance">Business Clearance</SelectItem>
                    <SelectItem value="medical_assistance_certificate">Medical Assistance</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-sm">Purpose</Label>
                <Textarea
                  placeholder="Why do you need this document?"
                  value={requestPurpose}
                  onChange={(e) => setRequestPurpose(e.target.value)}
                  className="text-sm"
                />
              </div>
              <Button onClick={handleDocumentRequest} className="w-full">
                Submit Request
              </Button>
            </CardContent>
          </Card>

          {/* Recent Requests */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Document Requests
              </CardTitle>
              <CardDescription>Your recent requests and their status</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {mockRequests.map((req) => (
                <div
                  key={req.id}
                  className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  <div>
                    <p className="font-medium text-slate-900">{req.type}</p>
                    <div className="flex items-center gap-2 text-xs text-slate-600 mt-1">
                      <span>{req.date}</span>
                      <span>•</span>
                      <span>Control: {req.controlNumber}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      className={
                        req.status === "approved"
                          ? "bg-emerald-100 text-emerald-800"
                          : req.status === "pending"
                          ? "bg-amber-100 text-amber-800"
                          : "bg-red-100 text-red-800"
                      }
                    >
                      {req.status === "approved" && (
                        <CheckCircle2 className="w-3 h-3 mr-1" />
                      )}
                      {req.status === "pending" && (
                        <Clock className="w-3 h-3 mr-1" />
                      )}
                      {req.status}
                    </Badge>
                    {req.status === "approved" && (
                      <Button size="sm" variant="outline">
                        <Download className="w-3 h-3" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Blotter & Announcements */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Blotter Reports */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                Blotter Reports
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {mockBlotters.map((blotter) => (
                <div
                  key={blotter.id}
                  className="p-3 bg-slate-50 rounded-lg"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-slate-900">{blotter.type}</p>
                      <p className="text-xs text-slate-600 mt-1">{blotter.date}</p>
                    </div>
                    <Badge
                      className={
                        blotter.status === "resolved"
                          ? "bg-emerald-100 text-emerald-800"
                          : blotter.status === "ongoing"
                          ? "bg-amber-100 text-amber-800"
                          : "bg-slate-100 text-slate-800"
                      }
                    >
                      {blotter.status}
                    </Badge>
                  </div>
                </div>
              ))}
              <Button variant="outline" className="w-full mt-2">
                File New Report
              </Button>
            </CardContent>
          </Card>

          {/* Announcements */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Megaphone className="w-5 h-5" />
                Latest Announcements
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {mockAnnouncements.map((announcement) => (
                <div key={announcement.id} className="p-3 bg-slate-50 rounded-lg">
                  <p className="font-medium text-slate-900 text-sm">
                    {announcement.title}
                  </p>
                  <p className="text-xs text-slate-600 mt-1 line-clamp-2">
                    {announcement.content}
                  </p>
                  <p className="text-xs text-slate-500 mt-2">{announcement.date}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
