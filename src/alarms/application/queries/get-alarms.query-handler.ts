import { CommandHandler, ICommandHandler, QueryHandler } from '@nestjs/cqrs';
import { Logger } from '@nestjs/common';
import { AlarmRepository } from '../ports/alarm.repository';
import { AlarmFactory } from 'src/alarms/domain/factories/alarm.factory';
import { GetAlarmsQuery } from './get-alarms.query';
import { Alarm as DomainAlarm } from 'src/alarms/domain/alarm';

@QueryHandler(GetAlarmsQuery)
export class GetAlarmsQueryHandler
  implements ICommandHandler<GetAlarmsQuery, DomainAlarm[]>
{
  private readonly logger = new Logger(GetAlarmsQueryHandler.name);

  constructor(private readonly alarmRepository: AlarmRepository) {}

  async execute(query: GetAlarmsQuery): Promise<DomainAlarm[]> {
    // We could access query.limit, and other options in GetAlarmsQuery constructor here
    this.logger.debug(`Processing "GetAlarmsQuery" : ${JSON.stringify(query)}`);
    return this.alarmRepository.findAll();
  }
}
