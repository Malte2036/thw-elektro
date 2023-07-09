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
  headCableData: CableData
) {
  let energyConsumption = 0;

  const outputEdges = allCableData.filter(
    (c) => c.source === headCableData.target
  );

  const dependingConsumers = getDependingConsumersEnergyConsumption(
    allConsumerData,
    outputEdges
  );
  const dependingDistributors = getDependingDistributorsEnergyConsumption(
    allConsumerData,
    allDistributorData,
    allCableData,
    outputEdges
  );

  energyConsumption = dependingConsumers + dependingDistributors;

  console.log(`Energy consumption: ${energyConsumption}`);

  return energyConsumption;
}

function getDependingConsumersEnergyConsumption(
  allConsumerData: ConsumerData[],
  outputEdges: CableData[]
): number {
  return sumArray(
    outputEdges
      .map(
        (e) =>
          allConsumerData.find((c) => c.consumer.id === e.target)?.consumer
            ?.energyConsumption
      )
      .filter((e) => e !== undefined)
      .map((e) => e as number)
  );
}

function getDependingDistributorsEnergyConsumption(
  allConsumerData: ConsumerData[],
  allDistributorData: DistributorData[],
  allCableData: CableData[],
  outputEdges: CableData[]
): number {
  const dependingEdges = outputEdges.filter((e) =>
    allDistributorData.find((d) => d.distributor.id === e.target)
  );
  return sumArray(
    dependingEdges.map((e) =>
      getRecursiveEnergyConsumption(
        allConsumerData,
        allDistributorData,
        allCableData,
        e
      )
    )
  );
}
