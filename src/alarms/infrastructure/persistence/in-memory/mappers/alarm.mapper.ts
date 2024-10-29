import { Alarm as DomainAlarm } from 'src/alarms/domain/alarm';
import { Alarm as AlarmEntity, AlarmItemEntity, Prisma } from '@prisma/client';
import { AlarmSeverity } from 'src/alarms/domain/value-objects/alarm-severity';
import { AlarmItem } from 'src/alarms/domain/alarm-item';

export class AlarmMapper {
  static toDomain(
    alarmEntity: AlarmEntity & { items: AlarmItemEntity[] },
  ): DomainAlarm {
    const alarmSeverity = new AlarmSeverity(
      alarmEntity.severity as 'critical' | 'low' | 'medium' | 'high',
    );
    const alarmModel = new DomainAlarm(alarmEntity.id);
    alarmModel.name = alarmEntity.name;
    alarmModel.isAcknowledged = alarmEntity.isAcknowledged;
    alarmModel.trigerredAt = alarmEntity.trigerredAt;
    alarmModel.severity = alarmSeverity;

    alarmModel.items = alarmEntity.items.map(
      (item) => new AlarmItem(item.id, item.name, item.type),
    );
    return alarmModel;
  }

  static toPersistence(
    alarm: DomainAlarm,
  ): AlarmEntity & { items: Array<AlarmItemEntity> } {
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
        alarmId: alarm.id, // Manually attach alarmId for in-memory database, since it doesn't support relations
      })),
    };
  }
}
