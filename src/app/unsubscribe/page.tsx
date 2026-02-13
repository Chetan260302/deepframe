"use client"

import { useSearchParams } from 'next/navigation'
import { useState, useEffect, Suspense } from 'react'
import { unsubscribe } from '@/app/actions/subscriptions'
import Link from 'next/link'
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react'

function UnsubscribeContent() {
    const searchParams = useSearchParams()
    const email = searchParams.get('email')
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
    const [message, setMessage] = useState('')

    useEffect(() => {
        if (!email) {
            setStatus('error')
            setMessage('No email provided.')
            return
        }

        const performUnsubscribe = async () => {
            const result = await unsubscribe(email)
            if (result.success) {
                setStatus('success')
                setMessage(result.success)
            } else {
                setStatus('error')
                setMessage(result.error || 'Something went wrong.')
            }
        }

        performUnsubscribe()
    }, [email])

    return (
        <div className="max-w-md mx-auto mt-20 p-8 text-center bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
            {status === 'loading' && (
                <div className="flex flex-col items-center">
                    <Loader2 className="h-12 w-12 text-blue-600 animate-spin mb-4" />
                    <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Unsubscribing...</h1>
                    <p className="text-zinc-600 dark:text-zinc-400 mt-2">Please wait while we process your request.</p>
                </div>
            )}

            {status === 'success' && (
                <div className="flex flex-col items-center">
                    <CheckCircle2 className="h-12 w-12 text-green-600 mb-4" />
                    <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Unsubscribed</h1>
                    <p className="text-zinc-600 dark:text-zinc-400 mt-2">{message}</p>
                    <Link href="/" className="mt-6 text-blue-600 hover:underline font-medium">
                        Back to Home
                    </Link>
                </div>
            )}

            {status === 'error' && (
                <div className="flex flex-col items-center">
                    <XCircle className="h-12 w-12 text-red-600 mb-4" />
                    <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Error</h1>
                    <p className="text-zinc-600 dark:text-zinc-400 mt-2">{message}</p>
                    <Link href="/" className="mt-6 text-blue-600 hover:underline font-medium">
                        Back to Home
                    </Link>
                </div>
            )}
        </div>
    )
}

export default function UnsubscribePage() {
    return (
        <Suspense fallback={
            <div className="flex justify-center mt-20">
                <Loader2 className="h-12 w-12 text-blue-600 animate-spin" />
            </div>
        }>
            <UnsubscribeContent />
        </Suspense>
    )
}
