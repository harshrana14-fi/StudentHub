import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Zap, FileText, BookOpen, CheckCircle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'StudHub - Your Complete College Companion',
  description: 'AI-powered tools designed to simplify your academic journey. From lab records to exam prep, we have everything you need to excel in college.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-screen bg-[#f0f0f0] flex flex-col">
        {/* Marquee Banner */}
        <div className="bg-black text-white py-1 overflow-hidden border-b-2 border-black">
          <div className="animate-[marquee_20s_linear_infinite] whitespace-nowrap text-xs">
            <span className="mx-3"><Zap className="inline w-3 h-3" /> FREE AI TOOLS FOR STUDENTS</span>
            <span className="mx-3">•</span>
            <span className="mx-3"><FileText className="inline w-3 h-3" /> LAB RECORDS</span>
            <span className="mx-3">•</span>
            <span className="mx-3"><BookOpen className="inline w-3 h-3" /> STUDY NOTES</span>
            <span className="mx-3">•</span>
            <span className="mx-3"><CheckCircle className="inline w-3 h-3" /> EXAM PREP</span>
            <span className="mx-3">•</span>
            <span className="mx-3"><Zap className="inline w-3 h-3" /> FREE AI TOOLS FOR STUDENTS</span>
            <span className="mx-3">•</span>
            <span className="mx-3"><FileText className="inline w-3 h-3" /> LAB RECORDS</span>
            <span className="mx-3">•</span>
            <span className="mx-3"><BookOpen className="inline w-3 h-3" /> STUDY NOTES</span>
            <span className="mx-3">•</span>
            <span className="mx-3"><CheckCircle className="inline w-3 h-3" /> EXAM PREP</span>
            <span className="mx-3">•</span>
          </div>
        </div>
        <Navbar />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
