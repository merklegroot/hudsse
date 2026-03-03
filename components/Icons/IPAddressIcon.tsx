'use client';

import { FaNetworkWired, FaGlobe } from 'react-icons/fa';

interface IPAddressIconProps {
  ipAddress?: string;
  className?: string;
}

export default function IPAddressIcon({ ipAddress, className = "w-6 h-6" }: IPAddressIconProps) {
  // Use network icon for local IPs, globe for public IPs
  if (ipAddress && (ipAddress.startsWith('192.168.') || ipAddress.startsWith('10.') || ipAddress.startsWith('172.'))) {
    return <FaNetworkWired className={`${className} text-blue-600`} />;
  }
  return <FaGlobe className={`${className} text-blue-500`} />;
}
