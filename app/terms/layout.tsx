import React, { ReactNode } from 'react';
import Navbar from '@/components/layout/navbar';
import Footer from '@/components/layout/footer';

interface TermsPage {
  children: ReactNode;
}

export default function AccountLayout({ children }: TermsPage) {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />

      {/* Konten utama */}
      <main className="flex-grow">
        {children}
      </main>

      <Footer />
    </div>
  );
}
