"use client";

import React, { useEffect, useMemo, useState } from "react";
import * as ReactFlow from "reactflow";

import "reactflow/dist/style.css";
import { Consumer } from "../lib/data/Consumer";
import { ConsumerNode } from "./ConsumerNode";
import { ProducerNode } from "./ProducerNode";
import { Producer } from "../lib/data/Producer";
import CableEdge from "./CableEdge";
import { Cable } from "../lib/data/Cable";

export default function FlowPage() {
  const nodeTypes = useMemo(
    () => ({ consumerNode: ConsumerNode, producerNode: ProducerNode }),
    []
  );
  const edgeTypes = useMemo(() => ({ cableEdge: CableEdge }), []);

  const [consumers] = useState([new Consumer("1", 5), new Consumer("2", 6.3)]);
  const [producer] = useState(new Producer("SEA", 54));
  const [cables] = useState<Cable[]>([new Cable("cable-1", 50)]);

  var [nodes, setNodes] = useState<ReactFlow.Node<any, string>[]>();

  const [edges, setEdges] = useState<ReactFlow.Edge<Cable>[]>();

  function updateNodes() {
    setNodes([
      {
        id: producer.id,
        type: "producerNode",
        position: { x: Math.random() * 1000, y: Math.random() * 1000 },
        data: { producer: producer },
      },
      ...consumers.map((consumer) => {
        return {
          id: consumer.id,
          type: "consumerNode",
          position: { x: Math.random() * 1000, y: Math.random() * 1000 },
          data: { consumer: consumer },
        };
      }),
    ]);
    setEdges(
      cables.map((cable) => {
        return {
          id: cable.id,
          source: producer.id,
          sourceHandle: "output",
          target: consumers[0].id,
          targetHandle: "input",
          animated: true,
          type: "cableEdge",
          data: cable,
        };
      })
    );
  }

  useEffect(() => {
    updateNodes();
  }, [consumers]);

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <ReactFlow.ReactFlow
        nodeTypes={nodeTypes}
        nodes={nodes}
        edgeTypes={edgeTypes}
        edges={edges}
      >
        <ReactFlow.Background />
        <ReactFlow.Controls />
      </ReactFlow.ReactFlow>
    </div>
  );
}
