import { LinkedList, ListNode } from 'lib/model/listView';
import { calcWindow } from '../calcWindow';
import { set } from 'lib/utils';

const mockListView = (len: number) => {
  const ll = new LinkedList();
  while (ll.length < len) {
    const node = new ListNode();
    set(node, 'id', ll.length);
    ll.insert(node);
  }
  return ll;
};
const getHeight = jest.fn((_: any) => 40);

const getTestingMacro = (getWindow: any, getHeight: any) => {
  return (
    initWindow: [number, number, number, number, number],
    offset: number,
    windowArr?: [number, number, number, number]
  ) => {
    const [topOffset, bottomOffset, gap, excess, len] = initWindow;
    const { window, ll } = getWindow(topOffset, bottomOffset, gap, excess, len);
    const res = calcWindow(window, offset, 160, getHeight);
    let expectWindow = window;
    if (Array.isArray(windowArr)) {
      expectWindow = {
        top: ll.find(windowArr[0]),
        bottom: ll.find(windowArr[1]),
        gap: windowArr[2],
        excess: windowArr[3],
      };
    }

    expect(res).toStrictEqual(expectWindow);
  };
};

describe('[unit] calcWindow', () => {
  describe('init', () => {
    const getFilledWindow = (
      topOffset: number,
      bottomOffset: number,
      gap: number,
      excess: number,
      length: number
    ) => {
      const ll = mockListView(length);
      return {
        window: {
          top: ll.find(topOffset),
          bottom: ll.find(bottomOffset),
          gap,
          excess,
        } as any,
        ll,
      };
    };
    const macro = getTestingMacro(getFilledWindow, getHeight);

    it('should calcuate the window correctly when init (offset === 0)', () => {
      macro([0, 0, 0, -120, 1], 0, [0, 0, 0, -120]);
      macro([0, 0, 0, -120, 2], 0, [0, 1, 0, -80]);
      macro([0, 0, 0, -120, 3], 0, [0, 2, 0, -40]);

      macro([0, 0, 0, -120, 4], 0, [0, 3, 0, 0]);

      macro([0, 0, 0, -120, 6], 0, [0, 3, 0, 0]);
      macro([0, 0, 0, -120, 9], 0, [0, 3, 0, 0]);
    });
  });

  describe('move an unfilled window', () => {
    const getUnfilledWindow = (
      _topOffset: number,
      bottomOffset: number,
      _gap: number,
      _excess: number,
      length: number
    ) => {
      const ll = mockListView(length);
      return {
        window: {
          top: ll.head,
          bottom: ll.find(bottomOffset),
          gap: 0,
          excess: (bottomOffset + 1 - 4) * 40,
        } as any,
        ll,
      };
    };
    const macro = getTestingMacro(getUnfilledWindow, getHeight);

    describe('move down', () => {
      describe('offset is 0', () => {
        it('should return the same window when there is no more node after `bottom`', () => {
          macro([0, 0, 0, 0, 1], 0);
          macro([0, 1, 0, 0, 2], 0);
          macro([0, 2, 0, 0, 3], 0);
        });

        it('should move `bottom` to the tail when there is more node after `bottom`', () => {
          macro([0, 0, 0, 0, 3], 0, [0, 2, 0, -40]);
          macro([0, 1, 0, 0, 3], 0, [0, 2, 0, -40]);
          macro([0, 2, 0, 0, 3], 0, [0, 2, 0, -40]);
        });
      });

      describe('offset is not 0', () => {
        it('should return the same window when there is no more node after `bottom`', () => {
          macro([0, 0, 0, 0, 1], 39);
          macro([0, 1, 0, 0, 2], 39);
          macro([0, 2, 0, 0, 3], 39);

          macro([0, 0, 0, 0, 1], 40);
          macro([0, 1, 0, 0, 2], 40);
          macro([0, 2, 0, 0, 3], 40);

          macro([0, 0, 0, 0, 1], 41);
          macro([0, 1, 0, 0, 2], 41);
          macro([0, 2, 0, 0, 3], 41);
        });

        it('should move `bottom` to the tail when there is more node after `bottom`', () => {
          macro([0, 0, 0, 0, 3], 39, [0, 2, 0, -40]);
          macro([0, 1, 0, 0, 3], 39, [0, 2, 0, -40]);
          macro([0, 2, 0, 0, 3], 39, [0, 2, 0, -40]);

          macro([0, 0, 0, 0, 3], 40, [0, 2, 0, -40]);
          macro([0, 1, 0, 0, 3], 40, [0, 2, 0, -40]);
          macro([0, 2, 0, 0, 3], 40, [0, 2, 0, -40]);

          macro([0, 0, 0, 0, 3], 41, [0, 2, 0, -40]);
          macro([0, 1, 0, 0, 3], 41, [0, 2, 0, -40]);
          macro([0, 2, 0, 0, 3], 41, [0, 2, 0, -40]);
        });
      });
    });

    describe('move up', () => {
      it('should return the same window when there is no more node before `top`', () => {
        macro([0, 0, 0, 0, 1], -39);
        macro([0, 1, 0, 0, 2], -39);
        macro([0, 2, 0, 0, 3], -39);

        macro([0, 0, 0, 0, 1], -40);
        macro([0, 1, 0, 0, 2], -40);
        macro([0, 2, 0, 0, 3], -40);

        macro([0, 0, 0, 0, 1], -41);
        macro([0, 1, 0, 0, 2], -41);
        macro([0, 2, 0, 0, 3], -41);
      });
    });
  });

  describe('move window that just fills', () => {
    const getFilledWindow = (
      _topOffset: number,
      bottomOffset: number,
      _gap: number,
      _excess: number,
      _length: number
    ) => {
      const ll = mockListView(4);
      return {
        window: {
          top: ll.head,
          bottom: ll.find(bottomOffset),
          gap: 0,
          excess: (bottomOffset + 1 - 4) * 40,
        } as any,
        ll,
      };
    };
    const macro = getTestingMacro(getFilledWindow, getHeight);

    describe('move down', () => {
      it('should return the same window when there is no more node after `bottom` whatever the offset is 0 or not', () => {
        macro([0, 3, 0, 0, 4], 0);

        macro([0, 3, 0, 0, 4], 39);
        macro([0, 3, 0, 0, 4], 40);
        macro([0, 3, 0, 0, 4], 41);
        macro([0, 3, 0, 0, 4], 9999);
      });

      it('should move `bottom` to the tail when there is more node after `bottom` whatever the offset is 0 or not', () => {
        macro([0, 0, 0, 0, 4], 0, [0, 3, 0, 0]);
        macro([0, 1, 0, 0, 4], 0, [0, 3, 0, 0]);
        macro([0, 2, 0, 0, 4], 0, [0, 3, 0, 0]);
        macro([0, 3, 0, 0, 4], 0, [0, 3, 0, 0]);

        macro([0, 0, 0, 0, 4], 39, [0, 3, 0, 0]);
        macro([0, 1, 0, 0, 4], 40, [0, 3, 0, 0]);
        macro([0, 2, 0, 0, 4], 41, [0, 3, 0, 0]);
        macro([0, 3, 0, 0, 4], 9999, [0, 3, 0, 0]);
      });
    });

    describe('move up', () => {
      it('should move `bottom` correctly when there is no more node before `top` on matter what offset is', () => {
        macro([0, 0, 0, -120, 4], -39, [0, 3, 0, 0]);
        macro([0, 0, 0, -120, 4], -40, [0, 3, 0, 0]);
        macro([0, 0, 0, -120, 4], -41, [0, 3, 0, 0]);
        macro([0, 0, 0, -120, 4], -9999, [0, 3, 0, 0]);

        macro([0, 1, 0, -80, 4], -39, [0, 3, 0, 0]);
        macro([0, 1, 0, -80, 4], -40, [0, 3, 0, 0]);
        macro([0, 1, 0, -80, 4], -41, [0, 3, 0, 0]);
        macro([0, 1, 0, -80, 4], -9999, [0, 3, 0, 0]);

        macro([0, 2, 0, -40, 4], -39, [0, 3, 0, 0]);
        macro([0, 2, 0, -40, 4], -40, [0, 3, 0, 0]);
        macro([0, 2, 0, -40, 4], -41, [0, 3, 0, 0]);
        macro([0, 2, 0, -40, 4], -9999, [0, 3, 0, 0]);

        macro([0, 3, 0, 0, 4], -39, [0, 3, 0, 0]);
        macro([0, 3, 0, 0, 4], -40, [0, 3, 0, 0]);
        macro([0, 3, 0, 0, 4], -41, [0, 3, 0, 0]);
        macro([0, 3, 0, 0, 4], -9999, [0, 3, 0, 0]);
      });
    });
  });

  describe('move a filled window', () => {
    const getFilledWindow = (
      topOffset: number,
      bottomOffset: number,
      gap: number,
      excess: number,
      length: number
    ) => {
      const ll = mockListView(length);
      return {
        window: {
          top: ll.find(topOffset),
          bottom: ll.find(bottomOffset),
          gap,
          excess,
        } as any,
        ll,
      };
    };
    const macro = getTestingMacro(getFilledWindow, getHeight);

    describe('offset is 0', () => {
      it('should return the same window no matter what `gap` and `excess` are', () => {
        macro([1, 4, 0, 0, 6], 0);
        macro([1, 5, 30, 10, 6], 0);
        macro([1, 5, 20, 20, 6], 0);
        macro([1, 5, 10, 30, 6], 0);
      });
    });

    describe('offset is not 0', () => {
      describe('move down', () => {
        it('should calcuate the window correctly', () => {
          macro([0, 4, 30, 10, 6], 10, [1, 4, 0, 0]);
          macro([0, 4, 30, 10, 6], 30, [1, 5, 20, 20]);
          macro([0, 4, 30, 10, 6], 99, [2, 5, 0, 0]);
        });
      });

      describe('move up', () => {
        it('should calcuate the window correctly', () => {
          macro([0, 4, 30, 10, 6], -10, [0, 4, 20, 20]);
          macro([0, 4, 30, 10, 6], -30, [0, 3, 0, 0]);
          macro([0, 4, 30, 10, 6], -99, [0, 3, 0, 0]);
        });
      });
    });
  });
});

// describe('excess === 0 && gap === 0', () => {});
// describe('excess !== 0 && gap == 0', () => {});
// describe('excess == 0 && gap !== 0', () => {});
// describe('excess !== 0 && gap !== 0', () => {});
