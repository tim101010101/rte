import { Editor } from '../lib/index';
import { defaultConfig } from '../lib/config';
import '../lib/asset/index.css';

const e = new Editor(defaultConfig);
e.init(
  // '**hello world1111** **hello world**\n**hello world1111** **hello world**\nhello world2222\n**hello world3333**\n**hello world4444**'
  // '**hello world**\n**hello world** **hello world**\n**hello world** **hello world** **hello world**\n**hello world** **hello world** **hello world** **hello world**\n**hello world** **hello world** **hello world**\n**hello world** **hello world**\n**hello world**'
  // 'this is a **hello world** and another'
  // '**Hello _World_ Hello World**\nHello World **this is Hello World**'
  '**Hello _World_**'
);
