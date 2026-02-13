import ContactForm from "@/components/ContactForm"

export default function ContactPage() {
    return (
        <div className="max-w-4xl mx-auto px-4 py-20 sm:px-6 lg:px-8">
            <h1 className="text-4xl sm:text-6xl font-extrabold text-zinc-900 dark:text-zinc-100 mb-12 tracking-tight">
                Get in <span className="text-blue-600">Touch</span>
            </h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                <div className="space-y-8">
                    <p className="text-lg text-zinc-600 dark:text-zinc-400">
                        Have a question, feedback, or a business inquiry? Feel free to reach out using the form or through our social channels.
                    </p>
                    <div className="space-y-4 font-medium">
                        <div className="flex items-center gap-4 text-zinc-600 dark:text-zinc-400">
                            {/* <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600">
                                📧
                            </div>
                            [EMAIL_ADDRESS] */}
                        </div>
                        <div className="flex items-center gap-4 text-zinc-600 dark:text-zinc-400">
                            <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600">
                                📍
                            </div>
                            Mumbai, India
                        </div>
                    </div>
                </div>

                <ContactForm />
            </div>
        </div>
    )
}
