export const lt = (value: number) => String(Number(value.toFixed(8))).replace('.', ',');

export function task(expression: string, value: number, hint: string, steps: string) {
  const answer = lt(value);
  return { expression, answer, hint, solution: steps + answer + '.' };
}

type Family = (variant: number) => ReturnType<typeof task>;
export function lesson(title: string, opening: string, explanation: string, families: [Family, Family, Family]) {
  const blocks = [opening, explanation];
  for (const family of families) {
    const example = family(2);
    blocks.push(example.expression, example.hint + ' ' + example.solution);
  }
  // Each of ten round slots has five distinct variants in the shared rotation.
  const questions = Array.from({ length: 50 }, (_, index) => {
    const slot = index % 10;
    const round = Math.floor(index / 10);
    const group = slot < 4 ? 0 : slot < 7 ? 1 : 2;
    const start = [0, 4, 7][group];
    const width = [4, 3, 3][group];
    return families[group](3 + round * width + slot - start);
  });
  return {title, blocks, questions};
}
