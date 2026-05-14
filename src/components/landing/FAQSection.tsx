"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const faqs = [
  {
    q: "How long does it take to set up EduTrack?",
    a: "Most institutes are fully operational within 30 minutes. Create an account, add your batches and students, and you're ready to start tracking attendance and collecting fees.",
  },
  {
    q: "Can I migrate my existing student data?",
    a: "Yes. We support bulk CSV uploads for student data. If you need help migrating from spreadsheets, our support team will assist you at no extra cost.",
  },
  {
    q: "Is my data secure?",
    a: "Absolutely. EduTrack uses industry-standard encryption (AES-256), JWT authentication, and is hosted on enterprise-grade infrastructure. Your data is backed up daily.",
  },
  {
    q: "Do parents get access to the platform?",
    a: "Yes. Parents receive notifications about attendance, fee reminders, and announcements. A parent portal for self-service access is on our near-term roadmap.",
  },
  {
    q: "Can I use EduTrack for multiple branches?",
    a: "Our Enterprise plan supports multi-branch management with centralized reporting. Contact our sales team for a customized setup.",
  },
  {
    q: "What payment methods are supported for fee collection?",
    a: "We support cash, UPI, bank transfer, and online payment tracking. Direct payment gateway integration (Razorpay) is available on Professional and Enterprise plans.",
  },
];

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-20 md:py-32 relative">
      <div className="container mx-auto px-4 md:px-6 max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="inline-block text-sm font-semibold text-primary tracking-wider uppercase mb-3">FAQ</span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight">
            Frequently asked questions.
          </h2>
        </motion.div>

        <div className="space-y-3">
          {faqs.map((faq, i) => {
            const isOpen = openIndex === i;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  className={cn(
                    "w-full flex items-center justify-between p-5 text-left rounded-xl border transition-all",
                    isOpen
                      ? "bg-card border-primary/20 shadow-sm"
                      : "bg-card border-border hover:border-primary/20 hover:shadow-sm"
                  )}
                >
                  <span className="font-medium text-foreground pr-4">{faq.q}</span>
                  <ChevronDown
                    className={cn(
                      "w-5 h-5 shrink-0 text-muted-foreground transition-transform duration-200",
                      isOpen && "rotate-180 text-primary"
                    )}
                  />
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <p className="text-sm text-muted-foreground leading-relaxed px-5 pt-2 pb-4">
                        {faq.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
