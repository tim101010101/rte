import { SchemaConfig } from 'lib/types';

export interface EditorConfig {
  font: {
    size: number;
    family: string;
  };
  container: string;

  schema: SchemaConfig;
}
