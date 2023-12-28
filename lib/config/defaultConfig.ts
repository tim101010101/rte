import { EditorConfig } from 'lib/types';
import { schema } from './schema';

export const defaultConfig: EditorConfig = {
  container: '#editor',

  render: {
    isLazy: true,

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
  },

  schema,
};
