import { Handle, Position } from "reactflow";
import { Producer } from "../lib/data/Producer";
import { getNodeNameById } from "../lib/utils";

export function ProducerNode({
  data,
}: {
  data: { producer: Producer; energyFlow: number };
}) {
  const nodeName = getNodeNameById(data.producer.id, "producer");
  return (
    <>
      <div className="bg-thw text-white px-6 py-2 rounded-sm">
        <div className="text-xs">
          Erzeuger{nodeName.length > 0 ? ` (${nodeName})` : ""}:
        </div>
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
