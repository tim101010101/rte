import { NodeType } from './nodeType';

export class BasicNode {
  private type: NodeType;
  private dom: HTMLElement;
  private content: string;

  constructor(type: NodeType, dom: HTMLElement, content: string) {
    this.type = type;
    this.dom = dom;
    this.content = content;
  }

  focus() {
    this.dom.focus();
  }
}
