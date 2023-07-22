import { Button } from "@/components/Button";

export enum FlowMenuHeaderOptions {
  Predefined = "Template Page",
  Create = "Erstellen Page",
}

export type FlowMenuHeaderProps = {
  selectedOption: FlowMenuHeaderOptions;
  selectOptionCallback: (option: FlowMenuHeaderOptions) => void;
};

export default function FlowMenuHeader({
  selectedOption,
  selectOptionCallback,
}: FlowMenuHeaderProps) {
  const allOptions = Object.values(FlowMenuHeaderOptions);

  return (
    <>
      <div className="text-2xl font-bold">Elektro Spannungsfall</div>
      <div className="flex flex-row gap-2">
        {allOptions.map((option) => (
          <Button
            onClick={() => {
              selectOptionCallback(option);
            }}
            type={option === selectedOption ? "secondary" : "primary"}
            key={option}
          >
            {option}
          </Button>
        ))}
      </div>
    </>
  );
}
