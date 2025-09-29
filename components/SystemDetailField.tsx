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
          <button
            onClick={onRefresh}
            className="text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 rounded p-1"
            title="Refresh"
          >
            <svg 
              className="w-4 h-4" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" 
              />
            </svg>
          </button>
        )}
      </div>
      <p className="text-lg font-semibold text-gray-900">{value}</p>
    </div>
  );
}
