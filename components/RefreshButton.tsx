interface RefreshButtonProps {
  onRefresh: () => void;
  className?: string;
  title?: string;
}

export default function RefreshButton({ 
  onRefresh, 
  className = "", 
  title = "Refresh" 
}: RefreshButtonProps) {
  return (
    <button
      onClick={onRefresh}
      className={`text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 rounded p-1 ${className}`}
      title={title}
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
  );
}
