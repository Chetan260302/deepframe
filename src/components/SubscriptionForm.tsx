"use client"

import { useState } from 'react'
import { subscribe } from '@/app/actions/subscriptions'
import { Send, Loader2 } from 'lucide-react'

export function SubscriptionForm() {
    const [pending, setPending] = useState(false)
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

    async function handleSubmit(formData: FormData) {
        setPending(true)
        setMessage(null)
        const result = await subscribe(formData)
        setPending(false)

        if (result.error) {
            setMessage({ type: 'error', text: result.error })
        } else if (result.success) {
            setMessage({ type: 'success', text: result.success })
            const form = document.getElementById('subscribe-form') as HTMLFormElement
            form?.reset()
        }
    }

    return (
        <div className="bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-8 max-w-2xl mx-auto my-12 shadow-sm">
            <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Join the Newsletter</h3>
                <p className="text-zinc-600 dark:text-zinc-400 mt-2">Get the latest blog posts delivered straight to your inbox.</p>
            </div>

            <form id="subscribe-form" action={handleSubmit} className="flex flex-col sm:flex-row gap-3">
                <input
                    type="email"
                    name="email"
                    placeholder="your@email.com"
                    required
                    className="flex-grow px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                />
                <button
                    type="submit"
                    disabled={pending}
                    className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-3 rounded-xl font-medium transition-colors flex items-center justify-center gap-2 whitespace-nowrap"
                >
                    {pending ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
                    <span>{pending ? 'Subscribing...' : 'Subscribe'}</span>
                </button>
            </form>

            {message && (
                <div className={`mt-4 text-center text-sm font-medium ${message.type === 'success' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                    {message.text}
                </div>
            )}

            <p className="text-xs text-zinc-500 dark:text-zinc-500 text-center mt-4">
                We respect your privacy. Unsubscribe at any time.
            </p>
        </div>
    )
}
