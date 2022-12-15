import { Token } from '../types/token';
import { VirtualNode, VirtualNodeChildren } from '../types/virtualNode';
import { EventName } from '../virtualNode/events/eventNames';
import { h } from '../virtualNode/h';

const clickHandler = (e: MouseEvent) => {
  console.log('click', e.target);
  const selection = document.getSelection();
  console.log(selection);
  selection?.removeAllRanges();
};

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
