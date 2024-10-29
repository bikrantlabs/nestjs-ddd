import { Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { AlarmCreatedEvent } from 'src/alarms/domain/events/alarm-created.event';
import { UpsertMaterializedAlarmsRepository } from '../ports/upsert-materialized-alarms.repository';

@EventsHandler(AlarmCreatedEvent)
export class AlarmCreatedEventHandler
  implements IEventHandler<AlarmCreatedEvent>
{
  private readonly logger = new Logger(AlarmCreatedEventHandler.name);

  constructor(
    private readonly upsertMaterializedAlarmsRepository: UpsertMaterializedAlarmsRepository,
  ) {}
  async handle(event: AlarmCreatedEvent) {
    this.logger.debug(`Alarm created event handler: ${JSON.stringify(event)}`);

    /**
     * In a real-world application, we would have to ensure that this operation is atomic
     * with the creation of alarm. Otherwise, we could end up with an alarm that is not reflected
     * in the read model.(because database operation fails)
     * Checkout "Transactional inbox/outbox pattern."
     * NOTE: Use message brokers
     */
    await this.upsertMaterializedAlarmsRepository.upsert({
      id: event.alarm.id,
      name: event.alarm.name,
      severity: event.alarm.severity.value,
      trigerredAt: event.alarm.trigerredAt,
      items: event.alarm.items,
    });
  }
}
