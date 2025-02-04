import type { auths } from '@prisma/client';

export default function createAuth(options?: Partial<auths>): auths {
  return {
    id: '1',
    createdAt: new Date(),
    email: 'john@doe.com',
    emailVerified: null,
    password: 'password',
    salt: 'salt',
    token: 'token',
    accountId: 'account-id',
    ...options,
  };
}
