# Multi Layer Architecture

Inside each app `(src/alarms)` in our case, there exists 4 main entry points:

### Application
The application folder will contain the application services like handlers, and application specific components. It will communicate with data access components, message brokers through ports(interfaces).
- We've moved `module.ts`, and `service.ts` to this folder


> Commands
A command is an object that is sent to the domain for a state change which is handled by a command handler. We cannot directly use `dtos` and pass it to domain layer for processing, since DTOs are only for presentation layers.


### Domain
This folder will contain domain models, value objects and domain-specific component.

> Value Objects
Value objects represents only descriptive aspect of a domain (Alarm), AlarmSeverity in our case. They have no identity, they are just like properties of a domain. For example a `Post` model might have `Content` field which enforces its own set of rules defined like: 
```domain/post.ts
export class Post {
  constructor(
    public id: string,
    public title: string,
    public content: PostContent,
  ) {}
}
```
```domain/value-objects/post-content.ts
// PostContent is a value-object
export class PostContent {
  constructor(readonly content: string) {
    if(content.length > 5000){
        throw Error()
    }
    if (!content.trim()) {
      throw new Error('Content cannot be empty.');
    }
    // Even though two objects are different, their content can be same
    equals(otherContent: PostContent){
        return otherContent === this.content;
    }
  }
}

``` 
> Factories
Factories are the encapsulation of creation of complex classes and aggregates. It only contains `create()` method to create the complex class.

### Infrastructure
This folder will contain data access components, message brokers, and other external systems. It will implement the ports(interfaces) defined by application layer.

### Presenters
Will contain controllers/gateways for exposing APIs.

The `http` directory represents the http layer of our context `alarms`.
We might also have `views` directory inside same presenters layer, but since this is an api-only project.
We could also have `graphql` directory inside same presenters layer if we can to expose graphql interfaces to users. 

The `dtos` are kept inside presentation layer because they contain the shape of data sent/received through http request, so we can't move `dtos` to other folders.

## Ports and Adapters

Basically used to define how a core system interacts with external components. External components includes databases, external apis, messaging systems, user interfaces, Logging/Monitoring Service, File Storage Solutions etc.

Adapters lies inside `infrastructure/persistence/in-memory`(just some values in arrays/objects database adapter), `infrastructure/persistence/orm`(ORM database adapter)

> NOTE: Ports lies inside application layer. _Ports only define interfaces through which application interacts with external services_ The example of `Port` is `alarm.repository.ts` which only contains abstract class exposing the methods which are used to interact with database.

