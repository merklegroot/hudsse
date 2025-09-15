'use client';

import { useState } from 'react';

export default function PingButton() {
  const [isLoading, setIsLoading] = useState(false);

  const handlePing = async () => {
    if (isLoading) return;

    setIsLoading(true);
    
    try {
      const response = await fetch('/api/ping');
      const data = await response.json();
      
      if (response.ok) {
        alert(`Ping successful! Response: ${JSON.stringify(data, null, 2)}`);
      } else {
        alert(`Ping failed! Status: ${response.status}, Response: ${JSON.stringify(data, null, 2)}`);
      }
    } catch (error) {
      alert(`Ping error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handlePing}
      disabled={isLoading}
      className={`font-bold py-2 px-4 rounded ${isLoading
        ? 'bg-gray-400 cursor-not-allowed'
        : 'bg-blue-500 hover:bg-blue-700 text-white'
      }`}
    >
      {isLoading ? 'Pinging...' : 'Ping API'}
    </button>
  );
}
