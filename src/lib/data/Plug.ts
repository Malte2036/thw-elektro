export type Voltage = 230 | 400; // Voltage (U): Volts (V)
export type Current = 16 | 32 | 63 | 125 | 288 | 400; // Current (I): Amperes (A) (288A for 95mm², 400A for 120mm²)

export type Plug = {
  voltage: Voltage;
  current: Current;
};

export const allPossiblePlugs: Plug[] = [
  { voltage: 230, current: 16 },
  { voltage: 400, current: 16 },
  { voltage: 400, current: 32 },
  { voltage: 400, current: 63 },
  { voltage: 400, current: 125 },
  { voltage: 400, current: 288 },
  { voltage: 400, current: 400 },
];

export function getPlugLabel(plug: Plug): string {
  if (plug.voltage === 400 && plug.current === 288) {
    return "400V 95mm²";
  }
  if (plug.voltage === 400 && plug.current === 400) {
    return "400V 120mm²";
  }
  return `${plug.voltage}V/${plug.current}A`;
}

export function getNextCablePlug(plug: Plug): Plug {
  switch (plug.current) {
    case 16:
      if (plug.voltage === 230) return { voltage: 400, current: 16 };
      return { voltage: 400, current: 32 };
    case 32:
      return { voltage: 400, current: 63 };
    case 63:
      return { voltage: 400, current: 125 };
    case 125:
      return { voltage: 400, current: 288 };
    case 288:
      return { voltage: 400, current: 400 };
    case 400:
      return { voltage: 230, current: 16 };
    default:
      throw new Error(
        "Invalid current. Supported: 16A, 32A, 63A, 125A, 288A, 400A."
      );
  }
}

export function getPlugDiameter(plug: Plug): number {
  switch (plug.current) {
    case 16:
      return 2.5;
    case 32:
      return 6.0;
    case 63:
      return 16.0;
    case 125:
      return 35.0;
    case 288:
      return 95.0;
    case 400:
      return 120.0;
    default:
      throw new Error(
        "Invalid current. Supported: 16A, 32A, 63A, 125A, 288A, 400A."
      );
  }
}

