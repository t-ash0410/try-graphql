import type { User } from '@prisma/client'

const dummyUser: User = {
  userId: 1,
  email: 'john-doe@example.com',
  name: 'John Doe',
  slackUserId: 'UXXXXX',
  slackTeamId: 'TXXXXX',
  createdAt: new Date(),
  updatedAt: new Date(),
}

export { dummyUser }
