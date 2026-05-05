"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
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
  Plus,
  Megaphone,
  ArrowRight,
  FolderKanban,
  Scroll,
  MapPin,
  Phone,
  Mail,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"

interface DocumentRequest {
  id: string
  type: string
  status: 'pending' | 'approved' | 'rejected'
  date: string
  controlNumber: string
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
    category: "Health",
  },
  {
    id: "a-2",
    title: "Road Maintenance Update",
    content: "Purok 1 and Purok 2 roads will be repaired. Minimal traffic expected.",
    date: "Apr 27, 2026",
    category: "Advisory",
  },
  {
    id: "a-3",
    title: "Barangay Assembly Meeting",
    content: "All residents are invited to attend the quarterly Barangay Assembly on May 1.",
    date: "Apr 25, 2026",
    category: "Meeting",
  },
]

const mockProjects = [
  {
    id: "p-1",
    title: "Road Improvement Project",
    location: "Purok 3",
    progress: 65,
    status: "Ongoing",
  },
  {
    id: "p-2",
    title: "Health Center Renovation",
    location: "Barangay Center",
    progress: 100,
    status: "Completed",
  },
  {
    id: "p-3",
    title: "Solar Street Lights",
    location: "Main Road",
    progress: 0,
    status: "Planned",
  },
]

const mockOrdinances = [
  {
    id: "o-1",
    number: "001",
    year: "2026",
    title: "Noise Regulation Ordinance",
    date: "March 15, 2026",
  },
  {
    id: "o-2",
    number: "002",
    year: "2026",
    title: "Waste Management Ordinance",
    date: "February 20, 2026",
  },
  {
    id: "o-3",
    number: "003",
    year: "2025",
    title: "Business Permit Guidelines",
    date: "December 10, 2025",
  },
]

const barangayInfo = {
  name: "Barangay Santiago",
  municipality: "San Antonio",
  province: "Zambales",
  region: "Central Luzon (Region III)",
  punongBarangay: "Hon. Rolando C. Borja",
  address: "Barangay Santiago, San Antonio, Zambales 2206",
  phone: "(047) 123-4567",
  email: "barangaysantiago@sanantonio.gov.ph",
  officeHours: "Monday - Friday, 8:00 AM - 5:00 PM",
}

