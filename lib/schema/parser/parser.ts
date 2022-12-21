import { Token, SyntaxNode, VirtualNodeChildren, VirtualNode } from 'lib/types';
import { s, t } from 'lib/model';
import { ClassName, NodeType, TagName } from 'lib/static';

const { LINE, PLAIN_TEXT, PREFIX, SUFFIX, BOLD } = NodeType;
const { DIV, SPAN, STRONG } = TagName;
const { RTE_HIDE, RTE_PLAIN_TEXT, RTE_LINE } = ClassName;

const getInlineNode = (
  content: VirtualNode,
  marker: string
): Array<VirtualNode> => {
  const prefix = s(PREFIX, SPAN, { classList: [] }, [
    t(SPAN, { classList: [RTE_PLAIN_TEXT] }, marker, 'bold 20px arial'),
  ]);
  const suffix = s(SUFFIX, SPAN, { classList: [] }, [
    t(SPAN, { classList: [RTE_PLAIN_TEXT] }, marker, 'bold 20px arial'),
  ]);

  // return [prefix, content, suffix];
  return [content];
};

const getLineNode = (children: VirtualNodeChildren): SyntaxNode => {
  return s(LINE, DIV, { classList: [RTE_LINE] }, children);
};

export const parser = (tokens: Array<Token>): SyntaxNode => {
  const children = tokens.reduce((children, token) => {
    const { type, content } = token;
    let stuff: VirtualNode = {} as VirtualNode;
    if (type === 'bold') {
      stuff = {
        type: BOLD,
        tagName: STRONG,
        props: { classList: ['r-bold'] },
        events: [],
        meta: {},

        children: [
          t(SPAN, { classList: ['r-plain-text'] }, content, 'bold 20px arial'),
        ],
        el: null,
        isActive: false,
      };
    } else if (type === 'plain-text') {
      stuff = {
        type: PLAIN_TEXT,
        tagName: SPAN,
        props: { classList: ['r-plain-text'] },
        meta: {},

        text: content,
        font: 'bold 20px arial',
        el: null,
      };
    }

    if (type === 'bold') {
      children.push(...getInlineNode(stuff, '**'));
    } else {
      children.push(stuff);
    }

    return children;
  }, [] as VirtualNode[]);

  return getLineNode(children);
};
