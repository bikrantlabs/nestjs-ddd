import { Injectable } from '@nestjs/common';
import { CreateAlarmRepository } from 'src/alarms/application/ports/create-alarm.repository';
import { Alarm } from 'src/alarms/domain/alarm';
import { PrismaService } from 'src/prisma/prisma.service';
import { AlarmMapper } from '../mappers/alarm.mapper';

@Injectable()
export class OrmCreateAlarmRepository implements CreateAlarmRepository {
  constructor(private readonly prismaService: PrismaService) {}

  /**
   * We are using domain models throughout our application, but ORM libraries needs normal object to save in database.
   * We convert domain model(Class) to a normal object using mappers.
   * While returning the new data, we convert the object back to domain model.
   */
  async save(alarm: Alarm): Promise<Alarm> {
    const entity = AlarmMapper.toPersistence(alarm);
    const newEntity = await this.prismaService.alarm.create({
      data: entity,
      include: {
        items: true,
      },
    });
    return AlarmMapper.toDomain(newEntity);
  }
}
