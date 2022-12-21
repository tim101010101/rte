import { s, t } from 'lib/model';
import { NodeType, TagName, ClassName } from 'lib/static';

const { BOLD } = NodeType;
const { SPAN } = TagName;
const { RTE_PLAIN_TEXT, RTE_BOLD } = ClassName;

const config = {
  schema: [
    {
      key: 'bold',
      marker: {
        prefix: '**',
        suffix: '**',
      },
      render(text: string) {
        return s(BOLD, SPAN, { classList: [RTE_BOLD] }, [
          t(SPAN, { classList: [RTE_PLAIN_TEXT] }, text),
        ]);
      },
    },
  ],
};

export class Schema {
  constructor() {
    // TODO
  }
}

export * from './parser';
