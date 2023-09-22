export enum FlowMenuHeaderOptions {
  Predefined = "Templates",
  Create = "Erstellen",
  Settings = "Einstellungen",
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
          <thw-button
            onClick={() => {
              selectOptionCallback(option);
            }}
            type={option === selectedOption ? "secondary" : "primary"}
            key={option}
          >
            <div className={option === selectedOption ? "font-bold" : ""}>
              {option}
            </div>
          </thw-button>
        ))}
      </div>
    </>
  );
}
