import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Footer from "@/components/layout/Footer"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "ReviewPilot - Never Miss a Review Again",
  description: "AI writes the perfect response in 1 click. Monitor all your reviews, get instant alerts, and maintain your reputation effortlessly.",
  keywords: ["review management", "reputation management", "AI responses", "business reviews", "local business"],
  authors: [{ name: "ReviewPilot Team" }],
  openGraph: {
    title: "ReviewPilot - Never Miss a Review Again",
    description: "AI writes the perfect response in 1 click. Monitor all your reviews, get instant alerts, and maintain your reputation effortlessly.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "ReviewPilot - Never Miss a Review Again",
    description: "AI writes the perfect response in 1 click. Monitor all your reviews, get instant alerts, and maintain your reputation effortlessly.",
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        <div className="min-h-screen flex flex-col">
          <main className="flex-1">
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  )
}