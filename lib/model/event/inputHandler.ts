import { lexer } from 'lib';

export const inputHandler = (e: KeyboardEvent) => {
  const text = (e.target as any).innerText;
  console.log(lexer(text));
};
