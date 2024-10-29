import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { FindAlarmsRepository } from 'src/alarms/application/ports/find-alarms.repository';
import { AlarmReadModel } from 'src/alarms/domain/read-models/alarm.read-model';
import { MaterializedAlarmView } from '../schemas/materialized-alarm-view.schema';

@Injectable()
export class OrmFindAlarmsRepository implements FindAlarmsRepository {
  constructor(
    @InjectModel(MaterializedAlarmView.name)
    private readonly alarmModel: Model<MaterializedAlarmView>,
  ) {}
  // WHY ARE NOT WE MAPPING TO DOMAIN??
  // "We don't need mapping since the MaterializedAlarmView schema is same as the AlarmReadModel"
  //     return data.map((alarm) => {
  //       const object = alarm.toObject();
  //       return ReadAlarmMapper.toDomain(object);
  //     });
  // This is the ultimate goal of using separate data source for denormalized data (keepin model and schema same and preventing the overhead of mapping)
  async findAll(): Promise<AlarmReadModel[]> {
    return await this.alarmModel.find();
  }
}
