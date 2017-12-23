export default class MessageDispatcher<T> {
  private listeners: Callback[];

  constructor() {
    this.listeners = [];
  }

  addListener(callback: Callback) {
    this.listeners.push(callback);
  }

  removeListener(callback: Callback) {
    this.listeners = this.listeners.filter((item: Callback) => {
      return callback != item
    });
  }

  notify(data: T) {
    this.listeners.forEach((callback) => {
      callback(data);
    });
  }
}

type Callback = (data: any) => void;
