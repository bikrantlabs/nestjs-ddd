import {
  Injectable,
  OnApplicationBootstrap,
  OnApplicationShutdown,
} from '@nestjs/common';
import { MongoEventStore } from '../mongo-event-store';
import { EventBus, IEvent, IEventPublisher } from '@nestjs/cqrs';
import { EventSerializer } from '../serializers/event.serializer';
import { VersionedAggregateRoot } from 'src/shared/domain/aggregate-root';

@Injectable()
export class EventStorePublisher
  implements OnApplicationBootstrap, IEventPublisher
{
  constructor(
    private readonly eventStore: MongoEventStore,
    private readonly eventBus: EventBus,
    private readonly eventSerializer: EventSerializer,
  ) {}
  onApplicationBootstrap() {
    this.eventBus.publisher = this;
  }

  publish<T extends IEvent = IEvent>(
    event: T,
    dispatcher: VersionedAggregateRoot,
  ) {
    const serializableEvent = this.eventSerializer.serialize(event, dispatcher);
    return this.eventStore.persist(serializableEvent);
  }

  publishAll<TEvent extends IEvent>(
    events: TEvent[],
    dispatcher: VersionedAggregateRoot,
  ) {
    const serializableEvents = events
      .map((event) => this.eventSerializer.serialize(event, dispatcher))
      .map((serializableEvent, index) => ({
        ...serializableEvent,
        position: dispatcher.version.value + index + 1,
      }));
    return this.eventStore.persist(serializableEvents);
  }
}
