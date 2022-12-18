import { SyntaxNode, TextNode, VirtualNode } from 'lib/types';
import { NodeType, TagName } from 'lib/static';
import { deepCloneWithTrackNode, isTextNode } from 'lib/model';

const { SPAN } = TagName;
const { PLAIN_TEXT, PREFIX, SUFFIX, BOLD } = NodeType;

const textNode = (text: string): TextNode => {
  return {
    type: PLAIN_TEXT,
    tagName: SPAN,
    props: {},
    el: null,
    meta: {},
    font: '',
    text,
  };
};

const marker = (text: string, isPrefix: boolean): SyntaxNode => {
  return {
    type: isPrefix ? PREFIX : SUFFIX,
    isActive: false,
    tagName: SPAN,
    props: {},
    el: null,
    meta: {},
    events: [],

    children: [textNode(text)],
  };
};

const switchActiveByPath = (root: VirtualNode, path: Array<number>) => {
  let cur = root;
  while (path.length !== 1) {
    if (!isTextNode(cur)) {
      cur = cur.children[path.pop()!];
    }
  }

  if (isTextNode(cur)) return root;

  const { isActive } = cur;
  if (isActive) {
    cur.children.pop();
    cur.children.shift();
    cur.isActive = false;
  } else {
    const prefix = marker(cur.type & BOLD ? '**' : '*', true);
    const suffix = marker(cur.type & BOLD ? '**' : '*', false);
    cur.children.unshift(prefix);
    cur.children.push(suffix);
    cur.isActive = true;
  }

  return root;
};

export const switchActiveNode = (root: VirtualNode, target: VirtualNode) => {
  const [newRoot, path] = deepCloneWithTrackNode(root, target);
  return switchActiveByPath(newRoot, path);
};
