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
  CableData,
  calculateTotalVoltageDropPercent,
  getRecursiveEnergyConsumption,
  getVoltageDropForCableData,
  isCircularConnection,
} from "../lib/calculation/energy";
import { DistributorNode } from "./DistributorNode";
import { Distributor } from "../lib/data/Distributor";
import { toTargetSourceString } from "../lib/utils";

import useStore from "./store";
import { shallow } from "zustand/shallow";

const selector = (state: any) => ({
  nodes: state.nodes,
  edges: state.edges,
  onNodesChange: state.onNodesChange,
  onEdgesChange: state.onEdgesChange,
  addCableDataEdge: state.addCableDataEdge,
  updateCableDataEdge: state.updateCableDataEdge,
  addProducerDataNode: state.addProducerDataNode,
  updateProducerDataNode: state.updateProducerDataNode,
  addDistributorDataNode: state.addDistributorDataNode,
  updateDistributorDataNode: state.updateDistributorDataNode,
  addConsumerDataNode: state.addConsumerDataNode,
  updateConsumerDataNode: state.updateConsumerDataNode,
});

export type ProducerData = { producer: Producer; position: Position };
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

  //const [nodes, setNodes, onNodesChange] = ReactFlow.useNodesState([]);
  //const [edges, setEdges, onEdgesChange] =
  //  ReactFlow.useEdgesState<CableEdgeData>([]);

  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    addCableDataEdge,
    updateCableDataEdge,
    addProducerDataNode,
    updateProducerDataNode,
    addDistributorDataNode,
    updateDistributorDataNode,
    addConsumerDataNode,
    updateConsumerDataNode,
  } = useStore(selector, shallow);

  function createInitialNodes() {
    addProducerDataNode(
      producer,
      allEnergyConsumptions.get(producer.producer.id) ?? 0
    );
    allDistributorData.forEach((distributorData) =>
      addDistributorDataNode(
        distributorData,
        allEnergyConsumptions.get(distributorData.distributor.id) ?? 0,
        allEnergyConsumptions.has(distributorData.distributor.id)
      )
    );
    allConsumerData.forEach((consumerData) =>
      addConsumerDataNode(
        consumerData,
        allEnergyConsumptions.has(consumerData.consumer.id),
        allTotalVoltageDrops.get(consumerData.consumer.id) ?? 0
      )
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
    createInitialNodes();
  }, []);

  useEffect(() => {
    updateEnergyConsumptions();
  }, [allConsumerData, allCableData, allDistributorData, producer]);

  useEffect(() => {
    updateProducerDataNode(
      producer,
      allEnergyConsumptions.get(producer.producer.id) ?? 0
    );

    allDistributorData.forEach((distributorData) => {
      updateDistributorDataNode(
        distributorData,
        allEnergyConsumptions.get(distributorData.distributor.id) ?? 0,
        allEnergyConsumptions.has(distributorData.distributor.id)
      );
    });

    allConsumerData.forEach((consumerData) => {
      updateConsumerDataNode(
        consumerData,
        allEnergyConsumptions.has(consumerData.consumer.id),
        allTotalVoltageDrops.get(consumerData.consumer.id) ?? 0
      );
    });

    allCableData.forEach((cableData) => {
      updateCableDataEdge(
        cableData.cable,
        allVoltageDrops.get(cableData.toTargetSourceString()) ?? 0
      );
    });
  }, [
    allEnergyConsumptions,
    allVoltageDrops,
    allTotalVoltageDrops,
    allConsumerData,
  ]);

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <ReactFlow.ReactFlow
        nodeTypes={nodeTypes}
        nodes={nodes}
        edgeTypes={edgeTypes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={(connection) => {
          const cableData = addCableDataEdge(
            connection,
            (cable: Cable) => {
              cable.length = getNextCableLength(cable.length);
              setAllCableData((state) =>
                state.map((cableData) => {
                  if (cableData.cable.id === cable.id) {
                    return new CableData(
                      cable,
                      cableData.source,
                      cableData.target
                    );
                  }
                  return cableData;
                })
              );
            },
            allVoltageDrops.get(
              toTargetSourceString(
                connection.target ?? "",
                connection.source ?? ""
              )
            ) ?? 0
          );

          if (cableData != undefined) {
            setAllCableData((state) => [...state, cableData]);
          }
        }}
        fitView
      >
        <ReactFlow.Background />
        <ReactFlow.Controls />
      </ReactFlow.ReactFlow>
    </div>
  );
}
