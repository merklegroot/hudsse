import { RuntimeInfo, SdkInfo } from "@/models/SseMessage";
import { useMessageStore } from "@/store/messageStore";

export function DotNetVersionView({ majorVersion, sdks, runtimes }: { majorVersion: number, sdks: SdkInfo[], runtimes: RuntimeInfo[] }) {

    return (
        <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
            <span>.NET {majorVersion}</span>
            <div className="flex flex-col gap-2">
                {sdks.map((sdk) => (
                    <div key={sdk.version}>SDK {sdk.version}</div>
                ))}
                {runtimes.map((runtime) => (
                    <div key={runtime.version}>Runtime {runtime.version}</div>
                ))}
            </div>
        </div>
    )
}

export default function DotNetVersionListView() {
    const majorVersions = [
        5, 6, 7, 8, 9
    ]
    const sdks = useMessageStore((state) => state.dotnetState?.dotnetSdks) || [];
    const runtimes = useMessageStore((state) => state.dotnetState?.dotnetRuntimes) || [];

    function getSdksForMajorVersion(majorVersion: number) {
        return sdks.filter((sdk) => sdk.version.startsWith(majorVersion.toString()));
    }

    function getRuntimesForMajorVersion(majorVersion: number) {
        return runtimes.filter((runtime) => runtime.version.startsWith(majorVersion.toString()));
    }
    
    return (
        <div>
            <h1>DotNet Versions</h1>
            {majorVersions.map((majorVersion) => (
                <DotNetVersionView key={majorVersion} majorVersion={majorVersion} sdks={getSdksForMajorVersion(majorVersion)} runtimes={getRuntimesForMajorVersion(majorVersion)} />
            ))}
        </div>
    );
}