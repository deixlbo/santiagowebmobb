import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('blotter_reports')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const body = await request.json()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data, error } = await supabase
    .from('blotter_reports')
    .insert({
      ...body,
      complainant_id: user.id,
      complainant_name: body.complainant_name || user.user_metadata?.full_name
    })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}

export async function PUT(request: NextRequest) {
  const supabase = await createClient()
  const body = await request.json()
  const { id, ...updateData } = body
  
  const { data: { user } } = await supabase.auth.getUser()
  
  const { data, error } = await supabase
    .from('blotter_reports')
    .update({ 
      ...updateData, 
      updated_at: new Date().toISOString(),
      handled_by: user?.id
    })
    .eq('id', id)
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}
