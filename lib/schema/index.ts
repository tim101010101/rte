import { s, t } from 'lib/model';
import { ClassName } from 'lib/static';
import { parseInline, parseLine } from 'lib/schema/parser';
import {
  EditorConfig,
  ExportedText,
  FontConfig,
  FontInfo,
  SchemaConfig,
  SyntaxNode,
  TextNode,
} from 'lib/types';
import { mixin } from 'lib/utils';

export class Schema {
  private rules: SchemaConfig;
  private defaultFontInfo: FontInfo;
  private exportedText: ExportedText;
  private defaultText: (content: string) => TextNode;

  constructor(schemaConfig: SchemaConfig, fontInfo: EditorConfig['font']) {
    this.rules = schemaConfig;
    this.defaultFontInfo = {
      size: fontInfo.size,
      family: fontInfo.family,
      bold: false,
      italic: false,
    };

    this.exportedText = (children, props, meta, fontInfo) => {
      return t(
        mixin(this.defaultFontInfo, fontInfo),
        children,
        props || { classList: [] },
        [],
        meta || {}
      );
    };

    this.defaultText = content =>
      t(this.defaultFontInfo, content, {
        classList: [ClassName.RTE_PLAIN_TEXT],
      });
  }

  parse(src: string): SyntaxNode {
    const inlineParser = (content: string, fontInfo?: FontConfig) =>
      parseInline(
        content,
        this.rules.inline(s, this.exportedText),
        this.defaultFontInfo,
        fontInfo
      );

    return parseLine(src, this.rules.line(s, this.exportedText), inlineParser);
  }
}
