import { s, t } from 'lib/model';
import { ClassName } from 'lib/static';
import { parseInline, parseLine } from 'lib/schema/parser';
import {
  EditorConfig,
  ExportedText,
  SchemaConfig,
  SyntaxNode,
  TextNode,
} from 'lib/types';

type FontConfig = EditorConfig['font'];

export class Schema {
  private rules: SchemaConfig;
  private exportedH: ExportedText;
  private defaultText: (content: string) => TextNode;

  constructor(schemaConfig: SchemaConfig, fontInfo: FontConfig) {
    this.rules = schemaConfig;
    this.exportedH = getExportText(fontInfo);
    this.defaultText = content =>
      t(getFont(fontInfo.size, fontInfo.family, false, false), content, {
        classList: [ClassName.RTE_PLAIN_TEXT],
      });
  }

  // TODO
  parse(src: string): SyntaxNode {
    const inlineParser = (content: string) =>
      parseInline(
        content,
        this.rules.inline(s, this.exportedH),
        this.defaultText
      );

    return parseLine(
      src,
      this.rules.line((content, fontInfo) => {}, s, t),
      inlineParser
    );
  }
}

const getFont = (
  size: number,
  family: string,
  bold: boolean,
  italic: boolean
) => {
  return `${size}px ${italic ? 'italic' : 'normal'} ${
    bold ? 'bold' : 'normal'
  } ${family}`;
};

const getExportText = (defaultFontInfo: FontConfig): ExportedText => {
  const { family: defaultFamily, size: defaultSize } = defaultFontInfo;

  return (children, props, meta, fontInfo) => {
    let font = '';
    if (fontInfo) {
      const { family, size, bold, italic } = fontInfo;
      font = getFont(
        size ? size : defaultSize,
        family ? family : defaultFamily,
        !!italic,
        !!bold
      );
    } else {
      font = getFont(defaultSize, defaultFamily, false, false);
    }

    return t(font, children, props || { classList: [] }, [], meta || {});
  };
};
