import type { Metadata, Viewport } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";
import { BottomNav } from "@/components/layout/BottomNav";
import { DesktopNav } from "@/components/layout/DesktopNav";
import { I18nProvider } from "@/lib/i18n/context";
import { MainWrapper } from "@/components/layout/MainWrapper";
import { FavoritesProvider } from "@/lib/favorites/context";
import { ToastProvider } from "@/components/notifications/ToastProvider";
import { ToastContainer } from "@/components/notifications/ToastContainer";
import { AuthProvider } from "@/lib/firebase/auth-context";
import { LiveNotifications } from "@/components/notifications/LiveNotifications";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://auctionge.com";

const dmSans = DM_Sans({
  subsets: ["latin", "latin-ext"],
  variable: "--font-body",
  display: "swap",
  preload: true,
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "AuctionGe — Real Estate Auctions in Georgia",
    template: "%s | AuctionGe",
  },
  description: "Find the best deals on real estate auctions in Georgia. Aggregating 11,000+ lots from Livo, Bank of Georgia, eAuction.ge, and Tbilisi Municipality. Search apartments, land, commercial properties.",
  keywords: ["auction", "real estate", "Georgia", "Tbilisi", "Batumi", "property", "land", "apartment", "аукцион", "недвижимость", "Грузия", "Тбилиси", "აუქციონი", "უძრავი ქონება", "საქართველო"],
  authors: [{ name: "AuctionGe" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    alternateLocale: ["ka_GE", "ru_RU"],
    url: SITE_URL,
    siteName: "AuctionGe",
    title: "AuctionGe — Real Estate Auctions in Georgia",
    description: "Find the best deals on real estate auctions across Georgia. 11,000+ lots from 4 sources.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "AuctionGe — Real Estate Auctions in Georgia",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AuctionGe — Real Estate Auctions in Georgia",
    description: "Find the best deals on real estate auctions across Georgia. 11,000+ lots from 4 sources.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: SITE_URL,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#FFFFFF",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={dmSans.variable}>
      <head>
        <link rel="preconnect" href="http://localhost:8080" />
        <link rel="preconnect" href="https://api-auction.livo.ge" />
        <link rel="dns-prefetch" href="https://basemaps.cartocdn.com" />
      </head>
      <body className="bg-white min-h-screen">
        <AuthProvider>
        <I18nProvider>
        <FavoritesProvider>
        <ToastProvider>
          <DesktopNav />
          <MainWrapper>{children}</MainWrapper>
          <div className="lg:hidden">
            <BottomNav />
          </div>
          <ToastContainer />
          <LiveNotifications />
        </ToastProvider>
        </FavoritesProvider>
        </I18nProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
