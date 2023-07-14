"use client";

import React, { useEffect, useMemo, useState } from "react";
import * as ReactFlow from "reactflow";

import "reactflow/dist/style.css";
import { Consumer } from "../lib/data/Consumer";
import { ConsumerNode } from "./ConsumerNode";
import { ProducerNode } from "./ProducerNode";
import { Producer } from "../lib/data/Producer";
import CableEdge from "./CableEdge";
import { Cable, getNextCableLength } from "../lib/data/Cable";
import {
  calculateTotalVoltageDropPercent,
  getRecursiveEnergyConsumption,
  getVoltageDropForCableData,
} from "../lib/calculation/energy";
import { DistributorNode } from "./DistributorNode";
import { Distributor } from "../lib/data/Distributor";
import { toTargetSourceString } from "../lib/utils";

import useStore, { RFState } from "./store";
import { shallow } from "zustand/shallow";
import FlowMenu from "./FlowMenu";
import { ElectroInterface } from "../lib/data/Electro";
import { ElectroInterfaceNode } from "./ElectroInterfaceNode";

const selector = (state: RFState) => ({
  nodes: state.nodes,
  edges: state.edges,
  onNodesChange: state.onNodesChange,
  onEdgesChange: state.onEdgesChange,
  removeNode: state.removeNode,
  addCableEdge: state.addCableEdge,
  updateCableEdge: state.updateCableEdge,
  addElectroInterfaceNode: state.addElectroInterfaceNode,
  updateElectroInterfaceNode: state.updateElectroInterfaceNode,
});

