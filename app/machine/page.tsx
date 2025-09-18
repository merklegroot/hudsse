import type { Metadata } from 'next';
import { MachineControl } from './MachineControl';

export const metadata: Metadata = {
  title: 'Machine - SSE App',
  description: 'Machine page',
}

export default function Machine() {
  return (
    <main>
      <h1>Machine</h1>
      <MachineControl />
    </main>
  )
}
