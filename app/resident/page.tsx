import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import {
  FileText,
  AlertTriangle,
  Scroll,
  FolderKanban,
  Megaphone,
  ArrowRight,
  Clock,
  CheckCircle2,
  XCircle,
} from "lucide-react"

const quickActions = [
  { name: "Request Document", href: "/resident/documents", icon: FileText },
  { name: "File Blotter", href: "/resident/blotter", icon: AlertTriangle },
  { name: "View Ordinances", href: "/resident/ordinances", icon: Scroll },
  { name: "View Projects", href: "/resident/projects", icon: FolderKanban },
  { name: "Announcements", href: "/resident/announcements", icon: Megaphone },
]

function getStatusBadge(status: string) {
  switch (status) {
    case "approved":
    case "resolved":
    case "ready":
    case "released":
      return (
        <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">
          <CheckCircle2 className="mr-1 h-3 w-3" />
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </Badge>
      )
    case "pending":
    case "processing":
    case "filed":
    case "mediation":
      return (
        <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100">
          <Clock className="mr-1 h-3 w-3" />
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </Badge>
      )
    case "rejected":
      return (
        <Badge className="bg-red-100 text-red-700 hover:bg-red-100">
          <XCircle className="mr-1 h-3 w-3" />
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </Badge>
      )
    default:
      return <Badge variant="secondary">{status}</Badge>
  }
}

async function getDashboardData() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return {
      userName: 'Guest',
      recentRequests: [],
      recentBlotters: [],
      latestAnnouncements: []
    }
  }

  const [
    { data: profile },
    { data: recentRequests },
    { data: recentBlotters },
    { data: latestAnnouncements }
  ] = await Promise.all([
    supabase.from('profiles').select('full_name').eq('id', user.id).single(),
    supabase.from('document_requests')
      .select('*')
      .eq('resident_id', user.id)
      .order('created_at', { ascending: false })
      .limit(3),
    supabase.from('blotter_reports')
      .select('*')
      .eq('complainant_id', user.id)
      .order('created_at', { ascending: false })
      .limit(2),
    supabase.from('announcements')
      .select('*')
      .eq('status', 'published')
      .order('created_at', { ascending: false })
      .limit(2)
  ])

  return {
    userName: profile?.full_name?.split(' ')[0] || user.email?.split('@')[0] || 'Resident',
    recentRequests: recentRequests || [],
    recentBlotters: recentBlotters || [],
    latestAnnouncements: latestAnnouncements || []
  }
}

export default async function ResidentDashboard() {
  const { userName, recentRequests, recentBlotters, latestAnnouncements } = await getDashboardData()

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight">
          Welcome back, {userName}!
        </h1>
        <p className="text-muted-foreground">
          Here&apos;s what&apos;s happening in Barangay Santiago
        </p>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Quick Actions</CardTitle>
          <CardDescription>Access barangay services quickly</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {quickActions.map((action) => (
              <Link key={action.name} href={action.href}>
                <Card className="group cursor-pointer transition-all hover:border-primary hover:shadow-md">
                  <CardContent className="flex flex-col items-center justify-center p-4 text-center">
                    <div className="mb-2 rounded-lg bg-primary/10 p-2 transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                      <action.icon className="h-5 w-5" />
                    </div>
                    <span className="text-xs font-medium">{action.name}</span>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
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
            {recentRequests.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">No document requests yet</p>
            ) : (
              <div className="space-y-3">
                {recentRequests.map((request: any) => (
                  <div
                    key={request.id}
                    className="flex items-center justify-between rounded-lg border p-3"
                  >
                    <div>
                      <p className="font-medium">{request.document_type_name || 'Document Request'}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(request.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    {getStatusBadge(request.status)}
                  </div>
                ))}
              </div>
            )}
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
            {recentBlotters.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">No blotter reports filed</p>
            ) : (
              <div className="space-y-3">
                {recentBlotters.map((blotter: any) => (
                  <div
                    key={blotter.id}
                    className="flex items-center justify-between rounded-lg border p-3"
                  >
                    <div>
                      <p className="font-medium">{blotter.incident_type}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(blotter.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    {getStatusBadge(blotter.status)}
                  </div>
                ))}
              </div>
            )}
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
          {latestAnnouncements.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">No announcements yet</p>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2">
              {latestAnnouncements.map((announcement: any) => (
                <div
                  key={announcement.id}
                  className="rounded-lg border p-4 transition-colors hover:bg-muted/50"
                >
                  <div className="flex items-start gap-3">
                    <div className="rounded-lg bg-primary/10 p-2">
                      <Megaphone className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{announcement.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {announcement.publish_date 
                          ? new Date(announcement.publish_date).toLocaleDateString() 
                          : new Date(announcement.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
