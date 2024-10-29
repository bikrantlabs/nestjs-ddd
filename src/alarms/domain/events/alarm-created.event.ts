import { Alarm as DomainAlarm } from '../alarm';

export class AlarmCreatedEvent {
  constructor(public readonly alarm: DomainAlarm) {}
}
