import { useDialogContext } from "../hooks/useDialog";
import Button from "./Button";
import Dialog from "./Dialog";

type ConfirmDialogProps = {
  title: string;
  question: string;
  children?: React.ReactNode;
  onConfirm: () => void;
  onCancel?: () => void;
};

export default function ConfirmDialog({
  title,
  question,
  children,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const dialogContent = useDialogContext();

  return (
    <Dialog header={title}>
      <div className="flex flex-col gap-2">
        {question}
        {children}
        <div className="flex flex-row gap-2 w-full justify-between">
          <Button
            type="primary"
            onClick={() => {
              onConfirm();
              dialogContent?.closeDialog();
            }}
          >
            <span className="block min-width-3">Ja</span>
          </Button>
          <Button
            type="secondary"
            onClick={() => {
              onCancel?.();
              dialogContent?.closeDialog();
            }}
          >
            <span className="block min-width-3">Nein</span>
          </Button>
        </div>
      </div>
    </Dialog>
  );
}
