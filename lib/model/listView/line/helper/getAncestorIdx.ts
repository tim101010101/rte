import { panicAt } from 'lib/utils';
import { textContentWithMarker } from 'lib/model';
import { SyntaxNode } from 'lib/types';

export const getAncestorIdx = (
  root: SyntaxNode,
  offset: number,
  withTail: boolean
) => {
  const { children } = root;
  for (let i = 0; i < children.length; i++) {
    const cur = children[i];
    const len = textContentWithMarker(cur).length;

    if (withTail) {
      if (offset > len) {
        offset -= len;
      } else {
        return i;
      }
    } else {
      if (offset >= len) {
        offset -= len;
      } else {
        return i;
      }
    }
  }

  return panicAt('cursor offset was out of bound');
};
