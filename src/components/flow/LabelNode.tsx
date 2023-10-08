import { NodeProps } from "reactflow";

export type LabelNodeProps = {
  label: string;
};

export function LabelNode({ data }: NodeProps<LabelNodeProps>) {
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="text-lg">{data.label}</div>
    </div>
  );
}
