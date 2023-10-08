import * as ReactFlow from "reactflow";
import { Consumer } from "../data/Consumer";
import { ElectroInterface } from "../data/Electro";
import { Distributor } from "../data/Distributor";
import { Producer } from "../data/Producer";
import { Cable } from "../data/Cable";
import { FlowFunctions } from "../../FlowPage";

export function restoreFlow(
  data: ReactFlow.ReactFlowJsonObject,
  setNodes: (nodes: ReactFlow.Node[]) => void,
  setEdges: (edges: ReactFlow.Edge[]) => void,
  flowFunctions: FlowFunctions
) {
  const convertedNodes = data.nodes
    .map((node) => nodeToParsedNode(node, flowFunctions))
    .filter((n) => n !== undefined) as ReactFlow.Node[];

  const convertedEdges = data.edges.map(
    (edge: ReactFlow.Edge<{ cable: Cable }>) => ({
      ...edge,
      data: {
        ...edge.data,
        ...flowFunctions.addCableEdgeFunctions,
        cable: Cable.fromJSON(edge.data!.cable),
      },
    })
  );

  setNodes(convertedNodes);
  setEdges(convertedEdges);
}

function nodeToParsedNode(node: ReactFlow.Node, flowFunctions: FlowFunctions) {
  let data: ReactFlow.Node["data"];

  switch (node.type) {
    case "electroInterfaceNode":
      data = {
        ...node.data,
        deleteNode: () =>
          flowFunctions.addNodeFunctions.deleteNode(node.data.id),
        electroInterface: jsonElectroInterfaceToElectroInterface(
          node.data.electroInterface
        ),
      };
      break;
    case "labelNode":
      data = node.data;
      break;
    default:
      throw new Error(`Unknown node type: ${node.type}`);
  }

  return {
    ...node,
    data,
  };
}

function jsonElectroInterfaceToElectroInterface(
  json:
    | ({
        type: "Consumer";
      } & Consumer)
    | ({
        type: "Distributor";
      } & Distributor)
    | ({
        type: "Producer";
      } & Producer)
): ElectroInterface {
  switch (json.type) {
    case "Consumer":
      return Consumer.fromJSON(json);
    case "Distributor":
      return Distributor.fromJSON(json);
    case "Producer":
      return Producer.fromJSON(json);
    default:
      throw new Error(`Unknown ElectroInterface type: ${json}`);
  }
}
