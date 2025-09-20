'use client';

import { 
  SiLinux, 
  SiMacos, 
  SiFreebsd,
  SiOpenbsd
} from 'react-icons/si';
import { FaApple, FaQuestion } from 'react-icons/fa';
import { DiWindows } from 'react-icons/di';
import { platformType } from '@/utils/platformUtil';

interface OSTypeIconProps {
  osType: platformType | undefined | null;
  className?: string;
}

export default function OSTypeIcon({ osType, className = "w-6 h-6" }: OSTypeIconProps) {
  // Handle undefined/null osType
  if (!osType) {
    return <FaQuestion className={`${className} text-gray-500`} />;
  }
  
  // Windows
  if (osType === platformType.windows) {
    return <DiWindows className={`${className} text-blue-600`} />;
  }
  
  // macOS
  if (osType === platformType.mac) {
    return <SiMacos className={`${className} text-gray-600`} />;
  }
  
  // Linux
  if (osType === platformType.linux) {
    return <SiLinux className={`${className} text-gray-700`} />;
  }
  
  // BSD variants
  if (osType === platformType.freebsd) {
    return <SiFreebsd className={`${className} text-red-600`} />;
  }
  
  if (osType === platformType.openbsd) {
    return <SiOpenbsd className={`${className} text-red-600`} />;
  }
  
  if (osType === platformType.aix) {
    return <FaApple className={`${className} text-gray-600`} />;
  }
  
  if (osType === platformType.sunos) {
    return <FaApple className={`${className} text-gray-600`} />;
  }
  
  if (osType === platformType.android) {
    return <SiLinux className={`${className} text-green-600`} />;
  }
  
  // Unknown OS fallback
  return <FaQuestion className={`${className} text-gray-500`} />;
}
