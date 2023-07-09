import {
  BaseEdge,
  EdgeLabelRenderer,
  EdgeProps,
  getBezierPath,
} from "reactflow";
import { Cable } from "../lib/data/Cable";

export type CableEdgeData = {
  cable: Cable;
  onClickCallback: () => void;
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
          className="nodrag nopan"
        >
          <button
            className="edgebutton bg-white border-black border-2 rounded-md  px-1 py-0.5"
            onClick={() => edgeProps.data?.onClickCallback()}
          >
            {edgeProps.data?.cable.length}m
          </button>
        </div>
      </EdgeLabelRenderer>
    </>
  );
}
