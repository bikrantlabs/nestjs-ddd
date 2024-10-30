import {
  Injectable,
  OnApplicationBootstrap,
  OnApplicationShutdown,
} from '@nestjs/common';
import { EventBus } from '@nestjs/cqrs';
import { InjectModel } from '@nestjs/mongoose';
import { ChangeStream, ChangeStreamInsertDocument } from 'mongodb';
import { Model } from 'mongoose';
import { EVENT_STORE_CONNECTION } from 'src/core/core.constants';
import { Event, EventDocument } from './schema/event.schema';
import { EventDeserializer } from './deserializers/event.deserializer';
@Injectable()
export class EventBridge
  implements OnApplicationBootstrap, OnApplicationShutdown
{
  private changeStream: ChangeStream;

  constructor(
    @InjectModel(Event.name, EVENT_STORE_CONNECTION)
    private readonly eventStore: Model<Event>,
    private readonly eventBus: EventBus,
    private readonly eventDeserializer: EventDeserializer,
  ) {}

  onApplicationBootstrap() {
    // @ts-ignore - Error due to version mismatch or something
    this.changeStream = this.eventStore
      .watch()
      .on('change', (change: ChangeStreamInsertDocument<EventDocument>) => {
        if (change.operationType === 'insert') {
          this.handleEventStoreChange(change);
        }
      });
  }
  handleEventStoreChange(change: ChangeStreamInsertDocument<EventDocument>) {
    /**
     * If I need multi document transactions, I can use `change.txnNumber` to achieve atomicity
     */
    const insertedEvent = change.fullDocument;

    // Deserialize the event data and push to event bus
    const eventInstance = this.eventDeserializer.deserialize(insertedEvent);

    this.eventBus.subject$.next(eventInstance.data);
    // We have successfully implemented the push strategy with collection watchers by using event bridge
  }
  onApplicationShutdown() {
    this.changeStream.close();
  }
}
