import { Editor } from '../lib/index';
import '../lib/asset/index.css';

const e = new Editor({ container: '#editor', font: '20px arial' });
e.init(
  // '**hello world1111** **hello world**\n**hello world1111** **hello world**\nhello world2222\n**hello world3333**\n**hello world4444**'
  // '**hello world**\n**hello world** **hello world**\n**hello world** **hello world** **hello world**\n**hello world** **hello world** **hello world** **hello world**\n**hello world** **hello world** **hello world**\n**hello world** **hello world**\n**hello world**'
  // 'this is a **hello world** and another'
  'Hello **World****Hello World**'
  // 'Hello World'
);
