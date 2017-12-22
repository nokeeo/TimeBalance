function signalInactive() {
  console.log("INACTIVE!!!");
}

function signalActive() {
  console.log("ACTIVE!!");
}

function updateEventEntry(time: Date) {
  if(lastEventTime == null) {
    signalActive();
  }
  lastEventTime = time;
}

function checkInactivity() {
  let now = new Date();
  if(lastEventTime != null) {
    if(now.getTime() - lastEventTime.getTime() > INACTIVITY_INTERVAL_CHECK) {
      lastEventTime = null;
      signalInactive();
    }
  }
}

function handleActiveEvent() {
  updateEventEntry(new Date());
}

const INACTIVITY_INTERVAL_CHECK = 5000;
let lastEventTime: Date = null;

window.addEventListener('mousemove', handleActiveEvent);
window.addEventListener('keypress', handleActiveEvent);
window.addEventListener('scroll', handleActiveEvent);

setInterval(checkInactivity, INACTIVITY_INTERVAL_CHECK);
