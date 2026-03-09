type Subscriber = (loading: boolean) => void;

let count = 0;
const subscribers = new Set<Subscriber>();

const notify = () => {
  const loading = count > 0;
  subscribers.forEach((s) => s(loading));
};

export const startRequest = () => {
  count += 1;
  notify();
};

export const endRequest = () => {
  count = Math.max(0, count - 1);
  notify();
};

export const subscribe = (fn: Subscriber): (() => void) => {
  subscribers.add(fn);
  // notify current state immediately
  fn(count > 0);
  return () => {
    subscribers.delete(fn);
  };
};

export const resetLoader = () => {
  count = 0;
  notify();
};
