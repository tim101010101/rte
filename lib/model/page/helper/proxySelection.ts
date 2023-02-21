import { get, proxy, set } from 'lib/utils';
import { EventBus, Selection } from 'lib/model';
import { Renderer } from 'lib/view';
import { Schema } from 'lib/schema';
import { CursroInfo } from 'lib/types';

export const proxySelection = (
  renderer: Renderer,
  eventBus: EventBus,
  schema: Schema
): Selection => {
  const selection = new Selection(eventBus, schema.parse.bind(schema));

  return proxy(selection, {
    set(target, k, newValue, receiver) {
      if (k === 'state') {
        const cursorInfo = newValue as CursroInfo | null;
        const curState = get(selection, 'state') as CursroInfo | null;
        if (cursorInfo) {
          const { rect } = cursorInfo;
          const { height, clientX, clientY } = rect;
          renderer.renderCursor(
            { clientX, clientY, height, width: 2 },
            curState?.rect
          );
        } else if (curState) {
          renderer.clearCursor(curState.rect);
        }
      }

      return set(target, k, newValue, receiver);
    },
  });
};
