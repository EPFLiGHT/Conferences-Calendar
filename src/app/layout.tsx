'use client';

import { ChakraProvider } from '@chakra-ui/react';
import { system } from '@/theme';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const basePath = process.env.NODE_ENV === 'production' ? '/Conferences-Calendar' : '';

  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/svg+xml" href={`${basePath}/light-logo.svg`} />
        <link
          href="https://api.fontshare.com/v2/css?f[]=chillax@400,500,600,700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body style={{ margin: 0, padding: 0 }}>
        <ChakraProvider value={system}>
          {children}
        </ChakraProvider>
      </body>
    </html>
  );
}
