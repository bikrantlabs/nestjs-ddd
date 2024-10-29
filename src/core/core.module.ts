import { Module } from '@nestjs/common';
import { ApplicationBootstrapOptions } from 'src/common/interfaces/application-bootstrap-options.interface';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({})
export class CoreModule {
  static forRoot(options: ApplicationBootstrapOptions) {
    const imports = options.driver === 'orm' ? [PrismaModule] : [];
    return {
      module: CoreModule,
      imports,
    };
  }
}
