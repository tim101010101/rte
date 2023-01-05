import { ActivePos, Pos } from 'lib/types';
import { activeSubTree, cancelActiveSubTree, isTextNode } from 'lib/model';

const tryCancelActiveSyntaxNode = (
  prevPos: Pos | null,
  curPos: Pos,
  active: ActivePos | null,
  isCrossLine: boolean,
  isClick: boolean
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

      // trigger by click
      if (isClick) {
        // leave the syntax node and jump to right
        // final position: offset - prefix - suffix
        //
        //* e.g.
        //*    1. from the head of the node
        //*         |_foo_ bar    =>  foo b|ar
        //*
        //*         |__foo__ bar  =>  foo bar|
        //*
        //*    2. from the body of the node
        //*         _fo|o_ bar    =>  foo |bar
        //*
        //*         __foo_|_ bar  =>  foo bar|
        //*
        //*         _|_foo__ bar  =>  foo bar|
        //*
        //*    3. from the tail of the node
        //*         _foo_| bar    =>  foo b|ar
        //*
        //*         __foo__| bar  =>  foo bar|
        if (curOffset > prevOffset) {
          finalPos = {
            block: curBlock,
            offset: curOffset - prefix - suffix,
          };
        }
      }

      // trigger by arrow key
      else {
        // leave the syntax node from the tail
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
  isCrossLine: boolean,
  isClick: boolean
): { pos: Pos; active: ActivePos | null } => {
  const { pos, active: curActive } = tryCancelActiveSyntaxNode(
    prevPos,
    curPos,
    active,
    isCrossLine,
    isClick
  );

  return tryActiveSyntaxNode(pos, curActive);
};
