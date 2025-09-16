import DotNetInfoDisplay from "./DotNetInfoDisplay";
import DotNetLocationDisplay from "./DotNetLocationDisplay";
import DotNetVersionListView from "./DotNetVersionListView";
import InProgressDialog from "../InProgressDialog";
import DotNetInstallLink from "./DotnetInstallLink";

export default function DotNetDisplay() {
    return (
        <>
            <DotNetLocationDisplay />
            <DotNetVersionListView />
            <DotNetInfoDisplay />
            <InProgressDialog />
        </>
    )
}