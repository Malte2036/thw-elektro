import {
  BaseEdge,
  EdgeLabelRenderer,
  EdgeProps,
  getBezierPath,
} from "reactflow";
import { Cable } from "../lib/data/Cable";
import { isVoltageDropTooHigh } from "../lib/calculation/energy";
import { Button } from "@/components/Button";

export type CableEdgeData = {
  cable: Cable;
  nextLength: (cable: Cable) => void;
  nextType: (cable: Cable) => void;
};

export default function CableEdge(edgeProps: EdgeProps<CableEdgeData>) {
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX: edgeProps.sourceX,
    sourceY: edgeProps.sourceY,
    sourcePosition: edgeProps.sourcePosition,
    targetX: edgeProps.targetX,
    targetY: edgeProps.targetY,
    targetPosition: edgeProps.targetPosition,
  });

  return (
    <>
      <BaseEdge
        path={edgePath}
        markerEnd={edgeProps.markerEnd}
        style={edgeProps.style}
      />
      <EdgeLabelRenderer>
        <div
          style={{
            position: "absolute",
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            fontSize: 12,
            // everything inside EdgeLabelRenderer has no pointer events by default
            // if you have an interactive element, set pointer-events: all
            pointerEvents: "all",
          }}
          className="nodrag nopan flex flex-col gap-1 items-center"
        >
          {edgeProps.selected && (
            <div className="flex flex-row gap-1">
              <Button
                type="secondary"
                onClick={() => edgeProps.data?.nextLength(edgeProps.data.cable)}
              >
                Länge
              </Button>
              <Button
                type="secondary"
                onClick={() => edgeProps.data?.nextType(edgeProps.data.cable)}
              >
                Type
              </Button>
            </div>
          )}
          <div
            className={`edgebutton bg-white ${
              isVoltageDropTooHigh(edgeProps.data?.cable.voltageDrop ?? 0)
                ? "border-red-600 text-red-600 font-bold border-4"
                : "border-black  border-2"
            } rounded-md px-1 py-0.5 flex flex-col items-center justify-center`}
          >
            <div>{edgeProps.data?.cable.length}m</div>
            <div>
              {edgeProps.data?.cable.voltage}V/{edgeProps.data?.cable.current}A
            </div>
            <div>{edgeProps.data?.cable.voltageDrop.toFixed(2)}%</div>
          </div>
        </div>
      </EdgeLabelRenderer>
    </>
  );
}
