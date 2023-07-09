import {
  calculatePowerInWatt,
  calculateVoltageDrop,
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
    const consumer = new Consumer("consumer-test", 5000);
    expect(calculateVoltageDrop(cable, consumer)).toBeCloseTo(1.67);
  });
});
