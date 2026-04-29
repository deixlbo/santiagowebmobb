import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('document_requests')
    .select(`
      *,
      profiles:resident_id (full_name, email, purok)
    `)
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
    .from('document_requests')
    .insert({
      ...body,
      resident_id: user.id
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
    .from('document_requests')
    .update({ 
      ...updateData, 
      updated_at: new Date().toISOString(),
      processed_by: user?.id
    })
    .eq('id', id)
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // If status is 'released', add to archive
  if (updateData.status === 'released') {
    const docRequest = data
    await supabase.from('document_archive').insert({
      document_request_id: id,
      document_type: docRequest.document_type_name,
      resident_name: docRequest.profiles?.full_name,
      released_date: new Date().toISOString(),
      fee_collected: docRequest.fee,
      processed_by: user?.user_metadata?.full_name || user?.email
    })
  }

  return NextResponse.json(data)
}
