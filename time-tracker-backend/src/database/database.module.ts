import { Module } from '@nestjs/common';
import { DATABASE_CONNECTION } from './database-connection';
import { ConfigService } from '@nestjs/config';
import { drizzle } from 'drizzle-orm/postgres-js';
import * as postgres from 'postgres';
import * as schema from './schemas/index';

@Module({
  imports: [],
  providers: [
    {
      provide: DATABASE_CONNECTION,
      useFactory: (configService: ConfigService) => {
        const client = postgres(configService.get<string>('DATABASE_URL')!);
        return drizzle(client, { schema });
      },
      inject: [ConfigService],
    },
  ],
  exports: [],
})
export class DatabaseModule {}
