import { AppVersions } from "@/models/SseMessage";
import { useMessageStore } from "@/store/messageStore";

const getPillColor = (appName: string) => {
    const lowerAppName = appName.toLowerCase();
    switch (lowerAppName) {
        case 'sdk':
            return 'bg-green-100 text-green-800 hover:bg-green-200';
        case 'microsoft.aspnetcore.app':
            return 'bg-purple-100 text-purple-800 hover:bg-purple-200';
        case 'microsoft.netcore.app':
            return 'bg-orange-100 text-orange-800 hover:bg-orange-200';
        default:
            return 'bg-blue-100 text-blue-800 hover:bg-blue-200';
    }
};

export function DotNetVersionView({ majorVersion, appVersions }: { majorVersion: number, appVersions: AppVersions }) {
    const hasSDK = appVersions['SDK'] && appVersions['SDK'].length > 0;
    const hasAspNetCore = Object.keys(appVersions).some(key => 
        key.toLowerCase() === 'microsoft.aspnetcore.app' && appVersions[key].length > 0
    );
    const hasNetCore = Object.keys(appVersions).some(key => 
        key.toLowerCase() === 'microsoft.netcore.app' && appVersions[key].length > 0
    );
    
    const getStatusMessage = () => {
        if (hasSDK && hasAspNetCore && hasNetCore) {
            return {
                type: 'complete',
                message: 'Installed!',
                icon: '✅',
                color: 'text-green-600'
            };
        }
        if (hasAspNetCore && hasNetCore) {
            return {
                type: 'runtimes-only',
                message: 'Runtimes only',
                icon: '⚠️',
                color: 'text-yellow-600'
            };
        }
        if (hasAspNetCore || hasNetCore) {
            const missing = hasAspNetCore ? 'Microsoft.NETCore.App' : 'Microsoft.AspNetCore.App';
            return {
                type: 'partial',
                message: `Missing ${missing}`,
                icon: '❌',
                color: 'text-red-600'
            };
        }
        return {
            type: 'not-installed',
            message: 'Not installed',
            icon: '❌',
            color: 'text-red-600'
        };
    };

    const status = getStatusMessage();

    return (
        <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
                <span className="text-lg font-semibold">.NET {majorVersion}</span>
                <div className={`flex items-center gap-1 text-sm font-medium ${status.color}`}>
                    <span>{status.icon}</span>
                    <span>{status.message}</span>
                </div>
            </div>
            <div className="flex flex-col gap-3">
                {Object.entries(appVersions).map(([appName, versions]) => (
                    <div key={appName}>
                        <div className="text-sm font-medium text-gray-700 mb-2">{appName}</div>
                        <div className="flex flex-wrap gap-1">
                            {versions.map((version) => (
                                <span 
                                    key={`${appName}-${version}`} 
                                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium transition-colors ${getPillColor(appName)}`}
                                >
                                    {version}
                                </span>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default function DotNetVersionListView() {
    const majorVersions = [ 5, 6, 7, 8, 9 ];
    const appVersions = useMessageStore((state) => state.dotnetState?.appVersions) || {};

    function getAppVersionsForMajorVersion(majorVersion: number): AppVersions {
        const filtered: AppVersions = {};
        
        Object.entries(appVersions).forEach(([appName, versions]) => {
            const filteredVersions = versions.filter((version) => 
                version.startsWith(majorVersion.toString())
            );
            if (filteredVersions.length > 0) {
                filtered[appName] = filteredVersions;
            }
        });
        
        return filtered;
    }

    return (
        <div>
            <h2 className="text-2xl font-bold text-gray-900">Versions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {majorVersions.map((majorVersion) => {
                    const versionAppVersions = getAppVersionsForMajorVersion(majorVersion);
                    
                    return (
                        <DotNetVersionView 
                            key={majorVersion} 
                            majorVersion={majorVersion} 
                            appVersions={versionAppVersions} 
                        />
                    );
                })}
            </div>
        </div>
    );
}