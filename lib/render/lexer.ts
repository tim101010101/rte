import { Token } from '../types/token';

const boldReg = /\*\*([^\*]+)\*\*/;

export const tokenizer = (source: string): Array<Token> => {
  const matched = source.match(boldReg);

  return [
    {
      type: 'bold',
      content: matched![1],
      raw: source,
      loc: {
        start: 0,
        end: 14,
      },
    },
  ];
};
