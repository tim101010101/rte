import { EditorConfig } from '../types/config';
import { schema } from './schema';

export const defaultConfig: EditorConfig = {
  font: '20px arial',
  container: '#editor',

  schema,
};
