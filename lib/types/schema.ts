import { NodeType, TagName } from 'lib/static';
import {
  FontInfo,
  SyntaxNode,
  TextNode,
  VirtualNode,
  VirtualNodeEvents,
  VirtualNodeMarker,
  VirtualNodeMetaData,
  VirtualNodeProps,
} from 'lib/types';
import { s } from 'lib/model';

export type FontConfig = Partial<FontInfo>;

export type ExportedText = (
  text: string,

  props?: VirtualNodeProps,
  meta?: VirtualNodeMetaData,

  font?: FontConfig
) => TextNode;

export type InlineSchemaConfig = Record<
  string,
  {
    reg: RegExp;
    render: (
      groups: Record<string, string>,
      parsingRecursively: (
        src: string,
        fontConfig?: FontConfig
      ) => Array<VirtualNode>
    ) => SyntaxNode;
  }
>;

export type LineSchemaConfig = Record<
  string,
  {
    reg: RegExp;
    render: (
      groups: Record<string, string>,
      parseInlineWithOverloadFont: (
        content: string,
        fontConfig?: FontConfig
      ) => Array<VirtualNode>
    ) => SyntaxNode;
  }
>;

export type BlockSchemaConfig = Record<
  string,
  {
    reg: RegExp;
    render: (
      groups: Record<string, string>,
      parseInlineWithOverloadFont: (
        content: string,
        fontConfig?: FontConfig
      ) => Array<SyntaxNode>
    ) => SyntaxNode;
  }
>;

export interface SchemaConfig {
  inline: (syntax: typeof s, text: ExportedText) => InlineSchemaConfig;
  line: (syntax: typeof s, text: ExportedText) => LineSchemaConfig;
  block: () => BlockSchemaConfig;
}
