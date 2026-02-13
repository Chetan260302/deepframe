import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { LayoutGrid } from 'lucide-react'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
    title: 'Explore Categories',
    description: 'Browse all blog categories and find articles that interest you.',
}

export default async function CategoriesPage() {
    const supabase = createClient()
    const { data: categories } = await supabase
        .from('categories')
        .select(`
            *,
            post_categories (count)
        `)
        .order('name')

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <header className="mb-16 text-center">
                <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 mb-6">
                    <LayoutGrid size={32} />
                </div>
                <h1 className="text-4xl sm:text-5xl font-extrabold text-zinc-900 dark:text-zinc-100 mb-4 tracking-tight">
                    Explore Categories
                </h1>
                <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
                    Browse through our diverse topics and find exactly what you're looking for.
                </p>
            </header>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {categories?.map((category: any) => (
                    <Link
                        key={category.id}
                        href={`/category/${category.slug}`}
                        className="group relative flex flex-col p-8 rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 overflow-hidden"
                    >
                        <div className="absolute -right-4 -bottom-4 text-zinc-100 dark:text-zinc-800 transform rotate-12 group-hover:scale-110 transition-transform duration-500 opacity-20">
                            <LayoutGrid size={120} />
                        </div>

                        <div className="relative z-10">
                            <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors capitalize">
                                {category.name}
                            </h2>
                            <p className="text-sm font-medium text-zinc-500 dark:text-zinc-500">
                                {category.post_categories[0]?.count || 0} Articles
                            </p>

                            <div className="mt-8 flex items-center text-xs font-bold text-blue-600 dark:text-blue-400">
                                BROWSE ARTICLES
                                <span className="ml-2 transform group-hover:translate-x-1 transition-transform">→</span>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>

            {(!categories || categories.length === 0) && (
                <div className="text-center py-20 border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-3xl">
                    <p className="text-zinc-500">No categories found yet.</p>
                </div>
            )}
        </div>
    )
}
