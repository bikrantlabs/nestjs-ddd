import { Logger } from '@nestjs/common';
import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { AlarmFactory } from 'src/alarms/domain/factories/alarm.factory';
import { CreateAlarmCommand } from './create-alarm.command';

@CommandHandler(CreateAlarmCommand)
export class CreateAlarmCommandHandler
  implements ICommandHandler<CreateAlarmCommand>
{
  private readonly logger = new Logger(CreateAlarmCommandHandler.name);

  constructor(
    private readonly alarmFactory: AlarmFactory,
    private readonly eventPublisher: EventPublisher,
  ) {}

  async execute(command: CreateAlarmCommand) {
    this.logger.debug(
      `Processing "CreateAlarmCommand" : ${JSON.stringify(command)}`,
    );
    const alarm = this.alarmFactory.create(
      command.name,
      command.severity,
      command.trigerredAt,
      command.items,
    );
    // alarm is an aggregate instance since AlarmFactory is returning Alarm, which is extending AggregateRoot
    // THIS IS MOST IMPORTANT STEP
    this.eventPublisher.mergeObjectContext(alarm);

    alarm.commit();
    return alarm;
  }
}
