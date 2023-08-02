import { ReactNode } from "react";
import { ElectroInterface, ElectroType } from "./Electro";
import { Plug } from "./Plug";
import { formatNumberWithMaxTwoDecimals } from "../utils";
import { Consumer } from "./Consumer";
import { Distributor } from "./Distributor";
import { Producer } from "./Producer";

export type Predefined = {
  id: string;
  type: ElectroType;
  name: string | undefined;
  defaultPlug: Plug | undefined;
  energyConsumption?: number;
  energyProduction?: number;
  ratedPower?: number
};

export function electroInterfaceToPredefined(
  electroInterface: ElectroInterface
): Predefined {
  switch (electroInterface.type) {
    case "Consumer":
      const c = electroInterface as Consumer;
      return {
        id: c.id,
        type: c.type,
        name: c.name,
        defaultPlug: c.inputPlug,
        energyConsumption: c.energyConsumption,
        energyProduction: undefined,
      };
    case "Distributor":
      const d = electroInterface as Distributor;
      return {
        id: d.id,
        type: d.type,
        name: d.name,
        defaultPlug: d.inputPlug,
        energyConsumption: undefined,
        energyProduction: undefined
      };
    case "Producer":
      const p = electroInterface as Producer;
      return {
        id: p.id,
        type: p.type,
        name: p.name,
        defaultPlug: undefined,
        energyConsumption: undefined,
        energyProduction: p.energyProduction,
      };
    default:
      throw new Error("Unknown electro interface type: " + electroInterface.type);
  }
}

export function getBodyFromPredefined(predefined: Predefined): ReactNode {
  const plug = predefined.defaultPlug;

  const defaultPlugText =
    plug === undefined ? (
      ""
    ) : (
      <div>
        Input Stecker: {plug.voltage}V/{plug.current}A
      </div>
    );

  switch (predefined.type) {
    case "Consumer":
      const energyConsumption = predefined.energyConsumption;
      if (energyConsumption === undefined) {
        throw new Error("Energy consumption is undefined");
      }

      return (
        <>
          <div>
            Energiebedarf:{" "}
            {formatNumberWithMaxTwoDecimals(energyConsumption / 1000)}kW
          </div>
          <div>
            Nennstrom:{" "}
            {formatNumberWithMaxTwoDecimals(predefined.ratedPower ?? 0)}A
          </div>
          {defaultPlugText}
        </>
      );
    case "Distributor":
      return <>{defaultPlugText}</>;
    case "Producer":
      const energyProduction = predefined.energyProduction;
      if (energyProduction === undefined) {
        throw new Error("Energy production is undefined");
      }

      return (
        <>
          <div>
            Produktion:{" "}
            {formatNumberWithMaxTwoDecimals(energyProduction / 1000)}kVA
          </div>
        </>
      );
    default:
      throw new Error("Invalid type " + predefined.type);
  }
}
