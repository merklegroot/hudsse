'use client';

import { FaMicrochip, FaQuestion } from 'react-icons/fa';
import { HiChip } from 'react-icons/hi';

interface MotherboardIconProps {
  motherboardName?: string;
  className?: string;
}

export default function MotherboardIcon({ motherboardName, className = "w-6 h-6" }: MotherboardIconProps) {
  // Use chip icon to represent motherboard/circuit board
  return <HiChip className={`${className} text-purple-600`} />;
}
