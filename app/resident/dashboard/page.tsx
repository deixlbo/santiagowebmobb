"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
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
  Plus,
  Megaphone,
  ArrowRight,
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
    <div className="space-y-4 sm:space-y-6">
      {/* Header with Notifications */}
      <div className="flex flex-col sm:flex-row justify-between items-start gap-3 sm:gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Welcome, Juan</h1>
          <p className="text-sm text-muted-foreground mt-1">Barangay Santiago Resident Dashboard</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="relative">
              <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center text-[10px] sm:text-xs">
                  {unreadCount}
                </span>
              )}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Notifications</DialogTitle>
            </DialogHeader>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {notifications.length === 0 ? (
                <p className="text-center text-muted-foreground py-4">No notifications</p>
              ) : (
                notifications.map((notif) => (
                  <div
                    key={notif.id}
                    className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                      notif.read
                        ? "bg-muted/50 border-border"
                        : "bg-primary/5 border-primary/20"
                    }`}
                    onClick={() => markNotificationAsRead(notif.id)}
                  >
                    <p className="font-medium text-sm">
                      {notif.message}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">{notif.time}</p>
                  </div>
                ))
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
        <Card>
          <CardContent className="pt-4 sm:pt-6 p-3 sm:p-6">
            <p className="text-xs sm:text-sm text-muted-foreground">Request Status</p>
            <p className="text-lg sm:text-2xl font-bold mt-1 sm:mt-2">2 Pending</p>
            <p className="text-xs text-emerald-600 mt-1">1 Approved</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 sm:pt-6 p-3 sm:p-6">
            <p className="text-xs sm:text-sm text-muted-foreground">Blotter Reports</p>
            <p className="text-lg sm:text-2xl font-bold mt-1 sm:mt-2">2 Total</p>
            <p className="text-xs text-emerald-600 mt-1">1 Resolved</p>
          </CardContent>
        </Card>
        <Card className="col-span-2 sm:col-span-1">
          <CardContent className="pt-4 sm:pt-6 p-3 sm:p-6">
            <p className="text-xs sm:text-sm text-muted-foreground">Verification</p>
            <p className="text-lg sm:text-2xl font-bold text-emerald-600 mt-1 sm:mt-2 flex items-center gap-1">
              <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5" /> Verified
            </p>
            <p className="text-xs text-muted-foreground mt-1">Account active</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Document Request */}
        <Card className="lg:col-span-1">
          <CardHeader className="pb-2 sm:pb-4">
            <CardTitle className="flex items-center gap-2 text-sm sm:text-base">
              <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
              Request Document
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm">Submit a new document request</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 sm:space-y-4">
            <div>
              <Label className="text-xs sm:text-sm">Document Type</Label>
              <Select value={selectedDocType} onValueChange={setSelectedDocType}>
                <SelectTrigger className="mt-1">
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
              <Label className="text-xs sm:text-sm">Purpose</Label>
              <Textarea
                placeholder="Why do you need this document?"
                value={requestPurpose}
                onChange={(e) => setRequestPurpose(e.target.value)}
                className="text-sm mt-1"
                rows={3}
              />
            </div>
            <Button onClick={handleDocumentRequest} className="w-full text-xs sm:text-sm">
              Submit Request
            </Button>
          </CardContent>
        </Card>

        {/* Recent Requests */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2 sm:pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2 text-sm sm:text-base">
                  <FileText className="w-4 h-4 sm:w-5 sm:h-5" />
                  Document Requests
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm">Your recent requests and their status</CardDescription>
              </div>
              <Link href="/resident/documents">
                <Button variant="ghost" size="sm" className="text-xs">
                  View All <ArrowRight className="ml-1 h-3 w-3" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent className="space-y-2 sm:space-y-3">
            {mockRequests.map((req) => (
              <div
                key={req.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-2 sm:p-3 bg-muted/50 rounded-lg"
              >
                <div>
                  <p className="font-medium text-sm">{req.type}</p>
                  <div className="flex flex-wrap items-center gap-1 sm:gap-2 text-xs text-muted-foreground mt-1">
                    <span>{req.date}</span>
                    <span className="hidden sm:inline">|</span>
                    <span>Control: {req.controlNumber}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge
                    className={`text-xs ${
                      req.status === "approved"
                        ? "bg-emerald-100 text-emerald-800"
                        : req.status === "pending"
                        ? "bg-amber-100 text-amber-800"
                        : "bg-red-100 text-red-800"
                    }`}
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
                    <Button size="sm" variant="outline" className="h-7 px-2">
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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Blotter Reports */}
        <Card>
          <CardHeader className="pb-2 sm:pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-sm sm:text-base">
                <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5" />
                Blotter Reports
              </CardTitle>
              <Link href="/resident/blotter">
                <Button variant="ghost" size="sm" className="text-xs">
                  View All <ArrowRight className="ml-1 h-3 w-3" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent className="space-y-2 sm:space-y-3">
            {mockBlotters.map((blotter) => (
              <div
                key={blotter.id}
                className="p-2 sm:p-3 bg-muted/50 rounded-lg"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-sm">{blotter.type}</p>
                    <p className="text-xs text-muted-foreground mt-1">{blotter.date}</p>
                  </div>
                  <Badge
                    className={`text-xs ${
                      blotter.status === "resolved"
                        ? "bg-emerald-100 text-emerald-800"
                        : blotter.status === "ongoing"
                        ? "bg-amber-100 text-amber-800"
                        : "bg-slate-100 text-slate-800"
                    }`}
                  >
                    {blotter.status}
                  </Badge>
                </div>
              </div>
            ))}
            <Link href="/resident/blotter">
              <Button variant="outline" className="w-full mt-2 text-xs sm:text-sm">
                File New Report
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Announcements */}
        <Card>
          <CardHeader className="pb-2 sm:pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-sm sm:text-base">
                <Megaphone className="w-4 h-4 sm:w-5 sm:h-5" />
                Latest Announcements
              </CardTitle>
              <Link href="/resident/announcements">
                <Button variant="ghost" size="sm" className="text-xs">
                  View All <ArrowRight className="ml-1 h-3 w-3" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent className="space-y-2 sm:space-y-3">
            {mockAnnouncements.map((announcement) => (
              <div key={announcement.id} className="p-2 sm:p-3 bg-muted/50 rounded-lg">
                <p className="font-medium text-sm">
                  {announcement.title}
                </p>
                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                  {announcement.content}
                </p>
                <p className="text-xs text-muted-foreground mt-2">{announcement.date}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
