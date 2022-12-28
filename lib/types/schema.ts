import {
  FontInfo,
  SyntaxFunction,
  SyntaxNode,
  TextNode,
  VirtualNode,
  VirtualNodeMetaData,
  VirtualNodeProps,
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

  props?: VirtualNodeProps,
  meta?: VirtualNodeMetaData,

  font?: FontConfig
) => TextNode;

type SchemaConfigFunction = (
  syntax: SyntaxFunction,
  text: ExportedTextFunction
) => SchemaConfigItem;

export interface SchemaConfig {
  inline: SchemaConfigFunction;
  line: SchemaConfigFunction;
  block: SchemaConfigFunction;
}
