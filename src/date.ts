/**
 * Pads a string s by the character c, to return a string length at least n
 */
const leftPad = (s: string, c: string, n: number): string => {
  const repetitions = Math.max(0, Math.ceil((n - s.length) / c.length));
  return c.repeat(repetitions) + s;
};

/** Formats a date as YYYY-MM-DD */
export const dateString = (d: Date): string => {
  const year = leftPad(`${d.getFullYear()}`, "0", 4);
  const month = leftPad(`${d.getMonth() + 1}`, "0", 2);
  const date = leftPad(`${d.getDate()}`, "0", 2);
  return `${year}-${month}-${date}`;
};
