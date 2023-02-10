import { Fence, FenceInfo } from 'lib/types';
import { lastItem, panicAt } from 'lib/utils';

export const getFenceLength = (fence: Fence): number => {
  if (fence.length) {
    const { prefixLength, fenceList } = lastItem(fence);
    return prefixLength + fenceList.length - fence.length;
  } else {
    return 0;
  }
};

export const getFenceInfoByOffset = (
  fence: Fence,
  offset: number
): FenceInfo => {
  let left = 0;
  let right = fence.length - 1;

  while (left <= right) {
    const mid = ~~((left + right) / 2);
    const cur = fence[mid];
    const start = cur.prefixLength - mid;
    const end = start + cur.fenceList.length - 1;

    if (offset > end) {
      left = mid + 1;
    } else if (offset < start) {
      right = mid - 1;
    } else {
      const specificIndex = offset - start;
      const { fenceList } = cur;

      // x x
      //   x x
      //   ^
      //   |
      if (mid !== 0 && specificIndex === 0) {
        const prev = lastItem(fence[mid - 1].fenceList);
        const cur = fenceList[specificIndex];
        const { rect, textOffset } = cur;

        return {
          rect,
          textOffset,
          fenceInfoList: [
            {
              ancestorIdx: mid - 1,
              totalLength: fence[mid - 1].totalLength,
              totalChange: fence[mid - 1].totalChange,
              prefixChange: prev.prefixChange,
            },
            {
              ancestorIdx: mid,
              totalLength: fence[mid].totalLength,
              totalChange: fence[mid].totalChange,
              prefixChange: cur.prefixChange,
            },
          ],
        };
      }

      // x x
      //   ^
      //   |
      //   x x
      else if (
        mid !== fence.length - 1 &&
        specificIndex === fenceList.length - 1
      ) {
        const cur = fenceList[specificIndex];
        const next = fence[mid + 1].fenceList[0];
        const { rect, textOffset } = cur;

        return {
          rect,
          textOffset,
          fenceInfoList: [
            {
              ancestorIdx: mid,
              totalLength: fence[mid].totalLength,
              totalChange: fence[mid].totalChange,
              prefixChange: cur.prefixChange,
            },
            {
              ancestorIdx: mid + 1,
              totalLength: fence[mid + 1].totalLength,
              totalChange: fence[mid + 1].totalChange,
              prefixChange: next.prefixChange,
            },
          ],
        };
      }

      // x x x
      //     x x x
      //   ^
      //   |
      else {
        const cur = fenceList[specificIndex];
        const { rect, textOffset } = cur;

        return {
          rect,
          textOffset,
          fenceInfoList: [
            {
              ancestorIdx: mid,
              totalLength: fence[mid].totalLength,
              totalChange: fence[mid].totalChange,
              prefixChange: cur.prefixChange,
            },
          ],
        };
      }
    }
  }

  return panicAt('offset out of bound');
};
