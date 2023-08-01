type FlowMenuItemProps = {
  children: React.ReactNode;
  className?: string;
};

export default function FlowMenuItem({
  children,
  className,
}: FlowMenuItemProps) {
  return (
    <div
      className={`w-full bg-white text-thw rounded-md p-4 flex flex-col gap-2 items-start ${
        className ?? ""
      }`}
    >
      {children}
    </div>
  );
}
