import { assign, get, has, set } from 'lib/utils';
import { Editor } from '..';
import { Page, Selection, Viewport } from 'lib/model';
import { ListView, NoopFunction } from 'lib/types';

interface GlobalContext {
  editor: Editor;
  page: Page;
  selection: Selection;
  listView: ListView;
  viewport: Viewport;
}

// Some external states for debugging
const externalContext = {};

/**
 * Inject global variables for debugging
 *
 * @param ctx Global context
 */
export const injectGlobal = (ctx: GlobalContext) => {
  if (!__DEV__) return;

  assign(ctx, externalContext);

  globalThis.__DEBUG_getter = (path: string) => {
    return path.split('.').reduce((res, key) => {
      if (has(ctx, key)) return get(ctx, key);
      else return get(res, key);
    }, ctx);
  };

  [
    'editor',
    'editor.options',

    'selection',
    'selection.state',
    'selection.stateStack',

    'listView',

    'viewport',
    'viewport.snapshot',
  ].forEach(path => {
    Reflect.defineProperty(globalThis, `__DEBUG_${path.split('.').join('_')}`, {
      get() {
        return globalThis.__DEBUG_getter(path);
      },
    });
  });
};

export const registerGlobalSwitcher = (
  key: string,
  cb: NoopFunction,
  defaultValue?: boolean
): string => {
  if (!__DEV__) return;

  const toggleFnKey = `__DEBUG_toggle_${key}`;
  const valueKey = `__DEBUG_toggle_${key}_value`;

  if (!has(globalThis, toggleFnKey)) {
    globalThis[toggleFnKey] = () => {
      if (get(globalThis, valueKey) === true) {
        set(globalThis, valueKey, false);
      } else {
        set(globalThis, valueKey, true);
      }
    };

    if (defaultValue === true) {
      set(globalThis, valueKey, true);
    }
  }

  if (get(globalThis, valueKey) === true) cb();

  return valueKey;
};
