import { entries } from './obj';

export const appendChild = (
  parent: HTMLElement,
  ...children: Array<HTMLElement | Text>
) => {
  parent.append(...children);
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

export const insertAfter = (newNode: HTMLElement, oldNode: HTMLElement) => {
  const parentNode = oldNode.parentNode;

  if (oldNode.nextSibling) {
    parentNode?.insertBefore(newNode, oldNode.nextSibling);
  } else {
    parentNode?.appendChild(newNode);
  }
};
