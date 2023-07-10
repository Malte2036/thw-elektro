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
import { ConsumerData, DistributorData, ProducerData } from "./page";
import { Cable } from "../lib/data/Cable";

type RFState = {
  nodes: Node[];
  edges: Edge[];
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  addCableDataEdge: (
    connection: Connection,
    onClickCallback: (cableData: CableData) => void,
    voltageDrop: number
  ) => CableData | undefined;
  updateCableDataEdge: (cable: Cable, voltageDrop: number) => void;
  addProducerDataNode: (producerData: ProducerData, energyFlow: number) => void;
  updateProducerDataNode: (
    producerData: ProducerData,
    energyFlow: number
  ) => void;
  addDistributorDataNode: (
    distributorData: DistributorData,
    energyFlow: number,
    hasEnergy: boolean
  ) => void;
  updateDistributorDataNode: (
    distributorData: DistributorData,
    energyFlow: number,
    hasEnergy: boolean
  ) => void;
  addConsumerDataNode: (
    consumerData: ConsumerData,
    hasEnergy: boolean,
    totalVoltageDrop: number
  ) => void;
  updateConsumerDataNode: (
    consumerData: ConsumerData,
    hasEnergy: boolean,
    totalVoltageDrop: number
  ) => void;
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
  addCableDataEdge: (
    connection: Connection,
    onClickCallback: (cableData: CableData) => void,
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
        connection.source == "SEA" ? 400 : 230,
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
  addProducerDataNode: (producerData: ProducerData, energyFlow: number) => {
    const producerNode = {
      id: producerData.producer.id,
      type: "producerNode",
      position: producerData.position,
      data: {
        producer: producerData.producer,
        energyFlow: energyFlow,
      },
      draggable: true,
    };
    set({
      nodes: [...get().nodes, producerNode],
    });
  },
  updateProducerDataNode: (producerData: ProducerData, energyFlow: number) => {
    set({
      nodes: get().nodes.map((node) => {
        if (node.id === producerData.producer.id) {
          node.data = {
            producer: producerData.producer,
            energyFlow,
          };
        }
        return node;
      }),
    });
  },
  addDistributorDataNode: (
    distributorData: DistributorData,
    energyFlow: number,
    hasEnergy: boolean
  ) => {
    const distributorNode = {
      id: distributorData.distributor.id,
      type: "distributorNode",
      position: distributorData.position,
      data: {
        distributor: distributorData.distributor,
        energyFlow,
        hasEnergy,
      },
      draggable: true,
    };
    set({
      nodes: [...get().nodes, distributorNode],
    });
  },
  updateDistributorDataNode: (
    distributorData: DistributorData,
    energyFlow: number,
    hasEnergy: boolean
  ) => {
    set({
      nodes: get().nodes.map((node) => {
        if (node.id === distributorData.distributor.id) {
          node.data = {
            distributor: distributorData.distributor,
            energyFlow,
            hasEnergy,
          };
        }
        return node;
      }),
    });
  },
  addConsumerDataNode: (
    consumerData: ConsumerData,
    hasEnergy: boolean,
    totalVoltageDrop: number
  ) => {
    const consumerNode = {
      id: consumerData.consumer.id,
      type: "consumerNode",
      position: consumerData.position,
      data: {
        consumer: consumerData.consumer,
        hasEnergy,
        totalVoltageDrop,
      },
      draggable: true,
    };
    set({
      nodes: [...get().nodes, consumerNode],
    });
  },
  updateConsumerDataNode: (
    consumerData: ConsumerData,
    hasEnergy: boolean,
    totalVoltageDrop: number
  ) => {
    set({
      nodes: get().nodes.map((node) => {
        if (node.id === consumerData.consumer.id) {
          node.data = {
            consumer: consumerData.consumer,
            hasEnergy,
            totalVoltageDrop,
          };
        }
        return node;
      }),
    });
  },
}));

export default useStore;
