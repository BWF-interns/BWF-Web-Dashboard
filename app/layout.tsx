import './globals.css';
import React from 'react';

export const metadata = {
  title: 'BWF Portal',
  description: 'Borderless World Foundation Student Dashboard',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}