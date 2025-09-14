import DotNetInfoDisplay from "./DotNetInfoDisplay";
import DotNetLocationDisplay from "./DotNetLocationDisplay";
import DotNetVersionListView from "./DotNetVersionListView";
import InProgressDialog from "../InProgressDialog";

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