import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Infographic Generator",
  description: "Создавайте инфографику с помощью искусственного интеллекта",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
