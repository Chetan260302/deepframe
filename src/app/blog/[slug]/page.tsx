import { createClient } from '@/utils/supabase/server'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import ReactMarkdown from 'react-markdown'
import type { Metadata } from 'next'
import ViewTracker from '@/components/ViewTracker'

interface PostPageProps {
    params: {
        slug: string
    }
}

export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
    const supabase = createClient()
    const { data: post } = await supabase
        .from('posts')
        .select('title, meta_description')
        .eq('slug', params.slug)
        .single()

    if (!post) return {}

    return {
        title: post.title,
        description: post.meta_description,
    }
}

export default async function PostPage({ params }: PostPageProps) {
    const supabase = createClient()
    const { data: post } = await supabase
        .from('posts')
        .select(`
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
    `)
        .eq('slug', params.slug)
        .eq('is_published', true)
        .single()

    if (!post) {
        notFound()
    }

    return (
        <article className="max-w-4xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
            <ViewTracker postId={post.id} />
            <header className="mb-12">
                <div className="flex flex-wrap gap-2 mb-6">
                    {post.post_categories?.map((pc: any) => (
                        <span
                            key={pc.categories.slug}
                            className="inline-block rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-800 dark:bg-blue-900/50 dark:text-blue-200 capitalize"
                        >
                            {pc.categories.name}
                        </span>
                    ))}
                    {post.post_tags?.map((pt: any) => (
                        <span
                            key={pt.tags.slug}
                            className="inline-block rounded-full bg-zinc-100 px-3 py-1 text-xs font-bold text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400 capitalize"
                        >
                            #{pt.tags.name}
                        </span>
                    ))}
                </div>
                <h1 className="text-4xl sm:text-6xl font-extrabold text-zinc-900 dark:text-zinc-100 mb-8 leading-tight tracking-tight">
                    {post.title}
                </h1>
                <div className="flex items-center gap-4 text-zinc-500 text-sm font-medium border-b border-zinc-100 dark:border-zinc-800 pb-8">
                    <time dateTime={post.published_at}>
                        {new Date(post.published_at!).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                        })}
                    </time>
                    <span className="text-zinc-300 dark:text-zinc-700">•</span>
                    <span>Admin</span>
                </div>
            </header>

            {post.cover_image && (
                <div className="relative aspect-video w-full overflow-hidden rounded-[2rem] mb-16 shadow-2xl ring-1 ring-zinc-200 dark:ring-zinc-800">
                    <Image
                        src={post.cover_image}
                        alt={post.title}
                        fill
                        className="object-cover"
                        priority
                    />
                </div>
            )}

            <div
                className="
                    prose prose-lg
                    prose-zinc dark:prose-invert
                    max-w-none

                    prose-headings:font-extrabold
                    prose-headings:tracking-tight
                    prose-h2:mt-16 prose-h2:mb-6
                    prose-h3:mt-12 prose-h3:mb-4

                    prose-p:leading-relaxed
                    prose-p:text-zinc-700 dark:prose-p:text-zinc-300

                    prose-strong:text-zinc-900 dark:prose-strong:text-white

                    prose-a:text-blue-600 dark:prose-a:text-blue-400
                    prose-a:no-underline hover:prose-a:underline

                    prose-hr:my-16
                "
                >
                <ReactMarkdown
                    components={{
                        img: ({ node, ...props }) => (
                        <img
                            {...props}
                            className="
                            w-full
                            my-12
                            rounded-2xl
                            shadow-lg
                            ring-1 ring-zinc-200 dark:ring-zinc-800
                            "
                            loading="lazy"
                        />
                        ),
                    }}
                    >
                    {post.content}
                </ReactMarkdown>
            </div>
        </article>
    )
}
