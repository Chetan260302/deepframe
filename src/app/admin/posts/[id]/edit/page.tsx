import { createClient } from '@/utils/supabase/server'
import PostForm from '../../PostForm'
import { redirect, notFound } from 'next/navigation'

interface EditPostPageProps {
    params: {
        id: string
    }
}

export default async function EditPostPage({ params }: EditPostPageProps) {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/admin/login')
    }

    const { data: post } = await supabase
        .from('posts')
        .select('*, post_categories(*)')
        .eq('id', params.id)
        .single()

    if (!post) {
        notFound()
    }

    const { data: categories } = await supabase
        .from('categories')
        .select('*')
        .order('name')

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h1 className="text-3xl font-bold mb-8">Edit Post</h1>
            <PostForm initialData={post} categories={categories || []} />
        </div>
    )
}
