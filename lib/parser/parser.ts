import { Token, VirtualNode, VirtualNodeChildren } from 'lib/types';
import { h } from 'lib/model';
import { ClassName, NodeType, TagName } from 'lib/static';

const { LINE, PLAIN_TEXT, PREFIX, SUFFIX, BOLD } = NodeType;
const { DIV, SPAN, STRONG } = TagName;
const { RTE_HIDE } = ClassName;

const getInlineNode = (
  content: VirtualNode,
  marker: string
): Array<VirtualNode> => {
  const prefix = h(
    PLAIN_TEXT & PREFIX,
    SPAN,
    { classList: [RTE_HIDE] },
    marker
  );
  const suffix = h(
    PLAIN_TEXT & SUFFIX,
    SPAN,
    { classList: [RTE_HIDE] },
    marker
  );

  return [prefix, content, suffix];
};

const getLineNode = (children: VirtualNodeChildren): VirtualNode => {
  return h(LINE, DIV, { classList: ['r-line-test'] }, children);
};

export const parser = (tokens: Array<Token>): VirtualNode => {
  const children = tokens.reduce((children, token) => {
    const { type, content } = token;
    const stuff = {
      type: type === 'bold' ? BOLD : PLAIN_TEXT,
      tagName: type === 'bold' ? STRONG : SPAN,
      props: { classList: type === 'bold' ? ['r-bold'] : ['r-plain-text'] },

      events: [],

      children: content,
      el: null,
    };

    if (type === 'bold') {
      children.push(...getInlineNode(stuff, '**'));
    } else {
      children.push(stuff);
    }

    return children;
  }, [] as VirtualNode[]);

  return getLineNode(children);
};
