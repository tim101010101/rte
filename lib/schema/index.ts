import { s, t } from 'lib/model';
import { parseInline, parseLine } from 'lib/schema/parser';
import {
  EditorConfig,
  ExportedTextFunction,
  FontConfig,
  FontInfo,
  SchemaConfig,
  SchemaConfigItem,
  SyntaxNode,
} from 'lib/types';
import { mixin } from 'lib/utils';

export class Schema {
  private defaultFontInfo: FontInfo;
  private inline: SchemaConfigItem;
  private line: SchemaConfigItem;

  constructor(schemaConfig: SchemaConfig, fontInfo: EditorConfig['font']) {
    this.defaultFontInfo = {
      size: fontInfo.size,
      family: fontInfo.family,
      bold: false,
      italic: false,
    };

    const { inline, line } = schemaConfig;
    const exportedText: ExportedTextFunction = (
      children,
      props,
      meta,
      fontInfo
    ) => {
      return t(
        mixin(this.defaultFontInfo, fontInfo),
        children,
        props || { classList: [] },
        [],
        meta || {}
      );
    };

    this.inline = inline(s, exportedText);
    this.line = line(s, exportedText);
  }

  parse(src: string): SyntaxNode {
    const inlineParser = (content: string, fontInfo?: FontConfig) =>
      parseInline(content, this.inline, this.defaultFontInfo, fontInfo);

    return parseLine(src, this.line, inlineParser);
  }
}
