"use client";

import { motion } from "framer-motion";
import { AlertTriangle, MessageSquare, Calculator, ClipboardList } from "lucide-react";

const problems = [
  {
    icon: ClipboardList,
    title: "Manual Attendance Registers",
    description: "Paper registers get lost, take forever to compile, and parents never know if their child attended class.",
    color: "text-rose-500 bg-rose-100",
  },
  {
    icon: Calculator,
    title: "Fee Tracking in Spreadsheets",
    description: "Excel sheets break, data gets lost, and chasing unpaid fees wastes hours every week.",
    color: "text-amber-500 bg-amber-100",
  },
  {
    icon: MessageSquare,
    title: "WhatsApp Group Chaos",
    description: "Important announcements drown in memes and good-morning messages. No one reads them.",
    color: "text-blue-500 bg-blue-100",
  },
  {
    icon: AlertTriangle,
    title: "Zero Business Visibility",
    description: "No idea how much revenue you're collecting, which batches are full, or which students are at risk.",
    color: "text-purple-500 bg-purple-100",
  },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export function ProblemSection() {
  return (
    <section className="py-20 md:py-32 bg-muted/30 relative overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-destructive/5 via-transparent to-transparent"></div>

      <div className="container mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <span className="inline-block text-sm font-semibold text-destructive/80 tracking-wider uppercase mb-3">The Problem</span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight">
            Running a coaching center shouldn&apos;t feel like firefighting.
          </h2>
          <p className="text-muted-foreground mt-4 text-lg leading-relaxed">
            Most institutes still rely on notebooks, spreadsheets, and WhatsApp groups. This leads to lost data, missed payments, and frustrated parents.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {problems.map((p) => (
            <motion.div
              key={p.title}
              variants={itemVariants}
              className="bg-card border border-border rounded-2xl p-6 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-5 ${p.color}`}>
                <p.icon className="w-6 h-6" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">{p.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{p.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
