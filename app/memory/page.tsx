import { Metadata } from 'next';
import { MemoryPageClient } from './MemoryPageClient';

export const metadata: Metadata = {
  title: 'Memory Information',
  description: 'View system memory usage and top memory-consuming processes',
};

export default function MemoryPage() {
  return <MemoryPageClient />;
}
