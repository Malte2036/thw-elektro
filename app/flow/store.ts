import { create } from "zustand";
import {
  Connection,
  Edge,
  EdgeChange,
  Node,
  NodeChange,
  addEdge,
  OnNodesChange,
  OnEdgesChange,
  applyNodeChanges,
  applyEdgeChanges,
} from "reactflow";
import { CableData, isCircularConnection } from "../lib/calculation/energy";
import { Cable } from "../lib/data/Cable";
import { ElectroInterface } from "../lib/data/Electro";

export type RFState = {
  nodes: Node[];
  edges: Edge[];
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  removeNode: (id: string) => void;
  addCableDataEdge: (
    connection: Connection,
    onClickCallback: (cable: Cable) => void,
    voltageDrop: number
  ) => CableData | undefined;
  updateCableDataEdge: (cable: Cable, voltageDrop: number) => void;
  addElectroInterfaceNode: (
    electroInterface: ElectroInterface,
    deleteNode: () => void
  ) => void;
  updateElectroInterfaceNode: (electroInterface: ElectroInterface) => void;
};

// this is our useStore hook that we can use in our components to get parts of the store and call actions
const useStore = create<RFState>((set, get) => ({
  nodes: [],
  edges: [],
  onNodesChange: (changes: NodeChange[]) => {
    set({
      nodes: applyNodeChanges(changes, get().nodes),
    });
  },
  onEdgesChange: (changes: EdgeChange[]) => {
    set({
      edges: applyEdgeChanges(changes, get().edges),
    });
  },
  removeNode: (id: string) => {
    set({
      nodes: get().nodes.filter((node) => node.id !== id),
    });
  },
  addCableDataEdge: (
    connection: Connection,
    onClickCallback: (cable: Cable) => void,
    voltageDrop: number
  ): CableData | undefined => {
    if (!connection.source || !connection.target) return;

    // Check for circular connection
    if (isCircularConnection(connection, get().edges)) {
      console.log("Circular connection detected");
      alert("Circular connection detected");
      return;
    }

    // Check if the edge already exists
    if (
      get().edges.find(
        (edge) =>
          edge.source === connection.source && edge.target === connection.target
      )
    ) {
      console.log("Edge already exists");
      alert("Edge already exists");
      return;
    }

    // Check if node does not already has an input edge
    if (get().edges.find((edge) => edge.target === connection.target)) {
      console.log("Node already has an input edge");
      alert("Node already has an input edge");
      return;
    }
    const cableData = new CableData(
      new Cable(
        "cable-" + Math.floor(Math.random() * 1_000_000),
        50,
        connection.source.includes("producer-") ? 400 : 230,
        16
      ),
      connection.source,
      connection.target
    );
    const cableNode: Edge = {
      id: cableData.cable.id,
      source: cableData.source,
      sourceHandle: "output",
      target: cableData.target,
      targetHandle: "input",
      animated: true,
      type: "cableEdge",
      data: {
        cable: cableData.cable,
        voltageDrop,
        onClickCallback,
      },
    };
    set({
      edges: addEdge(cableNode, get().edges),
    });
    return cableData;
  },
  updateCableDataEdge(cable: Cable, voltageDrop: number) {
    set({
      edges: get().edges.map((edge) => {
        if (edge.id === cable.id) {
          edge.data = {
            ...edge.data,
            cable,
            voltageDrop,
          };
        }
        return edge;
      }),
    });
  },
  addElectroInterfaceNode: (
    electroInterface: ElectroInterface,
    deleteNode: () => void
  ) => {
    const electroInterfaceNode = {
      id: electroInterface.id,
      type: "electroInterfaceNode",
      position: electroInterface.position,
      data: {
        electroInterface,
        deleteNode,
      },
      draggable: true,
    };
    set({
      nodes: [...get().nodes, electroInterfaceNode],
    });
  },
  updateElectroInterfaceNode: (electroInterface: ElectroInterface) => {
    set({
      nodes: get().nodes.map((node) => {
        if (node.id === electroInterface.id) {
          node.data = {
            ...node.data,
            electroInterface,
          };
        }
        return node;
      }),
    });
  },
}));

export default useStore;
