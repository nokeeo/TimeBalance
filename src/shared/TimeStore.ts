import storage = browser.storage;
import local = storage.local;

const TIME_STORE_KEY = "TIME_STORE";

declare interface TimeData { [key: string]: TimeEntry[]; }

export interface TimeEntry {
  url: string;
  date: Date;
  duration: number;
}

export default class TimeStore {
  public static addEntry(entry: TimeEntry) {
    const dataKey = entry.date.toDateString();
    const getObj: any = { [TIME_STORE_KEY]: { [dataKey]: [] } };
    local.get(getObj).then((data) => {
        const store = data[TIME_STORE_KEY];
        store[dataKey].push(entry);
        local.set({ [TIME_STORE_KEY]: store }).then(null, (error) => {
          console.error(error);
        });
    }, (error) => {
      console.log(error);
    });
  }
}
