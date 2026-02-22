import { MetadataRoute } from 'next'
import { createClient } from '@/utils/supabase/server'

export const dynamic = 'force-dynamic'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://deepframeblog.vercel.app'

    try {
        const supabase = createClient()
        const { data: posts } = await supabase
            .from('posts')
            .select('slug, updated_at')
            .eq('is_published', true)

        const { data: tags } = await supabase
            .from('tags')
            .select('slug, created_at')

        const postUrls = (posts || []).map((post: any) => ({
            url: `${baseUrl}/blog/${post.slug}`,
            lastModified: new Date(post.updated_at),
            changeFrequency: 'weekly' as const,
            priority: 0.7,
        }))

        const tagUrls = (tags || []).map((tag: any) => ({
            url: `${baseUrl}/tag/${tag.slug}`,
            lastModified: new Date(tag.created_at),
            changeFrequency: 'weekly' as const,
            priority: 0.5,
        }))

        return [
            {
                url: baseUrl,
                lastModified: new Date(),
                changeFrequency: 'daily',
                priority: 1,
            },
            {
                url: `${baseUrl}/about`,
                lastModified: new Date(),
                changeFrequency: 'monthly',
                priority: 0.8,
            },
            {
                url: `${baseUrl}/categories`,
                lastModified: new Date(),
                changeFrequency: 'weekly',
                priority: 0.8,
            },
            ...postUrls,
            ...tagUrls,
        ]
    } catch (e) {
        console.error('Sitemap generation failed:', e)
        // Return a basic sitemap so it doesn't 404
        return [
            {
                url: baseUrl,
                lastModified: new Date(),
                changeFrequency: 'daily' as const,
                priority: 1,
            },
            {
                url: `${baseUrl}/about`,
                lastModified: new Date(),
                changeFrequency: 'monthly' as const,
                priority: 0.8,
            },
        ]
    }
}
