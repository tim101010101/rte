export interface Token {
  type: string;
  content: string;
  raw: string;
  loc: {
    start: number;
    end: number;
  };
}
