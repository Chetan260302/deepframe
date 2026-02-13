import { createClient } from '@/utils/supabase/server'
import PostCard from '@/components/PostCard'
import { SubscriptionForm } from '@/components/SubscriptionForm'

export const revalidate = 3600 // revalidate at most every hour

export default async function Home() {
    const supabase = createClient()

    const { data: posts } = await supabase
        .from('posts')
        .select(`
      *,
      post_categories (
        categories (
          name,
          slug
        )
      )
    `)
        .eq('is_published', true)
        .order('published_at', { ascending: false })

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center mb-16">
                <h1 className="text-4xl font-extrabold text-zinc-900 dark:text-zinc-100 sm:text-5xl md:text-6xl">
                    Insights & Stories
                </h1>
                <p className="mt-3 max-w-2xl mx-auto text-xl text-zinc-500 dark:text-zinc-400 sm:mt-4">
                    Exploring software engineering, design, and everything in between.
                </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {posts?.map((post) => (
                    <PostCard key={post.id} post={post} />
                ))}
            </div>

            {(!posts || posts.length === 0) && (
                <div className="text-center py-20">
                    <p className="text-zinc-500">No posts found. Start writing in the admin panel!</p>
                </div>
            )}

            <div className="mt-20">
                <SubscriptionForm />
            </div>
        </div>
    )
}
