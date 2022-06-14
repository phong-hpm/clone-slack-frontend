const contentRect = {
  top: 100,
  bottom: 300,
  left: 100,
  right: 200,
  width: 100,
  height: 200,
  x: 0,
  y: 0,
};

class ResizeObserverMock {
  callBack: Function;

  constructor(callBack: Function) {
    this.callBack = callBack;
  }

  observe(target: HTMLElement) {
    this.callBack([{ target, contentRect }]);
  }

  unobserve() {}
  disconnect() {}
}

window.ResizeObserver = ResizeObserverMock;

export {};
