'use client';

import { ChakraProvider } from '@chakra-ui/react';
import { system } from '@/theme';
import '../src/index.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ChakraProvider value={system}>
          {children}
        </ChakraProvider>
      </body>
    </html>
  );
}
