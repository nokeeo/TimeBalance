import MessageDispatcher from './MessageDispatcher';
import {RuntimeMessageType, RuntimeMessage, ActivityHeartbeat} from './ActivityHeartbeat';
import tabs = browser.tabs;
import runtime = browser.runtime;

interface ActivityInfo {
  tab?: tabs.Tab;
}

export default class ActivityMonitor {
  private static INACTIVE_TIME = 5000;
  private isActive: boolean;

  onActive: MessageDispatcher<ActivityInfo>;
  onInactive: MessageDispatcher<ActivityInfo>;

  constructor() {
    this.onActive = new MessageDispatcher<ActivityInfo>();
    this.onInactive = new MessageDispatcher<ActivityInfo>();
    this.isActive = false;
    this.setupListeners();
  }

  handleOnMessage(request: RuntimeMessage, sender: runtime.MessageSender) {
    if(request.messageType === RuntimeMessageType.Heartbeat) {
      this.handleHeartbeatMessage(request as ActivityHeartbeat, sender);
    }
  }

  private handleHeartbeatMessage(heartbeat: ActivityHeartbeat, sender: runtime.MessageSender) {
    let now = new Date();

    // If we are currently inacitive see if the heartbeat's last event time is
    // in activity range
    if(!this.isActive && this.isTimeInRange(heartbeat.lastEventTime, now)) {
      this.isActive = true;
      this.onActive.notify({
        tab: sender.tab
      });
    }
    // If we are currently active
    else if(this.isActive) {

      // Check to see if last recorded time is outside of the activity time and
      // The tab is not audible.
      if(!this.isTimeInRange(heartbeat.lastEventTime, now) && (sender.tab != null && !sender.tab.audible)) {
        this.isActive = false;
        this.onInactive.notify({
          tab: sender.tab
        });
      }
    }
  }

  private isTimeInRange(time: Date, curTime: Date): boolean {
    if(time == null || curTime == null) {
      return false;
    }
    return Math.abs(curTime.getTime() - time.getTime()) < ActivityMonitor.INACTIVE_TIME;
  }

  private setupListeners() {
    runtime.onMessage.addListener((request: RuntimeMessage, sender: runtime.MessageSender) => {
      this.handleOnMessage(request, sender);
    });
  }
}

export { ActivityMonitor, ActivityInfo };
