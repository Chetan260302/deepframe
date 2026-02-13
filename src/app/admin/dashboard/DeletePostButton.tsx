'use client'

import { Trash2 } from 'lucide-react'
import { deletePost } from '../posts/actions'
import { useState } from 'react'

export default function DeletePostButton({ id }: { id: string }) {
    const [isDeleting, setIsDeleting] = useState(false)

    async function handleDelete() {
        if (confirm('Are you sure you want to delete this post?')) {
            setIsDeleting(true)
            await deletePost(id)
            setIsDeleting(false)
        }
    }

    return (
        <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="text-red-600 hover:text-red-900 disabled:opacity-50"
        >
            <Trash2 size={18} />
        </button>
    )
}
