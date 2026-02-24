import { DataSource, DataSourceOptions } from 'typeorm';
import * as dotenv from 'dotenv';
import { Outbox } from './infrastructure/outbox/outbox.entity';
import { ShippingProduct } from './domain/shipping_products.entity';
import { Inbox } from './infrastructure/inbox/inbox.entity';
import { Shipment } from './domain/shipment.entity';


dotenv.config();

const rawDataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  synchronize: false,
  entities: [ShippingProduct, Outbox, Inbox, Shipment],
  migrations: ['dist/migrations/*.js'],
  seeds: ['dist/seeds/**/*.js'],
  logging: true,
  autoLoadEntities: true, 
};

export const dataSourceOptions = rawDataSourceOptions as DataSourceOptions;

const dataSource = new DataSource(dataSourceOptions);
export default dataSource;