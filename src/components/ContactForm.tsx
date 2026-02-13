'use client'

import { useState } from 'react'
import { sendContactMessage } from '@/app/actions/contact'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, CheckCircle2, AlertCircle } from 'lucide-react'

export default function ContactForm() {
    const [status, setStatus] = useState<{ type: 'success' | 'error' | null; message: string }>({ type: null, message: '' })
    const [isPending, setIsPending] = useState(false)

    async function handleSubmit(formData: FormData) {
        setIsPending(true)
        setStatus({ type: null, message: '' })

        const result = await sendContactMessage(formData)

        if (result.error) {
            setStatus({ type: 'error', message: result.error })
        } else if (result.success) {
            setStatus({ type: 'success', message: result.success })
            // Reset form
            const form = document.querySelector('form') as HTMLFormElement
            form?.reset()
        }
        setIsPending(false)
    }

    return (
        <form action={handleSubmit} className="space-y-6">
            <AnimatePresence mode="wait">
                {status.type && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className={`p-4 rounded-2xl flex items-center gap-3 ${status.type === 'success' ? 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400' : 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400'}`}
                    >
                        {status.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
                        <p className="text-sm font-medium">{status.message}</p>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="space-y-2">
                <label className="text-sm font-bold ml-1">Name</label>
                <input
                    name="name"
                    required
                    type="text"
                    className="w-full p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    placeholder="Your Name"
                />
            </div>
            <div className="space-y-2">
                <label className="text-sm font-bold ml-1">Email</label>
                <input
                    name="email"
                    required
                    type="email"
                    className="w-full p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    placeholder="your@email.com"
                />
            </div>
            <div className="space-y-2">
                <label className="text-sm font-bold ml-1">Message</label>
                <textarea
                    name="message"
                    required
                    rows={4}
                    className="w-full p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none"
                    placeholder="How can we help?"
                ></textarea>
            </div>
            <button
                type="submit"
                disabled={isPending}
                className="w-full py-4 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 shadow-lg shadow-blue-500/20 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-70 disabled:hover:scale-100"
            >
                {isPending ? 'Sending...' : (
                    <>
                        <Send size={18} />
                        Send Message
                    </>
                )}
            </button>
        </form>
    )
}
