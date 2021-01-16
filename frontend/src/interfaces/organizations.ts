export interface Organization {
  id: string;
  name: string;
  children?: Organization[];
}
