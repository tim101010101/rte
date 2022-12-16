import { Token } from '../types/token';
import { VirtualNode, VirtualNodeChildren } from '../types/virtualNode';
import { h } from '../virtualNode/h';

const getInlineNode = (
  content: VirtualNode,
  marker: string
): Array<VirtualNode> => {
  const prefix = h('span', { classList: ['r-hide'] }, marker);
  const suffix = h('span', { classList: ['r-hide'] }, marker);

  content.marker = { prefix, suffix };

  return [prefix, content, suffix];
};

const getLineNode = (children: VirtualNodeChildren): VirtualNode => {
  return h(
    'div',
    // { classList: ['r-line-test'], contenteditable: 'true' },
    { classList: ['r-line-test'] },
    children
  );
};

export const parser = (tokens: Array<Token>): VirtualNode => {
  const children = tokens.reduce((children, token) => {
    const { type, content } = token;
    const stuff = {
      tagName: type === 'bold' ? 'strong' : 'span',
      props: { classList: type === 'bold' ? ['r-bold'] : ['r-plain-text'] },

      events: [],

      children: content,
      el: null,
      marker: null,
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
