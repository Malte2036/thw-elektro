import { Cable } from "../data/Cable";
import { sumArray } from "../utils";
import * as ReactFlow from "reactflow";
import { ElectroInterface } from "../data/Electro";
import { Consumer } from "../data/Consumer";
import { Distributor } from "../data/Distributor";
import { Plug } from "../data/Plug";

export function getRecursiveEnergyConsumption(
  allElectroInterfaces: ElectroInterface[],
  allCables: Cable[],
  headCableTargets: string[]
): Map<string, number> {
  return getRecursiveValues(
    (consumer) => consumer.energyConsumption,
    (localResultMap) =>
      sumArray(
        Array.from(localResultMap.entries())
          .filter((v) => !v[0].includes("distributor"))
          .map((v) => v[1])
      ),
    allElectroInterfaces,
    allCables,
    headCableTargets
  );
}

export function getRecursiveApparentPower(
  allElectroInterfaces: ElectroInterface[],
  allCables: Cable[],
  headCableTargets: string[]
): Map<string, number> {
  return getRecursiveValues(
    (consumer) => consumer.getApparentPower(),
    (localResultMap, childrenElectorInterfaces) =>
      getApparentPowerFromChildren(localResultMap, childrenElectorInterfaces) ??
      0,
    allElectroInterfaces,
    allCables,
    headCableTargets
  );
}

function getRecursiveValues(
  getValueByConsumer: (consumer: Consumer) => number,
  combineChildrenValues: (
    localResultMap: Map<string, number>,
    childrenElectroInterfaces: ElectroInterface[]
  ) => number,
  allElectroInterfaces: ElectroInterface[],
  allCables: Cable[],
  headCableTargets: string[]
): Map<string, number> {
  const resultMap = new Map<string, number>();

  for (const headCableTarget of headCableTargets) {
    const localResultMap = new Map<string, number>();

    const outputEdges = allCables.filter((c) => c.source === headCableTarget);

    const dependingConsumers = _getDependingConsumersValues(
      getValueByConsumer,
      allElectroInterfaces,
      outputEdges
    );
    dependingConsumers.forEach((value, key) => localResultMap.set(key, value));

    const dependingDistributors = getDependingDistributorValues(
      getValueByConsumer,
      combineChildrenValues,
      allElectroInterfaces,
      allCables,
      outputEdges
    );
    dependingDistributors.forEach((value, key) =>
      localResultMap.set(key, value)
    );

    const combinedSum = combineChildrenValues(
      localResultMap,
      allElectroInterfaces.filter((electro) =>
        outputEdges.some((edge) => edge.target === electro.id)
      )
    );

    resultMap.set(headCableTarget, combinedSum);

    localResultMap.forEach((value, key) => resultMap.set(key, value));
  }

  return resultMap;
}

export function _getDependingConsumersValues(
  getValueByConsumer: (consumer: Consumer) => number,
  allElectroInterfaces: ElectroInterface[],
  outputEdges: Cable[]
): Map<string, number> {
  const resultMap = new Map<string, number>();

  for (const edge of outputEdges) {
    const found = allElectroInterfaces
      .filter((e) => e.type == "Consumer")
      .map((e) => e as Consumer)
      .find((c) => c.id === edge.target);

    if (!found) continue;

    const value = getValueByConsumer(found);

    if (value !== undefined) {
      resultMap.set(edge.target, value);
    }
  }
  return resultMap;
}

function getDependingDistributorValues(
  getValueByConsumer: (consumer: Consumer) => number,
  combineChildrenValues: (
    localResultMap: Map<string, number>,
    childrenElectroInterfaces: ElectroInterface[]
  ) => number,
  allElectroInterfaces: ElectroInterface[],
  allCables: Cable[],
  outputEdges: Cable[]
): Map<string, number> {
  const resultMap = new Map<string, number>();

  const allDistributor = allElectroInterfaces
    .filter((e) => e.type == "Distributor")
    .map((e) => e as Distributor);

  const dependingEdges = outputEdges.filter((e) =>
    allDistributor.find((d) => d.id === e.target)
  );
  for (const edge of dependingEdges) {
    const res = getRecursiveValues(
      getValueByConsumer,
      combineChildrenValues,
      allElectroInterfaces,
      allCables,
      [edge.target]
    );
    res.forEach((value, key) => resultMap.set(key, value));
  }
  return resultMap;
}

/**
 * S = Wurzel ( (Summe Pi)² + (Summe Qi)² )
 * @returns Scheinleistung in VA
 */
function getApparentPowerFromChildren(
  localResultMap: Map<string, number>,
  children: ElectroInterface[]
): number | undefined {
  const consumerChildren = children.filter(
    (child) => child instanceof Consumer
  ) as Consumer[];

  const sumActivePower = sumArray(
    consumerChildren.map((c) => c.getActivePower())
  );

  const sumReactivePower = sumArray(
    consumerChildren.map((c) => c.getReactivePower())
  );

  const distributorChildren = children.filter(
    (child) => child instanceof Distributor
  ) as Distributor[];

  const sumDistributorsApparentPower = sumArray(
    distributorChildren
      .filter((d) => localResultMap.has(d.id))
      .map((d) => localResultMap.get(d.id)!)
  );

  return (
    Math.sqrt(Math.pow(sumActivePower, 2) + Math.pow(sumReactivePower, 2)) +
    sumDistributorsApparentPower
  );
}

// utils

export function isCircularConnection(
  connection: ReactFlow.Connection,
  allEdges: ReactFlow.Edge[],
  visited: Set<string> = new Set<string>(),
  currentNode?: string
): boolean {
  visited.add(currentNode || connection.target!);
  const neighbors = allEdges.filter(
    (edge) => edge.source === (currentNode || connection.target)
  );

  for (const neighbor of neighbors) {
    if (neighbor.target === connection.source) {
      return true; // Circular connection found
    }

    if (!visited.has(neighbor.target)) {
      if (
        isCircularConnection(connection, allEdges, visited, neighbor.target)
      ) {
        return true; // Circular connection found
      }
    }
  }

  return false;
}

export function calculatePowerInWatt(plug: Plug): number {
  if (plug.voltage === 230) {
    return plug.voltage * plug.current;
  }
  if (plug.voltage === 400) {
    return plug.voltage * plug.current * Math.sqrt(3);
  }

  throw new Error("Invalid voltage. Only 230V and 400V are supported.");
}
