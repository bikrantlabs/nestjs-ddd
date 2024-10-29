import { Alarm } from '../../domain/alarm';

// Repository for creating alarms (implemeted by postgres db)
export abstract class CreateAlarmRepository {
  abstract save(alarm: Alarm): Promise<Alarm>;
}
