import {
  _getDependingConsumersValues,
  calculatePowerInWatt,
  calculateTotalVoltageDropPercent,
  calculateVoltageDropPercent,
  getRecursiveApparentPower,
  getRecursiveEnergyConsumption,
} from "../../src/lib/calculation/energy";
import { Cable } from "../../src/lib/data/Cable";
import { Consumer } from "../../src/lib/data/Consumer";
import { Distributor } from "../../src/lib/data/Distributor";
import { ElectroInterface } from "../../src/lib/data/Electro";
import { Plug } from "../../src/lib/data/Plug";
import { Producer } from "../../src/lib/data/Producer";
import { toTargetSourceString } from "../../src/lib/utils";

describe("calculatePowerInWatt", () => {
  it("", () => {
    const plug: Plug = { current: 16, voltage: 230 };

    expect(calculatePowerInWatt(plug)).toEqual(3680);
  });
});

describe("calculateVoltageDrop", () => {
  it("", () => {
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
        ["producer-1", 11501],
        ["distributor-1", 11501],
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

  /*describe("getReactivePower distributor", () => {
    const consumer = new Consumer(
      "consumer-1",
      undefined,
      { x: 0, y: 0 },
      3200,
      7.3,
      undefined,
      { current: 16, voltage: 400 }
    );
    const consumer2 = new Consumer(
      "consumer-2",
      undefined,
      { x: 0, y: 0 },
      5300,
      9.3,
      undefined,
      { current: 16, voltage: 400 }
    );
    const distributor = new Distributor(
      "distributor-1",
      undefined,
      { x: 0, y: 0 },
      undefined,
      { current: 32, voltage: 400 }
    );

    expect(
      distributor.getApparentPower([consumer, consumer2]) / 1000
    ).toBeCloseTo(11.39, 2);
  });*/
});
