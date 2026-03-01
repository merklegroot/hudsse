import type { Metadata } from 'next';
import { CpuPageClient } from './CpuPageClient';

export const metadata: Metadata = {
  title: 'CPU - SSE App',
  description: 'CPU information page',
}

export default function CpuPage() {
  return <CpuPageClient />;
}
