import { Alarm as DomainAlarm } from 'src/alarms/domain/alarm';
import { Alarm } from '@prisma/client';
import { AlarmSeverity } from 'src/alarms/domain/value-objects/alarm-severity';
export class AlarmMapper {
  static toDomain(alarmEntity: Alarm): DomainAlarm {
    const alarmSeverity = new AlarmSeverity(
      alarmEntity.severity as 'critical' | 'low' | 'medium' | 'high',
    );
    const alarmModel = new DomainAlarm(
      alarmEntity.id,
      alarmEntity.name,
      alarmSeverity,
    );
    return alarmModel;
  }

  static toPersistence(alarm: DomainAlarm) {
    const entity: Alarm = {
      id: alarm.id,
      name: alarm.name,
      severity: alarm.severity.value,
    };
    return entity;
  }
}
