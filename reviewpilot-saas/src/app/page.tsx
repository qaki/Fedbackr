import { Hero } from "@/components/sections/hero"
import { Features } from "@/components/sections/features"
import { Pricing } from "@/components/sections/pricing"
import { FAQ } from "@/components/sections/faq"
import { Footer } from "@/components/sections/footer"

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-900">
      <Hero />
      <Features />
      <Pricing />
      <FAQ />
      <Footer />
    </main>
  )
}