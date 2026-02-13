'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function subscribe(formData: FormData) {
    const email = formData.get('email') as string
    if (!email) return { error: 'Email is required' }

    const supabase = createClient()
    const { error } = await supabase
        .from('subscriptions')
        .insert([{ email }])

    if (error) {
        if (error.code === '23505') {
            return { error: 'You are already subscribed!' }
        }
        return { error: 'Something went wrong. Please try again.' }
    }

    revalidatePath('/')
    return { success: 'Thank you for subscribing!' }
}

export async function unsubscribe(email: string) {
    const supabase = createClient()
    const { error } = await supabase
        .from('subscriptions')
        .delete()
        .eq('email', email)

    if (error) {
        return { error: 'Could not unsubscribe. Please try again.' }
    }

    return { success: 'You have been unsubscribed.' }
}
