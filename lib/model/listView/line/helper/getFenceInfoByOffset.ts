import { Fence, FenceInfo, FenceInfoItem } from 'lib/types';
import { lastItem, panicAt } from 'lib/utils';

export const getFenceLength = (fence: Fence): number => {
  if (fence.length) {
    const { prefixLength, fenceList } = lastItem(fence);
    return prefixLength + fenceList.length;
  } else {
    return 0;
  }
};

// TODO to be optimized by binary-search
export const getFenceInfoByOffset = (
  fence: Fence,
  offset: number
): FenceInfo => {
  for (let i = 0; i < fence.length; i++) {
    const curFenceRoot = fence[i];
    const { fenceList } = curFenceRoot;

    if (offset >= fenceList.length - 1 && i !== fence.length - 1) {
      offset -= fenceList.length - 1;
    } else {
      const fenceInfoList: Array<FenceInfoItem> = [];

      // x x
      //   x x x
      //   ^
      if (i !== 0 && offset === 0) {
        const {
          totalChange: curChange,
          totalLength: curLength,
          fenceList: curFenceList,
        } = fence[i - 1];
        const {
          totalChange: nextChange,
          totalLength: nextLength,
          fenceList: nextFenceList,
        } = fence[i];
        const { textOffset, rect } = nextFenceList[offset];
        fenceInfoList.push(
          {
            ancestorIdx: i - 1,
            totalLength: curLength,
            totalChange: curChange,
            prefixChange: curFenceList[curFenceList.length - 1].prefixChange,
          },
          {
            ancestorIdx: i,
            totalLength: nextLength,
            totalChange: nextChange,
            prefixChange: nextFenceList[0].prefixChange,
          }
        );

        return {
          rect,
          textOffset,
          fenceInfoList,
        };
      }

      // other cases
      else {
        const {
          totalChange: curChange,
          totalLength: curLength,
          fenceList: curFenceList,
        } = fence[i];
        const { textOffset, rect } = curFenceList[offset];

        fenceInfoList.push({
          ancestorIdx: i,
          totalLength: curLength,
          totalChange: curChange,
          prefixChange: curFenceList[offset].prefixChange,
        });

        return {
          rect,
          textOffset,
          fenceInfoList,
        };
      }
    }
  }

  return panicAt('offset out of bound');
};
