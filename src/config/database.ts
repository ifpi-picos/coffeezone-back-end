import { PrismaClient } from '@prisma/client'
import { config } from './config'

const prisma = new PrismaClient({
    datasources: {
        db: {
            url: config.default.DATABASE_URL,
        },
    },
})

export const checkConnection = async () => await prisma.$queryRaw`SELECT 1`
export default prisma
