import storage = browser.storage;
import local = storage.local;

let TIME_STORE_KEY = 'TIME_STORE';

declare type TimeData = { [key: string]: TimeEntry[] };

export interface TimeEntry {
  url: string;
  date: Date;
  duration: number;
}

export default class TimeStore {
  // TODO: This is untyped due to web-ext-types handling of storage objects
  private data: any; // TimeData.
  private entryQueue: TimeEntry[] = [];

  constructor() {
    local.get(TIME_STORE_KEY).then((data: storage.StorageObject) => {
      this.data = data;
      this.entryQueue.forEach(function(item: TimeEntry) {
        this.addEntry(item);
      });
      this.entryQueue = [];
    }, (error) => {
      console.error(error);
    });
  }

  addEntry(entry: TimeEntry) {
    let dataKey = entry.date.toDateString();
    if(this.data){
      if(!this.data[dataKey]) {
        this.data[dataKey] = [];
      }

      this.data[dataKey].push(entry);
      let obj = { TIME_STORE_KEY : this.data };

      local.set(obj).then(null, (error) => {
        console.error(error);
      });
      console.log(this.data);
    }
    else {
      this.entryQueue.push(entry);
    }
  }
}
