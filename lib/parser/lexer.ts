import { Token } from '../types/token';

const boldReg = /\*\*([^\*]+)\*\*/;

//  ['**hello world**', 'hello world', index: 0, input: '**hello world**', groups: undefined]
export const lexer = (source: string): Array<Token> => {
  const tokens = [];

  while (source) {
    const matched = source.match(boldReg);
    if (matched) {
      const start = matched.index!;
      const end = start + matched[0].length;
      const content = matched[1];
      const raw = matched[0];

      if (start) {
        tokens.push(
          {
            type: 'plain-text',
            content: source.slice(0, start),
            raw: source.slice(0, start),
            loc: {
              start: 0,
              end: start,
            },
          },
          {
            type: 'bold',
            content,
            raw,
            loc: {
              start,
              end,
            },
          }
        );
      } else {
        tokens.push({
          type: 'bold',
          content,
          raw,
          loc: {
            start,
            end,
          },
        });
      }

      source = source.slice(end);
    } else {
      const content = source.slice(0);
      tokens.push({
        type: 'plain-text',
        content,
        raw: content,
        loc: {
          start: 0,
          end: content.length,
        },
      });

      source = '';
    }
  }

  return tokens;
};
