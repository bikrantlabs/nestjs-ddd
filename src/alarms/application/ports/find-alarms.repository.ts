import { AlarmReadModel } from 'src/alarms/domain/read-models/alarm.read-model';

// Repository for reading alarms  (implemeted by mongo db)
export abstract class FindAlarmsRepository {
  abstract findAll(): Promise<AlarmReadModel[]>;
}
