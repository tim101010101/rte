import { block } from '../block';
import { mockSyntax, mockText } from './utils';

describe('test regexp for block syntax', () => {
  const blockRules = block(mockSyntax, mockText);

  describe('list', () => {
    const listReg = blockRules['list'].reg;

    describe('basic', () => {
      test('`+ foo` is a list', () => {
        expect(listReg.test('+ foo')).toBeTruthy();
      });
      test('`- foo` is a list', () => {
        expect(listReg.test('- foo')).toBeTruthy();
      });
      test('`* foo` is a list', () => {
        expect(listReg.test('* foo')).toBeTruthy();
      });
      test('`1. foo` is a list', () => {
        expect(listReg.test('1. foo')).toBeTruthy();
      });
    });

    describe('allow prefix ident', () => {
      test('`    + foo` is a list', () => {
        expect(listReg.test('    + foo')).toBeTruthy();
      });
      test('`    1. foo` is a list', () => {
        expect(listReg.test('    1. foo')).toBeTruthy();
      });
      test('`\t+ foo` is a list', () => {
        expect(listReg.test('\t+ foo')).toBeTruthy();
      });
      test('`\t1. foo` is a list', () => {
        expect(listReg.test('\t1. foo')).toBeTruthy();
      });
      test('`        + foo` is a list', () => {
        expect(listReg.test('        + foo')).toBeTruthy();
      });
      test('`        1. foo` is a list', () => {
        expect(listReg.test('        1. foo')).toBeTruthy();
      });
      test('`\t\t+ foo` is a list', () => {
        expect(listReg.test('\t\t+ foo')).toBeTruthy();
      });
      test('`\t\t1. foo` is a list', () => {
        expect(listReg.test('\t\t1. foo')).toBeTruthy();
      });
    });
  });
});
