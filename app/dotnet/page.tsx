import type { Metadata } from 'next';
import { DotNetControl } from './DotNetControl';
import { DotNetPageClient } from './DotNetPageClient';

export const metadata: Metadata = {
  title: 'Home - SSE App',
  description: 'Home page',
}

export default function Home() {
  return <DotNetPageClient />;
}
