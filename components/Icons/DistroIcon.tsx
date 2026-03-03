'use client';

import { 
  SiLinux,
  SiUbuntu,
  SiDebian,
  SiFedora,
  SiArchlinux,
  SiOpensuse,
  SiRedhat,
  SiCentos,
  SiAlmalinux,
  SiRockylinux
} from 'react-icons/si';
import { FaQuestion } from 'react-icons/fa';

interface DistroIconProps {
  distroFlavor?: string;
  className?: string;
}

export default function DistroIcon({ distroFlavor, className = "w-6 h-6" }: DistroIconProps) {
  if (!distroFlavor) {
    return <SiLinux className={`${className} text-yellow-500`} />;
  }

  const distroLower = distroFlavor.toLowerCase();

  if (distroLower.includes('ubuntu')) {
    return <SiUbuntu className={`${className} text-orange-500`} />;
  }

  if (distroLower.includes('debian')) {
    return <SiDebian className={`${className} text-red-600`} />;
  }

  if (distroLower.includes('fedora')) {
    return <SiFedora className={`${className} text-blue-600`} />;
  }

  if (distroLower.includes('arch')) {
    return <SiArchlinux className={`${className} text-blue-500`} />;
  }

  if (distroLower.includes('opensuse') || distroLower.includes('suse')) {
    return <SiOpensuse className={`${className} text-green-600`} />;
  }

  if (distroLower.includes('red hat') || distroLower.includes('rhel')) {
    return <SiRedhat className={`${className} text-red-600`} />;
  }

  if (distroLower.includes('centos')) {
    return <SiCentos className={`${className} text-blue-600`} />;
  }

  if (distroLower.includes('almalinux')) {
    return <SiAlmalinux className={`${className} text-blue-700`} />;
  }

  if (distroLower.includes('rocky')) {
    return <SiRockylinux className={`${className} text-blue-600`} />;
  }

  // Generic Linux fallback
  if (distroLower.includes('linux')) {
    return <SiLinux className={`${className} text-yellow-500`} />;
  }

  return <FaQuestion className={`${className} text-gray-500`} />;
}
