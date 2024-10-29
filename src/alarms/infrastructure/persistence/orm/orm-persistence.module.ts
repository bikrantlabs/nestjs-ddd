import { Module } from '@nestjs/common';
import { AlarmRepository } from 'src/alarms/application/ports/alarm.repository';
import { PrismaModule } from 'src/prisma/prisma.module';
import { OrmAlarmRepository } from './repositories/alarm.repositories';

@Module({
  imports: [PrismaModule],
  providers: [
    {
      provide: AlarmRepository,
      useClass: OrmAlarmRepository,
    },
  ],
  exports: [AlarmRepository],
})
export class OrmPersistenceModule {}
