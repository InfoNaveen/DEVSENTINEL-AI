import { NextRequest, NextResponse } from 'next/server';
import { supabaseServiceRole } from '@/lib/supabase';
import { getAuthenticatedUser } from '@/lib/auth-utils';

export async function POST(request: NextRequest) {
  try {
    // Authenticate user
    const user = await getAuthenticatedUser(request);
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { projectId, eventType, eventMessage } = body;

    // Validate input
    if (!projectId || !eventType || !eventMessage) {
      return NextResponse.json({ 
        success: false, 
        error: 'Project ID, event type, and event message are required' 
      }, { status: 400 });
    }

    // Validate input lengths
    if (eventType.length > 50) {
      return NextResponse.json({ 
        success: false, 
        error: 'Event type is too long (max 50 characters)' 
      }, { status: 400 });
    }

    if (eventMessage.length > 500) {
      return NextResponse.json({ 
        success: false, 
        error: 'Event message is too long (max 500 characters)' 
      }, { status: 400 });
    }

    // Initialize Supabase client
    const supabase = supabaseServiceRole();

    // Verify project ownership
    const { data: project } = await supabase
      .from('projects')
      .select('id')
      .eq('id', projectId)
      .eq('user_id', user.id)
      .single();

    if (!project) {
      return NextResponse.json({ success: false, error: 'Project not found or access denied' }, { status: 404 });
    }

    // Insert timeline event
    const { data, error } = await supabase
      .from('timeline_events')
      .insert([
        {
          project_id: projectId,
          event_type: eventType,
          event_message: eventMessage
        }
      ])
      .select()
      .single();

    if (error) {
      console.error('Error adding timeline event:', error);
      return NextResponse.json({ 
        success: false, 
        error: 'Failed to add timeline event' 
      }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      event: data 
    });
  } catch (error) {
    console.error('Timeline event error:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Internal server error' 
    }, { status: 500 });
  }
}