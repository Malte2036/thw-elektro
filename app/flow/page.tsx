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
  calculateTotalVoltageDropPercent,
  getRecursiveEnergyConsumption,
  getVoltageDropForCableData,
  isCircularConnection,
} from "../lib/calculation/energy";
import { DistributorNode } from "./DistributorNode";
import { Distributor } from "../lib/data/Distributor";
import { toTargetSourceString } from "../lib/utils";

export class CableData {
  cable: Cable;
  source: string;
  target: string;
  constructor(cable: Cable, source: string, target: string) {
    this.cable = cable;
    this.source = source;
    this.target = target;
  }

  toTargetSourceString() {
    return toTargetSourceString(this.target, this.source);
  }
}

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
    producer: new Producer("SEA"),
    position: { x: 50, y: 300 },
  });

  const [allCableData, setAllCableData] = useState<CableData[]>([]);

  const [allEnergyConsumptions, setAllEnergyConsumptions] = useState<
    Map<string, number>
  >(new Map());

  const [allVoltageDrops, setAllVoltageDrops] = useState<Map<string, number>>(
    new Map()
  );

  const [allTotalVoltageDrops, setAllTotalVoltageDrops] = useState<
    Map<string, number>
  >(new Map());

  const [nodes, setNodes, onNodesChange] = ReactFlow.useNodesState([]);
  const [edges, setEdges, onEdgesChange] =
    ReactFlow.useEdgesState<CableEdgeData>([]);

  function updateNodes() {
    setNodes([
      {
        id: producer.producer.id,
        type: "producerNode",
        position: producer.position,
        data: {
          producer: producer.producer,
          energyFlow: allEnergyConsumptions.get(producer.producer.id) ?? 0,
        },
        draggable: true,
      },

      ...allDistributorData.map((distributorData) => {
        return {
          id: distributorData.distributor.id,
          type: "distributorNode",
          position: distributorData.position,
          data: {
            distributor: distributorData.distributor,
            energyFlow:
              allEnergyConsumptions.get(distributorData.distributor.id) ?? 0,
            hasEnergy: allEnergyConsumptions.has(
              distributorData.distributor.id
            ),
          },
          draggable: true,
        };
      }),
      ...allConsumerData.map((consumerData) => {
        return {
          id: consumerData.consumer.id,
          type: "consumerNode",
          position: consumerData.position,
          data: {
            consumer: consumerData.consumer,
            hasEnergy: allEnergyConsumptions.has(consumerData.consumer.id),
            totalVoltageDrop:
              allTotalVoltageDrops.get(consumerData.consumer.id) ?? 0,
          },
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
                new CableData(
                  new Cable(
                    "cable-" + Math.floor(Math.random() * 1_000_000),
                    getNextCableLength(cableData.cable.length),
                    cableData.cable.voltage,
                    cableData.cable.current
                  ),
                  cableData.source,
                  cableData.target
                ),
              ]);
            },
            voltageDrop:
              allVoltageDrops.get(cableData.toTargetSourceString()) ?? 0,
          },
        };
      })
    );
  }

  function updateEnergyConsumptions() {
    const currentAllEnergyConsumptions = getRecursiveEnergyConsumption(
      allConsumerData,
      allDistributorData,
      allCableData,
      producer.producer.id
    );
    setAllEnergyConsumptions(currentAllEnergyConsumptions);

    updateVoltageDrops(currentAllEnergyConsumptions);
  }

  function updateVoltageDrops(currentAllEnergyConsumptions: any) {
    const voltageDrops = new Map();

    allCableData.forEach((cableData) => {
      let voltageDrop = getVoltageDropForCableData(
        allConsumerData,
        allDistributorData,
        currentAllEnergyConsumptions,
        cableData
      );
      voltageDrops.set(cableData.toTargetSourceString(), voltageDrop);
    });

    setAllVoltageDrops(voltageDrops);

    const totalVoltageDrops = new Map(
      allConsumerData.map((consumerData) => [
        consumerData.consumer.id,
        calculateTotalVoltageDropPercent(
          allCableData,
          voltageDrops,
          consumerData.consumer.id
        ),
      ])
    );
    setAllTotalVoltageDrops(totalVoltageDrops);
  }

  useEffect(() => {
    updateEnergyConsumptions();
    updateNodes();
  }, [allConsumerData, allCableData, allDistributorData, producer]);

  useEffect(() => {
    // bug fix: update nodes after voltage drop calculation
    updateNodes();
  }, [allEnergyConsumptions, allVoltageDrops, allTotalVoltageDrops]);

  function onConnect(connection: ReactFlow.Connection) {
    if (!connection.source || !connection.target) return;

    // Check for circular connection
    if (isCircularConnection(connection, allCableData)) {
      console.log("Circular connection detected");
      alert("Circular connection detected");
      return;
    }

    // Check if the edge already exists
    if (
      edges.find(
        (edge) =>
          edge.source === connection.source && edge.target === connection.target
      )
    ) {
      console.log("Edge already exists");
      alert("Edge already exists");
      return;
    }

    // Check if node does not already has an input edge
    if (edges.find((edge) => edge.target === connection.target)) {
      console.log("Node already has an input edge");
      alert("Node already has an input edge");
      return;
    }

    setAllCableData([
      ...allCableData,
      new CableData(
        new Cable(
          "cable-" + Math.floor(Math.random() * 1_000_000),
          50,
          connection.source == "SEA" ? 400 : 230,
          16
        ),
        connection.source,
        connection.target
      ),
    ]);
  }

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <ReactFlow.ReactFlow
        nodeTypes={nodeTypes}
        nodes={nodes}
        edgeTypes={edgeTypes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
      >
        <ReactFlow.Background />
        <ReactFlow.Controls />
      </ReactFlow.ReactFlow>
    </div>
  );
}
