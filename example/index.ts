import { Editor } from '../lib/index';
import { defaultConfig } from '../lib/config';
import '../lib/asset/index.css';

const e = new Editor(defaultConfig);
e.init(
  // '**hello world1111** **hello world**\n**hello world1111** **hello world**\nhello world2222\n**hello world3333**\n**hello world4444**'
  // '# hello *world*\n**hello world**\n**hello world** **hello world**\n**hello world** **hello world** **hello world**\n**hello world** **hello world** **hello world** **hello world**\n**hello world** **hello world** **hello world**\n**hello world** **hello world**\n**hello world**\nhello world\nhello world hello world\nhello world\n**hello world** hello world\nhello **world**\n**hello world** hello world hello world\nhello world hello world **hello world**'
  // 'this is a **hello _world_** and **another**\na**b**\n**a**b\n**b****c**\n**hello** **world**'
  // '**Hello _World_ Hello World**\nHello World **this is Hello World**'
  // 'This is **Hello _World_**\n**This _is_** __Hello *World*__'
  // '**foo**\n*bar*'
  // 'hello world hello world hello world\n**hello world** **hello world**'
  // '**ab** c'
  // 'abcdefg'
  // 'a**b**c'
  'foo\n*foo*\n**foo**\n# hello *world*\n**foo_bar_**_baz_'
  // 'a**b** __c__\n**b** **c**'
  // '**ab**\nhello world'
  // '**ab**\n**a\nb**aaa'
  // 'a\n\n\nb'
);
