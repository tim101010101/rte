import { NodeType, TagName } from 'lib/static';
import {
  TextNode,
  VirtualNode,
  VirtualNodeEvents,
  VirtualNodeMarker,
  VirtualNodeMetaData,
  VirtualNodeProps,
} from 'lib/types';
import { s } from 'lib/model';

export type SchemaConfigRenderFunction = (
  groups: Record<string, string>
) => VirtualNode;

export interface SchemaConfigItem {
  reg: RegExp;
  render: SchemaConfigRenderFunction;
}

type FontInfo = Partial<{
  size: number;
  family: string;
  bold: boolean;
  italic: boolean;
}>;

export type ExportedText = (
  text: string,

  props?: VirtualNodeProps,
  meta?: VirtualNodeMetaData,

  font?: FontInfo
) => TextNode;

export interface SchemaConfig {
  inline: (
    syntax: typeof s,
    text: ExportedText
  ) => Record<string, SchemaConfigItem>;
  line: (
    inlineParser: (content: string, fontInfo?: FontInfo) => Array<VirtualNode>,
    syntax: typeof s,
    text: ExportedText
  ) => Record<string, SchemaConfigItem>;
  block: (
    syntax: typeof s,
    text: ExportedText
  ) => Record<string, SchemaConfigItem>;
}
