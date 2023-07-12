import { Handle, NodeProps, NodeToolbar, Position } from "reactflow";
import { Producer } from "../lib/data/Producer";

type ProducerNodeProps = {
  producer: Producer;
  energyFlow: number;
  deleteNode: () => void;
};

export function ProducerNode({ data, selected }: NodeProps<ProducerNodeProps>) {
  return (
    <>
      <NodeToolbar isVisible={selected}>
        <button
          className="border-2 rounded-md border-thw bg-white p-1"
          onClick={data.deleteNode}
        >
          Delete
        </button>
      </NodeToolbar>
      <div className="bg-thw text-white px-6 py-2 rounded-sm">
        <div className="text-xs">
          Erzeuger
          {data?.producer.name != undefined ? ` (${data.producer.name})` : ""}:
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
