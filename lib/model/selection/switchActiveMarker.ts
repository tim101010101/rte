import { SyntaxNode, VirtualNode } from 'lib/types';
import { NodeType, TagName } from 'lib/static';
import { isTextNode } from 'lib/model';

const { SPAN } = TagName;
const { PLAIN_TEXT, PREFIX, SUFFIX, BOLD } = NodeType;

const syntaxMarker = (
  text: string,
  isPrefix: boolean,
  font: string
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
        font,
        text,
      },
    ],
  };
};

export const activeSubTree = (root: VirtualNode) => {
  if (isTextNode(root)) return;

  const { isActive, children, marker } = root;
  const { prefix, suffix } = marker;
  if (!isActive) {
    prefix && root.children.unshift(syntaxMarker(prefix, true, '20px arial'));
    suffix && root.children.push(syntaxMarker(suffix, false, '20px arial'));
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
