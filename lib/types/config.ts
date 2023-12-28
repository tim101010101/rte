// import { SchemaConfig } from 'lib/types';

export interface EditorConfig {
  container: string;

  render: {
    isLazy: boolean;

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
  };

  schema: any;
}
