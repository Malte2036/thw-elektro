import { Handle, NodeProps, NodeToolbar, Position } from "reactflow";
import { Distributor } from "../lib/data/Distributor";

type DistributorNodeProps = {
  distributor: Distributor;
  energyFlow: number;
  hasEnergy: boolean;
  deleteNode: () => void;
};

export function DistributorNode({
  data,
  selected,
}: NodeProps<DistributorNodeProps>) {
  return (
    <div>
      <NodeToolbar isVisible={selected}>
        <button
          className="border-2 rounded-md border-thw bg-white p-1"
          onClick={data.deleteNode}
        >
          Delete
        </button>
      </NodeToolbar>
      <div
        className={`${
          data.hasEnergy ? "bg-thw" : "bg-thw-400"
        } transition-colors text-white px-6 py-2 rounded-sm`}
      >
        <div className="text-xs">
          Verteiler
          {data?.distributor.name != undefined
            ? ` (${data.distributor.name})`
            : ""}
          :
        </div>
        {data.energyFlow / 1000}kW
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
