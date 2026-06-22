import {
  _getDependingConsumersValues,
  calculatePowerInWatt,
  getRecursiveApparentPower,
  getRecursiveEnergyConsumption,
} from "../../src/lib/calculation/energy";
import {
  calculateVoltageDropPercent,
  calculateTotalVoltageDropPercent,
} from "../../src/lib/calculation/voltageDrop";
import { Cable } from "../../src/lib/data/Cable";
import { Consumer } from "../../src/lib/data/Consumer";
import { Distributor } from "../../src/lib/data/Distributor";
import { ElectroInterface } from "../../src/lib/data/Electro";
import { Plug, getPlugLabel } from "../../src/lib/data/Plug";
import { Producer } from "../../src/lib/data/Producer";
import { toTargetSourceString } from "../../src/lib/utils";


describe("calculatePowerInWatt", () => {
  it("should calculate power correctly for 230V 16A", () => {
    const plug: Plug = { current: 16, voltage: 230 };
    expect(calculatePowerInWatt(plug)).toEqual(3680);
  });

  it("should calculate power correctly for 400V 288A (4x 95mm²)", () => {
    const plug: Plug = { current: 288, voltage: 400 };
    expect(calculatePowerInWatt(plug)).toBeCloseTo(199532, 0); // 400 * 288 * sqrt(3)
  });

  it("should calculate power correctly for 400V 400A (4x 120mm²)", () => {
    const plug: Plug = { current: 400, voltage: 400 };
    expect(calculatePowerInWatt(plug)).toBeCloseTo(277128, 0); // 400 * 400 * sqrt(3)
  });
});

describe("calculateVoltageDrop", () => {
  it("should calculate voltage drop correctly for standard CEE 16A cable", () => {
    const cable = new Cable(
      "cable-test",
      75,
      { current: 16, voltage: 400 },
      "",
      ""
    );
    const energyConsumption = 5000;
    expect(calculateVoltageDropPercent(cable, energyConsumption)).toBeCloseTo(
      1.67
    );
  });

  it("should calculate voltage drop correctly for 4x 95mm² (288A) cable", () => {
    const cable = new Cable(
      "cable-test",
      75,
      { current: 288, voltage: 400 },
      "",
      ""
    );
    const energyConsumption = 100000; // 100 kW load
    // length = 75m, resistance = 56, diameter = 95.0, voltage = 400
    // drop = (75 * 100000) / (56 * 95 * 400^2) * 100 = 7,500,000 / 851,200,000 * 100 = 0.881%
    expect(calculateVoltageDropPercent(cable, energyConsumption)).toBeCloseTo(
      0.881,
      3
    );
  });

  it("should calculate voltage drop correctly for a custom decimal cable length (e.g. 12.5m)", () => {
    const cable = new Cable(
      "cable-test",
      12.5,
      { current: 16, voltage: 400 },
      "",
      ""
    );
    const energyConsumption = 5000;
    // length = 12.5m, resistance = 56, diameter = 2.5, voltage = 400
    // drop = (12.5 * 5000) / (56 * 2.5 * 400^2) * 100 = 62,500 / 22,400,000 * 100 = 0.279%
    expect(calculateVoltageDropPercent(cable, energyConsumption)).toBeCloseTo(
      0.279,
      3
    );
  });
});


