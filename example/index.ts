import { Editor } from '../lib/index';
import '../lib/asset/index.css';
import { Block } from '../lib/virtualNode/block';
import { NodeTypes } from '../lib/virtualNode/nodeTypes';
import { h } from '../lib/virtualNode/h';
import { keydownHandler } from '../lib/virtualNode/events/keydownHandler';
import { EventName } from '../lib/virtualNode/events/eventNames';

const blockNode1 = new Block(
  h(
    NodeTypes.BLOCK,
    { contentEditable: 'true' },
    [h(NodeTypes.BOLD | NodeTypes.PLAIN_TEXT, {}, 'hello world1')],
    [[EventName.KEYDOWN, keydownHandler, false]]
  )
);
const blockNode2 = new Block(
  h(
    NodeTypes.BLOCK,
    {},
    [h(NodeTypes.BOLD | NodeTypes.PLAIN_TEXT, {}, 'hello world2')],
    [[EventName.KEYDOWN, keydownHandler, false]]
  )
);
const blockNode3 = new Block(
  h(
    NodeTypes.BLOCK,
    {},
    [h(NodeTypes.BOLD | NodeTypes.PLAIN_TEXT, {}, 'hello world3')],
    [[EventName.KEYDOWN, keydownHandler, false]]
  )
);
const blockNode4 = new Block(
  h(
    NodeTypes.BLOCK,
    {},
    [h(NodeTypes.BOLD | NodeTypes.PLAIN_TEXT, {}, 'hello world4')],
    [[EventName.KEYDOWN, keydownHandler, false]]
  )
);

const e = new Editor({ container: '#editor' });
e.init([blockNode1, blockNode2, blockNode3, blockNode4]);
