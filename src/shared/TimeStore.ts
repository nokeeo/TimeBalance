import storage = browser.storage;
import local = storage.local;

const TIME_STORE_KEY = "TIME_STORE";
const QUERY_OBJECT: any = { [TIME_STORE_KEY]: {} };

interface TimeData {
  [key: string]: TimeEntry[];
}

export interface TimeEntry {
  url: string;
  date: Date;
  duration: number;
}

export interface EntryQuery {
  dates?: Date[];
  startDate?: Date;
  endDate?: Date;
}

function dateToKey(date: Date): string {
  return [ date.getFullYear(),
    date.getMonth() + 1,
    date.getDate() ].join("-");
}

export default class TimeStore {
  public static addEntry(entry: TimeEntry) {
    const dataKey = dateToKey(entry.date);
    local.get(QUERY_OBJECT).then((data) => {
        const store = data[TIME_STORE_KEY];
        if (!store[dataKey]) {
          store[dataKey] = [];
        }

        store[dataKey].push(entry);
        local.set({ [TIME_STORE_KEY]: store }).then(null, (error) => {
          console.error(error);
        });
    }, (error) => {
      console.log(error);
    });
  }

  public static getData(query: EntryQuery, cb: (data: TimeData) => void) {
    local.get(QUERY_OBJECT).then((data) => {
      const dates: TimeData = {};
      const timeData: TimeData = data[TIME_STORE_KEY];
      if (query.dates) {
        Object.assign(dates, TimeStore.getEntriesByDates(timeData, query.dates));
      }

      if (query.startDate) {
        Object.assign(dates, TimeStore.getEntriesByStartDate(timeData, query.startDate, query.endDate));
      }

      cb(dates);
    });
  }

  private static getEntriesByDates(data: TimeData, dates: Date[]): TimeData {
    const returnData: TimeData = {};
    dates.forEach((date) => {
      returnData[dateToKey(date)] =  TimeStore.getEntriesByDate(date, data);
    });

    return returnData;
  }

  private static getEntriesByStartDate(data: TimeData, startDate: Date, endDate?: Date): TimeData {
    const dateKeys = Object.keys(data).sort();
    const returnData: TimeData = {};
    dateKeys.some((dateKey) => {
      const date = new Date(dateKey);
      console.log(date);
      if (endDate) {
        if (date <= endDate && date >= startDate) {
          returnData[dateKey] = data[dateKey];
        }
        else if (date < endDate) {
          return true;
        }
      }
      else if (date >= startDate) {
        returnData[dateKey] = data[dateKey];
      }

      return false;
    });

    console.log(returnData);
    return returnData;
  }

  private static getEntriesByDate(date: Date, data: TimeData): TimeEntry[] {
    const dataKey = dateToKey(date);
    const entries: TimeEntry[] = data[dataKey];
    return  (entries) ? entries : [];
  }
}
