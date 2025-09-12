import DotNetInfoDisplay from "./DotNetInfoDisplay";
import DotNetSdksDisplay from "./DotNetSdksDisplay";
import DotNetRuntimesDisplay from "./DotNetRuntimesDisplay";
import DotNetLocationDisplay from "./DotNetLocationDisplay";

export default function DotNetDisplay() {
    return (
        <>
            <DotNetLocationDisplay />            
            <DotNetSdksDisplay />
            <DotNetRuntimesDisplay />
            <DotNetInfoDisplay />
        </>
    )
}