import { platformType, platformUtil } from "@/utils/platformUtil";
import OSTypeIcon from "@/components/OSTypeIcon";

export function OsTypeControl({ osType }: { osType: platformType | undefined | null }) {
    return (
        <div className="flex flex-col items-center space-y-4">
            <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center">
                <OSTypeIcon osType={osType} className="w-12 h-12" />
            </div>
            <div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">OS Type</h3>
                <p className="text-2xl font-semibold text-gray-900">{platformUtil.getFriendlyPlatformName(osType)}</p>
            </div>
        </div>
    )
}