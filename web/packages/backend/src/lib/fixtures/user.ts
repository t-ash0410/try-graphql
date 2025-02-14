import type { User } from '@prisma/client'

const dummyUser: User = {
  userId: 1,
  name: 'John Doe',
  email: 'john-doe@example.com',
  slackTeamId: 'TXXXXX',
  slackUserId: 'UXXXXX',
  createdAt: new Date('2025-02-12T10:30:00'),
  updatedAt: new Date('2025-02-12T10:30:00'),
}

export { dummyUser }
