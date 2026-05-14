# 🎓 EduTrack ERP — The Smart Coaching Command Center

[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![NestJS](https://img.shields.io/badge/NestJS-11-E0234E?style=for-the-badge&logo=nestjs)](https://nestjs.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?style=for-the-badge&logo=prisma)](https://www.prisma.io/)
[![Socket.io](https://img.shields.io/badge/Socket.io-Realtime-010101?style=for-the-badge&logo=socket.io)](https://socket.io/)

EduTrack ERP is a high-performance, production-ready SaaS platform designed specifically for offline coaching institutes. It automates student management, attendance tracking, fee collections, and parent communication through a modern, real-time interface.

---

## ✨ Key Features

- **🚀 Real-time Dashboard**: Live business KPIs with animated counters and interactive analytics charts.
- **📱 WhatsApp Automation**: Automated parent alerts for absences, receipts, and admissions via Meta's WhatsApp Business API.
- **📅 Smart Attendance**: One-click attendance marking with instant synchronization across the platform.
- **💳 Fee Management**: Complete payment tracking with digital receipts, pending due alerts, and revenue trend analysis.
- **🔔 Real-time Notifications**: Instant socket-based alerts for critical business events.
- **📁 Document Management**: Secure student document storage integrated with Cloudinary.
- **🔒 Secure Architecture**: RBAC (Role-Based Access Control), JWT authentication, and rate limiting.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 16 (App Router)
- **State Management**: Zustand
- **Styling**: Tailwind CSS v4 + shadcn/ui
- **Real-time**: Socket.IO Client
- **Charts**: Recharts
- **Animations**: Framer Motion

### Backend
- **Framework**: NestJS
- **ORM**: Prisma
- **Database**: PostgreSQL
- **Real-time**: Socket.IO Gateway
- **Event Bus**: EventEmitter2
- **Storage**: Cloudinary

---

## 🏗️ Architecture
EduTrack follows an **Event-Driven Modular Monolith** architecture. Core services emit domain events that trigger secondary workflows like WhatsApp messaging and WebSocket broadcasts.

> [!NOTE]
> Check out the [Architecture Documentation](docs/ARCHITECTURE.md) for a deep dive into the system design.

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js (v18+)
- PostgreSQL Database
- Cloudinary Account (for uploads)

### 2. Environment Setup

**Backend (.env)**
```env
DATABASE_URL="postgresql://..."
JWT_SECRET="your_secret_here"
CLOUDINARY_URL="cloudinary://..."
NEXT_PUBLIC_API_URL="http://localhost:3001/api/v1"
```

**Frontend (.env.local)**
```env
NEXT_PUBLIC_API_URL="http://localhost:3001/api/v1"
```

### 3. Installation

```bash
# Install root dependencies
npm install

# Setup Backend
cd backend
npm install
npx prisma generate
npm run db:seed  # Initialize demo data

# Setup Frontend
cd ..
npm install
```

### 4. Running Locally

```bash
# Run Backend (from /backend)
npm run start:dev

# Run Frontend (from root)
npm run dev
```

---

## 📄 Documentation
- [Architecture Overview](docs/ARCHITECTURE.md)
- [API Reference](docs/API_REFERENCE.md)
- [Deployment Guide](docs/DEPLOYMENT.md)
- [Case Study & Technical Decisions](docs/CASE_STUDY.md)
- [Screenshot & Demo Guide](docs/DEMO_GUIDE.md)

---

## 🤝 Contributing
Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📜 License
Distributed under the MIT License. See `LICENSE` for more information.

---

Built with ❤️ for Educators.
