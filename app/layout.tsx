import type { Metadata } from 'next';
import Navigation from '../components/Navigation';
import { SseProvider } from '../contexts/SseContext';
import { MachineTerminal } from '../components/MachineTerminal';
import '../styles/globals.css';

export const metadata: Metadata = {
  title: 'SSE App',
  description: 'Server-Sent Events application',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <SseProvider>
          <Navigation />
          <div className="flex h-[calc(100vh-4rem)]">
            <div className="flex-1">
              {children}
            </div>
            <MachineTerminal />
          </div>
        </SseProvider>
      </body>
    </html>
  );
}
