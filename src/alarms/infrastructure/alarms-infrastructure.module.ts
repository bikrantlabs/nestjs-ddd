import { Module } from '@nestjs/common';
import { OrmPersistenceModule } from './persistence/orm/orm-persistence.module';
import { SharedModule } from 'src/shared/shared.module';

@Module({
  imports: [SharedModule],
  exports: [SharedModule],
})
export class AlarmsInfrastructureModule {
  static use(driver: 'orm') {
    return {
      module: AlarmsInfrastructureModule,
      imports: [OrmPersistenceModule],
      exports: [OrmPersistenceModule],
    };
  }
}
