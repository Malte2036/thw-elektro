export function sumArray(array: number[]) {
  return array.reduce(
    (accumulator, currentValue) => accumulator + currentValue,
    0
  );
}

export function toTargetSourceString(source: string, target: string) {
  return `${source} -> ${target}`;
}

export function getNodeNameById(
  id: string,
  prefix: "consumer" | "distributor" | "producer"
) {
  if (id.startsWith(`${prefix}-random-`)) {
    return "";
  }
  return id.replace(`${prefix}-`, "");
}
