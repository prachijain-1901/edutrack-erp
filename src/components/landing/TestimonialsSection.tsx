"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Priya Sharma",
    role: "Founder, Vidya Classes",
    location: "Jaipur",
    avatar: "PS",
    color: "bg-rose-100 text-rose-700",
    quote: "We used to spend 3 hours a day on attendance and fees alone. With EduTrack, it takes 20 minutes. The parent satisfaction has been incredible.",
  },
  {
    name: "Rajesh Patel",
    role: "Director, Patel Coaching Hub",
    location: "Ahmedabad",
    avatar: "RP",
    color: "bg-blue-100 text-blue-700",
    quote: "The analytics dashboard is a game-changer. I can now see exactly which batches are profitable and which students are at risk of dropping out.",
  },
  {
    name: "Dr. Meena Iyer",
    role: "Principal, Apex IIT Academy",
    location: "Pune",
    avatar: "MI",
    color: "bg-emerald-100 text-emerald-700",
    quote: "We migrated 400+ students from spreadsheets to EduTrack in a single weekend. The fee collection rate improved by 35% in the very first month.",
  },
];

export function TestimonialsSection() {
  return (
    <section className="py-20 md:py-32 relative overflow-hidden">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <span className="inline-block text-sm font-semibold text-primary tracking-wider uppercase mb-3">Testimonials</span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight">
            Loved by 500+ coaching institutes.
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: i * 0.12 }}
              className="bg-card border border-border rounded-2xl p-6 shadow-sm hover:shadow-lg transition-shadow flex flex-col"
            >
              {/* Stars */}
              <div className="flex items-center gap-0.5 mb-4">
                {[1,2,3,4,5].map(s => <Star key={s} className="w-4 h-4 text-amber-400 fill-amber-400" />)}
              </div>
              <p className="text-sm text-foreground leading-relaxed flex-1">&ldquo;{t.quote}&rdquo;</p>
              <div className="flex items-center gap-3 mt-6 pt-4 border-t border-border">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${t.color}`}>
                  {t.avatar}
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.role}, {t.location}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
