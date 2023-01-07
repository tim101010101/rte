import { splitAt } from 'lib/utils';
import { EventBus, Line, textContentWithMarker } from 'lib/model';
import { FeedbackPos, Pos, SyntaxNode } from 'lib/types';
import { InnerEventName } from 'lib/static';

const { INSTALL_BLOCK, FULL_PATCH } = InnerEventName;

export const insertNewLine = (
  { block, offset }: Pos,
  parser: (source: string) => SyntaxNode,
  container: HTMLElement,
  eventBus: EventBus
): FeedbackPos => {
  const [curBlockContent, nextBlockContent] = splitAt(
    textContentWithMarker(block.vNode),
    offset
  );

  block.patch(parser(curBlockContent));

  const newBlock = new Line(container, eventBus);
  newBlock.patch(parser(nextBlockContent));

  eventBus.emit(INSTALL_BLOCK, newBlock, block);
  eventBus.emit(FULL_PATCH);

  return {
    pos: {
      block: newBlock,
      offset: 0,
    },
    active: null,
  };
};
