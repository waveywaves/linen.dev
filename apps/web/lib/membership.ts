import { Prisma } from '@prisma/client';
import prisma from '../client';

export const createMembership = async (
  membership: Prisma.membershipsCreateInput
) => {
  try {
    return await prisma.memberships.create({ data: membership });
  } catch (err: any) {
    if (
      err?.code === 'P2002' &&
      JSON.stringify(err?.meta) === '{"target":["usersId","channelsId"]}'
    ) {
      return 'ok';
    }
    throw err;
  }
};
