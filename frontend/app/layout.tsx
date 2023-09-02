import "./globals.css";
import type { Metadata } from "next";
import { Inter, Roboto } from "next/font/google";
import { Header } from "./header";

const inter = Inter({ subsets: ["latin"] });
const roboto = Roboto({
  subsets: ["latin"],
  weight: "400",
  variable: "--roboto",
})

export const metadata: Metadata = {
  title: "jincms",
  description: "いろいろ",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} ${roboto.variable}`}>
        <Header />
        {children}
      </body>
    </html>
  );
}
