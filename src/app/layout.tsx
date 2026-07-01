import type { Metadata } from "next";
import "./globals.css";
import { inter } from "@/config/fonts";
import Provider from "@/components/provider/Provider";

export const metadata: Metadata = {
  title: {
    template: "%s - Teslo | Shop",
    default: 'Home - Teslo | Shop'
  },
  description: "Una tienda virtual de productos",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.className} h-full antialiased`}
    >
      <body className="min-h-full! flex flex-col">
        <Provider>
          {children}
        </Provider>
      </body>
    </html>
  );
}
