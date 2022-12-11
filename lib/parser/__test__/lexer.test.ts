import { lexer } from '../lexer';

describe('lexer', () => {
  test('basic', () => {
    expect(lexer('**hello world**')).toStrictEqual([
      {
        type: 'bold',
        content: 'hello world',
        raw: '**hello world**',
        loc: {
          start: 0,
          end: 14,
        },
      },
    ]);
  });

  test('ss', () => {
    console.log(lexer('**hello** the **world**'));
  });
});
