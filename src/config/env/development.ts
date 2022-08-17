class ConfigDevelopment {
  env: string
  PORT: number
  API_BASE: string
  DATABASE_URL: string | undefined
  constructor() {
    this.env = 'development'
    this.PORT = Number(process.env.PORT)
    this.API_BASE = '/'
    this.DATABASE_URL = process.env.DATABASE_URL
  }
}

export default new ConfigDevelopment()