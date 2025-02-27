import { VersionedAggregateRoot } from 'src/shared/domain/aggregate-root';
import { AlarmItem } from './alarm-item';
import { AlarmSeverity } from './value-objects/alarm-severity';

export class Alarm extends VersionedAggregateRoot {
  public name: string;
  public severity: AlarmSeverity;
  public trigerredAt: Date;
  public isAcknowledged = false;
  public items = new Array<AlarmItem>();

  constructor(public id: string) {
    super();
  }

  acknowledge() {
    this.isAcknowledged = true;
  }
  addAlarmItem(item: AlarmItem) {
    this.items.push(item);
  }
}
