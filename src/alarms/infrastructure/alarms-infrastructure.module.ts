import { Module } from '@nestjs/common';
import { OrmPersistenceModule } from './persistence/orm/orm-persistence.module';

@Module({})
export class AlarmsInfrastructureModule {
  static use(driver: 'orm') {
    return {
      module: AlarmsInfrastructureModule,
      imports: [OrmPersistenceModule],
      exports: [OrmPersistenceModule],
    };
  }
}
