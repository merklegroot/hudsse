import type { Metadata } from 'next';
import { HomeControl } from './HomeControl';
import { HomePageClient } from './HomePageClient';

export const metadata: Metadata = {
  title: 'Home - SSE App',
  description: 'Home page',
}

export default function Home() {
  return <HomePageClient />;
}
