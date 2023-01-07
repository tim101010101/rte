import { activeSubTree, isTextNode, textContentWithMarker } from 'lib/model';
import { insertAt } from 'lib/utils';
import { ActivePos, FeedbackPos, Pos, SyntaxNode } from 'lib/types';
import { getOffsetWithMarker } from './getOffsetWithMarker';
import { getAncestorIdx } from './getAncestorIdx';

export const updateLineContent = (
  { block, offset }: Pos,
  active: ActivePos | null,
  char: string,
  parser: (source: string) => SyntaxNode
): FeedbackPos => {
  const offsetWithMarker = getOffsetWithMarker(block, offset);
  const textContent = insertAt(
    textContentWithMarker(block.vNode),
    offsetWithMarker,
    char
  );
  const line = parser(textContent);

  // line.children[ancestorIdx] is the node currently being edited
  const ancestorIdx = getAncestorIdx(line, offsetWithMarker, false);

  // node hit by the cursor needs to be activated while it's a syntax node
  //
  //* e.g.
  //*      a*b|  =>  a*b*|
  //*
  //*    a**b*|  =>  a**b**|
  if (!isTextNode(line.children[ancestorIdx])) {
    const { root } = activeSubTree(line, ancestorIdx);
    block.patch(root);

    // reset active
    return {
      pos: {
        block,
        offset: offset + 1,
      },
      active: {
        block,
        ancestorIdx,
      },
    };
  }

  // there is no any node need to activate
  else {
    block.patch(line);

    // need to switch activation
    //
    //* e.g.
    //*    **a**|c  =>  ab|c
    //*
    //*    **a*|*c  =>  **a*b|*c (This grammar is not standard, it's just an example)
    if (active && active.ancestorIdx !== ancestorIdx) {
      const { block, ancestorIdx } = active;
      // node can be activated must be the syntax node
      const { marker } = block.vNode.children[ancestorIdx] as SyntaxNode;

      const prefix = marker.prefix ? marker.prefix.length : 0;
      const suffix = marker.suffix ? marker.suffix.length : 0;

      return {
        pos: {
          block,
          offset: offset - prefix - suffix + 1,
        },
        active: null,
      };
    }

    // ordinary case
    //
    //* e.g.
    //*    ab|  => abc|
    else {
      return {
        pos: {
          block,
          offset: offset + 1,
        },
        active: null,
      };
    }
  }
};
