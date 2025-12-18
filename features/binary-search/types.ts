
export interface SearchStep {
  low: number;
  high: number;
  mid: number | null;
  message: string;
  found: boolean;
  notFound: boolean;
}

export interface ArrayElement {
  id: string;
  value: number;
}
