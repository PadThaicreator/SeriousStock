'use client'

import { metadata } from './metadata'; 
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import { Provider } from 'react-redux';
import store from './redux/store'

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
      <link rel="icon" href="/image/signin.JPG" />
      <title>{metadata.title}</title>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Provider store={store}>
          {children}
        </Provider>
        
      </body>
    </html>
  );
}
