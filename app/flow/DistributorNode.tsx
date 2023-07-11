import { Handle, Position } from "reactflow";
import { Distributor } from "../lib/data/Distributor";

export function DistributorNode({
  data,
}: {
  data: { distributor: Distributor; energyFlow: number; hasEnergy: boolean };
}) {
  return (
    <div>
      <div
        className={`${
          data.hasEnergy ? "bg-thw" : "bg-thw-400"
        } transition-colors text-white px-6 py-2 rounded-sm`}
      >
        <div className="text-xs">Verteiler:</div>
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
