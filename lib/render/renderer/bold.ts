import { VirtualNode } from '../../types';
import { Token } from '../../types/token';
import { h } from '../../virtualNode/h';

export const bold = (token: Token): Array<VirtualNode> => {
  const { content } = token;
  return [
    h('span', { classList: ['r-hide'] }, '**'),
    h('strong', { classList: ['r-bold-test'] }, content),
    h('span', { classList: ['r-hide'] }, '**'),
  ];
};
