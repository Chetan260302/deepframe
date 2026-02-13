import { createClient } from '@/utils/supabase/server'
import PostForm from '../PostForm'
import { redirect } from 'next/navigation'

export default async function NewPostPage() {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/admin/login')
    }

    const { data: categories } = await supabase
        .from('categories')
        .select('*')
        .order('name')

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h1 className="text-3xl font-bold mb-8">Create New Post</h1>
            <PostForm categories={categories || []} />
        </div>
    )
}
