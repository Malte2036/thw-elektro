import { CableData, ConsumerData, DistributorData } from "@/app/flow/page";
import { Cable } from "../data/Cable";
import { sumArray } from "../utils";

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
