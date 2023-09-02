import "./globals.css";
import type { Metadata } from "next";
import { Inter, Roboto, Noto_Sans_JP } from "next/font/google";
import { Header } from "./header";

const roboto = Roboto({
  subsets: ["latin"],
  weight: "400",
  variable: "--roboto",
  display: 'swap',
});

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
    <html lang="ja">
      <head>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0&display=optional" />
      </head>
      <body className={roboto.className}>
        <Header />
        {children}
      </body>
    </html>
  );
}
