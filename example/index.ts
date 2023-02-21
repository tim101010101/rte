import { Editor } from '../lib/index';
import { defaultConfig } from '../lib/config';
import '../lib/asset/index.css';

const e = new Editor(defaultConfig);
e.init('# WELCOME\n');
