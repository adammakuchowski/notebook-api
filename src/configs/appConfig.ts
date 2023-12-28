import {config as dotenv} from 'dotenv'

dotenv()

interface DatabaseConfig {
  host: string;
  port: number;
  username: string;
  password: string;
  name: string;
}

interface AppConfig {
  port: number;
  database: DatabaseConfig;
}

const appConfig: AppConfig = {
  port: process.env.PORT ? Number(process.env.PORT) : 3000,
  database: {
    host: process.env.DB_HOST || '127.0.0.1',
    port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 27017,
    username: process.env.DB_USERNAME || 'user',
    password: process.env.DB_PASSWORD || 'password',
    name: process.env.DB_NAME || 'my_database'
  }
}

export default appConfig
