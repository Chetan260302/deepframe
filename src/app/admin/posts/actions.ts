'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { broadcastNewPost } from '@/utils/resend'

export async function createPost(formData: FormData) {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) throw new Error('Not authenticated')

    const title = formData.get('title') as string
    const slug = formData.get('slug') as string
    const content = formData.get('content') as string
    const excerpt = formData.get('excerpt') as string
    const cover_image = formData.get('cover_image') as string
    const category_ids = formData.getAll('category_ids') as string[]
    const tagsString = formData.get('tags') as string
    const is_published = formData.get('is_published') === 'true'

    const { data: post, error: postError } = await supabase.from('posts').insert({
        title,
        slug,
        content,
        excerpt,
        cover_image,
        is_published,
        published_at: is_published ? new Date().toISOString() : null,
        author_id: user.id
    }).select().single()

    if (postError) {
        console.error(postError)
        return { error: postError.message }
    }

    // Handle Categories
    if (category_ids.length > 0) {
        const postCategories = category_ids.map(catId => ({
            post_id: post.id,
            category_id: catId
        }))
        const { error: catError } = await supabase.from('post_categories').insert(postCategories)
        if (catError) console.error(catError)
    }

    // Handle Tags
    if (tagsString) {
        const tags = tagsString
            .split(',')
            .map(tag => tag.trim())
            .filter(tag => tag.length > 0)

        for (const tagName of tags) {
            const tagSlug = tagName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

            // Upsert tag
            const { data: tag, error: tagError } = await supabase
                .from('tags')
                .upsert({ name: tagName, slug: tagSlug }, { onConflict: 'name' })
                .select()
                .single()

            if (tagError) {
                console.error('Error upserting tag:', tagError)
                continue
            }

            // Associate tag with post
            await supabase.from('post_tags').insert({
                post_id: post.id,
                tag_id: tag.id
            })
        }
    }

    if (is_published) {
        await broadcastNewPost(title, slug, excerpt)
    }

    revalidatePath('/')
    revalidatePath('/admin/dashboard')
    redirect('/admin/dashboard')
}

export async function updatePost(id: string, formData: FormData) {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) throw new Error('Not authenticated')

    const title = formData.get('title') as string
    const slug = formData.get('slug') as string
    const content = formData.get('content') as string
    const excerpt = formData.get('excerpt') as string
    const cover_image = formData.get('cover_image') as string
    const category_ids = formData.getAll('category_ids') as string[]
    const tagsString = formData.get('tags') as string
    const is_published = formData.get('is_published') === 'true'

    const updateData: any = {
        title,
        slug,
        content,
        excerpt,
        cover_image,
        is_published,
        updated_at: new Date().toISOString(),
    }

    if (is_published) {
        const { data: existing } = await supabase.from('posts').select('published_at').eq('id', id).single()
        if (!existing?.published_at) {
            updateData.published_at = new Date().toISOString()
        }
    }

    const { error: postError } = await supabase
        .from('posts')
        .update(updateData)
        .eq('id', id)

    if (postError) {
        console.error(postError)
        return { error: postError.message }
    }

    // Update categories (delete then re-insert)
    await supabase.from('post_categories').delete().eq('post_id', id)
    if (category_ids.length > 0) {
        const postCategories = category_ids.map(catId => ({
            post_id: id,
            category_id: catId
        }))
        const { error: catError } = await supabase.from('post_categories').insert(postCategories)
        if (catError) console.error(catError)
    }

    // Update Tags (delete old then re-insert/upsert)
    await supabase.from('post_tags').delete().eq('post_id', id)
    if (tagsString) {
        const tags = tagsString
            .split(',')
            .map(tag => tag.trim())
            .filter(tag => tag.length > 0)

        for (const tagName of tags) {
            const tagSlug = tagName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

            // Upsert tag
            const { data: tag, error: tagError } = await supabase
                .from('tags')
                .upsert({ name: tagName, slug: tagSlug }, { onConflict: 'name' })
                .select()
                .single()

            if (tagError) {
                console.error('Error upserting tag:', tagError)
                continue
            }

            // Associate tag with post
            await supabase.from('post_tags').insert({
                post_id: id,
                tag_id: tag.id
            })
        }
    }

    if (is_published && updateData.published_at) {
        await broadcastNewPost(title, slug, excerpt)
    }

    revalidatePath('/')
    revalidatePath(`/blog/${slug}`)
    revalidatePath('/admin/dashboard')
    redirect('/admin/dashboard')
}

export async function deletePost(id: string) {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) throw new Error('Not authenticated')

    const { error } = await supabase.from('posts').delete().eq('id', id)

    if (error) {
        console.error(error)
        return { error: error.message }
    }

    revalidatePath('/')
    revalidatePath('/admin/dashboard')
}
