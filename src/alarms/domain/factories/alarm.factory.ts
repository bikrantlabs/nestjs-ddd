import { Injectable } from '@nestjs/common';
import { AlarmSeverity } from '../value-objects/alarm-severity';
import { randomUUID } from 'crypto';
import { Alarm } from '../alarm';

@Injectable()
export class AlarmFactory {
  create(name: string, severity: string): Alarm {
    const alarmId = randomUUID();
    const alarmSeverity = new AlarmSeverity(
      severity as unknown as AlarmSeverity['value'],
    );
    return new Alarm(alarmId, name, alarmSeverity);
  }
}
