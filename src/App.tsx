import { inject } from "@vercel/analytics";
import FlowPage from "./FlowPage";
import { ReactNode, useEffect, useState } from "react";
import { DialogContext } from "./hooks/useDialog";

export default function App() {

  useEffect(() => {
    inject();
  }, []);

  const [dialog, setDialog] = useState<ReactNode | undefined>();

  return <DialogContext.Provider value={{
    setDialog,
    closeDialog: () => setDialog(undefined)
  }}>
    <FlowPage />
    {dialog}
  </DialogContext.Provider>
};
