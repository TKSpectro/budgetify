export const roundOn2 = (number: number) => {
  return Math.round((number + Number.EPSILON) * 100) / 100;
};

export const uuidRegex =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
