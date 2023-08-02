import { ReactNode } from "react";

type ButtonProps = {
  children: ReactNode;
  type: "primary" | "secondary";
  onClick: () => void;
  disabled?: boolean;
};

export default function Button({ children, type, onClick, disabled }: ButtonProps) {
  return (
    <button
      className={`${type == "primary"
        ? "bg-thw text-white hover:bg-thw-800"
        : "border-2 border-thw bg-white hover:bg-thw-100 text-thw disabled:text-gray-400 disabled:border-gray-400"
        } rounded-md px-2 py-1`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
