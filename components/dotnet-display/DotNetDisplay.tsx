import DotNetInfoDisplay from "./DotNetInfoDisplay";
import DotNetSdksDisplay from "./DotNetSdksDisplay";
import DotNetRuntimesDisplay from "./DotNetRuntimesDisplay";
import WhichDotNetDisplay from "./WhichDotNetDisplay";

export default function DotNetDisplay() {
    return (
        <>
            <WhichDotNetDisplay />            
            <DotNetSdksDisplay />
            <DotNetRuntimesDisplay />
            <DotNetInfoDisplay />
        </>
    )
}