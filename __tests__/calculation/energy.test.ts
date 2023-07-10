import { CableData } from "@/app/flow/page";
import {
  calculatePowerInWatt,
  calculateTotalVoltageDropPercent,
  calculateVoltageDropPercent,
} from "@/app/lib/calculation/energy";
import { Cable } from "@/app/lib/data/Cable";
import { Consumer } from "@/app/lib/data/Consumer";
import { toTargetSourceString } from "@/app/lib/utils";
import { Position } from "reactflow";

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

describe("calculateTotalVoltageDropPercent", () => {
  it("", () => {
    expect(
      calculateTotalVoltageDropPercent(
        [
          new CableData(
            new Cable("cable-fake-0", 25, 400, 16),
            "producer",
            "consumer-fake-1"
          ),
          new CableData(
            new Cable("cable-fake-1", 25, 400, 16),
            "distributor-2",
            "consumer-fake-2"
          ),
          new CableData(
            new Cable("cable-1", 25, 400, 16),
            "producer",
            "distributor-1"
          ),
          new CableData(
            new Cable("cable-2", 25, 400, 16),
            "distributor-1",
            "distributor-2"
          ),
          new CableData(
            new Cable("cable-3", 25, 400, 16),
            "distributor-2",
            "distributor-3"
          ),
          new CableData(
            new Cable("cable-4", 25, 400, 16),
            "distributor-3",
            "distributor-4"
          ),
          new CableData(
            new Cable("cable-5", 25, 400, 16),
            "distributor-4",
            "consumer-1"
          ),
        ],
        new Map([
          [toTargetSourceString("distributor-1", "producer"), 1.4],
          [toTargetSourceString("distributor-2", "distributor-1"), 1],
          [toTargetSourceString("distributor-3", "distributor-2"), 0.3],
          [toTargetSourceString("distributor-4", "distributor-3"), 3],
          [toTargetSourceString("consumer-1", "distributor-4"), 2],
        ]),
        "consumer-1"
      )
    ).toBeCloseTo(7.7, 0.05);
  });
});
