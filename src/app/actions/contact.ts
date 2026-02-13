'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function sendContactMessage(formData: FormData) {
    const supabase = createClient()

    const name = formData.get('name') as string
    const email = formData.get('email') as string
    const message = formData.get('message') as string

    if (!name || !email || !message) {
        return { error: 'Please fill in all fields.' }
    }

    const { error } = await supabase.from('contact_messages').insert({
        name,
        email,
        message
    })

    if (error) {
        console.error('Contact error:', error)
        return { error: 'Failed to send message. Please try again.' }
    }

    revalidatePath('/admin/messages')
    return { success: 'Message sent successfully! We will get back to you soon.' }
}
