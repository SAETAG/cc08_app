import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "./contexts/AuthContext"
import { MedievalSharp } from "next/font/google"
import { cn } from "@/lib/utils"

const inter = Inter({ subsets: ["latin"] })
const medievalSharp = MedievalSharp({ 
  weight: "400",
  subsets: ["latin"],
  variable: "--font-medieval"
})

export const metadata: Metadata = {
  title: "Closet Chronicle",
  description: "This is the story of taking back your closet—and your life.",
  generator: "cc01",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={cn(inter.className, medievalSharp.variable)}>
      <head>
        {/* Add this script to clean up vsc-initialized class before React hydrates */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
            (function() {
              // Remove vsc-initialized class from body if it exists
              document.addEventListener('DOMContentLoaded', function() {
                if (document.body && document.body.classList.contains('vsc-initialized')) {
                  document.body.classList.remove('vsc-initialized');
                }
              });
            })();
          `,
          }}
        />
      </head>
      <body suppressHydrationWarning className="overflow-x-hidden relative min-h-screen">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}

