export function sumArray(array: number[]) {
  return array.reduce(
    (accumulator, currentValue) => accumulator + currentValue,
    0
  );
}
