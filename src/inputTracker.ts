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

window.addEventListener('mousemove', () => {
  updateEventEntry(new Date());
});

window.addEventListener('keypress', () => {
  updateEventEntry(new Date());
});

const INACTIVITY_INTERVAL_CHECK = 5000;
let lastEventTime: Date = null;

setInterval(checkInactivity, INACTIVITY_INTERVAL_CHECK);
