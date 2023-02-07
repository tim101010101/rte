import {
  isSyntaxNodeWithLayerActivation,
  isTextNode,
  walkTextNode,
} from 'lib/model';
import {
  ClientRect,
  Fence,
  FenceLeaf,
  VirtualNode,
  VirtualNodeBehavior,
} from 'lib/types';
import { panicAt } from 'lib/utils';

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

  let needToFixPrefixChange = false;
  let lastContentPrefixChange = 0;

  const calcAncestorFence = (ancestor: VirtualNode) => {
    const fenceList: Array<FenceLeaf> = [];
    let totalLength = 0;
    let totalChange = 0;

    walkTextNode(ancestor, textNode => {
      const { text, behavior } = textNode;

      if (
        isTextNode(ancestor) ||
        (!isTextNode(ancestor) && ancestor.isActive === true)
      ) {
        Array.from(text).forEach(() => {
          const rect = rectList[textLength - curPrefixChange];
          const prefixChange = curPrefixChange;
          const textOffset = textLength;

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
            const rect = rectList[textLength - curPrefixChange];
            const prefixChange = prevPrefixChange;
            const textOffset = textLength + prefixChange;

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

    if (needToFixPrefixChange) {
      fenceList[0].prefixChange = lastContentPrefixChange;
      needToFixPrefixChange = false;
    }

    fenceList.length &&
      fenceList.push({
        rect: rectList[textLength - curPrefixChange],
        prefixChange: curPrefixChange,
        textOffset: textLength,
      });

    fence.push({
      totalLength,
      totalChange: curPrefixChange,
      fenceList,
      prefixLength,
    });

    prefixLength += totalLength;
  };

  if (isSyntaxNodeWithLayerActivation(vNode)) {
    vNode.content.forEach(ancestor => {
      prevPrefixChange = 0;
      curPrefixChange = 0;
      calcAncestorFence(ancestor);

      needToFixPrefixChange = isTextNode(ancestor) ? false : !ancestor.isActive;
    });
    lastContentPrefixChange = curPrefixChange;
    prevPrefixChange = curPrefixChange;
    curPrefixChange = 0;
  }
  vNode.children.forEach(ancestor => {
    calcAncestorFence(ancestor);
    prevPrefixChange = 0;
    curPrefixChange = 0;
  });

  return fence;
};

const isHidden = (behavior?: VirtualNodeBehavior) => {
  return behavior?.beforeActived?.show === false;
};
