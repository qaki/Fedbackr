"use client"

import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { useState } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"

const faqs = [
  {
    question: "How does the free trial work?",
    answer: "Start with a 7-day free trial with full access to all Pro features. No credit card required. We'll send you a reminder 24 hours before your trial ends, and you can cancel anytime without any charges."
  },
  {
    question: "What platforms do you support?",
    answer: "We support Google My Business, Yelp, Facebook, and TripAdvisor. We're constantly adding new platforms based on user feedback and demand."
  },
  {
    question: "How accurate are the AI responses?",
    answer: "Our AI is trained on thousands of successful review responses and can generate contextually appropriate replies. You can always edit or customize the responses before posting."
  },
  {
    question: "Can I manage multiple business locations?",
    answer: "Yes! The Pro plan includes support for up to 3 locations. For more locations, contact us about our enterprise plans."
  },
  {
    question: "How quickly do I get notified of new reviews?",
    answer: "You'll receive instant notifications via email, SMS, or WhatsApp as soon as a new review is posted on any of your connected platforms."
  },
  {
    question: "Is my data secure?",
    answer: "Absolutely. We use enterprise-grade security with end-to-end encryption, SOC 2 compliance, and regular security audits. Your data is never shared with third parties."
  },
  {
    question: "Can I export my review data?",
    answer: "Yes, you can export all your review data, responses, and analytics in CSV format for your records or further analysis."
  },
  {
    question: "What if I need help getting started?",
    answer: "We provide priority support for all Pro users, including setup assistance, best practices guidance, and dedicated account management for enterprise customers."
  }
]

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section className="py-24 bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <Badge variant="outline" className="mb-4">
            FAQ
          </Badge>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
            Frequently asked{" "}
            <span className="bg-gradient-to-r from-cyan-400 to-green-400 bg-clip-text text-transparent">
              questions
            </span>
          </h2>
          <p className="text-xl text-gray-300">
            Everything you need to know about ReviewPilot
          </p>
        </motion.div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="border border-gray-800 rounded-xl bg-gray-800/50 backdrop-blur-sm overflow-hidden"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-6 py-6 text-left flex items-center justify-between hover:bg-gray-700/50 transition-colors"
              >
                <h3 className="text-lg font-semibold text-white pr-4">
                  {faq.question}
                </h3>
                {openIndex === index ? (
                  <ChevronUp className="h-5 w-5 text-cyan-400 flex-shrink-0" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-gray-400 flex-shrink-0" />
                )}
              </button>
              
              <motion.div
                initial={false}
                animate={{
                  height: openIndex === index ? "auto" : 0,
                  opacity: openIndex === index ? 1 : 0
                }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                <div className="px-6 pb-6">
                  <p className="text-gray-300 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
