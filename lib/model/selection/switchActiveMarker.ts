import { FontInfo, SyntaxNode, VirtualNode } from 'lib/types';
import { NodeType, TagName } from 'lib/static';
import { isTextNode } from 'lib/model';

const { SPAN } = TagName;
const { PLAIN_TEXT, PREFIX, SUFFIX } = NodeType;

const syntaxMarker = (
  text: string,
  isPrefix: boolean,
  fontInfo: FontInfo
): SyntaxNode => {
  return {
    type: isPrefix ? PREFIX : SUFFIX,
    isActive: true,
    tagName: SPAN,
    props: {},
    el: null,
    meta: {},
    events: [],
    marker: {},

    children: [
      {
        type: PLAIN_TEXT,
        tagName: SPAN,
        props: {},
        el: null,
        meta: {},
        font: fontInfo,
        text,
        events: [],
      },
    ],
  };
};

export const activeSubTree = (root: VirtualNode) => {
  if (isTextNode(root)) return;

  const { isActive, children, marker } = root;
  const { prefix, suffix } = marker;
  if (!isActive) {
    // TODO font info
    prefix &&
      root.children.unshift(
        syntaxMarker(prefix, true, {
          size: 20,
          family: 'Arial, Helvetica, sans-serif',
          bold: false,
          italic: false,
        })
      );
    suffix &&
      root.children.push(
        syntaxMarker(suffix, false, {
          size: 20,
          family: 'Arial, Helvetica, sans-serif',
          bold: false,
          italic: false,
        })
      );
    root.isActive = true;
  }

  children.forEach(child => activeSubTree(child));
};

export const cancelActiveSubTree = (root: VirtualNode) => {
  if (isTextNode(root)) return;

  const { isActive, children } = root;
  if (isActive) {
    root.children.shift();
    root.children.pop();
    root.isActive = false;
  }

  children.forEach(child => cancelActiveSubTree(child));
};
