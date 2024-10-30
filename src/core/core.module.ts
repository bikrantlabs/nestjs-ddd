import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ApplicationBootstrapOptions } from 'src/common/interfaces/application-bootstrap-options.interface';
import { PrismaModule } from 'src/prisma/prisma.module';
import { EVENT_STORE_CONNECTION } from './core.constants';

@Module({})
export class CoreModule {
  static forRoot(options: ApplicationBootstrapOptions) {
    const DB_READ_URL = process.env.DATABASE_READ_URL;
    const EVENT_STORE_DB = process.env.EVENT_STORE_DATABASE_URL;

    return {
      module: CoreModule,
      imports: [
        PrismaModule,
        MongooseModule.forRoot(DB_READ_URL),
        MongooseModule.forRoot(EVENT_STORE_DB, {
          connectionName: EVENT_STORE_CONNECTION,
          directConnection: true,
        }),
      ],
    };
  }
}
