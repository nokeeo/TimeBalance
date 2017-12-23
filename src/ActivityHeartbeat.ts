enum RuntimeMessageType {
  Heartbeat,
}

interface RuntimeMessage {
  messageType: RuntimeMessageType;
}

export default class ActivityHeartbeat implements RuntimeMessage {
  public lastEventTime: Date;
  public messageType: RuntimeMessageType;

  constructor(lastEventTime: Date) {
    this.messageType = RuntimeMessageType.Heartbeat;
    this.lastEventTime = lastEventTime;
  }
}

export { RuntimeMessageType, RuntimeMessage, ActivityHeartbeat };
