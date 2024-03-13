import FlowPage from "./FlowPage";
import React, { ReactNode, useState } from "react";
import { DialogContext } from "./hooks/useDialog";
import { Helmet } from "react-helmet";
import { RecalculateFlipProvider } from "./components/flow/recalculateFlipContext";

export default function App() {
  const [dialog, setDialog] = useState<ReactNode | undefined>();

  return (
    <>
      <Helmet>
        <script
          async
          defer
          data-website-id={import.meta.env.VITE_UMAMI_WEBSITEID ?? ""}
          src={import.meta.env.VITE_UMAMI_ENDPOINT ?? ""}
        ></script>
      </Helmet>
      <RecalculateFlipProvider>
        <DialogContext.Provider
          value={{
            setDialog,
            closeDialog: () => setDialog(undefined),
          }}
        >
          <FlowPage />
          {dialog}
        </DialogContext.Provider>
      </RecalculateFlipProvider>
    </>
  );
}
