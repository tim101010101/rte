import { Editor } from '../lib/index';
import '../lib/asset/index.css';

const e = new Editor({ container: '#editor', font: '20px arial' });
e.init(
  '**hello world1111** **hello world**\nhello world2222\n**hello world3333**\n**hello world4444**'
);

// const VNode1 = {
//   tagName: 'span',
//   props: { classList: ['r-line-test'] },
//   children: [
//     {
//       tagName: 'strong',
//       props: {},
//       children: 'hello',
//       events: [],
//       el: null,
//     },
//     {
//       tagName: 'span',
//       props: { classList: ['r-cursor-test'] },
//       children: '',
//       events: [],
//       el: null,
//     },
//     {
//       tagName: 'span',
//       props: {},
//       children: ' world',
//       events: [],
//       el: null,
//     },
//   ],
//   events: [],
//   el: null,
// };

// const editor = document.querySelector('#editor');
// editor?.appendChild(materialize(VNode1));
