'use client';

import { 
  SiDocker,
  SiKubernetes,
  SiVmware,
  SiVirtualbox,
  SiOracle
} from 'react-icons/si';
import { 
  FaServer, 
  FaQuestion, 
  FaCubes,
  FaDesktop,
  FaCloud
} from 'react-icons/fa';
import { HiDesktopComputer } from 'react-icons/hi';
import { VirtualizationType } from '@/utils/virtualizationUtil';

interface VirtualizationIconProps {
  virtualizationType: VirtualizationType;
  className?: string;
}

export default function VirtualizationIcon({ 
  virtualizationType, 
  className = "w-6 h-6" 
}: VirtualizationIconProps) {
  // Handle invalid type
  if (virtualizationType === VirtualizationType.Invalid) {
    return <FaQuestion className={`${className} text-gray-500`} />;
  }

  // Physical hardware
  if (virtualizationType === VirtualizationType.PHYSICAL) {
    return <HiDesktopComputer className={`${className} text-gray-700`} />;
  }

  // Cloud platforms
  if (virtualizationType === VirtualizationType.VERCEL) {
    return <FaCloud className={`${className} text-black`} />;
  }

  if (virtualizationType === VirtualizationType.AWS_LAMBDA) {
    return <FaCloud className={`${className} text-orange-500`} />;
  }

  if (virtualizationType === VirtualizationType.AZURE_FUNCTIONS) {
    return <FaCloud className={`${className} text-blue-500`} />;
  }

  if (virtualizationType === VirtualizationType.GOOGLE_CLOUD_PLATFORM) {
    return <FaCloud className={`${className} text-blue-600`} />;
  }

  if (virtualizationType === VirtualizationType.HEROKU) {
    return <FaCloud className={`${className} text-purple-500`} />;
  }

  if (virtualizationType === VirtualizationType.RAILWAY) {
    return <FaCloud className={`${className} text-gray-600`} />;
  }

  if (virtualizationType === VirtualizationType.NETLIFY) {
    return <FaCloud className={`${className} text-green-500`} />;
  }

  if (virtualizationType === VirtualizationType.RENDER) {
    return <FaCloud className={`${className} text-orange-600`} />;
  }

  if (virtualizationType === VirtualizationType.FLY_IO) {
    return <FaCloud className={`${className} text-purple-600`} />;
  }

  if (virtualizationType === VirtualizationType.DIGITAL_OCEAN) {
    return <FaCloud className={`${className} text-blue-500`} />;
  }

  if (virtualizationType === VirtualizationType.LINODE) {
    return <FaCloud className={`${className} text-red-500`} />;
  }

  if (virtualizationType === VirtualizationType.VULTR) {
    return <FaCloud className={`${className} text-blue-700`} />;
  }

  // Unknown virtualization
  if (virtualizationType === VirtualizationType.UNKNOWN) {
    return <FaQuestion className={`${className} text-gray-500`} />;
  }

  // Fallback for any unhandled types
  return <FaQuestion className={`${className} text-gray-500`} />;
}
