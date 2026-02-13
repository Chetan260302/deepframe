import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { Mail, Calendar, User } from 'lucide-react'

export default async function MessagesPage() {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/admin/login')
    }

    const { data: messages } = await supabase
        .from('contact_messages')
        .select('*')
        .order('created_at', { ascending: false })

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100 mb-8">Contact Messages</h1>

            <div className="grid gap-6">
                {messages?.map((msg) => (
                    <div key={msg.id} className="p-8 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm group hover:border-blue-500/50 transition-all">
                        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600">
                                    <User size={24} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-zinc-900 dark:text-zinc-100 text-lg">{msg.name}</h3>
                                    <p className="text-sm text-zinc-500 flex items-center gap-1">
                                        <Mail size={14} />
                                        {msg.email}
                                    </p>
                                </div>
                            </div>
                            <div className="text-sm text-zinc-400 flex items-center gap-1">
                                <Calendar size={14} />
                                {new Date(msg.created_at).toLocaleString()}
                            </div>
                        </div>
                        <div className="p-6 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 text-zinc-700 dark:text-zinc-300 leading-relaxed italic">
                            "{msg.message}"
                        </div>
                    </div>
                ))}

                {(!messages || messages.length === 0) && (
                    <div className="text-center py-20 border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-[2rem]">
                        <p className="text-zinc-500 font-medium text-lg">No messages yet.</p>
                    </div>
                )}
            </div>
        </div>
    )
}
