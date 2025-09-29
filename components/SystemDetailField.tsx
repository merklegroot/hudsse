import RefreshButton from './RefreshButton';

interface SystemDetailFieldProps {
  label: string;
  value: string;
  className?: string;
  showRefreshButton?: boolean;
  onRefresh?: () => void;
}

export default function SystemDetailField({ 
  label, 
  value, 
  className = "", 
  showRefreshButton = false, 
  onRefresh 
}: SystemDetailFieldProps) {
  return (
    <div className={`p-4 bg-gray-50 rounded-lg ${className}`}>
      <div className="flex items-center justify-between mb-1">
        <h3 className="text-sm font-medium text-gray-600">{label}</h3>
        {showRefreshButton && onRefresh && (
          <RefreshButton onRefresh={onRefresh} />
        )}
      </div>
      <p className="text-lg font-semibold text-gray-900">{value}</p>
    </div>
  );
}
