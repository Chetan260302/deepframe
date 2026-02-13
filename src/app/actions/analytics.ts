'use server'

import { createClient } from '@/utils/supabase/server'

export async function trackPostView(postId: string) {
    const supabase = createClient()

    // Using a Supabase RPC or direct upsert for simplicity
    // But we'll do a check and insert/update approach here
    const today = new Date().toISOString().split('T')[0]

    const { data: existing } = await supabase
        .from('post_views')
        .select('view_count')
        .eq('post_id', postId)
        .eq('view_date', today)
        .single()

    if (existing) {
        await supabase
            .from('post_views')
            .update({ view_count: existing.view_count + 1 })
            .eq('post_id', postId)
            .eq('view_date', today)
    } else {
        await supabase
            .from('post_views')
            .insert({ post_id: postId, view_date: today, view_count: 1 })
    }
}
