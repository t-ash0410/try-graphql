import { beforeAll } from 'bun:test'
import { dummyUser } from '@backend-tests/fixtures'

beforeAll(async () => {
  await prisma.user.create({
    data: dummyUser,
  })

  console.info('\nInitialized test database')
})
