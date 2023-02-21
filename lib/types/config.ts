// import { SchemaConfig } from 'lib/types';

export interface EditorConfig {
  font: {
    size: number;
    family: string;
    bold: boolean;
    italic: boolean;
    color: string;
    textBaseline: CanvasTextBaseline;
    textAlign: CanvasTextAlign;
  };

  page: {
    padding: number;
    rowSpacing: number;
  };

  container: string;

  schema: any;
}
