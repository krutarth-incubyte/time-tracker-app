import { Injectable, OnModuleInit } from '@nestjs/common';
import { drizzle } from 'drizzle-orm/postgres-js';
import * as schema from './schemas';
import { ConfigService } from '@nestjs/config';
import * as postgres from 'postgres';

@Injectable()
export class DatabaseService implements OnModuleInit {
  public db: ReturnType<typeof drizzle>;

  constructor(private readonly configService: ConfigService) {
    const client = postgres(this.configService.get<string>('DATABASE_URL')!);
    this.db = drizzle(client, {
      schema,
    });
  }

  async onModuleInit() {
    try {
      await this.db.execute('SELECT 1');
      console.log('Database connected successfully');
    } catch (error) {
      console.error('Database connection failed:', error);
    }
  }
}
