import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster as SonnerToaster } from "sonner";
import { SocketProvider } from "@/components/providers/socket-provider";
import { APP_NAME } from "@/lib/constants";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: APP_NAME,
    template: `%s | ${APP_NAME}`,
  },
  description:
    "Smart ERP platform for offline coaching institutes — manage students, attendance, fees, batches, and more.",
  keywords: [
    "coaching institute management",
    "ERP",
    "student management",
    "attendance",
    "fee management",
    "tuition center software",
  ],
  authors: [{ name: "EduTrack" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} antialiased`}>
        <SocketProvider>
          <TooltipProvider>{children}</TooltipProvider>
        </SocketProvider>
        <SonnerToaster position="top-right" richColors />
      </body>
    </html>
  );
}
