export default function AboutPage() {
    return (
        <div className="max-w-4xl mx-auto px-4 py-20 sm:px-6 lg:px-8">
            <h1 className="text-4xl sm:text-6xl font-extrabold text-zinc-900 dark:text-zinc-100 mb-12 tracking-tight">
                About <span className="text-blue-600">DeepFrame</span>
            </h1>
            <div className="prose prose-lg dark:prose-invert max-w-none">
                <p className="text-xl text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    Welcome to DeepFrame, a platform dedicated to sharing thoughts, tutorials, and insights on modern web development, design, and technology.
                </p>
                <div className="my-16 grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="p-8 rounded-3xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
                        <h3 className="text-2xl font-bold mb-4">Our Mission</h3>
                        <p className="text-zinc-600 dark:text-zinc-400">
                            To provide high-quality, accessible content that helps developers grow their skills and stay updated with the latest trends.
                        </p>
                    </div>
                    <div className="p-8 rounded-3xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
                        <h3 className="text-2xl font-bold mb-4">The Author</h3>
                        <p className="text-zinc-600 dark:text-zinc-400">
                            Built with passion by a developer who loves building things that make an impact.
                        </p>
                    </div>
                </div>
                <p>
                    This blog is built using cutting-edge technologies like Next.js 14, Supabase, Tailwind CSS, and Framer Motion to provide a fast, secure, and delightful experience.
                </p>
            </div>
        </div>
    )
}
