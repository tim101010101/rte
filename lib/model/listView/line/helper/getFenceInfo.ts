import { panicAt } from 'lib/utils';
import { Fence, FenceInfo } from 'lib/types';

export const getLineFenceInfo = (fence: Fence, offset: number): FenceInfo => {
  const len = fence.length;
  const last = fence[len - 1];

  if (offset < 0 || offset > last.prefixLength + last.fenceList.length) {
    return panicAt('cursor offset was out of bound');
  }

  let left = 0;
  let right = len - 1;
  while (left <= right) {
    const mid = ~~((left + right) / 2);
    const { vNode, rect, prefixLength, fenceList } = fence[mid];
    if (offset >= prefixLength && offset < prefixLength + fenceList.length) {
      const remainOffset = offset - prefixLength;
      const { textOffset, cursorOffset } = fenceList[remainOffset];
      return {
        vNode,
        rect,
        prefixLength,
        ancestorIdx: mid,
        textOffset,
        cursorOffset,
        hitPos:
          remainOffset === 0
            ? -1
            : remainOffset === fenceList.length - 1
            ? 1
            : 0,
      };
    } else if (offset < prefixLength) {
      right = mid - 1;
    } else if (offset >= prefixLength + fenceList.length) {
      left = mid + 1;
    }
  }

  return panicAt('cursor offset was out of bound');
};
