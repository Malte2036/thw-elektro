export function sumArray(array: number[]) {
  return array.reduce(
    (accumulator, currentValue) => accumulator + currentValue,
    0
  );
}

export function toTargetSourceString(source: string, target: string) {
  return `${source} -> ${target}`;
}
