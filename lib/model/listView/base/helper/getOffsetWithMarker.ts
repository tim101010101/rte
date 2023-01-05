import { isTextNode, walkTextNode } from 'lib/model';
import { Operable } from 'lib/types';

// abcd
export const getOffsetWithMarker = (block: Operable, offset: number) => {
  let hasFound = false;
  let curOffset = 0;

  walkTextNode(block.vNode, (textNode, parent) => {
    if (hasFound) return;

    const { text } = textNode;
    let isActive = true;
    let prefix;
    let suffix;

    if (parent) {
      const { marker } = parent;
      isActive = parent.isActive;
      prefix = marker.prefix;
      suffix = marker.suffix;
    }

    if (!isActive && prefix) {
      curOffset += prefix.length;
    }

    if (offset <= text.length) {
      hasFound = true;
      curOffset += offset;
    } else {
      offset -= text.length;
      curOffset += text.length;
    }

    if (!isActive && suffix) {
      curOffset += suffix.length;
    }
  });

  return curOffset;
};
