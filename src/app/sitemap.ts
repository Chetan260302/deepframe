import { MetadataRoute } from 'next'
import { createClient } from '@/utils/supabase/server'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://deepframeblog.vercel.app'

    const supabase = createClient()
    const { data: posts } = await supabase
        .from('posts')
        .select('slug, updated_at')
        .eq('is_published', true)

    const postUrls = (posts || []).map((post) => ({
        url: `${baseUrl}/posts/${post.slug}`,
        lastModified: new Date(post.updated_at),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
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
    ]
}
