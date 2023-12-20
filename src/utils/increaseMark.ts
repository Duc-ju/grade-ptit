import getRandomInRange from "./getRandomInRange";

export default function increaseMark(oldMark: number | undefined) {
  if (oldMark === 4) return undefined;
  if (oldMark === 3.7) return [undefined, 4][getRandomInRange(0, 1)];
  if (oldMark === 3.5) return [undefined, 3.7, 4][getRandomInRange(0, 2)];
  return [3.5, 3.7, 4][getRandomInRange(0, 2)];
}
