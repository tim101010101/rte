import { t } from 'lib/model';
import { TagName, ClassName } from 'lib/static';
import { parseInline, parseLine } from 'lib/schema/parser';
import { SchemaConfig, SyntaxNode, TextNode } from 'lib/types';

export class Schema {
  private rules: SchemaConfig;
  private text: (content: string) => TextNode;

  constructor(schemaConfig: SchemaConfig, font: string) {
    this.rules = schemaConfig;
    this.text = (content: string) =>
      t(TagName.SPAN, font, content, { classList: [ClassName.RTE_PLAIN_TEXT] });
  }

  // TODO
  parse(src: string): SyntaxNode {
    const inlineParser = (content: string) =>
      parseInline(content, this.rules.inline, this.text);

    return parseLine(src, this.rules.line, inlineParser);
  }
}
