import type { Metadata } from 'next';
import { GpuPageClient } from './GpuPageClient';

export const metadata: Metadata = {
  title: 'GPU - SSE App',
  description: 'GPU information page',
}

export default function GpuPage() {
  return <GpuPageClient />;
}
