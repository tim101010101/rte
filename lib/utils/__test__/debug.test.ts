import { panicAt, warningAt } from '../debug';

describe('[unit] debug', () => {
  describe('warningAt', () => {
    it('should warn', () => {
      warningAt('test');
      expect('[WARN]: test').toHaveBeenWarned();
      expect('[WARN]: test').toHaveBeenWarnedLast();

      warningAt('test last');
      expect('[WARN]: test last').toHaveBeenWarned();
      expect('[WARN]: test last').toHaveBeenWarnedLast();
    });

    it('should warn correctly times', () => {
      expect('[WARN]: test').toHaveBeenWarnedTimes(0);
      warningAt('test');
      expect('[WARN]: test').toHaveBeenWarnedTimes(1);
      warningAt('test');
      expect('[WARN]: test').toHaveBeenWarnedTimes(2);
      warningAt('test');
      expect('[WARN]: test').toHaveBeenWarnedTimes(3);
    });
  });

  describe('panicAt', () => {
    it('should panic', () => {
      expect(() => {
        panicAt('test');
      }).toThrow('[ERROR]: test');

      expect(() => {
        panicAt('test1');
      }).toThrow('[ERROR]: test1');
    });
  });
});
