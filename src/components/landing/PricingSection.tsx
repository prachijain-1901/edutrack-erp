"use client";

import { motion } from "framer-motion";
import { Check, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";

const plans = [
  {
    name: "Starter",
    price: "₹999",
    period: "/month",
    description: "Perfect for small tuition centers with up to 100 students.",
    features: [
      "Up to 100 students",
      "3 batches",
      "Attendance tracking",
      "Basic fee management",
      "Email support",
    ],
    cta: "Start Free Trial",
    featured: false,
  },
  {
    name: "Professional",
    price: "₹2,499",
    period: "/month",
    description: "For growing institutes that need the full operational toolkit.",
    features: [
      "Up to 500 students",
      "Unlimited batches",
      "Advanced analytics dashboard",
      "Document uploads",
      "Communication center",
      "SMS & WhatsApp alerts",
      "Priority support",
    ],
    cta: "Start Free Trial",
    featured: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    description: "Multi-branch institutes and coaching chains. Fully customized.",
    features: [
      "Unlimited students",
      "Multi-branch management",
      "Custom integrations",
      "Dedicated account manager",
      "Custom reports",
      "On-premise option",
      "SLA guarantee",
    ],
    cta: "Contact Sales",
    featured: false,
  },
];

export function PricingSection() {
  return (
    <section id="pricing" className="py-20 md:py-32 bg-muted/30 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -z-10 w-[800px] h-[400px] bg-primary/5 rounded-full blur-[120px]"></div>

      <div className="container mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <span className="inline-block text-sm font-semibold text-primary tracking-wider uppercase mb-3">Pricing</span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight">
            Simple, transparent pricing.
          </h2>
          <p className="text-muted-foreground mt-4 text-lg leading-relaxed">
            Start free. Upgrade when you&apos;re ready. No hidden charges, no lock-in contracts.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto items-stretch">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: i * 0.12 }}
              className={cn(
                "relative flex flex-col rounded-2xl p-6 shadow-sm transition-shadow hover:shadow-xl",
                plan.featured
                  ? "bg-card border-2 border-primary shadow-lg ring-1 ring-primary/10 scale-[1.03]"
                  : "bg-card border border-border"
              )}
            >
              {plan.featured && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <span className="bg-primary text-primary-foreground text-xs font-bold px-4 py-1 rounded-full shadow-md">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-lg font-semibold text-foreground">{plan.name}</h3>
                <p className="text-sm text-muted-foreground mt-1">{plan.description}</p>
              </div>

              <div className="mb-6">
                <span className="text-4xl font-extrabold text-foreground">{plan.price}</span>
                <span className="text-muted-foreground text-sm">{plan.period}</span>
              </div>

              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-foreground">
                    <Check className="w-4 h-4 mt-0.5 shrink-0 text-primary" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>

              <Button
                variant={plan.featured ? "default" : "outline"}
                className={cn(
                  "w-full justify-center rounded-full h-11 gap-2",
                  plan.featured && "shadow-lg shadow-primary/20"
                )}
                asChild
              >
                <Link href="/dashboard">
                  {plan.cta} <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
