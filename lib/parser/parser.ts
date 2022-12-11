import { Token } from '../types/token';
import { VirtualNode, VirtualNodeChildren } from '../types/virtualNode';
import { h } from '../virtualNode/h';

const getInlineNode = (
  content: VirtualNode,
  marker: string
): Array<VirtualNode> => {
  return [
    h('span', { classList: ['r-hide'] }, marker),
    content,
    h('span', { classList: ['r-hide'] }, marker),
  ];
};

const getLineNode = (children: VirtualNodeChildren): VirtualNode => {
  return h(
    'div',
    { classList: ['r-line-test'], contenteditable: 'true' },
    children
  );
};

export const parser = (tokens: Array<Token>): VirtualNode => {
  const children = tokens.reduce((children, token) => {
    const { type, content } = token;
    const stuff = {
      tagName: type === 'bold' ? 'strong' : 'span',
      props: {},

      events: [],

      children: content,
      el: null,
    };

    children.push(...getInlineNode(stuff, '**'));

    return children;
  }, [] as VirtualNode[]);

  return getLineNode(children);
};
