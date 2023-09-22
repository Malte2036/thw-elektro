import { useDialogContext } from "../hooks/useDialog";
import Dialog from "./Dialog";

type ConfirmDialogProps = {
  title: string;
  question: string;
  onConfirm: () => void;
  onCancel?: () => void;
};

export default function ConfirmDialog({
  title,
  question,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const dialogContent = useDialogContext();

  return (
    <Dialog header={title}>
      <div className="flex flex-col gap-2">
        {question}
        <div className="flex flex-row gap-2 w-full justify-between">
          <thw-button
            type="primary"
            onClick={() => {
              onConfirm();
              dialogContent?.closeDialog();
            }}
          >
            <span className="block min-width-3">Ja</span>
          </thw-button>
          <thw-button
            type="secondary"
            onClick={() => {
              onCancel?.();
              dialogContent?.closeDialog();
            }}
          >
            <span className="block min-width-3">Nein</span>
          </thw-button>
        </div>
      </div>
    </Dialog>
  );
}
