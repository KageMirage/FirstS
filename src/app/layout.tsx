import React from 'react';
import type { Metadata } from 'next';
import '../index.css';
import { Providers } from './providers';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { MobileBottomNav } from '../components/MobileBottomNav';
import { PostAdModal } from '../components/PostAdModal';
import { AdDetailModal } from '../components/AdDetailModal';
import { AuthModal } from '../components/AuthModal';
import { CategoryDropdownModal } from '../components/CategoryDropdownModal';
import { PartnerBannerModal } from '../components/PartnerBannerModal';
import { ToastNotification } from '../components/ToastNotification';

export const metadata: Metadata = {
  title: 'Adverts PRO - Доска объявлений',
  description: 'Современная доска объявлений и маркетплейс услуг: недвижимость, вакансии, авто, товары и сервисы с интеграцией REST API, Redux Toolkit и авторизацией.',
  openGraph: {
    title: 'Adverts PRO - Доска объявлений',
    description: 'Современная доска объявлений и маркетплейс услуг: недвижимость, вакансии, авто, товары и сервисы с интеграцией REST API, Redux Toolkit и авторизацией.',
    type: 'website',
  },
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <body className="min-h-screen bg-[#fcfdfe] text-gray-900 font-sans antialiased selection:bg-[#1976D2] selection:text-white pb-20 sm:pb-0" id="adverts-pro-app">
        <Providers>
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-1">
              {children}
            </main>
            <Footer />
            <MobileBottomNav />
            <PostAdModal />
            <AdDetailModal />
            <AuthModal />
            <CategoryDropdownModal />
            <PartnerBannerModal />
            <ToastNotification />
          </div>
        </Providers>
      </body>
    </html>
  );
}
