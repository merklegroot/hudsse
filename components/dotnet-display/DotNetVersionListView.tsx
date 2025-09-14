import { AppVersions } from "@/models/SseMessage";
import { useMessageStore } from "@/store/messageStore";
import { useState } from "react";
import SseInstallDotNetButton from "../SseInstallDotNetButton";
import SseUninstallDotNetButton from "../SseUninstallDotNetButton";
import InProgressDialog from "../InProgressDialog";

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
    const [showUninstallDialog, setShowUninstallDialog] = useState(false);
    const [showUninstallProgressDialog, setShowUninstallProgressDialog] = useState(false);
    const [uninstallVersion, setUninstallVersion] = useState<string>('');
    const [uninstallAppName, setUninstallAppName] = useState<string>('');
    const [isUninstalling, setIsUninstalling] = useState(false);
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

    const handleInstallCancel = () => {
        setShowInstallDialog(false);
    };

    const handleInstallComplete = () => {
        // Optionally refresh the dotnet state here
        console.log(`Installation completed for .NET ${majorVersion}`);
    };

    const handleUninstallClick = (appName: string, version: string) => {
        setUninstallAppName(appName);
        setUninstallVersion(version);
        setShowUninstallDialog(true);
    };


    const handleUninstallCancel = () => {
        setShowUninstallDialog(false);
    };

    const handleUninstallStart = () => {
        setShowUninstallDialog(false);
        setShowUninstallProgressDialog(true);
        setIsUninstalling(true);
    };

    const handleUninstallComplete = () => {
        setIsUninstalling(false);
        setShowUninstallProgressDialog(false);
        // Optionally refresh the dotnet state here
        console.log(`Uninstall completed for ${uninstallAppName} ${uninstallVersion}`);
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
                                    className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium transition-colors ${getPillColor(appName)}`}
                                >
                                    {version}
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleUninstallClick(appName, version);
                                        }}
                                        className="ml-1 hover:bg-black hover:bg-opacity-20 rounded-full p-0.5 transition-colors"
                                        title={`Uninstall ${appName} ${version}`}
                                    >
                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
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
            
            {showInstallDialog && (
                <div 
                    className="fixed inset-0 flex items-center justify-center z-50"
                    style={{ backgroundColor: 'rgba(0, 0, 0, 0.3)' }}
                >
                    <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            Install .NET SDK
                        </h3>
                        <p className="text-gray-600 mb-6">
                            Are you sure you want to install the .NET {majorVersion} SDK? This will download and install the latest .NET {majorVersion} SDK and runtime components on your system.
                        </p>
                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={handleInstallCancel}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                Cancel
                            </button>
                            <SseInstallDotNetButton
                                majorVersion={majorVersion}
                                onInstallComplete={() => {
                                    handleInstallComplete();
                                    setShowInstallDialog(false);
                                }}
                            />
                        </div>
                    </div>
                </div>
            )}
            
            {showUninstallDialog && (
                <div 
                    className="fixed inset-0 flex items-center justify-center z-50"
                    style={{ backgroundColor: 'rgba(0, 0, 0, 0.3)' }}
                >
                    <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            Uninstall .NET Component
                        </h3>
                        <p className="text-gray-600 mb-6">
                            Are you sure you want to uninstall {uninstallAppName} version {uninstallVersion}? This will remove the specified component from your system.
                        </p>
                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={handleUninstallCancel}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                Cancel
                            </button>
                            <SseUninstallDotNetButton
                                appName={uninstallAppName}
                                version={uninstallVersion}
                                onUninstallStart={handleUninstallStart}
                                onUninstallComplete={handleUninstallComplete}
                            />
                        </div>
                    </div>
                </div>
            )}
            
            <InProgressDialog
                isOpen={showUninstallProgressDialog}
                title="Uninstalling .NET Component"
                message={`Uninstalling ${uninstallAppName} version ${uninstallVersion}... Please wait while the component is removed from your system.`}
            />
            
        </div>
    )
}

export default function DotNetVersionListView() {
    const majorVersions = [5, 6, 7, 8, 9, 10].reverse();
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