> Adapters lies inside infrastructure layer, _and they are the implementation of those ports_ In this example we have an adapter `infrastructure/persistence/(in-memory | orm)/repositories/alarm.repositories.ts. Those repositories are concrete implementation of ports.

## CQRS
With the help of CQRS, we can separate Command Handlers(Write Operations) and Read Handler(Read Operations) from the database.

## Events
Two types of events `Domain Events`(states changes in domain, alarm-created.event.ts is a domain event in our case) and `Integration Events`(cross service communication)

> Handling domain events is concern of application layer, hence alarm-created.event-handler.ts lies inside application layer, domain layer should only focus on domain-logic, not handling its events. Domain can't interact with repositories directly, but application layer can, in event-handlers we mostly talk to repositories to reflect extra changes to some aggregated/related models.

## Event Store
Whenever any state changes in the application (database written), we need to update the read database as well. But your current application pattern is Event-Driven, Any state changes or database write will emit an event with the data, and the event-store should listen/subscribe to those events.

Event store is just a database which stores the data emitted by any event. Then we need to serialize this raw json data and store it in our read database. Whenever any kind of "READ" event is emitted, the event-store fetches the data from read database, and returns the data. For implementing event store we have created shared/ module. We will need:
- We need to declare `EventSchema` schema that represents the event stored in database(we can use any database).
- We need serializers/deserializers to convert events to/from json.
- Class(like a repository) that will be responsible for storing/retrieving events from database via `EventSchema`  

> How is `alarm.commit()` from `create-alarm.command-handler.ts` automatically executing `MongoEventStore`?
It's because the `onApplicationBootstrap` method in `shared/infrastructure/event-store-publisher.ts` sets the publisher to `this`, meaning that same class. So whenever the event is emitted through `EventBus` (which is used by `AggregateRoot`) will be handled by `EventStorePublisher`. The `commit()` method of `AggregateRoot` automatically does `eventBus.publish(this.getUncommitedEvents())`. And inside that publisher, we are using `eventStore.persist()` to push data to `eventStore`

> If you want to control which publisher handles different events, we can _Use a Custom EventBus with Multiple Publishers_

## Event Bridge
Till now, we published the event to event bus, and the `MongoEventStore.publish()` method listens to that event, and pushes the event data in our `EventStore`(MongoDB database). But those event data are not reflected in our main `Read Database`(Yet another MongoDB database). 

Now the `EventBridge` will subscribe to our `EventModel` in database (only listen to changes in one model, not the whole database) using `this.eventStore.watch().on('change',...)` method, so whenever there is **update**, **insertion**, **creation**, **deletion** in our `EventStore`, the `EventBridge.handleEventStoreChange` will take the event data, deserialize it into instance of `SerializableEvent` class, and add the event to `EventBus Queue`

> Note: `EventBus Queue(MongoEventStore.persist)` is actively pushing the events into the main Read Database.

> We have successfully implemented the push strategy with collection watchers by using event bridge

## Serializers and Deserializers
We need serializers to convert our objects/class to plain javascript object, so that it can be saved to database (event store).
> Note: serializedEvent.type is set to event.constructor?.name, which will be inferred from `alarm.apply(new AlarmCreatedEvent(alarm), { skipHandler: true });` inside `alarm.factory.ts`. See Flow below for more details. This is important because deserializer uses same event.type to create the Class instance which is necessary for `@EventHandler(AlarmCreatedEvent)` inside `alarm-created.event-handler.ts` to execute.

And we need deserializers to convert plain javascript object obtained/read from event-store into a instance of the Event Class, so that we can push the event to the `event bus`. Event bus expects the instance of event class, not just a plain js object.

# Creating a Alarm through POST Request FLOW

1. `alarms.controller.ts` is exposing `create` route which expects `CreateAlarmDto`

2. We are converting those `DTOs` into `CreateAlarmCommand` and passing it to `alarms.service.ts`

3. In `alarms.service.ts`'s `create` method, we are executing `this.commandBus.execute(createAlarmCommand)`

4. The `create-alarm.command-handler.ts` is listening to this `CreateAlarmCommand`(cqrs is responsible for listening to commands).

5. Inside `create-alarm.command-handler.ts`, we are converting `CrateAlarmCommand` to our `Domain Entity (domain/alarm.ts)`, merging it with `event publisher` and invoking `commit()` method provided by `AggregareRoot`(cqrs). We are basically `publishing`(not adding to event bus, it's different) the event.

6. The `event-store.publisher.ts:persist()` method is automatically invoked because of `this.eventBus.publisher = this`(eventBus.publisher is not eventBus.subject.next) inside `onApplicationBoostrap` method.

7. Then `event-store.publisher.ts:publish()` method converts the `deserialized event(domain class)` into `serialized event(object)` and invokes `mongo-event-store.ts:publish()`, which pushes event data in our EventStore Database.

7. The `event-bridge.ts` is actively listening to changes in `EventModel` in event store db, and on change, we are changing `serialized (plain object)` (the `eventModel.watch().on("change")` automcatically receives the JSON data that was recently modified/added into collection) into `deserialized (domain class)` and `event-bridge.ts:handleStoreEventChange()` pushes it to the `EventBus` using `this.eventBus.subject$.next(eventInstance.data)` (since EventBus expects an instance of Class into its stream, eventInstance.data is a class, on our case with the name "AlarmCreatedEvent").  

8. Whenever the event is pushed to eventBus stream with `eventInstance.data` (that _data_ is deserialized _AlarmCreatedEvent_), the `alarm-created.event-handler.ts` method runs and now the actual **Read database** is updated from there.

# How does `this.eventBus.subject$.next(eventInstance.data)` automatically triggers `alarm-created.event-handler`?

Answer: First inside `create-alarm.command-handler.ts` we are creating alarm entity by `this.alarmFactory.create`.
Inside `alarmFactory.create`, we are doing `alarm.apply(new AlarmCreatedEvent(alarm), { skipHandler: true })`, we are binding the `AlarmCreatedEvent` to that samr `alarm` instance.
Then back to `create-alarm.command-handler.ts` is publishing same alarm to `eventbus`, which runs `event-store.publisher.ts:publish`. `serializedEvent.type` is set to `event.constructor?.name`, which will be inferred from `alarm.apply(new AlarmCreatedEvent(alarm), { skipHandler: true });` inside `alarm.factory.ts`. See Flow below for more details. This is important because deserializer uses same event.type to create the Class instance which is necessary for `@EventHandler(AlarmCreatedEvent)` inside `alarm-created.event-handler.ts` to execute.

> Important Note: Inside `alarm.factory.ts` , `alarm.apply(new AlarmCreatedEvent(alarm), { skipHandler: true })` is crucial so that `@EventHandler` will detect the event, Serialize plays important role to create `type: event.constructor?.name` and deserializer to build the same class from plain js object.