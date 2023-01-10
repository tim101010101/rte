import { EditorConfig } from 'lib/types';
import { schema } from './schema';

export const defaultConfig: EditorConfig = {
  font: {
    size: 20,
    family: 'Arial, Helvetica, sans-serif',
  },
  container: '#editor',

  schema,
};
