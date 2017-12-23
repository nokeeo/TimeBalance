import TimeStore from './TimeStore';
import { ActivityMonitor, ActivityInfo } from './ActivityMonitor'
import tabs = browser.tabs;

console.log('Running in the background');

var lastUrl: URL = null;
var startTime: Date = null;
var timeStore = new TimeStore();
var activityMonitor = new ActivityMonitor();

activityMonitor.onActive.addListener((info: ActivityInfo) => {
  console.log(info);
  console.log('Active!');
});

activityMonitor.onInactive.addListener((info: ActivityInfo) => {
  console.log('Inactive!');
});

function updateUrl(url: URL, time: Date) {
  lastUrl = url;
  startTime = time;
}

function storeData(url: string, date: Date, duration: number) {
  timeStore.addEntry({
    url,
    date,
    duration
  })
}

function pageChanged(url: URL) {
  // Get current date
  let now: Date = new Date();

  // Must be https or http protocol or else functions returns and clears current page
  if(['http:', 'https:'].indexOf(url.protocol) == -1) {
    if(lastUrl != null) {
      storeData(lastUrl.toString(), startTime, now.getTime() - startTime.getTime());
      updateUrl(null, null);
    }
    return;
  }

  // No previous website loaded. Update values
  if(!lastUrl) {
    updateUrl(url, now);
  }
  // If current hostname does not match previous hostname update and log time
  // spent on previous host.
  else if(lastUrl.hostname != url.hostname)  {
    let duration: number = (now.getTime() - startTime.getTime());
    console.log('You spent ' + duration / 1000 + ' seconds on ' + lastUrl.hostname);
    storeData(lastUrl.toString(), startTime, duration);
    updateUrl(url, now);
  }
}

// Listener for when a tab is set to active
tabs.onActivated.addListener(function(info:{ tabId: number }) {
  console.log('Tabbed changed to: ' + info.tabId);
  tabs.get(info.tabId).then(function(tab: tabs.Tab) {
    if(tab.url) {
      pageChanged(new URL(tab.url));
    }
  });
});

// Listener for when the tab's attributes are updated
tabs.onUpdated.addListener(function(tabId: number, info: { url: string }) {
  if(info.url) {
    pageChanged(new URL(info.url));
  }
});
