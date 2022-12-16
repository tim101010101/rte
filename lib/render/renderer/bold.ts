import { Token, VirtualNode } from 'lib/types';
import { h } from 'lib/model';

export const bold = (token: Token): Array<VirtualNode> => {
  const { content } = token;
  return [
    h('span', { classList: ['r-hide'] }, '**'),
    h('strong', { classList: ['r-bold-test'] }, content),
    h('span', { classList: ['r-hide'] }, '**'),
  ];
};
