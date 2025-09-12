import { AppVersions } from "@/models/SseMessage";
import { useMessageStore } from "@/store/messageStore";
import { useState } from "react";
import ConfirmationDialog from "../ConfirmationDialog";

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
    const [showInstallDialog, setShowInstallDialog] = useState(false);
    const hasSDK = appVersions['SDK'] && appVersions['SDK'].length > 0;
    const hasAspNetCore = Object.keys(appVersions).some(key =>
        key.toLowerCase() === 'microsoft.aspnetcore.app' && appVersions[key].length > 0
    );
    const hasNetCore = Object.keys(appVersions).some(key =>
        key.toLowerCase() === 'microsoft.netcore.app' && appVersions[key].length > 0
    );

    const isFullyInstalled = hasSDK && hasAspNetCore && hasNetCore;

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

    const handleInstallClick = () => {
        setShowInstallDialog(true);
    };

    const handleInstallConfirm = () => {
        // TODO: Implement SDK installation functionality
        console.log(`Installing .NET ${majorVersion} SDK`);
        setShowInstallDialog(false);
    };

    const handleInstallCancel = () => {
        setShowInstallDialog(false);
    };

    return (
        <div className={`border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow flex flex-col h-full ${isFullyInstalled
                ? 'bg-green-50 border-green-200'
                : 'bg-white'
            }`}>
            <div className="flex items-center justify-between mb-3">
                <span className="text-lg font-semibold">.NET {majorVersion}</span>
                <div className="flex items-center gap-3">
                    <div className={`flex items-center gap-1 text-sm font-medium ${status.color}`}>
                        <span>{status.icon}</span>
                        <span>{status.message}</span>
                    </div>
                </div>
            </div>
            <div className="flex flex-col gap-3 flex-1">
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
            <div className="mt-4 pt-3 border-t border-gray-200">
                <button
                    className="px-3 py-1 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
                    onClick={handleInstallClick}
                >
                    Install SDK
                </button>
            </div>
            
            <ConfirmationDialog
                isOpen={showInstallDialog}
                onClose={handleInstallCancel}
                onConfirm={handleInstallConfirm}
                title="Install .NET SDK"
                message={`Are you sure you want to install the .NET ${majorVersion} SDK? This will download and install the latest .NET ${majorVersion} SDK and runtime components on your system.`}
                confirmText={`Install .NET ${majorVersion} SDK`}
                confirmButtonClass="bg-green-600 hover:bg-green-700"
            />
        </div>
    )
}

export default function DotNetVersionListView() {
    const majorVersions = [5, 6, 7, 8, 9];
    const appVersions = useMessageStore((state) => state.dotnetState?.appVersions) || {};
    const hasTriedDetectingSdks = useMessageStore((state) => state.dotnetState?.hasTriedDetectingSdks) || false;
    const hasTriedDetectingRuntimes = useMessageStore((state) => state.dotnetState?.hasTriedDetectingRuntimes) || false;

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
            {!hasTriedDetectingSdks || !hasTriedDetectingRuntimes ? (
                <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                    <div className="text-gray-400 text-lg mb-2">🔍</div>
                    <p className="text-gray-500 text-lg">Detection not yet run...</p>
                    <p className="text-gray-400 text-sm mt-1">
                        {!hasTriedDetectingSdks && !hasTriedDetectingRuntimes
                            ? "SDKs and runtimes not yet detected..."
                            : !hasTriedDetectingSdks
                                ? "SDKs not yet detected..."
                                : "Runtimes not yet detected..."
                        }
                    </p>
                </div>
            ) : (
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
            )}
        </div>
    );
}