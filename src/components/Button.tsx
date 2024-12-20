import React, { ReactNode } from "react";
import { createComponent } from "@lit/react";
import { THWButton } from "@malte2036/thw-tools-components";

const THWButtonComponent = createComponent({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  elementClass: THWButton as any,
  react: React,
  tagName: "thw-button",
  displayName: "THWButton",
});

type ButtonProps = {
  children: ReactNode;
  type: "primary" | "secondary";
  size?: "small" | "medium" | "large";
  onClick: () => void;
  disabled?: boolean;
};

export default function Button(props: ButtonProps) {
  const buttonProps = {
    type: props.type ?? "primary",
    disabled: props.disabled ?? false,
    size: props.size ?? "medium",
    onClick: props.onClick,
  };

  return (
    <THWButtonComponent {...buttonProps}>{props.children}</THWButtonComponent>
  );
}
