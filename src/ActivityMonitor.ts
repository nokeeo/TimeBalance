import {ActivityHeartbeat, RuntimeMessage, RuntimeMessageType} from "./ActivityHeartbeat";
import ActivityInfo from "./ActivityInfo";
import MessageDispatcher from "./MessageDispatcher";
import tabs = browser.tabs;
import runtime = browser.runtime;

export default class ActivityMonitor {
  private static INACTIVE_TIME = 5000;

  public onActive: MessageDispatcher<ActivityInfo>;
  public onInactive: MessageDispatcher<ActivityInfo>;

  private isActive: boolean;

  constructor() {
    this.onActive = new MessageDispatcher<ActivityInfo>();
    this.onInactive = new MessageDispatcher<ActivityInfo>();
    this.isActive = false;
    this.setupListeners();
  }

  public handleOnMessage(request: RuntimeMessage, sender: runtime.MessageSender) {
    if (request.messageType === RuntimeMessageType.Heartbeat) {
      this.handleHeartbeatMessage(request as ActivityHeartbeat, sender);
    }
  }

  private handleHeartbeatMessage(heartbeat: ActivityHeartbeat, sender: runtime.MessageSender) {
    if (sender.tab != null && sender.tab.active) {
      // If we are currently inacitive see if the heartbeat's last event time is
      // in activity range
      if (!this.isActive && this.isTimeInRange(heartbeat.lastEventTime, heartbeat.sent)) {
        this.isActive = true;
        this.onActive.notify({
          tab: sender.tab,
        });
      }
      else if (this.isActive) {

        // Check to see if last recorded time is outside of the activity time and
        // The tab is not audible.
        const isNotAudible = (sender.tab != null && !sender.tab.audible);
        if (!this.isTimeInRange(heartbeat.lastEventTime, heartbeat.sent) && isNotAudible) {
          this.isActive = false;
          this.onInactive.notify({
            tab: sender.tab,
          });
        }
      }
    }
  }

  private isTimeInRange(time: Date, curTime: Date): boolean {
    if (time == null || curTime == null) {
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
