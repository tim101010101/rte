import { VirtualNode } from '../../types';
import { Token } from '../../types/token';
import { bold } from './bold';
import { plainText } from './plainText';

export const tokensToVNode = (
  tokens: Array<Token>
): Array<Array<VirtualNode>> => {
  return tokens.map(token => {
    const { type } = token;

    // TODO
    if (type === 'bold') {
      return bold(token);
    }

    return plainText(token);
  });
};
