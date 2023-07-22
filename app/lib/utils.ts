export function sumArray(array: number[]) {
  return array.reduce(
    (accumulator, currentValue) => accumulator + currentValue,
    0
  );
}

export function toTargetSourceString(source: string, target: string) {
  return `${source} -> ${target}`;
}

export function generateId(prefix: string) {
  return `${prefix}-${Date.now().toString()}-${(Math.random() * 1000).toFixed(
    0
  )}`;
}
