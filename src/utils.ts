export class UnreachableError extends Error {
  constructor(val: never) {
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    super(`Unreachable code detected ${val}`);
  }
}
