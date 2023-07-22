type FlowMenuItemProps = {
  children: React.ReactNode;
};

export default function FlowMenuItem({ children }: FlowMenuItemProps) {
  return (
    <div className="w-full bg-white text-thw rounded-md p-4 flex flex-col gap-2 items-start">
      {children}
    </div>
  );
}
