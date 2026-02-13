import { createClient } from '@/utils/supabase/server'
import PostCard from '@/components/PostCard'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

interface CategoryPageProps {
    params: {
        slug: string
    }
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
    const supabase = createClient()
    const { data: category } = await supabase
        .from('categories')
        .select('name')
        .eq('slug', params.slug)
        .single()

    return {
        title: category ? `Articles in ${category.name}` : 'Category',
        description: `Explore all blog posts categorized under ${category?.name || 'this topic'}.`,
    }
}

export default async function CategoryPage({ params }: CategoryPageProps) {
    const supabase = createClient()

    const { data: category } = await supabase
        .from('categories')
        .select('*')
        .eq('slug', params.slug)
        .single()

    if (!category) {
        notFound()
    }

    const { data: posts } = await supabase
        .from('post_categories')
        .select(`
            post:posts (
                *,
                post_categories (
                    categories (
                        name,
                        slug
                    )
                )
            )
        `)
        .eq('category_id', category.id)
        .eq('post.is_published', true)
        .eq('is_published', true)
        .order('published_at', { ascending: false })

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="mb-16">
                <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                    Category: <span className="text-blue-600">{category.name}</span>
                </h1>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {posts?.map((item: any) => (
                    <PostCard key={item.post.id} post={item.post} />
                ))}
            </div>

            {(!posts || posts.length === 0) && (
                <div className="text-center py-20">
                    <p className="text-zinc-500">No posts found in this category.</p>
                </div>
            )}
        </div>
    )
}
