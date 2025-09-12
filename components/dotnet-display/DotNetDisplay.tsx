import DotNetInfoDisplay from "./DotNetInfoDisplay";
import DotNetSdksDisplay from "./DotNetSdksDisplay";
import DotNetRuntimesDisplay from "./DotNetRuntimesDisplay";
import DotNetLocationDisplay from "./DotNetLocationDisplay";
import DotNetVersionListView from "./DotNetVersionListView";

export default function DotNetDisplay() {
    return (
        <>
            <DotNetLocationDisplay />
            <DotNetVersionListView />
            <DotNetSdksDisplay />
            <DotNetRuntimesDisplay />
            <DotNetInfoDisplay />
        </>
    )
}