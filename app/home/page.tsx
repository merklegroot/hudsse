import type { Metadata } from 'next';
import { HomeControl } from './HomeControl';

export const metadata: Metadata = {
  title: 'Home - SSE App',
  description: 'Home page',
}

export default function Home() {
  return (
    <main>
      <h1>Home</h1>
      <p>Welcome to the Home page!</p>
      <HomeControl />
    </main>
  )
}
