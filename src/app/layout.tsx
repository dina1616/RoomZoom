import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "RoomZoom - Student Housing",
  description: "Find your perfect student accommodation with RoomZoom",
};

// This is just a shell for the internationalized layout
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
} 