interface CorsOptions {
  origin: string[]
  optionsSuccessStatus: number
  allowedHeaders: string[]
  methods: string
}

const corsOptions: CorsOptions = {
  origin: ['http://localhost:3000', 'http://localhost:5173'],
  optionsSuccessStatus: 200,
  allowedHeaders: ['Authorization', 'Content-Type'],
  methods: 'GET,POST,PUT,DELETE',
}

export default corsOptions
