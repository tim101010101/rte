import { Editor } from '../lib/index';
import '../lib/asset/index.css';

const e = new Editor({ container: '#editor' });
e.init(
  '**hello world1111**\n**hello world2222**\n**hello world3333**\n**hello world4444**'
);
