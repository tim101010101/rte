import { appendChild, createDomNode, insertAt, min } from 'lib/utils';
import {
  Block,
  getNode,
  getPrevSibling,
  isTextNode,
  setTextContent,
  textContentWithMarker,
} from 'lib/model';
import { SyntaxNode, VirtualNode } from 'lib/types';
import { trySwitchActiveSyntaxNode } from './switchActiveMarker';
import { ClassName, TagName } from 'lib/static';

export interface Pos {
  block: Block;
  fenceOffset: number;
}

export interface ActivePos {
  block: Block;
  offset: number;
}

export class Selection {
  private el: HTMLElement;
  private pos?: Pos | null;
  private active?: ActivePos | null;

  constructor(container: HTMLElement) {
    this.el = createDomNode(TagName.SPAN, [ClassName.RTE_CURSOR]);

    appendChild(container, this.el);
  }

  private setShape(width: number, height: number, left: number, top: number) {
    this.el.style.width = `${width}px`;
    this.el.style.height = `${height}px`;
    this.el.style.left = `${left}px`;
    this.el.style.top = `${top}px`;
  }

  private setPos({ block, fenceOffset }: Pos) {
    const { fence } = block;
    const { fenceList, lineHeight, y } = fence;
    const offset = fenceList[fenceOffset].cursorOffset;

    this.setShape(2, lineHeight, offset, y);
  }

  focusOn(block: Block, fenceOffset: number, isCrossLine: boolean) {
    if (!this.pos) {
      this.el.style.display = 'inline-block';
    }

    const { pos, active } = trySwitchActiveSyntaxNode(
      {
        block,
        fenceOffset,
      },
      isCrossLine,
      this.active
    );

    this.pos = pos;
    this.active = active;

    // re-render the cursor
    this.setPos(pos);
  }

  unFocus() {
    if (this.pos) {
      this.el.style.display = 'none';

      this.pos = null;
    }
  }

  left() {
    if (!this.pos) return;
    const { block, fenceOffset } = this.pos;

    if (fenceOffset !== 0) {
      this.focusOn(block, fenceOffset - 1, false);
    }
  }

  right() {
    if (!this.pos) return;
    const { block, fenceOffset } = this.pos;

    if (
      // this.fenceOffset !== this.fence.fenceList.length - 2
      fenceOffset !==
      block.fence.fenceList.length - 1
    ) {
      this.focusOn(block, fenceOffset + 1, false);
    }
  }

  up() {
    if (!this.pos) return;
    const { block, fenceOffset } = this.pos;

    if (block.prev) {
      const nextFenceLength = block.prev.fence.fenceList.length;
      this.focusOn(block.prev, min(fenceOffset, nextFenceLength - 1), true);
    }
  }

  down() {
    if (!this.pos) return;
    const { block, fenceOffset } = this.pos;

    if (block.next) {
      const nextFenceLength = block.next.fence.fenceList.length;
      this.focusOn(block.next, min(fenceOffset, nextFenceLength - 1), true);
    }
  }

  updateBlockContent(char: string, parser: (src: string) => VirtualNode) {
    if (!this.pos) return;

    const { block, fenceOffset } = this.pos;
    const root = block.vNode!;
    const { textOffset } = block.fence.fenceList[fenceOffset];
    const lineContent = textContentWithMarker(root);
    const newLineContent = insertAt(lineContent, fenceOffset, char);

    const newVTree = parser(newLineContent);

    const prevLength = root.children.length;
    const curLength = (newVTree as SyntaxNode).children.length;

    block.patch(newVTree);

    const path = this.pos.block.fence.fenceList[this.pos.fenceOffset].path;
    const curSyntax = getPrevSibling(block.vNode!, path);

    if (curSyntax && !isTextNode(curSyntax)) {
      console.log('a');
      const { marker } = curSyntax;
      const { prefix, suffix } = marker;
      if (prefix?.length! === 1) {
        this.focusOn(block, fenceOffset - 1, false);
      } else if (prefix?.length! === 2) {
        this.focusOn(block, fenceOffset - 3, false);
      }
    } else {
      if (prevLength === curLength) {
        console.log('b');
        this.focusOn(block, fenceOffset + 1, false);
      } else {
        console.log('c');
        this.focusOn(block, fenceOffset - 1, false);
      }
    }

    // if (curSyntax && !isTextNode(curSyntax)) {
    //   console.log('b');
    //   this.focusOn(block, fenceOffset - 1, false);
    // } else if (prevLength === curLength) {
    //   //! ERROR this branch includes two possibilities
    //   //! ERROR    1. normal input
    //   //! ERROR    2. syntax1 -> syntax2
    //   //! ERROR       e.g **a* -> **a**

    //   console.log('a');
    //   this.focusOn(block, fenceOffset + 1, false);
    // }
  }
}
