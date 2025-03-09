export class UnreachableError extends Error {
  constructor(val: never) {
    super(`Unreachable code detected ${val}`);
  }
}
