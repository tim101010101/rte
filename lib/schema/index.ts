import { s, t } from 'lib/model';
import {
  EditorConfig,
  ExportedTextFunction,
  FontConfig,
  FontInfo,
  SchemaConfigItem,
  SyntaxNode,
} from 'lib/types';
import { mixin } from 'lib/utils';
import { parseInline, parseLine } from './parser';

export class Schema {
  private defaultFontInfo: FontInfo;
  private inline: SchemaConfigItem;
  private line: SchemaConfigItem;

  constructor(config: EditorConfig) {
    const {
      schema,
      render: { font },
    } = config;

    this.defaultFontInfo = {
      size: font.size,
      family: font.family,
      bold: false,
      italic: false,
    };

    const { inline, line } = schema;
    const exportedText: ExportedTextFunction = (
      content,
      fontInfo,
      behavior,
      style,
      events,
      meta
    ) => {
      return t(
        mixin(this.defaultFontInfo, fontInfo),
        content,

        behavior || {},

        style || {},
        events || [],
        meta || {}
      );
    };

    this.inline = inline(exportedText, s);
    this.line = line(exportedText, s);
  }

  parse(src: string): SyntaxNode {
    const inlineParser = (content: string, fontInfo?: FontConfig) =>
      parseInline(content, this.inline, this.defaultFontInfo, fontInfo);

    return parseLine(src, this.line, inlineParser);
  }
}
