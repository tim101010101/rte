import { get, proxy, set } from 'lib/utils';
import { EventBus, Selection } from 'lib/model';
import { Renderer } from 'lib/view';
import { Schema } from 'lib/schema';
import { State } from 'lib/types';

export const proxySelection = (
  renderer: Renderer,
  eventBus: EventBus,
  schema: Schema
): Selection => {
  const selection = new Selection(eventBus, schema.parse.bind(schema));

  return proxy(selection, {
    set(target, k, newValue, receiver) {
      if (k === 'state') {
        const newState = newValue as State | null;
        const curState = get(selection, 'state') as State | null;
        if (newState) {
          // TODO render cursor
        } else if (curState) {
          // TODO clear cursor
        }
      }

      return set(target, k, newValue, receiver);
    },
  });
};
