import ActivityHeartbeat from "../shared/ActivityHeartbeat";
import runtime = browser.runtime;

function sendHeartbeat(lastEvent: Date) {
  const request = runtime.sendMessage(new ActivityHeartbeat(lastEvent));
  console.log("sending heartbeat");
}

function pulse() {
  sendHeartbeat(lastEventTime);
}

function handleActiveEvent() {
  lastEventTime = new Date();
}

const PULSE_INTERVAL = 5000;
let lastEventTime: Date = null;

window.addEventListener("mousemove", handleActiveEvent);
window.addEventListener("keypress", handleActiveEvent);
window.addEventListener("scroll", handleActiveEvent);

setInterval(pulse, PULSE_INTERVAL);
