interface SystemDetailFieldProps {
  label: string;
  value: string;
  className?: string;
}

export default function SystemDetailField({ label, value, className = "" }: SystemDetailFieldProps) {
  return (
    <div className={`p-4 bg-gray-50 rounded-lg ${className}`}>
      <h3 className="text-sm font-medium text-gray-600 mb-1">{label}</h3>
      <p className="text-lg font-semibold text-gray-900">{value}</p>
    </div>
  );
}
