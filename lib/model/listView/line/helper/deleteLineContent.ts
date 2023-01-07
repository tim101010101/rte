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

  // line.children[ancestorIdx] is the node currently being edited
  const ancestorIdx = getAncestorIdx(line, offsetWithMarker - 1, true);

  // node currently being edited needs to be reactivated
  if (!isTextNode(line.children[ancestorIdx])) {
    const { root } = activeSubTree(line, ancestorIdx);

    // tranform from syntax1 to syntax2
    //
    //* e.g.
    //*    **a**|  =>  **a*|
    //*
    //*    a**b**|  =>  a**b*|
    //*
    //*    **a** __b__|  =>  **a** __b_|
    if (active && active.ancestorIdx === ancestorIdx) {
      const { block, ancestorIdx } = active;

      // length of the unactivated part
      //
      //* e.g.
      //*    source: a**b**
      //*    view: a**b**|
      //*      offset = 6
      //*      ancestorIdx = 1
      //*      block.vNode.children[ancestorIdx] = <**b**>
      //*      textContentWithMarker(<**b**>) = 5
      //*      inactiveLength = 1 = textLen(<a>)
      //*
      //*    source: **a** __b__
      //*    view: a __b__|
      //*      offset = 7
      //*      ancestorIdx = 2
      //*      block.vNode.children[ancestorIdx] = <__b__>
      //*      textContentWithMarker(<__b__>) = 5
      //*      inactiveLength = 2 = textLen(<a >)
      const inactiveLength =
        offset -
        textContentWithMarker(block.vNode.children[ancestorIdx]).length;

      // length of the part has been activated and is being edited
      //
      //* e.g.
      //*    a**b**|  =>  a**b*|
      //*      ancestorIdx = 1
      //*      line.children[ancestorIdx] = <**b*>
      //*      textContentWithMarker(<**b*>) = 4
      const curActiveLength = textContentWithMarker(
        line.children[ancestorIdx]
      ).length;

      block.patch(root);

      // need to reset the offset
      // otherwise, will panic at "out of bound"
      //
      //* e.g.
      //*    a**b**|  =>  a**b*|
      //*    offset = 6
      //*    offset expected to be returned = 5
      //*
      //*    inactiveLength  = 1 = textLen(<a>)
      //*    curActiveLength = 4 = textLen(<**b*>)
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

    // other case
    // no special treatment is required
    // but the activation needs to be reseted
    //
    //* e.g.
    //*    **a**b|  =>  **a**|
    //*       null  =>  0
    else {
      block.patch(root);

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
  //
  //* e.g.
  //*        foo|  =>  fo|
  //*
  //*    foo bar|  =>  foo ba|
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
