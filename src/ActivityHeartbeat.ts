enum RuntimeMessageType {
  Heartbeat,
}

interface RuntimeMessage {
  messageType: RuntimeMessageType;
  sent: Date;
}

export default class ActivityHeartbeat implements RuntimeMessage {
  public lastEventTime: Date;
  public sent: Date;
  public messageType: RuntimeMessageType;

  constructor(lastEventTime: Date) {
    this.messageType = RuntimeMessageType.Heartbeat;
    this.lastEventTime = lastEventTime;
    this.sent = new Date();
  }
}

export { RuntimeMessageType, RuntimeMessage, ActivityHeartbeat };
