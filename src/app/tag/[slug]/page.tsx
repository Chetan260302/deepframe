import { createClient } from '@/utils/supabase/server'
import PostCard from '@/components/PostCard'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

interface TagPageProps {
    params: {
        slug: string
    }
}

export async function generateMetadata({ params }: TagPageProps): Promise<Metadata> {
    const supabase = createClient()
    const { data: tag } = await supabase
        .from('tags')
        .select('name')
        .eq('slug', params.slug)
        .single()

    return {
        title: tag ? `Articles tagged with #${tag.name}` : 'Tag',
        description: `Explore all blog posts tagged with ${tag?.name || 'this topic'}.`,
    }
}

export default async function TagPage({ params }: TagPageProps) {
    const supabase = createClient()

    const { data: tag } = await supabase
        .from('tags')
        .select('*')
        .eq('slug', params.slug)
        .single()

    if (!tag) {
        notFound()
    }

    const { data: posts } = await supabase
        .from('post_tags')
        .select(`
            post:posts (
                *,
                post_categories (
                    categories (
                        name,
                        slug
                    )
                ),
                post_tags (
                    tags (
                        name,
                        slug
                    )
                )
            )
        `)
        .eq('tag_id', tag.id)
        .eq('post.is_published', true)
        .order('post(published_at)', { ascending: false })

    // Filter out null posts (in case of RLS or other issues) and map to a cleaner structure
    const filteredPosts = posts
        ?.map((item: any) => item.post)
        .filter((post: any) => post !== null) || []

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="mb-16">
                <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                    Tag: <span className="text-blue-600">#{tag.name}</span>
                </h1>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {filteredPosts.map((post: any) => (
                    <PostCard key={post.id} post={post} />
                ))}
            </div>

            {filteredPosts.length === 0 && (
                <div className="text-center py-20">
                    <p className="text-zinc-500">No posts found with this tag.</p>
                </div>
            )}
        </div>
    )
}
