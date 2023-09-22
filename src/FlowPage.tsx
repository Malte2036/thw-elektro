import { useCallback, useEffect, useMemo, useState } from "react";
import * as ReactFlow from "reactflow";

import "reactflow/dist/style.css";
import { Consumer } from "./lib/data/Consumer";
import { Producer } from "./lib/data/Producer";
import CableEdge from "./components/flow/CableEdge";
import { Cable } from "./lib/data/Cable";
import {
  getRecursiveApparentPower,
  getRecursiveEnergyConsumption,
} from "./lib/calculation/energy";
import { Distributor } from "./lib/data/Distributor";

import useStore, { RFState } from "./components/flow/store";
import { shallow } from "zustand/shallow";
import FlowMenu from "./components/flow/menu/FlowMenu";
import {
  ElectroInterface,
  ElectroInterfaceWithInputPlug,
} from "./lib/data/Electro";
import {
  ElectroInterfaceNode,
  ElectroInterfaceNodeProps,
} from "./components/flow/ElectroInterfaceNode";
import { useDialogContext } from "./hooks/useDialog";
import InfoDialog from "./components/InfoDIalog";
import Footer from "./components/Footer";
import ConfirmDialog from "./components/ConfirmDialog";
import Dialog from "./components/Dialog";
import {
  calculateTotalVoltageDropPercent,
  getVoltageDropForCableData,
} from "./lib/calculation/voltageDrop";
import { restoreFlow } from "./lib/flow/save";
import { useRecalculateFlip } from "./components/flow/recalculateFlipContext";

