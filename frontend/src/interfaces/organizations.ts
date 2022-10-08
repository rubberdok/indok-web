export interface Organization {
  id: string;
  name: string;
  description: string;
  color: string | null;
  children?: Organization[];
  slug: string;
  logoUrl?: string;
}
