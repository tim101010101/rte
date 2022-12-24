import { s, t } from 'lib/model';
import { SchemaConfig, SchemaConfigItem, VirtualNode } from 'lib/types';
import { entries } from 'lib/utils';
import { NodeType, TagName, ClassName } from 'lib/static';

const { LINE, PLAIN_TEXT } = NodeType;
const { DIV, SPAN } = TagName;
const { RTE_LINE } = ClassName;

export class Schema {
  private rules: Array<[RegExp, SchemaConfigItem]>;

  constructor(schemaConfig: SchemaConfig) {
    this.rules = Array.from(
      entries(schemaConfig).map(([k, v]) => [new RegExp(`^${k}`), v])
    );
  }

  // TODO
  parse(text: string): VirtualNode {
    const defaultInline = [
      /^(?<content>.*?)/,
      {
        type: PLAIN_TEXT,
        key: PLAIN_TEXT,
        render(matched: RegExpMatchArray) {
          return t(SPAN, {}, 'plain-text');
        },
      },
    ];
    const defaultLine = [
      /^(?<content>.*?)\n/,
      {
        type: LINE,
        key: LINE,
        render(matched: RegExpMatchArray) {
          return s(LINE, DIV, {}, [t(SPAN, {}, 'line')]);
        },
      },
    ];

    // TODO
    const matchedRules = this.rules.filter(([r]) => r.test(text));
    console.log(matchedRules);
    if (!matchedRules.length) {
    } else {
    }

    return s(LINE, DIV, { classList: [RTE_LINE] });
  }
}

export * from './parser1';
