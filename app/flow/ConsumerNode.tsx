import { Handle, Position } from "reactflow";
import { Consumer } from "../lib/data/Consumer";

export function ConsumerNode({ data }: { data: { consumer: Consumer } }) {
  return (
    <div>
      <div className="bg-thw text-white px-6 py-2">
        <div className="text-xs">Verbraucher:</div>
        {data.consumer.energyConsumption}kW
      </div>
      <Handle
        type="target"
        position={Position.Left}
        id="input"
        style={{ width: 12, height: 12 }}
      />
    </div>
  );
}
