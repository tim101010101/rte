import { entries } from './obj';

export const appendChild = (
  parent: HTMLElement | DocumentFragment,
  ...children: Array<HTMLElement | Text | DocumentFragment>
): HTMLElement | DocumentFragment => {
  children.forEach(child => parent.appendChild(child));
  return parent;
};

export const removeChild = (parent: Node, child: Node) => {
  parent.removeChild(child);
};

export const createFragment = () => {
  return document.createDocumentFragment();
};

export const createTextNode = (text: string) => {
  return document.createTextNode(text);
};

export const createDomNode = (
  tagName: string,
  classList: Array<string> = [],
  attributes: Object = {}
) => {
  const dom = document.createElement(tagName);

  dom.classList.add(...classList);

  entries(attributes).forEach(([k, v]) => dom.setAttribute(k, v));

  return dom;
};

export const addClassName = (dom: HTMLElement, className: string) => {
  if (!dom.classList.contains(className)) {
    dom.classList.add(className);
  }
};

export const removeClassName = (dom: HTMLElement, className: string) => {
  if (dom.classList.contains(className)) {
    dom.classList.remove(className);
  }
};

export const insertBefore = (newNode: HTMLElement, oldNode: HTMLElement) => {
  const parentNode = oldNode.parentNode;
  parentNode?.insertBefore(newNode, oldNode);
};

export const replaceOldNode = (
  parent: HTMLElement,
  newNode: HTMLElement,
  oldNode: HTMLElement
) => {
  parent.insertBefore(newNode, oldNode);
  parent.removeChild(oldNode);
};

export const insertAfter = (newNode: HTMLElement, oldNode: HTMLElement) => {
  const parentNode = oldNode.parentNode;

  if (oldNode.nextSibling) {
    parentNode?.insertBefore(newNode, oldNode.nextSibling);
  } else {
    parentNode?.appendChild(newNode);
  }
};

export const createRangeFromPoint = (x: number, y: number): Range | null => {
  return (document as any).caretPositionFromPoint
    ? (document as any).caretPositionFromPoint(x, y)
    : document.caretRangeFromPoint
    ? document.caretRangeFromPoint(x, y)
    : null;
};

const ctx = document.createElement('canvas').getContext('2d')!;
export const measureCharWidth = (char: string, font: string) => {
  ctx.font = font;
  const metrics = ctx.measureText(char);
  return metrics.width;
};
