class ConfigTest {
  env: string
  PORT: number
  API_BASE: string
  DATABASE_URL: string | undefined
  constructor() {
    this.env = 'test'
    this.PORT = Number(process.env.PORT)
    this.API_BASE = '/'
    this.DATABASE_URL = process.env.TEST_DATABASE_URL
  }
}

export default new ConfigTest()