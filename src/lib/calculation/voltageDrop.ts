import { Cable } from "../data/Cable";
import { Consumer } from "../data/Consumer";
import { Distributor } from "../data/Distributor";
import { ElectroInterface } from "../data/Electro";
import { getPlugDiameter } from "../data/Plug";
import { toTargetSourceString } from "../utils";

export function calculateVoltageDropPercent(
  cable: Cable,
  energyConsumption: number
): number {
  const voltage = cable.plug.voltage;
  const length = cable.length;
  const powerInWatt = energyConsumption;
  const resistance = 56;
  const diameter = getPlugDiameter(cable.plug);

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

export function calculateTotalVoltageDropPercent(
  allCable: Cable[],
  allVoltageDrops: Map<string, number>,
  leafCableSource: string
): number {
  const inputEdge = allCable.find((c) => c.target === leafCableSource);
  if (inputEdge === undefined) {
    // is (maybe) producer leaf
    return 0;
  }

  const drop =
    allVoltageDrops.get(
      toTargetSourceString(inputEdge.target, inputEdge.source)
    ) ?? 0;

  return (
    drop +
    calculateTotalVoltageDropPercent(
      allCable,
      allVoltageDrops,
      inputEdge.source
    )
  );
}

export function getVoltageDropForCableData(
  allElectroInterfaces: ElectroInterface[],
  allEnergyConsumptions: Map<string, number>,
  headCable: Cable
): number {
  const allConsumers = allElectroInterfaces.filter(
    (e) => e.type === "Consumer"
  ) as Consumer[];
  const allDistributors = allElectroInterfaces.filter(
    (e) => e.type === "Distributor"
  ) as Distributor[];
  const consumerData = allConsumers.find((c) => c.id === headCable.target);
  const distributorData = allDistributors.find(
    (d) => d.id === headCable.target
  );

  let energyConsumption = 0;

  if (consumerData !== undefined) {
    energyConsumption = consumerData.energyConsumption;
  } else if (distributorData !== undefined) {
    energyConsumption = allEnergyConsumptions.get(distributorData.id) ?? 0;
  }

  return calculateVoltageDropPercent(headCable, energyConsumption);
}

export function isVoltageDropTooHigh(voltageDropPercent: number): boolean {
  return voltageDropPercent > 3;
}
