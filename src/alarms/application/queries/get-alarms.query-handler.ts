import { Logger } from '@nestjs/common';
import { ICommandHandler, QueryHandler } from '@nestjs/cqrs';
import { AlarmReadModel } from 'src/alarms/domain/read-models/alarm.read-model';
import { FindAlarmsRepository } from '../ports/find-alarms.repository';
import { GetAlarmsQuery } from './get-alarms.query';

@QueryHandler(GetAlarmsQuery)
export class GetAlarmsQueryHandler
  implements ICommandHandler<GetAlarmsQuery, AlarmReadModel[]>
{
  private readonly logger = new Logger(GetAlarmsQueryHandler.name);

  constructor(private readonly findAlarmRepository: FindAlarmsRepository) {}

  async execute(query: GetAlarmsQuery): Promise<AlarmReadModel[]> {
    // We could access query.limit, and other options in GetAlarmsQuery constructor here
    this.logger.debug(`Processing "GetAlarmsQuery" : ${JSON.stringify(query)}`);
    return this.findAlarmRepository.findAll();
  }
}
