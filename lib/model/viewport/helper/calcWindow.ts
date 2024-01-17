import { Operable, VirtualNode } from 'lib/types';
import { max, warningAt } from 'lib/utils';

interface Edges {
  top: Operable;
  bottom: Operable;
  gap: number;
  excess: number;
}

//! FIXME: docs/roadmap/2024/1-17.md
export const calcWindow = (
  window: Edges,
  expectOffset: number,
  viewportHeight: number,
  getHeight: (vNode: VirtualNode) => number
): Edges => {
  const {
    top: prevTop,
    bottom: prevBottom,
    gap: prevGap,
    excess: prevExcess,
  } = window;

  if (expectOffset !== 0 && prevBottom.next && prevExcess < 0) {
    expectOffset = 0;
    warningAt('init first plz');
  }

  if (
    (expectOffset < 0 && !prevTop.prev && prevGap === 0) ||
    (expectOffset > 0 && !prevBottom.next && prevExcess === 0)
  ) {
    return window;
  }

  if (!prevTop.prev && prevGap < 0) return window;
  if (!prevBottom.next && !prevExcess && !expectOffset) return window;

  let bottom = prevBottom;
  let excess = prevExcess;

  let top = prevTop;
  let gap = prevGap;

  if (expectOffset >= 0) {
    let dist = expectOffset - prevExcess;
    let actualOffset = 0;
    while (bottom?.next && dist > 0) {
      const height = getHeight(bottom.next.vNode);
      actualOffset += height;
      bottom = bottom.next;
      dist -= height;
    }

    // It didn't fill the whole window.
    // And it also didn't fill after moving `bottom`.
    // There is no need to move.
    if (prevExcess < 0 && prevExcess + actualOffset <= 0) {
      expectOffset = 0;
    }

    if (!bottom?.next && actualOffset === 0) {
      expectOffset = 0;
    }

    if (!bottom?.next && actualOffset < expectOffset) {
      excess = 0;
    } else {
      excess = prevExcess + actualOffset - expectOffset;
    }
  } else {
    let dist = -expectOffset - prevGap;
    let actualOffset = 0;
    while (top?.prev && dist > 0) {
      const height = getHeight(top.prev.vNode);
      actualOffset += height;
      top = top.prev;
      dist -= height;
    }

    gap = max(prevGap - actualOffset + expectOffset, 0);
  }

  if (expectOffset > 0) {
    top = bottom!;

    let totalHeight = getHeight(top.vNode) - excess;
    while (top.prev && totalHeight < viewportHeight) {
      totalHeight += getHeight(top.prev.vNode);
      top = top.prev;
    }
    gap = max(totalHeight - viewportHeight, 0);
  } else if (expectOffset < 0) {
    bottom = top!;

    let totalHeight = getHeight(bottom.vNode) - gap;
    while (bottom.next && totalHeight < viewportHeight) {
      totalHeight += getHeight(bottom.next.vNode);
      bottom = bottom.next;
    }
    excess = max(totalHeight - viewportHeight, 0);
  }

  return {
    top,
    bottom,

    gap,
    excess,
  };
};
