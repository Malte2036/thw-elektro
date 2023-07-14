import { ReactNode } from "react";

type ButtonProps = {
  children: ReactNode;
  type: "primary" | "secondary";
  onClick: () => void;
};

export function Button({ children, type, onClick }: ButtonProps) {
  return (
    <button
      className={`${
        type == "primary" ? "bg-thw text-white" : "border-2 border-thw bg-white"
      } rounded-md px-2 py-1`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
