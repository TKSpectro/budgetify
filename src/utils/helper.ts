export const roundOn2 = (number: number) => {
  return Math.round((number + Number.EPSILON) * 100) / 100;
};
