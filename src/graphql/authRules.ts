import { prisma } from '~/utils/prisma';
import { Context } from './context';

export const authIsLoggedIn = (_: any, __: any, ctx: Context) => (ctx.user ? true : false);

export const authIsAdmin = (_: any, __: any, ctx: Context) => ctx.user.isAdmin;

export const authIsGroupOwner = async (_: any, args: any, ctx: Context) => {
  const group = await prisma.group.findFirst({
    where: { id: args.id },
    include: { owners: true },
  });
  // Check if the user is the owner of the group.
  const groupOwner = group?.owners.find((x) => x.id === ctx.user.id);
  // User must be logged in and own the group
  return !!ctx.user && !!groupOwner;
};

export const authIsHouseholdOwner = async (_: any, args: any, ctx: Context) => {
  const household = await prisma.household.findFirst({
    where: { id: args.id },
  });
  // Check if the user is the owner of the household.
  const householdOwner = household?.ownerId === ctx.user.id;
  // User must be logged in and own the household
  return !!ctx.user && householdOwner;
};
