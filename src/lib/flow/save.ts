import * as ReactFlow from "reactflow";
import { Consumer } from "../data/Consumer";
import { ElectroInterface } from "../data/Electro";
import { Distributor } from "../data/Distributor";
import { Producer } from "../data/Producer";
import { Cable } from "../data/Cable";

export function restoreFlow(
  data: ReactFlow.ReactFlowJsonObject,
  setNodes: (nodes: ReactFlow.Node[]) => void,
  setEdges: (edges: ReactFlow.Edge[]) => void
) {
  const convertedNodes = data.nodes
    .map((node) => ({
      ...node,
      data: {
        ...node.data,
        electroInterface: jsonElectroInterfaceToElectroInterface(
          node.data.electroInterface
        ),
      },
    }))
    .filter((n) => n !== undefined) as ReactFlow.Node[];

  const convertedEdges = data.edges.map((edge) => ({
    ...edge,
    data: {
      ...edge.data,
      cable: Cable.fromJSON(edge.data.cable),
    },
  }));

  setNodes(convertedNodes);
  setEdges(convertedEdges);
}

function jsonElectroInterfaceToElectroInterface(json: any): ElectroInterface {
  switch (json.type) {
    case "Consumer":
      return Consumer.fromJSON(json);
    case "Distributor":
      return Distributor.fromJSON(json);
    case "Producer":
      return Producer.fromJSON(json);
    default:
      throw new Error(`Unknown ElectroInterface type: ${json.type}`);
  }
}
