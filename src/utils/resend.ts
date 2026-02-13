import { Resend } from 'resend'
import { createClient } from '@/utils/supabase/server'

const resend = new Resend(process.env.RESEND_API_KEY)
const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

export async function broadcastNewPost(postTitle: string, postSlug: string, postExcerpt: string) {
    const supabase = createClient()

    // Fetch all subscribers
    const { data: subscribers, error: subError } = await supabase
        .from('subscriptions')
        .select('email')

    if (subError || !subscribers || subscribers.length === 0) {
        console.log('No subscribers to notify or error fetching them')
        return
    }

    const postLink = `${baseUrl}/blog/${postSlug}`
    const emails = subscribers.map(sub => sub.email)

    // Using batch or basic send based on subscriber count
    // Note: In test mode, you can only send to your own authenticated email in Resend
    try {
        const { data, error } = await resend.emails.send({
            from: 'DeepFrame <onboarding@resend.dev>', // Update this with your verified domain later
            to: emails,
            subject: `New Post: ${postTitle}`,
            html: `
                <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; rounded-xl: 12px;">
                    <h1 style="color: #2563eb; font-size: 24px; margin-bottom: 16px;">New Blog Post on DeepFrame!</h1>
                    <h2 style="font-size: 20px; font-weight: bold; color: #111827;">${postTitle}</h2>
                    <p style="color: #4b5563; line-height: 1.6; margin-bottom: 24px;">${postExcerpt}</p>
                    <a href="${postLink}" style="display: inline-block; background-color: #2563eb; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold;">
                        Read Full Article
                    </a>
                    <hr style="margin-top: 40px; border: 0; border-top: 1px solid #e5e7eb;" />
                    <p style="font-size: 12px; color: #9ca3af; text-align: center; margin-top: 20px;">
                        You're receiving this because you subscribed to DeepFrame updates.
                        <br />
                        <a href="${baseUrl}/unsubscribe?email={{EMAIL}}" style="color: #2563eb;">Unsubscribe</a>
                    </p>
                </div>
            `
        })

        if (error) {
            console.error('Error sending broadcast:', error)
        } else {
            console.log('Broadcast sent successfully:', data)
        }
    } catch (err) {
        console.error('Unexpected error in broadcast:', err)
    }
}
