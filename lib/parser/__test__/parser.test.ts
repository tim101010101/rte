import { EventName } from '../../virtualNode/events/eventNames';
import { inputHandler } from '../../virtualNode/events/inputHandler';
import { parser } from '../parser';

describe('parser', () => {
  test('basic', () => {
    expect(
      parser([
        {
          type: 'bold',
          content: 'hello world',
          raw: '**hello world**',
          loc: {
            start: 0,
            end: 14,
          },
        },
      ])
    ).toStrictEqual({
      tagName: 'div',
      el: null,
      props: {
        classList: ['r-line-test'],
      },
      children: [
        {
          tagName: 'span',
          props: {},
          events: [],
          children: 'hello world',
          el: null,
        },
      ],
      events: [[EventName.INPUT, inputHandler]],
    });
  });
});
