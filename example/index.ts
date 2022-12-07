import { Editor } from '../lib/index';
import '../lib/asset/index.css';
import { Block } from '../lib/virtualNode/block';
import { h } from '../lib/virtualNode/h';
import { keydownHandler } from '../lib/virtualNode/events/keydownHandler';
import { EventName } from '../lib/virtualNode/events/eventNames';

const blockNode1 = new Block(
  h(
    'div',
    { classList: ['r-line-test'], contenteditable: 'true' },
    [
      h('span', { classList: ['r-hide'] }, '**'),
      h('strong', {}, [
        h('span', { classList: ['r-plain-text-test'] }, 'hello world1 '),
      ]),
      h('span', { classList: ['r-hide'] }, '**'),
    ],
    [[EventName.KEYDOWN, keydownHandler, false]]
  )
);
const blockNode2 = new Block(
  h('div', { classList: ['r-line-test'], contenteditable: 'true' }, [
    h('span', {}, 'hello world2'),
  ])
);
const e = new Editor({ container: '#editor' });
e.init([blockNode1, blockNode2]);
// e.init([blockNode1]);
