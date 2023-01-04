import { SchemaConfig } from 'lib/types';
import { line } from './line';
import { inline } from './inline';
import { block } from './block';

export const schema: SchemaConfig = {
  inline,
  line,
  block,
};
