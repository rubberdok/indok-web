export const generateQueryString = (values: Record<string, any>): string => {
  const valueList: string[] = [];

  Object.keys(values).forEach((name) => {
    if (values[name]) {
      const value = typeof values[name] === "object" ? JSON.stringify(values[name]) : String(values[name]);
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

export const range = (start: number, end: number): number[] => {
  const res: number[] = [];
  for (let i = start; i <= end; i++) {
    res.push(i);
  }
  return res;
};
