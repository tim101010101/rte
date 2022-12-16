import { VirtualNode, Token } from 'lib/types';
import { h } from 'lib/model';

export const plainText = (token: Token): Array<VirtualNode> => {
  const { content } = token;
  return [h('span', { classList: ['r-plain-text'] }, content)];
};
