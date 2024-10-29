import { Module } from '@nestjs/common';
import { OrmPersistenceModule } from './persistence/orm/orm-persistence.module';
import { InMemoryPersistenceModule } from './persistence/in-memory/in-memory-persistence.module';

@Module({})
export class AlarmsInfrastructureModule {
  static use(driver: 'orm' | 'in-memory') {
    const persistenceModule =
      driver === 'orm' ? OrmPersistenceModule : InMemoryPersistenceModule;
    return {
      module: AlarmsInfrastructureModule,
      imports: [persistenceModule],
      exports: [persistenceModule],
    };
  }
}
