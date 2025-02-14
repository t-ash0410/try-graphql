export const assertNever = (_: never) => {
  return new Error('This code should not be called')
}
