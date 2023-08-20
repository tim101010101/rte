import { schema } from 'lib/config/schema';
import { EditorConfig } from 'lib/types';

export const defaultConfig: EditorConfig = {
  font: {
    size: 20,
    family: 'Arial, Helvetica, sans-serif',
    bold: false,
    italic: false,
    color: '#000',
    textBaseline: 'bottom',
    textAlign: 'left',
  },
  page: {
    padding: 20,
    rowSpacing: 4,
  },
  container: '#editor',

  schema,
};
