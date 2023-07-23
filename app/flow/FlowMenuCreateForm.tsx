import { useEffect, useState } from "react";
import FlowMenuItem from "./FlowMenuItem";
import { Button } from "@/components/Button";
import { ElectroType, translateElectroType } from "../lib/data/Electro";
import { Plug, allPossiblePlugs } from "../lib/data/Plug";
import { Predefined } from "../lib/data/Predefined";
import { generateId } from "../lib/utils";

type FlowMenuCreateFormProps = {
  electroType: ElectroType;
  addNode: (
    type: ElectroType,
    name: string,
    consumerEnergyConsumption: number | undefined,
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
  >(electroType == "Consumer" ? "5.2" : undefined);

  function getParsedEnergyConsumption(): number | undefined {
    if (!energyConsumption) return undefined;

    const parsedEnergyConsumption = parseFloat(energyConsumption);
    if (isNaN(parsedEnergyConsumption)) {
      throw new Error("Invalid energy consumption");
    }
    return parsedEnergyConsumption * 1000;
  }

  const [defaultInputPlug, setDefaultInputPlug] = useState<number | undefined>(
    undefined
  );

  return (
    <FlowMenuItem>
      <div className="text-xl font-bold">
        {translateElectroType(electroType)}
      </div>
      <label>Name:</label>
      <input
        className="bg-thw text-white px-2 rounded-md"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      {electroType === "Consumer" && (
        <>
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
        </>
      )}
      {electroType !== "Producer" && (
        <>
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
        </>
      )}
      <div className="flex flex-row gap-2">
        <Button
          type="primary"
          onClick={() =>
            addNode(
              electroType,
              name,
              getParsedEnergyConsumption(),
              undefined,
              undefined
            )
          }
        >
          Hinzufügen
        </Button>
        <Button
          type="secondary"
          onClick={() =>
            saveNodeAsPredefined({
              id: generateId(electroType),
              type: electroType,
              name: name,
              defaultPlug: defaultInputPlug
                ? allPossiblePlugs[defaultInputPlug]
                : undefined,
              energyConsumption: getParsedEnergyConsumption(),
            })
          }
        >
          Template speichern
        </Button>
      </div>
    </FlowMenuItem>
  );
}
