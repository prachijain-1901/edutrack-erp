"use client";

import { motion } from "framer-motion";
import {
  Users, CalendarCheck, CreditCard, BarChart3, Bell, FileUp,
} from "lucide-react";

const features = [
  {
    icon: Users,
    title: "Student Management",
    description: "Complete profiles with parent details, batch assignments, fee history, and document uploads — all in one place.",
    color: "from-blue-500 to-cyan-400",
  },
  {
    icon: CalendarCheck,
    title: "Smart Attendance",
    description: "Mark attendance in seconds with batch-wise tracking, late marking, and automatic parent notifications.",
    color: "from-emerald-500 to-teal-400",
  },
  {
    icon: CreditCard,
    title: "Fee Collection & Tracking",
    description: "Generate invoices, accept partial payments, track overdue fees, and auto-send reminders. Never chase a payment again.",
    color: "from-violet-500 to-purple-400",
  },
  {
    icon: BarChart3,
    title: "Owner Analytics Dashboard",
    description: "Revenue trends, attendance percentages, admission metrics, and operational alerts — live and beautifully visualized.",
    color: "from-orange-500 to-amber-400",
  },
  {
    icon: Bell,
    title: "Communication Center",
    description: "Send targeted announcements to students, parents, or specific batches. Emergency broadcasts with one click.",
    color: "from-rose-500 to-pink-400",
  },
  {
    icon: FileUp,
    title: "Document Vault",
    description: "Upload and organize student documents securely in the cloud. Aadhaar, marksheets, receipts — all searchable and safe.",
    color: "from-sky-500 to-indigo-400",
  },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export function FeaturesSection() {
  return (
    <section id="features" className="py-20 md:py-32 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px]"></div>

      <div className="container mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <span className="inline-block text-sm font-semibold text-primary tracking-wider uppercase mb-3">Features</span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight">
            Everything your institute needs. Nothing it doesn&apos;t.
          </h2>
          <p className="text-muted-foreground mt-4 text-lg leading-relaxed">
            Built by educators, for educators. Every feature solves a real operational problem coaching centers face daily.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {features.map((f) => (
            <motion.div
              key={f.title}
              variants={itemVariants}
              className="group relative bg-card border border-border rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden"
            >
              {/* Gradient hover glow */}
              <div className={`absolute inset-0 bg-gradient-to-br ${f.color} opacity-0 group-hover:opacity-[0.04] transition-opacity duration-500 rounded-2xl`}></div>
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${f.color} flex items-center justify-center mb-5 shadow-lg`}>
                <f.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-foreground mb-2 text-lg">{f.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{f.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
