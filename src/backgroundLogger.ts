import TimeStore from './TimeStore';
import tabs = browser.tabs;

console.log('Running in the background');

var lastUrl: URL = null;
var startTime: Date = null;
var timeStore = new TimeStore();

function updateUrl(url: URL, time: Date) {
  lastUrl = url;
  startTime = time;
}

function storeData(url: URL, date: Date, duration: number) {
  timeStore.addEntry({
    url,
    date,
    duration
  })
}

function pageChanged(url: URL) {
  // Must be https or http protocol or else functions returns
  if(['http:', 'https:'].indexOf(url.protocol) == -1) {
    return;
  }

  // Get current date
  let now: Date = new Date();

  // No previous website loaded. Update values
  if(!lastUrl) {
    updateUrl(url, now);
  }
  // If current hostname does not match previous hostname update and log time
  // spent on previous host.
  else if(lastUrl.hostname != url.hostname)  {
    let duration: number = (now.getTime() - startTime.getTime());
    console.log('You spent ' + duration / 1000 + ' seconds on ' + lastUrl.hostname);
    storeData(lastUrl, startTime, duration);
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
