import { s, t } from 'lib/model';
import { parseInline, parseLine } from 'lib/schema/parser';
import {
  EditorConfig,
  ExportedTextFunction,
  FontConfig,
  FontInfo,
  SchemaConfig,
  SyntaxNode,
} from 'lib/types';
import { mixin } from 'lib/utils';

export class Schema {
  private rules: SchemaConfig;
  private defaultFontInfo: FontInfo;

  constructor(schemaConfig: SchemaConfig, fontInfo: EditorConfig['font']) {
    this.rules = schemaConfig;
    this.defaultFontInfo = {
      size: fontInfo.size,
      family: fontInfo.family,
      bold: false,
      italic: false,
    };
  }

  parse(src: string): SyntaxNode {
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

    const inlineParser = (content: string, fontInfo?: FontConfig) =>
      parseInline(
        content,
        this.rules.inline(s, exportedText),
        this.defaultFontInfo,
        fontInfo
      );

    return parseLine(src, this.rules.line(s, exportedText), inlineParser);
  }
}
