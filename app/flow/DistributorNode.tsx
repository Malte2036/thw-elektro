import { Handle, Position } from "reactflow";

export function DistributorNode({ data }: { data: any }) {
  return (
    <div>
      <div className="bg-thw text-white px-6 py-2">
        <div className="text-xs">Verteiler:</div>
      </div>
      <Handle
        type="target"
        position={Position.Left}
        id="input"
        style={{ width: 12, height: 12 }}
      />{" "}
      <Handle
        type="source"
        position={Position.Right}
        id="target"
        style={{ width: 12, height: 12 }}
      />
    </div>
  );
}
