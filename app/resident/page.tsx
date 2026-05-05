import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import {
  ArrowRight,
  Clock,
  CheckCircle2,
  XCircle,
  Bell,
  AlertCircle,
  TrendingUp,
} from "lucide-react"

// Mock data for dashboard
const recentRequests = [
  {
    id: 1,
    type: "Barangay Clearance",
    status: "approved",
    date: "April 25, 2026",
    fee: "PHP 50",
  },
  {
    id: 2,
    type: "Certificate of Residency",
    status: "pending",
    date: "April 28, 2026",
    fee: "PHP 50",
  },
  {
    id: 3,
    type: "Certificate of Indigency",
    status: "rejected",
    date: "April 20, 2026",
    fee: "Free",
  },
]

const recentBlotters = [
  {
    id: 1,
    type: "Noise Complaint",
    status: "resolved",
    date: "April 22, 2026",
  },
  {
    id: 2,
    type: "Property Dispute",
    status: "processing",
    date: "April 26, 2026",
  },
]

const latestAnnouncements = [
  {
    id: 1,
    title: "Community Clean-up Drive",
    date: "May 1, 2026",
    description: "Join us for a community clean-up at the barangay plaza",
  },
  {
    id: 2,
    title: "Free Medical Check-up",
    date: "May 5, 2026",
    description: "Free health services available for all residents",
  },
]

const notifications = [
  {
    id: 1,
    message: "Your Barangay Clearance has been approved",
    time: "2 hours ago",
    read: false,
  },
  {
    id: 2,
    message: "New announcement: Community Health Drive",
    time: "5 hours ago",
    read: true,
  },
]

const statsData = [
  {
    label: "Total Requests",
    value: "5",
    icon: TrendingUp,
    color: "text-blue-600",
  },
  {
    label: "Pending Approval",
    value: "2",
    icon: Clock,
    color: "text-amber-600",
  },
  {
    label: "Approved",
    value: "2",
    icon: CheckCircle2,
    color: "text-emerald-600",
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
    case "resolved":
      return (
        <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">
          <CheckCircle2 className="mr-1 h-3 w-3" />
          Resolved
        </Badge>
      )
    case "pending":
      return (
        <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100">
          <Clock className="mr-1 h-3 w-3" />
          Waiting for Approval
        </Badge>
      )
    case "processing":
      return (
        <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100">
          <Clock className="mr-1 h-3 w-3" />
          Processing
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

export default function ResidentDashboard() {
  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="rounded-lg bg-gradient-to-r from-primary/10 to-primary/5 p-6 border">
        <h2 className="text-2xl font-bold mb-2">Welcome back, Juan Dela Cruz!</h2>
        <p className="text-muted-foreground">Here&apos;s what&apos;s happening with your barangay services</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {statsData.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.label}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="text-3xl font-bold mt-2">{stat.value}</p>
                  </div>
                  <Icon className={`h-8 w-8 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Notifications Preview */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div>
            <CardTitle className="text-lg flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Recent Notifications
            </CardTitle>
            <CardDescription>Stay updated with your requests</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {notifications.slice(0, 3).map((notif) => (
              <div
                key={notif.id}
                className={`flex items-start gap-3 p-3 rounded-lg ${
                  notif.read ? "bg-muted/50" : "bg-primary/5 border border-primary/20"
                }`}
              >
                <AlertCircle className="h-4 w-4 mt-1 text-primary flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-medium">{notif.message}</p>
                  <p className="text-xs text-muted-foreground">{notif.time}</p>
                </div>
                {!notif.read && (
                  <div className="h-2 w-2 rounded-full bg-primary mt-1 flex-shrink-0" />
                )}
              </div>
            ))}
          </div>
          <Button variant="ghost" size="sm" className="w-full mt-4" asChild>
            <Link href="/resident/notifications">
              View all notifications <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Recent Document Requests */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div>
              <CardTitle className="text-lg">Document Requests</CardTitle>
              <CardDescription>Your recent document requests</CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/resident/documents">
                View all <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentRequests.map((request) => (
                <div
                  key={request.id}
                  className="flex items-center justify-between rounded-lg border p-3 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex-1">
                    <p className="font-medium">{request.type}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <p className="text-sm text-muted-foreground">
                        {request.date}
                      </p>
                      <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">
                        {request.fee}
                      </span>
                    </div>
                  </div>
                  {getStatusBadge(request.status)}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Blotter Reports */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div>
              <CardTitle className="text-lg">Blotter Reports</CardTitle>
              <CardDescription>Your filed incident reports</CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/resident/blotter">
                View all <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentBlotters.map((blotter) => (
                <div
                  key={blotter.id}
                  className="flex items-center justify-between rounded-lg border p-3"
                >
                  <div>
                    <p className="font-medium">{blotter.type}</p>
                    <p className="text-sm text-muted-foreground">
                      {blotter.date}
                    </p>
                  </div>
                  {getStatusBadge(blotter.status)}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Latest Announcements */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div>
            <CardTitle className="text-lg">Latest Announcements</CardTitle>
            <CardDescription>
              Stay updated with barangay activities
            </CardDescription>
          </div>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/resident/announcements">
              View all <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2">
            {latestAnnouncements.map((announcement) => (
              <div
                key={announcement.id}
                className="rounded-lg border p-4 transition-colors hover:bg-muted/50 hover:border-primary cursor-pointer"
              >
                <div className="flex items-start gap-3">
                  <div className="rounded-lg bg-primary/10 p-2 flex-shrink-0">
                    <Bell className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{announcement.title}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {announcement.date}
                    </p>
                    <p className="text-sm text-muted-foreground mt-2">
                      {announcement.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
