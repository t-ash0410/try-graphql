import { db } from '@backend/lib/db'

const createUser = async (email: string, name: string) => {
  return await db.user.create({
    data: {
      email,
      name,
    },
  })
}

export { createUser }
