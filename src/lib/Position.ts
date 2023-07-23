export type Position = {
  x: number;
  y: number;
};

export function getRandomPosition() {
  return {
    x: Math.random() * 1000,
    y: Math.random() * 1000,
  };
}
