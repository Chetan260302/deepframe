"use client"

import Link from 'next/link'
import { motion } from 'framer-motion'

interface PostCardProps {
    post: {
        id: string
        title: string
        slug: string
        excerpt: string | null
        meta_description?: string | null
        cover_image: string | null
        published_at: string | null
        post_categories: {
            categories: {
                name: string
                slug: string
            }
        }[]
    }
}

export default function PostCard({ post }: PostCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -5 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col overflow-hidden rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-sm transition-all hover:shadow-md h-full"
        >
            {post.cover_image && (
                <div className="relative h-48 w-full border-b border-zinc-100 dark:border-zinc-800/50 overflow-hidden">
                    <img
                        src={post.cover_image}
                        alt={post.title}
                        className="h-full w-full object-cover transition-transform duration-500 hover:scale-110"
                    />
                    <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                        {post.post_categories?.map((pc) => (
                            <span
                                key={pc.categories.slug}
                                className="inline-flex items-center rounded-full bg-blue-600/90 backdrop-blur-sm px-2.5 py-0.5 text-[10px] font-bold text-white shadow-sm capitalize"
                            >
                                {pc.categories.name}
                            </span>
                        ))}
                    </div>
                </div>
            )}
            <div className="flex flex-1 flex-col p-6">
                <div className="flex-1">
                    <Link href={`/blog/${post.slug}`} className="block group">
                        <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 group-hover:text-blue-600 dark:hover:text-blue-400 transition-colors line-clamp-2">
                            {post.title}
                        </h3>
                        <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-400 line-clamp-3 leading-relaxed">
                            {post.meta_description || post.excerpt}
                        </p>
                    </Link>
                </div>
                <div className="mt-6 flex items-center justify-between border-t border-zinc-100 dark:border-zinc-800/50 pt-4">
                    <div className="flex items-center text-xs text-zinc-500 dark:text-zinc-500 font-medium">
                        <time dateTime={post.published_at || ''}>
                            {post.published_at ? new Date(post.published_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Draft'}
                        </time>
                    </div>
                    <Link
                        href={`/blog/${post.slug}`}
                        className="text-xs font-bold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                    >
                        READ MORE →
                    </Link>
                </div>
            </div>
        </motion.div>
    )
}
