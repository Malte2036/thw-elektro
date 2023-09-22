import { ReactNode } from "react";

type ButtonProps = {
  children: ReactNode;
  type: "primary" | "secondary";
  onClick: () => void;
  disabled?: boolean;
};

export default function Button({
  children,
  type,
  onClick,
  disabled,
}: ButtonProps) {
  return (
    <thw-button type={type} onClick={onClick} disabled={disabled}>
      {children}
    </thw-button>
  );
}
