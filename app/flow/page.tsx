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
import { Position } from "../lib/Position";
import {
  calculateVoltageDropPercent,
  getRecursiveEnergyConsumption,
} from "../lib/calculation/energy";
import { DistributorNode } from "./DistributorNode";
import { Distributor } from "../lib/data/Distributor";
import { sumArray } from "../lib/utils";

export type CableData = { cable: Cable; source: string; target: string };
export type ConsumerData = { consumer: Consumer; position: Position };
export type DistributorData = { distributor: Distributor; position: Position };

export default function FlowPage() {
  const nodeTypes = useMemo(
    () => ({
      consumerNode: ConsumerNode,
      producerNode: ProducerNode,
      distributorNode: DistributorNode,
    }),
    []
  );
  const edgeTypes = useMemo(() => ({ cableEdge: CableEdge }), []);

  const [allConsumerData] = useState<ConsumerData[]>([
    {
      consumer: new Consumer("consumer-1", 1500),
      position: { x: 550, y: 100 },
    },
    {
      consumer: new Consumer("consumer-2", 800),
      position: { x: 550, y: 300 },
    },
    {
      consumer: new Consumer("consumer-3", 1800),
      position: { x: 550, y: 500 },
    },
  ]);
  const [allDistributorData] = useState<DistributorData[]>([
    {
      distributor: new Distributor("distributor-1"),
      position: { x: 300, y: 200 },
    },
    {
      distributor: new Distributor("distributor-2"),
      position: { x: 300, y: 400 },
    },
  ]);
  const [producer] = useState<{ producer: Producer; position: Position }>({
    producer: new Producer("SEA", 54000),
    position: { x: 50, y: 300 },
  });

  const [allCableData, setAllCableData] = useState<CableData[]>([]);

  var [nodes, setNodes] = useState<ReactFlow.Node<any, string>[]>();

  const [edges, setEdges] = useState<ReactFlow.Edge<CableEdgeData>[]>([]);

  function getVoltageDropForCableData(headCableData: CableData): number {
    const consumerData = allConsumerData.find(
      (c) => c.consumer.id === headCableData.target
    );
    const distributorData = allDistributorData.find(
      (d) => d.distributor.id === headCableData.target
    );

    let energyConsumption = 0;

    if (consumerData !== undefined) {
      energyConsumption = consumerData.consumer.energyConsumption;
    } else if (distributorData !== undefined) {
      energyConsumption = getRecursiveEnergyConsumption(
        allConsumerData,
        allDistributorData,
        allCableData,
        headCableData
      );
    }

    console.log(
      `${headCableData.source}-${headCableData.target}: ${energyConsumption}`
    );

    return calculateVoltageDropPercent(headCableData.cable, energyConsumption);
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
      ...allConsumerData.map((consumer) => {
        return {
          id: consumer.consumer.id,
          type: "consumerNode",
          position: consumer.position,
          data: { consumer: consumer.consumer },
          draggable: true,
        };
      }),
      ...allDistributorData.map((distributorData) => {
        return {
          id: distributorData.distributor.id,
          type: "distributorNode",
          position: distributorData.position,
          data: { distributor: distributorData.distributor },
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

    //allCableData.forEach((cableData) => {
    //  const voltageDrop = getVoltageDropForCableData(cableData);
    //});
  }, [allConsumerData, allCableData, allDistributorData, producer]);

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
          connection.source == "SEA" ? 400 : 230,
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