export default function ResidentDashboard() {
  const [selectedDocType, setSelectedDocType] = useState("")
  const [requestPurpose, setRequestPurpose] = useState("")
  const [notifications, setNotifications] = useState(mockNotifications)
  const [unreadCount, setUnreadCount] = useState(
    mockNotifications.filter((n) => !n.read).length
  )
  const [currentSlide, setCurrentSlide] = useState(0)
  const slideInterval = useRef<NodeJS.Timeout | null>(null)

  const slides = [
    { type: "announcements", data: mockAnnouncements },
    { type: "projects", data: mockProjects },
    { type: "ordinances", data: mockOrdinances },
  ]

  useEffect(() => {
    slideInterval.current = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 5000)
    return () => {
      if (slideInterval.current) clearInterval(slideInterval.current)
    }
  }, [slides.length])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
    if (slideInterval.current) clearInterval(slideInterval.current)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
    if (slideInterval.current) clearInterval(slideInterval.current)
  }

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

  const renderSlideContent = () => {
    const slide = slides[currentSlide]
    
    if (slide.type === "announcements") {
      return (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Megaphone className="h-5 w-5 text-primary" />
              <h3 className="font-semibold">Latest Announcements</h3>
            </div>
            <Link href="/resident/announcements">
              <Button variant="ghost" size="sm" className="text-xs">
                View All <ArrowRight className="ml-1 h-3 w-3" />
              </Button>
            </Link>
          </div>
          <div className="space-y-2">
            {mockAnnouncements.slice(0, 2).map((ann) => (
              <div key={ann.id} className="p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant="outline" className="text-xs">{ann.category}</Badge>
                  <span className="text-xs text-muted-foreground">{ann.date}</span>
                </div>
                <p className="font-medium text-sm">{ann.title}</p>
                <p className="text-xs text-muted-foreground line-clamp-1">{ann.content}</p>
              </div>
            ))}
          </div>
        </div>
      )
    }
    
    if (slide.type === "projects") {
      return (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FolderKanban className="h-5 w-5 text-primary" />
              <h3 className="font-semibold">Community Projects</h3>
            </div>
            <Link href="/resident/projects">
              <Button variant="ghost" size="sm" className="text-xs">
                View All <ArrowRight className="ml-1 h-3 w-3" />
              </Button>
            </Link>
          </div>
          <div className="space-y-2">
            {mockProjects.slice(0, 2).map((proj) => (
              <div key={proj.id} className="p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center justify-between mb-1">
                  <p className="font-medium text-sm">{proj.title}</p>
                  <Badge 
                    className={`text-xs ${
                      proj.status === "Completed" ? "bg-emerald-100 text-emerald-700" :
                      proj.status === "Ongoing" ? "bg-blue-100 text-blue-700" :
                      "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {proj.status}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">{proj.location}</p>
                <div className="mt-2 h-1.5 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary transition-all"
                    style={{ width: `${proj.progress}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )
    }
    
    if (slide.type === "ordinances") {
      return (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Scroll className="h-5 w-5 text-primary" />
              <h3 className="font-semibold">Barangay Ordinances</h3>
            </div>
            <Link href="/resident/ordinances">
              <Button variant="ghost" size="sm" className="text-xs">
                View All <ArrowRight className="ml-1 h-3 w-3" />
              </Button>
            </Link>
          </div>
          <div className="space-y-2">
            {mockOrdinances.slice(0, 2).map((ord) => (
              <div key={ord.id} className="p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant="secondary" className="text-xs">
                    No. {ord.number} - {ord.year}
                  </Badge>
                </div>
                <p className="font-medium text-sm">{ord.title}</p>
                <p className="text-xs text-muted-foreground">{ord.date}</p>
              </div>
            ))}
          </div>
        </div>
      )
    }
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

      {/* Sliding Card - Announcements, Projects, Ordinances */}
      <Card className="overflow-hidden">
        <CardContent className="p-4 sm:p-6 relative">
          <div className="min-h-[200px]">
            {renderSlideContent()}
          </div>
          
          {/* Navigation */}
          <div className="flex items-center justify-between mt-4 pt-4 border-t">
            <Button variant="ghost" size="sm" onClick={prevSlide}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="flex gap-2">
              {slides.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setCurrentSlide(idx)
                    if (slideInterval.current) clearInterval(slideInterval.current)
                  }}
                  className={`h-2 rounded-full transition-all ${
                    currentSlide === idx ? "w-6 bg-primary" : "w-2 bg-muted-foreground/30"
                  }`}
                />
              ))}
            </div>
            <Button variant="ghost" size="sm" onClick={nextSlide}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Barangay Information */}
      <Card>
        <CardHeader className="pb-2 sm:pb-4">
          <CardTitle className="text-sm sm:text-base flex items-center gap-2">
            <Image
              src="/images/santiagologo.jpg"
              alt="Barangay Santiago"
              width={24}
              height={24}
              className="rounded-full w-6 h-6"
            />
            About Barangay Santiago
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            <div className="space-y-2">
              <div>
                <p className="text-xs text-muted-foreground">Punong Barangay</p>
                <p className="font-medium">{barangayInfo.punongBarangay}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Location</p>
                <p className="font-medium">{barangayInfo.municipality}, {barangayInfo.province}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Region</p>
                <p className="font-medium">{barangayInfo.region}</p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                <p className="text-xs">{barangayInfo.address}</p>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <p className="text-xs">{barangayInfo.phone}</p>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <p className="text-xs">{barangayInfo.email}</p>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <p className="text-xs">{barangayInfo.officeHours}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

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
    </div>
  )
}
