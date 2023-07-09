import {
  calculatePowerInWatt,
  calculateVoltageDropPercent,
} from "@/app/lib/calculation/energy";
import { Cable } from "@/app/lib/data/Cable";
import { Consumer } from "@/app/lib/data/Consumer";

describe("calculatePowerInWatt", () => {
  it("", () => {
    const cable = new Cable("cable-test", 25, 230, 16);
    expect(calculatePowerInWatt(cable)).toEqual(3680);
  });
});

describe("calculateVoltageDrop", () => {
  it("", () => {
    const cable = new Cable("cable-test", 75, 400, 16);
    const energyConsumption = 5000;
    expect(calculateVoltageDropPercent(cable, energyConsumption)).toBeCloseTo(
      1.67
    );
  });
});
