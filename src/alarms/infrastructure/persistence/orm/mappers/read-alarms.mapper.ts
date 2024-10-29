import { Alarm as DomainAlarm } from 'src/alarms/domain/alarm';
import { AlarmItem } from 'src/alarms/domain/alarm-item';
import { AlarmSeverity } from 'src/alarms/domain/value-objects/alarm-severity';
import { MaterializedAlarmView } from '../schemas/materialized-alarm-view.schema';

// Alarm mappers for (MongoDB)
export class ReadAlarmMapper {
  static toDomain(raw: MaterializedAlarmView): DomainAlarm {
    const alarmSeverity = new AlarmSeverity(
      raw.severity as 'critical' | 'low' | 'medium' | 'high',
    );
    const alarmModel = new DomainAlarm(raw.id);
    alarmModel.name = raw.name;
    alarmModel.isAcknowledged = raw.isAcknowledged;
    alarmModel.trigerredAt = raw.trigerredAt;
    alarmModel.severity = alarmSeverity;

    alarmModel.items = raw.items.map(
      (item) => new AlarmItem(item.id, item.name, item.type),
    );
    return alarmModel;
  }

  static toPersistence(alarm: DomainAlarm): MaterializedAlarmView {
    return {
      id: alarm.id,
      name: alarm.name,
      severity: alarm.severity.value,
      isAcknowledged: alarm.isAcknowledged,
      trigerredAt: alarm.trigerredAt,
      items: alarm.items.map((item) => ({
        id: item.id,
        name: item.name,
        type: item.type,
      })),
    };
  }
}
