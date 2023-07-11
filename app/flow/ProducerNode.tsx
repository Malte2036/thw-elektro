import { Handle, Position } from "reactflow";
import { Producer } from "../lib/data/Producer";

export function ProducerNode({
  data,
}: {
  data: { producer: Producer; energyFlow: number };
}) {
  return (
    <>
      <div className="bg-thw text-white px-6 py-2 rounded-sm">
        <div className="text-xs">Erzeuger ({data.producer.id}):</div>
        {data.energyFlow / 1000}kW
      </div>
      <Handle
        type="source"
        position={Position.Right}
        id="output"
        style={{ width: 12, height: 12 }}
      />
    </>
  );
}
