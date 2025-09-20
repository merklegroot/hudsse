import { platformType } from "@/utils/platformUtil";

export function OsTypeControl({ osType }: { osType: platformType }) {
    return (
        <div className="flex flex-col items-center space-y-4">
            <div className="w-20 h-20 bg-gray-300 rounded-lg flex items-center justify-center">
                <span className="text-gray-600 text-sm">OS</span>
            </div>
            <div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">OS Type</h3>
                <p className="text-2xl font-semibold text-gray-900">{osType || 'Unknown'}</p>
            </div>
        </div>
    )
}