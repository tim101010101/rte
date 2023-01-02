import { insertAt, panicAt } from 'lib/utils';
import { activeSubTree, isTextNode, textContentWithMarker } from 'lib/model';
import { ActivePos, Pos, SyntaxNode } from 'lib/types';

// TODO redundancy
const getAncestorIdx = (root: SyntaxNode, fenceOffset: number) => {
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

export const tryActiveWhenInput = (
  { block, offset }: Pos,
  char: string,
  parser: (src: string) => SyntaxNode
): ActivePos | null => {
  const textContent = insertAt(
    textContentWithMarker(block.vNode),
    offset,
    char
  );
  const line = parser(textContent);

  const ancestorIdx = getAncestorIdx(line, offset);

  // node hit by the cursor needs to be activated
  if (!isTextNode(line.children[ancestorIdx])) {
    const { root } = activeSubTree(line, ancestorIdx);
    block.patch(root);

    // reset active
    return {
      block,
      ancestorIdx,
    };
  }

  // there is no any node need to activate
  else {
    block.patch(line);

    return null;
  }
};
