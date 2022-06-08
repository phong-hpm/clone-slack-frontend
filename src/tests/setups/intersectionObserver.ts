class IntersectionObserverMock {
  root: Element | null = null;
  rootMargin: string = "";
  thresholds: number[] = [];
  disconnect() {}
  observe() {}
  takeRecords() {
    return [];
  }
  unobserve() {}
}

window.IntersectionObserver = IntersectionObserverMock;

export {};
