import { Injectable, Type } from '@nestjs/common';
import { Event } from '../schema/event.schema';
import { SerializableEvent } from 'src/shared/domain/interfaces/serializable-event';
import { AlarmCreatedEvent } from 'src/alarms/domain/events/alarm-created.event';

@Injectable()
export class EventDeserializer {
  deserialize<T>(event: Event): SerializableEvent<T> {
    const eventCls = this.getEventClassByType(event.type);
    return {
      ...event,
      data: this.instantiateSerializedEvent(eventCls, event.data),
    };
  }
  getEventClassByType(type: string) {
    // More scalable approach later
    switch (type) {
      case AlarmCreatedEvent.name:
        return AlarmCreatedEvent;
    }
  }

  instantiateSerializedEvent<T extends Type>(
    eventCls: T,
    data: Record<any, any>,
  ) {
    return Object.assign(Object.create(eventCls.prototype), data);
  }
}
