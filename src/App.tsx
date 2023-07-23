import { useEffect, useMemo, useState } from "react";
import * as ReactFlow from "reactflow";

import "reactflow/dist/style.css";
import { Consumer } from "./lib/data/Consumer";
import { Producer } from "./lib/data/Producer";
import CableEdge from "./components/flow/CableEdge";
import { Cable } from "./lib/data/Cable";
import {
  calculateTotalVoltageDropPercent,
  getRecursiveEnergyConsumption,
  getVoltageDropForCableData,
} from "./lib/calculation/energy";
import { Distributor } from "./lib/data/Distributor";

import useStore, { RFState } from "./components/flow/store";
import { shallow } from "zustand/shallow";
import FlowMenu from "./components/flow/FlowMenu";
import {
  ElectroInterface,
  ElectroInterfaceWithInputPlug,
} from "./lib/data/Electro";
import {
  ElectroInterfaceNode,
  ElectroInterfaceNodeProps,
} from "./components/flow/ElectroInterfaceNode";
import { Button } from "./components/Button";

const selector = (state: RFState) => ({
  nodes: state.nodes,
  edges: state.edges,
  onNodesChange: state.onNodesChange,
  onEdgesChange: state.onEdgesChange,
  removeNode: state.removeNode,
  removeEdge: state.removeEdge,
  addCableEdge: state.addCableEdge,
  updateCableEdge: state.updateCableEdge,
  addElectroInterfaceNode: state.addElectroInterfaceNode,
  updateElectroInterfaceNode: state.updateElectroInterfaceNode,
  deleteAll: state.deleteAll,
});

export default function FlowPage() {
  const [showMenu, setShowMenu] = useState<boolean>(false);

  const nodeTypes = useMemo(
    () => ({
      electroInterfaceNode: ElectroInterfaceNode,
    }),
    []
  );
  const edgeTypes = useMemo(() => ({ cableEdge: CableEdge }), []);

  const initialElectroInterfaceNodes = [
    new Consumer(
      "consumer-1",
      undefined,
      { x: 550, y: 100 },
      1500,
      undefined,
      undefined
    ),
    new Consumer(
      "consumer-2",
      undefined,
      { x: 550, y: 300 },
      800,
      undefined,
      undefined
    ),
    new Consumer(
      "consumer-3",
      undefined,
      { x: 550, y: 500 },
      1800,
      undefined,
      undefined
    ),
    new Distributor(
      "distributor-1",
      undefined,
      { x: 300, y: 200 },
      undefined,
      undefined
    ),
    new Distributor(
      "distributor-2",
      undefined,
      { x: 300, y: 400 },
      undefined,
      undefined
    ),
    new Producer("producer-1", "SEA", { x: 50, y: 300 }, undefined, 50000),
  ];

  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    removeNode,
    removeEdge,
    addCableEdge,
    updateCableEdge,
    addElectroInterfaceNode,
    updateElectroInterfaceNode,
    deleteAll,
  } = useStore(selector, shallow);

  function getAllElectro(): ElectroInterface[] {
    return (nodes as ReactFlow.Node[])
      .filter((n) => n.type == "electroInterfaceNode")
      .map((n) => n.data.electroInterface) as ElectroInterface[];
  }

  // bug fix (replace later with a better solution)
  // need to force rerender to trigger recalculation. Just invert the value
  const [recalculateFlip, setRecalculateFlip] = useState<boolean>(false);

  function getAllCables(): Cable[] {
    return (edges as ReactFlow.Edge[])
      .filter((e) => e.type == "cableEdge")
      .map((e) => e.data.cable) as Cable[];
  }

  function createInitialNodes() {
    if (nodes.length > 0) {
      console.log("nodes already exist");
      return;
    }

    initialElectroInterfaceNodes.forEach((electro) => {
      addElectroInterfaceNode(electro, () => {
        removeNode(electro.id);
        setRecalculateFlip((state) => !state);
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
      const voltageDrop = voltageDrops.get(c.toTargetSourceString()) ?? 0;
      if (voltageDrop == c.voltageDrop) return;

      c.voltageDrop = voltageDrop;

      updateCableEdge(c);
    });
  }

  useEffect(() => {
    recalculate();
  }, [recalculateFlip]);

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
          addCableEdge(
            connection,
            (cable: Cable) => {
              cable.nextLength();

              updateCableEdge(cable);
              setRecalculateFlip((state) => !state);
            },
            (cable: Cable) => {
              cable.nextPlug();

              updateCableEdge(cable);

              const targetNode = nodes.find((n) => n.id == cable.target);
              if (targetNode) {
                const electroInterface = (
                  targetNode.data as ElectroInterfaceNodeProps
                ).electroInterface;
                if (electroInterface.type != "Producer") {
                  const electroInterfaceWithPlug =
                    electroInterface as ElectroInterfaceWithInputPlug;
                  electroInterfaceWithPlug.inputPlug = cable.plug;
                  updateElectroInterfaceNode(electroInterfaceWithPlug);
                }
              }

              setRecalculateFlip((state) => !state);
            },
            (cable: Cable) => {
              removeEdge(cable.id);
              setRecalculateFlip((state) => !state);
            },
            0
          );
          setRecalculateFlip((state) => !state);
        }}
        fitView
      >
        <ReactFlow.Background />
        <ReactFlow.Controls />
        <ReactFlow.Panel position="top-right">
          <div className="flex flex-col gap-2">
            <Button
              type="primary"
              onClick={() => setShowMenu((state) => !state)}
            >
              {showMenu ? "Close" : "Open"} Menu
            </Button>
            {nodes.length > 0 && (
              <Button
                type="secondary"
                onClick={() => {
                  const confirmed = confirm(
                    "Bist du sicher, dass du alle Nodes löschen möchtest?"
                  );
                  if (!confirmed) return;

                  deleteAll();
                }}
              >
                Clear
              </Button>
            )}
          </div>
        </ReactFlow.Panel>
      </ReactFlow.ReactFlow>
      {showMenu ? (
        <div className="w-screen h-screen flowmenu-small-width absolute md:relative ">
          {
            <FlowMenu
              allPlacedNodeTemplateIds={
                nodes
                  .map(
                    (n) =>
                      (n.data as ElectroInterfaceNodeProps).electroInterface
                        .templateId
                  )
                  .filter((id) => id != undefined) as string[]
              }
              addElectroInterfaceNodeCallback={(electro: ElectroInterface) => {
                addElectroInterfaceNode(electro, () => {
                  removeNode(electro.id);
                  setRecalculateFlip((state) => !state);
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
