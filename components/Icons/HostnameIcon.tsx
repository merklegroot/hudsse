'use client';

import { FaDesktop, FaQuestion } from 'react-icons/fa';

interface HostnameIconProps {
  hostname?: string;
  className?: string;
}

export default function HostnameIcon({ hostname, className = "w-6 h-6" }: HostnameIconProps) {
  return <FaDesktop className={`${className} text-gray-600`} />;
}
