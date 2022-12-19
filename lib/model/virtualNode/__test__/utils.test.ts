import {
  isMarkerTextNode,
  isPureTextNode,
  isTextNode,
  isTheseTypes,
} from '../utils';
import { NodeType, TagName } from '../../../static';

const { PLAIN_TEXT, BOLD, PREFIX, SUFFIX } = NodeType;
const { SPAN } = TagName;

describe('utils', () => {
  const s = (type: number, children = []) => {
    return {
      type,
      tagName: SPAN,
      props: {},
      meta: {},

      el: null,
      isActive: false,
      events: [],
      children,
    };
  };
  const t = (type: number, text = '') => {
    return {
      type,
      tagName: SPAN,
      props: {},
      meta: {},

      el: null,
      text,
      font: '',
    };
  };

  test('isTextNode', () => {
    expect(isTextNode(t(PLAIN_TEXT))).toBeTruthy();
    expect(isTextNode(t(BOLD))).toBeFalsy();

    expect(isTextNode(t(PLAIN_TEXT | BOLD))).toBeTruthy();
    expect(isTextNode(t(PLAIN_TEXT | BOLD | PREFIX | SUFFIX))).toBeTruthy();
  });

  test('isPureTextNode', () => {
    expect(isPureTextNode(t(PLAIN_TEXT))).toBeTruthy();
    expect(isPureTextNode(t(BOLD))).toBeFalsy();

    expect(isPureTextNode(t(PLAIN_TEXT | BOLD))).toBeFalsy();
    expect(isPureTextNode(t(PLAIN_TEXT | BOLD | PREFIX | SUFFIX))).toBeFalsy();
  });

  test('isTheseType', () => {
    expect(isTheseTypes(t(PLAIN_TEXT), PLAIN_TEXT)).toBeTruthy();
    expect(isTheseTypes(t(BOLD), PLAIN_TEXT)).toBeFalsy();

    expect(isTheseTypes(t(PLAIN_TEXT | BOLD), PLAIN_TEXT)).toBeTruthy();
    expect(
      isTheseTypes(t(PLAIN_TEXT | BOLD | PREFIX | SUFFIX), BOLD, PREFIX, SUFFIX)
    ).toBeTruthy();
  });

  test('isMarkerTextNode', () => {
    expect(isMarkerTextNode(t(PLAIN_TEXT))).toBeFalsy();
    expect(isMarkerTextNode(t(PLAIN_TEXT | BOLD))).toBeFalsy();
    expect(isMarkerTextNode(t(PLAIN_TEXT | PREFIX))).toBeTruthy();
    expect(isMarkerTextNode(t(PLAIN_TEXT | SUFFIX))).toBeTruthy();
    expect(isMarkerTextNode(t(PLAIN_TEXT | PREFIX | SUFFIX))).toBeTruthy();
  });
});
