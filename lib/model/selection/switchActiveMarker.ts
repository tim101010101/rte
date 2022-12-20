import { SetterFunction, SyntaxNode, TextNode, VirtualNode } from 'lib/types';
import { NodeType, TagName } from 'lib/static';
import {
  Block,
  deepCloneWithTrackNode,
  getParent,
  isMarkerTextNode,
  isPureTextNode,
  isTextNode,
  textContent,
} from 'lib/model';
import { get, has } from 'lib/utils';

const { SPAN } = TagName;
const { PLAIN_TEXT, PREFIX, SUFFIX, BOLD } = NodeType;

const marker = (text: string, isPrefix: boolean): SyntaxNode => {
  return {
    type: isPrefix ? PREFIX : SUFFIX,
    isActive: true,
    tagName: SPAN,
    props: {},
    el: null,
    meta: {},
    events: [],

    children: [
      {
        type: PLAIN_TEXT | (isPrefix ? PREFIX : SUFFIX),
        tagName: SPAN,
        props: {},
        el: null,
        meta: {},
        font: '',
        text,
      },
    ],
  };
};

export const activeSubTree = (root: VirtualNode) => {
  if (isTextNode(root)) return;

  const { type, isActive, children } = root;
  if (isActive === false) {
    root.children.unshift(marker(type & NodeType.BOLD ? '**' : '*', true));
    root.children.push(marker(type & NodeType.BOLD ? '**' : '*', false));
    root.isActive = true;
  }

  children.forEach(child => activeSubTree(child));
};

export const cancelActiveSubTree = (root: VirtualNode) => {
  if (isTextNode(root)) return;

  const { isActive, children } = root;
  if (isActive === true) {
    root.children.shift();
    root.children.pop();
    root.isActive = false;
  }

  children.forEach(child => cancelActiveSubTree(child));
};
