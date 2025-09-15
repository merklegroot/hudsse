import { NextResponse } from 'next/server';

export async function GET() {
  console.log('Ping');
    
  return NextResponse.json({ 
    message: 'Pong!', 
    timestamp: new Date().toISOString(),
    status: 'success'
  });
}
