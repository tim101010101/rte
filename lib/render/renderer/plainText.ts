import { VirtualNode } from '../../types';
import { Token } from '../../types/token';
import { h } from '../../virtualNode/h';

export const plainText = (token: Token): Array<VirtualNode> => {
  const { content } = token;
  return [h('span', { classList: ['r-plain-text'] }, content)];
};
