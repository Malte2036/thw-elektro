import { memo } from "react";
import {
  getRectOfNodes,
  NodeProps,
  NodeToolbar,
  useStore,
  NodeResizer,
} from "reactflow";

//import useDetachNodes from "./useDetachNodes";

const lineStyle = { borderColor: "white" };
const padding = 25;

function InternalGroupNode({ id }: NodeProps) {
  //const store = useStoreApi();
  //const { deleteElements } = useReactFlow();
  //const detachNodes = useDetachNodes();
  const { minWidth, minHeight, hasChildNodes } = useStore((store) => {
    const childNodes = Array.from(store.nodeInternals.values()).filter(
      (n) => n.parentNode === id
    );
    const rect = getRectOfNodes(childNodes);

    return {
      minWidth: rect.width + padding * 2,
      minHeight: rect.height + padding * 2,
      hasChildNodes: childNodes.length > 0,
    };
  }, isEqual);

  const onDelete = () => {
    console.log("delete");

    //deleteElements({ nodes: [{ id }] });
  };

  const onDetach = () => {
    console.log("detach");

    /*const childNodeIds = Array.from(store.getState().nodeInternals.values())
      .filter((n) => n.parentNode === id)
      .map((n) => n.id);

    detachNodes(childNodeIds, id);*/
  };

  return (
    <div style={{ minWidth, minHeight }} className="bg-thw-100">
      <NodeResizer
        lineStyle={lineStyle}
        minWidth={minWidth}
        minHeight={minHeight}
      />
      <NodeToolbar className="nodrag">
        <button onClick={onDelete}>Delete</button>
        {hasChildNodes && <button onClick={onDetach}>Ungroup</button>}
      </NodeToolbar>
    </div>
  );
}

type IsEqualCompareObj = {
  minWidth: number;
  minHeight: number;
  hasChildNodes: boolean;
};

function isEqual(prev: IsEqualCompareObj, next: IsEqualCompareObj): boolean {
  return (
    prev.minWidth === next.minWidth &&
    prev.minHeight === next.minHeight &&
    prev.hasChildNodes === next.hasChildNodes
  );
}

const GroupNode = memo(InternalGroupNode);

export default GroupNode;
