import { useState } from "react";
import FlowMenuItem from "./FlowMenuItem";
import { ElectroType, translateElectroType } from "../../../lib/data/Electro";
import { Plug, allPossiblePlugs } from "../../../lib/data/Plug";
import { Predefined } from "../../../lib/data/Predefined";
import { generateId } from "../../../lib/utils";

type FlowMenuCreateFormProps = {
  electroType: ElectroType;
  addNode: (
    type: ElectroType,
    name: string,
    consumerEnergyConsumption: number | undefined,
    producerEnergyProduction: number | undefined,
    ratedPower: number | undefined,
    templateId: string | undefined,
    inputPlug: Plug | undefined
  ) => void;
  saveNodeAsPredefined: (predefined: Predefined) => void;
};

export default function FlowMenuCreateForm({
  electroType,
  addNode,
  saveNodeAsPredefined,
}: FlowMenuCreateFormProps) {
  const [name, setName] = useState<string>("");
  const [energyConsumption, setEnergyConsumption] = useState<
    string | undefined
  >(electroType == "Consumer" ? "3.2" : undefined);
  const [energyProduction, setEnergyProduction] = useState<string | undefined>(
    electroType == "Producer" ? "12" : undefined
  );
  const [ratedPower, setRatedPower] = useState<string | undefined>(
    electroType == "Consumer" ? "7.3" : undefined
  );

  const [defaultInputPlug, setDefaultInputPlug] = useState<number | undefined>(
    electroType != "Producer"
      ? allPossiblePlugs.findIndex(
          (plug) => plug.voltage === 400 && plug.current === 16
        )
      : undefined
  );

  function getParsedEnergyConsumption(): number | undefined {
    if (!energyConsumption) return undefined;

    const parsedEnergyConsumption = parseFloat(energyConsumption);
    if (isNaN(parsedEnergyConsumption)) {
      throw new Error("Invalid energy consumption");
    }
    return parsedEnergyConsumption * 1000;
  }

  function getParsedEnergyProduction(): number | undefined {
    if (!energyProduction) return undefined;

    const parsedEnergyProduction = parseFloat(energyProduction);
    if (isNaN(parsedEnergyProduction)) {
      throw new Error("Invalid energy production");
    }
    return parsedEnergyProduction * 1000;
  }

  function getParsedRatedPower(): number | undefined {
    if (!ratedPower) return undefined;

    const parsedRatedPower = parseFloat(ratedPower);
    if (isNaN(parsedRatedPower)) {
      throw new Error("Invalid rated power");
    }
    return parsedRatedPower;
  }

  return (
    <FlowMenuItem>
      <div className="text-xl font-bold">
        {translateElectroType(electroType)}
      </div>
      <div className="flex flex-col gap-1">
        <label>Name:</label>
        <input
          className="bg-thw text-white px-2 rounded-md"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      {electroType === "Consumer" && (
        <>
          <div className="flex flex-col gap-1">
            <label>Energiebedarf in kW:</label>
            <input
              className="bg-thw text-white px-2 rounded-md"
              value={energyConsumption}
              type="number"
              min={0}
              onChange={(e) => {
                const value = e.target.value;
                if (value.includes("-")) return;

                setEnergyConsumption(value);
              }}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label>Nennstrom in A:</label>
            <input
              className="bg-thw text-white px-2 rounded-md"
              value={ratedPower}
              type="number"
              min={0}
              onChange={(e) => {
                const value = e.target.value;
                if (value.includes("-")) return;

                setRatedPower(value);
              }}
            />
          </div>
        </>
      )}
      {electroType !== "Producer" && (
        <div className="flex flex-col gap-1">
          <label>Input Stecker:</label>
          <select
            className="bg-thw text-white p-1 rounded-md"
            value={defaultInputPlug}
            onChange={(event) =>
              setDefaultInputPlug(parseInt(event.target.value))
            }
          >
            {allPossiblePlugs.map((plug, index) => (
              <option key={index} value={index}>
                {`${plug.voltage}V/${plug.current}A`}
              </option>
            ))}
          </select>
        </div>
      )}
      {electroType == "Producer" && (
        <div className="flex flex-col gap-1">
          <label>Produktion in kVA:</label>
          <input
            className="bg-thw text-white px-2 py-0 rounded-md"
            value={energyProduction}
            type="number"
            min={0}
            onChange={(e) => {
              const value = e.target.value;
              if (value.includes("-")) return;

              setEnergyProduction(value);
            }}
          />
        </div>
      )}
      <div className="flex flex-row gap-2 mt-1">
        <thw-button
          type="primary"
          onClick={() =>
            addNode(
              electroType,
              name,
              getParsedEnergyConsumption(),
              getParsedEnergyProduction(),
              getParsedRatedPower(),
              undefined,
              defaultInputPlug !== undefined
                ? allPossiblePlugs[defaultInputPlug]
                : undefined
            )
          }
        >
          Hinzufügen
        </thw-button>
        <thw-button
          type="secondary"
          onClick={() =>
            saveNodeAsPredefined({
              id: generateId(electroType),
              type: electroType,
              name: name,
              defaultPlug:
                defaultInputPlug !== undefined
                  ? allPossiblePlugs[defaultInputPlug]
                  : undefined,
              energyConsumption: getParsedEnergyConsumption(),
              ratedPower: getParsedRatedPower(),
              energyProduction: getParsedEnergyProduction(),
            })
          }
        >
          Template speichern
        </thw-button>
      </div>
    </FlowMenuItem>
  );
}
