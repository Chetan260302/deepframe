'use client'

import { useState } from 'react'
import { createPost, updatePost } from './actions'

interface PostFormProps {
    initialData?: any
    categories: any[]
}

export default function PostForm({ initialData, categories }: PostFormProps) {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isPublished, setIsPublished] = useState(initialData?.is_published || false)
    const [selectedCategories, setSelectedCategories] = useState<string[]>(
        initialData?.post_categories?.map((pc: any) => pc.category_id) || []
    )

    async function handleSubmit(formData: FormData) {
        setIsSubmitting(true)
        formData.append('is_published', String(isPublished))
        selectedCategories.forEach(id => formData.append('category_ids', id))

        if (initialData) {
            await updatePost(initialData.id, formData)
        } else {
            await createPost(formData)
        }
        setIsSubmitting(false)
    }

    const toggleCategory = (id: string) => {
        setSelectedCategories(prev =>
            prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
        )
    }

    return (
        <form action={handleSubmit} className="space-y-8 max-w-4xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-sm font-medium">Title</label>
                    <input
                        name="title"
                        defaultValue={initialData?.title}
                        required
                        className="w-full p-2 border rounded dark:bg-zinc-800 dark:border-zinc-700"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium">Slug</label>
                    <input
                        name="slug"
                        defaultValue={initialData?.slug}
                        required
                        className="w-full p-2 border rounded dark:bg-zinc-800 dark:border-zinc-700"
                    />
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium">Excerpt</label>
                <textarea
                    name="excerpt"
                    defaultValue={initialData?.excerpt}
                    rows={2}
                    className="w-full p-2 border rounded dark:bg-zinc-800 dark:border-zinc-700"
                />
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium">Content (Markdown)</label>
                <textarea
                    name="content"
                    defaultValue={initialData?.content}
                    required
                    rows={12}
                    className="w-full p-2 border rounded font-mono dark:bg-zinc-800 dark:border-zinc-700"
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                    <label className="text-sm font-medium">Categories (Select Multiple)</label>
                    <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto p-4 border rounded dark:bg-zinc-800 dark:border-zinc-700">
                        {categories.map((cat) => (
                            <div key={cat.id} className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id={cat.id}
                                    checked={selectedCategories.includes(cat.id)}
                                    onChange={() => toggleCategory(cat.id)}
                                    className="rounded border-zinc-300 dark:border-zinc-700 text-blue-600 focus:ring-blue-500"
                                />
                                <label htmlFor={cat.id} className="text-sm cursor-pointer select-none dark:text-zinc-300">
                                    {cat.name}
                                </label>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium">Cover Image URL</label>
                    <input
                        name="cover_image"
                        defaultValue={initialData?.cover_image}
                        className="w-full p-2 border rounded dark:bg-zinc-800 dark:border-zinc-700"
                    />
                </div>
            </div>

            <div className="flex items-center gap-2">
                <input
                    type="checkbox"
                    id="is_published"
                    checked={isPublished}
                    onChange={(e) => setIsPublished(e.target.checked)}
                    className="h-4 w-4 rounded border-zinc-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="is_published" className="text-sm font-medium dark:text-zinc-300">
                    Publish Post
                </label>
            </div>

            <div className="flex justify-end gap-4">
                <button
                    type="button"
                    onClick={() => window.history.back()}
                    className="px-6 py-2 border rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors dark:border-zinc-700 dark:text-zinc-300"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                    {isSubmitting ? 'Saving...' : initialData ? 'Update Post' : 'Create Post'}
                </button>
            </div>
        </form>
    )
}
