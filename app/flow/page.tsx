"use client";

import React, { useEffect, useMemo, useState } from "react";
import * as ReactFlow from "reactflow";

import "reactflow/dist/style.css";
import { Consumer } from "../lib/data/Consumer";
import { ConsumerNode } from "./ConsumerNode";
import { ProducerNode } from "./ProducerNode";
import { Producer } from "../lib/data/Producer";
import CableEdge, { CableEdgeData } from "./CableEdge";
import { Cable, getNextCableLength } from "../lib/data/Cable";
import { Position, getRandomPosition } from "../lib/Position";
import { calculateVoltageDrop as calculateVoltageDropPercent } from "../lib/calculation/energy";

type CableData = { cable: Cable; source: string; target: string };

export default function FlowPage() {
  const nodeTypes = useMemo(
    () => ({ consumerNode: ConsumerNode, producerNode: ProducerNode }),
    []
  );
  const edgeTypes = useMemo(() => ({ cableEdge: CableEdge }), []);

  const [consumers] = useState<{ consumer: Consumer; position: Position }[]>([
    {
      consumer: new Consumer("1", 5000),
      position: getRandomPosition(),
    },
    {
      consumer: new Consumer("2", 6300),
      position: getRandomPosition(),
    },
  ]);
  const [producer] = useState<{ producer: Producer; position: Position }>({
    producer: new Producer("SEA", 54000),
    position: getRandomPosition(),
  });
  const [allCableData, setAllCableData] = useState<CableData[]>([]);

  var [nodes, setNodes] = useState<ReactFlow.Node<any, string>[]>();

  const [edges, setEdges] = useState<ReactFlow.Edge<CableEdgeData>[]>([]);

  function getVoltageDropForCableData(cableData: CableData): number {
    const consumer = consumers.find((c) => c.consumer.id == cableData.target);

    if (consumer == undefined) return 0;

    return calculateVoltageDropPercent(cableData.cable, consumer.consumer);
  }

  function updateNodes() {
    setNodes([
      {
        id: producer.producer.id,
        type: "producerNode",
        position: producer.position,
        data: { producer: producer.producer },
        draggable: true,
      },
      ...consumers.map((consumer) => {
        return {
          id: consumer.consumer.id,
          type: "consumerNode",
          position: consumer.position,
          data: { consumer: consumer.consumer },
          draggable: true,
        };
      }),
    ]);
    setEdges(
      allCableData.map((cableData) => {
        return {
          id: cableData.cable.id,
          source: cableData.source,
          sourceHandle: "output",
          target: cableData.target,
          targetHandle: "input",
          animated: true,
          type: "cableEdge",
          data: {
            cable: cableData.cable,
            onClickCallback: () => {
              setAllCableData((state) => [
                ...state.filter(
                  (stateCable) => stateCable.cable.id !== cableData.cable.id
                ),
                {
                  cable: new Cable(
                    "cable-" + Math.floor(Math.random() * 1_000_000),
                    getNextCableLength(cableData.cable.length),
                    cableData.cable.voltage,
                    cableData.cable.current
                  ),
                  source: cableData.source,
                  target: cableData.target,
                },
              ]);
            },
            voltageDrop: getVoltageDropForCableData(cableData),
          },
        };
      })
    );
  }

  useEffect(() => {
    updateNodes();

    allCableData.forEach((cableData) => {
      const voltageDrop = calculateVoltageDropPercent(
        cableData.cable,
        consumers[0].consumer
      );
      console.log(`Voltage drop: ${voltageDrop.toFixed(6)}%`);
    });
  }, [consumers, allCableData]);

  function onConnect(connection: ReactFlow.Connection) {
    if (!connection.source || !connection.target) return;

    if (
      edges.find(
        (edge) =>
          edge.source === connection.source && edge.target === connection.target
      )
    ) {
      console.log("edge already exists");
      return;
    }

    setAllCableData([
      ...allCableData,
      {
        cable: new Cable(
          "cable-" + Math.floor(Math.random() * 1_000_000),
          50,
          400,
          16
        ),
        source: connection.source,
        target: connection.target,
      },
    ]);
  }

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <ReactFlow.ReactFlow
        nodeTypes={nodeTypes}
        nodes={nodes}
        edgeTypes={edgeTypes}
        edges={edges}
        onConnect={onConnect}
      >
        <ReactFlow.Background />
        <ReactFlow.Controls />
      </ReactFlow.ReactFlow>
    </div>
  );
}
