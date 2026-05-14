"use client";

import { motion, useMotionValue, useTransform, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { Clock, TrendingDown, MessageCircle } from "lucide-react";

function AnimatedCounter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const duration = 1500;
    const increment = target / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [isInView, target]);

  return <span ref={ref}>{count}{suffix}</span>;
}

const benefits = [
  {
    icon: Clock,
    metric: 10,
    suffix: "+",
    unit: "hours / week",
    title: "Save Administrative Time",
    description: "Automated attendance, instant fee tracking, and one-click communications eliminate repetitive manual work.",
    color: "text-emerald-500 bg-emerald-100",
  },
  {
    icon: TrendingDown,
    metric: 40,
    suffix: "%",
    unit: "less fee leakage",
    title: "Reduce Revenue Loss",
    description: "Real-time overdue alerts and automated reminders mean you stop losing money to forgotten or delayed payments.",
    color: "text-blue-500 bg-blue-100",
  },
  {
    icon: MessageCircle,
    metric: 3,
    suffix: "x",
    unit: "better engagement",
    title: "Improve Parent Communication",
    description: "Replace chaotic WhatsApp groups with professional, targeted announcements that parents actually read.",
    color: "text-violet-500 bg-violet-100",
  },
];

export function BenefitsSection() {
  return (
    <section id="benefits" className="py-20 md:py-32 bg-muted/30 relative overflow-hidden">
      <div className="absolute bottom-0 right-0 -z-10 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px]"></div>

      <div className="container mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <span className="inline-block text-sm font-semibold text-primary tracking-wider uppercase mb-3">Why EduTrack</span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight">
            Real impact. Measurable results.
          </h2>
          <p className="text-muted-foreground mt-4 text-lg leading-relaxed">
            Coaching institutes using EduTrack see immediate improvements across operations, revenue, and parent satisfaction.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {benefits.map((b, i) => (
            <motion.div
              key={b.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              className="bg-card border border-border rounded-2xl p-8 shadow-sm text-center hover:shadow-lg transition-shadow"
            >
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-6 ${b.color}`}>
                <b.icon className="w-7 h-7" />
              </div>
              <p className="text-5xl font-extrabold text-foreground tracking-tight mb-1">
                <AnimatedCounter target={b.metric} suffix={b.suffix} />
              </p>
              <p className="text-sm font-medium text-muted-foreground mb-4">{b.unit}</p>
              <h3 className="font-semibold text-foreground mb-2 text-lg">{b.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{b.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
