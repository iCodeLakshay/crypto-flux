// myComponents/ClientLayout.tsx
'use client'

import Header from "@/myComponents/Header";
import { ThemeProvider } from "@/myComponents/dark-theme/theme-provider";
import ReactQueryProvider from "@/myComponents/ReactQueryProvider";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ReactQueryProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <Header />
        {children}
      </ThemeProvider>
    </ReactQueryProvider>
  );
}
