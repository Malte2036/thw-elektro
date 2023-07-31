import { useState } from "react";

type DialogProps = {
  initialIsOpen: boolean;
};

export default function useDialog({ initialIsOpen }: DialogProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(initialIsOpen);

  const openDialog = () => {
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
  };

  return { isDialogOpen, openDialog, closeDialog };
}
