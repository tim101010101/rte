import {
  FontInfo,
  SyntaxFunction,
  SyntaxNode,
  TextNode,
  VirtualNode,
  VirtualNodeBehavior,
  VirtualNodeEvents,
  VirtualNodeMetaData,
  VirtualNodeStyle,
} from 'lib/types';

export type FontConfig = Partial<FontInfo>;

export type SchemaConfigItem = Record<
  string,
  {
    reg: RegExp;
    render: (
      groups: Record<string, string>,
      parseInlineWithOverloadFont: (
        src: string,
        fontConfig?: FontConfig
      ) => Array<VirtualNode>
    ) => SyntaxNode;
  }
>;

export type ExportedTextFunction = (
  text: string,

  font?: FontConfig,
  behavior?: VirtualNodeBehavior,

  style?: VirtualNodeStyle,
  events?: VirtualNodeEvents,
  meta?: VirtualNodeMetaData
) => TextNode;

type SchemaConfigFunction = (
  text: ExportedTextFunction,
  syntax: SyntaxFunction
) => SchemaConfigItem;

export interface SchemaConfig {
  inline: SchemaConfigFunction;
  line: SchemaConfigFunction;
  block: SchemaConfigFunction;
}
