import { isTextNode } from '../utils';
import { NodeType, TagName } from '../../../static';
import { SyntaxNode, TextNode } from 'lib/types';

const { PLAIN_TEXT, BOLD, PREFIX, SUFFIX } = NodeType;
const { SPAN } = TagName;

describe('utils', () => {
  const s = (type: number, children = []): SyntaxNode => {
    return {
      type,
      tagName: SPAN,
      props: {},
      font: '',
      meta: {},

      el: null,
      isActive: false,
      events: [],
      children,
      marker: {},
    };
  };
  const t = (type: number, text = ''): TextNode => {
    return {
      type,
      tagName: SPAN,
      props: {},
      meta: {},

      el: null,
      text,
      font: '',
      events: [],
    };
  };

  test('isTextNode', () => {
    expect(isTextNode(t(PLAIN_TEXT))).toBeTruthy();
    expect(isTextNode(t(BOLD))).toBeFalsy();
  });
});
