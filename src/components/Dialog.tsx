import { ReactNode, useRef } from "react";
import { useDialogContext } from "../hooks/useDialog";

type DialogProps = {
  header: string;
  children: ReactNode,
};

export default function Dialog({ header, children }: DialogProps) {
  const dialogContext = useDialogContext();

  const outerDivRef = useRef<HTMLDivElement>(null);

  const handleOuterDivClick = (event: React.MouseEvent<HTMLDivElement>) => {
    // Check if the clicked target is the outerDiv itself or its children
    if (
      event.target === outerDivRef.current ||
      !isDescendant(outerDivRef.current, event.target as HTMLElement)
    ) {
      // Handle click on the outerDiv here
      dialogContext?.closeDialog();
    }
  };

  const isDescendant = (
    parent: HTMLElement | null,
    child: HTMLElement
  ): boolean => {
    let node: HTMLElement | null = child.parentElement;
    while (node !== null) {
      if (node === parent) {
        return true;
      }
      node = node.parentElement;
    }
    return false;
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80"
      ref={outerDivRef}
      onClick={handleOuterDivClick}
    >
      <div className="relative p-4 bg-white rounded-md shadow-md flex flex-col gap-2 max-w-md m-4 max-h-screen overflow-scroll">
        <div className="text-2xl text-thw font-bold">{header}</div>

        {children}
      </div>
    </div>
  );
}
