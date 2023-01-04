import { panicAt } from 'lib/utils';
import { textContentWithMarker } from 'lib/model';
import { SyntaxNode } from 'lib/types';

export const getAncestorIdx = (root: SyntaxNode, fenceOffset: number) => {
  const { children } = root;
  for (let i = 0; i < children.length; i++) {
    const cur = children[i];
    const len = textContentWithMarker(cur).length;
    if (fenceOffset >= len) {
      fenceOffset -= len;
    } else {
      return i;
    }
  }

  return panicAt('cursor offset was out of bound');
};
