export default class MessageDispatcher<T> {
  private listeners: Callback[];

  constructor() {
    this.listeners = [];
  }

  public addListener(callback: Callback) {
    this.listeners.push(callback);
  }

  public removeListener(callback: Callback) {
    this.listeners = this.listeners.filter((item: Callback) => {
      return callback !== item;
    });
  }

  public notify(data: T) {
    this.listeners.forEach((callback) => {
      callback(data);
    });
  }
}

type Callback = (data: any) => void;
