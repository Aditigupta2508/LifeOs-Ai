import "./globals.css";
import PWARegister from "./pwa-register";
import { ThemeProvider } from "./context/ThemeProvider";
import LayoutWrapper from "@/components/LayoutWrapper";

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export const metadata = {
  title: "LifeOS AI",
  description: "AI Powered Life Management System",
  manifest: "/manifest.webmanifest",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <PWARegister />

        <ThemeProvider>
          <LayoutWrapper>
            {children}
          </LayoutWrapper>
        </ThemeProvider>
      </body>
    </html>
  );
}