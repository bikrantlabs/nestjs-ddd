import { Module } from '@nestjs/common';
import { CreateAlarmRepository } from 'src/alarms/application/ports/create-alarm.repository';
import { PrismaModule } from 'src/prisma/prisma.module';
import { OrmCreateAlarmRepository } from './repositories/create-alarm.repositories';
import { FindAlarmsRepository } from 'src/alarms/application/ports/find-alarms.repository';
import { OrmFindAlarmsRepository } from './repositories/find-alarms.repository';
import { UpsertMaterializedAlarmsRepository } from 'src/alarms/application/ports/upsert-materialized-alarms.repository';
import { OrmUpsertMaterializedAlarmRepository } from './repositories/upsert-materialized-alarms.repository';
import { MongooseModule } from '@nestjs/mongoose';
import {
  MaterializedAlarmView,
  MaterializedAlarmViewSchema,
} from './schemas/materialized-alarm-view.schema';

@Module({
  imports: [
    PrismaModule,
    MongooseModule.forFeature([
      { name: MaterializedAlarmView.name, schema: MaterializedAlarmViewSchema },
    ]),
  ],
  providers: [
    {
      provide: CreateAlarmRepository,
      useClass: OrmCreateAlarmRepository,
    },
    {
      provide: FindAlarmsRepository,
      useClass: OrmFindAlarmsRepository,
    },
    {
      provide: UpsertMaterializedAlarmsRepository,
      useClass: OrmUpsertMaterializedAlarmRepository,
    },
  ],
  exports: [
    CreateAlarmRepository,
    FindAlarmsRepository,
    UpsertMaterializedAlarmsRepository,
  ],
})
export class OrmPersistenceModule {}
