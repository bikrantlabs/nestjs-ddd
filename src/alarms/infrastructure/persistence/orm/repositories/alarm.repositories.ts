import { Injectable } from '@nestjs/common';
import { AlarmRepository } from 'src/alarms/application/ports/alarm.repository';
import { Alarm } from 'src/alarms/domain/alarm';
import { PrismaService } from 'src/prisma/prisma.service';
import { AlarmMapper } from '../mappers/alarm.mapper';

@Injectable()
export class OrmAlarmRepository implements AlarmRepository {
  constructor(private readonly prismaService: PrismaService) {}
  /**
   * We are using domain models throughout our application, but ORM libraries returns entities.
   * So we convert them back to domain models using mappers.
   * This is done so that even if underlying ORM library changes, our application is not affected.
   */
  async findAll(): Promise<Alarm[]> {
    const entities = await this.prismaService.alarm.findMany({
      include: {
        items: true,
      },
    });
    return entities.map((entity) => AlarmMapper.toDomain(entity));
  }

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
