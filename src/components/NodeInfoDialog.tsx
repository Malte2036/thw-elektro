import { ReactNode } from "react";
import { useDialogContext } from "../hooks/useDialog";
import { ElectroInterface, getTitleForElectro } from "../lib/data/Electro";
import Button from "./Button";
import Dialog from "./Dialog";
import { formatNumberWithMaxTwoDecimals } from "../lib/utils";
import { Consumer } from "../lib/data/Consumer";
import { isVoltageDropTooHigh } from "../lib/calculation/voltageDrop";
import { Distributor } from "../lib/data/Distributor";
import { Producer } from "../lib/data/Producer";

type NodeInfoDialogProps = {
  electroInterface: ElectroInterface;
};

export default function NodeInfoDialog({
  electroInterface,
}: NodeInfoDialogProps) {
  const dialogContent = useDialogContext();

  function getBody(): ReactNode {
    switch (electroInterface.type) {
      case "Consumer": {
        const consumer = electroInterface as Consumer;
        const totalVoltageDrop = consumer.totalVoltageDrop ?? 0;
        return (
          <>
            <div>
              Last:{" "}
              {formatNumberWithMaxTwoDecimals(
                consumer.energyConsumption / 1000
              )}
              kW
            </div>
            <div
              className={
                isVoltageDropTooHigh(totalVoltageDrop)
                  ? "text-red-600 font-bold"
                  : ""
              }
            >
              Spannungsfall {formatNumberWithMaxTwoDecimals(totalVoltageDrop)}%
            </div>
            <div>
              Nennstrom:{" "}
              {formatNumberWithMaxTwoDecimals(consumer.ratedPower ?? 0)}A
            </div>
            <div>
              Scheinleistung:{" "}
              {formatNumberWithMaxTwoDecimals(
                consumer.getApparentPower() / 1000
              )}
              kVA
            </div>
            <div>
              Wirkleistung:{" "}
              {formatNumberWithMaxTwoDecimals(consumer.getActivePower() / 1000)}
              kW
            </div>
            <div>
              Blindleistung:{" "}
              {formatNumberWithMaxTwoDecimals(
                consumer.getReactivePower() / 1000
              )}
              kVAR
            </div>
          </>
        );
      }
      case "Distributor": {
        const distributor = electroInterface as Distributor;
        return (
          <>
            <div>
              Last:{" "}
              {formatNumberWithMaxTwoDecimals(distributor.energyFlow / 1000)}kW
            </div>
            <div
              className={`${
                distributor.energyFlow > distributor.allowedEnergyFlow
                  ? "text-red-600 font-bold"
                  : "opacity-75"
              }`}
            >
              max Leistung:{" "}
              {formatNumberWithMaxTwoDecimals(
                distributor.allowedEnergyFlow / 1000
              )}
              kW
            </div>
            <div>
              Scheinleistung:{" "}
              {distributor.apparentPower
                ? formatNumberWithMaxTwoDecimals(
                    distributor.apparentPower / 1000
                  )
                : ""}
              kVA
            </div>
          </>
        );
      }
      case "Producer": {
        const producer = electroInterface as Producer;
        return (
          <>
            <div>
              Last: {formatNumberWithMaxTwoDecimals(producer.energyFlow / 1000)}
              kW
            </div>
            <div
              className={`${
                producer.energyFlow > producer.allowedEnergyFlow
                  ? "text-red-600 font-bold"
                  : "opacity-75"
              }`}
            >
              max Leistung:{" "}
              {formatNumberWithMaxTwoDecimals(
                producer.allowedEnergyFlow / 1000
              )}
              kW
            </div>
            <div className="opacity-75">
              Produktion:{" "}
              {formatNumberWithMaxTwoDecimals(producer.energyProduction / 1000)}
              kVA
            </div>
            <div>
              Scheinleistung:{" "}
              {producer.apparentPower
                ? formatNumberWithMaxTwoDecimals(producer.apparentPower / 1000)
                : ""}
              kVA
            </div>
          </>
        );
      }
    }
  }

  return (
    <Dialog
      title={getTitleForElectro(electroInterface)}
      footer={
        <Button type="primary" onClick={() => dialogContent?.closeDialog()}>
          Okay
        </Button>
      }
    >
      <div className="flex flex-col gap-4">
        {/*<div>{getBodyFromPredefined(electroInterfaceToPredefined(electroInterface))}</div>*/}
        <div>{getBody()}</div>
      </div>
    </Dialog>
  );
}
