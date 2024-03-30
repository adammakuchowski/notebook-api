import {config as dotenv} from 'dotenv'

dotenv()

interface DatabaseConfig {
  host: string;
  port: number;
  username: string;
  password: string;
  name: string;
  userLimit: number;
  mongoUrl?: string;
}

interface AuthorizationConfig {
  secretKey: string;
  saltRounds: number;
}

interface AppConfig {
  port: number;
  database: DatabaseConfig;
  authorization: AuthorizationConfig;
}

const appConfig: AppConfig = {
  port: Number(process.env.PORT ?? 3000),
  database: {
    host: process.env.DB_HOST ?? '127.0.0.1',
    port: Number(process.env.DB_PORT ?? 27017),
    username: process.env.DB_USERNAME ?? 'user',
    password: process.env.DB_PASSWORD ?? 'password',
    name: process.env.DB_NAME ?? 'my_database',
    mongoUrl: process.env.MONGO_URL,
    userLimit: Number(process.env.DB_USER_LIMIT ?? 5)
  },
  authorization: {
    secretKey: process.env.SECRET_KEY ?? 'secret',
    saltRounds: Number(process.env.SALT_ROUNDS ?? 10)
  }
}

export default appConfig
