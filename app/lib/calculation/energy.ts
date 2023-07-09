import { Cable } from "../data/Cable";

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
