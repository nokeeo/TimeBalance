import TimeStore from "../shared/TimeStore";
import ActivityInfo from "./ActivityInfo";
import ActivityMonitor from "./ActivityMonitor";
import TabMonitor from "./TabMonitor";
import tabs = browser.tabs;

console.log("Running in the background");

let lastUrl: URL = null;
let startTime: Date = null;
const activityMonitor = new ActivityMonitor();
const tabMonitor = new TabMonitor();

function onTabActive(info: ActivityInfo) {
  if (info.tab != null && info.tab.url != null && info.tab.active) {
    pageChanged(new URL(info.tab.url));
  }
}

function updateUrl(url: URL, time: Date) {
  lastUrl = url;
  startTime = time;
}

function storeData(url: string, date: Date, duration: number) {
  console.log("You spent " + duration / 1000 + " seconds on " + lastUrl.hostname);
  TimeStore.addEntry({
    date,
    duration,
    url,
  });
}

function getDuration(d1: Date, d2: Date): number {
  return Math.abs(d1.getTime() - d2.getTime());
}

function pageChanged(url: URL) {
  // Get current date
  const now: Date = new Date();

  // Must be https or http protocol or else functions returns and clears current page
  if (["http:", "https:"].indexOf(url.protocol) === -1) {
    if (lastUrl != null) {
      storeData(lastUrl.toString(), startTime, getDuration(now, startTime));
      updateUrl(null, null);
    }
    return;
  }

  // No previous website loaded. Update values
  if (!lastUrl) {
    updateUrl(url, now);
  }
  else if (lastUrl.hostname !== url.hostname)  {
    const duration: number = getDuration(now, startTime);
    storeData(lastUrl.toString(), startTime, duration);
    updateUrl(url, now);
  }
}

// Add monitor listeners
activityMonitor.onActive.addListener(onTabActive);

activityMonitor.onInactive.addListener((info: ActivityInfo) => {
  console.log("inactive");
  if (info.tab != null && lastUrl != null && info.tab.active) {
    storeData(lastUrl.toString(), startTime, getDuration(new Date(), startTime));
    updateUrl(null, null);
  }
});

tabMonitor.onActive.addListener(onTabActive);
