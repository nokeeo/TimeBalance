import ActivityInfo from "./ActivityInfo";
import MessageDispatcher from "./MessageDispatcher";
import tabs = browser.tabs;

export default class TabMonitor {
  public onActive: MessageDispatcher<ActivityInfo>;

  constructor() {
    this.onActive = new MessageDispatcher<ActivityInfo>();
    this.setupListeners();
  }

  private setupListeners() {
    // Listener for when a tab is set to active
    tabs.onActivated.addListener((info: { tabId: number }) => {
      console.log("Tabbed changed to: " + info.tabId);
      this.notifyActive(info.tabId);
    });

    // Listener for when the tab's attributes are updated
    tabs.onUpdated.addListener((tabId: number, info: { url: string, audible: boolean }) => {
      if (info.url || info.audible) {
        this.notifyActive(tabId);
      }
    });
  }

  private notifyActive(tabId: number) {
    tabs.get(tabId).then((tab: tabs.Tab) => {
      this.onActive.notify({
        tab,
      });
    });
  }
}
