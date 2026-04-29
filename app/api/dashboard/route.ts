import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  const supabase = await createClient()
  
  // Get counts for various tables
  const [
    { count: residentsCount },
    { count: documentsCount },
    { count: pendingDocuments },
    { count: blotterCount },
    { count: projectsCount },
    { count: businessCount },
    { data: recentDocuments },
    { data: recentBlotters }
  ] = await Promise.all([
    supabase.from('profiles').select('*', { count: 'exact', head: true }),
    supabase.from('document_requests').select('*', { count: 'exact', head: true }),
    supabase.from('document_requests').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
    supabase.from('blotter_reports').select('*', { count: 'exact', head: true }),
    supabase.from('projects').select('*', { count: 'exact', head: true }),
    supabase.from('business_permits').select('*', { count: 'exact', head: true }),
    supabase.from('document_requests')
      .select('*, profiles:resident_id (full_name)')
      .order('created_at', { ascending: false })
      .limit(5),
    supabase.from('blotter_reports')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5)
  ])

  return NextResponse.json({
    stats: {
      residents: residentsCount || 0,
      documents: documentsCount || 0,
      pendingDocuments: pendingDocuments || 0,
      blotters: blotterCount || 0,
      projects: projectsCount || 0,
      businesses: businessCount || 0
    },
    recentDocuments: recentDocuments || [],
    recentBlotters: recentBlotters || []
  })
}
