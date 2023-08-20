export type HeaderValuePair<T> = {
  header: string;
  field: keyof T;
};
