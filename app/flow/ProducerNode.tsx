import { Handle, Position } from "reactflow";
import { Producer } from "../lib/data/Producer";

export function ProducerNode({ data }: { data: { producer: Producer } }) {
  return (
    <>
      <div className="bg-thw text-white px-6 py-2">
        <div className="text-xs">Erzeuger (SEA):</div>
        {data.producer.energyProduction}kW
      </div>
      <Handle type="source" position={Position.Right} id="output" />
    </>
  );
}
