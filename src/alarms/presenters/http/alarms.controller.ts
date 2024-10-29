import { Body, Controller, Get, Post } from '@nestjs/common';

import { AlarmsService } from 'src/alarms/application/alarms.service';
import { CreateAlarmDto } from './dto/create-alarm.dto';
import { CreateAlarmCommand } from 'src/alarms/application/commands/create-alarm.command';
import { GetAlarmsQuery } from 'src/alarms/application/queries/get-alarms.query';

@Controller('alarms')
export class AlarmsController {
  constructor(private readonly alarmsService: AlarmsService) {}

  @Post()
  create(@Body() createAlarmDto: CreateAlarmDto) {
    // We cannot pass createAlarmDto directly to the service layer
    // Because DTOs are part of the presentation layer
    const createAlarmCommand = new CreateAlarmCommand(
      createAlarmDto.name,
      createAlarmDto.severity,
      createAlarmDto.trigerredAt,
      createAlarmDto.items,
    );
    return this.alarmsService.create(createAlarmCommand);
  }

  @Get()
  findAll() {
    const getAlarmsQuery = new GetAlarmsQuery();
    return this.alarmsService.findAll(getAlarmsQuery);
  }
}
