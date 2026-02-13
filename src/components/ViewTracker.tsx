'use client'

import { useEffect, useRef } from 'react'
import { trackPostView } from '@/app/actions/analytics'

export default function ViewTracker({ postId }: { postId: string }) {
    const trackedRef = useRef(false)

    useEffect(() => {
        if (!trackedRef.current) {
            trackPostView(postId)
            trackedRef.current = true
        }
    }, [postId])

    return null
}
