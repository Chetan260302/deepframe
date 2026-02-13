import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/NavbarWrapper";
import { ThemeProvider } from "@/components/ThemeProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: {
        default: "DeepFrame | Insights & Stories",
        template: "%s | DeepFrame"
    },
    description: "Discover stories, tutorials, and insights on the latest in technology and web development.",
    keywords: ["blog", "technology", "programming", "web development", "nextjs", "supabase"],
    authors: [{ name: "Admin" }],
    creator: "Admin",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={inter.className}>
                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                    disableTransitionOnChange
                >
                    <Navbar />
                    <main className="min-h-screen">
                        {children}
                    </main>
                    <footer className="border-t py-8 text-center text-gray-500 text-sm">
                        © {new Date().getFullYear()} DeepFrame. All rights reserved.
                    </footer>
                </ThemeProvider>
            </body>
        </html>
    );
}
