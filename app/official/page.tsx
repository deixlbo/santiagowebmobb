import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import {
  Users,
  FileText,
  AlertTriangle,
  Building2,
  FolderKanban,
  Megaphone,
  ArrowRight,
  TrendingUp,
  Clock,
  CheckCircle2,
} from "lucide-react"

// Stats data
const stats = [
  { name: "Total Residents", value: "1,245", change: "+12", icon: Users, href: "/official/residents" },
  { name: "Pending Documents", value: "23", change: "-5", icon: FileText, href: "/official/documents" },
  { name: "Active Blotters", value: "8", change: "+2", icon: AlertTriangle, href: "/official/blotters" },
  { name: "Business Permits", value: "45", change: "+3", icon: Building2, href: "/official/business" },
]

// Recent activities
const recentActivities = [
  { id: 1, type: "document", action: "New document request", name: "Juan Dela Cruz", time: "5 minutes ago" },
  { id: 2, type: "blotter", action: "Blotter filed", name: "Maria Santos", time: "15 minutes ago" },
  { id: 3, type: "business", action: "Business permit approved", name: "Pedro Store", time: "1 hour ago" },
  { id: 4, type: "resident", action: "New resident registered", name: "Ana Reyes", time: "2 hours ago" },
]

// Pending approvals
const pendingApprovals = [
  { id: 1, type: "Document Request", name: "Certificate of Residency", requester: "Juan Dela Cruz", date: "April 28, 2026" },
  { id: 2, type: "Business Permit", name: "Sari-sari Store", requester: "Maria Santos", date: "April 27, 2026" },
  { id: 3, type: "Verification", name: "Account Verification", requester: "Pedro Reyes", date: "April 26, 2026" },
]

// Ongoing projects
const ongoingProjects = [
  { id: 1, title: "Road Improvement", progress: 65, location: "Purok 3" },
  { id: 2, title: "Community Watch", progress: 45, location: "All Puroks" },
]

export default function OfficialDashboard() {
  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back, Captain Borja. Here&apos;s your barangay overview.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Link key={stat.name} href={stat.href}>
            <Card className="transition-shadow hover:shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.name}
                </CardTitle>
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <TrendingUp className="h-3 w-3 text-accent" />
                  <span className="text-accent">{stat.change}</span> from last month
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Pending Approvals */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-lg">Pending Approvals</CardTitle>
              <CardDescription>Items requiring your action</CardDescription>
            </div>
            <Badge variant="secondary">{pendingApprovals.length} pending</Badge>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {pendingApprovals.map((item) => (
                <div 
                  key={item.id}
                  className="flex items-center justify-between rounded-lg border p-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Clock className="h-3 w-3 text-amber-500" />
                      <span className="text-xs text-muted-foreground">{item.type}</span>
                    </div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {item.requester} | {item.date}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">View</Button>
                    <Button size="sm">Approve</Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-lg">Recent Activity</CardTitle>
              <CardDescription>Latest actions in the system</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentActivities.map((activity) => (
                <div 
                  key={activity.id}
                  className="flex items-start gap-3 rounded-lg border p-3"
                >
                  <div className="mt-0.5 rounded-full bg-primary/10 p-1.5">
                    {activity.type === "document" && <FileText className="h-3 w-3 text-primary" />}
                    {activity.type === "blotter" && <AlertTriangle className="h-3 w-3 text-amber-500" />}
                    {activity.type === "business" && <Building2 className="h-3 w-3 text-accent" />}
                    {activity.type === "resident" && <Users className="h-3 w-3 text-blue-500" />}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{activity.action}</p>
                    <p className="text-sm text-muted-foreground">{activity.name}</p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions & Projects */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Quick Actions</CardTitle>
            <CardDescription>Common administrative tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              <Link href="/official/documents">
                <Button variant="outline" className="h-auto w-full flex-col gap-2 p-4">
                  <FileText className="h-5 w-5" />
                  <span className="text-sm">Process Documents</span>
                </Button>
              </Link>
              <Link href="/official/blotters">
                <Button variant="outline" className="h-auto w-full flex-col gap-2 p-4">
                  <AlertTriangle className="h-5 w-5" />
                  <span className="text-sm">View Blotters</span>
                </Button>
              </Link>
              <Link href="/official/announcements">
                <Button variant="outline" className="h-auto w-full flex-col gap-2 p-4">
                  <Megaphone className="h-5 w-5" />
                  <span className="text-sm">Post Announcement</span>
                </Button>
              </Link>
              <Link href="/official/residents">
                <Button variant="outline" className="h-auto w-full flex-col gap-2 p-4">
                  <Users className="h-5 w-5" />
                  <span className="text-sm">Verify Residents</span>
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Ongoing Projects */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-lg">Ongoing Projects</CardTitle>
              <CardDescription>Current community projects</CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/official/projects">
                View all <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {ongoingProjects.map((project) => (
                <div key={project.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{project.title}</p>
                      <p className="text-sm text-muted-foreground">{project.location}</p>
                    </div>
                    <span className="text-sm font-medium">{project.progress}%</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-muted">
                    <div 
                      className="h-full bg-primary transition-all" 
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
