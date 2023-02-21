import { isTextNode, walkTextNode } from 'lib/model';
import {
  ClientRect,
  Fence,
  FenceLeaf,
  VirtualNode,
  VirtualNodeBehavior,
} from 'lib/types';
import { panicAt, lastItem } from 'lib/utils';

export const calcFence = (
  vNode: VirtualNode,
  rectList: Array<ClientRect>
): Fence => {
  if (isTextNode(vNode)) {
    return panicAt('try to calculate the fence of a text node');
  }

  const fence: Fence = [];

  let textLength = 0;
  let prefixLength = 0;

  let prevPrefixChange = 0;
  let curPrefixChange = 0;

  const calcAncestorFence = (ancestor: VirtualNode) => {
    const fenceList: Array<FenceLeaf> = [];
    let totalLength = 0;

    const getRect = () => {
      if (
        fence.length &&
        !fenceList.length &&
        lastItem(fence).fenceList.length
      ) {
        return lastItem(lastItem(fence).fenceList).rect;
      }
      return rectList.shift()!;
    };

    walkTextNode(ancestor, textNode => {
      const { text, behavior } = textNode;

      if (
        isTextNode(ancestor) ||
        (!isTextNode(ancestor) && ancestor.isActive === true)
      ) {
        Array.from(text).forEach(() => {
          const prefixChange = curPrefixChange;
          const textOffset = textLength;
          const rect = getRect();

          if (isHidden(behavior)) {
            prevPrefixChange = curPrefixChange;
            curPrefixChange++;
          }

          fenceList.push({
            rect,
            textOffset,
            prefixChange,
          });

          textLength++;
        });
      } else {
        if (isHidden(behavior)) {
          prevPrefixChange = curPrefixChange;
          curPrefixChange += text.length;
          textLength += text.length;
        } else {
          Array.from(text).forEach(() => {
            const prefixChange = prevPrefixChange;
            const textOffset = textLength + prefixChange;
            const rect = getRect();

            fenceList.push({
              rect,
              textOffset,
              prefixChange,
            });

            textLength++;
          });
        }
      }

      totalLength += text.length;
    });

    fenceList.push({
      rect: getRect(),
      prefixChange: curPrefixChange,
      textOffset: textLength,
    });

    fence.push({
      fenceList,

      prefixLength,

      totalLength,
      totalChange: curPrefixChange,
    });

    prefixLength += fenceList.length;
  };

  if (vNode.children.length) {
    vNode.children.forEach(ancestor => {
      calcAncestorFence(ancestor);
      prevPrefixChange = 0;
      curPrefixChange = 0;
    });
  } else if (rectList.length) {
    fence.push({
      fenceList: [{ rect: rectList[0], textOffset: 0, prefixChange: 0 }],
      prefixLength: 0,
      totalLength: 0,
      totalChange: 0,
    });
  }

  return fence;
};

const isHidden = (behavior?: VirtualNodeBehavior) => {
  return behavior?.beforeActived?.show === false;
};
