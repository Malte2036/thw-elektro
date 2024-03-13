import { createComponent } from "@lit/react";
import { THWDialog } from "@malte2036/thw-tools-components";
import React, { ReactNode } from "react";

const THWDialogComponent = createComponent({
  elementClass: THWDialog,
  react: React,
  tagName: "thw-dialog",
  displayName: "THWDialog",
});

type DialogProps = {
  title: string;
  children: ReactNode;
  footer?: ReactNode;
};

export default function Dialog({ title, children, footer }: DialogProps) {
  return (
    <THWDialogComponent title={title}>
      <slot slot="content">{children}</slot>
      {footer && <slot slot="footer">{footer}</slot>}
    </THWDialogComponent>
  );
}