describe("calculateTotalVoltageDropPercent", () => {
  it("", () => {
    expect(
      calculateTotalVoltageDropPercent(
        [
          new Cable(
            "cable-fake-0",
            25,
            { current: 16, voltage: 400 },
            "producer",
            "consumer-fake-1"
          ),

          new Cable(
            "cable-fake-1",
            25,
            { current: 16, voltage: 400 },
            "distributor-2",
            "consumer-fake-2"
          ),

          new Cable(
            "cable-1",
            25,
            { current: 16, voltage: 400 },
            "producer",
            "distributor-1"
          ),

          new Cable(
            "cable-2",
            25,
            { current: 16, voltage: 400 },
            "distributor-1",
            "distributor-2"
          ),

          new Cable(
            "cable-3",
            25,
            { current: 16, voltage: 400 },
            "distributor-2",
            "distributor-3"
          ),

          new Cable(
            "cable-4",
            25,
            { current: 16, voltage: 400 },
            "distributor-3",
            "distributor-4"
          ),

          new Cable(
            "cable-5",
            25,
            { current: 16, voltage: 400 },
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

describe("energy consumption", () => {
  const allElectroInterfaces: ElectroInterface[] = [
    new Consumer(
      "consumer-1",
      undefined,
      { x: 0, y: 0 },
      1005,
      7.3,
      undefined,
      { current: 16, voltage: 400 }
    ),
    new Consumer(
      "consumer-2",
      undefined,
      { x: 0, y: 0 },
      2020,
      9.3,
      undefined,
      { current: 16, voltage: 400 }
    ),
    new Consumer(
      "consumer-3",
      undefined,
      { x: 0, y: 0 },
      123,
      undefined,
      undefined,
      undefined
    ),
    new Distributor(
      "distributor-1",
      undefined,
      { x: 0, y: 0 },
      undefined,
      undefined
    ),
    new Distributor(
      "distributor-2",
      undefined,
      { x: 0, y: 0 },
      undefined,
      undefined
    ),
    new Producer("producer-1", undefined, { x: 0, y: 0 }, undefined, 12000),
  ];
  const outputEdges: Cable[] = [
    new Cable(
      "cable-0",
      25,
      { current: 16, voltage: 400 },
      "producer-1",
      "distributor-1"
    ),

    new Cable(
      "cable-1",
      25,
      { current: 16, voltage: 400 },
      "distributor-1",
      "consumer-1"
    ),

    new Cable(
      "cable-2",
      25,
      { current: 16, voltage: 400 },
      "distributor-1",
      "consumer-2"
    ),
  ];

  it("_getDependingConsumersValues", () => {
    const res = _getDependingConsumersValues(
      (consumer: Consumer) => consumer.energyConsumption,
      allElectroInterfaces,
      outputEdges
    );

    expect(res).toEqual(
      new Map([
        ["consumer-1", 1005],
        ["consumer-2", 2020],
      ])
    );
  });

  it("getRecursiveEnergyConsumption", () => {
    const res = getRecursiveEnergyConsumption(
      allElectroInterfaces,
      outputEdges,
      ["producer-1"]
    );
    expect(res).toEqual(
      new Map([
        ["producer-1", 1005 + 2020],
        ["distributor-1", 1005 + 2020],
        ["consumer-1", 1005],
        ["consumer-2", 2020],
      ])
    );
  });

  it("getRecursiveApparentPower", () => {
    const res = getRecursiveApparentPower(allElectroInterfaces, outputEdges, [
      "producer-1",
    ]);

    const roundedRes = new Map(
      Array.from(res.entries()).map(([key, value]) => [key, Math.round(value)])
    );

    expect(roundedRes).toEqual(
      new Map([
        ["producer-1", 11481],
        ["distributor-1", 11481],
        ["consumer-1", 5058],
        ["consumer-2", 6443],
      ])
    );
  });

  describe("getReactivePower consumer", () => {
    const consumer = new Consumer(
      "consumer-1",
      undefined,
      { x: 0, y: 0 },
      3200,
      7.3,
      undefined,
      { current: 16, voltage: 400 }
    );

    expect(consumer.getActivePower() / 1000).toEqual(3.2);
    expect(consumer.getApparentPower() / 1000).toBeCloseTo(5.06, 2);
    expect(consumer.getReactivePower() / 1000).toBeCloseTo(3.916, 2);
  });
});

describe("getPlugLabel", () => {
  it("should return format 230V/16A for normal single-phase plugs", () => {
    expect(getPlugLabel({ voltage: 230, current: 16 })).toEqual("230V/16A");
  });

  it("should return format 400V/63A for standard CEE plugs", () => {
    expect(getPlugLabel({ voltage: 400, current: 63 })).toEqual("400V/63A");
  });

  it("should return 400V 95mm² for current 288A at 400V", () => {
    expect(getPlugLabel({ voltage: 400, current: 288 })).toEqual("400V 95mm²");
  });

  it("should return 400V 120mm² for current 400A at 400V", () => {
    expect(getPlugLabel({ voltage: 400, current: 400 })).toEqual("400V 120mm²");
  });
});

