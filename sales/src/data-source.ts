import { DataSource, DataSourceOptions } from 'typeorm';
import * as dotenv from 'dotenv';
import { SalesProduct } from './sales.entity';
import { Outbox } from './outbox/outbox.entity';
import { Order } from './order/order.entity';
import { Inbox } from './inbox/inbox.entity';


dotenv.config();

const rawDataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  synchronize: false,
  entities: [SalesProduct, Outbox, Order, Inbox],
  migrations: ['dist/migrations/*.js'],
  seeds: ['dist/seeds/**/*.js'],
  logging: true,
  autoLoadEntities: true, 
};

export const dataSourceOptions = rawDataSourceOptions as DataSourceOptions;

const dataSource = new DataSource(dataSourceOptions);
export default dataSource;