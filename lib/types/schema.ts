import { VirtualNode, VirtualNodeChildren } from 'lib/types';

export interface SchemaConfigItem {
  reg: RegExp;
  render(matched: RegExpMatchArray, children: VirtualNodeChildren): VirtualNode;
}

export interface SchemaConfig {
  inline: Record<string, SchemaConfigItem>;
  line: Record<string, SchemaConfigItem>;
  block: Record<string, SchemaConfigItem>;
}
