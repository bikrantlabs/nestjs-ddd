import { Injectable } from '@nestjs/common';
import { AlarmRepository } from 'src/alarms/application/ports/alarm.repository';
import { Alarm as DomainAlarm } from 'src/alarms/domain/alarm';

import { PrismaService } from 'src/prisma/prisma.service';
import { AlarmMapper } from '../mappers/alarm.mapper';
import { Alarm as AlarmEntity } from '@prisma/client';

@Injectable()
export class InMemoryAlarmRepository implements AlarmRepository {
  private readonly alarms = new Map<string, AlarmEntity>();
  constructor() {}
  /**
   * We are using domain models throughout our application, but ORM libraries returns entities.
   * So we convert them back to domain models using mappers.
   * This is done so that even if underlying ORM library changes, our application is not affected.
   */
  async findAll(): Promise<DomainAlarm[]> {
    const entities = Array.from(this.alarms.values());
    return entities.map((entity) => AlarmMapper.toDomain(entity));
  }

  /**
   * We are using domain models throughout our application, but ORM libraries needs normal object to save in database.
   * We convert domain model(Class) to a normal object using mappers.
   * While returning the new data, we convert the object back to domain model.
   */
  async save(alarm: DomainAlarm): Promise<DomainAlarm> {
    const entity = AlarmMapper.toPersistence(alarm);
    this.alarms.set(entity.id, entity);

    const newEntity = this.alarms.get(entity.id);
    return AlarmMapper.toDomain(newEntity);
  }
}
