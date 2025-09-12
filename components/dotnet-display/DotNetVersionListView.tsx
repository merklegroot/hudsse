import { RuntimeInfo, SdkInfo, GroupedRuntimes } from "@/models/SseMessage";
import { useMessageStore } from "@/store/messageStore";

export function DotNetVersionView({ majorVersion, sdks, groupedRuntimes }: { majorVersion: number, sdks: SdkInfo[], groupedRuntimes: GroupedRuntimes }) {

    return (
        <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
            <span className="text-lg font-semibold">.NET {majorVersion}</span>
            <div className="flex flex-col gap-2 mt-2">
                {sdks.map((sdk) => (
                    <div key={sdk.version} className="text-sm text-blue-600">SDK {sdk.version}</div>
                ))}
                {Object.entries(groupedRuntimes).map(([appType, runtimes]) => (
                    <div key={appType} className="ml-2">
                        <div className="text-sm font-medium text-gray-700">{appType}</div>
                        {runtimes.map((runtime) => (
                            <div key={`${appType}-${runtime.version}`} className="text-xs text-gray-600 ml-2">
                                {runtime.version}
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    )
}

export default function DotNetVersionListView() {
    const majorVersions = [ 5, 6, 7, 8, 9 ];
    const sdks = useMessageStore((state) => state.dotnetState?.dotnetSdks) || [];
    const groupedRuntimes = useMessageStore((state) => state.dotnetState?.groupedRuntimes) || {};

    function getSdksForMajorVersion(majorVersion: number) {
        return sdks.filter((sdk) => sdk.version.startsWith(majorVersion.toString()));
    }

    function getGroupedRuntimesForMajorVersion(majorVersion: number): GroupedRuntimes {
        const filtered: GroupedRuntimes = {};
        
        Object.entries(groupedRuntimes).forEach(([appType, runtimes]) => {
            const filteredRuntimes = runtimes.filter((runtime) => 
                runtime.version.startsWith(majorVersion.toString())
            );
            if (filteredRuntimes.length > 0) {
                filtered[appType] = filteredRuntimes;
            }
        });
        
        return filtered;
    }

    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">DotNet Versions</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {majorVersions.map((majorVersion) => {
                    const versionSdks = getSdksForMajorVersion(majorVersion);
                    const versionRuntimes = getGroupedRuntimesForMajorVersion(majorVersion);
                    
                    // Only show versions that have SDKs or runtimes
                    if (versionSdks.length === 0 && Object.keys(versionRuntimes).length === 0) {
                        return null;
                    }
                    
                    return (
                        <DotNetVersionView 
                            key={majorVersion} 
                            majorVersion={majorVersion} 
                            sdks={versionSdks} 
                            groupedRuntimes={versionRuntimes} 
                        />
                    );
                })}
            </div>
        </div>
    );
}