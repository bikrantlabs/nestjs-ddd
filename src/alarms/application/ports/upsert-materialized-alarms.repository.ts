import { AlarmReadModel } from 'src/alarms/domain/read-models/alarm.read-model';

export abstract class UpsertMaterializedAlarmsRepository {
  // Make id required but other values optional
  abstract upsert(
    alarms: Pick<AlarmReadModel, 'id'> & Partial<AlarmReadModel>,
  ): Promise<void>;
}
