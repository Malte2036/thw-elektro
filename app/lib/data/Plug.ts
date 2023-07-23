export type Voltage = 230 | 400; // Voltage (U): Volts (V)
export type Current = 16 | 32 | 63; // Current (I): Amperes (A)

export type Plug = {
  voltage: Voltage;
  current: Current;
};

export function getNextCablePlug(plug: Plug): Plug {
  switch (plug.current) {
    case 16:
      if (plug.voltage === 230) return { voltage: 400, current: 16 };
      return { voltage: 400, current: 32 };
    case 32:
      return { voltage: 400, current: 63 };
    case 63:
      return { voltage: 230, current: 16 };
    default:
      throw new Error("Invalid current. Only 16A, 32A and 63A are supported.");
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
    default:
      throw new Error("Invalid current. Only 16A, 32A and 63A are supported.");
  }
}
