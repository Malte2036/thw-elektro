import { CableData, ConsumerData, DistributorData } from "@/app/flow/page";
import { Cable } from "../data/Cable";
import { sumArray } from "../utils";
import * as ReactFlow from "reactflow";

export function calculateVoltageDropPercent(
  cable: Cable,
  energyConsumption: number
): number {
  const voltage = cable.voltage;
  const length = cable.length;
  const powerInWatt = energyConsumption;
  const resistance = 56;
  const diameter = cable.getDiameter();

  if (voltage === 230) {
    return (
      ((2 * length * powerInWatt) /
        (resistance * diameter * Math.pow(voltage, 2))) *
      100
    );
  }
  if (voltage === 400) {
    return (
      ((length * powerInWatt) /
        (resistance * diameter * Math.pow(voltage, 2))) *
      100
    );
  }

  throw new Error("Invalid voltage. Only 230V and 400V are supported.");
}

export function calculateVoltageDropPercentTraverseSum(
  allConsumerData: ConsumerData[],
  allDistributorData: DistributorData[],
  allCableData: CableData[],
  allVoltageDrops: Map<string, number>,
  headCableTarget: string,
  leafCableSource: string
): number {
  if (headCableTarget === leafCableSource) {
    console.log(allVoltageDrops);

    return allVoltageDrops.get(`${headCableTarget} -> ${leafCableSource}`) ?? 0;
  }

  const outputEdges = allCableData.filter((c) => c.source === headCableTarget);
  console.log("output edges found for", headCableTarget, leafCableSource);

  let voltageDropPercentSum = 0;
  for (const edge of outputEdges) {
    voltageDropPercentSum += calculateVoltageDropPercentTraverseSum(
      allConsumerData,
      allDistributorData,
      allCableData,
      allVoltageDrops,
      edge.target,
      leafCableSource
    );
  }

  return voltageDropPercentSum;
}

export function isVoltageDropTooHigh(voltageDropPercent: number): boolean {
  return voltageDropPercent > 3;
}

export function calculatePowerInWatt(cable: Cable): number {
  const voltage = cable.voltage;
  const current = cable.current;

  if (voltage === 230) {
    return voltage * current;
  }
  if (voltage === 400) {
    return voltage * current * Math.sqrt(3);
  }

  throw new Error("Invalid voltage. Only 230V and 400V are supported.");
}

export function getVoltageDropForCableData(
  allConsumerData: ConsumerData[],
  allDistributorData: DistributorData[],
  allEnergyConsumptions: Map<string, number>,
  headCableData: CableData
): number {
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
    energyConsumption =
      allEnergyConsumptions.get(distributorData.distributor.id) ?? 0;
  }

  return calculateVoltageDropPercent(headCableData.cable, energyConsumption);
}

export function getRecursiveEnergyConsumption(
  allConsumerData: ConsumerData[],
  allDistributorData: DistributorData[],
  allCableData: CableData[],
  headCableTarget: string
): Map<string, number> {
  const energyConsumptionMap = new Map<string, number>();

  const outputEdges = allCableData.filter((c) => c.source === headCableTarget);
  if (outputEdges.length === 0) {
    console.log("No output edges found for", headCableTarget);
  }

  const dependingConsumers = getDependingConsumersEnergyConsumption(
    allConsumerData,
    outputEdges
  );
  dependingConsumers.forEach((value, key) =>
    energyConsumptionMap.set(key, value)
  );

  const dependingDistributors = getDependingDistributorsEnergyConsumption(
    allConsumerData,
    allDistributorData,
    allCableData,
    outputEdges
  );
  dependingDistributors.forEach((value, key) =>
    energyConsumptionMap.set(key, value)
  );

  const energyConsumption = sumArray(
    Array.from(energyConsumptionMap.entries())
      .filter((v) => !v[0].includes("distributor"))
      .map((v) => v[1])
  );
  energyConsumptionMap.set(headCableTarget, energyConsumption);

  return energyConsumptionMap;
}

function getDependingConsumersEnergyConsumption(
  allConsumerData: ConsumerData[],
  outputEdges: CableData[]
): Map<string, number> {
  const energyConsumptionMap = new Map<string, number>();

  for (const edge of outputEdges) {
    const consumption = allConsumerData.find(
      (c) => c.consumer.id === edge.target
    )?.consumer?.energyConsumption;

    if (consumption !== undefined) {
      energyConsumptionMap.set(edge.target, consumption);
    }
  }
  return energyConsumptionMap;
}

function getDependingDistributorsEnergyConsumption(
  allConsumerData: ConsumerData[],
  allDistributorData: DistributorData[],
  allCableData: CableData[],
  outputEdges: CableData[]
): Map<string, number> {
  const energyConsumptionMap = new Map<string, number>();

  const dependingEdges = outputEdges.filter((e) =>
    allDistributorData.find((d) => d.distributor.id === e.target)
  );
  for (const edge of dependingEdges) {
    const res = getRecursiveEnergyConsumption(
      allConsumerData,
      allDistributorData,
      allCableData,
      edge.target
    );
    res.forEach((value, key) => energyConsumptionMap.set(key, value));
  }
  return energyConsumptionMap;
}

export function isCircularConnection(
  connection: ReactFlow.Connection,
  allCableData: CableData[],
  visited: Set<string> = new Set<string>(),
  currentNode?: string
): boolean {
  visited.add(currentNode || connection.target!);
  const neighbors = allCableData.filter(
    (edge) => edge.source === (currentNode || connection.target)
  );

  for (const neighbor of neighbors) {
    if (neighbor.target === connection.source) {
      return true; // Circular connection found
    }

    if (!visited.has(neighbor.target)) {
      if (
        isCircularConnection(connection, allCableData, visited, neighbor.target)
      ) {
        return true; // Circular connection found
      }
    }
  }

  return false;
}
