import { useDialogContext } from "../hooks/useDialog";
import { ElectroInterface, getTitleForElectro } from "../lib/data/Electro";
import { electroInterfaceToPredefined, getBodyFromPredefined } from "../lib/data/Predefined";
import Button from "./Button";
import Dialog from "./Dialog";

type NodeInfoDialogProps = {
    electroInterface: ElectroInterface;
};

export default function NodeInfoDialog({ electroInterface, }: NodeInfoDialogProps) {
    const dialogContent = useDialogContext();

    return <Dialog header={getTitleForElectro(electroInterface)}>
        {getBodyFromPredefined(electroInterfaceToPredefined(electroInterface))}
        <Button type="primary" onClick={() => dialogContent?.closeDialog()}>
            Okay
        </Button>
    </ Dialog>;
}