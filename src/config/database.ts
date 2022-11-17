// import { PrismaClient } from "@prisma/client";

// export const prisma = new PrismaClient();

import { PrismaClient } from '@prisma/client'

let db;

//check if we are running in production mode
if (process.env.NODE_ENV === 'production') {
  db = new PrismaClient()
} else {
//check if there is already a connection to th  e database
  if (!global.db) {
    global.db = new PrismaClient()
  }
  db = global.db
}

export { db };