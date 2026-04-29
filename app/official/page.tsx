import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import {
  Users,
  FileText,
  AlertTriangle,
  Building2,
  Megaphone,
  ArrowRight,
  TrendingUp,
  Clock,
} from "lucide-react"

async function getDashboardData() {
  const supabase = await createClient()
  
  const [
    { count: residentsCount },
    { count: documentsCount },
    { data: pendingDocuments },
    { count: blotterCount },
    { count: projectsCount },
    { count: businessCount },
    { data: recentDocuments },
    { data: recentBlotters },
    { data: ongoingProjects }
  ] = await Promise.all([
    supabase.from('profiles').select('*', { count: 'exact', head: true }),
    supabase.from('document_requests').select('*', { count: 'exact', head: true }),
    supabase.from('document_requests').select('*, profiles:resident_id (full_name)').eq('status', 'pending').limit(3),
    supabase.from('blotter_reports').select('*', { count: 'exact', head: true }).in('status', ['filed', 'processing', 'mediation']),
    supabase.from('projects').select('*', { count: 'exact', head: true }),
    supabase.from('business_permits').select('*', { count: 'exact', head: true }),
    supabase.from('document_requests')
      .select('*, profiles:resident_id (full_name)')
      .order('created_at', { ascending: false })
      .limit(4),
    supabase.from('blotter_reports')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(4),
    supabase.from('projects')
      .select('*')
      .eq('status', 'ongoing')
      .limit(2)
  ])

  return {
    stats: {
      residents: residentsCount || 0,
      documents: documentsCount || 0,
      pendingDocuments: pendingDocuments?.length || 0,
      blotters: blotterCount || 0,
      projects: projectsCount || 0,
      businesses: businessCount || 0
    },
    pendingApprovals: pendingDocuments || [],
    recentDocuments: recentDocuments || [],
    recentBlotters: recentBlotters || [],
    ongoingProjects: ongoingProjects || []
  }
}

export default async function OfficialDashboard() {
  const { stats, pendingApprovals, recentDocuments, recentBlotters, ongoingProjects } = await getDashboardData()
  
  const statsData = [
    { name: "Total Residents", value: stats.residents.toLocaleString(), icon: Users, href: "/official/residents" },
    { name: "Pending Documents", value: stats.pendingDocuments.toString(), icon: FileText, href: "/official/documents" },
    { name: "Active Blotters", value: stats.blotters.toString(), icon: AlertTriangle, href: "/official/blotters" },
    { name: "Business Permits", value: stats.businesses.toString(), icon: Building2, href: "/official/business" },
  ]

  const recentActivities = [
    ...recentDocuments.map((doc: any) => ({
      id: doc.id,
      type: "document" as const,
      action: `Document Request: ${doc.document_type_name || 'Unknown'}`,
      name: doc.profiles?.full_name || 'Unknown',
      time: new Date(doc.created_at).toLocaleDateString()
    })),
    ...recentBlotters.map((blotter: any) => ({
      id: blotter.id,
      type: "blotter" as const,
      action: `Blotter Filed: ${blotter.incident_type || 'Unknown'}`,
      name: blotter.complainant_name || 'Unknown',
      time: new Date(blotter.created_at).toLocaleDateString()
    }))
  ].slice(0, 4)

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back! Here&apos;s your barangay overview.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statsData.map((stat) => (
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
                  <span className="text-accent">Active</span>
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
            {pendingApprovals.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">No pending approvals</p>
            ) : (
              <div className="space-y-3">
                {pendingApprovals.map((item: any) => (
                  <div 
                    key={item.id}
                    className="flex items-center justify-between rounded-lg border p-3"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Clock className="h-3 w-3 text-amber-500" />
                        <span className="text-xs text-muted-foreground">Document Request</span>
                      </div>
                      <p className="font-medium">{item.document_type_name || 'Unknown Document'}</p>
                      <p className="text-sm text-muted-foreground">
                        {item.profiles?.full_name || 'Unknown'} | {new Date(item.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" asChild>
                        <Link href="/official/documents">View</Link>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
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
            {recentActivities.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">No recent activity</p>
            ) : (
              <div className="space-y-3">
                {recentActivities.map((activity) => (
                  <div 
                    key={activity.id}
                    className="flex items-start gap-3 rounded-lg border p-3"
                  >
                    <div className="mt-0.5 rounded-full bg-primary/10 p-1.5">
                      {activity.type === "document" && <FileText className="h-3 w-3 text-primary" />}
                      {activity.type === "blotter" && <AlertTriangle className="h-3 w-3 text-amber-500" />}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{activity.action}</p>
                      <p className="text-sm text-muted-foreground">{activity.name}</p>
                      <p className="text-xs text-muted-foreground">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
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
            {ongoingProjects.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">No ongoing projects</p>
            ) : (
              <div className="space-y-4">
                {ongoingProjects.map((project: any) => (
                  <div key={project.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{project.title}</p>
                        <p className="text-sm text-muted-foreground">{project.location || 'No location'}</p>
                      </div>
                      <span className="text-sm font-medium">{project.progress || 0}%</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-muted">
                      <div 
                        className="h-full bg-primary transition-all" 
                        style={{ width: `${project.progress || 0}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
