import { ActivePos, Pos } from 'lib/types';
import { activeSubTree, cancelActiveSubTree, isTextNode } from 'lib/model';

const tryCancelActiveSyntaxNode = (
  prevPos: Pos | null,
  curPos: Pos,
  active: ActivePos | null,
  isCrossLine: boolean
) => {
  let finalPos = curPos;
  let finalActive = active;

  const { block: curBlock, offset: curOffset } = curPos;
  const { ancestorIdx: curAncestorIdx } = curBlock.getFenceInfo(curOffset);

  // cancel active(cross line)
  //
  //* e.g.
  //*   _foo|_  =>   foo
  //*   bar     =>   bar|
  if (isCrossLine && active) {
    const { root } = cancelActiveSubTree(
      active.block.vNode,
      active.ancestorIdx
    );

    // patch previous line
    active.block.patch(root);
    // reset active
    finalActive = null;
  }

  // cancel active(same line)
  //
  //* e.g.
  //*   _foo_| bar  =>  foo |bar
  //*
  //*   foo |_bar_  =>  foo| bar
  else if (active && curAncestorIdx !== active.ancestorIdx) {
    const { root, prefix, suffix } = cancelActiveSubTree(
      active.block.vNode,
      active.ancestorIdx
    );

    if (prevPos) {
      const { block: prevBlock, offset: prevOffset } = prevPos;
      const { hitPos } = prevBlock.getFenceInfo(prevOffset);

      // leave the syntax node on the right
      // final position: offset - prefix - suffix
      //
      //* e.g.
      //*   _foo_| bar  =>  foo |bar
      if (hitPos === 1) {
        finalPos = {
          block: curBlock,
          offset: curOffset - prefix - suffix,
        };
      }
    }

    // patch active line
    active.block.patch(root);
    // reset active
    finalActive = null;
  }

  return {
    pos: finalPos,
    active: finalActive,
  };
};

const tryActiveSyntaxNode = (curPos: Pos, active: ActivePos | null) => {
  const { block: curBlock, offset: curOffset } = curPos;
  const { vNode, ancestorIdx, hitPos } = curBlock.getFenceInfo(curOffset);

  let resPos = curPos;
  let resActive = active;

  // active
  if (!isTextNode(vNode) && !resActive) {
    const { root, prefix, suffix } = activeSubTree(
      curPos.block.vNode,
      ancestorIdx
    );

    // hit the body of syntax node
    // final position: offset + prefix
    //
    //* e.g.
    //*   f|oo  =>  __f|oo__
    //*
    //*   fo|o  =>  __fo|o__
    if (hitPos === 0) {
      resPos = {
        block: curPos.block,
        offset: curOffset + prefix,
      };
    }

    // hit the tail of syntax node
    // final position: offset + prefix + suffix
    //
    //* e.g.
    //*   foo|  =>  __foo__|
    else if (hitPos === 1) {
      resPos = {
        block: curPos.block,
        offset: curOffset + prefix + suffix,
      };
    }

    // hit the head of syntax node
    // final position: offset
    //
    //* e.g.
    //*   |foo  =>  |__foo__
    else {
      resPos = {
        block: curPos.block,
        offset: curOffset,
      };
    }

    // patch current line
    curBlock.patch(root);
    // reset active
    resActive = {
      block: curBlock,
      ancestorIdx: ancestorIdx,
    };
  }

  return {
    pos: resPos,
    active: resActive,
  };
};

export const trySwitchActiveSyntaxNode = (
  prevPos: Pos | null,
  curPos: Pos,
  active: ActivePos | null,
  isCrossLine: boolean
): { pos: Pos; active: ActivePos | null } => {
  const { pos, active: curActive } = tryCancelActiveSyntaxNode(
    prevPos,
    curPos,
    active,
    isCrossLine
  );

  return tryActiveSyntaxNode(pos, curActive);
};
