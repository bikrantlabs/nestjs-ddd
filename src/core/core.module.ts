import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ApplicationBootstrapOptions } from 'src/common/interfaces/application-bootstrap-options.interface';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({})
export class CoreModule {
  static forRoot(options: ApplicationBootstrapOptions) {
    const DB_URL = process.env.DATABASE_READ_URL;
    console.log(`🔥 core.module.ts:10 ~ DB URL ~`, DB_URL);
    const imports =
      options.driver === 'orm'
        ? [PrismaModule, MongooseModule.forRoot(DB_URL)]
        : [];
    return {
      module: CoreModule,
      imports,
    };
  }
}
