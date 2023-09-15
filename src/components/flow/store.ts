import { create } from "zustand";
import {
  Connection,
  Edge,
  EdgeChange,
  Node,
  NodeChange,
  OnNodesChange,
  OnEdgesChange,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
} from "reactflow";
import { isCircularConnection } from "../../lib/calculation/energy";
import { Cable } from "../../lib/data/Cable";
import {
  ElectroInterface,
  ElectroInterfaceWithInputPlug,
} from "../../lib/data/Electro";

export type RFState = {
  nodes: Node[];
  edges: Edge[];
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  removeNode: (id: string) => void;
  removeEdge: (id: string) => void;
  addCableEdge: (
    connection: Connection,
    nextLength: (cable: Cable) => void,
    nextType: (cable: Cable) => void,
    deleteEdge: (cable: Cable) => void,
    voltageDrop: number
  ) => void;
  updateCableEdge: (cable: Cable) => void;
  addElectroInterfaceNode: (
    electroInterface: ElectroInterface,
    deleteNode: () => void
  ) => void;
  updateElectroInterfaceNode: (electroInterface: ElectroInterface) => void;
  deleteAll: () => void;
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
      edges: get()
        .edges.filter((edge) => edge.source !== id)
        .filter((edge) => edge.target !== id),
    });
  },
  removeEdge: (id: string) => {
    set({
      edges: get().edges.filter((edge) => edge.id !== id),
    });
  },
  addCableEdge: (
    connection: Connection,
    nextLength: (cable: Cable) => void,
    nextType: (cable: Cable) => void,
    deleteEdge: (cable: Cable) => void,
    voltageDrop: number
  ): void => {
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

    var targetNode = get().nodes.find((node) => node.id === connection.target);
    if (!targetNode) return;

    const cable = new Cable(
      "cable-" + Date.now(),
      50,
      (
        targetNode.data.electroInterface as ElectroInterfaceWithInputPlug
      ).inputPlug,
      connection.source,
      connection.target,
      voltageDrop
    );
    const cableNode: Edge = {
      id: cable.id,
      source: cable.source,
      sourceHandle: "output",
      target: cable.target,
      targetHandle: "input",
      animated: true,
      type: "cableEdge",
      data: {
        cable,
        nextLength,
        nextType,
        deleteEdge,
      },
    };

    set({
      edges: addEdge(cableNode, get().edges),
    });
  },
  updateCableEdge(cable: Cable) {
    set({
      edges: get().edges.map((edge) => {
        if (edge.id === cable.id) {
          edge.data = {
            ...edge.data,
            cable,
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
    const allChildrenEdges = get().edges.filter(
      (edge) => edge.source === electroInterface.id
    );
    const electroInterfaceNode = {
      id: electroInterface.id,
      type: "electroInterfaceNode",
      position: electroInterface.position,
      data: {
        electroInterface,
        deleteNode,
        childrenElectroInterfaces: get()
          .nodes.filter((node) =>
            allChildrenEdges.find((edge) => edge.target === node.id)
          )
          .map((node) => node.data.electroInterface as ElectroInterface),
      },
      draggable: true,
    };
    set({
      nodes: [...get().nodes, electroInterfaceNode],
    });
  },
  updateElectroInterfaceNode: (electroInterface: ElectroInterface) => {
    const allChildrenEdges = get().edges.filter(
      (edge) => edge.source === electroInterface.id
    );
    set({
      nodes: get().nodes.map((node) => {
        if (node.id === electroInterface.id) {
          node.data = {
            ...node.data,
            electroInterface,
            childrenElectroInterfaces: get()
              .nodes.filter((node) =>
                allChildrenEdges.find((edge) => edge.target === node.id)
              )
              .map((node) => node.data.electroInterface as ElectroInterface),
          };
        }
        return node;
      }),
    });
  },
  deleteAll: () => {
    set({
      nodes: [],
      edges: [],
    });
  },
}));

export default useStore;
