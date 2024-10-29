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