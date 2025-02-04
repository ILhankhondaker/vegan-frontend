import Footer from "@/components/home/footer/footer";
import Navbar from "@/components/navbar/navbar";
import NProgress from "@/provider/NProgress";
import type { Metadata } from "next";
import { Inter, Lexend_Deca } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";
// import { ClerkProvider } from "@clerk/nextjs";

const inter = Inter({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-inter",
});

const lexendDeca = Lexend_Deca({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-lexend",
});

export const metadata: Metadata = {
  title: "VEGAN COLLECTIVE",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // <ClerkProvider>
    <html lang="en">
      <body
        className={`bg-[#E8DFD6] ${inter.className} ${lexendDeca.className} antialiased`}
      >
        <Navbar />
        {children}
        <Footer />
        <NProgress />
        <Toaster />
      </body>
    </html>
    // </ClerkProvider>
  );
}
