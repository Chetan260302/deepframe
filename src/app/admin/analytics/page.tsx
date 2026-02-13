import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { BarChart3, Eye, TrendingUp, Users } from 'lucide-react'

export default async function AnalyticsPage() {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/admin/login')
    }

    // Fetch views per post
    const { data: postViews } = await supabase
        .from('post_views')
        .select(`
            view_count,
            view_date,
            posts (title)
        `)
        .order('view_date', { ascending: false })
        .limit(100)

    // Calculate totals
    const totalViews = postViews?.reduce((sum, v) => sum + (v.view_count || 0), 0) || 0

    // Group by post title
    const viewsByPost: Record<string, number> = {}
    postViews?.forEach(v => {
        const title = (v.posts as any)?.title || 'Unknown'
        viewsByPost[title] = (viewsByPost[title] || 0) + (v.view_count || 0)
    })

    const topPosts = Object.entries(viewsByPost)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5)

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100 mb-8">Analytics Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <div className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 rounded-2xl bg-blue-50 dark:bg-blue-900/20 text-blue-600">
                            <Eye size={24} />
                        </div>
                        <h3 className="font-bold text-zinc-500">Total Views</h3>
                    </div>
                    <p className="text-4xl font-black text-zinc-900 dark:text-zinc-100">{totalViews}</p>
                </div>

                <div className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 rounded-2xl bg-purple-50 dark:bg-purple-900/20 text-purple-600">
                            <TrendingUp size={24} />
                        </div>
                        <h3 className="font-bold text-zinc-500">Avg. Daily Views</h3>
                    </div>
                    <p className="text-4xl font-black text-zinc-900 dark:text-zinc-100">
                        {postViews?.length ? (totalViews / new Set(postViews.map(v => v.view_date)).size).toFixed(1) : 0}
                    </p>
                </div>

                <div className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 rounded-2xl bg-green-50 dark:bg-green-900/20 text-green-600">
                            <BarChart3 size={24} />
                        </div>
                        <h3 className="font-bold text-zinc-500">Unique Posts Tracked</h3>
                    </div>
                    <p className="text-4xl font-black text-zinc-900 dark:text-zinc-100">{Object.keys(viewsByPost).length}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="p-8 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm">
                    <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                        <BarChart3 size={20} className="text-blue-600" />
                        Top Performing Posts
                    </h2>
                    <div className="space-y-6">
                        {topPosts.map(([title, count], i) => (
                            <div key={title} className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <span className="w-6 h-6 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-xs font-bold">{i + 1}</span>
                                    <span className="font-medium text-zinc-700 dark:text-zinc-300 truncate max-w-[200px]">{title}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="h-2 w-24 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-blue-600"
                                            style={{ width: `${(count / topPosts[0][1]) * 100}%` }}
                                        />
                                    </div>
                                    <span className="text-sm font-bold">{count}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="p-8 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm">
                    <h2 className="text-xl font-bold mb-6">Recent Activity Log</h2>
                    <div className="space-y-4 max-h-[400px] overflow-y-auto">
                        {postViews?.slice(0, 10).map((v, i) => (
                            <div key={i} className="flex items-center justify-between p-3 rounded-2xl hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                                <div className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                                    {new Date(v.view_date).toLocaleDateString()}
                                </div>
                                <div className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                                    + {v.view_count} views
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