export default function FlowPage() {
  const [showMenu, setShowMenu] = useState<boolean>(false);

  const nodeTypes = useMemo(
    () => ({
      consumerNode: ConsumerNode,
      producerNode: ProducerNode,
      distributorNode: DistributorNode,
      electroInterfaceNode: ElectroInterfaceNode,
    }),
    []
  );
  const edgeTypes = useMemo(() => ({ cableEdge: CableEdge }), []);

  const [selectedNodeId, setSelectedNodeId] = useState<string | undefined>(
    undefined
  );

  const initialElectroInterfaceNodes = [
    new Consumer("consumer-1", undefined, { x: 550, y: 100 }, 1500),
    new Consumer("consumer-2", undefined, { x: 550, y: 300 }, 800),
    new Consumer("consumer-3", undefined, { x: 550, y: 500 }, 1800),
    new Distributor("distributor-1", undefined, { x: 300, y: 200 }),
    new Distributor("distributor-2", undefined, { x: 300, y: 400 }),
    new Producer("producer-1", "SEA", { x: 50, y: 300 }),
  ];

  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    removeNode,
    addCableEdge: addCableDataEdge,
    updateCableEdge: updateCableDataEdge,
    addElectroInterfaceNode,
    updateElectroInterfaceNode,
  } = useStore(selector, shallow);

  function getAllElectro(): ElectroInterface[] {
    return (nodes as ReactFlow.Node[])
      .filter((n) => n.type == "electroInterfaceNode")
      .map((n) => n.data.electroInterface) as ElectroInterface[];
  }

  // bug fix (replace later with a better solution)
  // edges does not update correctly when adding a new cable, so we need to keep track of it ourselves...
  const [cablesBugFix, setCablesBugFix] = useState<Cable[]>([]);

  function getAllCables(): Cable[] {
    //return (edges as ReactFlow.Edge[])
    //  .filter((e) => e.type == "cableEdge")
    //  .map((e) => e.data.cable) as Cable[];
    return cablesBugFix;
  }

  function createInitialNodes() {
    if (nodes.length > 0) {
      console.log("nodes already exist");
      return;
    }

    initialElectroInterfaceNodes.forEach((electro) => {
      addElectroInterfaceNode(electro, () => {
        removeNode(electro.id);
      });
    });
    recalculate();
  }

  function getEnergyConsumptions(): Map<string, number> {
    const allElectro = getAllElectro();
    const allCables = getAllCables();

    const allEnergyConsumptions = getRecursiveEnergyConsumption(
      allElectro,
      allCables,
      allElectro.filter((e) => e.type == "Producer").map((p) => p.id) ?? []
    );

    return allEnergyConsumptions;
  }

  function getVoltageDrops(
    currentAllEnergyConsumptions: Map<string, number>
  ): Map<string, number> {
    const allElectro = getAllElectro();
    const allCable = getAllCables();

    const voltageDrops = new Map();

    allCable.forEach((c) => {
      let voltageDrop = getVoltageDropForCableData(
        allElectro,
        currentAllEnergyConsumptions,
        c
      );
      voltageDrops.set(c.toTargetSourceString(), voltageDrop);
    });

    return voltageDrops;
  }

  useEffect(() => {
    createInitialNodes();
  }, []);

  function recalculate() {
    console.log(
      "recalculate",
      `found ${nodes.length} nodes`,
      `found ${edges.length} edges`
    );

    const allEnergyConsumptions = getEnergyConsumptions();
    const voltageDrops = getVoltageDrops(allEnergyConsumptions);

    const allElectro = getAllElectro();
    const allCables = getAllCables();

    allElectro.forEach((electro) => {
      switch (electro.type) {
        case "Consumer":
          const consumer = electro as Consumer;
          consumer.hasEnergy = allEnergyConsumptions.has(consumer.id);
          consumer.totalVoltageDrop = calculateTotalVoltageDropPercent(
            allCables,
            voltageDrops,
            consumer.id
          );
          break;
        case "Distributor":
          const distributor = electro as Distributor;
          distributor.energyFlow = allEnergyConsumptions.get(electro.id) ?? 0;
          distributor.hasEnergy = allEnergyConsumptions.has(distributor.id);
          break;
        case "Producer":
          const producer = electro as Producer;
          producer.energyFlow = allEnergyConsumptions.get(producer.id) ?? 0;
          break;
      }

      updateElectroInterfaceNode(electro);
    });

    allCables.forEach((c) => {
      c.voltageDrop = voltageDrops.get(c.toTargetSourceString()) ?? 0;

      updateCableDataEdge(c);
    });
  }

  useEffect(() => {
    recalculate();
  }, [cablesBugFix]);

  useEffect(() => {
    const newCables = edges
      .filter((e) => e.type == "cableEdge")
      .map((e) => e.data.cable) as Cable[];

    const changes =
      newCables.map((c) => c.id).toString() !=
      cablesBugFix.map((c) => c.id).toString();
    if (!changes) return;

    setCablesBugFix(newCables);
  }, [edges]);

  return (
    <div className="w-screen h-screen flex flex-row">
      <ReactFlow.ReactFlow
        nodeTypes={nodeTypes}
        nodes={nodes}
        edgeTypes={edgeTypes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={(connection) => {
          addCableDataEdge(
            connection,
            (cable: Cable) => {
              cable.length = getNextCableLength(cable.length);
              updateCableDataEdge(cable);
            },
            0
          );
          console.log("end");
          recalculate();
        }}
        onNodeClick={(event, node) => {
          setSelectedNodeId(node.id);
        }}
        fitView
      >
        <ReactFlow.Background />
        <ReactFlow.Controls />
        <ReactFlow.Panel position="top-right">
          <button
            className="bg-thw text-white rounded-md p-2"
            onClick={() => setShowMenu((state) => !state)}
          >
            {showMenu ? "Close" : "Open"} Menu
          </button>
        </ReactFlow.Panel>
      </ReactFlow.ReactFlow>
      {showMenu ? (
        <div className="w-screen h-screen xl:w-96 absolute md:relative ">
          {
            <FlowMenu
              addElectroInterfaceNodeCallback={(electro: ElectroInterface) => {
                addElectroInterfaceNode(electro, () => {
                  removeNode(electro.id);
                });
              }}
              closeMenu={() => setShowMenu(false)}
            />
          }
        </div>
      ) : undefined}
    </div>
  );
}
