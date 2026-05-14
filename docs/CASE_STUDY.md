# Case Study: EduTrack ERP

**Building a Scalable SaaS for Coaching Institutes**

## 🔴 The Problem
Coaching institutes in India often operate in "chaos mode"—using fragmented tools like WhatsApp groups for attendance, physical registers for fees, and manual phone calls for reminders. This leads to:
- **Revenue Leakage**: Forgotten fee follow-ups.
- **Communication Gaps**: Parents unaware of student absences.
- **Data Silos**: No centralized view of institute performance.

## 🟢 The Solution
EduTrack ERP was built to provide a unified, real-time command center for coaching institute owners. It automates the "busy work" so educators can focus on teaching.

## 🛠️ Key Technical Challenges

### 1. The "Single Source of Truth" Problem
**Challenge**: How to ensure that when a payment is recorded, the dashboard stats, the student's fee status, and the parent's WhatsApp notification are all synchronized instantly.
**Solution**: Implemented an **Event-Driven Architecture** using NestJS `EventEmitter2`. Services emit domain events, and dedicated listeners handle side effects (Notifications, WhatsApp, Real-time updates) asynchronously.

### 2. Live Interactivity
**Challenge**: Users shouldn't have to refresh to see if a payment was received.
**Solution**: Developed a **Real-time Infrastructure Layer** with Socket.IO. We implemented room-based targeting (e.g., `admins` room) to broadcast critical business updates only to authorized staff.

### 3. User Experience for Non-Techies
**Challenge**: Software for educators must be simple yet powerful.
**Solution**: Built a **Premium UI/UX** using Tailwind CSS v4 and shadcn/ui, following "Dashboard-first" principles with animated counters, clear typography, and a mobile-first responsive layout.

## 📈 Scalability Decisions
- **Prisma ORM**: Used for type-safe database access and efficient connection pooling.
- **Modular NestJS**: Ensures that new features (like Online Exams or LMS) can be added without bloating the core codebase.
- **JWT Authentication**: Enables stateless scaling across multiple server instances.

## ✨ Final Outcome
EduTrack ERP is a production-ready SaaS capable of managing thousands of students across multiple batches with automated parent-teacher communication, providing institute owners with the professional tools needed to scale their business.
