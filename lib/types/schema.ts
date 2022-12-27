import { VirtualNode } from 'lib/types';

export type SchemaConfigRenderFunction = (
  groups: Record<string, string>,
  children: Array<VirtualNode>
) => VirtualNode;
export interface SchemaConfigItem {
  reg: RegExp;
  render: SchemaConfigRenderFunction;
}

export interface SchemaConfig {
  inline: Record<string, SchemaConfigItem>;
  line: Record<string, SchemaConfigItem>;
  block: Record<string, SchemaConfigItem>;
}
