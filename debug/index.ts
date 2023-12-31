import { Editor } from '../lib/index';
import { debugConfig } from './config';
import '../lib/asset/index.css';

const getText = (line: number) => {
  return (
    '# Hello World\n' +
    Array.from({ length: line }, (_, i) => `line ${i + 1}`).join('\n')
  );
};

const e = new Editor(debugConfig);
// e.init('# WELCOME');
// e.init('# hello world\nline 1\nline 2\nline 3\nline 4');
e.init(getText(20));
