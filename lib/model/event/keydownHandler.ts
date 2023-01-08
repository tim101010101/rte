import { enumToMap } from 'lib/utils';
import { Page } from 'lib/model';
import { ControlKey, ShowableKey } from 'lib/static';

const {
  ESC,
  ARROW_UP,
  ARROW_DOWN,
  ARROW_LEFT,
  ARROW_RIGHT,
  BACKSPACE,
  TAB,
  ENTER,
} = ControlKey;

export const getKeydownHandler = (page: Page) => {
  const controlKeys = enumToMap<string, string>(ControlKey, true);
  const showableKeys = enumToMap<string, string>(ShowableKey, true);

  const isControlKey = (e: KeyboardEvent) => controlKeys.has(e.code);
  const isShowableKey = (e: KeyboardEvent) => showableKeys.has(e.key);

  return (e: KeyboardEvent) => {
    if (isControlKey(e)) {
      switch (e.key) {
        case ESC:
          page.selection.unFocus();
          break;

        case ARROW_LEFT:
          page.selection.left();
          break;
        case ARROW_RIGHT:
          page.selection.right();
          break;
        case ARROW_UP:
          page.selection.up();
          break;
        case ARROW_DOWN:
          page.selection.down();
          break;

        case TAB:
          page.focusOn(page.head!, 0);
          break;

        case BACKSPACE:
          page.selection.delete(page.schema.parse.bind(page.schema));
          break;

        case ENTER:
          page.selection.newLine(page.schema.parse.bind(page.schema));
          break;
      }
    } else if (isShowableKey(e)) {
      page.selection.updateBlockContent(
        e.key,
        page.schema.parse.bind(page.schema)
      );
    }
  };
};
