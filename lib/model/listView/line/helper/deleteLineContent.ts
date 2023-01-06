import { removeAt } from 'lib/utils';
import { activeSubTree, isTextNode, textContentWithMarker } from 'lib/model';
import { ActivePos, FeedbackPos, Pos, SyntaxNode } from 'lib/types';
import { getOffsetWithMarker } from './getOffsetWithMarker';
import { getAncestorIdx } from './getAncestorIdx';

export const deleteLineContent = (
  { block, offset }: Pos,
  active: ActivePos | null,
  parser: (source: string) => SyntaxNode
): FeedbackPos => {
  const offsetWithMarker = getOffsetWithMarker(block, offset);
  const textContent = removeAt(
    textContentWithMarker(block.vNode),
    offsetWithMarker - 1
  );
  const line = parser(textContent);

  const ancestorIdx = getAncestorIdx(line, offsetWithMarker - 1, true);

  // node currently being edited needs to be reactivated
  if (!isTextNode(line.children[ancestorIdx])) {
    const { root } = activeSubTree(line, ancestorIdx);

    // syntax1 -> syntax2
    //
    //* e.g.
    //*    **a**|  =>  **a*
    if (active && active.ancestorIdx === ancestorIdx) {
      const { block, ancestorIdx } = active;
      const inactiveLength =
        offset -
        textContentWithMarker(block.vNode.children[ancestorIdx]).length;
      const curActiveLength = textContentWithMarker(
        line.children[ancestorIdx]
      ).length;

      block.patch(root);

      return {
        pos: {
          block,
          offset: inactiveLength + curActiveLength,
        },
        active: {
          block,
          ancestorIdx,
        },
      };
    }

    // common case
    else {
      block.patch(root);

      // reset active
      return {
        pos: {
          block,
          offset: offsetWithMarker - 1,
        },
        active: {
          block,
          ancestorIdx,
        },
      };
    }
  }

  // the node being edited is the text node
  else {
    block.patch(line);

    return {
      pos: {
        block,
        offset: offset - 1,
      },
      active: null,
    };
  }
};
