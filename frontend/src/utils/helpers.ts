export const toQuery = (values: Record<string, string | null | undefined | number>): string => {
  const valueList: string[] = [];

  Object.keys(values).forEach((name) => {
    if (values[name]) {
      const value = values[name];
      valueList.push(`${name}=${value}`);
    }
  });
  return "?" + valueList.join("&");
};

export const allValuesDefined = (obj: Record<string, any>): boolean => {
  let empty = true;
  Object.values(obj).forEach((val) => {
    if (val === undefined && val != 0) {
      empty = false;
    }
  });
  return empty;
};

export const range = (start: number, stop: number, step = 1) =>
  Array.from({ length: (stop - start) / step + 1 }, (_, i) => start + i * step);
