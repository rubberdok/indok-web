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
