import { Injectable } from '@nestjs/common';
import { UpsertMaterializedAlarmsRepository } from 'src/alarms/application/ports/upsert-materialized-alarms.repository';
import { AlarmReadModel } from 'src/alarms/domain/read-models/alarm.read-model';
import { MaterializedAlarmView } from '../schemas/materialized-alarm-view.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class OrmUpsertMaterializedAlarmRepository
  implements UpsertMaterializedAlarmsRepository
{
  constructor(
    @InjectModel(MaterializedAlarmView.name)
    private readonly alarmModel: Model<MaterializedAlarmView>,
  ) {}

  // "We don't need mapping since the MaterializedAlarmView schema is same as the AlarmReadModel"
  async upsert(
    alarm: Pick<AlarmReadModel, 'id'> & Partial<AlarmReadModel>,
  ): Promise<void> {
    await this.alarmModel.findOneAndUpdate(
      {
        id: alarm.id,
      },
      alarm,
      {
        upsert: true,
      },
    );
    return;
  }
}
