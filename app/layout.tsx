import type { ReactNode } from "react"
import { Inter } from "next/font/google"
import "./globals.css"
import { DataFetchingProvider } from "../context/DataFetchingContext"
import MainLayout from "../components/layout/MainLayout"
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Tourna Master - Football Tournament Management</title>
        <meta name="description" content="Manage football tournaments with ease using Tourna Master" />
      </head>
      <body className={`${inter.className} bg-neutral-50 min-h-screen antialiased`}>
        <DataFetchingProvider>
          <MainLayout>{children}</MainLayout>
        </DataFetchingProvider>
        <ToastContainer   position="top-right" autoClose={3000}/>
      </body>
    </html>
  )
}

export const metadata = {
      generator: 'v0.dev'
    };