const selector = (state: RFState) => ({
  nodes: state.nodes,
  edges: state.edges,
  setNodes: state.setNodes,
  setEdges: state.setEdges,
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
      "Chiemsee A",
      { x: 700, y: 100 },
      3200,
      7.3,
      undefined,
      { current: 16, voltage: 400 }
    ),
    new Consumer(
      "consumer-2",
      "Mast TP15-1",
      { x: 700, y: 300 },
      5300,
      9.3,
      undefined,
      { current: 16, voltage: 400 }
    ),
    new Consumer(
      "consumer-3",
      "Chiemsee A",
      { x: 700, y: 500 },
      3200,
      7.3,
      undefined,
      { current: 16, voltage: 400 }
    ),
    new Distributor(
      "distributor-1",
      undefined,
      { x: 350, y: 200 },
      undefined,
      undefined
    ),
    new Distributor(
      "distributor-2",
      undefined,
      { x: 350, y: 400 },
      undefined,
      undefined
    ),
    new Producer("producer-1", "SEA", { x: 50, y: 300 }, undefined, 50000),
  ];

  const {
    nodes,
    edges,
    setNodes,
    setEdges,
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

  const [rfInstance, setRfInstance] =
    useState<ReactFlow.ReactFlowInstance | null>(null);

  const FLOW_KEY = "currentFlow";

  const onSave = useCallback(() => {
    if (rfInstance) {
      const flow = rfInstance.toObject();
      localStorage.setItem(FLOW_KEY, JSON.stringify(flow));
    }
  }, [rfInstance]);

  function restoreFlowFromJson(): boolean {
    const item = localStorage.getItem(FLOW_KEY);
    if (!item) return false;

    const flow = JSON.parse(item);
    if (!flow) return false;

    console.log("restore Flow");
    restoreFlow(flow, setNodes, setEdges);

    triggerRecalculation();
    return true;
  }

  function getAllElectro(): ElectroInterface[] {
    return (nodes as ReactFlow.Node[])
      .filter((n) => n.type == "electroInterfaceNode")
      .map((n) => n.data.electroInterface) as ElectroInterface[];
  }

  // bug fix (replace later with a better solution)
  // need to force rerender to trigger recalculation. Just change the value
  const { flip: recalculateFlip, recalculateFlip: triggerRecalculation } =
    useRecalculateFlip();

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
        triggerRecalculation();
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

  function getApparentPowers(): Map<string, number> {
    const allElectro = getAllElectro();
    const allCables = getAllCables();

    const allApparentPowers = getRecursiveApparentPower(
      allElectro,
      allCables,
      allElectro.filter((e) => e.type == "Producer").map((p) => p.id) ?? []
    );

    return allApparentPowers;
  }

  function getVoltageDrops(
    currentAllEnergyConsumptions: Map<string, number>
  ): Map<string, number> {
    const allElectro = getAllElectro();
    const allCable = getAllCables();

    const voltageDrops = new Map();

    allCable.forEach((c) => {
      const voltageDrop = getVoltageDropForCableData(
        allElectro,
        currentAllEnergyConsumptions,
        c
      );
      voltageDrops.set(c.toTargetSourceString(), voltageDrop);
    });

    return voltageDrops;
  }

  useEffect(() => {
    const success = restoreFlowFromJson();
    if (success === false) {
      createInitialNodes();
    }

    dialogContext?.setDialog(<InfoDialog />);
  }, []);

  function recalculate() {
    const allEnergyConsumptions = getEnergyConsumptions();
    const allApparentPowers = getApparentPowers();
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
          distributor.apparentPower =
            allApparentPowers.get(distributor.id) ?? 0;
          break;
        case "Producer":
          const producer = electro as Producer;
          producer.energyFlow = allEnergyConsumptions.get(producer.id) ?? 0;
          producer.apparentPower = allApparentPowers.get(producer.id) ?? 0;
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

  const dialogContext = useDialogContext();

  return (
    <div className="w-screen h-screen flex flex-row">
      <ReactFlow.ReactFlowProvider>
        <ReactFlow.ReactFlow
          nodeTypes={nodeTypes}
          onInit={setRfInstance}
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
                triggerRecalculation();
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

                triggerRecalculation();
              },
              (cable: Cable) => {
                removeEdge(cable.id);
                triggerRecalculation();
              },
              0
            );
            triggerRecalculation();
          }}
          fitView
        >
          <ReactFlow.Background />
          <ReactFlow.Controls />
          <ReactFlow.Panel position="top-right">
            <div className="flex flex-col gap-2">
              <thw-button
                type="primary"
                onClick={() =>
                  window.open("https://thw-tools.de?ref=elektro", "_blank")
                }
              >
                Mehr THW Tools
              </thw-button>
              <thw-button
                type="primary"
                onClick={() => setShowMenu((state) => !state)}
              >
                {showMenu ? "Close" : "Open"} Menu
              </thw-button>

              <thw-button
                type="secondary"
                onClick={() => dialogContext?.setDialog(<InfoDialog />)}
              >
                Info
              </thw-button>
              {nodes.length > 0 && (
                <thw-button
                  type="secondary"
                  onClick={() =>
                    dialogContext?.setDialog(
                      <ConfirmDialog
                        title="Löschen"
                        question="Bist du dir sicher, dass du alle sichtbaren Nodes löschen möchtest?"
                        onConfirm={deleteAll}
                      />
                    )
                  }
                >
                  Clear
                </thw-button>
              )}
              <thw-button
                type="secondary"
                onClick={() => {
                  onSave();
                  dialogContext?.setDialog(
                    <Dialog header="Flow gespeichert">
                      <div>
                        Der Flow wurde erfolgreich gespeichert. Sobald die Seite
                        neugeladen wird, wird der Flow wieder hergestellt.
                      </div>
                      <thw-button
                        type="primary"
                        onClick={() => dialogContext?.closeDialog()}
                      >
                        Okay
                      </thw-button>
                    </Dialog>
                  );
                }}
              >
                Speichern
              </thw-button>
            </div>
          </ReactFlow.Panel>
          <ReactFlow.Panel position="bottom-center">
            <Footer />
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
                addElectroInterfaceNodeCallback={(
                  electro: ElectroInterface
                ) => {
                  addElectroInterfaceNode(electro, () => {
                    removeNode(electro.id);
                    triggerRecalculation();
                  });
                }}
                closeMenu={() => setShowMenu(false)}
              />
            }
          </div>
        ) : undefined}
      </ReactFlow.ReactFlowProvider>
    </div>
  );
}
