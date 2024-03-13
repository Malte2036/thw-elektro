import React, { ReactNode } from "react";
import { createComponent } from "@lit/react";
import { THWButton } from "@malte2036/thw-tools-components";

const THWButtonComponent = createComponent({
  elementClass: THWButton,
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

export default function Button({
  children,
  type,
  size,
  onClick,
  disabled,
}: ButtonProps) {
  return (
    <THWButtonComponent
      type={type}
      disabled={disabled ?? false}
      size={size ?? "medium"}
      onClick={onClick}
    >
      {children}
    </THWButtonComponent>
  );
}
