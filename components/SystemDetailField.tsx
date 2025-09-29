import RefreshButton from './RefreshButton';
import React from 'react';

interface SystemDetailFieldProps {
  label: string;
  value: string;
  className?: string;
  showRefreshButton?: boolean;
  onRefresh?: () => void;
  icon?: React.ReactNode;
}

export default function SystemDetailField({ 
  label, 
  value, 
  className = "", 
  showRefreshButton = false, 
  onRefresh,
  icon
}: SystemDetailFieldProps) {
  return (
    <div className={`p-4 bg-gray-50 rounded-lg ${className}`}>
      <div className="flex items-center justify-between mb-1">
        <h3 className="text-sm font-medium text-gray-600">{label}</h3>
        {showRefreshButton && onRefresh && (
          <RefreshButton onRefresh={onRefresh} />
        )}
      </div>
      <div className="flex items-center gap-2">
        {icon && <div className="flex-shrink-0">{icon}</div>}
        <p className="text-lg font-semibold text-gray-900">{value}</p>
      </div>
    </div>
  );
}
